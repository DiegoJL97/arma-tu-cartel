(function(){

  /* ---------- analytics ---------- */
  function trackEvent(name){
    if(window.goatcounter && typeof window.goatcounter.count === 'function'){
      window.goatcounter.count({ path: name, title: name, event: true });
    }
  }

  /* ---------- i18n ---------- */
  var LANG_KEY = 'armaTuCartelLang';
  var currentLang = 'es';
  try {
    var storedLang = window.localStorage.getItem(LANG_KEY);
    if(storedLang === 'es' || storedLang === 'en') currentLang = storedLang;
  } catch(e){}

  var TRANSLATIONS = {
    es: {
      pageTitle: 'Arma tu Cartel',
      brand: 'Arma tu Cartel',
      landing: {
        collageCaption: 'Elige entre más de 100 artistas reales del género urbano',
        step1Title: '1. Arma tu lineup',
        step1Body: 'Elige un artista de 3 cada ronda, sin pasarte del presupuesto.',
        step2Title: '2. Vive la simulación',
        step2Body: 'Cada show puede salir bien... o torcerse. Tú decides en directo.',
        step3Title: '3. Consigue tu cartel',
        step3Body: 'Descubre tu puntuación y descarga el póster de tu festival.',
        startBtn: 'Empezar a jugar',
        disclaimer: 'Juego de fans con fines de entretenimiento, sin relación oficial con los artistas, sus representantes o discográficas. Los datos de sueldo, aforo y directo son ficticios y solo sirven para la mecánica del juego. Las imágenes son ilustraciones generadas por IA, no fotografías reales. Nombres e imágenes pertenecen a sus respectivos propietarios.'
      },
      game: {
        sectionTitle: 'Elige un artista',
        round: 'Ronda',
        myLineup: 'Mi lineup',
        sidebarEmpty: 'Aún no has fichado a nadie.'
      },
      loading: {
        calculating: 'Calculando tu lineup...',
        closing: 'Cartel cerrado. Preparando la simulación en directo...',
        finalResult: 'Calculando el resultado final...'
      },
      sim: {
        round: 'Concierto',
        liveBadge: 'Simulación en directo',
        hypeLabel: 'HYPE DEL PÚBLICO',
        skipBtn: 'Saltar simulación »',
        noEvent: 'SIN SOBRESALTOS',
        noEventText: 'Set sólido, sin incidencias.',
        eventLabel: 'EVENTO EN DIRECTO',
        decisionLabel: 'DECISIÓN REQUERIDA',
        decisionHint: 'Elige una opción para continuar'
      },
      stat: {
        sueldo: 'SUELDO',
        asistencia: 'ASISTENCIA',
        showEnVivo: 'SHOW EN VIVO',
        hypeFinal: 'HYPE FINAL',
        asistenciaTotal: '🎟️ ASISTENCIA TOTAL',
        generos: '🎨 GÉNEROS',
        presupuesto: '💰 PRESUPUESTO'
      },
      aria: { elegir: 'Elegir' },
      tier: {
        legendario: 'CARTEL LEGENDARIO',
        lujo: 'CARTEL DE LUJO',
        bueno: 'BUEN CARTEL',
        discreto: 'CARTEL DISCRETO',
        desastre: 'DESASTRE DE FESTIVAL'
      },
      record: {
        new: '🏆 ¡Nuevo récord personal!',
        vsPrevious: 'respecto a tu anterior récord',
        yourRecord: '🏆 Tu récord:'
      },
      result: {
        eyebrow: 'Resultado',
        title: 'Tu Cartel',
        posterAlt: 'Póster de tu cartel',
        downloadBtn: '⬇️ Descargar imagen',
        shareBtn: '📲 Compartir imagen',
        playAgainBtn: '🔄 Jugar de nuevo',
        suggestionBtn: '📧 Enviar sugerencia'
      },
      mailto: { subject: 'Sugerencia - Arma tu Cartel' },
      poster: { title: 'ARMA TU CARTEL' },
      share: { myLineup: 'Mi cartel' }
    },
    en: {
      pageTitle: 'Build Your Lineup',
      brand: 'Build Your Lineup',
      landing: {
        collageCaption: 'Choose from over 100 real urban genre artists',
        step1Title: '1. Build your lineup',
        step1Body: 'Pick one artist from 3 each round, without going over budget.',
        step2Title: '2. Live the simulation',
        step2Body: 'Every show can go great... or go wrong. You decide live.',
        step3Title: '3. Get your lineup',
        step3Body: 'Find out your score and download your festival poster.',
        startBtn: 'Start playing',
        disclaimer: 'Fan-made game for entertainment purposes, not affiliated with or endorsed by the artists, their management or record labels. Salary, attendance and live-show figures are fictional and exist only for gameplay. All artwork is AI-generated illustration, not real photography. All names and images belong to their respective owners.'
      },
      game: {
        sectionTitle: 'Pick an artist',
        round: 'Round',
        myLineup: 'My lineup',
        sidebarEmpty: "You haven't signed anyone yet."
      },
      loading: {
        calculating: 'Calculating your lineup...',
        closing: 'Lineup locked in. Preparing the live simulation...',
        finalResult: 'Calculating final result...'
      },
      sim: {
        round: 'Concert',
        liveBadge: 'Live simulation',
        hypeLabel: 'CROWD HYPE',
        skipBtn: 'Skip simulation »',
        noEvent: 'SMOOTH SAILING',
        noEventText: 'Solid set, no incidents.',
        eventLabel: 'LIVE EVENT',
        decisionLabel: 'DECISION REQUIRED',
        decisionHint: 'Choose an option to continue'
      },
      stat: {
        sueldo: 'FEE',
        asistencia: 'ATTENDANCE',
        showEnVivo: 'LIVE SHOW',
        hypeFinal: 'FINAL HYPE',
        asistenciaTotal: '🎟️ TOTAL ATTENDANCE',
        generos: '🎨 GENRES',
        presupuesto: '💰 BUDGET'
      },
      aria: { elegir: 'Choose' },
      tier: {
        legendario: 'LEGENDARY LINEUP',
        lujo: 'LUXURY LINEUP',
        bueno: 'GREAT LINEUP',
        discreto: 'DECENT LINEUP',
        desastre: 'FESTIVAL DISASTER'
      },
      record: {
        new: '🏆 New personal record!',
        vsPrevious: 'vs your previous record',
        yourRecord: '🏆 Your record:'
      },
      result: {
        eyebrow: 'Result',
        title: 'Your Lineup',
        posterAlt: 'Your lineup poster',
        downloadBtn: '⬇️ Download image',
        shareBtn: '📲 Share image',
        playAgainBtn: '🔄 Play again',
        suggestionBtn: '📧 Send feedback'
      },
      mailto: { subject: 'Suggestion - Build Your Lineup' },
      poster: { title: 'BUILD YOUR LINEUP' },
      share: { myLineup: 'My lineup' }
    }
  };

  function t(key){
    var parts = key.split('.');
    var obj = TRANSLATIONS[currentLang];
    for(var i = 0; i < parts.length; i++){
      obj = obj ? obj[parts[i]] : undefined;
    }
    if(obj === undefined){
      obj = TRANSLATIONS.es;
      for(var j = 0; j < parts.length; j++){
        obj = obj ? obj[parts[j]] : undefined;
      }
    }
    return obj !== undefined ? obj : key;
  }

  function L(pair){
    if(!pair) return '';
    return pair[currentLang] || pair.es || '';
  }

  var GENRE_LABELS = {
    es: {
      'Dembow':'Dembow', 'Nueva Escuela':'Nueva Escuela', 'Productores':'Productores',
      'Reggaetón':'Reggaetón', 'Reggaetón Romántico':'Reggaetón Romántico', 'Trap':'Trap',
      'Urbano Pop':'Urbano Pop', 'Vieja Escuela':'Vieja Escuela'
    },
    en: {
      'Dembow':'Dembow', 'Nueva Escuela':'New School', 'Productores':'Producers',
      'Reggaetón':'Reggaetón', 'Reggaetón Romántico':'Romantic Reggaetón', 'Trap':'Trap',
      'Urbano Pop':'Urban Pop', 'Vieja Escuela':'Old School'
    }
  };
  function genreLabel(g){
    return (GENRE_LABELS[currentLang] && GENRE_LABELS[currentLang][g]) || g;
  }

  var ARTISTS = [
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

  var AVATAR_COLORS = ["#FF2E93", "#00E5C7", "#FFB800", "#8C6BFF", "#FF6B4A"];
  var TOTAL_ROUNDS = 10;
  var BUDGET = 30; // $M — objetivo: gastarlo todo sin pasarte

  var state = {
    pool: [],
    lineup: [],
    round: 1,
    currentChoices: []
  };

  /* ---------- SOCIAL NOTIFICATIONS ---------- */
  var NOTIF_MAX = 4;
  var notifSentiment = 0;

  var NOTIF_HANDLES = {
    es: ['@fan_del_perreo', '@medio_urbano', '@perreo_diario', '@radio_flow', '@el_combo', '@ritmo_caliente', '@vientos_urbanos', '@caleta_music'],
    en: ['@perreo_fan', '@urban_media', '@daily_perreo', '@flow_radio', '@the_combo', '@hot_rhythm', '@urban_winds', '@caleta_music']
  };

  var NOTIF_MESSAGES = {
    liveHigh: [
      { es:'con {name} el show va a estar brutal', en:'with {name} the show is going to be insane' },
      { es:"medios: '{name} promete ser el momento viral del festival'", en:"media: '{name} is set to be the festival's viral moment'" },
      { es:'por fin un directo que vale la pena', en:'finally a live show worth watching' }
    ],
    liveLow: [
      { es:'¿{name} en vivo? ojalá tenga buena banda', en:'{name} live? hope they have a good band' },
      { es:'ese show en directo da miedo', en:'that live show is scary' },
      { es:'decisión cuestionable de los organizadores con {name}', en:'questionable call by the organizers with {name}' }
    ],
    valueGood: [
      { es:'por ese precio {name} no está nada mal', en:"for that price {name} isn't bad at all" },
      { es:'menudo chollo se han marcado con {name}', en:'what a steal they got with {name}' }
    ],
    valueBad: [
      { es:'vaya pastón para lo que ofrece {name} en directo', en:"that's a lot of cash for what {name} brings live" },
      { es:'ese caché de {name} no lo vale ni de broma', en:"{name}'s fee isn't worth it, not even close" }
    ],
    attendanceHigh: [
      { es:'ventas +12% tras el anuncio de {name}', en:'sales up 12% after the {name} announcement' },
      { es:'ya compré la entrada solo por {name}', en:'already bought my ticket just for {name}' }
    ],
    attendanceLow: [
      { es:'¿y {name} quién es?', en:"wait, who's {name}?" },
      { es:'artista muy de nicho, veremos', en:"pretty niche pick, we'll see" }
    ],
    genreGood: [
      { es:'buena mezcla de estilos, esto no aburre', en:"good mix of styles, this won't get boring" },
      { es:'me gusta que no todo suene igual en este cartel', en:"love that this lineup doesn't all sound the same" },
      { es:'un cartel con variedad siempre suma', en:'a varied lineup always helps' }
    ],
    genreBad: [
      { es:'todo el cartel suena igual, un poco de variedad no vendría mal', en:"the whole lineup sounds the same, a bit of variety wouldn't hurt" },
      { es:'trending: #CartelMonótono', en:'trending: #OneNoteLineup' }
    ],
    trendingGood: [
      { es:'trending: #EsteCartelPega', en:'trending: #ThisLineupSlaps' },
      { es:'trending: #ArmaronUnCartelón', en:'trending: #TheyBuiltABanger' }
    ],
    trendingBad: [
      { es:'trending: #QuePasoConElCartel', en:'trending: #WhatHappenedHere' },
      { es:'trending: #CartelFlojo', en:'trending: #WeakLineup' }
    ],
    budgetStingy: [
      { es:'¿tanto dinero sin gastar? parece que están siendo tacaños', en:'that much money unspent? seems like they are being cheap' },
      { es:'con ese presupuesto de sobra podrían apostar más fuerte', en:'with all that budget to spare they could go bigger' }
    ],
    budgetTight: [
      { es:'presupuesto pelado, a ver cómo cierran esto', en:"budget's razor thin, let's see how they close this out" },
      { es:'van muy ajustados de dinero para lo que queda', en:"they're really tight on cash for what's left" }
    ],
    opening: [
      { es:'arranca el cartel, primera confirmación ya en el bombo', en:'the lineup kicks off, first name already announced' },
      { es:'primer fichaje del cartel, empezamos', en:'first signing of the lineup, here we go' }
    ],
    closing: [
      { es:'con esto cierran el cartel, ya no hay vuelta atrás', en:'this closes out the lineup, no turning back now' },
      { es:'último fichaje confirmado, cartel completo', en:'last signing confirmed, lineup complete' }
    ]
  };

  function pickRandom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
  function notifText(key){ return L(pickRandom(NOTIF_MESSAGES[key])); }

  function collectReactions(artist){
    var candidates = [];
    if(artist.live >= 75) candidates.push({ key:'liveHigh', sentiment:'positive' });
    if(artist.live <= 45) candidates.push({ key:'liveLow', sentiment:'negative' });
    if(artist.live >= 65 && artist.salary <= 2.0) candidates.push({ key:'valueGood', sentiment:'positive' });
    if(artist.salary >= 6.0 && artist.live <= 65) candidates.push({ key:'valueBad', sentiment:'negative' });
    if(artist.attendance >= 40000) candidates.push({ key:'attendanceHigh', sentiment:'positive' });
    if(artist.attendance <= 10000) candidates.push({ key:'attendanceLow', sentiment:'negative' });

    var last3 = state.lineup.slice(-3);
    if(last3.length === 3 && last3.every(function(a){ return a.genre === last3[0].genre; })){
      candidates.push({ key:'genreBad', sentiment:'negative' });
    }
    var last4 = state.lineup.slice(-4);
    if(last4.length === 4){
      var uniqueGenres = [];
      last4.forEach(function(a){ if(uniqueGenres.indexOf(a.genre) === -1) uniqueGenres.push(a.genre); });
      if(uniqueGenres.length === 4) candidates.push({ key:'genreGood', sentiment:'positive' });
    }
    return candidates;
  }

  function pushNotification(sentiment, text){
    var panel = document.getElementById('notifPanel');
    if(!panel) return;
    var card = document.createElement('div');
    card.className = 'notif-card ' + sentiment;
    var handle = pickRandom(NOTIF_HANDLES[currentLang]);
    var initials = handle.replace('@', '').slice(0, 2).toUpperCase();
    card.innerHTML =
      '<div class="notif-head">' +
        '<span class="notif-avatar ' + sentiment + '">' + initials + '</span>' +
        '<span class="notif-handle">' + handle + '</span>' +
      '</div>' +
      '<p class="notif-text">' + text + '</p>';
    panel.insertBefore(card, panel.firstChild);
    while(panel.children.length > NOTIF_MAX){
      panel.removeChild(panel.lastChild);
    }
  }

  function triggerReactions(artist){
    var candidates = collectReactions(artist);
    if(candidates.length){
      var choice = pickRandom(candidates);
      var text = notifText(choice.key).replace('{name}', artist.name);
      notifSentiment += (choice.sentiment === 'positive' ? 1 : -1);
      pushNotification(choice.sentiment, text);
    }

    if(state.lineup.length === 1){
      pushNotification('positive', notifText('opening'));
    }

    if(state.lineup.length === Math.floor(TOTAL_ROUNDS / 2)){
      var expectedSpend = BUDGET * (state.lineup.length / TOTAL_ROUNDS);
      var spentNow = spentSoFar();
      if(spentNow < expectedSpend * 0.5){
        notifSentiment -= 1;
        pushNotification('negative', notifText('budgetStingy'));
      } else if(spentNow > expectedSpend * 1.3){
        notifSentiment -= 1;
        pushNotification('negative', notifText('budgetTight'));
      }
    }

    if(state.lineup.length % 3 === 0){
      var trendSentiment = notifSentiment >= 0 ? 'positive' : 'negative';
      var trendText = notifText(trendSentiment === 'positive' ? 'trendingGood' : 'trendingBad');
      pushNotification(trendSentiment, trendText);
    }

    if(state.lineup.length === TOTAL_ROUNDS){
      pushNotification('positive', notifText('closing'));
    }
  }

  function avatarColor(name){ return AVATAR_COLORS[name.length % AVATAR_COLORS.length]; }

  /* generic, non-representational silhouette icons — not modeled on any real person */
  var HEAD = '<circle cx="32" cy="42" r="13"/><polygon points="8,64 56,64 46,50 18,50"/>';
  var ARCHETYPES = [
    // 0 gorra plana
    '<rect x="17" y="18" width="30" height="15" rx="7"/><rect x="34" y="26" width="19" height="6" rx="3"/>',
    // 1 afro
    '<circle cx="32" cy="29" r="17"/>',
    // 2 bandana
    '<polygon points="18,27 46,27 32,10"/><circle cx="46" cy="25" r="4"/>',
    // 3 gorro beanie
    '<rect x="16" y="15" width="32" height="19" rx="10"/><circle cx="32" cy="13" r="4"/>',
    // 4 trenzas
    '<rect x="14" y="30" width="6" height="27" rx="3"/><rect x="44" y="30" width="6" height="27" rx="3"/><rect x="18" y="16" width="28" height="18" rx="9"/>',
    // 5 visera ladeada
    '<rect x="18" y="18" width="28" height="16" rx="8"/><rect x="36" y="22" width="22" height="7" rx="3.5" transform="rotate(-15 36 22)"/>',
    // 6 cresta
    '<polygon points="24,20 28,5 32,20"/><polygon points="30,20 34,3 38,20"/><polygon points="36,20 40,7 44,20"/>',
    // 7 rizos
    '<circle cx="20" cy="26" r="6"/><circle cx="30" cy="19" r="6"/><circle cx="40" cy="19" r="6"/><circle cx="47" cy="27" r="6"/>'
  ];
  function archetypeIndex(name){
    var sum = 0;
    for(var i = 0; i < name.length; i++){ sum += name.charCodeAt(i); }
    return sum % ARCHETYPES.length;
  }

  /* real artist photos supplied by the user — filled in as they're provided.
     any artist not listed here falls back to the generic silhouette icon. */
  var ARTIST_IMAGES = {
    'Alexis y Fido': 'images/artists/alexis-y-fido.webp',
    'Anuel AA': 'images/artists/anuel-aa.webp',
    'Arcángel': 'images/artists/arcangel.webp',
    'Bad Bunny': 'images/artists/bad-bunny.webp',
    'Bad Gyal': 'images/artists/bad-gyal.webp',
    'Becky G': 'images/artists/becky-g.webp',
    'Chencho Corleone': 'images/artists/chencho-corleone.webp',
    'Chimbala': 'images/artists/chimbala.webp',
    'Cosculluela': 'images/artists/cosculluela.webp',
    'Daddy Yankee': 'images/artists/daddy-yankee.webp',
    'De La Ghetto': 'images/artists/de-la-ghetto.webp',
    'Don Omar': 'images/artists/don-omar.webp',
    'El Alfa': 'images/artists/el-alfa.webp',
    'Eladio Carrión': 'images/artists/eladio-carrion.webp',
    'Farruko': 'images/artists/farruko.webp',
    'Feid': 'images/artists/feid.webp',
    'Ivy Queen': 'images/artists/ivy-queen.webp',
    'J Balvin': 'images/artists/j-balvin.webp',
    'Jhayco': 'images/artists/jhayco.webp',
    'Justin Quiles': 'images/artists/justin-quiles.webp',
    'Karol G': 'images/artists/karol-g.webp',
    'Lunay': 'images/artists/lunay.webp',
    'Maldy': 'images/artists/maldy.webp',
    'Manuel Turizo': 'images/artists/manuel-turizo.webp',
    'Myke Towers': 'images/artists/myke-towers.webp',
    'Nicky Jam': 'images/artists/nicky-jam.webp',
    'Ozuna': 'images/artists/ozuna.webp',
    'Quevedo': 'images/artists/quevedo.webp',
    'Rauw Alejandro': 'images/artists/rauw-alejandro.webp',
    'Sech': 'images/artists/sech.webp',
    'Tito El Bambino': 'images/artists/tito-el-bambino.webp',
    'Tokischa': 'images/artists/tokischa.webp',
    'Yailin': 'images/artists/yailin.webp',
    'Zion & Lennox': 'images/artists/zion-lennox.webp',
    'Ñengo Flow': 'images/artists/nengo-flow.webp',
    'Dalex': 'images/artists/dalex.webp',
    'Darell': 'images/artists/darell.webp',
    'Natti Natasha': 'images/artists/natti-natasha.webp',
    'Omega El Fuerte': 'images/artists/omega-el-fuerte.webp',
    'Jay Wheeler': 'images/artists/jay-wheeler.webp',
    'Kapo': 'images/artists/kapo.webp',
    'Maluma': 'images/artists/maluma.webp',
    'Omar Courtz': 'images/artists/omar-courtz.webp',
    'Ovy On The Drums': 'images/artists/ovy-on-the-drums.webp',
    'Rels B': 'images/artists/rels-b.webp',
    'Tainy': 'images/artists/tainy.webp',
    'Yandel': 'images/artists/yandel.webp',
    'Young Miko': 'images/artists/young-miko.webp',
    'Zion': 'images/artists/zion.webp',
    'Anitta': 'images/artists/anitta.webp',
    'Bizarrap': 'images/artists/bizarrap.webp',
    'Blessd': 'images/artists/blessd.webp',
    'Cris Mj': 'images/artists/cris-mj.webp',
    'Danny Ocean': 'images/artists/danny-ocean.webp',
    'El Bogueto': 'images/artists/el-bogueto.webp',
    'Lenny Tavárez': 'images/artists/lenny-tavarez.webp',
    'Beéle': 'images/artists/beele.webp',
    'Jowell & Randy': 'images/artists/jowell-randy.webp',
    'Ryan Castro': 'images/artists/ryan-castro.webp',
    'Luar La L': 'images/artists/luar-la-l.webp',
    'Lyanno': 'images/artists/lyanno.webp',
    'Maria Becerra': 'images/artists/maria-becerra.webp',
    'Mora': 'images/artists/mora.webp',
    'Nicki Nicole': 'images/artists/nicki-nicole.webp',
    'Noriel': 'images/artists/noriel.webp',
    'Paulo Londra': 'images/artists/paulo-londra.webp',
    'Randy': 'images/artists/randy.webp',
    'TINI': 'images/artists/tini.webp',
    'Wisin': 'images/artists/wisin.webp',
    'Yung Beef': 'images/artists/yung-beef.webp',
    'Boza': 'images/artists/boza.webp',
    'Bryant Myers': 'images/artists/bryant-myers.webp',
    'Caleb Calloway': 'images/artists/caleb-calloway.webp',
    'Cazzu': 'images/artists/cazzu.webp',
    'De La Rose': 'images/artists/de-la-rose.webp',
    'Dei V': 'images/artists/dei-v.webp',
    'Duki': 'images/artists/duki.webp',
    'Emilia': 'images/artists/emilia.webp',
    'Jory Boy': 'images/artists/jory-boy.webp',
    'Juanka': 'images/artists/juanka.webp',
    'Kevin Roldan': 'images/artists/kevin-roldan.webp',
    'Miky Woodz': 'images/artists/miky-woodz.webp',
    'Morad': 'images/artists/morad.webp',
    'Mozart La Para': 'images/artists/mozart-la-para.webp',
    'Nio García': 'images/artists/nio-garcia.webp',
    'Rochy RD': 'images/artists/rochy-rd.webp',
    'Saiko': 'images/artists/saiko.webp',
    'Trueno': 'images/artists/trueno.webp',
    'Villano Antillano': 'images/artists/villano-antillano.webp',
    'Alvaro Diaz': 'images/artists/alvaro-diaz.webp',
    'Beny Jr': 'images/artists/beny-jr.webp',
    'Brray': 'images/artists/brray.webp',
    'Clarent': 'images/artists/clarent.webp',
    'El Cherry Scom': 'images/artists/el-cherry-scom.webp',
    'Fuego': 'images/artists/fuego.webp',
    'Gigolo y La Exce': 'images/artists/gigolo-y-la-exce.webp',
    'Guaynaa': 'images/artists/guaynaa.webp',
    'Almighty': 'images/artists/almighty.webp',
    'Nacho': 'images/artists/nacho.webp',
    'J Álvarez': 'images/artists/j-alvarez.webp',
    'Casper Mágico': 'images/artists/casper-magico.webp',
    'Kendo Kaponi': 'images/artists/kendo-kaponi.webp',
    'Baby Rasta y Gringo': 'images/artists/baby-rasta-y-gringo.webp',
    'Khea': 'images/artists/khea.webp',
    'DJ Luian': 'images/artists/dj-luian.webp',
    'Farina': 'images/artists/farina.webp',
    'Franco El Gorila': 'images/artists/franco-el-gorila.webp',
    'Corina Smith': 'images/artists/corina-smith.webp'
  };

  function avatarMarkup(name, extraClass){
    var cls = 'avatar' + (extraClass ? ' ' + extraClass : '');
    if(ARTIST_IMAGES[name]){
      return '<div class="' + cls + '">' +
        '<img class="avatar-photo" src="' + ARTIST_IMAGES[name] + '" alt="' + name + '">' +
        '</div>';
    }
    var color = avatarColor(name);
    var icon = ARCHETYPES[archetypeIndex(name)];
    return '<div class="' + cls + '" style="background:' + color + '">' +
      '<svg class="avatar-icon" viewBox="0 0 64 64">' + HEAD + icon + '</svg>' +
      '</div>';
  }

  function shuffle(arr){
    var a = arr.slice();
    for(var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i+1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* ---------- screens ---------- */
  function showScreen(id){
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
  }

  /* ---------- formatting helpers ---------- */
  function fmtMoney(m){ return '$' + m.toFixed(1) + 'M'; }
  function fmtNumber(n){ return n.toLocaleString(currentLang === 'es' ? 'es-ES' : 'en-US'); }

  function spentSoFar(){
    return state.lineup.reduce(function(sum, a){ return sum + a.salary; }, 0);
  }

  function renderBudget(){
    var spent = spentSoFar();
    var pill = document.getElementById('budgetPill');
    pill.textContent = '💰 ' + fmtMoney(spent) + ' / ' + fmtMoney(BUDGET);
    pill.classList.toggle('over', spent > BUDGET);
  }

  /* ---------- game logic ---------- */
  function startGame(){
    trackEvent('game-started');
    state.pool = shuffle(ARTISTS);
    state.lineup = [];
    state.round = 1;
    state.hypeFinal = 40;
    notifSentiment = 0;
    clearTimeout(simState.timer);
    var notifPanel = document.getElementById('notifPanel');
    if(notifPanel) notifPanel.innerHTML = '';
    showScreen('screen-game');
    renderSidebar();
    renderBudget();
    nextRound();
  }

  function nextRound(){
    document.getElementById('roundNum').textContent = state.round;
    document.getElementById('progressFill').style.width = (state.lineup.length / TOTAL_ROUNDS * 100) + '%';
    state.currentChoices = state.pool.splice(0, 3);
    renderChoices();
    playSyncFlicker(state.currentChoices);
  }

  /* ---------- SYNC FLICKER (round transition) ---------- */
  function playSyncFlicker(choices){
    var grid = document.getElementById('choiceGrid');
    var cardEls = grid.querySelectorAll('.choice-card');
    choices.forEach(function(artist, idx){
      var card = cardEls[idx];
      if(!card) return;
      card.disabled = true;
      var elapsed = 0;
      var interval = 70;
      var stopAt = 1500 + idx * 550;
      function tick(){
        var decoy;
        do { decoy = ARTISTS[Math.floor(Math.random() * ARTISTS.length)]; } while(decoy.name === artist.name && ARTISTS.length > 1);
        card.innerHTML = choiceCardMarkup(decoy);
        elapsed += interval;
        interval = interval * 1.16;
        if(elapsed < stopAt){
          setTimeout(tick, interval);
        } else {
          card.innerHTML = choiceCardMarkup(artist);
          card.disabled = false;
        }
      }
      tick();
    });
  }

  /* simplified SVG flags — Unicode flag emoji don't render on every system/font,
     these are self-contained and always look right */
  var FLAG_SVGS = {
    PR: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/>' +
        '<rect width="24" height="3.2" y="0" fill="#D2001E"/><rect width="24" height="3.2" y="6.4" fill="#D2001E"/><rect width="24" height="3.2" y="12.8" fill="#D2001E"/>' +
        '<polygon points="0,0 11,8 0,16" fill="#1E3A8A"/>' +
        '<polygon points="4,8 5,6.3 6,8 5,9.7" fill="#fff" transform="scale(0.9) translate(0.4,0.4)"/></svg>',
    CO: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#FCD116"/>' +
        '<rect width="24" height="4" y="8" fill="#003893"/><rect width="24" height="4" y="12" fill="#CE1126"/></svg>',
    ES: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#AA151B"/>' +
        '<rect width="24" height="8" y="4" fill="#F1BF00"/></svg>',
    DO: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/>' +
        '<rect width="11" height="7" x="0" y="0" fill="#002D62"/><rect width="11" height="7" x="13" y="9" fill="#002D62"/>' +
        '<rect width="11" height="7" x="13" y="0" fill="#CE1126"/><rect width="11" height="7" x="0" y="9" fill="#CE1126"/></svg>',
    US: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/>' +
        '<rect width="24" height="1.23" y="0" fill="#B22234"/><rect width="24" height="1.23" y="2.46" fill="#B22234"/>' +
        '<rect width="24" height="1.23" y="4.92" fill="#B22234"/><rect width="24" height="1.23" y="7.38" fill="#B22234"/>' +
        '<rect width="24" height="1.23" y="9.84" fill="#B22234"/><rect width="24" height="1.23" y="12.3" fill="#B22234"/>' +
        '<rect width="24" height="1.23" y="14.77" fill="#B22234"/>' +
        '<rect width="10" height="8.6" x="0" y="0" fill="#3C3B6E"/></svg>',
    PA: '<svg viewBox="0 0 24 16"><rect width="12" height="8" x="0" y="0" fill="#fff"/><rect width="12" height="8" x="12" y="0" fill="#DA121A"/>' +
        '<rect width="12" height="8" x="0" y="8" fill="#0038A8"/><rect width="12" height="8" x="12" y="8" fill="#fff"/>' +
        '<polygon points="6,2.2 6.9,4.9 9.7,4.9 7.4,6.5 8.3,9.2 6,7.6 3.7,9.2 4.6,6.5 2.3,4.9 5.1,4.9" fill="#0038A8" transform="translate(0,-1) scale(0.55) translate(5,2)"/></svg>',
    BR: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#009B3A"/>' +
        '<polygon points="12,2 22,8 12,14 2,8" fill="#FEDF00"/>' +
        '<circle cx="12" cy="8" r="3.4" fill="#002776"/></svg>',
    CL: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/>' +
        '<rect width="24" height="8" y="8" fill="#D52B1E"/><rect width="8" height="8" x="0" y="0" fill="#0039A6"/>' +
        '<polygon points="4,2 4.6,3.8 6.5,3.8 5,4.9 5.6,6.7 4,5.6 2.4,6.7 3,4.9 1.5,3.8 3.4,3.8" fill="#fff"/></svg>',
    VE: '<svg viewBox="0 0 24 16"><rect width="24" height="5.33" y="0" fill="#FCD116"/>' +
        '<rect width="24" height="5.33" y="5.33" fill="#00247D"/><rect width="24" height="5.33" y="10.67" fill="#CF142B"/>' +
        '<circle cx="9" cy="8" r="0.9" fill="#fff"/><circle cx="11" cy="7" r="0.9" fill="#fff"/><circle cx="13" cy="7" r="0.9" fill="#fff"/><circle cx="15" cy="8" r="0.9" fill="#fff"/></svg>',
    AR: '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#fff"/>' +
        '<rect width="24" height="5.33" y="0" fill="#75AADB"/><rect width="24" height="5.33" y="10.67" fill="#75AADB"/>' +
        '<circle cx="12" cy="8" r="1.8" fill="#F6B40E" stroke="#85340A" stroke-width="0.2"/></svg>'
  };
  function countryFlag(code){ return FLAG_SVGS[code] || '<svg viewBox="0 0 24 16"><rect width="24" height="16" fill="#444"/></svg>'; }

  function choiceCardMarkup(artist){
    var photoSrc = ARTIST_IMAGES[artist.name];
    var photoOpen, iconHtml;
    if(photoSrc){
      photoOpen = '<div class="choice-photo" style="background-image:url(\'' + photoSrc + '\')">';
      iconHtml = '';
    } else {
      photoOpen = '<div class="choice-photo" style="background:' + avatarColor(artist.name) + '">';
      iconHtml = '<div class="choice-icon-wrap"><svg class="avatar-icon-lg" viewBox="0 0 64 64">' +
        HEAD + ARCHETYPES[archetypeIndex(artist.name)] + '</svg></div>';
    }
    return photoOpen +
        iconHtml +
        '<div class="choice-name-overlay">' +
          '<div class="choice-name">' + artist.name + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="choice-tags">' +
        '<span class="tag-pill tag-genre">' + genreLabel(artist.genre) + '</span>' +
        '<span class="tag-pill tag-country"><span class="flag-icon">' + countryFlag(artist.country) + '</span>' + artist.country + '</span>' +
      '</div>' +
      '<div class="choice-stats">' +
        plainRow(t('stat.sueldo'), fmtMoney(artist.salary), 'money') +
        plainRow(t('stat.asistencia'), fmtNumber(artist.attendance), 'attendance') +
        statRow(t('stat.showEnVivo'), artist.live, 'stat-live') +
      '</div>';
  }

  function renderChoices(){
    var grid = document.getElementById('choiceGrid');
    grid.innerHTML = '';
    state.currentChoices.forEach(function(artist){
      var card = document.createElement('button');
      card.className = 'choice-card';
      card.setAttribute('aria-label', t('aria.elegir') + ' ' + artist.name);
      card.innerHTML = choiceCardMarkup(artist);
      card.addEventListener('click', function(){ pickArtist(artist); });
      grid.appendChild(card);
    });
  }

  function statRow(label, value, cls){
    return '<div class="stat-row">' +
      '<span class="stat-label">' + label + '</span>' +
      '<span class="stat-bar-bg"><span class="stat-bar-fill ' + cls + '" style="width:' + value + '%"></span></span>' +
      '<span class="stat-val">' + value + '</span>' +
      '</div>';
  }

  function plainRow(label, value, cls){
    return '<div class="stat-row-plain">' +
      '<span class="stat-label">' + label + '</span>' +
      '<span class="stat-plain-val ' + cls + '">' + value + '</span>' +
      '</div>';
  }

  function pickArtist(artist){
    state.lineup.push(artist);
    renderSidebar();
    renderBudget();
    triggerReactions(artist);
    if(state.round >= TOTAL_ROUNDS){
      runLoadingThenSimulation();
    } else {
      state.round += 1;
      nextRound();
    }
  }

  function renderSidebar(){
    document.getElementById('sidebarCount').textContent = state.lineup.length;
    var list = document.getElementById('sidebarList');
    if(state.lineup.length === 0){
      list.innerHTML = '<p class="sidebar-empty">' + t('game.sidebarEmpty') + '</p>';
      return;
    }
    list.innerHTML = '';
    state.lineup.forEach(function(artist){
      var row = document.createElement('div');
      row.className = 'sidebar-item';
      row.innerHTML =
        avatarMarkup(artist.name, 'avatar-sm') +
        '<div>' +
          '<div class="sidebar-name">' + artist.name + '</div>' +
          '<div class="sidebar-meta">' + genreLabel(artist.genre) + ' · ' + fmtMoney(artist.salary) + '</div>' +
        '</div>' +
        '<span class="sidebar-check">✓</span>';
      list.appendChild(row);
    });
    list.scrollTop = list.scrollHeight;
  }

  function renderLineupGrid(targetId){
    var grid = document.getElementById(targetId);
    grid.innerHTML = '';
    for(var i = 0; i < TOTAL_ROUNDS; i++){
      var slot = document.createElement('div');
      var artist = state.lineup[i];
      if(artist){
        slot.className = 'lineup-slot filled';
        slot.innerHTML =
          avatarMarkup(artist.name, 'avatar-sm') +
          '<div class="slot-name">' + artist.name + '</div>';
      } else {
        slot.className = 'lineup-slot';
        slot.innerHTML = '<div class="slot-num">' + (i+1) + '</div>';
      }
      grid.appendChild(slot);
    }
  }

  /* ---------- FESTIVAL SIMULATION ---------- */
  var SIM_ARTIST_BEAT_MS = 800;
  var SIM_MS_PER_CHAR = 55;
  var SIM_MIN_READ_MS = 2200;
  var SIM_MAX_READ_MS = 4800;

  function simReadingTime(text){
    return Math.max(SIM_MIN_READ_MS, Math.min(SIM_MAX_READ_MS, text.length * SIM_MS_PER_CHAR));
  }

  var simState = { order: [], index: 0, hype: 40, timer: null };

  var SIM_EVENTS = {
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

  var SIM_POSITIVE_KEYS = ['viralMoment', 'crowdSings', 'perfectNight', 'rainStops', 'surpriseCollab'];
  var SIM_NEGATIVE_KEYS = ['artistLate', 'technicalFail', 'powerCut', 'entranceJam', 'rainStorm', 'egoClash'];

  function simOtherArtistName(){
    var played = simState.order.slice(0, simState.index);
    if(!played.length) return '';
    return pickRandom(played).name;
  }

  function simRollEventKey(artist, index){
    if(Math.random() > 0.55) return null;
    var positiveChance = Math.max(0.30, Math.min(0.80, 0.48 + (artist.live - 55) * 0.008));
    var sentiment = Math.random() < positiveChance ? 'positive' : 'negative';
    var pool = (sentiment === 'positive' ? SIM_POSITIVE_KEYS : SIM_NEGATIVE_KEYS).filter(function(key){
      return !SIM_EVENTS[key].needsOther || index > 0;
    });
    if(!pool.length) return null;
    return pickRandom(pool);
  }

  function simArtistCardMarkup(artist){
    var photoSrc = ARTIST_IMAGES[artist.name];
    var photoOpen, iconHtml;
    if(photoSrc){
      photoOpen = '<div class="sim-card-photo" style="background-image:url(\'' + photoSrc + '\')">';
      iconHtml = '';
    } else {
      photoOpen = '<div class="sim-card-photo" style="background:' + avatarColor(artist.name) + '">';
      iconHtml = '<div class="choice-icon-wrap"><svg class="avatar-icon-lg" viewBox="0 0 64 64">' +
        HEAD + ARCHETYPES[archetypeIndex(artist.name)] + '</svg></div>';
    }
    return photoOpen +
        iconHtml +
        '<div class="sim-card-name-overlay">' +
          '<div class="sim-card-name">' + artist.name + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="sim-card-tags">' +
        '<span class="tag-pill tag-genre">' + genreLabel(artist.genre) + '</span>' +
        '<span class="tag-pill tag-country"><span class="flag-icon">' + countryFlag(artist.country) + '</span>' + artist.country + '</span>' +
      '</div>';
  }

  function simRenderTimeline(){
    var timeline = document.getElementById('simTimeline');
    timeline.innerHTML = '';
    simState.order.forEach(function(a, i){
      var dot = document.createElement('div');
      if(i < simState.index){ dot.className = 'sim-dot done'; dot.textContent = '✓'; }
      else if(i === simState.index){ dot.className = 'sim-dot current'; }
      else{ dot.className = 'sim-dot'; }
      timeline.appendChild(dot);
    });
  }

  function simApplyHypeDelta(delta){
    simState.hype = Math.max(0, Math.min(100, simState.hype + delta));
    document.getElementById('simHypeBarFill').style.width = simState.hype + '%';
    document.getElementById('simHypeValue').textContent = simState.hype;
    var deltaEl = document.getElementById('simHypeDelta');
    deltaEl.textContent = (delta >= 0 ? '+' : '') + delta;
    deltaEl.className = 'sim-hype-delta ' + (delta >= 0 ? 'positive' : 'negative');
  }

  function simRenderEventAuto(def, artist, otherName, totalDelta){
    var card = document.getElementById('simEventCard');
    if(!def){
      card.className = 'sim-event-card';
      card.innerHTML =
        '<div class="sim-event-head">' +
          '<span class="sim-event-label">' + t('sim.noEvent') + '</span>' +
          '<span class="sim-event-delta ' + (totalDelta >= 0 ? 'positive' : 'negative') + '">' + (totalDelta >= 0 ? '+' : '') + totalDelta + '</span>' +
        '</div>' +
        '<p class="sim-event-text">' + t('sim.noEventText') + '</p>';
      return;
    }
    var text = L(def.text).replace('{name}', artist.name).replace('{other}', otherName);
    card.className = 'sim-event-card ' + def.sentiment;
    card.innerHTML =
      '<div class="sim-event-head">' +
        '<span class="sim-event-icon">' + (def.sentiment === 'positive' ? '✨' : '⚠️') + '</span>' +
        '<span class="sim-event-label">' + t('sim.eventLabel') + '</span>' +
        '<span class="sim-event-delta ' + def.sentiment + '">' + (totalDelta >= 0 ? '+' : '') + totalDelta + '</span>' +
      '</div>' +
      '<p class="sim-event-text">' + text + '</p>';
  }

  function simRenderEventDecision(def, artist, otherName, baseDelta){
    var card = document.getElementById('simEventCard');
    var text = L(def.text).replace('{name}', artist.name).replace('{other}', otherName);
    card.className = 'sim-event-card decision';
    var optionsHtml = def.options.map(function(opt, i){
      return '<button class="btn btn-secondary sim-event-option" data-index="' + i + '">' + L(opt.label) + '</button>';
    }).join('');
    card.innerHTML =
      '<div class="sim-event-head">' +
        '<span class="sim-event-icon">⚠️</span>' +
        '<span class="sim-event-label decision">' + t('sim.decisionLabel') + '</span>' +
      '</div>' +
      '<p class="sim-event-text">' + text + '</p>' +
      '<div class="sim-event-actions">' + optionsHtml + '</div>' +
      '<p class="sim-event-hint">' + t('sim.decisionHint') + '</p>';

    card.querySelectorAll('.sim-event-option').forEach(function(btn){
      btn.addEventListener('click', function(){
        var opt = def.options[parseInt(btn.getAttribute('data-index'), 10)];
        var totalDelta = baseDelta + opt.delta;
        simApplyHypeDelta(totalDelta);
        card.querySelectorAll('.sim-event-option').forEach(function(b){ b.disabled = true; });
        card.className = 'sim-event-card ' + (totalDelta >= 0 ? 'positive' : 'negative');
        var resultText = L(opt.resultText);
        card.innerHTML =
          '<div class="sim-event-head">' +
            '<span class="sim-event-icon">⚠️</span>' +
            '<span class="sim-event-label">' + t('sim.eventLabel') + '</span>' +
            '<span class="sim-event-delta ' + (totalDelta >= 0 ? 'positive' : 'negative') + '">' + (totalDelta >= 0 ? '+' : '') + totalDelta + '</span>' +
          '</div>' +
          '<p class="sim-event-text">' + resultText + '</p>';
        simScheduleAdvance(simReadingTime(resultText));
      });
    });
  }

  function simScheduleAdvance(ms){
    clearTimeout(simState.timer);
    simState.timer = setTimeout(function(){
      simState.index += 1;
      simPlayNextConcert();
    }, ms);
  }

  function simPlayNextConcert(){
    if(simState.index >= simState.order.length){
      simFinish();
      return;
    }
    var artist = simState.order[simState.index];
    document.getElementById('simConcertNum').textContent = simState.index + 1;
    document.getElementById('simProgressFill').style.width = (simState.index / simState.order.length * 100) + '%';
    simRenderTimeline();
    document.getElementById('simArtistCard').innerHTML = simArtistCardMarkup(artist);

    var eventCard = document.getElementById('simEventCard');
    eventCard.className = 'sim-event-card';
    eventCard.innerHTML = '';
    var deltaEl = document.getElementById('simHypeDelta');
    deltaEl.textContent = '';
    deltaEl.className = 'sim-hype-delta';

    clearTimeout(simState.timer);
    simState.timer = setTimeout(function(){
      simRevealEvent(artist);
    }, SIM_ARTIST_BEAT_MS);
  }

  var SIM_CONFETTI_COLORS = ['#FF2E93', '#00E5C7', '#FFB800', '#8C6BFF'];
  var SIM_SHAKE_EVENTS = ['technicalFail', 'powerCut'];

  function simScreenShake(){
    var body = document.querySelector('.sim-body');
    if(!body) return;
    body.classList.remove('sim-shake');
    void body.offsetWidth;
    body.classList.add('sim-shake');
    setTimeout(function(){ body.classList.remove('sim-shake'); }, 450);
  }

  function simConfettiBurst(){
    var host = document.querySelector('.sim-body');
    if(!host) return;
    var layer = document.createElement('div');
    layer.className = 'sim-confetti-layer';
    for(var i = 0; i < 24; i++){
      var piece = document.createElement('div');
      piece.className = 'sim-confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = SIM_CONFETTI_COLORS[i % SIM_CONFETTI_COLORS.length];
      piece.style.animationDelay = (Math.random() * 0.25) + 's';
      layer.appendChild(piece);
    }
    host.appendChild(layer);
    setTimeout(function(){ if(layer.parentNode) layer.parentNode.removeChild(layer); }, 1600);
  }

  function resultConfettiBurst(){
    var layer = document.createElement('div');
    layer.className = 'result-confetti-layer';
    for(var i = 0; i < 60; i++){
      var piece = document.createElement('div');
      piece.className = 'result-confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = SIM_CONFETTI_COLORS[i % SIM_CONFETTI_COLORS.length];
      piece.style.animationDelay = (Math.random() * 0.4) + 's';
      layer.appendChild(piece);
    }
    document.body.appendChild(layer);
    setTimeout(function(){ if(layer.parentNode) layer.parentNode.removeChild(layer); }, 3000);
  }

  function simRevealEvent(artist){
    var baseDelta = Math.round((artist.live - 50) / 5);
    var eventKey = simRollEventKey(artist, simState.index);
    var def = eventKey ? SIM_EVENTS[eventKey] : null;
    var otherName = (def && def.needsOther) ? simOtherArtistName() : '';

    if(eventKey === 'viralMoment') simConfettiBurst();
    if(SIM_SHAKE_EVENTS.indexOf(eventKey) !== -1) simScreenShake();

    if(def && def.decision){
      simRenderEventDecision(def, artist, otherName, baseDelta);
    } else {
      var totalDelta = baseDelta + (def ? def.delta : 0);
      simApplyHypeDelta(totalDelta);
      simRenderEventAuto(def, artist, otherName, totalDelta);
      var readText = def ? L(def.text).replace('{name}', artist.name).replace('{other}', otherName) : t('sim.noEventText');
      simScheduleAdvance(simReadingTime(readText));
    }
  }

  function simSkip(){
    clearTimeout(simState.timer);
    while(simState.index < simState.order.length){
      var artist = simState.order[simState.index];
      var baseDelta = Math.round((artist.live - 50) / 5);
      var eventKey = simRollEventKey(artist, simState.index);
      var def = eventKey ? SIM_EVENTS[eventKey] : null;
      var totalDelta = baseDelta;
      if(def){ totalDelta += def.decision ? def.options[0].delta : def.delta; }
      simState.hype = Math.max(0, Math.min(100, simState.hype + totalDelta));
      simState.index += 1;
    }
    simFinish();
  }

  function simFinish(){
    state.hypeFinal = simState.hype;
    document.getElementById('loadingText').textContent = t('loading.finalResult');
    document.getElementById('loadingOverlay').classList.add('active');
    setTimeout(function(){
      document.getElementById('loadingOverlay').classList.remove('active');
      showResult();
    }, 900);
  }

  function startSimulation(){
    simState.order = state.lineup.slice().sort(function(a, b){ return a.salary - b.salary; });
    simState.index = 0;
    simState.hype = 40;
    document.getElementById('simBudgetPill').textContent = '💰 ' + fmtMoney(spentSoFar()) + ' / ' + fmtMoney(BUDGET);
    document.getElementById('simHypeBarFill').style.width = '50%';
    document.getElementById('simHypeValue').textContent = '50';
    document.getElementById('simHypeDelta').textContent = '';
    document.getElementById('simHypeDelta').className = 'sim-hype-delta';
    showScreen('screen-simulation');
    simPlayNextConcert();
  }

  document.getElementById('simSkipBtn').addEventListener('click', simSkip);

  /* ---------- loading + results ---------- */
  function runLoadingThenSimulation(){
    document.getElementById('loadingText').textContent = t('loading.closing');
    document.getElementById('loadingOverlay').classList.add('active');
    setTimeout(function(){
      document.getElementById('loadingOverlay').classList.remove('active');
      startSimulation();
    }, 1200);
  }

  var GENRE_COUNT = 8; // + Productores

  function overallLabel(score){
    if(score >= 90) return t('tier.legendario');
    if(score >= 80) return t('tier.lujo');
    if(score >= 70) return t('tier.bueno');
    if(score >= 50) return t('tier.discreto');
    return t('tier.desastre');
  }

  function ringColorForScore(score){
    if(score >= 90) return 'var(--purple)';
    if(score >= 70) return 'var(--cyan)';
    if(score >= 50) return 'var(--gold)';
    return 'var(--pink)';
  }

  var BEST_SCORE_KEY = 'armaTuCartelBestScore';

  function getBestScore(){
    try{
      var raw = window.localStorage.getItem(BEST_SCORE_KEY);
      if(raw === null) return null;
      var n = parseInt(raw, 10);
      return isNaN(n) ? null : n;
    } catch(e){
      return null;
    }
  }

  function setBestScore(score){
    try{
      window.localStorage.setItem(BEST_SCORE_KEY, String(score));
    } catch(e){
      /* localStorage no disponible (modo privado, etc.) - se ignora */
    }
  }

  var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) ? window.requestAnimationFrame.bind(window) : function(cb){ return setTimeout(function(){ cb(Date.now()); }, 16); };

  var MAIN_RING_R = 94;
  var MAIN_RING_C = 2 * Math.PI * MAIN_RING_R;

  function animateRingFill(circleEl, circumference, pct){
    if(!circleEl) return;
    var offset = circumference * (1 - Math.max(0, Math.min(100, pct)) / 100);
    circleEl.style.strokeDasharray = circumference;
    circleEl.style.strokeDashoffset = circumference;
    circleEl.getBoundingClientRect();
    raf(function(){
      circleEl.style.strokeDashoffset = offset;
    });
  }

  function animateCount(el, target, duration){
    if(!el) return;
    var steps = Math.max(1, Math.round(duration / 40));
    var frame = 0;
    var timer = setInterval(function(){
      frame++;
      var progress = Math.min(1, frame / steps);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if(progress >= 1) clearInterval(timer);
    }, Math.max(16, Math.round(duration / steps)));
  }

  function showResult(){
    trackEvent('game-completed');
    var n = state.lineup.length;
    var totalAttendance = state.lineup.reduce(function(s,a){ return s + a.attendance; }, 0);
    var avgLive = Math.round(state.lineup.reduce(function(s,a){ return s + a.live; }, 0) / n);
    var totalSalary = spentSoFar();
    var genresUsed = [];
    state.lineup.forEach(function(a){ if(genresUsed.indexOf(a.genre) === -1) genresUsed.push(a.genre); });

    var attendanceScore = Math.min(100, totalAttendance / 300000 * 100);
    var liveScore = avgLive;
    var genreScore = (genresUsed.length / GENRE_COUNT) * 100;
    var hypeScore = (typeof state.hypeFinal === 'number') ? state.hypeFinal : 50;
    var base = 0.25 * attendanceScore + 0.25 * liveScore + 0.20 * genreScore + 0.30 * hypeScore;

    var overBudget = totalSalary > BUDGET;
    var budgetAdjustment = overBudget
      ? -Math.round((totalSalary - BUDGET) * 2.5)
      : Math.round((totalSalary / BUDGET) * 8);

    var finalScore = Math.max(0, Math.min(100, Math.round(base) + budgetAdjustment));
    state.finalScore = finalScore;
    state.finalScoreLabel = overallLabel(finalScore);

    var ringColor = ringColorForScore(finalScore);
    var scoreRingFillEl = document.getElementById('scoreRingFill');
    if(scoreRingFillEl) scoreRingFillEl.style.stroke = ringColor;
    animateRingFill(scoreRingFillEl, MAIN_RING_C, finalScore);
    animateCount(document.getElementById('resultScore'), finalScore, 1100);
    var resultLabelEl = document.getElementById('resultLabel');
    resultLabelEl.textContent = overallLabel(finalScore);
    resultLabelEl.style.color = ringColor;

    var previousBest = getBestScore();
    if(scoreRingFillEl) scoreRingFillEl.classList.remove('is-record');
    if(previousBest === null){
      state.recordInfo = { type:'none' };
      setBestScore(finalScore);
    } else if(finalScore > previousBest){
      state.recordInfo = { type:'new', previousBest:previousBest, finalScore:finalScore };
      if(scoreRingFillEl) scoreRingFillEl.classList.add('is-record');
      setBestScore(finalScore);
    } else {
      state.recordInfo = { type:'existing', previousBest:previousBest };
    }

    var posterBox = document.getElementById('posterPreviewBox');
    if(posterBox) posterBox.classList.remove('show');
    var posterShareBtn = document.getElementById('posterShareBtn');
    if(posterShareBtn) posterShareBtn.style.display = 'none';

    state.resultStats = {
      hypeScore: hypeScore, avgLive: avgLive, totalAttendance: totalAttendance,
      genresUsedCount: genresUsed.length, totalSalary: totalSalary, overBudget: overBudget
    };

    refreshResultTexts();

    showScreen('screen-result');
    resultConfettiBurst();
    generatePoster();
  }

  function refreshResultTexts(){
    if(typeof state.finalScore !== 'number') return;
    var ringColor = ringColorForScore(state.finalScore);
    var resultLabelEl = document.getElementById('resultLabel');
    if(resultLabelEl){
      resultLabelEl.textContent = overallLabel(state.finalScore);
      resultLabelEl.style.color = ringColor;
    }
    state.finalScoreLabel = overallLabel(state.finalScore);

    var recordLineEl = document.getElementById('recordLine');
    if(recordLineEl && state.recordInfo){
      if(state.recordInfo.type === 'new'){
        recordLineEl.className = 'record-line is-new';
        recordLineEl.innerHTML = t('record.new') + '<span class="record-delta">▲ +' + (state.recordInfo.finalScore - state.recordInfo.previousBest) + ' ' + t('record.vsPrevious') + ' (' + state.recordInfo.previousBest + ')</span>';
      } else if(state.recordInfo.type === 'existing'){
        recordLineEl.className = 'record-line';
        recordLineEl.textContent = t('record.yourRecord') + ' ' + state.recordInfo.previousBest + ' / 100';
      } else {
        recordLineEl.className = 'record-line';
        recordLineEl.innerHTML = '';
      }
    }

    var attrPanelEl = document.getElementById('attrPanel');
    if(attrPanelEl && state.resultStats){
      var s = state.resultStats;
      attrPanelEl.innerHTML =
        statRow(t('stat.hypeFinal'), s.hypeScore, 'stat-hype') +
        statRow(t('stat.showEnVivo'), s.avgLive, 'stat-live') +
        plainRow(t('stat.asistenciaTotal'), fmtNumber(s.totalAttendance), 'attendance') +
        plainRow(t('stat.generos'), s.genresUsedCount + ' / ' + GENRE_COUNT, 'attendance') +
        plainRow(t('stat.presupuesto'), fmtMoney(s.totalSalary) + ' / ' + fmtMoney(BUDGET) + (s.overBudget ? ' ⚠️' : ' ✅'), s.overBudget ? 'over-budget' : 'money');
    }
  }


  /* ---------- events ---------- */
  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('playAgainBtn').addEventListener('click', startGame);

  /* ---------- HERO ARTIST COLLAGE ---------- */
  (function initHeroCollage(){
    var collageEl = document.getElementById('heroCollage');
    var captionEl = document.getElementById('heroCollageCaption');
    if(!collageEl || !captionEl) return;
    var featured = ['Bad Bunny', 'J Balvin', 'Daddy Yankee', 'Karol G', 'Rauw Alejandro', 'Don Omar', 'Maluma', 'Ozuna'];
    var html = '';
    var shown = 0;
    featured.forEach(function(name){
      var src = ARTIST_IMAGES[name];
      if(!src) return;
      html += '<div class="hero-collage-photo" style="background-image:url(\'' + src + '\')" title="' + name + '"></div>';
      shown++;
    });
    var extra = ARTISTS.length - shown;
    if(extra > 0){
      html += '<div class="hero-collage-more">+' + extra + '</div>';
    }
    collageEl.innerHTML = html;
    captionEl.textContent = t('landing.collageCaption');
  })();

  /* ---------- SHAREABLE POSTER ---------- */
  var POSTER_WIDTH = 1080;
  var POSTER_BG_SRC_W = 1536;
  var POSTER_BG_SRC_H = 1024;
  var POSTER_BG_SCALE = POSTER_WIDTH / POSTER_BG_SRC_W;
  var lastPosterBlob = null;
  var POSTER_BG_IMAGE = 'images/poster-bg.webp';
  var posterBgImgEl = null;

  function posterFontMetrics(ctx, font, sampleText){
    ctx.font = font;
    var m = ctx.measureText(sampleText);
    var asc = m.actualBoundingBoxAscent;
    var desc = m.actualBoundingBoxDescent;
    if(typeof asc === 'number' && typeof desc === 'number' && (asc > 0 || desc > 0)){
      return { ascent: asc, descent: desc };
    }
    var sizeMatch = /(\d+(?:\.\d+)?)px/.exec(font);
    var size = sizeMatch ? parseFloat(sizeMatch[1]) : 24;
    return { ascent: size * 0.74, descent: size * 0.02 };
  }

  function loadPosterBgImage(){
    if(posterBgImgEl) return Promise.resolve(posterBgImgEl);
    return new Promise(function(resolve){
      var img = new Image();
      img.onload = function(){ posterBgImgEl = img; resolve(img); };
      img.onerror = function(){ resolve(null); };
      img.src = POSTER_BG_IMAGE;
    });
  }

  function posterRoundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function posterWrapNames(ctx, names, maxWidth, separator){
    var lines = [];
    var current = '';
    names.forEach(function(name){
      var candidate = current ? current + separator + name : name;
      if(current && ctx.measureText(candidate).width > maxWidth){
        lines.push(current);
        current = name;
      } else {
        current = candidate;
      }
    });
    if(current) lines.push(current);
    return lines;
  }

  function computePosterLayout(ctx, centerX, maxTextWidth){
    var ops = [];
    var GAP_SECTION = 50;         // hueco visual real: titulo->headliner y ultima fila->resultado
    var GAP_TIER = 26;            // hueco visual real entre filas de artistas
    var GAP_TITLE_DIVIDER = 20;

    var cursor = 44;

    var titleFont = '400 80px "Titan One", sans-serif';
    var titleText = t('poster.title');
    var tm = posterFontMetrics(ctx, titleFont, titleText);
    var titleBaseline = cursor + tm.ascent;
    ops.push({ kind: 'text', text: titleText, font: titleFont, color: '#F5F0FA', x: centerX, y: titleBaseline });
    cursor = titleBaseline + tm.descent + GAP_TITLE_DIVIDER;

    var dividerY = cursor;
    ops.push({ kind: 'divider', y: dividerY });
    cursor = dividerY + GAP_SECTION;

    var sorted = state.lineup.slice().sort(function(a, b){ return b.salary - a.salary; });
    var tiers = [
      { names: sorted.slice(0, 1).map(function(a){ return a.name.toUpperCase(); }), font: '400 72px "Titan One", sans-serif', color: '#FFFFFF', lineGap: 10 },
      { names: sorted.slice(1, 3).map(function(a){ return a.name.toUpperCase(); }), font: '400 44px "Titan One", sans-serif', color: '#F5F0FA', lineGap: 8 },
      { names: sorted.slice(3, 6).map(function(a){ return a.name.toUpperCase(); }), font: '400 32px "Titan One", sans-serif', color: '#D8D2E0', lineGap: 6 },
      { names: sorted.slice(6, 10).map(function(a){ return a.name.toUpperCase(); }), font: '400 23px "Titan One", sans-serif', color: '#9C8FB0', lineGap: 5 }
    ];

    tiers.forEach(function(tier, tierIndex){
      if(!tier.names.length) return;
      if(tierIndex > 0) cursor += GAP_TIER;
      var lines = posterWrapNames(ctx, tier.names, maxTextWidth, '   ·   ');
      lines.forEach(function(line, lineIndex){
        var lm = posterFontMetrics(ctx, tier.font, line);
        if(lineIndex > 0) cursor += tier.lineGap;
        var baseline = cursor + lm.ascent;
        ops.push({ kind: 'text', text: line, font: tier.font, color: tier.color, x: centerX, y: baseline });
        cursor = baseline + lm.descent;
      });
    });

    cursor += GAP_SECTION;
    var badgeText = state.finalScore + '/100 · ' + state.finalScoreLabel;
    var badgeFont = '400 30px "Titan One", sans-serif';
    var bm = posterFontMetrics(ctx, badgeFont, badgeText);
    var badgeBaseline = cursor + bm.ascent;
    ops.push({ kind: 'result', text: badgeText, font: badgeFont, color: '#FFD666', glow: 'rgba(255,184,0,0.85)', x: centerX, y: badgeBaseline });
    cursor = badgeBaseline + bm.descent;

    return { ops: ops, contentBottom: cursor };
  }

  function buildPosterCanvas(bgImg){
    var centerX = POSTER_WIDTH / 2;
    var maxTextWidth = POSTER_WIDTH - 160;

    var probe = document.createElement('canvas');
    probe.width = POSTER_WIDTH;
    probe.height = 10;
    var pctx = probe.getContext('2d');
    pctx.textAlign = 'center';
    var layout = computePosterLayout(pctx, centerX, maxTextWidth);

    var BOTTOM_MARGIN = 40; // colchon minimo si el contenido de texto fuese mas alto que la foto
    var bgHeight = Math.round(POSTER_BG_SRC_H * POSTER_BG_SCALE);
    var canvasHeight = Math.max(bgHeight, Math.round(layout.contentBottom + BOTTOM_MARGIN));

    var canvas = document.createElement('canvas');
    canvas.width = POSTER_WIDTH;
    canvas.height = canvasHeight;
    var ctx = canvas.getContext('2d');

    if(bgImg){
      ctx.drawImage(bgImg, 0, 0, POSTER_BG_SRC_W, POSTER_BG_SRC_H, 0, 0, POSTER_WIDTH, bgHeight);
      if(canvasHeight > bgHeight){
        ctx.fillStyle = '#0B0A14';
        ctx.fillRect(0, bgHeight, POSTER_WIDTH, canvasHeight - bgHeight);
      }
    } else {
      ctx.fillStyle = '#0B0A14';
      ctx.fillRect(0, 0, POSTER_WIDTH, canvasHeight);
    }

    ctx.textAlign = 'center';
    layout.ops.forEach(function(op){
      if(op.kind === 'text'){
        ctx.font = op.font;
        ctx.fillStyle = op.color;
        ctx.fillText(op.text, op.x, op.y);
      } else if(op.kind === 'divider'){
        ctx.strokeStyle = '#FF2E93';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 80, op.y);
        ctx.lineTo(centerX + 80, op.y);
        ctx.stroke();
      } else if(op.kind === 'result'){
        ctx.font = op.font;
        ctx.fillStyle = op.color;
        ctx.shadowColor = op.glow;
        ctx.shadowBlur = 16;
        ctx.fillText(op.text, op.x, op.y);
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      }
    });

    return canvas;
  }

  function generatePoster(){
    var ready = (typeof document.fonts !== 'undefined' && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    var titanOneReady = (typeof document.fonts !== 'undefined' && document.fonts.load) ? document.fonts.load('400 72px "Titan One"') : Promise.resolve();
    Promise.all([ready, loadPosterBgImage(), titanOneReady]).then(function(results){
      var bgImg = results[1];
      var canvas = buildPosterCanvas(bgImg);
      var dataUrl = canvas.toDataURL('image/png');
      var img = document.getElementById('posterImg');
      img.src = dataUrl;
      var link = document.getElementById('posterDownloadLink');
      link.href = dataUrl;
      document.getElementById('posterPreviewBox').classList.add('show');

      if(canvas.toBlob){
        canvas.toBlob(function(blob){
          lastPosterBlob = blob;
          var shareBtn = document.getElementById('posterShareBtn');
          if(blob && typeof navigator.share === 'function'){
            shareBtn.style.display = '';
          }
        }, 'image/png');
      }
    });
  }

  document.getElementById('posterDownloadLink').addEventListener('click', function(){
    trackEvent('poster-downloaded');
  });

  document.getElementById('posterShareBtn').addEventListener('click', function(){
    if(!lastPosterBlob) return;
    var file = new File([lastPosterBlob], 'mi-cartel.png', { type: 'image/png' });
    if(navigator.canShare && !navigator.canShare({ files: [file] })) return;
    navigator.share({
      files: [file],
      title: t('brand'),
      text: t('share.myLineup') + ': ' + state.finalScore + '/100 (' + state.finalScoreLabel + ')'
    }).catch(function(){});
  });

  /* ---------- LANGUAGE APPLY ---------- */
  function applyLanguage(){
    document.documentElement.setAttribute('lang', currentLang);
    var pageTitleTag = document.getElementById('pageTitleTag');
    if(pageTitleTag) pageTitleTag.textContent = t('pageTitle');
    document.title = t('pageTitle');

    document.querySelectorAll('[data-i18n]').forEach(function(el){
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el){
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });

    var toggleLabel = currentLang === 'es' ? 'EN' : 'ES';
    document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){ btn.textContent = toggleLabel; });

    var suggestionLink = document.getElementById('suggestionLink');
    if(suggestionLink) suggestionLink.href = 'mailto:armatucartel@gmail.com?subject=' + encodeURIComponent(t('mailto.subject'));

    var collageCaption = document.getElementById('heroCollageCaption');
    if(collageCaption) collageCaption.textContent = t('landing.collageCaption');

    if(state.currentChoices && state.currentChoices.length && document.querySelectorAll('.choice-card').length){
      renderChoices();
    }
    if(state.lineup && state.lineup.length){
      renderSidebar();
      renderBudget();
    }
    if(document.getElementById('screen-result') && document.getElementById('screen-result').classList.contains('active')){
      refreshResultTexts();
      generatePoster();
    }
  }

  function setLang(lang){
    if(lang !== 'es' && lang !== 'en') return;
    currentLang = lang;
    try { window.localStorage.setItem(LANG_KEY, lang); } catch(e){}
    applyLanguage();
  }

  document.querySelectorAll('[data-lang-toggle]').forEach(function(btn){
    btn.addEventListener('click', function(){
      setLang(currentLang === 'es' ? 'en' : 'es');
    });
  });

  applyLanguage();

})();
