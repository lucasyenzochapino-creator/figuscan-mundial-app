/* FiguScan Mundial V5 - PWA local-first.
   Guarda datos en localStorage. El escaneo intenta OCR real con Tesseract.js si está disponible.
   Si el OCR no detecta, usa carga manual rápida. No simula detección falsa. */

const STORAGE_KEY = 'figuscan_v5_stickers';
const USER_KEY = 'figuscan_v5_user';
const SETTINGS_KEY = 'figuscan_v5_settings';

const STATUS = {
  have: { label: 'Tengo', long: 'La tengo', tone: 'have', whatsapp: 'Tengo la figurita N° {n}. ¿Te sirve?' },
  missing: { label: 'Me falta', long: 'Me falta', tone: 'missing', whatsapp: 'Me falta la figurita N° {n}. ¿La tenés para cambiar?' },
  repeated: { label: 'Repetida', long: 'Repetida', tone: 'repeated', whatsapp: 'Tengo repetida la figurita N° {n} x{q}. ¿La necesitás?' },
};

const TEAMS = [
  'Sin selección', 'Argentina', 'Brasil', 'Uruguay', 'Francia', 'España', 'Alemania', 'Italia', 'Inglaterra', 'Portugal',
  'Países Bajos', 'Croacia', 'Marruecos', 'México', 'Estados Unidos', 'Japón', 'Corea del Sur', 'Otro'
];

const icons = {
  logo: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 4 40 10v12c0 10.5-6.5 17.5-16 22C14.5 39.5 8 32.5 8 22V10l16-6Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M17 20h14M17 27h14M18 34h9" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M24 11v28" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".55"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  scan: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  album: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 0-3 3V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M5 19h14M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  friends: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" stroke="currentColor" stroke-width="2"/><path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 8a3 3 0 0 1 3 3M3 11a3 3 0 0 1 3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".6"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 8a3 3 0 1 0-2.8-4M6 14a3 3 0 1 0-2.8-4M18 20a3 3 0 1 0-2.8-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m8.7 12.4 6.6 3.2M15.3 8.4 8.7 11.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  repeat: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17 2l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9a3 3 0 0 1 3-3h15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M7 22l-4-4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13v2a3 3 0 0 1-3 3H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m14 5 5 5M4 20l4.5-1 10-10a3.5 3.5 0 0 0-5-5l-10 10L4 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 18 9 12l6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16 16l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  cameraOff: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m3 3 18 18M9 7h4l2 3h3a2 2 0 0 1 2 2v4M7.5 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h11M10 14a3 3 0 0 0 4 2.8M14 12.2A3 3 0 0 0 10.2 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  card: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0ZM4 21a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

let state = {
  screen: 'home',
  filter: 'all',
  search: '',
  stickers: loadStickers(),
  selected: new Set(),
  selectionMode: false,
  editingId: null,
  scanner: { active: false, detectedNumber: null, numberInput: '', status: 'have', quantity: 1, message: 'Preparando cámara...', canOcr: false, tries: 0 },
  manual: { number: '', team: '', status: 'have', quantity: 1 },
  user: loadUser(),
  toast: '',
  modal: null,
};

let videoStream = null;
let scanInterval = null;
let scannerBusy = false;
let toastTimer = null;

const app = document.getElementById('app');

function svgIcon(name, cls = '') {
  return `<span class="icon ${cls}" aria-hidden="true">${icons[name] || ''}</span>`;
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[ch]));
}
function uid() { return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`; }
function now() { return new Date().toISOString(); }
function normalizedNumber(value) { return String(value || '').replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''); }
function stickerKey(number, team = '') { return `${normalizedNumber(number)}::${String(team || '').trim().toLowerCase()}`; }

function loadStickers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveStickers(stickers = state.stickers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stickers));
}
function loadUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch { return {}; }
}
function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function loadSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch { return {}; }
}
function saveSettings(settings) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

function getStats() {
  return {
    have: state.stickers.filter(s => s.status === 'have').length,
    missing: state.stickers.filter(s => s.status === 'missing').length,
    repeated: state.stickers.filter(s => s.status === 'repeated').length,
    repeatedTotal: state.stickers.filter(s => s.status === 'repeated').reduce((acc, s) => acc + Math.max(1, Number(s.repeatedCount || 1)), 0),
    total: state.stickers.length,
  };
}
function filteredStickers() {
  const q = normalizedNumber(state.search);
  return state.stickers
    .filter(s => state.filter === 'all' || s.status === state.filter)
    .filter(s => !q || String(s.number).includes(q))
    .sort((a, b) => Number(a.number) - Number(b.number));
}

function showToast(message) {
  state.toast = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { state.toast = ''; render(); }, 2500);
  render();
}

function setScreen(screen, opts = {}) {
  stopCamera();
  state.screen = screen;
  state.selected.clear();
  state.selectionMode = false;
  if (opts.filter) state.filter = opts.filter;
  if (screen === 'scanner') {
    state.scanner = { active: false, detectedNumber: null, numberInput: '', status: 'have', quantity: 1, message: 'Preparando cámara...', canOcr: false, tries: 0 };
  }
  if (screen === 'manual' && !opts.keepManual) {
    state.manual = { number: '', team: '', status: 'have', quantity: 1 };
    state.editingId = null;
  }
  render();
  if (screen === 'scanner') startCameraSoon();
}

function upsertSticker(input, options = {}) {
  const number = normalizedNumber(input.number);
  if (!number) {
    showToast('Ingresá un número de figurita.');
    return false;
  }
  const status = input.status || 'have';
  const repeatedCount = status === 'repeated' ? Math.max(1, Number(input.repeatedCount || input.quantity || 1)) : 1;
  const team = String(input.team || '').trim();
  const existingIndex = state.stickers.findIndex(s => stickerKey(s.number, s.team) === stickerKey(number, team));
  const payload = {
    number,
    team,
    status,
    repeatedCount,
    updatedAt: now(),
  };
  if (options.editingId) {
    state.stickers = state.stickers.map(s => s.id === options.editingId ? { ...s, ...payload } : s);
    saveStickers();
    showToast(`Figurita N° ${number} actualizada.`);
    return true;
  }
  if (existingIndex >= 0 && !options.forceUpdate) {
    openModal({
      title: `La N° ${number} ya existe`,
      message: '¿Querés actualizar su estado con los datos nuevos?',
      confirmText: 'Actualizar',
      cancelText: 'Cancelar',
      danger: false,
      onConfirm: () => {
        state.stickers[existingIndex] = { ...state.stickers[existingIndex], ...payload };
        saveStickers();
        showToast(`Figurita N° ${number} actualizada.`);
      }
    });
    return false;
  }
  state.stickers = [{ id: uid(), createdAt: now(), ...payload }, ...state.stickers];
  saveStickers();
  showToast(`Figurita N° ${number} guardada.`);
  return true;
}

function deleteSticker(id) {
  const sticker = state.stickers.find(s => s.id === id);
  if (!sticker) return;
  openModal({
    title: `Eliminar figurita N° ${sticker.number}`,
    message: '¿Seguro que querés eliminarla? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    danger: true,
    onConfirm: () => {
      state.stickers = state.stickers.filter(s => s.id !== id);
      state.selected.delete(id);
      saveStickers();
      showToast(`Figurita N° ${sticker.number} eliminada.`);
    }
  });
}
function bulkDelete() {
  const count = state.selected.size;
  if (!count) return;
  openModal({
    title: `Eliminar ${count} figuritas`,
    message: '¿Seguro que querés eliminar todas las figuritas seleccionadas?',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    danger: true,
    onConfirm: () => {
      state.stickers = state.stickers.filter(s => !state.selected.has(s.id));
      state.selected.clear();
      state.selectionMode = false;
      saveStickers();
      showToast(`${count} figuritas eliminadas.`);
    }
  });
}
function bulkSetStatus(status) {
  const ids = Array.from(state.selected);
  if (!ids.length) return;
  state.stickers = state.stickers.map(s => ids.includes(s.id) ? { ...s, status, repeatedCount: status === 'repeated' ? Math.max(1, s.repeatedCount || 1) : 1, updatedAt: now() } : s);
  state.selected.clear();
  state.selectionMode = false;
  saveStickers();
  showToast(`${ids.length} figuritas actualizadas.`);
  render();
}
function editSticker(id) {
  const s = state.stickers.find(x => x.id === id);
  if (!s) return;
  state.editingId = id;
  state.manual = { number: s.number, team: s.team || '', status: s.status, quantity: s.repeatedCount || 1 };
  setScreen('manual', { keepManual: true });
}
function toggleSelected(id) {
  if (state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
  state.selectionMode = state.selected.size > 0;
  render();
}

function openModal({ title, message, confirmText = 'Aceptar', cancelText = 'Cancelar', danger = false, onConfirm }) {
  state.modal = { title, message, confirmText, cancelText, danger, onConfirm };
  render();
}
function closeModal() { state.modal = null; render(); }
function confirmModal() {
  const cb = state.modal?.onConfirm;
  state.modal = null;
  if (typeof cb === 'function') cb();
  render();
}

function buildSingleStickerMessage(sticker) {
  const n = sticker.number;
  const q = Math.max(1, sticker.repeatedCount || 1);
  const base = STATUS[sticker.status]?.whatsapp || 'Tengo la figurita N° {n}. ¿Te sirve?';
  const team = sticker.team ? ` (${sticker.team})` : '';
  return `FiguScan Mundial\n\n${base.replace('{n}', n).replace('{q}', q)}${team}\n\nOrganizado con FiguScan.`;
}
function buildWhatsAppMessage() {
  const have = state.stickers.filter(s => s.status === 'have').sort((a,b)=>Number(a.number)-Number(b.number));
  const missing = state.stickers.filter(s => s.status === 'missing').sort((a,b)=>Number(a.number)-Number(b.number));
  const repeated = state.stickers.filter(s => s.status === 'repeated').sort((a,b)=>Number(a.number)-Number(b.number));
  const fmtNums = arr => arr.length ? arr.map(s => `${s.number}${s.team ? ` (${s.team})` : ''}`).join(', ') : 'Sin figuritas cargadas';
  const fmtRep = arr => arr.length ? arr.map(s => `${s.number}${s.team ? ` (${s.team})` : ''} x${Math.max(1, s.repeatedCount || 1)}`).join('\n') : 'Sin figuritas cargadas';
  return `Mi álbum FiguScan:\n\n✅ Tengo:\n${fmtNums(have)}\n\n❌ Me faltan:\n${fmtNums(missing)}\n\n🔁 Repetidas:\n${fmtRep(repeated)}\n\n¿Hacemos cambios?`;
}
function openWhatsApp(text) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}
async function shareSticker(sticker) {
  const text = buildSingleStickerMessage(sticker);
  try {
    const blob = await createStickerShareImage(sticker);
    const file = new File([blob], `figuscan-${sticker.number}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: 'FiguScan Mundial', text, files: [file] });
      return;
    }
  } catch (err) {}
  openWhatsApp(text);
}
async function shareSummary() {
  const text = buildWhatsAppMessage();
  try {
    const blob = await createSummaryShareImage();
    const file = new File([blob], 'figuscan-resumen.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ title: 'FiguScan Mundial', text, files: [file] });
      return;
    }
  } catch (err) {}
  openWhatsApp(text);
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function canvasBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.92));
}
function drawLogo(ctx, x, y, size) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  roundedRect(ctx, x, y, size, size, size * .25); ctx.fill();
  ctx.strokeStyle = '#0B1B4D'; ctx.lineWidth = size * .07;
  ctx.beginPath();
  ctx.moveTo(x + size*.5, y + size*.18);
  ctx.lineTo(x + size*.75, y + size*.28);
  ctx.lineTo(x + size*.75, y + size*.55);
  ctx.quadraticCurveTo(x + size*.75, y + size*.78, x + size*.5, y + size*.88);
  ctx.quadraticCurveTo(x + size*.25, y + size*.78, x + size*.25, y + size*.55);
  ctx.lineTo(x + size*.25, y + size*.28);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + size*.36, y + size*.44); ctx.lineTo(x + size*.64, y + size*.44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + size*.36, y + size*.58); ctx.lineTo(x + size*.64, y + size*.58); ctx.stroke();
  ctx.restore();
}
function statusColor(status) { return status === 'have' ? '#0F9F6E' : status === 'missing' ? '#E23535' : '#F28A1A'; }
async function createStickerShareImage(sticker) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, '#0B1B4D'); gradient.addColorStop(1, '#1E6BFF');
  ctx.fillStyle = gradient; ctx.fillRect(0,0,1080,1350);
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  for (let i=0;i<7;i++){ ctx.beginPath(); ctx.arc(100+i*170, 1140, 90, 0, Math.PI*2); ctx.fill(); }
  drawLogo(ctx, 80, 80, 120);
  ctx.fillStyle = '#fff'; ctx.font = '900 56px system-ui'; ctx.fillText('FiguScan Mundial', 230, 160);
  ctx.fillStyle = '#D8E8FF'; ctx.font = '700 30px system-ui'; ctx.fillText('Figurita para cambiar', 230, 210);
  roundedRect(ctx, 90, 310, 900, 760, 64); ctx.fillStyle = '#fff'; ctx.fill();
  roundedRect(ctx, 160, 390, 760, 420, 48); ctx.fillStyle = '#EEF5FF'; ctx.fill();
  ctx.fillStyle = '#0B1B4D'; ctx.font = '950 250px system-ui'; ctx.textAlign = 'center'; ctx.fillText(sticker.number, 540, 670);
  ctx.textAlign = 'left';
  ctx.fillStyle = statusColor(sticker.status); roundedRect(ctx, 230, 870, 620, 90, 45); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '900 44px system-ui'; ctx.textAlign = 'center';
  const label = sticker.status === 'repeated' ? `REPETIDA x${Math.max(1, sticker.repeatedCount || 1)}` : STATUS[sticker.status].long.toUpperCase();
  ctx.fillText(label, 540, 930);
  ctx.textAlign = 'center'; ctx.fillStyle = '#334155'; ctx.font = '700 36px system-ui';
  ctx.fillText(sticker.team || 'Álbum de figuritas', 540, 1035);
  ctx.fillStyle = '#fff'; ctx.font = '800 38px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('¿Te sirve para intercambiar?', 540, 1230);
  return canvasBlob(canvas);
}
async function createSummaryShareImage() {
  const stats = getStats();
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350);
  gradient.addColorStop(0, '#0B1B4D'); gradient.addColorStop(1, '#1740A8');
  ctx.fillStyle = gradient; ctx.fillRect(0,0,1080,1350);
  drawLogo(ctx, 80, 80, 120);
  ctx.fillStyle = '#fff'; ctx.font = '900 60px system-ui'; ctx.fillText('Mi álbum FiguScan', 230, 160);
  ctx.fillStyle = '#D8E8FF'; ctx.font = '700 32px system-ui'; ctx.fillText('Resumen para cambios', 230, 212);
  const cards = [
    ['Tengo', stats.have, '#0F9F6E'], ['Me faltan', stats.missing, '#E23535'], ['Repetidas', stats.repeatedTotal, '#F28A1A']
  ];
  cards.forEach((c, i) => {
    const x = 80 + i*320;
    roundedRect(ctx, x, 310, 280, 190, 38); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.fillStyle = c[2]; ctx.font = '950 74px system-ui'; ctx.textAlign = 'center'; ctx.fillText(String(c[1]), x+140, 405);
    ctx.fillStyle = '#334155'; ctx.font = '800 30px system-ui'; ctx.fillText(c[0], x+140, 455);
  });
  ctx.textAlign = 'left';
  roundedRect(ctx, 80, 570, 920, 600, 50); ctx.fillStyle = '#fff'; ctx.fill();
  const have = state.stickers.filter(s=>s.status==='have').map(s=>s.number).sort((a,b)=>a-b).slice(0,18).join(', ') || 'Sin figuritas cargadas';
  const missing = state.stickers.filter(s=>s.status==='missing').map(s=>s.number).sort((a,b)=>a-b).slice(0,18).join(', ') || 'Sin figuritas cargadas';
  const repeated = state.stickers.filter(s=>s.status==='repeated').sort((a,b)=>a.number-b.number).slice(0,12).map(s=>`${s.number} x${s.repeatedCount || 1}`).join('  ·  ') || 'Sin figuritas cargadas';
  const rows = [['Tengo', have, '#0F9F6E'], ['Me faltan', missing, '#E23535'], ['Repetidas', repeated, '#F28A1A']];
  rows.forEach((row, i) => {
    const y = 660 + i*165;
    ctx.fillStyle = row[2]; ctx.font = '900 38px system-ui'; ctx.fillText(row[0], 140, y);
    ctx.fillStyle = '#0F172A'; ctx.font = '700 31px system-ui'; wrapText(ctx, row[1], 140, y+48, 800, 40, 2);
  });
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.font = '800 36px system-ui'; ctx.fillText('¿Hacemos cambios?', 540, 1260);
  return canvasBlob(canvas);
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines=3) {
  const words = String(text).split(' '); let line = ''; let lines = 0;
  for (let n=0; n<words.length; n++) {
    const test = line + words[n] + ' ';
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y); line = words[n] + ' '; y += lineHeight; lines++;
      if (lines >= maxLines) return;
    } else line = test;
  }
  ctx.fillText(line.trim(), x, y);
}

function startCameraSoon() { setTimeout(startCamera, 120); }
async function startCamera() {
  stopCamera(false);
  const video = document.getElementById('cameraVideo');
  if (!video) return;
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1920 } }, audio: false });
    video.srcObject = videoStream;
    await video.play();
    const hasTesseract = typeof window.Tesseract !== 'undefined';
    state.scanner.active = true;
    state.scanner.canOcr = hasTesseract;
    state.scanner.message = hasTesseract ? 'Buscando número dentro del recuadro...' : 'Escaneo asistido listo.';
    renderScannerStatus();
    if (hasTesseract) {
      scanInterval = setInterval(analyzeVideoFrame, 2800);
      setTimeout(() => {
        if (state.screen === 'scanner' && !state.scanner.detectedNumber && state.scanner.tries >= 2) {
          state.scanner.message = 'No pude detectar la figurita. Podés cargar el número manualmente.';
          renderScannerStatus();
        }
      }, 9500);
    }
  } catch (err) {
    state.scanner.active = false;
    state.scanner.message = 'No pude abrir la cámara. Usá la carga manual rápida.';
    render();
  }
}
function stopCamera(renderAfter = true) {
  if (scanInterval) clearInterval(scanInterval);
  scanInterval = null;
  scannerBusy = false;
  if (videoStream) {
    videoStream.getTracks().forEach(t => t.stop());
    videoStream = null;
  }
  if (renderAfter && state.screen === 'scanner') render();
}
function renderScannerStatus() {
  const el = document.getElementById('scanStatus');
  if (el) el.innerHTML = `${escapeHtml(state.scanner.message)}${state.scanner.canOcr ? '<small>Si no detecta, usá cargar número</small>' : '<small>OCR no disponible en este navegador</small>'}`;
}
async function analyzeVideoFrame() {
  if (scannerBusy || state.screen !== 'scanner' || state.scanner.detectedNumber) return;
  const video = document.getElementById('cameraVideo');
  if (!video || !video.videoWidth || typeof window.Tesseract === 'undefined') return;
  scannerBusy = true;
  state.scanner.tries += 1;
  state.scanner.message = 'Analizando el número...';
  renderScannerStatus();
  try {
    const canvas = document.createElement('canvas');
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cropW = Math.floor(vw * 0.62);
    const cropH = Math.floor(vh * 0.28);
    const sx = Math.floor((vw - cropW) / 2);
    const sy = Math.floor(vh * 0.34);
    canvas.width = cropW; canvas.height = cropH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);
    // Alto contraste simple
    const img = ctx.getImageData(0, 0, cropW, cropH);
    for (let i = 0; i < img.data.length; i += 4) {
      const avg = (img.data[i] + img.data[i+1] + img.data[i+2]) / 3;
      const v = avg > 130 ? 255 : 0;
      img.data[i] = img.data[i+1] = img.data[i+2] = v;
    }
    ctx.putImageData(img, 0, 0);
    const res = await window.Tesseract.recognize(canvas, 'eng', {
      tessedit_char_whitelist: '0123456789',
    });
    const text = res?.data?.text || '';
    const matches = text.match(/\d{1,4}/g) || [];
    const candidates = matches.map(n => Number(n)).filter(n => n > 0 && n < 1000);
    if (candidates.length) {
      const detected = String(candidates[0]);
      state.scanner.detectedNumber = detected;
      state.scanner.numberInput = detected;
      state.scanner.message = `Figurita detectada: N° ${detected}`;
      stopCamera(false);
      render();
    } else {
      state.scanner.message = state.scanner.tries >= 3 ? 'No pude detectar la figurita. Cargá el número manualmente.' : 'Sigo buscando el número...';
      renderScannerStatus();
    }
  } catch (err) {
    state.scanner.message = 'No pude leer el número. Usá cargar número.';
    renderScannerStatus();
  } finally {
    scannerBusy = false;
  }
}

function render() {
  const top = state.screen === 'home' ? renderTopBar() : '';
  app.innerHTML = `<main class="app-shell">${top}${renderScreen()}</main>${renderBottomNav()}${renderModal()}${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ''}`;
  attachEvents();
}
function renderTopBar() {
  return `<div class="app-top">
    <div class="brand"><div class="brand-mark">${icons.logo}</div><div class="brand-text"><strong>FiguScan Mundial</strong><span>Álbum, repetidas y cambios</span></div></div>
    <button class="profile-pill" data-action="profile">${svgIcon('user')}<span>${escapeHtml(state.user.name || 'Perfil')}</span></button>
  </div>`;
}
function renderScreenHeader(title, subtitle) {
  return `<header class="screen-header">
    <div class="back-row"><button class="back-btn" data-screen="home" aria-label="Volver">${svgIcon('back')}</button><div><h1>${escapeHtml(title)}</h1>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}</div></div>
  </header>`;
}
function renderScreen() {
  switch (state.screen) {
    case 'scanner': return renderScanner();
    case 'manual': return renderManual();
    case 'album': return renderAlbum();
    case 'friends': return renderFriends();
    case 'share': return renderShare();
    case 'profile': return renderProfile();
    default: return renderHome();
  }
}
function renderHome() {
  const stats = getStats();
  return `<section class="hero">
      <div class="hero-kicker">${svgIcon('logo')} Álbum mundialista</div>
      <h1>Organizá tu álbum en segundos</h1>
      <p>Escaneá figuritas, marcá repetidas y compartí tus cambios por WhatsApp.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-screen="scanner">${svgIcon('scan')} Escanear ahora</button>
        <button class="btn btn-secondary" data-screen="manual">${svgIcon('plus')} Agregar manualmente</button>
      </div>
    </section>
    <div class="section-title"><h2>Tu progreso</h2><span>${stats.total} cargadas</span></div>
    <div class="stats-grid">
      ${statsCard('have', stats.have, 'Tengo', 'check')}
      ${statsCard('missing', stats.missing, 'Me faltan', 'x')}
      ${statsCard('repeated', stats.repeatedTotal, 'Repetidas', 'repeat')}
    </div>
    <div class="section-title"><h2>Accesos rápidos</h2><span>2 toques máximo</span></div>
    <div class="quick-grid">
      ${quickCard('album', 'Mi álbum', 'Ver todas tus figuritas', 'album', 'all')}
      ${quickCard('friends', 'Cambios con amigos', 'Compartí tus listas por WhatsApp', 'friends')}
      ${quickCard('album', 'Repetidas', 'Las que tenés para cambiar', 'repeat', 'repeated')}
      ${quickCard('album', 'Me faltan', 'Las que estás buscando', 'search', 'missing')}
    </div>`;
}
function statsCard(tone, count, label, icon) {
  const filter = tone === 'have' ? 'have' : tone === 'missing' ? 'missing' : 'repeated';
  return `<button class="stats-card stats-${tone}" data-screen="album" data-filter="${filter}">
    <span class="stats-icon">${svgIcon(icon)}</span><strong>${count}</strong><span>${label}</span>
  </button>`;
}
function quickCard(screen, title, subtitle, icon, filter = '') {
  return `<button class="quick-card" data-screen="${screen}" ${filter ? `data-filter="${filter}"` : ''}>
    <span class="quick-icon">${svgIcon(icon)}</span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span>
  </button>`;
}

function renderScanner() {
  const detected = state.scanner.detectedNumber;
  return `${renderScreenHeader('Escanear ahora', 'Apuntá al número de la figurita dentro del recuadro.')}
    ${detected ? renderPostScanCard(detected) : `<section class="camera-shell">
      <video id="cameraVideo" class="camera-video" playsinline muted autoplay></video>
      <div class="camera-overlay"><div class="scan-frame"></div></div>
      <div class="scan-hint">Apuntá al número de la figurita</div>
      <div class="camera-actions">
        <div id="scanStatus" class="scan-status">${escapeHtml(state.scanner.message)}<small>Si no detecta, usá cargar número</small></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <button class="btn btn-secondary" data-action="retry-scan">Intentar de nuevo</button>
          <button class="btn btn-primary" data-action="manual-number">Cargar número</button>
        </div>
      </div>
    </section>
    <section class="panel detect-card" id="manualNumberBox" style="display:none">
      <div class="field"><label>Número de figurita</label><input class="input input-big" id="scannerNumberInput" inputmode="numeric" pattern="[0-9]*" placeholder="24" value="${escapeHtml(state.scanner.numberInput)}"></div>
      <button class="btn btn-primary btn-block" data-action="confirm-number">Continuar</button>
    </section>`}`;
}
function renderPostScanCard(number) {
  return `<section class="panel detect-card">
    <div class="detect-number"><span>Figurita detectada</span><strong>N° ${escapeHtml(number)}</strong></div>
    <p style="margin:0 0 12px;color:var(--muted);font-weight:800;text-align:center">¿Qué querés marcar?</p>
    ${renderStatusSelector(state.scanner.status, 'scanner')}
    ${state.scanner.status === 'repeated' ? renderQtyStepper(state.scanner.quantity, 'scanner') : ''}
    <div style="display:grid;gap:10px;margin-top:14px">
      <button class="btn btn-primary btn-block" data-action="save-scan">Guardar</button>
      <button class="btn btn-ghost btn-block" data-action="scan-another">Escanear otra</button>
      <button class="btn btn-secondary btn-block" data-screen="album">Ir al álbum</button>
    </div>
  </section>`;
}
function renderStatusSelector(current, prefix) {
  return `<div class="status-grid" data-prefix="${prefix}">
    ${statusButton('have', current, prefix, 'check', 'La tengo', 'Ya está en mi álbum')}
    ${statusButton('missing', current, prefix, 'x', 'Me falta', 'La estoy buscando')}
    ${statusButton('repeated', current, prefix, 'repeat', 'Repetida', 'La tengo para cambiar')}
  </div>`;
}
function statusButton(status, current, prefix, icon, title, subtitle) {
  return `<button class="status-card ${STATUS[status].tone} ${current === status ? 'selected' : ''}" data-status-target="${prefix}" data-status="${status}">
    <span class="status-icon">${svgIcon(icon)}</span><span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></span>
  </button>`;
}
function renderQtyStepper(value, prefix) {
  return `<div class="field" style="margin-top:14px"><label>Cantidad repetidas</label><div class="qty-stepper" data-qty-target="${prefix}">
    <button data-qty="-1" aria-label="Restar">-</button><output>${Math.max(1, Number(value || 1))}</output><button data-qty="1" aria-label="Sumar">+</button>
  </div></div>`;
}

function renderManual() {
  const isEdit = !!state.editingId;
  return `${renderScreenHeader(isEdit ? 'Editar figurita' : 'Agregar figurita', 'Carga rápida, clara y sin vueltas.')}
  <section class="panel">
    <div class="field"><label>Número de figurita</label><input id="manualNumber" class="input input-big" inputmode="numeric" pattern="[0-9]*" placeholder="24" value="${escapeHtml(state.manual.number)}"></div>
    <div class="field"><label>Selección / país opcional</label><select id="manualTeam" class="select">${TEAMS.map(t => `<option value="${escapeHtml(t === 'Sin selección' ? '' : t)}" ${state.manual.team === (t === 'Sin selección' ? '' : t) ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}</select></div>
    <div class="field"><label>Estado</label>${renderStatusSelector(state.manual.status, 'manual')}</div>
    ${state.manual.status === 'repeated' ? renderQtyStepper(state.manual.quantity, 'manual') : ''}
    <div style="display:grid;gap:10px;margin-top:16px">
      <button class="btn btn-primary btn-block" data-action="save-manual">Guardar</button>
      ${!isEdit ? `<button class="btn btn-ghost btn-block" data-action="save-manual-another">Guardar y cargar otra</button>` : ''}
      <button class="btn btn-secondary btn-block" data-screen="home">Cancelar</button>
    </div>
  </section>`;
}

function renderAlbum() {
  const stickers = filteredStickers();
  const title = state.filter === 'have' ? 'Tengo' : state.filter === 'missing' ? 'Me faltan' : state.filter === 'repeated' ? 'Repetidas' : 'Mi álbum';
  return `${renderScreenHeader(title, 'Buscá, filtrá, editá, eliminá o compartí tus figuritas.')}
    <section class="toolbar">
      <div class="search-row"><input class="input" id="searchInput" inputmode="numeric" placeholder="Buscar número" value="${escapeHtml(state.search)}"><button class="btn btn-ghost btn-small" data-action="toggle-select">${state.selectionMode ? 'Cancelar' : 'Seleccionar'}</button></div>
      <div class="filter-chips">
        ${filterChip('all', 'Todas')}${filterChip('have', 'Tengo')}${filterChip('missing', 'Me faltan')}${filterChip('repeated', 'Repetidas')}
      </div>
    </section>
    ${stickers.length ? `<section class="album-grid">${stickers.map(renderStickerCard).join('')}</section>` : renderEmptyAlbum()}
    ${state.selected.size ? renderBulkBar() : ''}`;
}
function filterChip(filter, label) {
  return `<button class="chip ${state.filter === filter ? 'active' : ''}" data-filter-chip="${filter}">${escapeHtml(label)}</button>`;
}
function renderStickerCard(s) {
  const selected = state.selected.has(s.id);
  return `<article class="sticker-card ${STATUS[s.status].tone} ${selected ? 'selected' : ''}">
    ${state.selectionMode ? `<button class="check-dot" data-select="${s.id}" aria-label="Seleccionar">${selected ? svgIcon('check') : ''}</button>` : ''}
    <div class="sticker-face" ${state.selectionMode ? `data-select="${s.id}"` : ''}><div class="sticker-number">${escapeHtml(s.number)}</div><div class="sticker-team">${escapeHtml(s.team || 'Figurita')}</div></div>
    <div class="sticker-body">
      <span class="status-badge ${STATUS[s.status].tone}">${svgIcon(s.status === 'have' ? 'check' : s.status === 'missing' ? 'x' : 'repeat')}${escapeHtml(s.status === 'repeated' ? `Repetida x${Math.max(1, s.repeatedCount || 1)}` : STATUS[s.status].long)}</span>
      <div class="card-actions">
        <button class="card-action" data-action="edit" data-id="${s.id}" aria-label="Editar">${svgIcon('edit')}</button>
        <button class="card-action" data-action="share-one" data-id="${s.id}" aria-label="WhatsApp">${svgIcon('share')}</button>
        <button class="card-action danger" data-action="delete" data-id="${s.id}" aria-label="Eliminar">${svgIcon('trash')}</button>
      </div>
    </div>
  </article>`;
}
function renderEmptyAlbum() {
  return `<section class="panel empty-state"><div class="empty-icon">${svgIcon('album')}</div><strong>No hay figuritas acá</strong><p>Agregá una manualmente o abrí el escáner para empezar.</p><button class="btn btn-primary btn-block" data-screen="scanner">${svgIcon('scan')} Escanear ahora</button></section>`;
}
function renderBulkBar() {
  return `<section class="bulk-bar"><strong>${state.selected.size} seleccionadas</strong><div class="bulk-row">
    <button class="bulk-have" data-bulk="have">Tengo</button>
    <button class="bulk-missing" data-bulk="missing">Faltan</button>
    <button class="bulk-repeated" data-bulk="repeated">Repetidas</button>
    <button class="bulk-delete" data-action="bulk-delete">Eliminar</button>
  </div></section>`;
}

function renderFriends() {
  return `${renderScreenHeader('Cambios con amigos', 'Compartí tus repetidas o faltantes y coordiná por WhatsApp.')}
    <section class="panel">
      <div class="empty-state" style="padding-top:12px"><div class="empty-icon">${svgIcon('friends')}</div><strong>Compartí tus cambios</strong><p>Por ahora esta versión usa WhatsApp para intercambiar. No inventa coincidencias: manda tu lista real.</p></div>
      <div style="display:grid;gap:10px">
        <button class="btn btn-primary btn-block" data-action="share-repeated">Compartir repetidas</button>
        <button class="btn btn-ghost btn-block" data-action="share-missing">Compartir faltantes</button>
        <button class="btn btn-secondary btn-block" data-screen="share">Compartir resumen completo</button>
      </div>
    </section>`;
}
function renderShare() {
  const stats = getStats();
  return `${renderScreenHeader('Compartir resumen', 'Enviá tu álbum con formato prolijo por WhatsApp.')}
    <section class="share-preview">
      <div class="brand-mark" style="background:white;color:var(--blue-900);box-shadow:none">${icons.logo}</div>
      <h2>Mi álbum FiguScan</h2><p>Resumen listo para compartir y hacer cambios.</p>
      <div class="summary-list">
        <div class="summary-item"><strong>Tengo</strong><span>${stats.have} figuritas</span></div>
        <div class="summary-item"><strong>Me faltan</strong><span>${stats.missing} figuritas</span></div>
        <div class="summary-item"><strong>Repetidas</strong><span>${stats.repeatedTotal} disponibles para cambiar</span></div>
      </div>
    </section>
    <div style="display:grid;gap:10px;margin-top:14px">
      <button class="btn btn-primary btn-block" data-action="share-summary">${svgIcon('share')} Compartir resumen</button>
      <button class="btn btn-ghost btn-block" data-action="copy-summary">Copiar texto</button>
    </div>`;
}
function renderProfile() {
  return `${renderScreenHeader('Perfil', 'Nombre simple para personalizar la app.')}
    <section class="panel">
      <div class="field"><label>Tu nombre</label><input class="input" id="profileName" placeholder="Lucas" value="${escapeHtml(state.user.name || '')}"></div>
      <button class="btn btn-primary btn-block" data-action="save-profile">Guardar nombre</button>
      <div class="section-title"><h2>Datos guardados</h2></div>
      <p style="color:var(--muted);line-height:1.4;margin:0 0 12px">La app guarda tus figuritas en este dispositivo. Si cerrás y volvés a entrar, siguen estando.</p>
      <button class="btn btn-ghost btn-block" data-action="export-json">${svgIcon('download')} Descargar copia de seguridad</button>
    </section>`;
}
function renderBottomNav() {
  return `<nav class="bottom-nav"><div class="nav-grid">
    ${navItem('home', 'Inicio', 'home')}
    ${navItem('scanner', 'Escanear', 'scan')}
    ${navItem('album', 'Álbum', 'album')}
    ${navItem('friends', 'Amigos', 'friends')}
    ${navItem('share', 'Compartir', 'share')}
  </div></nav>`;
}
function navItem(screen, label, icon) {
  const active = state.screen === screen || (screen === 'album' && state.screen === 'album');
  return `<button class="nav-item ${active ? 'active' : ''}" data-screen="${screen}">${svgIcon(icon)}<span>${escapeHtml(label)}</span></button>`;
}
function renderModal() {
  if (!state.modal) return '';
  return `<div class="modal-backdrop"><section class="modal"><h3>${escapeHtml(state.modal.title)}</h3><p>${escapeHtml(state.modal.message)}</p><div class="modal-actions"><button class="btn btn-secondary" data-action="modal-cancel">${escapeHtml(state.modal.cancelText)}</button><button class="btn ${state.modal.danger ? 'btn-danger' : 'btn-primary'}" data-action="modal-confirm">${escapeHtml(state.modal.confirmText)}</button></div></section></div>`;
}

function attachEvents() {
  document.querySelectorAll('[data-screen]').forEach(el => el.addEventListener('click', () => setScreen(el.dataset.screen, { filter: el.dataset.filter })));
  document.querySelectorAll('[data-filter-chip]').forEach(el => el.addEventListener('click', () => { state.filter = el.dataset.filterChip; state.selected.clear(); state.selectionMode = false; render(); }));
  document.querySelectorAll('[data-status]').forEach(el => el.addEventListener('click', () => {
    const target = el.dataset.statusTarget; const status = el.dataset.status;
    if (target === 'manual') state.manual.status = status;
    if (target === 'scanner') state.scanner.status = status;
    render();
  }));
  document.querySelectorAll('[data-qty]').forEach(el => el.addEventListener('click', () => {
    const wrap = el.closest('[data-qty-target]'); const target = wrap?.dataset.qtyTarget; const delta = Number(el.dataset.qty);
    if (target === 'manual') state.manual.quantity = Math.max(1, Number(state.manual.quantity || 1) + delta);
    if (target === 'scanner') state.scanner.quantity = Math.max(1, Number(state.scanner.quantity || 1) + delta);
    render();
  }));
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', e => { state.search = e.target.value; render(); });
  const manualNumber = document.getElementById('manualNumber');
  if (manualNumber) manualNumber.addEventListener('input', e => state.manual.number = e.target.value);
  const manualTeam = document.getElementById('manualTeam');
  if (manualTeam) manualTeam.addEventListener('change', e => state.manual.team = e.target.value);
  document.querySelectorAll('[data-select]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); toggleSelected(el.dataset.select); }));
  document.querySelectorAll('[data-bulk]').forEach(el => el.addEventListener('click', () => bulkSetStatus(el.dataset.bulk)));
  document.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => handleAction(el.dataset.action, el.dataset.id)));
}

function handleAction(action, id) {
  if (action === 'profile') return setScreen('profile');
  if (action === 'modal-cancel') return closeModal();
  if (action === 'modal-confirm') return confirmModal();
  if (action === 'toggle-select') { state.selectionMode = !state.selectionMode; if (!state.selectionMode) state.selected.clear(); return render(); }
  if (action === 'bulk-delete') return bulkDelete();
  if (action === 'edit') return editSticker(id);
  if (action === 'delete') return deleteSticker(id);
  if (action === 'share-one') { const s = state.stickers.find(x => x.id === id); if (s) return shareSticker(s); }
  if (action === 'save-manual') return saveManual(false);
  if (action === 'save-manual-another') return saveManual(true);
  if (action === 'retry-scan') { state.scanner.detectedNumber = null; state.scanner.message = 'Preparando cámara...'; return render(), startCameraSoon(); }
  if (action === 'manual-number') { const box = document.getElementById('manualNumberBox'); if (box) box.style.display = 'block'; const inp = document.getElementById('scannerNumberInput'); if (inp) inp.focus(); return; }
  if (action === 'confirm-number') { const inp = document.getElementById('scannerNumberInput'); const n = normalizedNumber(inp?.value); if (!n) return showToast('Ingresá un número.'); state.scanner.detectedNumber = n; state.scanner.numberInput = n; stopCamera(false); return render(); }
  if (action === 'save-scan') return saveScan();
  if (action === 'scan-another') { state.scanner = { active: false, detectedNumber: null, numberInput: '', status: 'have', quantity: 1, message: 'Preparando cámara...', canOcr: false, tries: 0 }; render(); return startCameraSoon(); }
  if (action === 'share-summary') return shareSummary();
  if (action === 'copy-summary') return navigator.clipboard?.writeText(buildWhatsAppMessage()).then(() => showToast('Resumen copiado.')).catch(() => showToast('No pude copiar.'));
  if (action === 'share-repeated') return shareByStatus('repeated');
  if (action === 'share-missing') return shareByStatus('missing');
  if (action === 'save-profile') return saveProfile();
  if (action === 'export-json') return exportJson();
}
function saveManual(again) {
  const number = normalizedNumber(document.getElementById('manualNumber')?.value);
  const team = document.getElementById('manualTeam')?.value || '';
  state.manual.number = number; state.manual.team = team;
  const ok = upsertSticker({ number, team, status: state.manual.status, repeatedCount: state.manual.quantity }, { editingId: state.editingId });
  if (!ok) return;
  state.editingId = null;
  if (again) {
    state.manual = { number: '', team, status: state.manual.status, quantity: 1 };
    render();
  } else setScreen('album', { filter: 'all' });
}
function saveScan() {
  const ok = upsertSticker({ number: state.scanner.detectedNumber || state.scanner.numberInput, status: state.scanner.status, repeatedCount: state.scanner.quantity, team: '' });
  if (ok) setScreen('album', { filter: state.scanner.status });
}
function shareByStatus(status) {
  const list = state.stickers.filter(s => s.status === status).sort((a,b)=>Number(a.number)-Number(b.number));
  const title = status === 'repeated' ? 'Mis repetidas FiguScan' : 'Mis faltantes FiguScan';
  const body = list.length ? list.map(s => status === 'repeated' ? `N° ${s.number} x${s.repeatedCount || 1}${s.team ? ` (${s.team})` : ''}` : `N° ${s.number}${s.team ? ` (${s.team})` : ''}`).join('\n') : 'Sin figuritas cargadas';
  openWhatsApp(`${title}:\n\n${body}\n\n¿Hacemos cambios?`);
}
function saveProfile() {
  const name = document.getElementById('profileName')?.value?.trim() || '';
  state.user = { ...state.user, name };
  saveUser(state.user);
  showToast('Nombre guardado.');
}
function exportJson() {
  const blob = new Blob([JSON.stringify({ stickers: state.stickers, user: state.user, exportedAt: now() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'figuscan-copia.json'; a.click();
  URL.revokeObjectURL(url);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
window.addEventListener('beforeunload', () => stopCamera(false));
render();
