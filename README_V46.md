# FiguScan V46 — recorta la figurita sobre fondo blanco

## Qué cambió respecto a V45

En V45 el área de foto era blanca pero adentro se dibujaba TODO el frame del video, así que se veía la mesa/tela detrás de la figurita.

En V46:
1. **Detecta el rectángulo de la figurita** usando `detectDarkStickerBounds` y `detectStickerBounds` (busca el marco oscuro / cromo coloreado de la figurita).
2. **Dibuja SOLO ese recorte** sobre el fondo blanco. Lo de atrás (mesa, tela, mano, sombras) nunca aparece.
3. **No deforma**: el recorte se dibuja con `object-fit: contain` respetando el aspect ratio real del bbox detectado.
4. **No hace zoom forzado**: deja un margen del 8% alrededor para que la figurita "respire" dentro del marco.
5. **No cambia tonos**: cero `ctx.filter` en el pipeline de captura. La foto que entra es la que se guarda.
6. **Fallback central**: si la detección falla, usa un bbox central generoso para que igual se vea solo la figurita centrada.
7. **Pequeño padding del 3%** en el bbox detectado para no cortar el borde por errores de 1-2 px.

## Lo que NO cambia

- Marco dorado y banda "FiguScan Mundial" del álbum.
- Resolución de salida 1080×1480.
- Sin filtros CSS sobre la imagen guardada.
- Guards anti doble-disparo (700 ms debounce + bloqueo si hay candidato).
- Bandera de Inglaterra St. George.
- Firebase, Vercel, estructura de datos, screens, OCR, álbum, repetidas, manual.

## Cache busting

- `index.html`: `app.js?v=46`, `styles.css?v=46`
- `service-worker.js`: `figuscan-v46-recorte-figurita-fondo-blanco`

## Deploy

Push a GitHub → Vercel rebuildea solo. Usuarios con la PWA bajan la nueva versión al primer abrir.
