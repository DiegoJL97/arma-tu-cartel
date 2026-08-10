-- Arma tu Cartel — esquema de la clasificacion (Cloudflare D1 / SQLite)
--
-- Aplicar con:
--   wrangler d1 execute arma-tu-cartel --remote --file=./api/schema.sql
--
-- Una sola tabla cubre la clasificacion semanal y la global:
--   - semanal: WHERE iso_week = ?
--   - global : mejor fila por client_id
--
-- Sobre privacidad: no se guarda la IP en claro, solo un hash con sal
-- (ip_hash) que se usa unicamente para limitar abuso. Ver purga al final.

CREATE TABLE IF NOT EXISTS scores (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  alias       TEXT    NOT NULL,           -- max 16 caracteres, ya filtrado
  country     TEXT    NOT NULL,           -- ISO 3166-1 alpha-2, mayusculas
  score       INTEGER NOT NULL,           -- 0..100
  genres      INTEGER NOT NULL,           -- 1..8
  attendance  INTEGER NOT NULL,           -- asistencia total sumada
  lineup      TEXT,                       -- JSON: los 10 nombres elegidos
  seed        TEXT,                       -- fase 2: semilla del RNG
  verified    INTEGER NOT NULL DEFAULT 0, -- fase 2: 1 si el servidor recalculo la puntuacion
  client_id   TEXT    NOT NULL,           -- uuid guardado en localStorage
  ip_hash     TEXT,                       -- SHA-256(ip + SALT), solo anti-abuso
  created_at  TEXT    NOT NULL,           -- ISO 8601 UTC
  iso_week    TEXT    NOT NULL            -- '2026-W33'
);

-- Tabla semanal: ordenar por puntuacion dentro de una semana.
CREATE INDEX IF NOT EXISTS idx_scores_week
  ON scores (iso_week, score DESC, created_at ASC);

-- Tabla global: ordenar por puntuacion.
CREATE INDEX IF NOT EXISTS idx_scores_score
  ON scores (score DESC, created_at ASC);

-- "Solo tu mejor cartel" y consulta de la posicion propia.
CREATE INDEX IF NOT EXISTS idx_scores_client
  ON scores (client_id, score DESC);

-- Rate limiting por IP.
CREATE INDEX IF NOT EXISTS idx_scores_ip_time
  ON scores (ip_hash, created_at DESC);

-- Purga periodica sugerida (no automatica): el ip_hash solo hace falta
-- mientras la fila es reciente. Ejecutar de vez en cuando para no
-- conservar identificadores mas tiempo del necesario:
--
--   UPDATE scores SET ip_hash = NULL
--   WHERE ip_hash IS NOT NULL AND created_at < datetime('now', '-30 days');
