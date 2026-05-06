# Reparación de ícono PWA - FiguScan Mundial

Este paquete corrige el problema del ícono gris cuando instalás la app desde Chrome.

## Qué hacer

1. Descomprimí este ZIP.
2. Entrá al repositorio de GitHub de tu app.
3. Copiá estas carpetas dentro del proyecto:

```txt
app/
public/
```

Importante:
- Si ya existe la carpeta `app`, NO la borres.
- Entrá en `app` y subí solamente estos archivos nuevos:
  - `manifest.ts`
  - `icon.png`
  - `apple-icon.png`

- Si ya existe la carpeta `public`, NO la borres.
- Entrá en `public` y subí la carpeta:
  - `icons`

## Estructura final esperada

```txt
app/
  manifest.ts
  icon.png
  apple-icon.png

public/
  icons/
    icon-192x192.png
    icon-512x512.png
    maskable-icon-192x192.png
    maskable-icon-512x512.png
```

## Después de subirlo

1. Hacé commit en GitHub.
2. Esperá que Vercel termine el deploy.
3. En el celular, borrá el ícono viejo de FiguScan de la pantalla principal.
4. Abrí Chrome.
5. Entrá a:

https://figuscan-mundial-app.vercel.app

6. Tocá los tres puntos.
7. Elegí `Instalar app` o `Agregar a pantalla principal`.
8. Debe aparecer el ícono nuevo.

## Si sigue apareciendo el viejo

Chrome puede guardar el ícono anterior en caché.

Hacé esto:
1. Borrá el acceso viejo.
2. Cerrá Chrome completamente.
3. Abrí de nuevo la web.
4. Volvé a instalar.

Si aun así no cambia:
- Entrá a Configuración del teléfono.
- Aplicaciones.
- Chrome.
- Almacenamiento.
- Borrar caché.
- Volvé a instalar FiguScan.
