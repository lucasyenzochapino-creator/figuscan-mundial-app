/*
  FiguScan V48 — limpieza suave de cache/PWA vieja.
  Evita que el celular se quede pegado a V47.
*/
(function () {
  'use strict';

  const FLAG = 'figuscan-v48-cache-refresh-done';
  const VERSION = '48';

  try {
    const done = localStorage.getItem(FLAG);
    if (done === VERSION) return;

    // No recargar de inmediato si el usuario está en medio de una captura.
    const clean = async () => {
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys
              .filter((k) => /figuscan|v4[0-7]|deteccion-color|fondo-blanco/i.test(k))
              .map((k) => caches.delete(k))
          );
        }

        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(
            regs.map((reg) => {
              // No siempre conviene desregistrar todo, pero en PWA trabada ayuda a bajar V48.
              return reg.update ? reg.update().catch(() => {}) : Promise.resolve();
            })
          );
        }
      } catch (_) {
        // Silencioso para no romper la app.
      } finally {
        localStorage.setItem(FLAG, VERSION);
      }
    };

    if (document.readyState === 'complete') clean();
    else window.addEventListener('load', clean, { once: true });
  } catch (_) {}
})();
