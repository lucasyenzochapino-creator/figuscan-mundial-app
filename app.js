/* FiguScan Mundial V25 - fondo mundialista fuerte + visor de figuritas */
const STORAGE_KEY = 'figuscan_v12_stickers';
const USER_KEY = 'figuscan_v12_user';
const APP_URL = 'https://figuscan-mundial-app.vercel.app/';

const STATUS = {
  have: { label: 'Tengo', long: 'La tengo', cls: 'have', color: '#18A957' },
  missing: { label: 'Me falta', long: 'Me falta', cls: 'missing', color: '#E23131' },
  repeated: { label: 'Repetida', long: 'Repetida', cls: 'repeated', color: '#F28B13' },
};


const COUNTRIES = [
  { id:'general', name:'General', short:'GEN', flag:'⚽', color:'#FFD166' },
  { id:'argentina', name:'Argentina', short:'ARG', flag:'🇦🇷', color:'#74C0FC' },
  { id:'brasil', name:'Brasil', short:'BRA', flag:'🇧🇷', color:'#2DD36F' },
  { id:'francia', name:'Francia', short:'FRA', flag:'🇫🇷', color:'#4D96FF' },
  { id:'uruguay', name:'Uruguay', short:'URU', flag:'🇺🇾', color:'#7DD3FC' },
  { id:'espana', name:'España', short:'ESP', flag:'🇪🇸', color:'#FF6B6B' },
  { id:'inglaterra', name:'Inglaterra', short:'ING', flag:'🏴', color:'#F8FAFC' },
  { id:'alemania', name:'Alemania', short:'ALE', flag:'🇩🇪', color:'#FACC15' },
  { id:'italia', name:'Italia', short:'ITA', flag:'🇮🇹', color:'#22C55E' },
  { id:'portugal', name:'Portugal', short:'POR', flag:'🇵🇹', color:'#EF4444' },
  { id:'paises-bajos', name:'Países Bajos', short:'NED', flag:'🇳🇱', color:'#FB923C' },
  { id:'mexico', name:'México', short:'MEX', flag:'🇲🇽', color:'#10B981' },
  { id:'usa', name:'Estados Unidos', short:'USA', flag:'🇺🇸', color:'#60A5FA' },
  { id:'japon', name:'Japón', short:'JPN', flag:'🇯🇵', color:'#F472B6' },
  { id:'marruecos', name:'Marruecos', short:'MAR', flag:'🇲🇦', color:'#DC2626' },
];
function slugifyCountry(value){
  return String(value || '')
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'') || 'general';
}
function customCountryName(id){
  const found = state?.stickers?.find?.(s => s.country === id && s.countryName);
  return found?.countryName || '';
}
function countryById(id){
  const found = COUNTRIES.find(c=>c.id===id);
  if(found) return found;
  const name = customCountryName(id) || String(id || 'General').replace(/-/g,' ').replace(/\b\w/g, m=>m.toUpperCase());
  return { id:id || 'general', name, short:name.slice(0,3).toUpperCase(), flag:'⚑', color:'#FFE08A', custom:true };
}
function countryLabel(id){ return countryById(id).name; }
function countryFromInput(value){
  const raw = String(value || '').trim();
  if(!raw) return { country:'general', countryName:'General' };
  const byName = COUNTRIES.find(c => c.name.toLowerCase() === raw.toLowerCase() || c.short.toLowerCase() === raw.toLowerCase());
  if(byName) return { country:byName.id, countryName:byName.name };
  return { country:slugifyCountry(raw), countryName:raw };
}
function availableCountries(){
  const map = new Map(COUNTRIES.map(c => [c.id, c]));
  state.stickers.forEach(s => {
    const id = s.country || 'general';
    if(!map.has(id)) map.set(id, countryById(id));
  });
  return Array.from(map.values());
}

const icons = {
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3a2 2 0 0 1 0 4h-3"/><path d="M7 5H4a2 2 0 0 0 0 4h3"/><path d="M9 17h6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5a1 1 0 0 1 1-1h2"/><path d="M17 4h2a1 1 0 0 1 1 1v2"/><path d="M20 17v2a1 1 0 0 1-1 1h-2"/><path d="M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M7 12h10"/></svg>',
  album: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M9 6h7"/><path d="M9 10h7"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5A8.1 8.1 0 0 1 8 18.6L3 20l1.4-4.8A8.1 8.1 0 1 1 20 11.5Z"/><path d="M8.5 8.5c.4 3.1 2 5 5 6"/><path d="M8.5 8.5h2l.8 2-1 1"/><path d="M13.5 14.5l1-1 2 .8v2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4-4L5 21"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  ball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m12 6 4 3-1.5 5h-5L8 9l4-3Z"/><path d="M8 9 4.5 7.8M16 9l3.5-1.2M9.5 14 7 18M14.5 14l2.5 4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
};

let state = {
  view: 'home',
  stickers: loadStickers(),
  user: localStorage.getItem(USER_KEY) || 'Lucas',
  albumFilter: 'all',
  countryFilter: 'all',
  search: '',
  countrySearch: '',
  selected: new Set(),
  modal: null,
  toast: null,
  manualDefault: 'have',
  editingId: null,
  scannerStream: null,
  cameraStarting: false,
  cameraError: '',
  scanBusy: false,
  detectedNumber: '',
  scanCandidate: null,
  autoScanTimer: null,
  autoScanPaused: false,
  shareMode: 'summary',
  batchStatus: 'have',
  viewerId: null
};

const app = document.getElementById('app');

function loadStickers(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveStickers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stickers)); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function now(){ return new Date().toISOString(); }
function haptic(type='tap'){
  if(!navigator.vibrate) return;
  if(type === 'success') navigator.vibrate([18, 35, 18]);
  else if(type === 'warn') navigator.vibrate([35]);
  else navigator.vibrate(12);
}
function normalizeNumber(value){
  const v = String(value || '').replace(/[^0-9]/g,'').replace(/^0+(?=\d)/,'');
  return v;
}
function normalizeText(value){
  return String(value || '')
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase();
}
function byNumber(a,b){ return Number(a.number) - Number(b.number); }
function setView(view, opts={}){
  stopCamera();
  state.view = view;
  if(opts.filter) state.albumFilter = opts.filter;
  if(opts.manualDefault) state.manualDefault = opts.manualDefault;
  if(opts.editingId !== undefined) state.editingId = opts.editingId;
  state.selected = new Set();
  state.detectedNumber = '';
  state.scanCandidate = null;
  state.autoScanPaused = false;
  if(view === 'scanner') state.cameraError = '';
  render();
}

function centerScannerFrame(){
  if(state.view !== 'scanner') return;
  const el = document.querySelector('.scanner-wrap');
  if(!el) return;
  try{
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }catch(e){
    const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 90);
    window.scrollTo(0, y);
  }
}

function toast(message, type='success'){
  haptic(type === 'warn' ? 'warn' : 'success');
  state.toast = { message, type };
  render();
  setTimeout(()=>{ state.toast=null; render(); }, 2600);
}
function counts(){
  return {
    have: state.stickers.filter(s=>s.status==='have').length,
    missing: state.stickers.filter(s=>s.status==='missing').length,
    repeated: state.stickers.filter(s=>s.status==='repeated').reduce((acc,s)=>acc + (Number(s.repeatedCount)||1),0),
    total: state.stickers.length
  };
}

function stickerCountry(s){ return s.country || 'general'; }
function countryStats(){
  const map = new Map();
  state.stickers.forEach(s=>{
    const id = stickerCountry(s);
    if(!map.has(id)) map.set(id,{ id, total:0, have:0, missing:0, repeated:0 });
    const row = map.get(id); row.total += 1; row[s.status] += 1;
  });
  return Array.from(map.values()).sort((a,b)=>b.total-a.total).slice(0,8);
}
function progressPercent(row){ return row.total ? Math.round((row.have / row.total) * 100) : 0; }

function existingByNumber(number){ return state.stickers.find(s => String(s.number) === String(number)); }
function formatSticker(s){
  const name = s.player ? ` - ${s.player}` : '';
  return `N° ${s.number}${name}`;
}

function addOrUpdateSticker({ number, status, repeatedCount=1, player='', country='general', countryName='', image='', forceMissing=false }){
  number = normalizeNumber(number);
  if(!number){ toast('Ingresá un número de figurita.', 'warn'); return false; }
  if(!['have','missing','repeated'].includes(status)) status = 'have';

  const existing = existingByNumber(number);
  const stamp = now();
  const cleanPlayer = String(player || '').trim();
  const cleanCountry = country || 'general';
  const cleanCountryName = countryName || countryLabel(cleanCountry);
  const qty = Math.max(1, Number(repeatedCount)||1);

  if(existing){
    if(cleanPlayer) existing.player = cleanPlayer;
    if(cleanCountry) existing.country = cleanCountry;
    if(cleanCountryName) existing.countryName = cleanCountryName;
    if(image) existing.image = image;
    existing.updatedAt = stamp;

    if(status === 'have'){
      if(existing.status === 'have'){
        existing.status = 'repeated';
        existing.repeatedCount = Math.max(2, (Number(existing.repeatedCount)||1) + 1);
        toast(`Ya tenías la N° ${number}. La marqué como repetida.`, 'warn');
      } else if(existing.status === 'repeated'){
        existing.repeatedCount = (Number(existing.repeatedCount)||1) + 1;
        toast(`La N° ${number} ya era repetida. Sumé una más.`, 'warn');
      } else {
        existing.status = 'have';
        existing.repeatedCount = 0;
        toast(`La N° ${number} estaba en faltantes. Ahora la tenés.`, 'success');
      }
      saveStickers(); render(); return true;
    }

    if(status === 'repeated'){
      existing.status = 'repeated';
      existing.repeatedCount = (Number(existing.repeatedCount)||0) + qty;
      toast(`La N° ${number} quedó como repetida x${existing.repeatedCount}.`, 'warn');
      saveStickers(); render(); return true;
    }

    if(status === 'missing'){
      if(existing.status === 'missing'){
        toast(`La N° ${number} ya estaba en faltantes.`, 'warn');
        saveStickers(); render(); return true;
      }
      if(forceMissing){
        existing.status = 'missing';
        existing.repeatedCount = 0;
        toast(`La N° ${number} quedó como faltante.`, 'success');
        saveStickers(); render(); return true;
      }
      state.modal = {
        title: `La N° ${number} ya está cargada`,
        text: `Figura como “${STATUS[existing.status].label}”. ¿Querés cambiarla a “Me falta”?`,
        cancel: 'Mantener',
        confirm: 'Cambiar a faltante',
        danger: false,
        onConfirm: () => {
          existing.status = 'missing';
          existing.repeatedCount = 0;
          existing.updatedAt = now();
          saveStickers();
          state.modal = null;
          state.albumFilter = 'missing';
          state.countryFilter = 'all';
          state.search = '';
          toast(`La N° ${number} quedó como faltante.`, 'success');
          setView('album',{filter:'missing'});
        }
      };
      render();
      return false;
    }
  }

  const sticker = {
    id: uid(),
    number,
    player: cleanPlayer,
    country: cleanCountry,
    countryName: cleanCountryName,
    image: image || '',
    status,
    repeatedCount: status === 'repeated' ? qty : 0,
    createdAt: stamp,
    updatedAt: stamp
  };
  state.stickers.push(sticker);
  state.stickers.sort(byNumber);
  saveStickers();
  toast(`Figurita N° ${number} guardada como ${STATUS[status].label}.`, 'success');
  render();
  return true;
}

function deleteSticker(id){
  const s = state.stickers.find(x=>x.id===id);
  if(!s) return;
  state.modal = {
    title: `Eliminar figurita N° ${s.number}`,
    text: 'Esta acción borra la figurita de tu álbum en este celular.',
    cancel: 'Cancelar',
    confirm: 'Eliminar',
    danger: true,
    onConfirm: () => {
      state.stickers = state.stickers.filter(x=>x.id!==id);
      state.selected.delete(id);
      saveStickers();
      state.modal = null;
      toast(`Eliminé la N° ${s.number}.`, 'success');
      render();
    }
  };
  render();
}
function bulkDelete(){
  const ids = [...state.selected];
  if(!ids.length) return;
  state.modal = {
    title: `Eliminar ${ids.length} figuritas`,
    text: 'Se borrarán de tu álbum en este celular.',
    cancel: 'Cancelar',
    confirm: 'Eliminar',
    danger: true,
    onConfirm: () => {
      state.stickers = state.stickers.filter(s=>!state.selected.has(s.id));
      state.selected = new Set();
      saveStickers();
      state.modal = null;
      toast('Figuritas eliminadas.', 'success');
      render();
    }
  };
  render();
}
function bulkStatus(status){
  if(!state.selected.size) return;
  state.stickers.forEach(s=>{
    if(state.selected.has(s.id)){
      s.status = status;
      s.repeatedCount = status === 'repeated' ? Math.max(1, Number(s.repeatedCount)||1) : 0;
      s.updatedAt = now();
    }
  });
  saveStickers();
  state.selected = new Set();
  toast('Cambios aplicados.', 'success');
  render();
}
function toggleSelect(id){
  if(state.selected.has(id)) state.selected.delete(id); else state.selected.add(id);
  render();
}
function filteredStickers(){
  let list = [...state.stickers];
  if(state.albumFilter !== 'all') list = list.filter(s=>s.status===state.albumFilter);
  if(state.countryFilter !== 'all') list = list.filter(s=>stickerCountry(s)===state.countryFilter);
  if(state.search.trim()) {
    const q = normalizeText(state.search);
    const qn = normalizeNumber(state.search);
    list = list.filter(s=>String(s.number).includes(qn) || normalizeText(s.player||'').includes(q));
  }
  if(state.countrySearch.trim()) {
    const cq = normalizeText(state.countrySearch);
    list = list.filter(s=>normalizeText(s.countryName || countryLabel(stickerCountry(s))).includes(cq));
  }
  return list.sort(byNumber);
}


function statusIcon(status){
  if(status==='have') return icons.check;
  if(status==='missing') return icons.x;
  return icons.repeat;
}
function appTrophyBg(){
  return `<div class="bg-trophy"><svg viewBox="0 0 260 260" fill="none" aria-hidden="true"><path d="M72 44h116v42c0 32-26 58-58 58s-58-26-58-58V44Z" fill="#FFD96A" stroke="#FFF2B2" stroke-width="6"/><path d="M188 58h35c9 0 16 7 16 16 0 27-22 49-49 49h-8" stroke="#FFD96A" stroke-width="16" stroke-linecap="round"/><path d="M72 58H37c-9 0-16 7-16 16 0 27 22 49 49 49h8" stroke="#FFD96A" stroke-width="16" stroke-linecap="round"/><path d="M130 144v38" stroke="#FFD96A" stroke-width="18" stroke-linecap="round"/><path d="M92 204h76" stroke="#FFD96A" stroke-width="20" stroke-linecap="round"/><path d="M78 230h104" stroke="#FFD96A" stroke-width="18" stroke-linecap="round"/><path d="M99 64c6 40 32 58 70 59" stroke="white" stroke-opacity=".55" stroke-width="10" stroke-linecap="round"/></svg></div>`;
}
function topbar(right=''){
  return `<div class="topbar"><div class="brand"><div class="logo">${icons.trophy}</div><div><div class="brand-title">FiguScan</div><div class="brand-sub">Mundial de figuritas</div></div></div>${right}</div>`;
}

function homeScreen(){
  const c = counts();
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'all'})">Mi álbum</button>`)}
    <section class="hero premium-hero">
      <div class="shine-ball">${icons.trophy}</div>
      <h1>Tu álbum, listo para cambiar</h1>
      <p>Escaneá, cargá faltantes y compartí listas con estilo mundialista.</p>
      <div class="hero-actions">
        <button class="btn btn-gold" onclick="setView('scanner')">${icons.scan} Escanear ahora</button>
        <button class="btn btn-white" onclick="setView('manual',{manualDefault:'have'})">${icons.plus} Agregar manual</button>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Resumen</h2><span class="muted">${c.total} cargadas</span></div>
      <div class="stats">
        <button class="stat have" onclick="setView('album',{filter:'have'})">${icons.check}<div class="stat-num">${c.have}</div><div class="stat-label">Tengo</div></button>
        <button class="stat missing" onclick="setView('album',{filter:'missing'})">${icons.x}<div class="stat-num">${c.missing}</div><div class="stat-label">Me faltan</div></button>
        <button class="stat repeated" onclick="setView('album',{filter:'repeated'})">${icons.repeat}<div class="stat-num">${c.repeated}</div><div class="stat-label">Repetidas</div></button>
      </div>
    </section>

    <section class="section">
      <div class="section-title"><h2>Accesos rápidos</h2></div>
      <div class="quick-grid">
        <button class="quick-card" onclick="setView('album',{filter:'all'})">${icons.album}<br>Mi álbum</button>
        <button class="quick-card" onclick="setView('friends')">${icons.users}<br>Cambios con amigos</button>
        <button class="quick-card" onclick="setView('album',{filter:'repeated'})">${icons.repeat}<br>Repetidas</button>
        <button class="quick-card" onclick="setView('share')">${icons.share}<br>Compartir</button>
      </div>
    </section>

    <section class="section progress-section">
      <div class="section-title"><h2>Progreso por selección</h2><span class="muted">motivación</span></div>
      ${countryProgressHtml()}
    </section>
  </main>`;
}

function countryProgressHtml(){
  const rows = countryStats();
  if(!rows.length) return `<p class="muted">Cuando cargues figuritas, vas a ver el avance por selección.</p>`;
  return `<div class="country-progress-list">${rows.map(row=>{ const c=countryById(row.id); const pct=progressPercent(row); return `<button class="country-progress" onclick="selectCountry('${row.id}')"><span class="flag">${c.flag}</span><span><strong>${c.name}</strong><small>${row.have}/${row.total} obtenidas</small></span><b>${pct}%</b><i><em style="width:${pct}%"></em></i></button>`; }).join('')}</div>`;
}
function selectCountry(id){
  state.countryFilter = id || 'all';
  state.countrySearch = '';
  state.selected = new Set();
  state.view = 'album';
  haptic('tap');
  render();
}
function countryCarouselHtml(){
  const rows = countryStats();
  const allActive = state.countryFilter === 'all' && !state.countrySearch.trim();
  const total = state.stickers.length;
  const items = [`<button class="country-tile ${allActive?'active':''}" onclick="selectCountry('all')"><span class="tile-flag">${icons.album}</span><strong>Ver todo</strong><small>${total} figuritas</small><i><em style="width:100%"></em></i></button>`];
  const seen = new Set(rows.map(r=>r.id));
  rows.forEach(row=>{
    const c = countryById(row.id); const pct = progressPercent(row); const active = state.countryFilter === row.id;
    items.push(`<button class="country-tile ${active?'active':''}" onclick="selectCountry('${row.id}')"><span class="tile-flag">${c.flag}</span><strong>${c.name}</strong><small>${row.have}/${row.total} tengo</small><b>${pct}%</b><i><em style="width:${pct}%"></em></i></button>`);
  });
  availableCountries().filter(c=>!seen.has(c.id)).slice(0,8).forEach(c=>{
    const active = state.countryFilter === c.id;
    items.push(`<button class="country-tile ${active?'active':''}" onclick="selectCountry('${c.id}')"><span class="tile-flag">${c.flag}</span><strong>${c.name}</strong><small>Sin progreso</small><i><em style="width:0%"></em></i></button>`);
  });
  return `<div class="country-carousel">${items.join('')}</div>`;
}

function entryModeSwitch(current){
  return `<section class="entry-switch-wrap"><div class="entry-switch">
    <button class="entry-switch-btn ${current==='scanner'?'active':''}" onclick="setView('scanner')">${icons.scan}<span>Escanear</span></button>
    <button class="entry-switch-btn ${current==='manual'?'active':''}" onclick="setView('manual',{manualDefault:'have'})">${icons.plus}<span>Agregar manualmente</span></button>
  </div><p class="entry-switch-help">Elegí si querés leer la figurita con cámara o cargarla a mano.</p></section>`;
}

function manualScreen(){
  const editing = state.editingId ? state.stickers.find(s=>s.id===state.editingId) : null;
  const defaultStatus = editing ? editing.status : state.manualDefault;
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'${state.albumFilter}'})">Volver</button>`)}
    <section class="hero">
      <div class="logo">${icons.plus}</div>
      <h1>${editing ? 'Editar figurita' : 'Agregar figurita'}</h1>
      <p>${editing ? 'Actualizá el número, jugador, estado o cantidad.' : 'Cargala por número. Si ya la tenés, la app la pasa a repetida automáticamente.'}</p>
    </section>
    ${entryModeSwitch('manual')}
    <section class="section">
      <form class="form" onsubmit="submitManual(event)">
        <div class="field"><label>Número de figurita</label><input class="input" inputmode="numeric" pattern="[0-9]*" id="num" placeholder="Ej: 24" value="${editing ? escapeHtml(editing.number) : ''}" required></div>
        <div class="field"><label>Nombre del jugador</label><input class="input" id="player" placeholder="Ej: Messi" value="${editing ? escapeHtml(editing.player||'') : ''}"></div>
        <div class="field"><label>Selección / país</label><input class="input" id="countryInput" list="countryList" placeholder="Escribí Argentina, Brasil..." value="${editing ? escapeHtml(editing.countryName || countryLabel(editing.country || 'general')) : ''}"><datalist id="countryList">${countryOptions(editing?.country || 'general')}</datalist><small class="help">Escribí y elegí una sugerencia. Si no existe, la app agrega ese país.</small></div>
        <div class="field"><label>¿Cómo la querés marcar?</label><div class="state-grid">
          ${stateButton('have', defaultStatus)}
          ${stateButton('missing', defaultStatus)}
          ${stateButton('repeated', defaultStatus)}
        </div></div>
        <input type="hidden" id="manualStatus" value="${defaultStatus}">
        <div id="qtyBlock" class="${defaultStatus==='repeated'?'':'hidden'}">${qtyBlock(editing?.repeatedCount || 1)}</div>
        <button class="btn btn-primary full" type="submit">Guardar</button>
        <button class="btn btn-ghost full" type="button" onclick="submitManual(event,true)">Guardar y cargar otra</button>
        <button class="btn btn-line full" type="button" onclick="setView('album',{filter:'${state.albumFilter}'})">Cancelar</button>
      </form>
    </section>
  </main>`;
}
function countryOptions(active='general'){ return availableCountries().map(c=>`<option value="${escapeHtml(c.name)}"></option>`).join(''); }
function stateButton(status, active){
  return `<button type="button" class="state-option ${status} ${active===status?'active':''}" onclick="chooseManualStatus('${status}')">${statusIcon(status)} <span>${STATUS[status].long}</span></button>`;
}
function qtyBlock(qty){
  return `<div class="field"><label>Cantidad de repetidas</label><div class="qty"><button type="button" onclick="changeQty(-1)">−</button><strong id="qtyValue">${Math.max(1, Number(qty)||1)}</strong><button type="button" onclick="changeQty(1)">+</button></div></div>`;
}
function chooseManualStatus(status){
  document.getElementById('manualStatus').value = status;
  document.querySelectorAll('.state-option').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.state-option.${status}`)?.classList.add('active');
  document.getElementById('qtyBlock').classList.toggle('hidden', status !== 'repeated');
}
function changeQty(delta){
  const el = document.getElementById('qtyValue');
  const next = Math.max(1, (Number(el.textContent)||1) + delta);
  el.textContent = next;
}
function submitManual(e, again=false){
  e?.preventDefault?.();
  const number = normalizeNumber(document.getElementById('num')?.value);
  const player = document.getElementById('player')?.value || '';
  const status = document.getElementById('manualStatus')?.value || state.manualDefault || 'have';
  const countryData = countryFromInput(document.getElementById('countryInput')?.value || 'General');
  const country = countryData.country;
  const countryName = countryData.countryName;
  const repeatedCount = Math.max(1, Number(document.getElementById('qtyValue')?.textContent || 1));

  if(!number){ toast('Ingresá el número de figurita.', 'warn'); return false; }

  if(state.editingId){
    const s = state.stickers.find(x=>x.id===state.editingId);
    if(s){
      s.number = number;
      s.player = player.trim();
      s.country = country;
      s.countryName = countryName;
      s.status = status;
      s.repeatedCount = status==='repeated' ? repeatedCount : 0;
      s.updatedAt = now();
      saveStickers();
      toast('Figurita actualizada.');
      state.editingId = null;
      state.countryFilter = 'all';
      state.search = '';
      setView('album',{filter:status});
    }
    return false;
  }

  const ok = addOrUpdateSticker({number, player, country, countryName, status, repeatedCount});
  if(ok){
    state.countryFilter = 'all';
    state.search = '';
    if(again){
      state.manualDefault = status;
      state.editingId = null;
      render();
      const num = document.getElementById('num');
      if(num){ num.value=''; num.focus(); }
      const p = document.getElementById('player'); if(p) p.value='';
    } else {
      setView('album',{filter:status});
    }
  }
  return false;
}


function albumCountryHeaderHtml(){
  if(state.countryFilter === 'all' && !state.countrySearch.trim()) return `<div class="album-country-title"><div>${icons.ball}<span>Vista global</span></div><small>${state.stickers.length} figuritas cargadas</small></div>`;
  const id = state.countryFilter !== 'all' ? state.countryFilter : '';
  const name = state.countrySearch.trim() || (id ? countryLabel(id) : 'País');
  const list = state.stickers.filter(s => id ? stickerCountry(s)===id : normalizeText(s.countryName || countryLabel(stickerCountry(s))).includes(normalizeText(name)));
  const have = list.filter(s=>s.status==='have').length;
  const total = list.length;
  const pct = total ? Math.round((have/total)*100) : 0;
  const meta = id ? countryById(id) : {flag:'⚑', name};
  return `<div class="album-country-title active-country"><div><span class="country-big-flag">${meta.flag}</span><span>${escapeHtml(name)}</span></div><small>${have}/${total} tengo · ${pct}%</small><i><em style="width:${pct}%"></em></i></div>`;
}

function albumScreen(){
  const list = filteredStickers();
  const filterLabel = state.albumFilter==='all'?'Todas':STATUS[state.albumFilter].label;
  const defaultAdd = state.albumFilter === 'all' ? 'have' : state.albumFilter;
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('share')">Compartir</button>`)}
    <section class="section album-head">
      <div class="section-title"><h2>Mi álbum</h2><span class="muted">${filterLabel}</span></div>
      ${albumCountryHeaderHtml()}
      ${countryCarouselHtml()}
      <div class="album-search-grid">
        <input class="search" placeholder="Buscar número o jugador" value="${escapeHtml(state.search)}" oninput="state.search=this.value; render()">
        <div class="country-search-wrap">
          <input class="search" list="albumCountryList" placeholder="Buscar país" value="${escapeHtml(state.countrySearch)}" oninput="state.countrySearch=this.value; render()">
          <datalist id="albumCountryList">${availableCountries().map(c=>`<option value="${escapeHtml(c.name)}"></option>`).join('')}</datalist>
        </div>
      </div>
      <div class="toolbar">
        ${filterChip('all','Todas')}${filterChip('have','Tengo')}${filterChip('missing','Me faltan')}${filterChip('repeated','Repetidas')}
      </div>
      <div class="toolbar countries-toolbar">${countryChip('all','Todas')}${availableCountries().map(c=>countryChip(c.id, c.short || c.name.slice(0,3).toUpperCase())).join('')}</div>
      <div class="album-actions">
        <button class="btn btn-primary" onclick="setView('manual',{manualDefault:'${defaultAdd}'})">${icons.plus} Agregar ${state.albumFilter==='missing'?'faltante':state.albumFilter==='repeated'?'repetida':state.albumFilter==='have'?'tengo':'manual'}</button>
        <button class="btn btn-ghost" onclick="state.selected = new Set(); render()">Limpiar selección</button>
        <button class="btn btn-line" onclick="state.search=''; state.countrySearch=''; state.countryFilter='all'; render()">Limpiar búsqueda</button>
      </div>
    </section>
    ${state.selected.size ? bulkBar() : ''}
    <section class="cards">
      ${list.length ? list.map(stickerCard).join('') : `<div class="empty" style="grid-column:1/-1">No hay figuritas en esta sección.<br><br><button class="btn btn-primary" onclick="setView('manual',{manualDefault:'${defaultAdd}'})">Agregar ahora</button></div>`}
    </section>
  </main>`;
}
function filterChip(key,label){ return `<button class="chip ${state.albumFilter===key?'active':''}" onclick="state.albumFilter='${key}'; state.search=''; state.selected=new Set(); render()">${label}</button>`; }
function countryChip(key,label){ const meta = key==='all' ? null : countryById(key); return `<button class="chip country ${state.countryFilter===key?'active':''}" onclick="state.countryFilter='${key}'; state.selected=new Set(); render()">${key==='all'?'':meta.flag+' '}${key==='all'?label:(meta.short || label)}</button>`; }
function bulkBar(){
  return `<section class="bulkbar"><strong>${state.selected.size} seleccionadas</strong><div class="row"><button class="btn btn-green" onclick="bulkStatus('have')">Tengo</button><button class="btn btn-danger" onclick="bulkStatus('missing')">Me falta</button></div><div class="row"><button class="btn btn-orange" onclick="bulkStatus('repeated')">Repetida</button><button class="btn btn-danger" onclick="bulkDelete()">Eliminar</button></div></section>`;
}
function stickerCard(s){
  const selected = state.selected.has(s.id);
  return `<article class="sticker-card ${s.status} ${s.status==='repeated'?'shiny':''}" onclick="openStickerViewer('${s.id}')">
    <button class="select-box ${selected?'on':''}" onclick="event.stopPropagation(); toggleSelect('${s.id}')">${selected ? icons.check : ''}</button>
    <div style="padding-left:26px">
      <div class="sticker-top"><div class="number">#${s.number}</div><span class="status-badge ${s.status}">${statusIcon(s.status)} ${STATUS[s.status].label}${s.status==='repeated'?` x${s.repeatedCount||1}`:''}</span></div>
      ${s.image ? `<div class="sticker-photo"><img src="${s.image}" alt="Figurita ${escapeHtml(s.number)}" loading="lazy"></div>` : `<div class="sticker-photo sticker-photo-empty"><div>${icons.trophy}</div><strong>Sin foto</strong></div>`}
      <div class="country-line"><span>${countryById(stickerCountry(s)).flag}</span> ${escapeHtml(s.countryName || countryLabel(stickerCountry(s)))}</div>
      <div class="player">${escapeHtml(s.player || 'Sin jugador')}</div>
      <div class="card-actions">
        <button class="icon-btn" title="Editar" onclick="event.stopPropagation(); setView('manual',{editingId:'${s.id}'})">${icons.edit}</button>
        <button class="icon-btn" title="WhatsApp" onclick="event.stopPropagation(); shareSingle('${s.id}')">${icons.whatsapp}</button>
        <button class="icon-btn danger" title="Eliminar" onclick="event.stopPropagation(); deleteSticker('${s.id}')">${icons.trash}</button>
        <button class="icon-btn" title="Cambiar estado" onclick="event.stopPropagation(); quickCycle('${s.id}')">${icons.repeat}</button>
      </div>
    </div>
  </article>`;
}
function quickCycle(id){
  const s = state.stickers.find(x=>x.id===id); if(!s) return;
  s.status = s.status==='have'?'repeated':s.status==='repeated'?'missing':'have';
  s.repeatedCount = s.status==='repeated' ? Math.max(1,Number(s.repeatedCount)||1) : 0;
  s.updatedAt = now(); saveStickers(); toast(`La N° ${s.number} ahora está como ${STATUS[s.status].label}.`); render();
}

function scannerScreen(){
  return `<main class="screen scanner-screen">
    ${topbar(`<button class="pill" onclick="setView('home')">Inicio</button>`)}
    <section class="hero scanner-hero"><div class="logo">${icons.scan}</div><h1>Foto de figurita</h1><p>Encadrá la figurita completa, sacá una foto prolija y guardala con imagen en tu álbum.</p></section>
    ${entryModeSwitch('scanner')}
    <section class="section scan-section scan-section-full">
      <div class="scanner-wrap scanner-wrap-xl" onclick="handleScannerFrameTap(event)">
        <video id="video" class="video video-xl" autoplay playsinline muted></video>
        <div class="scan-overlay"><div class="scan-text">Centrar la figurita completa en el marco</div><div class="scan-frame scan-frame-xl"><span>Tocá el recuadro para activar cámara o sacar foto</span></div></div>
        <div class="auto-scan-badge ${state.scanBusy?'working':''}">${state.scanBusy ? 'Mejorando imagen...' : 'Cámara lista'}</div>
        ${state.cameraError ? cameraFallback() : ''}
      </div>
      <div class="scan-controls scan-controls-grid">
        <button class="btn btn-primary full" onclick="scanFrame(true)">${icons.image} Sacar foto y guardar imagen</button>
        <button class="btn btn-ghost full" onclick="setView('manual',{manualDefault:'have'})">Cargar sin foto</button>
      </div>
      <div id="detectedBox">${state.scanCandidate ? detectedBox() : ''}</div>
    </section>
    ${batchQuickSection()}
  </main>`;
}
function handleScannerFrameTap(e){
  if(e) e.stopPropagation();
  const video = document.getElementById('video');
  if(!state.scannerStream || state.cameraError || !video || !video.videoWidth){
    state.cameraError = '';
    startCamera(true);
    return;
  }
  scanFrame(true);
}

function cameraFallback(){
  return `<div class="camera-fallback">
    <div class="camera-fallback-card">
      <strong>La cámara no se activó</strong>
      <span>${escapeHtml(state.cameraError || 'Revisá el permiso de cámara.')}</span>
      <button class="btn btn-primary full" onclick="retryCamera()">Activar cámara</button>
      <button class="btn btn-ghost full" onclick="setView('manual',{manualDefault:'have'})">Cargar manual</button>
    </div>
  </div>`;
}
function retryCamera(){
  state.cameraError = '';
  state.cameraStarting = false;
  startCamera(true);
}

function detectedBox(){
  const c = state.scanCandidate || { number:'', player:'', country:'general', countryName:'General', image:'' };
  return `<div class="detected scan-success scan-card-save lux-save-panel"><div class="particles"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="figu-capture-title"><strong>Foto lista</strong><span>Completá los datos y elegí el estado</span></div>
    ${c.image ? `<div class="figu-stage"><div class="figu-world-bg"></div><img class="scan-preview" src="${c.image}" alt="Vista de figurita"><button class="remove-photo-btn" onclick="removeScanPhoto(event)" type="button">${icons.trash} Eliminar foto</button></div>` : `<div class="figu-stage empty-photo"><div class="figu-world-bg"></div><button class="btn btn-gold full" onclick="state.scanCandidate=null; render(); setTimeout(startCamera,50)" type="button">Sacar foto</button></div>`}
    <section class="scan-data-panel">
      <div class="scan-data-head"><span>${icons.edit}</span><div><strong>Datos de la figurita</strong><small>Estos son los campos que se cargan en el álbum</small></div></div>
      <div class="field number-field"><label>Número de figurita</label><div class="number-control"><button type="button" onclick="stepDetectedNumber(-1)">−</button><input class="input" id="detectedNum" inputmode="numeric" value="${escapeHtml(c.number)}" placeholder="Ej: 24"><button type="button" onclick="stepDetectedNumber(1)">+</button></div></div>
      <div class="field"><label>Nombre del jugador</label><input class="input" id="detectedPlayer" value="${escapeHtml(c.player || '')}" placeholder="Ej: Messi"></div>
      <div class="field"><label>País / selección</label><input class="input" id="detectedCountry" list="countryListScan" value="${escapeHtml(c.countryName || countryLabel(c.country || 'general'))}" placeholder="Ej: Portugal"><datalist id="countryListScan">${countryOptions(c.country || 'general')}</datalist></div>
    </section>
    <div class="state-grid luxury-state-grid" style="margin-top:12px">
      <button class="state-option have" onclick="saveDetected('have')">${icons.check} La tengo</button>
      <button class="state-option repeated" onclick="saveDetected('repeated')">${icons.repeat} Repetida</button>
      <button class="state-option missing" onclick="saveDetected('missing')">${icons.x} Me falta</button>
    </div>
    <button class="btn btn-primary full" style="margin-top:12px" onclick="state.scanCandidate=null; state.detectedNumber=''; state.autoScanPaused=false; render(); setTimeout(startCamera,50)">Sacar otra foto</button>
  </div>`;
}
function removeScanPhoto(e){
  if(e) e.stopPropagation();
  if(state.scanCandidate) state.scanCandidate.image = '';
  toast('Foto eliminada. Podés sacar otra o guardar sin imagen.', 'warn');
  render();
}
function stepDetectedNumber(delta){
  const input = document.getElementById('detectedNum');
  if(!input) return;
  const current = Number(normalizeNumber(input.value) || 0);
  const next = Math.max(1, current + delta);
  input.value = String(next);
}
function saveDetected(status){
  const c = state.scanCandidate || {};
  const num = normalizeNumber(document.getElementById('detectedNum')?.value || c.number || '');
  const player = document.getElementById('detectedPlayer')?.value || c.player || '';
  const countryRaw = document.getElementById('detectedCountry')?.value || c.countryName || 'General';
  const parsed = countryFromInput(countryRaw);
  addOrUpdateSticker({number:num,status,repeatedCount:1,player,country:parsed.country,countryName:parsed.countryName,image:c.image || ''});
  state.countryFilter='all'; state.search=''; state.detectedNumber=''; state.scanCandidate=null; state.autoScanPaused=false; state.view='scanner'; render(); setTimeout(startCamera,80);
}
function batchQuickSection(){
  const active = state.batchStatus || 'have';
  return `<section class="section batch-quick">
    <div class="section-title"><h2>Cargar varias rápido</h2><span class="muted">sin volver atrás</span></div>
    <p class="muted">Escribí varios números separados por coma, espacio o salto de línea.</p>
    <textarea id="batchNumbers" class="batch-input" inputmode="numeric" placeholder="Ej: 4, 9, 15, 22"></textarea>
    <div class="batch-status-grid">
      ${batchStatusButton('have', active)}
      ${batchStatusButton('missing', active)}
      ${batchStatusButton('repeated', active)}
    </div>
    <button class="btn btn-primary full" onclick="saveBatchQuick()">Guardar varias</button>
  </section>`;
}
function batchStatusButton(status, active){
  return `<button class="batch-status ${status} ${active===status?'active':''}" onclick="state.batchStatus='${status}'; render()">${statusIcon(status)} <span>${STATUS[status].label}</span></button>`;
}
function saveBatchQuick(){
  const input = document.getElementById('batchNumbers');
  const raw = input ? input.value : '';
  const nums = Array.from(new Set(String(raw).split(/[^0-9]+/).map(normalizeNumber).filter(Boolean)));
  if(!nums.length){ toast('Escribí al menos un número.', 'warn'); return; }
  const status = state.batchStatus || 'have';
  nums.forEach(n => addOrUpdateSticker({ number:n, status, repeatedCount:1, country:'general', countryName:'General' }));
  state.countryFilter='all'; state.search=''; state.countrySearch='';
  haptic('success');
  toast(`Guardé ${nums.length} figuritas como ${STATUS[status].label}.`, 'success');
  state.view='album'; state.albumFilter=status; render();
}

async function startCamera(manual=false){
  if(state.view !== 'scanner') return;
  let video = document.getElementById('video');
  if(!video) return;

  // Si ya hay stream, puede haberse perdido al re-renderizar. Re-adjuntar siempre.
  if(state.scannerStream && !manual){
    attachCameraStream();
    return;
  }
  if(state.cameraStarting) return;

  state.cameraStarting = true;
  state.cameraError = '';

  try{
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      throw new Error('Este navegador no permite usar cámara desde esta pantalla.');
    }

    if(state.scannerStream){
      state.scannerStream.getTracks().forEach(t=>t.stop());
      state.scannerStream = null;
    }

    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.scannerStream = stream;
    state.cameraStarting = false;
    state.cameraError = '';

    // Muy importante: después del permiso puede haber habido un render.
    attachCameraStream();
  }catch(e){
    state.cameraStarting = false;
    state.cameraError = 'Permiso de cámara bloqueado o no disponible. Tocá “Activar cámara” o cargá manual.';
    const videoNow = document.getElementById('video');
    if(videoNow) videoNow.srcObject = null;
    render();
  }
}
function attachCameraStream(){
  if(state.view !== 'scanner' || !state.scannerStream) return;
  const video = document.getElementById('video');
  if(!video) return;
  if(video.srcObject !== state.scannerStream) video.srcObject = state.scannerStream;
  video.setAttribute('playsinline', 'true');
  video.setAttribute('autoplay', 'true');
  video.muted = true;
  const playPromise = video.play();
  if(playPromise && typeof playPromise.catch === 'function') playPromise.catch(()=>{});
}
function stopCamera(){
  stopAutoScan();
  if(state.scannerStream){ state.scannerStream.getTracks().forEach(t=>t.stop()); state.scannerStream=null; }
  state.cameraStarting = false;
}
function startAutoScan(){
  // Desactivado: las figuritas no se comportan como QR. Ahora sacamos foto a demanda.
  stopAutoScan();
}
function stopAutoScan(){
  if(state.autoScanTimer){ clearInterval(state.autoScanTimer); state.autoScanTimer=null; }
}
async function scanFrame(manualTap=false){
  if(state.scanBusy) return;
  const video = document.getElementById('video');
  if(!video || !video.videoWidth){
    startCamera(true);
    toast('Activando cámara. Tocá el recuadro de nuevo en unos segundos.', 'warn');
    return;
  }
  state.scanBusy = true;
  toast('Sacando foto y mejorando imagen...', 'warn');
  try{
    const image = captureStickerImage(video);
    state.autoScanPaused = true;
    state.scanCandidate = {
      number: '',
      player: '',
      country: 'general',
      countryName: 'General',
      image,
      rawText: ''
    };
    toast('Foto lista con fondo corregido. Completá los datos y guardá.', 'success');
    haptic('success');
  }catch(e){
    toast('No pude sacar la foto. Probá de nuevo o cargá manual.', 'warn');
  }
  state.scanBusy = false;
  render();
  setTimeout(startCamera,50);
}

function getCenteredStickerCrop(canvas){
  const ratio = 3 / 4;
  const w = canvas.width;
  const h = canvas.height;

  // Recorte fuerte y centrado: quita mesa/pared y prioriza la figurita.
  let cropW = Math.floor(w * 0.58);
  let cropH = Math.floor(cropW / ratio);

  if(cropH > h * 0.84){
    cropH = Math.floor(h * 0.84);
    cropW = Math.floor(cropH * ratio);
  }

  const x = Math.max(0, Math.floor((w - cropW) / 2));
  const y = Math.max(0, Math.floor((h - cropH) / 2));
  return { x, y, w: cropW, h: cropH };
}

function captureStickerImage(video){
  const vw=video.videoWidth, vh=video.videoHeight;

  // Recorte vertical parecido a una figurita. El objetivo es eliminar lo más posible mesa/pared.
  const targetRatio = 3 / 4;
  let ch = Math.floor(vh * .82);
  let cw = Math.floor(ch * targetRatio);
  if(cw > vw * .82){ cw = Math.floor(vw * .82); ch = Math.floor(cw / targetRatio); }
  const sx = Math.max(0, Math.floor((vw-cw)/2));
  const sy = Math.max(0, Math.floor((vh-ch)/2));

  const tmp=document.createElement('canvas');
  tmp.width=960;
  tmp.height=Math.round(960 * ch / cw);
  const tctx=tmp.getContext('2d', { willReadFrequently:true });
  tctx.filter='contrast(1.20) brightness(1.07) saturate(1.16)';
  tctx.drawImage(video,sx,sy,cw,ch,0,0,tmp.width,tmp.height);

  let box = detectStickerBounds(tmp);
  if(!box) box = { x:0, y:0, w:tmp.width, h:tmp.height };

  // En esta versión NO usamos el fondo del lugar como parte principal.
  // Usamos un recorte centrado fuerte: la cámara debe estar centrada en el marco.
  const centeredBox = getCenteredStickerCrop(tmp);
  box = centeredBox;

  // Imagen final: placa coleccionable. El fondo mundialista queda visible detrás de la foto.
  const c=document.createElement('canvas');
  c.width=760;
  c.height=1040;
  const ctx=c.getContext('2d');
  drawWorldCupBackground(ctx,c.width,c.height);

  // Marco exterior dorado tipo figurita especial.
  const cardX=52, cardY=50, cardW=c.width-104, cardH=c.height-100;
  roundRect(ctx,cardX,cardY,cardW,cardH,48);
  const cardGrad = ctx.createLinearGradient(cardX,cardY,cardX+cardW,cardY+cardH);
  cardGrad.addColorStop(0,'rgba(255,241,168,.24)');
  cardGrad.addColorStop(.45,'rgba(255,255,255,.055)');
  cardGrad.addColorStop(1,'rgba(122,18,48,.22)');
  ctx.fillStyle=cardGrad;
  ctx.fill();
  ctx.strokeStyle='rgba(255,224,138,.95)';
  ctx.lineWidth=6;
  ctx.stroke();

  // Copita/estadio de fondo, visible por arriba y por abajo.
  ctx.save();
  ctx.globalAlpha=.20;
  ctx.strokeStyle='#FFF1A8';
  ctx.lineWidth=8;
  roundRect(ctx, cardX+cardW*.38, cardY+22, cardW*.24, 78, 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(c.width/2, cardY+104); ctx.lineTo(c.width/2, cardY+152); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(c.width/2-56, cardY+168); ctx.lineTo(c.width/2+56, cardY+168); ctx.stroke();
  ctx.restore();

  // Zona foto: más chica para que el fondo mundialista sí se note.
  const photoX=102, photoY=164, photoW=c.width-204, photoH=690;
  roundRect(ctx,photoX-10,photoY-10,photoW+20,photoH+20,38);
  ctx.fillStyle='rgba(5,7,13,.50)';
  ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.18)';
  ctx.lineWidth=2;
  ctx.stroke();

  const innerX=photoX, innerY=photoY, innerW=photoW, innerH=photoH;
  const srcRatio = box.w / box.h;
  const dstRatio = innerW / innerH;
  let dw=innerW, dh=innerH;
  if(srcRatio > dstRatio){ dh = innerW / srcRatio; } else { dw = innerH * srcRatio; }
  const dx = innerX + (innerW-dw)/2;
  const dy = innerY + (innerH-dh)/2;

  // Fondo contrastado detrás de la figurita: desenfocado + oscuro para no dejar el lugar crudo.
  ctx.save();
  roundRect(ctx,photoX,photoY,photoW,photoH,30);
  ctx.clip();

  const bgGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  bgGrad.addColorStop(0, 'rgba(8,13,28,1)');
  bgGrad.addColorStop(.55, 'rgba(17,38,84,1)');
  bgGrad.addColorStop(1, 'rgba(86,19,37,1)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Usa la foto original muy agrandada y desenfocada solo como textura de fondo.
  ctx.save();
  ctx.globalAlpha = .10;
  ctx.filter = 'blur(26px) brightness(.32) saturate(.75)';
  ctx.drawImage(tmp, box.x, box.y, box.w, box.h, photoX - 50, photoY - 50, photoW + 100, photoH + 100);
  ctx.restore();

  // Brillos/spotlights para contraste visual.
  const spot1 = ctx.createRadialGradient(photoX + photoW*.22, photoY + photoH*.18, 10, photoX + photoW*.22, photoY + photoH*.18, photoW*.46);
  spot1.addColorStop(0, 'rgba(255,224,138,.22)');
  spot1.addColorStop(1, 'rgba(255,224,138,0)');
  ctx.fillStyle = spot1;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  const spot2 = ctx.createRadialGradient(photoX + photoW*.84, photoY + photoH*.80, 10, photoX + photoW*.84, photoY + photoH*.80, photoW*.44);
  spot2.addColorStop(0, 'rgba(47,116,255,.18)');
  spot2.addColorStop(1, 'rgba(47,116,255,0)');
  ctx.fillStyle = spot2;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Toma una versión más cerrada de la figurita para dejar menos fondo alrededor.
  const focusScale = .84;
  const focusW = box.w * focusScale;
  const focusH = box.h * focusScale;
  const focusX = box.x + (box.w - focusW)/2;
  const focusY = box.y + (box.h - focusH)/2;
  const stickerMaxW = photoW * .78;
  const stickerMaxH = photoH * .82;
  const focusRatio = focusW / focusH;
  let stickerW = stickerMaxW, stickerH = stickerMaxH;
  if(focusRatio > stickerW / stickerH){
    stickerH = stickerW / focusRatio;
  } else {
    stickerW = stickerH * focusRatio;
  }
  const stickerX = photoX + (photoW - stickerW)/2;
  const stickerY = photoY + (photoH - stickerH)/2 - 10;

  // Halo detrás de la figurita.
  const halo = ctx.createRadialGradient(stickerX + stickerW/2, stickerY + stickerH/2, 20, stickerX + stickerW/2, stickerY + stickerH/2, Math.max(stickerW, stickerH)*.62);
  halo.addColorStop(0, 'rgba(255,255,255,.16)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Sombra de la figurita.
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.55)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  roundRect(ctx, stickerX, stickerY, stickerW, stickerH, 20);
  ctx.fill();
  ctx.restore();

  // Figurita principal sobre fondo contrastado.
  ctx.save();
  roundRect(ctx, stickerX, stickerY, stickerW, stickerH, 20);
  ctx.clip();
  ctx.filter='contrast(1.24) brightness(1.08) saturate(1.20)';
  ctx.drawImage(tmp, focusX, focusY, focusW, focusH, stickerX, stickerY, stickerW, stickerH);
  ctx.restore();

  // Borde de la figurita.
  roundRect(ctx, stickerX, stickerY, stickerW, stickerH, 20);
  ctx.strokeStyle='rgba(255,255,255,.26)';
  ctx.lineWidth=2;
  ctx.stroke();

  ctx.restore();

  // Borde de la zona foto.
  roundRect(ctx,photoX,photoY,photoW,photoH,30);
  ctx.strokeStyle='rgba(255,224,138,.55)';
  ctx.lineWidth=3;
  ctx.stroke();

  // Banda inferior FiguScan. Esto hace que no parezca una foto cruda del lugar.
  const bandY = 884;
  roundRect(ctx,92,bandY,576,92,28);
  ctx.fillStyle='rgba(5,7,13,.72)';
  ctx.fill();
  ctx.strokeStyle='rgba(255,224,138,.36)';
  ctx.lineWidth=2;
  ctx.stroke();
  ctx.fillStyle='#FFE08A';
  ctx.font='900 30px Inter, Arial';
  ctx.fillText('FiguScan Mundial',124,bandY+42);
  ctx.fillStyle='rgba(226,232,240,.92)';
  ctx.font='800 18px Inter, Arial';
  ctx.fillText('Figurita destacada en tu álbum',124,bandY+70);

  // Brillo diagonal suave.
  const shine=ctx.createLinearGradient(0,0,c.width,c.height);
  shine.addColorStop(0,'rgba(255,255,255,.28)');
  shine.addColorStop(.18,'rgba(255,255,255,0)');
  shine.addColorStop(.58,'rgba(255,255,255,.12)');
  shine.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=shine;
  roundRect(ctx,cardX+8,cardY+8,cardW-16,cardH-16,42);
  ctx.fill();

  return c.toDataURL('image/jpeg', .92);
}

function detectStickerBounds(canvas){
  const ctx=canvas.getContext('2d', { willReadFrequently:true });
  const w=canvas.width, h=canvas.height;
  const data=ctx.getImageData(0,0,w,h).data;
  let minX=w, minY=h, maxX=0, maxY=0, count=0;
  const step=3;
  for(let y=0;y<h;y+=step){
    for(let x=0;x<w;x+=step){
      const i=(y*w+x)*4;
      const r=data[i], g=data[i+1], b=data[i+2];
      const luma=.299*r+.587*g+.114*b;
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      const sat=max-min;
      if(luma < 82 || (sat > 70 && luma < 190)){
        minX=Math.min(minX,x); maxX=Math.max(maxX,x);
        minY=Math.min(minY,y); maxY=Math.max(maxY,y);
        count++;
      }
    }
  }
  const bw=maxX-minX, bh=maxY-minY;
  if(count < 80 || bw < w*.26 || bh < h*.30) return null;
  return {x:minX,y:minY,w:bw,h:bh};
}

function drawWorldCupBackground(ctx,w,h){
  const g=ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'#05070d');
  g.addColorStop(.34,'#101b35');
  g.addColorStop(.68,'#401021');
  g.addColorStop(1,'#080b14');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,w,h);

  ctx.save();
  ctx.globalAlpha=.22;
  ctx.strokeStyle='#D4AF37';
  ctx.lineWidth=18;
  ctx.beginPath(); ctx.arc(w*.83,h*.16,185,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.arc(w*.16,h*.84,145,0,Math.PI*2); ctx.stroke();
  ctx.globalAlpha=.13;
  ctx.lineWidth=6;
  for(let y=90;y<h;y+=78){ ctx.beginPath(); ctx.moveTo(-60,y); ctx.lineTo(w+80,y-48); ctx.stroke(); }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha=.16;
  ctx.strokeStyle='#FFF1A8';
  ctx.lineWidth=10;
  ctx.lineCap='round';
  roundRect(ctx,w*.38,h*.08,w*.24,h*.13,22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.50,h*.21); ctx.lineTo(w*.50,h*.30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w*.42,h*.32); ctx.lineTo(w*.58,h*.32); ctx.stroke();
  ctx.restore();
}

function roundRect(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
}
function cropVideoCenter(video){
  const vw=video.videoWidth, vh=video.videoHeight;
  const cw = Math.floor(vw*.82), ch = Math.floor(vh*.62);
  const sx = Math.floor((vw-cw)/2), sy = Math.floor((vh-ch)/2);
  const c=document.createElement('canvas'); c.width=1100; c.height=Math.round(1100*ch/cw);
  const ctx=c.getContext('2d');
  ctx.filter='contrast(1.75) brightness(1.12) grayscale(1)';
  ctx.drawImage(video,sx,sy,cw,ch,0,0,c.width,c.height);
  return c.toDataURL('image/png');
}
function analyzeStickerText(text){
  const clean = String(text||'').replace(/[|_~]/g,' ').replace(/\s+/g,' ').trim();
  const number = pickNumber(clean);
  const country = pickCountry(clean);
  const player = pickPlayer(text, country.countryName);
  return { number, player, ...country };
}
function pickNumber(text){
  const m = String(text||'').match(/\b\d{1,4}\b/g);
  if(!m || !m.length) return '';
  const nums = m.map(Number).filter(n=>n>0 && n<1000);
  if(!nums.length) return '';
  nums.sort((a,b)=>String(a).length-String(b).length || a-b);
  return String(nums[0]);
}
function pickCountry(text){
  const q = normalizeText(text);
  for(const c of COUNTRIES){
    if(c.id==='general') continue;
    if(q.includes(normalizeText(c.name)) || q.includes(normalizeText(c.short))) return { country:c.id, countryName:c.name };
  }
  return { country:'general', countryName:'General' };
}
function pickPlayer(text, countryName=''){
  const bad = new Set(['FIFA','WORLD','CUP','QATAR','RUSSIA','PANINI','STICKER','FIGUSCAN','GENERAL', normalizeText(countryName).toUpperCase()]);
  const lines = String(text||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const candidates = lines.map(line=>line.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]/g,' ').replace(/\s+/g,' ').trim())
    .filter(line=>line.length>=4 && /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(line))
    .filter(line=>!bad.has(line.toUpperCase()))
    .filter(line=>!COUNTRIES.some(c=>normalizeText(line)===normalizeText(c.name) || normalizeText(line)===normalizeText(c.short)));
  candidates.sort((a,b)=>b.length-a.length);
  return candidates[0] || '';
}
function friendsScreen(){
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'repeated'})">Repetidas</button>`)}
    <section class="hero"><div class="logo">${icons.users}</div><h1>Cambios con amigos</h1><p>Por ahora compartí tus listas por WhatsApp. La comparación automática puede sumarse después con usuarios en nube.</p></section>
    <section class="section"><h2>Rápido y simple</h2><p class="muted">Compartí “Solo repetidas” o “Solo me faltan”. Tu amigo te responde con lo que tiene.</p><button class="btn btn-primary full" onclick="setView('share')">${icons.share} Ir a compartir</button></section>
  </main>`;
}

function shareScreen(){
  const msg = buildShareMessage(state.shareMode);
  return `<main class="screen">
    ${topbar(`<button class="pill" onclick="setView('album',{filter:'all'})">Mi álbum</button>`)}
    <section class="hero"><div class="logo">${icons.share}</div><h1>Compartir por WhatsApp</h1><p>Elegí si enviás todo el resumen o solo una parte del álbum.</p></section>
    <section class="section">
      <div class="section-title"><h2>Elegí qué enviar</h2></div>
      <div class="share-options">
        ${shareOption('summary','Resumen completo',icons.list)}
        ${shareOption('have','Solo tengo',icons.check)}
        ${shareOption('missing','Solo me faltan',icons.x)}
        ${shareOption('repeated','Solo repetidas',icons.repeat)}
      </div>
    </section>
    <section class="section">
      <div class="section-title"><h2>Vista previa</h2><span class="muted">mensaje</span></div>
      <div class="preview">${escapeHtml(msg)}</div>
      <div class="share-actions">
        <button class="btn btn-primary full" onclick="openWhatsApp()">${icons.whatsapp} Enviar por WhatsApp</button>
        <button class="btn btn-gold full" onclick="shareImage()">${icons.image} Compartir imagen visual</button>
        <button class="btn btn-ghost full" onclick="copyMessage()">${icons.copy} Copiar mensaje</button>
      </div>
      <p class="tiny">WhatsApp por link solo permite texto. La opción “imagen visual” genera una placa con logo y recuadro; si tu celular lo permite, podés compartirla por WhatsApp desde el menú de compartir.</p>
    </section>
  </main>`;
}
function shareOption(mode,label,icon){ return `<button class="share-card ${state.shareMode===mode?'active':''}" onclick="state.shareMode='${mode}'; render()">${icon}<br>${label}</button>`; }
function stickerText(s){ const c = countryById(stickerCountry(s)); return `${c.flag} *${c.name}* · N° ${s.number}${s.player?` · *${s.player}*`:''}`; }
function listFor(status){
  const arr = state.stickers.filter(s=>s.status===status).sort(byNumber);
  if(status==='repeated') return arr.length ? arr.map(s=>`${stickerText(s)} x${s.repeatedCount||1}`).join('\n') : 'Sin figuritas cargadas';
  return arr.length ? arr.map(s=>stickerText(s)).join('\n') : 'Sin figuritas cargadas';
}

function buildShareMessage(mode){
  const header = `🏆 *FIGUSCAN MUNDIAL*
━━━━━━━━━━━━━━━━━━━━`;
  const footer = `

Checkeá mi álbum acá:
${APP_URL}`;
  if(mode==='have') return `${header}

✅ *TENGO PARA CAMBIAR O MOSTRAR:*
${listFor('have')}

¿Te sirve alguna? Avisame y cambiamos. ⚽${footer}`;
  if(mode==='missing') return `${header}

❌ *ME FALTAN ESTAS PARA COMPLETAR:*
${listFor('missing')}

¿Tenés alguna repetida? Avisame y hacemos cambio. 🏟️${footer}`;
  if(mode==='repeated') return `${header}

🔁 *MIS REPETIDAS PARA CAMBIAR:*
${listFor('repeated')}

¿Necesitás alguna? Vamos que llenamos el álbum. ⚽${footer}`;
  return `${header}

✅ *TENGO:*
${listFor('have')}

❌ *ME FALTAN:*
${listFor('missing')}

🔁 *REPETIDAS:*
${listFor('repeated')}

Organizado con *FiguScan Mundial*.${footer}`;
}

function buildSingleStickerMessage(s){
  const c = countryById(stickerCountry(s));
  const head = `🏆 *FiguScan Mundial*
━━━━━━━━━━━━━━━━━━━━`;
  const figu = `${c.flag} *${c.name}* · N° ${s.number}${s.player?` · *${s.player}*`:''}`;
  const footer = `

Mi álbum está en FiguScan:
${APP_URL}`;
  if(s.status==='missing') return `${head}
¡Che! Me falta esta para el álbum:
${figu}

¿La tenés repetida? Avisame y cambiamos. ⚽${footer}`;
  if(s.status==='repeated') return `${head}
Tengo repetida esta figurita:
${figu} x${s.repeatedCount||1}

¿La necesitás? Hagamos cambio. 🏆${footer}`;
  return `${head}
Tengo esta figurita:
${figu}

¿Te sirve para cambiar? ⚽${footer}`;
}

function openWhatsApp(){ window.open(`https://wa.me/?text=${encodeURIComponent(buildShareMessage(state.shareMode))}`,'_blank'); }
function shareSingle(id){
  const s = state.stickers.find(x=>x.id===id); if(!s) return;
  window.open(`https://wa.me/?text=${encodeURIComponent(buildSingleStickerMessage(s))}`,'_blank');
}
async function copyMessage(){
  await navigator.clipboard?.writeText(buildShareMessage(state.shareMode));
  toast('Mensaje copiado.');
}
async function shareImage(){
  const blob = await makeShareImage(state.shareMode);
  const file = new File([blob], 'figuscan-resumen.png', {type:'image/png'});
  const text = buildShareMessage(state.shareMode);
  try{
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({title:'FiguScan Mundial', text:'Mi álbum FiguScan', files:[file]});
      return;
    }
  }catch(e){}
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='figuscan-resumen.png'; a.click();
  toast('Descargué la imagen. Si no abre WhatsApp, enviá la imagen desde tu galería.', 'warn');
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}
function makeShareImage(mode){
  return new Promise(resolve=>{
    const c=document.createElement('canvas'); c.width=1080; c.height=1350;
    const ctx=c.getContext('2d');
    const grad=ctx.createLinearGradient(0,0,1080,1350); grad.addColorStop(0,'#061947'); grad.addColorStop(.55,'#0B2E78'); grad.addColorStop(1,'#18A957'); ctx.fillStyle=grad; ctx.fillRect(0,0,1080,1350);
    ctx.globalAlpha=.18; ctx.fillStyle='#FFD96A'; ctx.beginPath(); ctx.arc(880,180,260,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(160,1160,230,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    rounded(ctx,70,70,940,1210,48,'rgba(255,255,255,.94)');
    rounded(ctx,110,110,120,120,32,'#FFD96A');
    ctx.strokeStyle='#061947'; ctx.lineWidth=12; ctx.strokeRect(142,144,56,52); ctx.beginPath(); ctx.moveTo(170,196);ctx.lineTo(170,220);ctx.stroke();ctx.beginPath();ctx.moveTo(135,232);ctx.lineTo(205,232);ctx.stroke();
    ctx.fillStyle='#061947'; ctx.font='900 64px Arial'; ctx.fillText('FiguScan Mundial',260,160); ctx.font='700 34px Arial'; ctx.fillStyle='#526071'; ctx.fillText('Resumen para intercambiar figuritas',260,210);
    ctx.fillStyle='#061947'; ctx.font='900 48px Arial'; let y=310;
    const title = mode==='have'?'Tengo':mode==='missing'?'Me faltan':mode==='repeated'?'Repetidas':'Mi álbum'; ctx.fillText(title,110,y); y+=60;
    const lines = buildShareMessage(mode).replace(/╔.*?╝/s,'').trim().split('\n');
    ctx.font='700 34px Arial'; ctx.fillStyle='#1E293B';
    lines.slice(0,24).forEach(line=>{ if(!line.trim()){ y+=20; return; } ctx.fillText(line.slice(0,42),110,y); y+=46; });
    ctx.fillStyle='#0B2E78'; ctx.font='800 30px Arial'; ctx.fillText('Organizado con FiguScan Mundial',110,1240);
    c.toBlob(resolve,'image/png',.95);
  });
}
function rounded(ctx,x,y,w,h,r,fill){ ctx.fillStyle=fill; ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); ctx.fill(); }

function bottomNav(){
  const item = (view,label,icon,extra='') => `<button class="nav-item ${extra} ${state.view===view?'active':''}" onclick="setView('${view}')">${icon}<span>${label}</span></button>`;
  return `<nav class="bottom-nav">
    ${item('home','Inicio',icons.home)}
    ${item('scanner','Escanear',icons.scan,'scan')}
    ${item('album','Álbum',icons.album)}
    ${item('friends','Amigos',icons.users)}
    ${item('share','Compartir',icons.share)}
  </nav>`;
}
function openStickerViewer(id){
  state.viewerId = id;
  render();
}
function closeStickerViewer(){
  state.viewerId = null;
  render();
}
function currentViewerList(){
  const list = filteredStickers();
  if(list.some(s=>s.id===state.viewerId)) return list;
  return state.stickers.slice().sort(byNumber);
}
function moveViewer(dir){
  const list = currentViewerList();
  if(!list.length) return;
  let idx = list.findIndex(s=>s.id===state.viewerId);
  if(idx < 0) idx = 0;
  idx = (idx + dir + list.length) % list.length;
  state.viewerId = list[idx].id;
  render();
}
function stickerViewerHtml(){
  if(!state.viewerId) return '';
  const list = currentViewerList();
  const s = list.find(x=>x.id===state.viewerId) || state.stickers.find(x=>x.id===state.viewerId);
  if(!s) return '';
  const idx = Math.max(0, list.findIndex(x=>x.id===s.id));
  const total = Math.max(1, list.length);
  return `<div class="viewer-back" onclick="closeStickerViewer()">
    <div class="viewer-card" onclick="event.stopPropagation()">
      <div class="viewer-top">
        <button class="viewer-close" onclick="closeStickerViewer()">×</button>
        <div><strong>Figurita #${escapeHtml(s.number)}</strong><small>${idx+1} de ${total} en esta sección</small></div>
      </div>
      <div class="viewer-image-wrap ${s.status}">
        ${s.image ? `<img src="${s.image}" alt="Figurita ${escapeHtml(s.number)}">` : `<div class="viewer-placeholder">${icons.trophy}<strong>Sin foto</strong></div>`}
        <button class="viewer-arrow left" onclick="moveViewer(-1)">${icons.chevron}</button>
        <button class="viewer-arrow right" onclick="moveViewer(1)">${icons.chevron}</button>
      </div>
      <div class="viewer-info">
        <span class="status-badge ${s.status}">${statusIcon(s.status)} ${STATUS[s.status].label}${s.status==='repeated'?` x${s.repeatedCount||1}`:''}</span>
        <h3>${escapeHtml(s.player || 'Sin jugador')}</h3>
        <p>${countryById(stickerCountry(s)).flag} ${escapeHtml(s.countryName || countryLabel(stickerCountry(s)))}</p>
      </div>
      <div class="viewer-actions">
        <button class="btn btn-primary" onclick="setView('manual',{editingId:'${s.id}'}); closeStickerViewer()">${icons.edit} Editar</button>
        <button class="btn btn-ghost" onclick="shareSingle('${s.id}')">${icons.whatsapp} WhatsApp</button>
        <button class="btn btn-danger" onclick="deleteSticker('${s.id}'); closeStickerViewer()">${icons.trash} Eliminar</button>
      </div>
    </div>
  </div>`;
}

function modalHtml(){
  if(!state.modal) return '';
  const m = state.modal;
  return `<div class="modal-back"><div class="modal"><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.text)}</p><div class="modal-actions"><button class="btn btn-line" onclick="state.modal=null; render()">${escapeHtml(m.cancel||'Cancelar')}</button><button class="btn ${m.danger?'btn-danger':'btn-primary'}" onclick="confirmModal()">${escapeHtml(m.confirm||'Confirmar')}</button></div></div></div>`;
}
function confirmModal(){ const fn = state.modal?.onConfirm; if(fn) fn(); }
function toastHtml(){ return state.toast ? `<div class="toast ${state.toast.type==='warn'?'warn':'success'}">${state.toast.type==='warn'?icons.repeat:icons.check}<span>${escapeHtml(state.toast.message)}</span></div>` : ''; }
function escapeHtml(str){ return String(str||'').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

function render(){
  let screen = '';
  if(state.view==='home') screen = homeScreen();
  if(state.view==='manual') screen = manualScreen();
  if(state.view==='album') screen = albumScreen();
  if(state.view==='scanner') screen = scannerScreen();
  if(state.view==='friends') screen = friendsScreen();
  if(state.view==='share') screen = shareScreen();
  app.innerHTML = `<div class="app">${appTrophyBg()}${screen}${bottomNav()}${stickerViewerHtml()}${modalHtml()}${toastHtml()}</div>`;
  if(state.view==='scanner') {
    setTimeout(()=>{
      centerScannerFrame();
      if(state.scannerStream) attachCameraStream();
      else if(!state.cameraError) startCamera(false);
    }, 80);
    setTimeout(centerScannerFrame, 420);
  }
}

window.handleScannerFrameTap=handleScannerFrameTap; window.attachCameraStream=attachCameraStream; window.openStickerViewer=openStickerViewer; window.closeStickerViewer=closeStickerViewer; window.moveViewer=moveViewer; window.removeScanPhoto=removeScanPhoto; window.stepDetectedNumber=stepDetectedNumber; window.selectCountry=selectCountry; window.haptic=haptic; window.setView=setView; window.chooseManualStatus=chooseManualStatus; window.changeQty=changeQty; window.submitManual=submitManual; window.toggleSelect=toggleSelect; window.bulkStatus=bulkStatus; window.bulkDelete=bulkDelete; window.deleteSticker=deleteSticker; window.quickCycle=quickCycle; window.shareSingle=shareSingle; window.openWhatsApp=openWhatsApp; window.copyMessage=copyMessage; window.shareImage=shareImage; window.scanFrame=scanFrame; window.saveDetected=saveDetected; window.saveBatchQuick=saveBatchQuick; window.startCamera=startCamera; window.retryCamera=retryCamera; window.confirmModal=confirmModal; window.state=state; window.render=render;

if('serviceWorker' in navigator){ navigator.serviceWorker.register('/service-worker.js').catch(()=>{}); }
render();
