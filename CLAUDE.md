# Arma tu Cartel — contexto del proyecto

Este documento resume todo lo decidido, construido y pendiente hasta ahora, para retomar el desarrollo sin perder contexto.

## Qué es

Juego web de un solo jugador: arma el cartel de tu festival de reggaetón ideal eligiendo 10 artistas de un roster de 108 reales, sin pasarte de presupuesto, y luego vives una simulación en directo del festival con eventos aleatorios que afectan al "hype" del público. Al final se calcula una puntuación y se genera un póster descargable/compartible. Interfaz completamente bilingüe (español/inglés).

Nombre actual: **Arma tu Cartel**. Se decidió mantenerlo (ver sección "Naming y dominio" más abajo) tras valorar alternativas.

## Stack y estructura de ficheros

Vanilla HTML/CSS/JS, sin build step ni dependencias externas en tiempo de ejecución. Todo el código vive en un único `index.html` (una IIFE de JS al final del body). Las imágenes van externas (no embebidas), migradas recientemente para reducir el peso de carga:

```
index.html
images/
  hero-bg.webp        (fondo de la pantalla de inicio)
  poster-bg.webp       (fondo del póster generado, 1536x1024 exacto — ver nota abajo)
  artists/
    bad-bunny.webp
    ... (108 fotos, un fichero por artista, slug ascii en minúsculas)
```

**Importante sobre `poster-bg.webp`**: el código de generación del póster (`buildPosterCanvas`, `computePosterLayout`) asume que esta imagen mide exactamente `POSTER_BG_SRC_W=1536` x `POSTER_BG_SRC_H=1024` px. Si se sustituye por otra imagen con otras dimensiones, hay que actualizar esas dos constantes (y `POSTER_BG_SCALE = POSTER_WIDTH / POSTER_BG_SRC_W`) o el póster saldrá mal recortado/escalado.

**Requiere servirse por HTTP**, no abrir `index.html` con doble clic. Bajo `file://` las imágenes se cargan como origen cruzado, lo que "contamina" el canvas del póster: `canvas.toDataURL()` en `generatePoster()` (js/app.js) lanza `SecurityError`, y como esa llamada precede a `posterPreviewBox.classList.add('show')`, toda la caja del póster **y sus 4 botones** (descargar, compartir, jugar de nuevo, sugerencia) se quedan en `display:none` sin ningún aviso visible salvo el error en consola. Para probar en local: `npm run serve` (o `python3 -m http.server 8000`) y abrir `http://localhost:8000`.

Antes de esta migración todo (incluidas las 108 fotos) iba embebido en base64 dentro del propio HTML, que pesaba ~11,5MB. Ahora el HTML pesa ~111KB y las imágenes se piden bajo demanda (el navegador solo descarga la foto de un artista cuando ese artista se renderiza realmente en pantalla — no hace falta lazy-loading manual, es automático por cómo funciona `background-image: url(...)`).

## Arquitectura del código (dentro del IIFE)

Orden aproximado en el fichero:
- `TRANSLATIONS`, `t()`, `L()`, `GENRE_LABELS`, `genreLabel()` — sistema de i18n (ver sección dedicada).
- `ARTISTS` — array de 108 objetos `{name, genre, country, salary, attendance, live}`. `genre` es siempre uno de 8 valores canónicos en español (ver más abajo) y **nunca se traduce en el dato**, solo en su etiqueta mostrada vía `genreLabel()`.
- `NOTIF_HANDLES`, `NOTIF_MESSAGES` — notificaciones sociales ficticias que reaccionan a las elecciones del jugador. Bilingües: cada mensaje es `{es, en}`.
- `ARTIST_IMAGES` — dict `nombre artista -> ruta relativa a su foto`.
- `SIM_EVENTS` — los 10 eventos posibles durante la simulación (algunos con decisión del jugador). Textos bilingües `{es, en}`.
- Funciones de flujo de juego: `startGame`, `nextRound`, `pickArtist`, `renderChoices`, `choiceCardMarkup`, `renderSidebar`.
- Funciones de simulación: `startSimulation`, `simPlayNextConcert`, `simRevealEvent`, `simRenderEventAuto`, `simRenderEventDecision`, `simSkip`, `simFinish`.
- `showResult`, `refreshResultTexts`, `overallLabel`, `generatePoster`, `buildPosterCanvas`, `computePosterLayout` — pantalla de resultado y generación del póster en Canvas.
- `applyLanguage`, `setLang` — aplican el idioma actual a toda la UI, incluida la regeneración del póster si el idioma se cambia estando ya en la pantalla de resultado.

## Sistema de i18n

- `localStorage['armaTuCartelLang']` guarda `'es'` o `'en'` (por defecto `'es'`).
- `TRANSLATIONS.es` / `TRANSLATIONS.en` son objetos anidados; `t('game.sectionTitle')` resuelve por ruta con puntos y hace fallback a español si falta la clave en el idioma activo.
- Textos estáticos del HTML usan `data-i18n="clave"` (y `data-i18n-alt` para atributos `alt`); `applyLanguage()` recorre el DOM y los traduce sin recargar la página.
- Textos que se generan dinámicamente con datos aleatorios (`SIM_EVENTS`, `NOTIF_MESSAGES`) no usan `data-i18n`: son objetos `{es, en}` resueltos en el momento con el helper `L()`.
- El género de cada artista se muestra traducido vía `genreLabel()` / `GENRE_LABELS`, pero el valor guardado en `ARTISTS` sigue siendo el string canónico en español (se usa internamente para lógica de juego, p. ej. contar géneros únicos).
- Botón de idioma: 4 instancias (una por pantalla), todas con `data-lang-toggle` y clase `.lang-toggle-floating` — **misma posición fija arriba a la derecha en las 4 pantallas** (esto se pidió explícitamente tras una primera versión donde el botón estaba integrado en la topbar de juego/simulación en vez de flotante).
- Cambiar de idioma en la pantalla de resultado regenera el póster y refresca textos sin recargar (`refreshResultTexts()`).

Para añadir un texto nuevo: añadir la clave a ambos bloques de `TRANSLATIONS`, y usar `data-i18n` en el HTML estático o `t('clave')` en JS.

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
- **`tests/drive_i18n.js`** (`npm run test:i18n`) — 33 comprobaciones: idioma por defecto, cambio a inglés en cada pantalla, textos traducidos correctamente en juego/simulación/resultado, vuelta a español con refresco en vivo en la pantalla de resultado.
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
- Meta tags Open Graph + favicon + meta description (para que compartir el enlace se vea bien en redes) — **no implementado todavía**.
- Analítica básica y respetuosa con privacidad (Plausible/Fathom o similar) — **no implementado**.
- Pasada de QA visual en navegadores/dispositivos reales — **nunca hecha**.
- Aviso legal dentro de la propia app (ya está en el README, falta dentro del juego) sobre datos ficticios / juego de fans no oficial, dado que usa nombres y fotos reales de artistas.

**Corto plazo:**
- Modo "reto diario" (mismo pool de artistas para todos cada día) — la funcionalidad con más potencial viral identificada, estilo Wordle.
- Formato de póster vertical 9:16 para Instagram Stories.
- Leaderboard real (ahora mismo solo hay récord personal en `localStorage`, sin backend).

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

## Contacto / branding en el propio juego

Botón de sugerencias en la pantalla de resultado → `mailto:armatucartel@gmail.com`. El asunto del email cambia según el idioma activo.
