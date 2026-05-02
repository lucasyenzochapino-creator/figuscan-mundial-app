# FiguScan V45 — foto blanca, tonos originales, sin zoom y sin doble disparo

## Qué cambia respecto a V37

1. **Fondo BLANCO detrás de la foto.** Toda foto que se saque queda con fondo blanco, sin gradientes oscuros ni overlays dorados encima de la figurita.
2. **Sin zoom forzado.** Se quitó la detección agresiva de bordes (`detectStickerBounds` / `createForegroundCutout` / `buildCleanStickerBox`). Ahora se hace un recorte central 3:4 generoso y se dibuja con `object-fit: contain` dentro del marco — la figurita conserva su tamaño y proporciones reales.
3. **Sin filtros que cambien tonos.** Se eliminaron los `ctx.filter='contrast/brightness/saturate'` del canvas y los `filter:contrast(1.08) saturate(1.08)` del CSS de `.sticker-photo img`.
4. **No saca varias fotos seguidas.** Tres guards en `scanFrame` y `handleScannerFrameTap`:
   - Si ya hay `scanCandidate` activo no dispara.
   - Debounce de 700 ms entre disparos.
   - No reinicia la cámara después de capturar mientras hay candidato pendiente.
5. **Inglaterra con bandera.** Se cambió `🏴` por `🏴󠁧󠁢󠁥󠁮󠁧󠁿` (St. George subdivision tag), que renderiza correctamente en Android moderno.

## Cache busting

- `index.html` apunta a `app.js?v=45` y `styles.css?v=45`.
- `service-worker.js` usa `CACHE_NAME = 'figuscan-v45-foto-blanca-sin-zoom'` y borra caches viejos al activarse.

## Lo que NO se tocó

Firebase, Vercel config, estructura de datos, screens, navegación, OCR, álbum, repetidas, carga manual, lista de países (salvo flag de ENG).

## Deploy

Push del zip a GitHub → Vercel rebuildea solo. Los celulares con la PWA instalada bajan la versión nueva al primer abrir gracias al bump de cache.
