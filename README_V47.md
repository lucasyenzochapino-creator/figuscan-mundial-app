# FiguScan V47 — figurita sobre fondo blanco real (cutout de mesa/tela)

## El problema en V46

La detección anterior buscaba pixels oscuros (`detectDarkStickerBounds`). Sobre una **mesa de madera oscura** los pixels oscuros se conectan con el marco negro de la figurita y el bbox detectado abarca toda la mesa. Resultado: dentro del marco interno se veía toda la madera.

## La solución en V47

1. **Nueva detección por saturación de color** (`detectColorfulStickerBounds`):
   - Busca pixels con saturación >= 70 (camisetas, campo verde, escudos, cromados).
   - La mesa de madera tiene saturación baja (<55) → queda excluida.
   - Calcula el bbox de los pixels saturados y le agrega 6% de padding para incluir el marco.

2. **Cadena de detección** en orden:
   - `detectColorfulStickerBounds` (color) → primera elección, robusta vs mesas/telas.
   - `detectDarkStickerBounds` (marco oscuro) → fallback.
   - `detectStickerBounds` (bordes generales) → último fallback.
   - `buildCleanStickerBox` central → si todo lo anterior falla.

3. **Cutout flood-fill MÁS permisivo** (`createForegroundCutout`):
   - Threshold superior: 0.74 → **0.92**. Ahora aplica el cutout incluso cuando la mesa ocupa hasta el 92% del bbox.
   - Threshold inferior: 0.06 → **0.04**. Para casos donde casi no hay mesa visible.
   - El flood fill desde los bordes borra el fondo conectado al exterior con alpha=0.

4. **Render sobre BLANCO**:
   - El área dentro del marco interno se pinta blanco.
   - El cutout se dibuja encima → los pixels transparentes muestran el blanco.
   - Margen del 8% para que la figurita no quede pegada al borde dorado.
   - `object-fit: contain` → no deforma.

## Lo que sigue intacto

- Marco externo dorado + marco interno dorado (estilo Panini).
- Banda inferior "FiguScan Mundial".
- Sin filtros CSS / canvas → tonos originales.
- Guards anti doble-disparo.
- Bandera de Inglaterra St. George.
- Firebase, Vercel, OCR, álbum, repetidas, manual, screens.

## Cache busting

- `index.html`: `app.js?v=47`, `styles.css?v=47`
- `service-worker.js`: `figuscan-v47-deteccion-color-fondo-blanco`

## Deploy

Push a GitHub → Vercel rebuildea solo. PWA en celulares baja la nueva versión al primer abrir.
