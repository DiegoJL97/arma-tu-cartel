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

```
├── index.html
└── images/
    ├── hero-bg.webp
    ├── poster-bg.webp
    └── artists/
        ├── bad-bunny.webp
        ├── j-balvin.webp
        └── ... (108 fotos)
```

## Ejecutarlo en local

Hay que servir la carpeta por HTTP — **no abrir `index.html` con doble clic**. Bajo `file://` el navegador trata las imágenes como origen cruzado y "contamina" el canvas del póster, así que `canvas.toDataURL()` lanza un `SecurityError` y la pantalla de resultado se queda sin póster ni botones (descargar, jugar de nuevo...), sin ningún aviso visible más allá de la consola.

Con Node.js instalado, la forma más simple:

```bash
npm run serve
```

O con Python:

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000` en el navegador.

## Despliegue

Cualquier hosting de ficheros estáticos sirve: sube la carpeta completa (con `index.html` y `images/` dentro) a Netlify, Vercel, Cloudflare Pages o GitHub Pages. No requiere configuración adicional.

## Sugerencias

¿Alguna corrección o idea? Escribe a armatucartel@gmail.com — también hay un botón para enviar sugerencias directamente desde la pantalla de resultado del juego.

## Aviso

Juego de fans hecho con fines de entretenimiento, sin relación oficial con los artistas incluidos. Los datos de sueldo, aforo y valoración de directo son ficticios y sirven únicamente para la mecánica del juego. Las imágenes de artistas son ilustraciones generadas por IA, no fotografías reales.
