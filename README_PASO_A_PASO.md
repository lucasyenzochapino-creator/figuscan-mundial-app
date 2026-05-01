# FiguScan Mundial V9

Versión PWA local-first para subir a Vercel.

## Mejoras incluidas
- Fondo con copa genérica estilo mundialista.
- Iconos SVG grandes, claros y profesionales.
- Colores de fútbol: azul profundo, azul eléctrico, verde cancha, dorado, rojo y naranja.
- Carga manual con nombre del jugador.
- Escaneo asistido con cámara en vivo y recuadro guía.
- No inventa reconocimiento: si no detecta, permite cargar el número rápido.
- Tarjetas de inicio clickeables: Tengo, Me faltan y Repetidas.
- Álbum con buscador, filtros, edición, eliminación y WhatsApp individual.
- Compartir resumen por WhatsApp.
- Guardado local en el celular con localStorage.

## Cómo subir
1. Extraé el ZIP.
2. Entrá a la carpeta `figuscan-v8`.
3. Subí todos los archivos de adentro al repositorio de GitHub que usa Vercel.
4. Confirmá cambios.
5. Esperá que Vercel actualice.
6. Abrí la app desde el link publicado.

## Importante
Esta versión no usa APIs pagas. El reconocimiento automático perfecto de cualquier figurita requiere una base de imágenes o IA visual paga. Por eso el escaneo es asistido y no guarda datos falsos.


## Copa del mundo real / imagen propia

Esta versión está preparada para usar una imagen de copa real si vos tenés derecho/licencia para usarla.

Pasos:
1. Conseguí tu imagen autorizada en PNG.
2. Renombrala exactamente como:
   copa-del-mundo-original.png
3. Subila dentro de la carpeta:
   assets/
4. Volvé a subir los archivos a GitHub.
5. Vercel actualiza la app automáticamente.

Si el archivo no existe, la app muestra una copa dorada genérica de respaldo.
