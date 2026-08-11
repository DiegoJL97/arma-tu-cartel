# Arma tu Cartel

Arma el line-up de tu festival de reggaetón ideal con presupuesto limitado, vive la simulación en directo y comparte tu póster. Más de 100 artistas reales, bilingüe ES/EN.

## Descripción

Arma tu Cartel es un juego web en el que construyes el cartel de tu festival de reggaetón soñado: eliges 10 artistas de un roster de más de 100, sin pasarte del presupuesto. Cada elección desata reacciones en redes ficticias, y una vez cerrado el cartel, vives la simulación del festival en directo con eventos aleatorios y decisiones que afectan al hype del público. Al final obtienes una puntuación, un póster descargable con tu line-up, y la opción de compartirlo. Disponible en español e inglés.

## Cómo se juega

1. **Arma tu lineup** — elige un artista de entre 3 opciones en cada una de las 10 rondas, sin pasarte del presupuesto disponible.
2. **Vive la simulación** — cada concierto puede salir bien o torcerse: eventos aleatorios (fallos técnicos, momentos virales, lluvia...) afectan al hype del público, y algunos te dejan decidir cómo reaccionar.
3. **Consigue tu cartel** — al final obtienes una puntuación basada en la asistencia total, la calidad de los directos, la variedad de géneros y el hype conseguido, más un póster de tu festival listo para descargar o compartir.

## Características

- Roster de 108 artistas reales del género urbano, con datos de sueldo, aforo y calidad de directo.
- Sistema de eventos en directo con decisiones que afectan al resultado final.
- Panel de notificaciones sociales que reacciona a tus elecciones en tiempo real.
- Récord personal guardado en local.
- Póster de festival generado en Canvas, descargable y compartible.
- Interfaz completamente bilingüe (español / inglés) con selector de idioma persistente.
- Diseño responsive.

## Tecnología

Vanilla HTML, CSS y JavaScript. Sin frameworks, sin build step ni dependencias externas en tiempo de ejecución. Todas las imágenes se sirven como ficheros WebP externos (no van embebidas en el HTML), para que la página cargue rápido incluso en conexiones móviles.

## Estructura del proyecto

Todo lo publicable vive en `public/` — es la carpeta que se despliega tal cual, sin build step. El resto del repo (`api/`, `tests/`, `package.json`...) es herramientas de desarrollo, nunca se sirve al navegador.

```
public/
├── index.html
├── css/styles.css
├── js/app.js
├── robots.txt
├── sitemap.xml
└── images/
    ├── hero-bg.webp
    ├── poster-bg.webp
    ├── og-image.jpg
    ├── flags/            (banderas de país para la clasificación)
    └── artists/
        ├── bad-bunny.webp
        ├── j-balvin.webp
        └── ... (108 fotos)
api/                       (Worker de Cloudflare para la clasificación — ver CLAUDE.md)
tests/                     (tests jsdom)
```

## Ejecutarlo en local

Hay que servir `public/` por HTTP — **no abrir `public/index.html` con doble clic**. Bajo `file://` el navegador trata las imágenes como origen cruzado y "contamina" el canvas del póster, así que `canvas.toDataURL()` lanza un `SecurityError` y la pantalla de resultado se queda sin póster ni botones (descargar, jugar de nuevo...), sin ningún aviso visible más allá de la consola.

Con Node.js instalado, la forma más simple:

```bash
npm run serve
```

O con Python:

```bash
cd public && python3 -m http.server 8000
```

Y abrir `http://localhost:8000` en el navegador.

## Despliegue

**Ya está publicado**: [arma-tu-cartel.pages.dev](https://arma-tu-cartel.pages.dev) (Cloudflare Pages, carpeta de build `public/`). El despliegue es manual por ahora — para publicar cambios:

```bash
wrangler pages deploy public --project-name=arma-tu-cartel --branch=main
```

Cualquier otro hosting de ficheros estáticos también sirve: sube el contenido de `public/` (no la raíz del repo) a Netlify, Vercel o GitHub Pages. No requiere configuración adicional. La clasificación necesita además el Worker de `api/` — ver `CLAUDE.md`.

## Sugerencias

¿Alguna corrección o idea? Escribe a armatucartel@gmail.com — también hay un botón para enviar sugerencias directamente desde la pantalla de resultado del juego.

## Aviso

Juego de fans hecho con fines de entretenimiento, sin relación oficial con los artistas incluidos. Los datos de sueldo, aforo y valoración de directo son ficticios y sirven únicamente para la mecánica del juego. Las imágenes de artistas son ilustraciones generadas por IA, no fotografías reales.
