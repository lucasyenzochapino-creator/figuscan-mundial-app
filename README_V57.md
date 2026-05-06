# FiguScan V57

## Compartir simple

- "Compartir mi álbum" ahora manda un LINK clickeable. Tu amigo lo toca y se abre la app con tu álbum ya cargado. No hay que copiar/pegar nada.
- Botón nuevo "Invitar amigo a usar la app" — manda mensaje listo con instrucciones de instalación para Android y iPhone.
- Si la app se abre con `?amigo=...` en la URL, importa al amigo automáticamente y va al detalle.

## Bug del ícono arreglado

- vercel.json tenía un rewrite que mandaba TODAS las URLs a /index.html, incluyendo los PNG. Por eso Android no veía el ícono.
- Ahora excluye /assets/, manifest, app.js, styles.css, service-worker y formatos comunes (png, jpg, svg, etc).
- Cache headers correctos por path.

Cache: app.js?v=57, styles.css?v=57, figuscan-v57-link-clickeable-invitar.
