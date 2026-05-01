# FiguScan Mundial V5

Versión PWA estática, pensada para subir desde celular a GitHub y publicar gratis en Vercel.

## Qué incluye

- Inicio rediseñado.
- Cámara en vivo con recuadro guía.
- OCR real con Tesseract.js si el navegador lo permite.
- Fallback manual si no detecta.
- Carga manual rápida.
- Estados claros: Tengo, Me falta, Repetida.
- Cantidad de repetidas.
- Álbum con tarjetas modernas.
- Filtros y búsqueda por número.
- Eliminar una figurita.
- Seleccionar varias y eliminar o cambiar estado.
- WhatsApp individual.
- WhatsApp resumen con intento de imagen visual y logo.
- Guardado local con localStorage.

## Importante

Esta versión no depende de Firebase para guardar. Guarda en el dispositivo, así no falla el guardado mientras probás con amigos.

## Archivos a subir a GitHub

Subí todos los archivos de esta carpeta:

- index.html
- app.js
- styles.css
- manifest.webmanifest
- service-worker.js
- vercel.json
- package.json
- README_PASO_A_PASO.md
- assets

## Vercel

Usá Framework: Other.

Si Vercel intenta usar Vite, asegurate de que el package.json de esta versión haya reemplazado al viejo.
