(function(){
  'use strict';

  const LS_SOUND = 'figuscan_photo_sound';
  let soundOn = localStorage.getItem(LS_SOUND) !== 'off';
  let lastSignal = 0;

  function norm(v){
    return String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  }

  function upperInput(input){
    const pos = input.selectionStart;
    input.value = String(input.value || '').toUpperCase();
    try { input.setSelectionRange(pos, pos); } catch(e) {}
  }

  function isStickerNumberInput(input){
    if (!input || input.tagName !== 'INPUT') return false;
    const text = norm([
      input.name,
      input.id,
      input.placeholder,
      input.getAttribute('aria-label'),
      input.getAttribute('inputmode')
    ].join(' '));

    let boxText = '';
    const box = input.closest('.field') || input.parentElement;
    if (box) boxText = norm(box.textContent || '');

    return input.type === 'number' ||
      text.includes('numero') ||
      text.includes('figurita') ||
      boxText.includes('numero de figurita') ||
      boxText.includes('número de figurita');
  }

  function applyStickerInputFix(input){
    if (!isStickerNumberInput(input)) return;
    try { input.type = 'text'; } catch(e) {}
    input.setAttribute('type','text');
    input.setAttribute('inputmode','text');
    input.setAttribute('autocomplete','off');
    input.setAttribute('autocorrect','off');
    input.setAttribute('spellcheck','false');
    input.autocapitalize = 'characters';
    input.placeholder = 'Ej: ARG 10';
    input.style.textTransform = 'uppercase';

    const box = input.closest('.field') || input.parentElement;
    if (box) {
      const label = box.querySelector('label');
      if (label && norm(label.textContent).includes('figurita')) {
        label.textContent = 'País + número de figurita';
      }
      if (!box.querySelector('.fs-code-help')) {
        const help = document.createElement('small');
        help.className = 'fs-code-help';
        help.textContent = 'Ejemplos válidos: ARG 10, BRA 4, RSA 4';
        input.insertAdjacentElement('afterend', help);
      }
    }

    if (!input.dataset.fsSafeReady) {
      input.dataset.fsSafeReady = '1';
      input.addEventListener('input', () => upperInput(input));
      input.addEventListener('focus', () => applyStickerInputFix(input));
      input.addEventListener('pointerdown', () => applyStickerInputFix(input));
    }
  }

  function getSelectedCountryCode(){
    let text = '';
    document.querySelectorAll('select').forEach(sel => {
      const opt = sel.options && sel.options[sel.selectedIndex];
      text += ' ' + (opt ? opt.textContent : '') + ' ' + (sel.value || '');
    });
    const code = text.match(/\b[A-Z]{3}\b/);
    if (code) return code[0];
    const t = norm(text);
    const map = {
      argentina:'ARG', brasil:'BRA', sudafrica:'RSA', francia:'FRA', espana:'ESP', alemania:'GER',
      italia:'ITA', uruguay:'URU', mexico:'MEX', portugal:'POR', inglaterra:'ENG', japon:'JPN', canada:'CAN'
    };
    for (const k in map) if (t.includes(k)) return map[k];
    return '';
  }

  function normalizeBeforeSave(){
    const input = Array.from(document.querySelectorAll('input')).find(isStickerNumberInput);
    if (!input) return;
    applyStickerInputFix(input);
    let value = String(input.value || '').trim().toUpperCase().replace(/\s+/g,' ');
    if (/^[A-Z]{3}\s*\d+$/.test(value)) {
      value = value.replace(/^([A-Z]{3})\s*(\d+)$/, '$1 $2');
    } else if (/^\d+$/.test(value)) {
      const code = getSelectedCountryCode();
      if (code) value = code + ' ' + value;
    }
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function signalPhoto(){
    const now = Date.now();
    if (now - lastSignal < 700) return;
    lastSignal = now;
    try { navigator.vibrate && navigator.vibrate(60); } catch(e) {}
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 950;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
      setTimeout(() => { try { ctx.close(); } catch(e) {} }, 180);
    } catch(e) {}
  }

  function addSoundToggle(){
    const scanner = document.querySelector('.scanner-wrap');
    if (!scanner || scanner.querySelector('.fs-sound-toggle')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fs-sound-toggle';
    btn.textContent = soundOn ? 'Sonido ON' : 'Sonido OFF';
    btn.addEventListener('click', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      soundOn = !soundOn;
      localStorage.setItem(LS_SOUND, soundOn ? 'on' : 'off');
      btn.textContent = soundOn ? 'Sonido ON' : 'Sonido OFF';
    });
    scanner.appendChild(btn);
  }

  function hideVercelToolbar(){
    document.querySelectorAll('[data-vercel-toolbar], iframe[src*="vercel"], iframe[title*="Vercel"], [id*="vercel-toolbar"], [class*="vercel-toolbar"]').forEach(el => {
      el.style.display = 'none';
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
    });
  }

  function run(){
    document.querySelectorAll('input').forEach(applyStickerInputFix);
    document.querySelectorAll('.fs-shutter-hotspot').forEach(el => el.remove());
    addSoundToggle();
    hideVercelToolbar();
  }

  document.addEventListener('click', ev => {
    const button = ev.target.closest('button,.btn,[role="button"]');
    if (!button) return;
    const text = norm(button.textContent || '');
    if (text.includes('guardar') || text.includes('agregar') || text.includes('confirmar')) {
      normalizeBeforeSave();
    }
    if (text.includes('sacar foto') || text.includes('guardar imagen') || text.includes('capturar')) {
      signalPhoto();
    }
  }, true);

  document.addEventListener('submit', normalizeBeforeSave, true);
  new MutationObserver(run).observe(document.documentElement, { childList:true, subtree:true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
