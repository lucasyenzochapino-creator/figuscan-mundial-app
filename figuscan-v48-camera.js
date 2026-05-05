/*
  FiguScan V48 — Camera Focus + Scan Frame Patch
  Cargar ANTES de app.js cuando sea posible.
*/
(function () {
  'use strict';

  const PATCH_NAME = 'FiguScan V48 camera repair';
  const DEBUG = false;
  const log = (...args) => DEBUG && console.log('[V48]', ...args);

  function isObj(v) {
    return v && typeof v === 'object' && !Array.isArray(v);
  }

  function mergeVideoConstraints(original) {
    const base = isObj(original) ? { ...original } : {};
    const video = isObj(base.video) ? { ...base.video } : {};

    // No usar exact salvo que la app ya lo traiga. Ideal evita que falle en celulares viejos.
    if (!video.facingMode) video.facingMode = { ideal: 'environment' };
    if (!video.width) video.width = { ideal: 1920 };
    if (!video.height) video.height = { ideal: 1080 };
    if (!video.frameRate) video.frameRate = { ideal: 30, max: 30 };

    // advanced puede ignorarse si el teléfono no soporta esos modos.
    const adv = Array.isArray(video.advanced) ? video.advanced.slice() : [];
    adv.push(
      { focusMode: 'continuous' },
      { exposureMode: 'continuous' },
      { whiteBalanceMode: 'continuous' }
    );
    video.advanced = adv;

    base.video = video;
    return base;
  }

  async function applyBestTrackSettings(stream) {
    if (!stream || !stream.getVideoTracks) return stream;
    const tracks = stream.getVideoTracks();

    for (const track of tracks) {
      try {
        const caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
        const advanced = [];

        if (Array.isArray(caps.focusMode) && caps.focusMode.includes('continuous')) {
          advanced.push({ focusMode: 'continuous' });
        }
        if (Array.isArray(caps.exposureMode) && caps.exposureMode.includes('continuous')) {
          advanced.push({ exposureMode: 'continuous' });
        }
        if (Array.isArray(caps.whiteBalanceMode) && caps.whiteBalanceMode.includes('continuous')) {
          advanced.push({ whiteBalanceMode: 'continuous' });
        }

        // Zoom suave: algunos teléfonos enfocan mejor si no usan ultra gran angular.
        // Solo se aplica si el dispositivo informa soporte real.
        if (caps.zoom && typeof caps.zoom.min === 'number' && typeof caps.zoom.max === 'number') {
          const safeZoom = Math.min(Math.max(1.05, caps.zoom.min), Math.min(1.25, caps.zoom.max));
          if (safeZoom > caps.zoom.min) advanced.push({ zoom: safeZoom });
        }

        if (advanced.length) {
          await track.applyConstraints({ advanced });
        }
      } catch (err) {
        log('No se pudieron aplicar constraints avanzadas', err);
      }
    }

    return stream;
  }

  function patchGetUserMedia() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    if (navigator.mediaDevices.__figuscanV48Patched) return;

    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = async function patchedGetUserMedia(constraints) {
      const improved = mergeVideoConstraints(constraints || { video: true, audio: false });
      try {
        const stream = await originalGetUserMedia(improved);
        await applyBestTrackSettings(stream);
        setTimeout(enhanceAllVideos, 200);
        setTimeout(enhanceAllVideos, 900);
        return stream;
      } catch (firstError) {
        // Fallback: si algún celular rechaza constraints, vuelve a lo básico.
        log('Fallback getUserMedia básico', firstError);
        const fallback = await originalGetUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        await applyBestTrackSettings(fallback);
        setTimeout(enhanceAllVideos, 200);
        return fallback;
      }
    };

    navigator.mediaDevices.__figuscanV48Patched = true;
    log(PATCH_NAME, 'getUserMedia patched');
  }

  function nearestCameraContainer(video) {
    let el = video.parentElement;
    let best = el;
    let depth = 0;

    while (el && depth < 4) {
      const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
      if (rect && rect.width > 180 && rect.height > 180) best = el;
      el = el.parentElement;
      depth += 1;
    }

    return best || video.parentElement;
  }

  function addOverlay(container) {
    if (!container || container.querySelector(':scope > .figuscan-v48-frame-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'figuscan-v48-frame-overlay';

    const tip = document.createElement('div');
    tip.className = 'figuscan-v48-tip';
    tip.textContent = 'Centrar figurita y tocar para enfocar';

    container.appendChild(overlay);
    container.appendChild(tip);
  }

  function pulse(container, x, y) {
    if (!container) return;
    const p = document.createElement('div');
    p.className = 'figuscan-v48-focus-pulse';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 560);
  }

  async function tryTapToFocus(video, event) {
    const stream = video.srcObject;
    if (!stream || !stream.getVideoTracks) return;

    const track = stream.getVideoTracks()[0];
    if (!track || typeof track.applyConstraints !== 'function') return;

    const container = nearestCameraContainer(video);
    const rect = video.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const x = Math.max(0, Math.min(1, localX / rect.width));
    const y = Math.max(0, Math.min(1, localY / rect.height));

    const cRect = container.getBoundingClientRect();
    pulse(container, event.clientX - cRect.left, event.clientY - cRect.top);

    try {
      const caps = typeof track.getCapabilities === 'function' ? track.getCapabilities() : {};
      const advanced = [];

      // Android/Chrome suele ignorar pointsOfInterest, pero no rompe si no lo soporta.
      advanced.push({ pointsOfInterest: [{ x, y }] });

      if (Array.isArray(caps.focusMode)) {
        if (caps.focusMode.includes('single-shot')) advanced.push({ focusMode: 'single-shot' });
        else if (caps.focusMode.includes('continuous')) advanced.push({ focusMode: 'continuous' });
      }

      await track.applyConstraints({ advanced });

      // Vuelve a continuo después de un toque puntual.
      setTimeout(() => applyBestTrackSettings(stream), 900);
    } catch (err) {
      log('Tap focus no soportado por este navegador/teléfono', err);
    }
  }

  function enhanceVideo(video) {
    if (!video || video.__figuscanV48Enhanced) return;

    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;
    video.autoplay = true;

    const container = nearestCameraContainer(video);
    if (container) {
      container.classList.add('figuscan-v48-camera-card');
      addOverlay(container);
    }

    video.addEventListener('click', (ev) => tryTapToFocus(video, ev), { passive: true });
    video.addEventListener('loadedmetadata', () => {
      try {
        if (video.srcObject) applyBestTrackSettings(video.srcObject);
        video.play && video.play().catch(() => {});
      } catch (_) {}
    });

    if (video.srcObject) applyBestTrackSettings(video.srcObject);

    video.__figuscanV48Enhanced = true;
  }

  function enhanceAllVideos() {
    document.querySelectorAll('video').forEach(enhanceVideo);
  }

  function observeDom() {
    if (!('MutationObserver' in window)) return;
    const mo = new MutationObserver(() => enhanceAllVideos());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  function restartTrackFocusOnVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(() => {
          document.querySelectorAll('video').forEach((video) => {
            if (video.srcObject) applyBestTrackSettings(video.srcObject);
          });
        }, 450);
      }
    });
  }

  function start() {
    patchGetUserMedia();
    enhanceAllVideos();
    observeDom();
    restartTrackFocusOnVisibility();

    // Reintentos por si React/Vite monta tarde.
    [300, 900, 1800, 3200].forEach((ms) => setTimeout(enhanceAllVideos, ms));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
    patchGetUserMedia();
  } else {
    start();
  }
})();
