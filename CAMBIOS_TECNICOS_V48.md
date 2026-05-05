# Cambios técnicos V48

## Cámara

- Monkey patch de `navigator.mediaDevices.getUserMedia` para mejorar constraints antes de que arranque la app.
- Fallback seguro si un teléfono rechaza constraints avanzadas.
- `applyConstraints` progresivo según `track.getCapabilities()`.
- Soporte para `focusMode: continuous` cuando existe.
- Toque sobre el video para intentar foco puntual.

## Marco

- Contenedor `.figuscan-v48-camera-card` con proporción 63/88.
- Esquinas doradas y guía interna.
- `object-fit: cover` para que la cámara llene el marco sin deformar.

## Mobile

- `overflow-x: hidden` global.
- `box-sizing: border-box` global.
- `input`, `textarea`, `select` con `width: 100%` en móvil.
- Padding inferior para que nav fija no tape contenido.

## Cache

- Archivo `figuscan-v48-refresh.js` para limpiar caches viejos relacionados con FiguScan/V47.
