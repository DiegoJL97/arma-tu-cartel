/**
 * Arma tu Cartel — API de la clasificacion (Cloudflare Worker + D1)
 *
 *   GET  /api/leaderboard?scope=week|global&limit=10&client=<uuid>
 *   POST /api/score        { alias, country, seed, picks, decisions, clientId }
 *
 * Fase 2: el cliente ya no manda la puntuacion. Manda la semilla de la
 * partida y las elecciones del jugador (picks/decisions), y este Worker
 * reproduce la partida entera con el mismo motor que el cliente
 * (public/js/engine.js, importado tal cual, sin duplicar logica) para
 * calcular la puntuacion de verdad. Todas las filas nuevas quedan con
 * verified=1; las de fase 1 (score auto-declarado) se quedan como estan.
 *
 * Variables de entorno:
 *   IP_SALT       sal para hashear la IP (obligatoria, wrangler secret put)
 *   ALLOW_ORIGINS lista separada por comas; '*' para abrir del todo
 */

import * as Engine from '../public/js/engine.js';

const MAX_ALIAS = 16;
const TOP_LIMIT_MAX = 50;
const MAX_BODY_BYTES = 4096;

// Limites de envio. La primera barrera real deberia ser una regla de rate
// limiting en el panel de Cloudflare; esto es la red de seguridad.
const RATE_PER_CLIENT_HOUR = 20;
const RATE_PER_IP_HOUR = 60;

// Filtro minimo de alias. Ampliar: esto se muestra a otros usuarios.
const BLOCKLIST = [
  'puta', 'puto', 'mierda', 'joder', 'cabron', 'gilipollas', 'polla',
  'maricon', 'zorra', 'fuck', 'shit', 'bitch', 'cunt', 'nigger', 'faggot',
  'hitler', 'nazi', 'admin', 'moderador'
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    try {
      if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
        return json(await getLeaderboard(url, env), 200, cors);
      }
      if (url.pathname === '/api/score' && request.method === 'POST') {
        return json(await postScore(request, env), 200, cors);
      }
      return json({ error: 'not_found' }, 404, cors);
    } catch (err) {
      if (err instanceof ApiError) {
        return json({ error: err.code, detail: err.detail }, err.status, cors);
      }
      console.error('unhandled', err && err.stack ? err.stack : err);
      return json({ error: 'internal' }, 500, cors);
    }
  }
};

/* ---------------- errores ---------------- */

class ApiError extends Error {
  constructor(status, code, detail) {
    super(code);
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

/* ---------------- CORS ---------------- */

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allow = (env.ALLOW_ORIGINS || '*').split(',').map(s => s.trim());
  const ok = allow.includes('*') || allow.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? (origin || '*') : 'null',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors }
  });
}

/* ---------------- semana ISO ---------------- */

// Semana ISO 8601: la semana 1 es la que contiene el primer jueves del anyo.
function isoWeekOf(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;          // lunes=1 ... domingo=7
  d.setUTCDate(d.getUTCDate() + 4 - day);  // al jueves de esta semana
  const year = d.getUTCFullYear();
  const jan1 = Date.UTC(year, 0, 1);
  const week = Math.ceil(((d.getTime() - jan1) / 86400000 + 1) / 7);
  return year + '-W' + String(week).padStart(2, '0');
}

// Lunes 00:00 UTC siguiente: alimenta la cuenta atras de la vista semanal.
function nextWeekResetISO(now) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + (8 - day));
  return d.toISOString();
}

/* ---------------- lectura ---------------- */

// SQLite devuelve, para las columnas sueltas de un GROUP BY con MAX(), los
// valores de la fila que produjo ese maximo. Es lo que permite quedarse con
// el mejor cartel de cada jugador sin subconsultas.
const DEDUP_WEEK = `
  SELECT client_id, alias, country, MAX(score) AS score, genres, attendance, created_at
  FROM scores WHERE iso_week = ?1 GROUP BY client_id`;

const DEDUP_GLOBAL = `
  SELECT client_id, alias, country, MAX(score) AS score, genres, attendance, created_at
  FROM scores GROUP BY client_id`;

async function getLeaderboard(url, env) {
  const scope = url.searchParams.get('scope') === 'global' ? 'global' : 'week';
  const clientId = (url.searchParams.get('client') || '').slice(0, 64);
  let limit = parseInt(url.searchParams.get('limit') || '10', 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 10;
  if (limit > TOP_LIMIT_MAX) limit = TOP_LIMIT_MAX;

  const now = new Date();
  const week = isoWeekOf(now);
  const dedup = scope === 'global' ? DEDUP_GLOBAL : DEDUP_WEEK;
  const args = scope === 'global' ? [] : [week];
  const next = args.length + 1;

  const top = await env.DB
    .prepare(`SELECT * FROM (${dedup}) ORDER BY score DESC, created_at ASC LIMIT ?${next}`)
    .bind(...args, limit)
    .all();

  const totalRow = await env.DB
    .prepare(`SELECT COUNT(*) AS n FROM (${dedup})`)
    .bind(...args)
    .first();
  const total = totalRow ? totalRow.n : 0;

  let me = null;
  if (clientId) {
    const mine = await env.DB
      .prepare(`SELECT * FROM (${dedup}) WHERE client_id = ?${next}`)
      .bind(...args, clientId)
      .first();
    if (mine) {
      const better = await env.DB
        .prepare(`SELECT COUNT(*) AS n FROM (${dedup}) WHERE score > ?${next}`)
        .bind(...args, mine.score)
        .first();
      me = shapeRow(mine, (better ? better.n : 0) + 1);
      me.percentile = percentileOf(me.rank, total);
    }
  }

  return {
    scope,
    isoWeek: scope === 'week' ? week : null,
    resetsAt: scope === 'week' ? nextWeekResetISO(now) : null,
    total,
    top: (top.results || []).map((r, i) => shapeRow(r, i + 1)),
    me
  };
}

function shapeRow(r, rank) {
  return {
    rank,
    alias: r.alias,
    country: r.country,
    score: r.score,
    genres: r.genres,
    attendance: r.attendance,
    createdAt: r.created_at,
    clientId: r.client_id
  };
}

// Percentil superior redondeado hacia arriba: rank 5 de 500 -> "top 1%".
function percentileOf(rank, total) {
  if (!total || total < 1) return null;
  return Math.max(1, Math.ceil((rank / total) * 100));
}

/* ---------------- escritura ---------------- */

async function postScore(request, env) {
  if (!env.IP_SALT) throw new ApiError(500, 'missing_salt');

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) throw new ApiError(413, 'body_too_large');

  let body;
  try { body = JSON.parse(raw); }
  catch (e) { throw new ApiError(400, 'bad_json'); }

  const alias = sanitizeAlias(body.alias);
  const country = sanitizeCountry(body.country);
  const seed = sanitizeSeed(body.seed);
  const picks = sanitizePicks(body.picks);
  const decisions = sanitizeDecisions(body.decisions);
  const clientId = sanitizeClientId(body.clientId);

  // Reproduce la partida entera server-side: la puntuacion, generos,
  // asistencia y lineup salen todos de aqui, nunca de lo que mande el
  // cliente.
  let result;
  try {
    result = Engine.playGame(seed, picks, decisions);
  } catch (e) {
    throw new ApiError(400, 'bad_game', e.message);
  }

  const ipHash = await hashIp(request.headers.get('CF-Connecting-IP') || '', env.IP_SALT);
  await enforceRateLimits(env, clientId, ipHash);

  const now = new Date();
  await env.DB.prepare(
    `INSERT INTO scores
       (alias, country, score, genres, attendance, lineup, seed, verified, client_id, ip_hash, created_at, iso_week)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 1, ?8, ?9, ?10, ?11)`
  ).bind(
    alias, country, result.score, result.genres, result.attendance,
    JSON.stringify(result.lineupNames), seed,
    clientId, ipHash, now.toISOString(), isoWeekOf(now)
  ).run();

  // Devolvemos la posicion ya recalculada para que el cliente pueda
  // enseniarla sin una segunda peticion.
  const url = new URL(request.url);
  url.searchParams.set('scope', 'week');
  url.searchParams.set('client', clientId);
  const board = await getLeaderboard(url, env);

  return {
    ok: true,
    rank: board.me ? board.me.rank : null,
    total: board.total,
    percentile: board.me ? board.me.percentile : null
  };
}

async function enforceRateLimits(env, clientId, ipHash) {
  const since = new Date(Date.now() - 3600 * 1000).toISOString();

  const byClient = await env.DB
    .prepare('SELECT COUNT(*) AS n FROM scores WHERE client_id = ?1 AND created_at > ?2')
    .bind(clientId, since).first();
  if (byClient && byClient.n >= RATE_PER_CLIENT_HOUR) {
    throw new ApiError(429, 'rate_limited', 'client');
  }

  if (ipHash) {
    const byIp = await env.DB
      .prepare('SELECT COUNT(*) AS n FROM scores WHERE ip_hash = ?1 AND created_at > ?2')
      .bind(ipHash, since).first();
    if (byIp && byIp.n >= RATE_PER_IP_HOUR) {
      throw new ApiError(429, 'rate_limited', 'ip');
    }
  }
}

/* ---------------- saneado ---------------- */

const CONTROL_CHARS = new RegExp('[\\u0000-\\u001F\\u007F]', 'g');
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036F]', 'g');

function sanitizeAlias(value) {
  if (typeof value !== 'string') throw new ApiError(400, 'bad_alias');
  // Sin caracteres de control ni saltos de linea, y espacios colapsados.
  let alias = value.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim();
  if (alias.length < 2) throw new ApiError(400, 'alias_too_short');
  alias = Array.from(alias).slice(0, MAX_ALIAS).join('');
  if (!isAliasAllowed(alias)) throw new ApiError(400, 'alias_rejected');
  return alias;
}

function isAliasAllowed(alias) {
  const flat = alias
    .toLowerCase()
    .normalize('NFD').replace(COMBINING_MARKS, '')  // quita acentos
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/[^a-z0-9]/g, '');                     // deja letras y digitos
  return !BLOCKLIST.some(bad => flat.indexOf(bad) !== -1);
}

function sanitizeCountry(value) {
  if (typeof value !== 'string') throw new ApiError(400, 'bad_country');
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) throw new ApiError(400, 'bad_country');
  return code;
}

function sanitizeClientId(value) {
  if (typeof value !== 'string') throw new ApiError(400, 'bad_client');
  const id = value.trim();
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) throw new ApiError(400, 'bad_client');
  return id;
}

function sanitizeSeed(value) {
  if (typeof value !== 'string') throw new ApiError(400, 'bad_seed');
  const seed = value.trim();
  if (!seed || seed.length > 64) throw new ApiError(400, 'bad_seed');
  return seed;
}

// Rango de tarjeta (0..2): la validacion exacta contra la partida real
// (indice fuera de las opciones disponibles esa ronda) la hace playGame().
function sanitizePicks(value) {
  if (!Array.isArray(value) || value.length !== Engine.TOTAL_ROUNDS) {
    throw new ApiError(400, 'bad_picks');
  }
  return value.map(n => {
    if (!Number.isInteger(n) || n < 0 || n > 2) throw new ApiError(400, 'bad_picks');
    return n;
  });
}

// Cuantas decisiones hacen falta (y el rango exacto de cada una) lo decide
// la partida real dentro de playGame(); aqui solo se descarta basura obvia.
function sanitizeDecisions(value) {
  if (value == null) return [];
  if (!Array.isArray(value) || value.length > Engine.TOTAL_ROUNDS) {
    throw new ApiError(400, 'bad_decisions');
  }
  return value.map(n => {
    if (!Number.isInteger(n) || n < 0 || n > 9) throw new ApiError(400, 'bad_decisions');
    return n;
  });
}

async function hashIp(ip, salt) {
  if (!ip) return null;
  const data = new TextEncoder().encode(salt + '|' + ip);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}
