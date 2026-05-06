# Ícono PWA para FiguScan Mundial

Este ZIP agrega el ícono profesional para que aparezca cuando la app se instala desde Chrome como aplicación.

## Qué copiar en GitHub

1. Abrí tu repositorio de la app.
2. Copiá la carpeta `public` de este ZIP dentro de la raíz del proyecto.
3. Si ya existe una carpeta `public`, fusioná las carpetas. No borres tus archivos actuales.

La estructura final debe quedar así:

```txt
public/
  favicon.ico
  apple-touch-icon.png
  figuscan-app-icon-original.png
  manifest.webmanifest
  icons/
    icon-192x192.png
    icon-512x512.png
    maskable-icon-192x192.png
    maskable-icon-512x512.png
```

## Activar el manifest en Next.js

Buscá el archivo:

```txt
app/layout.tsx
```

o:

```txt
src/app/layout.tsx
```

Dentro del `export const metadata = { ... }`, agregá estas líneas:

```ts
manifest: "/manifest.webmanifest",
icons: {
  icon: "/favicon.ico",
  apple: "/apple-touch-icon.png",
},
themeColor: "#003B8F",
```

Ejemplo:

```ts
export const metadata = {
  title: "FiguScan Mundial",
  description: "App para escanear y organizar figuritas del Mundial.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#003B8F",
};
```

## Después

1. Guardá los cambios.
2. Subí a GitHub.
3. Vercel va a desplegar automáticamente.
4. Abrí la app en Chrome desde el celular.
5. Tocá los 3 puntos.
6. Elegí `Agregar a pantalla principal` o `Instalar app`.

Si Chrome todavía muestra el ícono viejo, borrá la app del celular, limpiá caché o esperá a que actualice el manifest.
