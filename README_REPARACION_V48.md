# FiguScan V48 — reparación de foco + marco de cámara + desborde móvil

## Qué corrige este ZIP

1. **Cámara fuera de foco**
   - Fuerza cámara trasera cuando el navegador lo permite.
   - Pide mayor resolución ideal.
   - Aplica foco continuo, exposición continua y balance de blancos continuo si el teléfono lo soporta.
   - Agrega toque para intentar reenfocar sobre la figurita.

2. **Marco donde se saca la foto**
   - Agrega un marco vertical con proporción de figurita real `63/88`.
   - Muestra esquinas claras para centrar la figurita.
   - Evita que el video se estire o deforme.
   - Mejora el contraste del área de cámara.

3. **Pantallas cortadas / desbordadas en celular**
   - Bloquea el scroll horizontal.
   - Corrige cajas e inputs que se salen del ancho.
   - Da más espacio inferior para que la barra de navegación no tape formularios.
   - Mejora chips de países y campos grandes.

4. **Cache / PWA**
   - Incluye script opcional para limpiar versión vieja del service worker y evitar que el celular siga mostrando V47.

---

## Instalación simple

### Opción recomendada si tu app tiene `index.html`, `app.js` y `styles.css`

1. Copiá estos 3 archivos dentro de la carpeta pública / raíz del proyecto:

```text
public/figuscan-v48-camera.css
public/figuscan-v48-camera.js
public/figuscan-v48-refresh.js
```

2. En tu `index.html`, dentro de `<head>`, agregá esta línea:

```html
<link rel="stylesheet" href="./figuscan-v48-camera.css?v=48" />
```

3. En tu `index.html`, antes de cargar `app.js`, agregá estas líneas:

```html
<script src="./figuscan-v48-refresh.js?v=48"></script>
<script src="./figuscan-v48-camera.js?v=48"></script>
```

Debe quedar antes de algo parecido a:

```html
<script src="./app.js?v=47"></script>
```

4. Cambiá cache busting de V47 a V48:

```html
<script src="./app.js?v=48"></script>
<link rel="stylesheet" href="./styles.css?v=48" />
```

5. Subí a GitHub y dejá que Vercel reconstruya.

6. En el celular: cerrá la app, abrila de nuevo y actualizá. Si sigue vieja, borrá datos del sitio o reinstalá la PWA.

---

## Orden correcto de scripts

Usá este orden:

```html
<link rel="stylesheet" href="./styles.css?v=48" />
<link rel="stylesheet" href="./figuscan-v48-camera.css?v=48" />

<script src="./figuscan-v48-refresh.js?v=48"></script>
<script src="./figuscan-v48-camera.js?v=48"></script>
<script src="./app.js?v=48"></script>
```

El archivo `figuscan-v48-camera.js` conviene cargarlo **antes** de `app.js` porque intercepta `getUserMedia` y mejora las opciones de cámara desde el arranque.

---

## Importante

Esto es un parche seguro porque no reemplaza tu app completa. Se monta arriba de lo que ya funciona en V47. Si algo se ve raro, quitás estas 3 líneas del `index.html` y volvés al estado anterior.

