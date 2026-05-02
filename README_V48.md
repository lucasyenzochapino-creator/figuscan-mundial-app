# FiguScan V48 — figurita rectangular sobre fondo blanco

## El problema en V47

El algoritmo `createForegroundCutout` (flood-fill desde los bordes) producía dos artefactos visibles:
1. **Bordes "comidos" / rasgados** en la figurita, porque el flood-fill atravesaba el marco oscuro de la figurita por puntos donde se conectaba con la mesa.
2. **Restos de mesa** en zonas que no estaban conectadas al borde exterior pero seguían siendo fondo (parecen rasguños de madera).

## La solución en V48

**Eliminar el cutout completamente.** En lugar de borrar pixel por pixel, recortamos un rectángulo limpio de la figurita y lo dibujamos sobre fondo blanco. Para que el rectángulo sea ajustado a la figurita real (no a la mesa), mejoré la detección:

1. **Detección por saturación con percentiles** (`detectColorfulStickerBounds`):
   - Busca pixels con saturación alta (camisetas, campo, escudos).
   - **Umbrales adaptativos**: si hay muchos pixels saturados (>5% del frame) usa umbral estricto (sat >= 75); si hay pocos (>4%), baja a sat >= 45 para capturar figuritas con tonos pastel/apagados (arqueros, etc.).
   - **Percentiles 4-96** para descartar outliers (un pixel rojo perdido en la mesa no infla el bbox).
   - Padding del 8% para incluir el marco oscuro alrededor.

2. **Validación anti-detección-mala**: si el bbox detectado abarca más del 85% del ancho o 92% del alto, se descarta (señal de que se incluyo mesa).

3. **Fallback central apretado**: si la detección falla, bbox central de 60%x80% (más apretado que el 74%x86% anterior).

4. **Render limpio sobre BLANCO**:
   - Área de foto pintada blanca.
   - Rectángulo del bbox dibujado con `object-fit: contain` (no deforma).
   - Margen del 8% para que la figurita no quede pegada al borde dorado.

## Lo que sigue intacto

- Marco externo dorado + marco interno dorado (estilo Panini).
- Banda inferior "FiguScan Mundial".
- Sin filtros CSS / canvas — tonos originales 100%.
- Guards anti doble-disparo (700 ms debounce + bloqueo si hay candidato).
- Bandera de Inglaterra St. George.
- Firebase, Vercel, OCR, álbum, repetidas, manual, screens, navegación.

## Cache busting

- `index.html`: `app.js?v=48`, `styles.css?v=48`
- `service-worker.js`: `figuscan-v48-bbox-saturacion-sin-floodfill`

## Limitación conocida

Si la cámara se aleja mucho (figurita muy chica en el frame), el bbox puede incluir un poco de mesa al borde. La detección por saturación + percentiles minimiza esto pero no lo elimina al 100%. Recomendación: acercar el celu a la figurita para que ocupe al menos 50% del recuadro guía.
