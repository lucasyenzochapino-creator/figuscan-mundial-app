/* FiguScan Mundial V11 - álbum accionable, WhatsApp visual y OCR asistido. Local-first PWA. */
(function(){
  const CFG = window.FIGUSCAN_CONFIG || {};
  const STORAGE_KEY = CFG.STORAGE_KEY || 'figuscan_v10_stickers';
  const USER_KEY = CFG.USER_KEY || 'figuscan_v10_user';
  const $app = document.getElementById('app');

  const state = {
    screen: 'home',
    filter: 'all',
    search: '',
    shareMode: 'summary',
    stickers: loadStickers(),
    selected: new Set(),
    pending: null,
    cameraStream: null,
    toast: '',
    modal: null,
    user: loadUser()
  };

  const ICONS = {
    trophy: `<svg viewBox="0 0 24 24" fill="none"><path d="M8 4h8c-.2 4.8-1.2 7.8-4 10-2.8-2.2-3.8-5.2-4-10Z"/><path d="M8 6H5.6C4.2 6 3 7.2 3 8.7c0 2.4 2.4 4.6 5.7 5.1"/><path d="M16 6h2.4c1.4 0 2.6 1.2 2.6 2.7 0 2.4-2.4 4.6-5.7 5.1"/><path d="M10 14h4v4h-4z"/><path d="M7 20h10"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-6h6v6"/></svg>`,
    scan: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 8V5a1 1 0 0 1 1-1h3"/><path d="M16 4h3a1 1 0 0 1 1 1v3"/><path d="M20 16v3a1 1 0 0 1-1 1h-3"/><path d="M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/><path d="M9 9h6v6H9z"/></svg>`,
    album: `<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 0-3-3V4Z"/><path d="M5 17V7a3 3 0 0 1 3-3"/><path d="M9 8h6"/><path d="M9 12h5"/></svg>`,
    cards: `<svg viewBox="0 0 24 24" fill="none"><rect x="7" y="4" width="12" height="16" rx="2"/><rect x="4" y="7" width="12" height="13" rx="2"/><path d="M8 11h4"/><path d="M8 15h5"/></svg>`,
    friends: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M17 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M14.5 18.5A4.5 4.5 0 0 1 22 20"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none"><path d="M18 8a3 3 0 1 0-2.83-4"/><path d="M6 15a3 3 0 1 0 2.83 4"/><path d="M18 16a3 3 0 1 0-2.83 4"/><path d="M8.7 13.6 15.3 17"/><path d="M15.3 7 8.7 10.4"/></svg>`,
    have: `<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5"/></svg>`,
    missing: `<svg viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18"/><path d="M6 6l12 12"/></svg>`,
    repeated: `<svg viewBox="0 0 24 24" fill="none"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 14h10l1-14"/><path d="M9 7V4h6v3"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z"/><path d="M13.5 6.5l4 4"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21a9 9 0 0 0 7.6-13.8A9 9 0 0 0 4.2 16.5L3 21l4.6-1.1A9 9 0 0 0 12 21Z"/><path d="M8.8 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.4l.8 1.8c.1.3.1.5-.1.7l-.4.5c-.2.2-.2.4 0 .7.5.9 1.3 1.7 2.3 2.2.3.2.5.1.7-.1l.6-.7c.2-.2.4-.3.7-.2l1.9.8c.3.1.4.3.4.6 0 .7-.4 1.5-1 1.8-.8.4-2.5.1-4.3-1-2.3-1.5-3.8-3.7-4.2-5.2-.2-.8.1-1.5.3-1.8Z"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5"/></svg>`,
    empty: `<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M9 9h6"/><path d="M9 13h4"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
    ball: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9"/><path d="m12 7 4 3-1.5 5h-5L8 10l4-3Z"/><path d="M12 7V3"/><path d="m16 10 4-1"/><path d="m14.5 15 2.5 4"/><path d="M9.5 15 7 19"/><path d="m8 10-4-1"/></svg>`
  };

  function loadStickers(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function saveStickers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state.stickers)); }
  function loadUser(){
    try { return JSON.parse(localStorage.getItem(USER_KEY) || '{}'); } catch { return {}; }
  }
  function saveUser(){ localStorage.setItem(USER_KEY, JSON.stringify(state.user)); }
  function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
  function normalizeNumber(n){ return String(n || '').replace(/\D/g,'').slice(0,4); }
  function statusLabel(s){ return s === 'have' ? 'Tengo' : s === 'missing' ? 'Me falta' : 'Repetida'; }
  function statusClass(s){ return s === 'have' ? 'have' : s === 'missing' ? 'missing' : 'repeated'; }
  function statusIcon(s){ return s === 'have' ? ICONS.have : s === 'missing' ? ICONS.missing : ICONS.repeated; }
  function toast(msg){ state.toast = msg; render(); setTimeout(()=>{ state.toast=''; render(); }, 2200); }
  function go(screen, opts={}){
    stopCamera();
    state.screen = screen;
    if (opts.filter) state.filter = opts.filter;
    state.selected.clear();
    render();
    setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),0);
  }
  function stats(){
    return {
      have: state.stickers.filter(s=>s.status==='have').length,
      missing: state.stickers.filter(s=>s.status==='missing').length,
      repeated: state.stickers.filter(s=>s.status==='repeated').reduce((a,s)=>a+(Number(s.repeatedCount)||1),0)
    };
  }
  function sortedStickers(){
    let arr = [...state.stickers];
    if (state.filter !== 'all') arr = arr.filter(s=>s.status===state.filter);
    if (state.search.trim()) arr = arr.filter(s=>String(s.number).includes(state.search.trim()) || (s.player||'').toLowerCase().includes(state.search.toLowerCase()));
    return arr.sort((a,b)=>Number(a.number)-Number(b.number));
  }
  function upsertSticker(payload){
    const number = normalizeNumber(payload.number);
    if(!number){ toast('Ingresá el número de la figurita'); return false; }
    const status = payload.status || 'have';
    const repeatedCount = status === 'repeated' ? Math.max(1, Number(payload.repeatedCount || 1)) : 0;
    const existing = state.stickers.find(s=>String(s.number)===String(number));
    const now = new Date().toISOString();
    if(existing){
      Object.assign(existing, { number, status, repeatedCount, player: (payload.player||'').trim(), updatedAt: now });
      toast(`Figurita N° ${number} actualizada`);
    } else {
      state.stickers.push({ id: uid(), number, status, repeatedCount, player:(payload.player||'').trim(), createdAt: now, updatedAt: now });
      toast(`Figurita N° ${number} guardada`);
    }
    saveStickers();
    return true;
  }
  function deleteSticker(id){
    const st = state.stickers.find(s=>s.id===id);
    state.modal = {
      title: `Eliminar figurita N° ${st?.number || ''}`,
      text: 'Esta acción borra la figurita de tu álbum en este celular.',
      confirmText: 'Eliminar', danger: true,
      onConfirm: () => {
        state.stickers = state.stickers.filter(s=>s.id!==id);
        state.selected.delete(id);
        saveStickers();
        state.modal = null;
        toast('Figurita eliminada');
        render();
      }
    };
    render();
  }
  function bulkDelete(){
    if(!state.selected.size) return;
    state.modal = {
      title: `Eliminar ${state.selected.size} figuritas`,
      text: 'Se borrarán las figuritas seleccionadas de tu álbum.',
      confirmText: 'Eliminar', danger: true,
      onConfirm: () => {
        state.stickers = state.stickers.filter(s=>!state.selected.has(s.id));
        state.selected.clear();
        saveStickers();
        state.modal = null;
        toast('Figuritas eliminadas');
        render();
      }
    };
    render();
  }
  function bulkSet(status){
    state.stickers = state.stickers.map(s=> state.selected.has(s.id) ? {...s,status,repeatedCount: status==='repeated' ? Math.max(1,s.repeatedCount||1) : 0, updatedAt:new Date().toISOString()} : s);
    state.selected.clear(); saveStickers(); toast('Estados actualizados'); render();
  }
  function singleMessage(s){
    const player = s.player ? ` (${s.player})` : '';
    if(s.status === 'missing') return `🏆 FiguScan Mundial

Me falta la figurita N° ${s.number}${player}.

¿La tenés para cambiar?`;
    if(s.status === 'repeated') return `🏆 FiguScan Mundial

Tengo repetida la figurita N° ${s.number}${player} x${s.repeatedCount || 1}.

¿La necesitás?`;
    return `🏆 FiguScan Mundial

Tengo la figurita N° ${s.number}${player}.

¿Te sirve?`;
  }
  function getStickerGroups(){
    const byNumber = (a,b)=>Number(a.number)-Number(b.number);
    return {
      have: state.stickers.filter(s=>s.status==='have').sort(byNumber).map(s=>s.number),
      missing: state.stickers.filter(s=>s.status==='missing').sort(byNumber).map(s=>s.number),
      repeated: state.stickers.filter(s=>s.status==='repeated').sort(byNumber).map(s=>`${s.number} x${s.repeatedCount || 1}`)
    };
  }
  function shareMessage(mode='summary'){
    const { have, missing, repeated } = getStickerGroups();
    const header = `🏆 FiguScan Mundial
━━━━━━━━━━━━━━`;
    const footer = `

Organizado con FiguScan Mundial.
Abrí tu álbum, cargá repetidas y compartí cambios.`;
    if(mode === 'have') return `${header}

✅ FIGURITAS QUE TENGO
${have.length ? have.join(', ') : 'Sin figuritas cargadas'}

¿Te sirve alguna?${footer}`;
    if(mode === 'missing') return `${header}

❌ FIGURITAS QUE ME FALTAN
${missing.length ? missing.join(', ') : 'Sin figuritas cargadas'}

¿Tenés alguna para cambiar?${footer}`;
    if(mode === 'repeated') return `${header}

🔁 FIGURITAS REPETIDAS
${repeated.length ? repeated.join('\n') : 'Sin figuritas cargadas'}

¿Necesitás alguna?${footer}`;
    return `${header}

MI ÁLBUM

✅ Tengo:
${have.length ? have.join(', ') : 'Sin figuritas cargadas'}

❌ Me faltan:
${missing.length ? missing.join(', ') : 'Sin figuritas cargadas'}

🔁 Repetidas:
${repeated.length ? repeated.join('\n') : 'Sin figuritas cargadas'}${footer}`;
  }
  function summaryMessage(){ return shareMessage('summary'); }
  function openWhatsApp(text){ window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank'); }
  async function shareVisualCard(mode='summary'){
    const text = shareMessage(mode);
    try{
      const file = await buildShareImage(mode);
      if(navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({ title:'FiguScan Mundial', text, files:[file] });
        return;
      }
      if(navigator.share){ await navigator.share({title:'FiguScan Mundial', text}); return; }
      openWhatsApp(text);
    }catch(err){
      openWhatsApp(text);
    }
  }
  async function buildShareImage(mode='summary'){
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0,0,1080,1350);
    g.addColorStop(0,'#061A40'); g.addColorStop(.52,'#0B2A63'); g.addColorStop(1,'#16A34A');
    ctx.fillStyle = g; ctx.fillRect(0,0,1080,1350);
    ctx.globalAlpha = .18; ctx.fillStyle = '#F4C542'; ctx.beginPath(); ctx.arc(930,170,260,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    ctx.fillStyle = '#F4C542'; roundRect(ctx,70,70,150,150,42); ctx.fill();
    ctx.strokeStyle = '#061A40'; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(122,115); ctx.lineTo(168,115); ctx.lineTo(155,171); ctx.lineTo(135,171); ctx.closePath(); ctx.stroke();
    ctx.font = '900 72px system-ui, sans-serif'; ctx.fillStyle = 'white'; ctx.fillText('FiguScan Mundial',250,130);
    ctx.font = '700 34px system-ui, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.fillText('Álbum de figuritas',250,178);
    ctx.fillStyle = 'rgba(255,255,255,.94)'; roundRect(ctx,70,275,940,920,46); ctx.fill();
    ctx.fillStyle = '#061A40'; ctx.font = '900 52px system-ui, sans-serif';
    const title = mode==='have'?'Figuritas que tengo':mode==='missing'?'Figuritas que me faltan':mode==='repeated'?'Figuritas repetidas':'Resumen completo';
    ctx.fillText(title,120,360);
    ctx.font = '700 34px system-ui, sans-serif'; ctx.fillStyle = '#334155';
    const cleanedText = text.replace('🏆 FiguScan Mundial\n━━━━━━━━━━━━━━\n\n','');
    const lines = cleanedText.split('\n').slice(0,24);
    let y = 430;
    for(const line of lines){
      const pieces = wrapLine(ctx,line,800);
      for(const piece of pieces){ ctx.fillText(piece,120,y); y+=48; if(y>1140) break; }
      if(y>1140) break;
    }
    ctx.font = '800 30px system-ui, sans-serif'; ctx.fillStyle = '#F4C542'; ctx.fillText('Compartido desde FiguScan Mundial',120,1255);
    const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/png',.92));
    return new File([blob], 'figuscan-resumen.png', {type:'image/png'});
  }
  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  }
  function wrapLine(ctx,line,max){
    if(!line) return [''];
    const words = line.split(' '); const out=[]; let cur='';
    for(const w of words){ const test = cur ? cur+' '+w : w; if(ctx.measureText(test).width>max && cur){ out.push(cur); cur=w; } else cur=test; }
    out.push(cur); return out;
  }
  async function copyText(text){
    try{ await navigator.clipboard.writeText(text); toast('Mensaje copiado'); }
    catch{ toast('No pude copiar. Usá WhatsApp.'); }
  }

  function appFrame(content){
    return `<div class="app"><div class="trophy-bg"></div><div class="field-lines"></div><main class="screen">${topbar()}${content}</main>${bottomNav()}${bulkBar()}${modal()}${state.toast?`<div class="toast">${state.toast}</div>`:''}</div>`;
  }
  function topbar(){
    const name = state.user.name || 'Mi álbum';
    return `<div class="topbar">
      <div class="brand"><div class="logo">${ICONS.trophy}</div><div><div class="brand-title">FiguScan</div><div class="brand-sub">Mundial de figuritas</div></div></div>
      <button class="user-pill" data-action="profile">${escapeHtml(name)}</button>
    </div>`;
  }
  function bottomNav(){
    const item = (screen, icon, label, cls='')=>`<button class="nav-btn ${state.screen===screen?'active':''} ${cls}" data-go="${screen}"><span class="nav-icon">${cls==='scan'?`<span class="scan-bubble">${icon}</span>`:icon}</span><span class="nav-label">${label}</span></button>`;
    return `<nav class="bottom-nav" aria-label="Navegación principal">
      ${item('home',ICONS.home,'Inicio')}
      ${item('scanner',ICONS.scan,'Escanear','scan')}
      ${item('album',ICONS.album,'Álbum')}
      ${item('friends',ICONS.friends,'Amigos')}
      ${item('share',ICONS.share,'Compartir')}
    </nav>`;
  }
  function homeScreen(){
    const s = stats();
    return appFrame(`<section class="hero"><h1>Organizá tu álbum en segundos</h1><p>Escaneá las figuritas que tenés, anotá las que te faltan y compartí tus cambios por WhatsApp.</p></section>
      <div class="action-grid">
        <button class="primary-action" data-go="scanner"><div class="action-icon">${ICONS.scan}</div><div class="action-label">Escanear ahora</div><div class="action-small">Para figuritas en mano</div></button>
        <button class="secondary-action" data-go="manual"><div class="action-icon">${ICONS.plus}</div><div class="action-label">Agregar manualmente</div><div class="action-small">Número, jugador y estado</div></button>
      </div>
      <div class="stats-grid">
        <button class="stat-card have" data-filtergo="have">${ICONS.have}<div class="stat-number">${s.have}</div><div class="stat-label">Tengo</div></button>
        <button class="stat-card missing" data-filtergo="missing">${ICONS.missing}<div class="stat-number">${s.missing}</div><div class="stat-label">Me faltan</div></button>
        <button class="stat-card repeated" data-filtergo="repeated">${ICONS.repeated}<div class="stat-number">${s.repeated}</div><div class="stat-label">Repetidas</div></button>
      </div>
      <section class="panel"><div class="section-title"><div class="title-left"><div class="title-icon">${ICONS.cards}</div><div><h2 class="panel-title">Accesos rápidos</h2><p class="panel-sub">Todo a uno o dos toques.</p></div></div></div>
        <div class="quick-grid">
          <button class="quick" data-go="album">${ICONS.album}<span>Mi álbum</span></button>
          <button class="quick" data-go="friends">${ICONS.friends}<span>Cambios con amigos</span></button>
          <button class="quick" data-filtergo="repeated">${ICONS.repeated}<span>Repetidas</span></button>
          <button class="quick" data-filtergo="missing">${ICONS.missing}<span>Me faltan</span></button>
        </div>
      </section>`);
  }
  function manualScreen(pref={}){
    const number = pref.number || state.pending?.number || '';
    const status = pref.status || state.pending?.status || 'have';
    const repeatedCount = pref.repeatedCount || state.pending?.repeatedCount || 1;
    const player = pref.player || state.pending?.player || '';
    return appFrame(`<section class="panel"><div class="section-title"><div class="title-left"><div class="title-icon">${ICONS.plus}</div><div><h1 class="panel-title">Agregar figurita</h1><p class="panel-sub">Cargá número, nombre del jugador y estado.</p></div></div></div>
      <form class="form" id="manualForm">
        <div class="field"><label>Número de figurita</label><input class="input" id="numInput" inputmode="numeric" pattern="[0-9]*" placeholder="Ej: 24" value="${escapeAttr(number)}" /></div>
        <div class="field"><label>Nombre del jugador</label><input class="input" id="playerInput" placeholder="Ej: Messi" value="${escapeAttr(player)}" /></div>
        ${statusPicker(status)}
        <div id="qtyWrap" class="${status==='repeated'?'':'hidden'}">${qtyControl(repeatedCount)}</div>
        <div class="btn-row"><button type="button" class="btn btn-ghost" data-go="home">Cancelar</button><button class="btn btn-primary" type="submit">${ICONS.check} Guardar</button></div>
        <button class="btn btn-green btn-full" type="button" id="saveMore">${ICONS.plus} Guardar y cargar otra</button>
      </form></section>`);
  }
  function statusPicker(current){
    const btn = (s,title,help)=>`<button type="button" class="status-btn ${statusClass(s)} ${current===s?'selected':''}" data-status="${s}"><span class="status-left"><span class="status-icon">${statusIcon(s)}</span><span><span class="status-title">${title}</span><span class="status-help">${help}</span></span></span></button>`;
    return `<div class="field"><label>Estado de la figurita</label><div class="status-picks" id="statusPicks">
      ${btn('have','LA TENGO','Ya está en mi álbum')}
      ${btn('missing','ME FALTA','La necesito para completar')}
      ${btn('repeated','REPETIDA','La tengo para cambiar')}
    </div></div>`;
  }
  function qtyControl(value){ return `<div class="field"><label>Cantidad repetida</label><div class="qty"><button type="button" data-qty="minus">−</button><strong id="qtyNum">${value||1}</strong><button type="button" data-qty="plus">+</button></div></div>`; }
  function scannerScreen(){
    return appFrame(`<section class="panel"><div class="section-title"><div class="title-left"><div class="title-icon">${ICONS.scan}</div><div><h1 class="panel-title">Escanear figurita</h1><p class="panel-sub">Usalo para figuritas que tenés en la mano. Para faltantes, agregalas manualmente por número.</p></div></div></div></section>
      <div class="camera-wrap"><video class="camera" id="camera" playsinline autoplay muted></video><div class="scan-frame"></div><div class="scan-line"></div><div class="camera-tip">Apuntá al número de la figurita</div><div class="camera-actions"><button class="btn btn-primary" id="captureBtn">Leer número</button><button class="btn btn-ghost" data-go="manual">Cargar número</button></div></div>
      <div id="detectedBox"></div>`);
  }
  function detectedCard(number){
    state.pending = { number, status:'have', repeatedCount:1, player:'' };
    return `<div class="detected"><div class="small-note">Figurita detectada</div><div class="detected-number">N° ${number}</div><button class="btn btn-primary btn-full" data-go="manual">Elegir estado y guardar</button><button class="btn btn-ghost btn-full" style="margin-top:10px" data-action="retry-scan">Escanear otra</button></div>`;
  }
  function albumStatusFromFilter(){
    return ['have','missing','repeated'].includes(state.filter) ? state.filter : 'have';
  }
  function albumAddLabel(){
    if(state.filter === 'missing') return 'Agregar faltante';
    if(state.filter === 'repeated') return 'Agregar repetida';
    if(state.filter === 'have') return 'Agregar que tengo';
    return 'Agregar figurita';
  }
  function albumScreen(){
    const arr = sortedStickers();
    const addStatus = albumStatusFromFilter();
    const addHelp = state.filter === 'missing'
      ? 'Anotá una figurita que necesitás, sin escanear.'
      : state.filter === 'repeated'
        ? 'Cargá una repetida para cambiar.'
        : 'Cargá una figurita desde esta sección.';
    return appFrame(`<section class="panel"><div class="section-title album-title"><div class="title-left"><div class="title-icon">${ICONS.album}</div><div><h1 class="panel-title">Mi álbum</h1><p class="panel-sub">Buscá, filtrá, enviá o eliminá figuritas.</p></div></div></div>
      <div class="album-action-strip">
        <button class="album-add ${statusClass(addStatus)}" data-action="add-in-filter"><span>${statusIcon(addStatus)}</span><strong>${albumAddLabel()}</strong><small>${addHelp}</small></button>
        <button class="album-add scan-mini" data-go="scanner"><span>${ICONS.scan}</span><strong>Escanear</strong><small>Solo si la tenés en mano</small></button>
      </div>
      <div class="field"><label>Buscar número o jugador</label><input class="input" id="searchInput" placeholder="Ej: 24 o Messi" value="${escapeAttr(state.search)}" /></div>
      <div class="filters">${chip('all','Todas')} ${chip('have','Tengo')} ${chip('missing','Me faltan')} ${chip('repeated','Repetidas')}</div>
      ${arr.length ? `<div class="album-grid">${arr.map(stickerCard).join('')}</div>` : `<div class="empty">${ICONS.empty}<div>No hay figuritas en esta sección.</div><p class="small-note">Tocá “${albumAddLabel()}” para cargar desde acá.</p></div>`}
    </section>`);
  }
  function chip(f,label){ return `<button class="chip ${state.filter===f?'active':''}" data-filter="${f}">${label}</button>`; }
  function stickerCard(s){
    const selected = state.selected.has(s.id);
    return `<article class="sticker-card ${statusClass(s.status)}" data-id="${s.id}">
      <div class="sticker-top"><span class="status-tag ${statusClass(s.status)}">${statusLabel(s.status)}${s.status==='repeated'?` x${s.repeatedCount||1}`:''}</span><button class="select-check ${selected?'active':''}" data-select="${s.id}">${selected?ICONS.check:''}</button><div class="sticker-number">${s.number}</div><div class="sticker-watermark">${ICONS.trophy}</div></div>
      <div class="sticker-body"><strong>Figurita N° ${s.number}</strong><div class="player">${s.player ? escapeHtml(s.player) : 'Sin jugador cargado'}</div>
        <div class="card-actions"><button class="icon-btn" data-edit="${s.id}" title="Editar">${ICONS.edit}</button><button class="icon-btn whatsapp" data-whatsapp="${s.id}" title="WhatsApp">${ICONS.whatsapp}</button><button class="icon-btn delete" data-delete="${s.id}" title="Eliminar">${ICONS.trash}</button></div>
      </div>
    </article>`;
  }
  function bulkBar(){
    if(!state.selected.size) return '';
    return `<div class="bulk-bar"><strong>${state.selected.size} seleccionadas</strong><div class="bulk-actions"><button style="background:var(--field)" data-bulk="have">Tengo</button><button style="background:var(--red)" data-bulk="missing">Faltan</button><button style="background:var(--orange)" data-bulk="repeated">Repetidas</button><button style="background:#BE123C" data-bulk="delete">Eliminar</button></div></div>`;
  }
  function shareScreen(){
    const mode = state.shareMode || 'summary';
    const message = shareMessage(mode);
    const option = (id, title, text, icon, tone)=>`<button class="share-option ${tone} ${mode===id?'active':''}" data-share-mode="${id}"><span class="share-option-icon">${icon}</span><span><strong>${title}</strong><small>${text}</small></span></button>`;
    return appFrame(`<section class="share-hero"><div class="share-hero-icon">${ICONS.share}</div><div><h1>Compartir por WhatsApp</h1><p>Elegí exactamente qué querés enviar. El resumen es opcional.</p></div></section>
      <section class="panel share-panel"><h2 class="panel-title">¿Qué querés compartir?</h2><p class="panel-sub">Podés mandar todo el álbum o una sola categoría.</p>
        <div class="share-options">
          ${option('summary','Resumen completo','Tengo, faltantes y repetidas',ICONS.cards,'summary')}
          ${option('have','Solo tengo','Las figuritas que ya tenés',ICONS.have,'have')}
          ${option('missing','Solo me faltan','Las que necesitás conseguir',ICONS.missing,'missing')}
          ${option('repeated','Solo repetidas','Las que tenés para cambiar',ICONS.repeated,'repeated')}
        </div>
      </section>
      <section class="panel preview-panel"><div class="section-title"><div><h2 class="panel-title">Vista previa</h2><p class="panel-sub">Este es el mensaje que se abrirá en WhatsApp.</p></div></div><pre class="message-preview">${escapeHtml(message)}</pre>
        <div class="share-actions"><button class="btn btn-primary btn-full" data-action="send-share">${ICONS.whatsapp} Enviar por WhatsApp</button><button class="btn btn-gold btn-full" data-action="share-image">${ICONS.share} Compartir imagen visual</button><button class="btn btn-ghost btn-full" data-action="copy-share">Copiar mensaje</button></div>
        <p class="small-note">La imagen visual se comparte si tu celular lo permite. Si no, se abre WhatsApp con el texto mejorado.</p>
      </section>`);
  }
  function friendsScreen(){
    return appFrame(`<section class="panel"><div class="section-title"><div class="title-left"><div class="title-icon">${ICONS.friends}</div><div><h1 class="panel-title">Cambios con amigos</h1><p class="panel-sub">Primero compartí tu resumen por WhatsApp. Después compará manualmente con tus amigos.</p></div></div></div>
    <button class="btn btn-primary btn-full" data-go="share">${ICONS.share} Compartir mi resumen</button><p class="small-note" style="margin-top:14px">La comparación automática entre usuarios requiere cuentas en la nube. Esta versión gratis guarda todo en cada celular para no generar costos.</p></section>`);
  }
  function profileScreen(){
    return appFrame(`<section class="panel"><div class="section-title"><div class="title-left"><div class="title-icon">${ICONS.user}</div><div><h1 class="panel-title">Perfil</h1><p class="panel-sub">Nombre que aparece en tu app.</p></div></div></div>
      <form class="form" id="profileForm"><div class="field"><label>Tu nombre</label><input class="input" id="nameInput" placeholder="Ej: Lucas" value="${escapeAttr(state.user.name||'')}" /></div><button class="btn btn-primary btn-full">Guardar nombre</button></form></section>`);
  }
  function modal(){
    if(!state.modal) return '';
    return `<div class="modal-back"><div class="modal"><h3>${escapeHtml(state.modal.title)}</h3><p>${escapeHtml(state.modal.text)}</p><div class="btn-row"><button class="btn btn-ghost" data-modal="cancel">Cancelar</button><button class="btn ${state.modal.danger?'btn-danger':'btn-primary'}" data-modal="confirm">${escapeHtml(state.modal.confirmText || 'Confirmar')}</button></div></div></div>`;
  }
  function render(){
    if(state.screen === 'home') $app.innerHTML = homeScreen();
    if(state.screen === 'manual') $app.innerHTML = manualScreen();
    if(state.screen === 'scanner') $app.innerHTML = scannerScreen();
    if(state.screen === 'album') $app.innerHTML = albumScreen();
    if(state.screen === 'share') $app.innerHTML = shareScreen();
    if(state.screen === 'friends') $app.innerHTML = friendsScreen();
    if(state.screen === 'profile') $app.innerHTML = profileScreen();
    wire();
    if(state.screen === 'scanner') startCamera();
  }

  function wire(){
    document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
    document.querySelectorAll('[data-filtergo]').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filtergo;go('album',{filter:b.dataset.filtergo});}));
    document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;render();}));
    document.querySelector('[data-action="add-in-filter"]')?.addEventListener('click',()=>{
      const status = albumStatusFromFilter();
      state.pending = { number:'', player:'', status, repeatedCount: status==='repeated' ? 1 : 0 };
      state.returnFilter = state.filter === 'all' ? status : state.filter;
      go('manual');
    });
    const search = document.getElementById('searchInput'); if(search) search.addEventListener('input', e=>{state.search=e.target.value;render();});
    const profileBtn = document.querySelector('[data-action="profile"]'); if(profileBtn) profileBtn.addEventListener('click',()=>go('profile'));
    const form = document.getElementById('manualForm');
    if(form){
      let status = state.pending?.status || document.querySelector('.status-btn.selected')?.dataset.status || 'have';
      let qty = Number(document.getElementById('qtyNum')?.textContent || state.pending?.repeatedCount || 1);
      document.querySelectorAll('[data-status]').forEach(btn=>btn.addEventListener('click',()=>{
        status = btn.dataset.status; state.pending = {...(state.pending||{}), status};
        document.querySelectorAll('[data-status]').forEach(x=>x.classList.remove('selected'));
        btn.classList.add('selected');
        document.getElementById('qtyWrap')?.classList.toggle('hidden', status !== 'repeated');
      }));
      document.querySelectorAll('[data-qty]').forEach(btn=>btn.addEventListener('click',()=>{
        qty = Math.max(1, qty + (btn.dataset.qty === 'plus' ? 1 : -1));
        document.getElementById('qtyNum').textContent = qty;
      }));
      const save = (more=false)=>{
        const ok = upsertSticker({ number:document.getElementById('numInput').value, player:document.getElementById('playerInput').value, status, repeatedCount:qty });
        const returnFilter = state.returnFilter || (['have','missing','repeated'].includes(status) ? status : 'all');
        state.pending = null;
        if(ok){
          if(more){ state.pending = {status, repeatedCount: status==='repeated'?qty:1, player:''}; go('manual'); }
          else { state.returnFilter = null; go('album', {filter:returnFilter}); }
        }
      };
      form.addEventListener('submit', e=>{e.preventDefault();save(false);});
      document.getElementById('saveMore')?.addEventListener('click',()=>save(true));
    }
    document.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation(); const id=b.dataset.select; state.selected.has(id)?state.selected.delete(id):state.selected.add(id); render();}));
    document.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>deleteSticker(b.dataset.delete)));
    document.querySelectorAll('[data-whatsapp]').forEach(b=>b.addEventListener('click',()=>{ const s=state.stickers.find(x=>x.id===b.dataset.whatsapp); if(s) openWhatsApp(singleMessage(s)); }));
    document.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>{ const s=state.stickers.find(x=>x.id===b.dataset.edit); if(s){ state.pending={...s}; go('manual'); }}));
    document.querySelectorAll('[data-bulk]').forEach(b=>b.addEventListener('click',()=>{ const a=b.dataset.bulk; if(a==='delete') bulkDelete(); else bulkSet(a); }));
    document.querySelectorAll('[data-share-mode]').forEach(b=>b.addEventListener('click',()=>{state.shareMode=b.dataset.shareMode;render();}));
    document.querySelector('[data-action="send-share"]')?.addEventListener('click',()=>openWhatsApp(shareMessage(state.shareMode)));
    document.querySelector('[data-action="share-image"]')?.addEventListener('click',()=>shareVisualCard(state.shareMode));
    document.querySelector('[data-action="copy-share"]')?.addEventListener('click',()=>copyText(shareMessage(state.shareMode)));
    document.querySelector('[data-modal="cancel"]')?.addEventListener('click',()=>{state.modal=null;render();});
    document.querySelector('[data-modal="confirm"]')?.addEventListener('click',()=>{ if(state.modal?.onConfirm) state.modal.onConfirm(); });
    document.getElementById('profileForm')?.addEventListener('submit',e=>{e.preventDefault(); state.user.name=document.getElementById('nameInput').value.trim() || 'Mi álbum'; saveUser(); toast('Perfil guardado'); go('home');});
    document.getElementById('captureBtn')?.addEventListener('click',detectFromCamera);
    document.querySelector('[data-action="retry-scan"]')?.addEventListener('click',()=>{document.getElementById('detectedBox').innerHTML='';});
  }
  async function startCamera(){
    const video = document.getElementById('camera'); if(!video) return;
    try{
      stopCamera();
      state.cameraStream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:{ideal:'environment'}, width:{ideal:1280}, height:{ideal:720}}, audio:false });
      video.srcObject = state.cameraStream;
    }catch(err){
      document.querySelector('.camera-tip').textContent = 'No pude abrir la cámara. Cargá el número manualmente.';
      toast('Cámara no disponible');
    }
  }
  function stopCamera(){
    if(state.cameraStream){ state.cameraStream.getTracks().forEach(t=>t.stop()); state.cameraStream=null; }
  }
  async function detectFromCamera(){
    const box = document.getElementById('detectedBox');
    const btn = document.getElementById('captureBtn');
    const video = document.getElementById('camera');
    if(!box) return;
    if(btn){ btn.disabled = true; btn.textContent = 'Leyendo...'; }
    box.innerHTML = `<div class="detected"><div class="small-note">Leyendo el número</div><h2 style="margin:6px 0;color:var(--navy)">Intentando detectar la figurita...</h2><p class="panel-sub">Centrala dentro del recuadro amarillo. Si no sale, la cargás manual.</p></div>`;
    try{
      const number = await readNumberFromVideo(video);
      if(number){
        box.innerHTML = detectedCard(number);
        wire();
        return;
      }
      showManualFallback(box);
    }catch(err){
      showManualFallback(box);
    }finally{
      if(btn){ btn.disabled = false; btn.textContent = 'Leer número'; }
    }
  }
  async function readNumberFromVideo(video){
    if(!video || !video.videoWidth) return '';
    const crop = cropGuideFromVideo(video);
    const processed = preprocessForOCR(crop);
    if(window.Tesseract && window.Tesseract.recognize){
      const result = await window.Tesseract.recognize(processed, 'eng', {
        tessedit_char_whitelist: '0123456789',
        logger: () => {}
      });
      const text = result?.data?.text || '';
      const number = extractBestNumber(text);
      if(number) return number;
    }
    return '';
  }
  function cropGuideFromVideo(video){
    const vw = video.videoWidth, vh = video.videoHeight;
    const w = Math.floor(vw * 0.76);
    const h = Math.floor(vh * 0.58);
    const x = Math.floor((vw - w) / 2);
    const y = Math.floor((vh - h) / 2);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(video, x, y, w, h, 0, 0, w, h);
    return c;
  }
  function preprocessForOCR(source){
    const scale = 2;
    const c = document.createElement('canvas');
    c.width = source.width * scale; c.height = source.height * scale;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(source, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0,0,c.width,c.height);
    const d = img.data;
    for(let i=0;i<d.length;i+=4){
      const gray = d[i]*0.299 + d[i+1]*0.587 + d[i+2]*0.114;
      const contrasted = gray > 150 ? 255 : 0;
      d[i]=d[i+1]=d[i+2]=contrasted;
    }
    ctx.putImageData(img,0,0);
    return c;
  }
  function extractBestNumber(text){
    const matches = String(text||'').match(/\d{1,4}/g) || [];
    if(!matches.length) return '';
    return matches.sort((a,b)=>b.length-a.length || Number(a)-Number(b))[0];
  }
  function showManualFallback(box){
    box.innerHTML = `<div class="detected"><div class="small-note">No pude detectar el número</div><h2 style="margin:6px 0;color:var(--navy)">Cargalo manualmente</h2><p class="panel-sub">El OCR en el navegador depende de luz, enfoque y tamaño del número. No guardo nada inventado.</p><div class="field"><input class="input" id="quickNum" inputmode="numeric" placeholder="Número" /></div><button class="btn btn-primary btn-full" id="quickSave">Continuar</button></div>`;
    document.getElementById('quickSave').addEventListener('click',()=>{
      const n = normalizeNumber(document.getElementById('quickNum').value);
      if(!n){toast('Ingresá el número');return;}
      box.innerHTML = detectedCard(n);
      wire();
    });
  }
  function escapeHtml(str=''){ return String(str).replace(/[&<>"]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m])); }
  function escapeAttr(str=''){ return escapeHtml(str).replace(/'/g,'&#039;'); }

  if('serviceWorker' in navigator){ navigator.serviceWorker.register('/service-worker.js').catch(()=>{}); }
  render();
})();
