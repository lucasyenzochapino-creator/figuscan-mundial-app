# FiguScan V55

## Comunidad de intercambios SIN servidor

- Perfil con apodo (no nombre real, no email) y color.
- "Compartir mi álbum": genera código compacto y lo manda por WhatsApp.
- "Cargar amigo": pegás el código que te mandaron, queda guardado.
- Ver detalle de cada amigo con matching automático: "él te puede dar X" y "vos le podés dar Y".
- "Mandar propuesta por WhatsApp" arma el mensaje del intercambio.

## Privacidad infantil

- Cero ubicación. Cero GPS. Cero "amigos cercanos".
- Cero email, cero teléfono, cero cuenta.
- Cero servidor: los códigos viajan directo entre celulares por WhatsApp.
- Cero chat dentro de la app: la conversación se hace por afuera (entre adultos si querés).
- Apodo por defecto generado: "Coleccionista 1234".

## OCR mejorado

- Antes probaba 1 sola zona (esquina inferior derecha).
- Ahora prueba 4 zonas (4 esquinas). Si Panini imprime el número en otro lugar también lo encuentra.
- Reescala 3x (antes 2x) y usa `pageseg_mode: 7` para mejor precisión en líneas cortas.
- Acepta solo números 1-999.

Cache: app.js?v=55, styles.css?v=55, figuscan-v55-comunidad-sin-servidor-ocr-mejorado.
