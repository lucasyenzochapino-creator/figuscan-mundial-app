# FiguScan V50 — foco arreglado y marco Panini real

## Problema 1: cosas fuera de foco en partes de la app

**Causa**: la app usaba `backdrop-filter: blur(...)` en muchísimos lugares (secciones, nav, modales, viewer, badge de auto-scan, botón eliminar foto, flash). En Android medio-bajo eso causa:
- Bordes borrosos alrededor de elementos contiguos por bugs de stacking context.
- Sub-pixel rendering del texto cercano se rompe → letras y íconos se ven "mojados".
- Performance baja al hacer scroll.

**Solución**:
- `.section { backdrop-filter: blur(16px) }` → **eliminado** (era el peor, estaba en TODAS las secciones).
- `.bottom-nav { blur(18px) }` → **blur(4px)** (apenas perceptible, mantiene estilo).
- `.viewer-back { blur(12px) }` → **blur(2px)**.
- `.modal-back { blur(6px) }` → **eliminado**, fondo más opaco compensando.
- `.auto-scan-badge { blur(10px) }` → **eliminado**, fondo más opaco.
- `.remove-photo-btn { blur(10px) }` → **eliminado**.
- `.flash-fab { blur(10px) }` → **eliminado**.

## Problema 2: marco de captura mejorado

**Cambios al marco que se genera al sacar foto** (en `captureStickerImage`):

1. **Fondo blanco con tinte cálido sutil** (gradient #FFFFFF → #FFFBF0 → #FFFFFF). El blanco puro plano se sentía clínico; este tinte cromo hace que parezca una página de álbum real.
2. **Doble borde dorado externo**: línea principal gruesa (7px de oro brillante #D4AF37) + línea fina exterior (oro profundo #8A6415) + línea fina interior (oro 45% opacidad). Triple capa típica de cromos Panini.
3. **Passe-partout dorado claro** (#FAF0D2) entre el marco externo y el área de foto. Es la "matita" de cartón color crema que tienen los álbumes premium.
4. **4 esquinas decorativas triangulares doradas** estilo cromo de colección.
5. **Sombra suave** debajo de la figurita para darle cuerpo (no toca la figurita, solo eleva).
6. **Banda inferior tipo placa metálica**: gradient dorado completo (#F4D77A → #D4AF37 → #8A6415), borde fino oscuro, highlight blanco superior efecto cromo, texto "FIGUSCAN MUNDIAL" en marrón oscuro centrado y bold.

## Lo que NO cambió

- Lógica de detección de figurita (V48: saturación + percentiles + validación).
- Tonos de la figurita (sin filtros).
- Ratio (no deforma, sigue object-fit:contain).
- Carga rápida por lote (V49).
- Catálogo de países (V49).
- Bandera Inglaterra St. George.
- Firebase, Vercel, OCR, álbum, repetidas, manual, screens.

## Cache

- `index.html`: `app.js?v=50`, `styles.css?v=50`
- `service-worker.js`: `figuscan-v50-foco-marco-panini`

## Próximas mejoras sugeridas (no aplicadas, para charlar)

1. **OCR del número con Tesseract.js** (ya está cargado, no se usa).
2. **Recordar último país elegido** entre cargas seguidas.
3. **Auto-snap**: cámara saca sola cuando detecta figurita centrada y enfocada.
4. **Sonido de éxito** al guardar (para no mirar la pantalla en cargas en serie).
