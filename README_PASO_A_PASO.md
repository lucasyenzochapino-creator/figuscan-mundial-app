# FiguScan Mundial V11

Versión mejorada para subir al mismo repositorio de GitHub conectado a Vercel.

## Cambios principales

- En Álbum ahora podés cargar una figurita desde cada sección:
  - Tengo
  - Me faltan
  - Repetidas
- Si estás en “Me faltan”, el botón carga directamente una faltante.
- Si estás en “Repetidas”, el botón carga directamente una repetida.
- WhatsApp ya no sale tan pelado: ahora usa encabezado FiguScan, separadores y mensajes más claros.
- Agregué opción “Compartir imagen visual”. Si el celular permite compartir archivos desde navegador, genera una imagen con marca FiguScan. Si no, abre WhatsApp con texto.
- Mejoré el reconocimiento con OCR en navegador usando Tesseract.js desde CDN.
- El escaneo sigue teniendo fallback manual rápido si el OCR no detecta bien.

## Cómo actualizar

1. Subí todo lo de esta carpeta al mismo repositorio de GitHub.
2. Confirmá cambios.
3. Vercel actualiza solo.
4. Abrí la app y probá primero carga manual desde Álbum.

## Nota importante sobre reconocimiento

El OCR en navegador depende de luz, enfoque, tamaño del número y calidad de la impresión. Por eso nunca guarda una detección inventada: si no está seguro, pide cargar número manualmente.
