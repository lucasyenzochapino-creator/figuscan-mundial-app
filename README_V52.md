# FiguScan V52 — fix del "fuera de foco" definitivo

## Lo que era el problema real

En las screenshots anteriores se veía un patrón grande translúcido (tipo silueta dorada) detrás del botón "Tengo" y otras zonas. **No era desenfoque CSS** como pensé en V50 — es el SVG decorativo del trofeo (`.bg-trophy`) que está con `position: fixed` al fondo de la app, con opacidad 0.23 en modo dark.

Como las secciones (`.section`) tenían fondo `rgba(255,255,255,0.08)` (8% blanco translúcido), el trofeo se veía **a través** de la sección. Eso da la sensación de "está borroso" porque hay una textura grande detrás.

## Fix V52

1. **Trofeo decorativo bajado de 0.23 a 0.07** opacidad (modo dark) y de 0.16 a 0.06 (modo light). Sigue ahí como detalle de marca pero ya no se cuela visiblemente.
2. **Secciones con fondo opaco oscuro**: `rgba(15,23,42,0.72)` en lugar de `rgba(255,255,255,0.08)`. Las secciones ahora tapan lo que tienen detrás. Mantienen el look "tarjeta levantada" porque siguen teniendo borde, sombra y radio.

## Lo que sigue de V51

- OCR automático del número con Tesseract.
- Sonido "ding" al guardar.
- Último país recordado entre cargas.
- Indicador de nitidez (varianza Laplaciano).

## Lo que sigue de V50

- Marco Panini real con doble línea, esquinas decorativas, banda metálica.
- backdrop-filter blurs problemáticos eliminados.

## Cache

- `index.html`: `app.js?v=52`, `styles.css?v=52`
- `service-worker.js`: `figuscan-v52-trofeo-opacidad-fondo-secciones`
