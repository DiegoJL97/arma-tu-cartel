# Arma tu Cartel — contexto del proyecto

Este documento resume todo lo decidido, construido y pendiente hasta ahora, para retomar el desarrollo sin perder contexto.

## Qué es

Juego web de un solo jugador: arma el cartel de tu festival de reggaetón ideal eligiendo 10 artistas de un roster de 108 reales, sin pasarte de presupuesto, y luego vives una simulación en directo del festival con eventos aleatorios que afectan al "hype" del público. Al final se calcula una puntuación y se genera un póster descargable/compartible. Interfaz completamente bilingüe (español/inglés).

Nombre actual: **Arma tu Cartel**. Se decidió mantenerlo (ver sección "Naming y dominio" más abajo) tras valorar alternativas.

## Stack y estructura de ficheros

Vanilla HTML/CSS/JS, sin build step ni dependencias externas en tiempo de ejecución (aparte de Google Fonts por `@import`). **Todo lo publicable vive en `public/`** — es la carpeta que se despliega tal cual; el resto del repo (`api/`, `tests/`, `package.json`...) es herramientas de desarrollo que nunca llegan al navegador. El JS de cliente es una IIFE en `public/js/app.js` que importa `public/js/engine.js` como módulo ES nativo (ver "Motor de juego compartido" más abajo); `index.html` carga `app.js` con `<script type="module">`.

```
public/
  index.html
  css/styles.css
  js/app.js
  js/engine.js          (motor de juego: datos, RNG con semilla, puntuación — compartido con el Worker)
  robots.txt
  sitemap.xml
  images/
    hero-bg.webp        (fondo de la pantalla de inicio)
    poster-bg.webp       (fondo del póster generado, 1536x1024 exacto — ver nota abajo)
    og-image.jpg          (1200x630, para Open Graph/Twitter Card)
    flags/                (34 banderas de país para la clasificación, ver esa sección)
    artists/
      bad-bunny.webp
      ... (108 fotos, un fichero por artista, slug ascii en minúsculas)
api/                     (Worker de Cloudflare — ver sección "Clasificación")
tests/                   (tests jsdom, leen desde public/)
```

**Importante sobre `poster-bg.webp`**: el código de generación del póster (`buildPosterCanvas`, `computePosterLayout`) asume que esta imagen mide exactamente `POSTER_BG_SRC_W=1536` x `POSTER_BG_SRC_H=1024` px. Si se sustituye por otra imagen con otras dimensiones, hay que actualizar esas dos constantes (y `POSTER_BG_SCALE = POSTER_WIDTH / POSTER_BG_SRC_W`) o el póster saldrá mal recortado/escalado.

**Requiere servirse por HTTP**, no abrir `public/index.html` con doble clic. Bajo `file://` las imágenes se cargan como origen cruzado, lo que "contamina" el canvas del póster: `canvas.toDataURL()` en `generatePoster()` (js/app.js) lanza `SecurityError`, y como esa llamada precede a `posterPreviewBox.classList.add('show')`, toda la caja del póster **y sus 4 botones** (descargar, compartir, jugar de nuevo, sugerencia) se quedan en `display:none` sin ningún aviso visible salvo el error en consola. Para probar en local: `npm run serve` (sirve `public/` en `http://localhost:8000`) o `cd public && python3 -m http.server 8000`.

Antes de una migración antigua todo (incluidas las 108 fotos) iba embebido en base64 dentro del propio HTML, que pesaba ~11,5MB. Ahora el HTML pesa ~12KB y las imágenes se piden bajo demanda (el navegador solo descarga la foto de un artista cuando ese artista se renderiza realmente en pantalla — no hace falta lazy-loading manual, es automático por cómo funciona `background-image: url(...)`).

## Motor de juego compartido (`engine.js`)

`public/js/engine.js` es un módulo ES real (sin build step: el navegador lo carga nativamente, y el Worker lo importa directamente — `wrangler` lo empaqueta con esbuild al desplegar). Es la **única fuente de verdad** para el roster, la tabla de eventos, la fórmula de puntuación y el RNG con semilla; lo importan tanto `app.js` (cliente) como `api/worker.js` (servidor), así que nunca pueden desincronizarse.

Exporta: `ARTISTS` (108 artistas), `TOTAL_ROUNDS`, `BUDGET`, `GENRE_COUNT`, `SIM_EVENTS`, `SIM_POSITIVE_KEYS`/`SIM_NEGATIVE_KEYS`, `createRng(seedStr)`, `generateSeed()`, `shuffleWithRng(arr, rng)`, `rollEventKeyWithRng(artist, index, rng)`, `buildSimOrder(lineup)` (reordena por sueldo ascendente — **no** es el orden de fichaje), `computeFinalScore(lineup, hypeFinal)`, y `playGame(seed, picks, decisions)` (reproducción completa y determinista de una partida, sin UI — la usa el Worker para calcular la puntuación real, ver "Clasificación").

RNG con semilla: **mulberry32** sembrado vía hash FNV-1a de un string legible (`generateSeed()` produce algo como `"c22c2d76"`). Con la misma semilla, la misma secuencia de barajado y de tiradas de eventos sale igual en cualquier máquina. Solo se usa para lo que afecta al resultado (barajar el roster, tirar eventos); el confeti y las notificaciones sociales siguen con `Math.random()` normal a propósito, para no mezclar efectos cosméticos con la reproducibilidad.

`app.js` genera la semilla y el RNG una sola vez por partida en `startGame()` (`state.seed`, `state.rng`), y **reutiliza la misma instancia de RNG** para el barajado inicial y para toda la simulación — crítico para que la reproducción del servidor coincida exactamente. Cada elección de tarjeta se registra en `state.picks` (índice 0/1/2) y cada decisión de evento en `state.decisions`, en el orden en que ocurren. `startSimulation()` precalcula el plan completo de los 10 conciertos **de una vez, al principio**, en vez de tirar cada evento sobre la marcha: así ver la simulación entera o saltarla siempre consumen exactamente las mismas tiradas de RNG y dan el mismo resultado (antes de esto, saltar vs. ver daban partidas distintas porque `simRollEventKey()` se llamaba en dos sitios distintos).

## Arquitectura del código (dentro del IIFE)

Orden aproximado en el fichero:
- `TRANSLATIONS`, `t()`, `L()`, `GENRE_LABELS`, `genreLabel()` — sistema de i18n (ver sección dedicada).
- `NOTIF_HANDLES`, `NOTIF_MESSAGES` — notificaciones sociales ficticias que reaccionan a las elecciones del jugador. Bilingües: cada mensaje es `{es, en}`.
- `ARTIST_IMAGES` — dict `nombre artista -> ruta relativa a su foto`.
- Funciones de flujo de juego: `startGame`, `nextRound`, `pickArtist`, `renderChoices`, `choiceCardMarkup`, `renderSidebar`.
- Funciones de simulación: `startSimulation`, `simPlayNextConcert`, `simRevealEvent`, `simRenderEventAuto`, `simRenderEventDecision`, `simSkip`, `simFinish`.
- `showResult`, `refreshResultTexts`, `overallLabel`, `generatePoster`, `buildPosterCanvas`, `computePosterLayout` — pantalla de resultado y generación del póster en Canvas.
- `applyLanguage`, `setLang` — aplican el idioma actual a toda la UI, incluida la regeneración del póster si el idioma se cambia estando ya en la pantalla de resultado.

`ARTISTS`, `SIM_EVENTS`, `BUDGET`, `TOTAL_ROUNDS` y `GENRE_COUNT` ya no viven en `app.js`: son alias a `Engine.ARTISTS` etc. (ver arriba).

## Sistema de i18n

- `localStorage['armaTuCartelLang']` guarda `'es'` o `'en'` (por defecto `'es'`).
- `TRANSLATIONS.es` / `TRANSLATIONS.en` son objetos anidados; `t('game.sectionTitle')` resuelve por ruta con puntos y hace fallback a español si falta la clave en el idioma activo.
- Textos estáticos del HTML usan `data-i18n="clave"` (y `data-i18n-alt` para atributos `alt`); `applyLanguage()` recorre el DOM y los traduce sin recargar la página.
- Textos que se generan dinámicamente con datos aleatorios (`SIM_EVENTS`, `NOTIF_MESSAGES`) no usan `data-i18n`: son objetos `{es, en}` resueltos en el momento con el helper `L()`.
- El género de cada artista se muestra traducido vía `genreLabel()` / `GENRE_LABELS`, pero el valor guardado en `ARTISTS` sigue siendo el string canónico en español (se usa internamente para lógica de juego, p. ej. contar géneros únicos).
- Botón de idioma: 4 instancias (una por pantalla), todas con `data-lang-toggle` y clase `.lang-toggle-floating` — **misma posición fija arriba a la derecha en las 4 pantallas** (esto se pidió explícitamente tras una primera versión donde el botón estaba integrado en la topbar de juego/simulación en vez de flotante).
- Cambiar de idioma en la pantalla de resultado regenera el póster y refresca textos sin recargar (`refreshResultTexts()`).

Para añadir un texto nuevo: añadir la clave a ambos bloques de `TRANSLATIONS`, y usar `data-i18n` en el HTML estático o `t('clave')` en JS.

## Responsive

Tres tramos, definidos al final de `css/styles.css`:

- **Escritorio (>1100px)** — layout original: columnas fijas laterales (notificaciones a la izquierda, lineup a la derecha) y 3 tarjetas en rejilla.
- **Tablet (768–1100px)** — igual que escritorio pero sin columnas fijas (no caben): el lineup y las notificaciones pasan a bloques estáticos bajo las tarjetas, las notificaciones como tira horizontal. Las tarjetas mantienen las 3 columnas hasta 768px.
- **Móvil (≤767px)** — rediseño completo:
  - Inicio: collage recortado a 4 caras + contador (`:nth-child(n+5){display:none}`), pasos compactos, CTA a ancho completo.
  - Juego: tarjetas en horizontal (foto 112px a la izquierda, datos a la derecha) para que las 3 quepan sin scroll; lineup como barra inferior fija y plegable. **Sin notificaciones** (decisión de Diego: el toast tapaba el título).
  - Simulación: foto en banda con altura `clamp(190px, 32vh, 268px)`, timeline en segmentos en vez de círculos numerados, botón de saltar en flujo con `margin-top:auto`.
  - Resultado: anillo de 132px, atributos en rejilla 2×2, botones en rejilla.

Dos detalles estructurales que sostienen esto:

- **`--choice-photo-h`**: variable en `.choice-card` que comparten `.choice-photo` y `.choice-name-overlay`. El nombre del artista vive **fuera** de `.choice-photo` (dentro de `.choice-body`) para poder colocarse a la derecha en móvil; en escritorio se superpone con `position:absolute` cubriendo exactamente la caja de la foto. Si se cambia la altura de la foto hay que hacerlo en esa variable, no en `.choice-photo`.
- **`.sidebar-text`**: envoltorio del nombre/género en `renderSidebar()`. Existe para que la barra plegada pueda ocultar el texto y dejar solo los avatares sin ocultar también el avatar (que es otro `div` hermano).

Tres trampas del móvil que ya costaron un bug y conviene no repetir:

- **El botón de idioma es `position:fixed`** y en las 4 pantallas está arriba a la derecha (decisión explícita de Diego). En móvil, en juego y simulación, se le da la misma caja que los pills de la topbar (`top:10px`, `padding:4px 9px`, `font-size:10.5px`, fondo sólido sin blur) para que se lea como un elemento más de la barra en vez de algo flotante encima. `.topbar-inner` reserva su hueco con `padding-right:60px`.
- **La topbar de móvil va justa de ancho**: `.topbar-inner` tiene `gap:12px` además del padding, y `flex-wrap:wrap`, así que en cuanto el contenido se pasa unos pocos px la barra se parte en dos filas (pasó con "Concierto 10 / 10" + presupuesto lleno). Por eso en móvil `.topbar-round` oculta la palabra y deja solo el contador. Al añadir cualquier cosa a esa barra, medir el peor caso: concierto 10/10 con el presupuesto casi agotado.
- **El botón de saltar simulación no puede ser `position:fixed`**: con un evento de decisión la tarjeta crece y los botones de opción quedaban debajo. Va en flujo con `margin-top:auto`, que lo baja al fondo solo cuando sobra sitio.
- **Las fotos de artista son casi cuadradas (261×281)**. Cualquier caja apaisada obliga a `background-size:cover` a recortar mucha altura: a 345×212 se veía solo el 57% y parecía un zoom excesivo. De ahí el `clamp` en `.sim-card-photo`.

Medido en navegador real a 375×812: inicio, juego y simulación sin scroll; resultado ~2px. En 375×667 (iPhone SE) los botones de decisión quedan sobre el pliegue, con ~60px de scroll solo para alcanzar el botón de saltar. Existe un bloque `@media (max-width:767px) and (max-height:700px)` que recorta lo prescindible en móviles bajos (oculta el badge de directo, aprieta márgenes).

## Clasificación (semanal y global)

Primera funcionalidad con backend. El sitio sigue siendo estático; la API es un Worker aparte.

**Estructura:**
```
api/
  schema.sql      tabla scores + indices (D1 / SQLite)
  worker.js       GET /api/leaderboard, POST /api/score
  wrangler.toml   binding de D1 y ALLOW_ORIGINS
```

**Interruptor**: la URL del Worker se configura en `public/index.html` con `<meta name="atc-api-base" content="...">`. **Vacío = clasificación desactivada**: el juego funciona igual y el enlace del inicio, el botón del resultado y el bloque de publicar se ocultan solos (`applyLeaderboardVisibility`). Los tests jsdom corren así, sin backend.

**Decisiones de diseño:**
- El alias se pide **al final**, en la pantalla de resultado, no antes de jugar: pedirlo antes metía un formulario en el punto de máximo abandono. Se guarda en `localStorage` (`armaTuCartelAlias`, `armaTuCartelCountry`, `armaTuCartelClientId`).
- Una sola tabla cubre ambas clasificaciones: la semanal filtra por `iso_week` (así el reinicio no necesita ninguna tarea programada) y las dos se deduplican por `client_id` para quedarse con el mejor cartel de cada jugador.
- Los nombres de país **no se traducen a mano**: salen de `Intl.DisplayNames` en el idioma activo. No hay lista de países duplicada.
- **Las banderas son imágenes, no emoji.** Windows no incluye banderas en su fuente de emoji (Segoe UI Emoji) en ningún contexto del DOM —ni siquiera en texto normal fuera de un `<select>`—, así que un código regional Unicode se veía como texto plano o un recuadro. `flagImgMarkup()` en app.js genera un `<img src="images/flags/{código}.png">`; las 34 banderas de `LB_COUNTRIES` están descargadas una vez en `images/flags/` (basadas en el set MIT "flag-icons" vía flagcdn.com, ~1-2KB cada una, sin dependencia externa en producción). Ojo: **sin `loading="lazy"`** a propósito — con lazy-loading real algunos entornos con problemas de compositing no llegan a disparar la carga. No confundir con `FLAG_SVGS` (más arriba, dibujadas a mano en SVG): esas cubren solo los ~10 países de artistas del roster para las tarjetas del juego, no los 34 de la clasificación.
- En móvil el bloque de publicar va **al final** de la pantalla de resultado (`order:1`), porque mide ~160px y empujaba el póster y los botones de compartir por debajo del pliegue.

**Seguridad — leer antes de tocar esto:**
- El alias lo escriben desconocidos y se muestra a otros usuarios: `lbRowMarkup()` pasa **siempre** por `escapeHtml()`. Verificado con un alias que contiene `<script>`.
- ✅ **Fase 2 hecha: puntuación verificada server-side.** El cliente ya no manda `score`/`genres`/`attendance`/`lineup` — manda `{seed, picks, decisions}` (`POST /api/score`), y `worker.js` importa `public/js/engine.js` y llama a `Engine.playGame(seed, picks, decisions)` para reproducir la partida entera y calcular la puntuación de verdad. Toda fila nueva queda con `verified = 1`. Cambio limpio y sin retrocompatibilidad (decisión explícita: solo había datos de prueba en la tabla, sin usuarios reales que romper) — el formato de fase 1 (`score` directo) ahora se rechaza con `bad_seed`. No hay distinción visual en el leaderboard entre filas fase 1 (`verified=0`, ya existentes) y fase 2 (decisión explícita: que se vea igual).
- Verificado end-to-end: una partida jugada de verdad en navegador (sin saltar, con decisiones reales) se capturó interceptando el `fetch` a `/api/score`, y su `{seed, picks, decisions}` se reprodujo de forma independiente tanto con `Engine.playGame()` en Node como contra `worker.js` corriendo en `wrangler dev --local` — los tres (cliente, replay en Node, Worker) dieron exactamente el mismo resultado (score, hype final, asistencia, géneros). También se probó que el Worker rechaza índices de elección fuera de rango, número incorrecto de decisiones, y el payload viejo de fase 1.
- La validación de `picks`/`decisions` es de dos capas: `worker.js` descarta basura obvia a nivel de tipo/rango antes de tocar el motor (`sanitizePicks`, `sanitizeDecisions`), y `Engine.playGame()` valida contra la partida real (p. ej. el número exacto de decisiones lo determina la partida, no lo declara el cliente) — un intento de manipular la partida lanza un error y el Worker responde 400.
- No se guarda la IP en claro, solo `SHA-256(IP + IP_SALT)` para limitar abuso, con una purga sugerida a los 30 días al final de `schema.sql`.
- El filtro de alias (`BLOCKLIST` en worker.js) es mínimo y hay que ampliarlo.
- Pendiente, no bloqueante: el modo reto diario (mismo seed para todos cada día) queda desbloqueado por esta misma infraestructura de semilla — ver roadmap.

**Pasos pendientes en Cloudflare** (no se pueden hacer desde el repo): crear la BD, aplicar el esquema, poner el secreto `IP_SALT`, desplegar y pegar la URL en el meta tag. ✅ Ya hecho — API en `https://arma-tu-cartel-api.djara.workers.dev`.

**Desarrollo local del Worker**: `cd api && wrangler dev --local --port 8787` (necesita `api/.dev.vars` con `IP_SALT`, copiado de `.dev.vars.example` — gitignored). Para reiniciar la D1 local: `wrangler d1 execute arma-tu-cartel --local --file=schema.sql`.

## Despliegue

**El sitio está publicado en Cloudflare Pages**: `https://arma-tu-cartel.pages.dev` (proyecto `arma-tu-cartel`, rama de producción `main`, carpeta de build `public/`). La API vive aparte, en el Worker de la sección anterior.

- **Despliegue manual** (mientras no haya integración con Git — ver más abajo):
  ```
  wrangler pages deploy public --project-name=arma-tu-cartel --branch=main
  ```
  Se ejecuta desde la raíz del repo. Como `public/` ya contiene solo lo publicable, no hace falta copiar nada a una carpeta temporal.
- **Integración con Git (repo → deploy automático)**: pendiente de conectar desde el dashboard de Cloudflare (Workers & Pages → proyecto `arma-tu-cartel` → Settings → Builds & deployments → Connect to Git), paso que requiere el navegador/cuenta de Diego y no se puede hacer desde el repo. Build command: ninguno. Build output directory: `public`. Una vez conectado, cada `git push` a `main` despliega solo, y las demás ramas generan URLs de preview — esas URLs de preview no están en `ALLOW_ORIGINS`, así que la clasificación no funcionará ahí hasta que se añadan si hace falta.
- **CORS**: `ALLOW_ORIGINS` en `api/wrangler.toml` incluye `https://arma-tu-cartel.pages.dev` además de `localhost:8000` y `armatucartel.com`. Si el dominio final es otro, hay que añadirlo aquí y volver a hacer `wrangler deploy` en `api/` — si no, la clasificación fallará en silencio por CORS en el dominio nuevo.
- **`armatucartel.com` sigue sin confirmarse** (ver sección "Naming y dominio"). Los meta tags `canonical`/`og:url` y las URLs dentro de `sitemap.xml`/`robots.txt` ya apuntan a ese dominio de forma aspiracional — hay que corregirlos si se acaba usando otro.
- Verificado end-to-end contra el sitio real: carga de assets, `GET /api/leaderboard` y `POST /api/score` con CORS cruzado real (no local) — sin errores. La validación de longitud de alias en servidor (`MAX_ALIAS=16`) se confirmó de paso: un envío que saltaba el `maxlength` del HTML llegó truncado correctamente por el Worker.

## Mecánicas de juego y balance actual

- 10 rondas, elección entre 3 artistas cada ronda.
- **`BUDGET = 30`** (histórico: empezó en 40, bajó a 35, y a 30 tras reanalizar con el roster ya editado por Diego — la media de sueldos había subido a 2,6M y con 35 el 90% de partidas "casuales" pasaban sin esfuerzo).
- 8 géneros canónicos: `Dembow`, `Nueva Escuela`, `Productores`, `Reggaetón`, `Reggaetón Romántico`, `Trap`, `Urbano Pop`, `Vieja Escuela`.
- Puntuación final: `0.25×asistencia + 0.25×directo + 0.20×variedad de géneros + 0.30×hype final`, más un ajuste por presupuesto (penaliza pasarse, premia ligeramente gastar cerca del límite sin pasarse). Clamp 0-100.
- Hype: empieza en 40, cada concierto aplica `round((live-50)/5)` más el delta del evento aleatorio de esa ronda (si lo hay). Los eventos positivos y negativos se reequilibraron una vez en la sesión para que no fuera "todo fácil".
- Roster: se eliminaron 5 artistas por baja relevancia/inactividad (Wisin & Yandel, Plan B, Héctor & Tito, Tego Calderón, Hector El Father). Se aplicaron ~244+ correcciones de atributos (sueldo/aforo/directo/género/nacionalidad) tras cruzar 3 revisiones externas y verificar factualmente vía búsqueda web las discrepancias.

## Cabo suelto sin resolver

Durante la revisión de atributos se verificó (vía búsqueda web) que las reclasificaciones de género de **Kapo** (Trap → Afrobeat-Urbano/Urbano Pop) y **El Bogueto** (Dembow → Reggaetón) eran correctas, pero por un fallo se quedaron fuera de la tabla final que Diego aprobó, así que **nunca se aplicaron al código**. Se le avisó explícitamente y no ha respondido todavía si quiere aplicarlas. Prioridad baja pero pendiente.

## Testing

Dos scripts jsdom (headless, sin navegador real) en `tests/`, que hay que ejecutar tras cualquier cambio. Requieren Node.js + `npm install` (instala `jsdom`, única devDependency):
- **`tests/drive_hype.js`** (`npm run test:hype`) — juega 5 partidas completas de principio a fin (elige, simula, resultado, póster), comprueba que no hay errores y que el canvas del póster se genera.
- **`tests/drive_i18n.js`** (`npm run test:i18n`) — 35 comprobaciones: idioma por defecto, cambio a inglés en cada pantalla, textos traducidos correctamente en juego/simulación/resultado (incluido el aviso legal del landing), vuelta a español con refresco en vivo en la pantalla de resultado.
- `npm test` ejecuta ambos.

**Aviso importante**: estos tests validan lógica/DOM, no diseño visual real — jsdom no renderiza CSS ni layout de verdad. **En todo el proyecto nunca se ha verificado el aspecto visual en un navegador real.** Antes de un lanzamiento público, hacer una pasada visual en dispositivos/navegadores reales es una tarea pendiente crítica.

## Naming y dominio (resumen de la decisión)

Se valoró cambiar el nombre pero se decidió **mantener "Arma tu Cartel"**. Puntos clave:
- La traducción al inglés del *branding* usa **"Build Your Lineup"**, no una traducción literal de "cartel" (en inglés "cartel" se lee casi siempre como cartel de droga, no como póster de festival).
- `buildyourlineup.com` se descartó como dominio: "build your lineup" es una frase genérica ya saturada por toda la industria del fantasy sports (DraftKings, FanDuel y decenas de "lineup optimizers"), mala para SEO y sin ninguna señal de reggaetón/festival.
- `cartelurbano.com` ya es un medio colombiano de cultura urbana con 15+ años — evitar nombres parecidos.
- `armatucartel.com` dio una respuesta ambigua al consultarlo (podría estar registrado por una red de sitios tipo "armatucoso.com"); pendiente de verificar en un registrador real. Alternativas si no está libre: `.app`, `.games`, `.fun`.
- Si algún día se quiere una marca 100% bilingüe sin depender de "cartel", las ideas mejor valoradas fueron (en orden): **Fantasy Cartel**, **Cartelero**, **Perreo Draft**, **Fantasy Reggaetón**.

## Roadmap de funcionalidades

**Antes de lanzamiento público (pendiente):**
- ~~Meta tags Open Graph + favicon + meta description~~ — **hecho**: description, OG, Twitter Card, favicon (emoji 🎪 provisional), theme-color y `og-image.jpg` (1200x630, generado por Canvas a partir de los assets reales) en `public/index.html`.
- ~~Analítica básica y respetuosa con privacidad~~ — **hecho**: GoatCounter (sitio `armatucartel`, sin cookies, sin banner de consentimiento). Script en `public/index.html`. Eventos custom vía `trackEvent()` en `public/js/app.js`: `game-started` (startGame), `game-completed` (showResult), `poster-downloaded` (click en posterDownloadLink).
- Pasada de QA visual en navegadores/dispositivos reales — **nunca hecha**.
- ~~Aviso legal dentro de la propia app~~ — **hecho**: párrafo `.hero-disclaimer` al final de la pantalla de inicio (bajo el botón de empezar), bilingüe vía `landing.disclaimer`. Cubre: juego de fans sin relación oficial con artistas/representantes/discográficas, datos ficticios, imágenes generadas por IA (no fotos reales), y propiedad de nombres e imágenes. Estilo deliberadamente discreto (11px, `--muted`, opacidad 0.75).

**Corto plazo:**
- Modo "reto diario" (mismo pool de artistas para todos cada día) — la funcionalidad con más potencial viral identificada, estilo Wordle. Ya tiene la infraestructura lista (semilla determinista + replay en servidor de la fase 2 del leaderboard); "misma semilla para todos hoy" es prácticamente gratis con `engine.js` tal como está.
- Formato de póster vertical 9:16 para Instagram Stories.
- ~~Leaderboard real~~ — **hecho, fases 1 y 2** (ver sección "Clasificación"): API en `api/`, pantalla y bloque de publicar en el cliente, puntuación verificada server-side con motor compartido (`engine.js`) y RNG con semilla.

**Más adelante:**
- Modo cabeza a cabeza entre dos amigos (draft alternado).
- Cuentas de usuario / sincronización entre dispositivos.
- Rotación/ampliación estacional del roster.
- PWA instalable con caché offline (encaja bien ahora que el peso de carga ya es bajo).
- Expansión a artistas anglosajones (ligado a la decisión de naming).

## Convenciones de trabajo con Diego

- Antes de tocar código en cambios visuales/de diseño, explicar el enfoque (y a veces generar mockups) y esperar aprobación explícita.
- Los cambios de balance de juego (presupuesto, fórmulas de puntuación/hype) se justifican con simulaciones de datos reales sobre el roster actual, no a ojo.
- Todo cambio se verifica antes de darlo por cerrado: comprobación de sintaxis + los dos scripts de test jsdom.
- Comunicación preferida: concisa y directa, sin rodeos innecesarios.

## Política de privacidad

`public/privacidad.html` — página estática aparte, enlazada desde el aviso legal del inicio (`.hero-privacy-link`) y desde el bloque de publicar en resultado (`.publish-privacy-link`). Explica qué se guarda en `localStorage`, qué se guarda en el servidor al publicar (alias, país, puntuación/lineup, IP solo como hash), qué NO se hace (sin cuentas, sin cookies de rastreo, sin venta de datos), y cómo pedir que se borre algo.

**Deliberadamente no reutiliza `app.js`**: cargar el script completo del juego en esta página rompería, porque tiene varios `document.getElementById(...).addEventListener(...)` sin comprobar null (asumen que los elementos del juego existen). En vez de eso, la página lleva su propio script mínimo de traducción (objeto `T` con `es`/`en`), que sí lee y escribe la misma clave `armaTuCartelLang` de `localStorage`, así que el idioma queda sincronizado con el resto del sitio sin depender de `app.js`.

**Pendiente real, no maquillado en el texto**: la política dice explícitamente que el borrado del hash de IP (`ip_hash` en `scores`) no está automatizado todavía — porque no lo está (ver el comentario de purga sugerida al final de `schema.sql`). Si se automatiza (p. ej. un Cron Trigger en el Worker), hay que actualizar esa frase.

## Contacto / branding en el propio juego

Botón de sugerencias en la pantalla de resultado → `mailto:armatucartel@gmail.com`. El asunto del email cambia según el idioma activo.
