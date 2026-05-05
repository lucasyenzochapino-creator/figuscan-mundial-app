# FiguScan V51 — carga rápida de muchas figuritas

## Pack de mejoras para cargar muchas figuritas seguidas

### 1. OCR automático del número (Tesseract.js)
- Tesseract.js estaba cargado en `index.html` desde versiones viejas pero nunca se usaba.
- Ahora: al sacar foto, en background se lee el número de la figurita (la zona inferior derecha donde Panini imprime "546", "24", etc.).
- Si lo encuentra, **pre-llena el campo número**. Vos solo confirmás con un toque al estado (Tengo / Repetida / Falta).
- Si falla, no molesta: deja el campo vacío para que cargues a mano.
- Mientras corre se ve un pill "leyendo…" al lado del label.

### 2. Sonido de éxito al guardar
- "Ding" corto (acorde A5+E6 de 130ms) usando Web Audio API. Sin assets externos.
- Pensado para cargas en serie: vos cambiás la figurita debajo de la cámara, escuchás el ding, sabés que se guardó sin mirar la pantalla.
- Suena en `addOrUpdateSticker` (figurita nueva) y en `saveBatchQuick` (lote completo).
- Activable / silenciable. Preferencia persiste en localStorage.

### 3. Recordar último país elegido
- Después de cargar una figurita de "Portugal", la siguiente foto trae "Portugal" pre-cargado en el campo país.
- Lo mismo en el batch: si tu último lote fue de Argentina, el próximo lote arranca con Argentina.
- Persiste en localStorage. Sirve sobre todo cuando cargás un sobre entero del mismo país.

### 4. Indicador de calidad (nitidez)
- Después de capturar, se mide la nitidez de la foto con varianza de Laplaciano sobre el bbox detectado.
- Si está borrosa (varianza < 60), te avisa: "Foto algo borrosa. Si querés, sacá otra con la cámara más quieta."
- No bloquea el guardado. Solo informa para que decidas.
- Evita guardar fotos malas en el álbum sin tener que estar comparando.

## Lo que ya estaba y se aprovecha

- **Detección de duplicados** funciona perfecto: cargás un número que ya tenés y la app pregunta o lo marca como repetida automáticamente. No hubo que tocar nada.
- **Carga rápida por lote** existía desde V49. Ahora está mejor: pre-llena el último país y suena al guardar.

## Lo que NO cambió

- Lógica de detección de figurita (V48: saturación + percentiles + validación).
- Marco Panini real con esquinas decorativas (V50).
- Foco arreglado: blurs problemáticos eliminados (V50).
- Tonos de la figurita (sin filtros).
- Bandera Inglaterra St. George.
- Firebase, Vercel, OCR, álbum, repetidas, screens, navegación.

## Cache

- `index.html`: `app.js?v=51`, `styles.css?v=51`
- `service-worker.js`: `figuscan-v51-ocr-sonido-pais-recordado`

## Notas técnicas

- El OCR usa whitelist de dígitos `0123456789` y solo acepta resultados de 1-4 caracteres (filtra ruido como letras del nombre del jugador).
- La zona OCR es la franja inferior derecha del bbox (32% ancho × 13% alto) que es donde Panini Mundial imprime el número. Se reescala 2x con grayscale + contrast 1.6 para que Tesseract tenga más píxeles que leer.
- El sonido respeta el silenciado del celular vía Web Audio (no es notificación, es audio en sesión).
- La medición de nitidez toma el centro 60%×40% del bbox (donde está el cuerpo del jugador, máxima información de bordes).

## Próximas mejoras sugeridas

- **Botón visible para silenciar sonido** (la función `toggleSound` ya está implementada y exportada al window, falta el botón en la UI). Lo dejé sin botón porque no quería cambiar pantallas sin tu visto bueno.
- **Auto-snap**: cámara saca sola cuando detecta figurita centrada y enfocada (más esfuerzo, mejor resultado).
- **Modo "ráfaga"**: después de OCR exitoso + estado claro, guarda automáticamente sin esperar tap del botón. Riesgoso pero potencialmente 3x más rápido.
