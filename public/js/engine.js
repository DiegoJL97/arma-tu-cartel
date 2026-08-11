/**
 * Arma tu Cartel — motor de juego compartido (cliente + servidor).
 *
 * ES module real, sin build step: el navegador lo carga con
 * <script type="module">, y el Worker lo importa directamente (wrangler
 * ya empaqueta con esbuild al desplegar). Es la UNICA fuente de verdad
 * para el roster, la tabla de eventos, la formula de puntuacion, y el
 * generador aleatorio con semilla — si algo de esto cambia, cambia aqui
 * y solo aqui, para que cliente y servidor nunca puedan desincronizarse.
 *
 * Extraidos textualmente de public/js/app.js (nunca retranscritos a mano)
 * el array ARTISTS y el objeto SIM_EVENTS, para blindar contra errores de
 * transcripcion en los 108 artistas.
 */

export const ARTISTS = [
    {name:"Bad Bunny", genre:"Reggaetón", country:"PR", salary:14.0, attendance:85000, live:97},
    {name:"J Balvin", genre:"Urbano Pop", country:"CO", salary:9.5, attendance:65000, live:86},
    {name:"Daddy Yankee", genre:"Vieja Escuela", country:"PR", salary:9.0, attendance:60000, live:92},
    {name:"Karol G", genre:"Urbano Pop", country:"CO", salary:9.0, attendance:60000, live:88},
    {name:"Rauw Alejandro", genre:"Urbano Pop", country:"PR", salary:7.5, attendance:48500, live:85},
    {name:"Ozuna", genre:"Reggaetón Romántico", country:"PR", salary:6.0, attendance:45000, live:80},
    {name:"Farruko", genre:"Reggaetón", country:"PR", salary:4.5, attendance:32000, live:70},
    {name:"Don Omar", genre:"Vieja Escuela", country:"PR", salary:7.0, attendance:50000, live:80},
    {name:"Anuel AA", genre:"Trap", country:"PR", salary:6.0, attendance:43000, live:77},
    {name:"Myke Towers", genre:"Trap", country:"PR", salary:5.5, attendance:38000, live:77},
    {name:"Manuel Turizo", genre:"Urbano Pop", country:"CO", salary:4.5, attendance:35000, live:70},
    {name:"Feid", genre:"Reggaetón", country:"CO", salary:6.0, attendance:45000, live:79},
    {name:"Nicky Jam", genre:"Vieja Escuela", country:"PR", salary:4.0, attendance:33000, live:75},
    {name:"Quevedo", genre:"Reggaetón", country:"ES", salary:4.5, attendance:35500, live:77},
    {name:"Becky G", genre:"Urbano Pop", country:"US", salary:3.5, attendance:30000, live:75},
    {name:"Jhayco", genre:"Trap", country:"PR", salary:4.5, attendance:35000, live:75},
    {name:"Zion & Lennox", genre:"Vieja Escuela", country:"PR", salary:2.5, attendance:25000, live:68},
    {name:"Arcángel", genre:"Trap", country:"PR", salary:3.5, attendance:30000, live:79},
    {name:"Chencho Corleone", genre:"Vieja Escuela", country:"PR", salary:3.0, attendance:28000, live:70},
    {name:"Ñengo Flow", genre:"Trap", country:"PR", salary:2.5, attendance:25000, live:74},
    {name:"El Alfa", genre:"Dembow", country:"DO", salary:2.5, attendance:27500, live:74},
    {name:"De La Ghetto", genre:"Reggaetón", country:"PR", salary:2.0, attendance:22000, live:70},
    {name:"Sech", genre:"Urbano Pop", country:"PA", salary:2.0, attendance:22000, live:74},
    {name:"Justin Quiles", genre:"Reggaetón Romántico", country:"PR", salary:2.0, attendance:22000, live:68},
    {name:"Eladio Carrión", genre:"Trap", country:"PR", salary:3.5, attendance:29000, live:80},
    {name:"Darell", genre:"Reggaetón", country:"PR", salary:1.5, attendance:18000, live:65},
    {name:"Tito El Bambino", genre:"Vieja Escuela", country:"PR", salary:1.5, attendance:18000, live:68},
    {name:"Natti Natasha", genre:"Reggaetón Romántico", country:"DO", salary:2.0, attendance:22000, live:71},
    {name:"Cosculluela", genre:"Trap", country:"PR", salary:1.5, attendance:14000, live:70},
    {name:"Dalex", genre:"Reggaetón Romántico", country:"PR", salary:1.0, attendance:12500, live:58},
    {name:"Bad Gyal", genre:"Urbano Pop", country:"ES", salary:2.5, attendance:23000, live:74},
    {name:"Lunay", genre:"Reggaetón Romántico", country:"PR", salary:1.0, attendance:14000, live:60},
    {name:"Tokischa", genre:"Dembow", country:"DO", salary:1.0, attendance:15000, live:65},
    {name:"Ivy Queen", genre:"Vieja Escuela", country:"PR", salary:1.5, attendance:16333, live:73},
    {name:"Chimbala", genre:"Dembow", country:"DO", salary:0.5, attendance:14000, live:60},
    {name:"Yailin", genre:"Dembow", country:"DO", salary:0.5, attendance:5500, live:48},
    {name:"Alexis y Fido", genre:"Vieja Escuela", country:"PR", salary:1.0, attendance:12000, live:57},
    {name:"Maldy", genre:"Vieja Escuela", country:"PR", salary:0.5, attendance:12000, live:60},
    {name:"Omega El Fuerte", genre:"Dembow", country:"DO", salary:0.5, attendance:6000, live:59},
    {name:"Maluma", genre:"Urbano Pop", country:"CO", salary:6.5, attendance:50000, live:80},
    {name:"Anitta", genre:"Urbano Pop", country:"BR", salary:4.0, attendance:32500, live:78},
    {name:"Ovy On The Drums", genre:"Productores", country:"CO", salary:1.5, attendance:16500, live:70},
    {name:"Beéle", genre:"Urbano Pop", country:"CO", salary:3.5, attendance:31000, live:74},
    {name:"Cris Mj", genre:"Reggaetón", country:"CL", salary:3.0, attendance:30000, live:70},
    {name:"Omar Courtz", genre:"Nueva Escuela", country:"PR", salary:4.0, attendance:29000, live:76},
    {name:"Ryan Castro", genre:"Reggaetón", country:"CO", salary:3.5, attendance:28500, live:70},
    {name:"Danny Ocean", genre:"Urbano Pop", country:"VE", salary:3.0, attendance:28000, live:66},
    {name:"Bizarrap", genre:"Productores", country:"AR", salary:4.5, attendance:38000, live:81},
    {name:"Tainy", genre:"Productores", country:"PR", salary:2.0, attendance:16000, live:75},
    {name:"Yandel", genre:"Vieja Escuela", country:"PR", salary:3.5, attendance:27000, live:78},
    {name:"Blessd", genre:"Reggaetón", country:"CO", salary:2.0, attendance:18000, live:70},
    {name:"El Bogueto", genre:"Reggaetón", country:"MX", salary:1.0, attendance:15000, live:63},
    {name:"Jay Wheeler", genre:"Reggaetón Romántico", country:"PR", salary:3.0, attendance:22000, live:76},
    {name:"Rels B", genre:"Urbano Pop", country:"ES", salary:3.0, attendance:28000, live:72},
    {name:"Kapo", genre:"Urbano Pop", country:"CO", salary:2.0, attendance:24000, live:67},
    {name:"Young Miko", genre:"Nueva Escuela", country:"PR", salary:3.0, attendance:26500, live:73},
    {name:"Zion", genre:"Vieja Escuela", country:"PR", salary:2.0, attendance:17500, live:68},
    {name:"Lenny Tavárez", genre:"Reggaetón Romántico", country:"PR", salary:2.0, attendance:17000, live:69},
    {name:"Jowell & Randy", genre:"Vieja Escuela", country:"PR", salary:2.5, attendance:20000, live:74},
    {name:"Yung Beef", genre:"Trap", country:"ES", salary:1.0, attendance:16000, live:64},
    {name:"Wisin", genre:"Vieja Escuela", country:"PR", salary:3.0, attendance:24500, live:71},
    {name:"Dei V", genre:"Nueva Escuela", country:"PR", salary:3.0, attendance:28000, live:68},
    {name:"Mora", genre:"Nueva Escuela", country:"PR", salary:4.0, attendance:30500, live:78},
    {name:"Noriel", genre:"Trap", country:"PR", salary:1.5, attendance:16000, live:61},
    {name:"De La Rose", genre:"Trap", country:"PR", salary:2.5, attendance:23000, live:68},
    {name:"Paulo Londra", genre:"Trap", country:"AR", salary:3.0, attendance:26000, live:72},
    {name:"Maria Becerra", genre:"Urbano Pop", country:"AR", salary:3.0, attendance:29000, live:75},
    {name:"Cazzu", genre:"Trap", country:"AR", salary:1.5, attendance:18000, live:70},
    {name:"Bryant Myers", genre:"Trap", country:"PR", salary:1.5, attendance:18500, live:66},
    {name:"TINI", genre:"Urbano Pop", country:"AR", salary:3.0, attendance:28500, live:75},
    {name:"Caleb Calloway", genre:"Productores", country:"PR", salary:1.0, attendance:12000, live:65},
    {name:"Randy", genre:"Vieja Escuela", country:"PR", salary:2.0, attendance:19500, live:70},
    {name:"Duki", genre:"Trap", country:"AR", salary:4.0, attendance:33500, live:77},
    {name:"Nicki Nicole", genre:"Urbano Pop", country:"AR", salary:2.0, attendance:21500, live:73},
    {name:"Luar La L", genre:"Trap", country:"PR", salary:1.5, attendance:15500, live:65},
    {name:"Emilia", genre:"Urbano Pop", country:"AR", salary:3.0, attendance:25500, live:74},
    {name:"Boza", genre:"Reggaetón", country:"PA", salary:1.0, attendance:12500, live:62},
    {name:"Lyanno", genre:"Reggaetón Romántico", country:"PR", salary:1.0, attendance:15000, live:63},
    {name:"Trueno", genre:"Trap", country:"AR", salary:2.5, attendance:22500, live:73},
    {name:"Morad", genre:"Trap", country:"ES", salary:1.5, attendance:19000, live:66},
    {name:"Brray", genre:"Trap", country:"PR", salary:1.0, attendance:14000, live:61},
    {name:"Jory Boy", genre:"Vieja Escuela", country:"PR", salary:1.0, attendance:12000, live:59},
    {name:"Nio García", genre:"Reggaetón", country:"PR", salary:1.0, attendance:16000, live:62},
    {name:"Clarent", genre:"Trap", country:"ES", salary:1.5, attendance:15500, live:61},
    {name:"Alvaro Diaz", genre:"Urbano Pop", country:"PR", salary:2.5, attendance:19500, live:74},
    {name:"Guaynaa", genre:"Reggaetón", country:"PR", salary:1.0, attendance:15000, live:60},
    {name:"Villano Antillano", genre:"Trap", country:"PR", salary:1.0, attendance:18000, live:66},
    {name:"El Cherry Scom", genre:"Dembow", country:"DO", salary:0.5, attendance:12000, live:55},
    {name:"Kevin Roldan", genre:"Reggaetón", country:"CO", salary:0.5, attendance:12000, live:56},
    {name:"Miky Woodz", genre:"Trap", country:"PR", salary:1.0, attendance:15000, live:62},
    {name:"Rochy RD", genre:"Dembow", country:"DO", salary:0.5, attendance:14000, live:56},
    {name:"Saiko", genre:"Urbano Pop", country:"ES", salary:2.5, attendance:22750, live:70},
    {name:"Mozart La Para", genre:"Dembow", country:"DO", salary:0.5, attendance:12000, live:55},
    {name:"Juanka", genre:"Trap", country:"PR", salary:0.5, attendance:9000, live:51},
    {name:"Gigolo y La Exce", genre:"Vieja Escuela", country:"PR", salary:0.5, attendance:7000, live:59},
    {name:"Beny Jr", genre:"Trap", country:"ES", salary:1.0, attendance:15000, live:61},
    {name:"Fuego", genre:"Reggaetón", country:"DO", salary:0.5, attendance:8000, live:50},
    {name:"Almighty", genre:"Trap", country:"PR", salary:1.0, attendance:14500, live:62},
    {name:"Nacho", genre:"Reggaetón Romántico", country:"VE", salary:1.5, attendance:14000, live:64},
    {name:"J Álvarez", genre:"Vieja Escuela", country:"PR", salary:1.5, attendance:14000, live:67},
    {name:"Casper Mágico", genre:"Reggaetón", country:"PR", salary:1.0, attendance:13500, live:56},
    {name:"Kendo Kaponi", genre:"Vieja Escuela", country:"PR", salary:1.5, attendance:13500, live:63},
    {name:"Baby Rasta y Gringo", genre:"Vieja Escuela", country:"PR", salary:1.0, attendance:11000, live:62},
    {name:"Khea", genre:"Trap", country:"AR", salary:1.5, attendance:18000, live:63},
    {name:"DJ Luian", genre:"Productores", country:"PR", salary:1.0, attendance:8500, live:55},
    {name:"Farina", genre:"Urbano Pop", country:"CO", salary:1.0, attendance:7500, live:60},
    {name:"Franco El Gorila", genre:"Reggaetón", country:"PR", salary:1.0, attendance:11000, live:56},
    {name:"Corina Smith", genre:"Urbano Pop", country:"VE", salary:1.0, attendance:10000, live:65}
  ];

export const TOTAL_ROUNDS = 10;
export const BUDGET = 30; // $M — objetivo: gastarlo todo sin pasarte
export const GENRE_COUNT = 8; // + Productores

export const SIM_EVENTS = {
    artistLate: { sentiment:'negative', text:{ es:'{name} sale con 10 minutos de retraso.', en:'{name} comes on 10 minutes late.' }, delta:-6 },
    technicalFail: {
      sentiment:'negative', decision:true,
      text:{ es:'Falla el sonido justo en pleno estribillo. El técnico pide unos minutos.', en:'The sound cuts out right in the middle of the chorus. The tech asks for a few minutes.' },
      options: [
        { label:{ es:'Parar 5 min', en:'Stop for 5 min' }, delta:-4, resultText:{ es:'Paran el show, lo arreglan y retoman con el público algo frío.', en:"They stop the show, fix it, and come back to a crowd that's cooled off a bit." } },
        { label:{ es:'Seguir adelante', en:'Push through' }, delta:-10, resultText:{ es:'Siguen con el fallo de fondo, el público se queja.', en:'They push on with the glitch in the background, the crowd complains.' } }
      ]
    },
    powerCut: { sentiment:'negative', text:{ es:'Corte de luz de unos segundos en pleno show.', en:'A few seconds of power outage mid-show.' }, delta:-8 },
    entranceJam: { sentiment:'negative', text:{ es:'Problemas de aforo en la entrada retrasan el arranque.', en:'Capacity issues at the entrance delay the start.' }, delta:-5 },
    rainStorm: { sentiment:'negative', text:{ es:'Un diluvio cae a mitad de show y el sonido se resiente.', en:'A downpour hits mid-show and the sound takes a hit.' }, delta:-7 },
    egoClash: {
      sentiment:'negative', decision:true, needsOther:true,
      text:{ es:'Pelea de egos entre {name} y {other} en backstage, se nota la tensión en el escenario.', en:'An ego clash between {name} and {other} backstage, and the tension shows onstage.' },
      options: [
        { label:{ es:'Calmar los ánimos', en:'Smooth things over' }, delta:-5, resultText:{ es:'Se calman las cosas, el show sigue algo tocado.', en:'Things calm down, but the show is a bit shaken.' } },
        { label:{ es:'Dejar que estalle', en:'Let it blow up' }, delta:-13, resultText:{ es:'La tensión se nota demasiado y el show se resiente.', en:'The tension is too obvious and the show suffers.' } }
      ]
    },
    viralMoment: {
      sentiment:'positive', decision:true,
      text:{ es:'Un momento de {name} se hace viral en redes al instante.', en:'A moment from {name} goes viral online instantly.' },
      options: [
        { label:{ es:'Compartirlo ya', en:'Share it now' }, delta:8, resultText:{ es:'Lo comparten en el momento, el hype sube rápido pero se diluye para el resto del show.', en:'They share it right away, hype spikes fast but fades for the rest of the show.' } },
        { label:{ es:'Esperar el mejor momento', en:'Wait for the best moment' }, delta:12, resultText:{ es:'Esperan al momento justo para soltarlo y el efecto es mucho mayor.', en:'They wait for the perfect moment to drop it and the effect is much bigger.' } }
      ]
    },
    crowdSings: { sentiment:'positive', text:{ es:'El público corea cada palabra del tema principal.', en:'The crowd sings along to every word of the headline track.' }, delta:7 },
    perfectNight: { sentiment:'positive', text:{ es:'Noche despejada, sonido perfecto, todo encaja.', en:'Clear night, perfect sound, everything clicks.' }, delta:5 },
    rainStops: { sentiment:'positive', text:{ es:'Empieza a llover pero para justo a tiempo para el show.', en:'It starts raining but stops just in time for the show.' }, delta:4 },
    surpriseCollab: { sentiment:'positive', needsOther:true, text:{ es:'{name} invita a {other} a subir al escenario por sorpresa.', en:'{name} brings {other} onstage for a surprise collab.' }, delta:8 }
  };
export const SIM_POSITIVE_KEYS = ['viralMoment', 'crowdSings', 'perfectNight', 'rainStops', 'surpriseCollab'];
export const SIM_NEGATIVE_KEYS = ['artistLate', 'technicalFail', 'powerCut', 'entranceJam', 'rainStorm', 'egoClash'];

/* ---------------- RNG con semilla (mulberry32) ----------------
 * Determinista: la misma semilla produce siempre la misma secuencia,
 * en cualquier maquina, cliente o servidor. Solo se usa para lo que
 * afecta al resultado (barajado del roster, tirada de eventos) — el
 * confeti, el efecto "tragaperras" de las tarjetas y las notificaciones
 * sociales siguen con Math.random() normal, no hace falta ni conviene
 * que consuman de este flujo (mezclarían efectos cosmeticos con la
 * reproducibilidad del resultado). */

function mulberry32(seed){
  var t = seed >>> 0;
  return function(){
    t |= 0; t = (t + 0x6D2B79F5) | 0;
    var r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a: convierte la semilla (string legible, ej. "8f3a91c2") en el
// entero de 32 bits que necesita mulberry32.
function hashSeedToInt(seedStr){
  var h = 2166136261 >>> 0;
  var s = String(seedStr);
  for(var i = 0; i < s.length; i++){
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function createRng(seedStr){
  return mulberry32(hashSeedToInt(seedStr));
}

// Genera una semilla nueva, legible, para arrancar una partida real.
// No necesita ser criptograficamente fuerte (no es un secreto, solo
// tiene que variar de partida en partida): crypto si esta disponible,
// Math.random como red de seguridad.
export function generateSeed(){
  try {
    if(typeof crypto !== 'undefined' && crypto.getRandomValues){
      var buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0].toString(16).padStart(8, '0');
    }
  } catch(e){}
  return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0');
}

// Fisher-Yates con el rng inyectado, mismo algoritmo que el shuffle()
// original de app.js, solo que parametrizado.
export function shuffleWithRng(arr, rng){
  var a = arr.slice();
  for(var i = a.length - 1; i > 0; i--){
    var j = Math.floor(rng() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

// Equivalente con semilla de pickRandom(arr) para un array ya filtrado.
function pickWithRng(arr, rng){
  return arr[Math.floor(rng() * arr.length)];
}

// Misma logica que simRollEventKey() de app.js, con el rng inyectado.
export function rollEventKeyWithRng(artist, index, rng){
  if(rng() > 0.55) return null;
  var positiveChance = Math.max(0.30, Math.min(0.80, 0.48 + (artist.live - 55) * 0.008));
  var sentiment = rng() < positiveChance ? 'positive' : 'negative';
  var pool = (sentiment === 'positive' ? SIM_POSITIVE_KEYS : SIM_NEGATIVE_KEYS).filter(function(key){
    return !SIM_EVENTS[key].needsOther || index > 0;
  });
  if(!pool.length) return null;
  return pickWithRng(pool, rng);
}

// El orden de la simulacion NO es el orden de fichaje: startSimulation()
// reordena por sueldo ascendente. Se extrae aqui para que el cliente
// (interactivo) y el replay del servidor (en bloque) usen exactamente
// el mismo criterio.
export function buildSimOrder(lineup){
  return lineup.slice().sort(function(a, b){ return a.salary - b.salary; });
}

// Formula de puntuacion, extraida tal cual de showResult() en app.js.
// hypeFinal se pasa ya calculado (viene de recorrer buildSimOrder con
// rollEventKeyWithRng + las decisiones del jugador).
export function computeFinalScore(lineup, hypeFinal){
  var totalAttendance = lineup.reduce(function(s, a){ return s + a.attendance; }, 0);
  var avgLive = Math.round(lineup.reduce(function(s, a){ return s + a.live; }, 0) / lineup.length);
  var totalSalary = lineup.reduce(function(s, a){ return s + a.salary; }, 0);
  var genresUsed = [];
  lineup.forEach(function(a){ if(genresUsed.indexOf(a.genre) === -1) genresUsed.push(a.genre); });

  var attendanceScore = Math.min(100, totalAttendance / 300000 * 100);
  var liveScore = avgLive;
  var genreScore = (genresUsed.length / GENRE_COUNT) * 100;
  var hypeScore = hypeFinal;
  var base = 0.25 * attendanceScore + 0.25 * liveScore + 0.20 * genreScore + 0.30 * hypeScore;

  var overBudget = totalSalary > BUDGET;
  var budgetAdjustment = overBudget
    ? -Math.round((totalSalary - BUDGET) * 2.5)
    : Math.round((totalSalary / BUDGET) * 8);

  var finalScore = Math.max(0, Math.min(100, Math.round(base) + budgetAdjustment));

  return {
    finalScore: finalScore,
    totalAttendance: totalAttendance,
    avgLive: avgLive,
    totalSalary: totalSalary,
    genresUsedCount: genresUsed.length,
    overBudget: overBudget
  };
}

/**
 * Reproduccion completa y determinista de una partida a partir de
 * (seed, picks, decisions) — sin UI, sin animaciones, de un tiron.
 * Es lo que usa el Worker para calcular la puntuacion de verdad en vez
 * de fiarse de lo que mande el cliente; tambien sirve para el test que
 * compara el resultado del cliente contra este replay.
 *
 * picks: 10 enteros (0..2), que tarjeta se eligio en cada ronda.
 * decisions: N enteros (0..num_opciones-1), en el orden en que se
 *   encuentran los eventos de decision durante la simulacion. N lo
 *   determina la propia partida (no lo dice el cliente) — si no
 *   coincide exactamente, se considera invalida.
 */
export function playGame(seed, picks, decisions){
  if(!Array.isArray(picks) || picks.length !== TOTAL_ROUNDS){
    throw new Error('bad_picks');
  }
  var decisionsArr = Array.isArray(decisions) ? decisions : [];

  var rng = createRng(seed);
  var pool = shuffleWithRng(ARTISTS, rng);
  var lineup = [];
  for(var round = 0; round < TOTAL_ROUNDS; round++){
    var choices = pool.splice(0, 3);
    var idx = picks[round];
    if(!Number.isInteger(idx) || idx < 0 || idx >= choices.length){
      throw new Error('bad_pick_index');
    }
    lineup.push(choices[idx]);
  }

  var simOrder = buildSimOrder(lineup);
  var hype = 40;
  var decisionCursor = 0;

  for(var i = 0; i < simOrder.length; i++){
    var artist = simOrder[i];
    var baseDelta = Math.round((artist.live - 50) / 5);
    var eventKey = rollEventKeyWithRng(artist, i, rng);
    var def = eventKey ? SIM_EVENTS[eventKey] : null;
    var totalDelta = baseDelta;
    if(def){
      if(def.decision){
        var chosen = decisionsArr[decisionCursor];
        if(!Number.isInteger(chosen) || chosen < 0 || chosen >= def.options.length){
          throw new Error('bad_decision_index');
        }
        totalDelta += def.options[chosen].delta;
        decisionCursor++;
      } else {
        totalDelta += def.delta;
      }
    }
    hype = Math.max(0, Math.min(100, hype + totalDelta));
  }

  if(decisionsArr.length !== decisionCursor){
    throw new Error('bad_decisions_length');
  }

  var scored = computeFinalScore(lineup, hype);

  return {
    score: scored.finalScore,
    hypeFinal: hype,
    genres: scored.genresUsedCount,
    attendance: scored.totalAttendance,
    totalSalary: scored.totalSalary,
    overBudget: scored.overBudget,
    lineupNames: lineup.map(function(a){ return a.name; })
  };
}
