/* FiguScan Mundial V4 - app plana para Vercel + Firebase */
const $app = document.getElementById('app');

const COUNTRIES = [
  'Argentina','Brasil','Uruguay','Chile','Paraguay','Colombia','Ecuador','Perú','Bolivia','Venezuela',
  'México','Estados Unidos','Canadá','España','Francia','Portugal','Inglaterra','Alemania','Italia','Países Bajos',
  'Bélgica','Croacia','Marruecos','Japón','Corea del Sur','Arabia Saudita','Australia','Senegal','Ghana','Camerún',
  'Nigeria','Dinamarca','Suiza','Polonia','Serbia','Costa Rica','Qatar','Otro'
];
const YEARS = ['2026','2022','2018','2014','2010','2006','2002','1998','1994','1990','Otro'];
const STATUS = {
  tengo: { label:'LA TENGO', short:'Tengo', emoji:'✅', color:'green', help:'Ya está en mi álbum' },
  faltante: { label:'ME FALTA', short:'Me falta', emoji:'❌', color:'red', help:'Todavía la necesito' },
  repetida: { label:'REPETIDA', short:'Repetida', emoji:'🔁', color:'orange', help:'La puedo cambiar' }
};
const FLAGS = { Argentina:'🇦🇷', Brasil:'🇧🇷', Uruguay:'🇺🇾', Chile:'🇨🇱', Paraguay:'🇵🇾', Colombia:'🇨🇴', Ecuador:'🇪🇨', Perú:'🇵🇪', Bolivia:'🇧🇴', Venezuela:'🇻🇪', México:'🇲🇽', España:'🇪🇸', Francia:'🇫🇷', Portugal:'🇵🇹', Inglaterra:'🏴', Alemania:'🇩🇪', Italia:'🇮🇹', 'Países Bajos':'🇳🇱', Bélgica:'🇧🇪', Croacia:'🇭🇷', Marruecos:'🇲🇦', Japón:'🇯🇵', 'Corea del Sur':'🇰🇷', Australia:'🇦🇺', Senegal:'🇸🇳', Ghana:'🇬🇭', Camerún:'🇨🇲', Nigeria:'🇳🇬', Dinamarca:'🇩🇰', Suiza:'🇨🇭', Polonia:'🇵🇱', Serbia:'🇷🇸', 'Estados Unidos':'🇺🇸', Canadá:'🇨🇦', Qatar:'🇶🇦' };

let firebaseReady = false;
let auth = null;
let db = null;
try {
  const cfg = window.FIGUSCAN_CONFIG || {};
  if (window.firebase && cfg.apiKey) {
    firebase.initializeApp(cfg);
    auth = firebase.auth();
    db = firebase.firestore();
    db.enablePersistence?.().catch(() => null);
    firebaseReady = true;
  }
} catch (e) {
  console.warn('Firebase no inició:', e);
}

const state = {
  user: null,
  profile: null,
  stickers: [],
  friends: [],
  view: 'home',
  filter: 'all',
  loading: true,
  authMode: 'login',
  message: '',
  error: '',
  selected: new Set(),
  selectMode: false,
  editing: null,
  prefill: null,
  capturedImage: '',
  scanText: '',
  cameraStream: null,
  busy: false
};

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function esc(s=''){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function flag(country){ return FLAGS[country] || '⚽'; }
function setMsg(text, isError=false){ state.message = isError ? '' : text; state.error = isError ? text : ''; render(); }
function setView(view, filter='all'){ stopCamera(); state.view=view; state.filter=filter; state.selectMode=false; state.selected.clear(); state.editing=null; state.prefill=null; state.capturedImage=''; state.scanText=''; state.message=''; state.error=''; render(); }
function counts(){
  return {
    tengo: state.stickers.filter(s=>s.status==='tengo').length,
    faltante: state.stickers.filter(s=>s.status==='faltante').length,
    repetida: state.stickers.filter(s=>s.status==='repetida').length,
    total: state.stickers.length
  };
}
function localKey(name){ return `figuscan_${state.user?.uid || 'local'}_${name}`; }
function localLoad(){ try { return JSON.parse(localStorage.getItem(localKey('stickers')) || '[]'); } catch { return []; } }
function localSave(list){ localStorage.setItem(localKey('stickers'), JSON.stringify(list)); }

async function ensureProfile(user){
  const ref = db.collection('profiles').doc(user.uid);
  const snap = await ref.get();
  if (snap.exists) return { id:user.uid, ...snap.data() };
  const profile = {
    name: user.displayName || user.email?.split('@')[0] || 'Coleccionista',
    email: user.email || '',
    shareCode: makeShareCode(),
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  await ref.set(profile);
  return { id:user.uid, ...profile };
}
function makeShareCode(){ return Math.random().toString(36).slice(2,8).toUpperCase(); }

async function loadData(){
  if (!state.user || !firebaseReady) return;
  state.loading = true; render();
  try {
    state.profile = await ensureProfile(state.user);
    const qs = await db.collection('stickers').where('userId','==',state.user.uid).get();
    const cloud = qs.docs.map(d => ({ id:d.id, ...d.data() }));
    const local = localLoad().filter(x=>x._localOnly);
    state.stickers = [...cloud, ...local].sort((a,b)=>(b.createdAtMs||0)-(a.createdAtMs||0));
    await loadFriends();
    state.error = '';
  } catch (e) {
    console.error(e);
    state.error = 'No pude conectar con la nube. Voy a mostrar lo guardado en este teléfono.';
    state.stickers = localLoad();
  } finally {
    state.loading = false; render();
  }
}

async function loadFriends(){
  try {
    const qs = await db.collection('friends').where('userId','==',state.user.uid).get();
    const arr = [];
    for (const d of qs.docs) {
      const f = d.data();
      const ps = await db.collection('profiles').doc(f.friendUserId).get();
      arr.push({ id:d.id, ...f, profile: ps.exists ? ps.data() : { name:'Amigo', shareCode:'' } });
    }
    state.friends = arr;
  } catch(e){ state.friends = []; }
}

async function signUp(name,email,password){
  if (!firebaseReady) return setMsg('Firebase no está configurado.', true);
  state.busy = true; render();
  try {
    const cred = await auth.createUserWithEmailAndPassword(email,password);
    await cred.user.updateProfile({ displayName:name });
    state.user = cred.user;
    await loadData();
  } catch(e){ setMsg(trAuth(e.code), true); }
  finally { state.busy=false; render(); }
}
async function signIn(email,password){
  if (!firebaseReady) return setMsg('Firebase no está configurado.', true);
  state.busy = true; render();
  try { await auth.signInWithEmailAndPassword(email,password); }
  catch(e){ setMsg(trAuth(e.code), true); }
  finally { state.busy=false; render(); }
}
function trAuth(code){
  return ({
    'auth/email-already-in-use':'Ese email ya tiene cuenta. Probá entrar.',
    'auth/invalid-email':'El email está mal escrito.',
    'auth/weak-password':'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-credential':'Email o contraseña incorrectos.',
    'auth/wrong-password':'Contraseña incorrecta.',
    'auth/network-request-failed':'Sin conexión a internet.'
  })[code] || 'No se pudo entrar. Revisá los datos.';
}
async function logout(){ stopCamera(); await auth.signOut(); }

async function saveSticker(data){
  if (!state.user) return setMsg('Primero entrá con tu usuario.', true);
  state.busy = true; render();
  const payload = {
    userId: state.user.uid,
    year: data.year || '2026',
    country: data.country || 'Argentina',
    number: String(data.number || '').trim(),
    player: String(data.player || '').trim(),
    status: data.status || 'tengo',
    quantity: data.status === 'repetida' ? Number(data.quantity || 2) : 1,
    image: data.image || '',
    updatedAtMs: Date.now()
  };
  if (!payload.number) { state.busy=false; return setMsg('Falta poner el número de la figurita.', true); }
  try {
    if (state.editing) {
      await db.collection('stickers').doc(state.editing.id).update({ ...payload, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      state.stickers = state.stickers.map(s => s.id === state.editing.id ? { ...s, ...payload } : s);
      setMsg('Figurita actualizada.');
    } else {
      const doc = await db.collection('stickers').add({ ...payload, createdAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAt: firebase.firestore.FieldValue.serverTimestamp(), createdAtMs: Date.now() });
      state.stickers.unshift({ id:doc.id, ...payload, createdAtMs: Date.now() });
      setMsg('Figurita guardada.');
    }
    state.editing=null; state.prefill=null; state.capturedImage=''; state.scanText=''; state.view='home';
  } catch(e) {
    console.error(e);
    const local = localLoad();
    const localSticker = { id: state.editing?.id || uid(), ...payload, _localOnly:true, createdAtMs: Date.now() };
    if (state.editing) {
      const next = local.map(s => s.id === state.editing.id ? localSticker : s);
      localSave(next); state.stickers = state.stickers.map(s => s.id === state.editing.id ? localSticker : s);
    } else {
      local.unshift(localSticker); localSave(local); state.stickers.unshift(localSticker);
    }
    state.view='home';
    setMsg('Guardé la figurita en este teléfono. La nube no respondió.', true);
  } finally { state.busy=false; render(); }
}
async function deleteSticker(id){
  if (!confirm('¿Eliminar esta figurita?')) return;
  try {
    const s = state.stickers.find(x=>x.id===id);
    if (s?._localOnly) {
      localSave(localLoad().filter(x=>x.id!==id));
    } else {
      await db.collection('stickers').doc(id).delete();
    }
    state.stickers = state.stickers.filter(s=>s.id!==id);
    setMsg('Figurita eliminada.');
  } catch(e){ setMsg('No se pudo eliminar. Revisá las reglas de Firebase.', true); }
}
async function bulkStatus(status){
  const ids = [...state.selected];
  if (!ids.length) return;
  const qty = status==='repetida' ? 2 : 1;
  try {
    await Promise.all(ids.map(id => {
      const s = state.stickers.find(x=>x.id===id);
      if (s?._localOnly) return Promise.resolve();
      return db.collection('stickers').doc(id).update({ status, quantity: qty, updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedAtMs: Date.now() });
    }));
    state.stickers = state.stickers.map(s => ids.includes(s.id) ? { ...s, status, quantity:qty } : s);
    const local = localLoad().map(s => ids.includes(s.id) ? { ...s, status, quantity:qty } : s); localSave(local);
    state.selected.clear(); state.selectMode=false; setMsg('Listo. Cambié las figuritas seleccionadas.');
  } catch(e){ setMsg('No pude cambiar esas figuritas.', true); }
}
async function bulkDelete(){
  const ids = [...state.selected];
  if (!ids.length) return;
  if (!confirm(`¿Eliminar ${ids.length} figuritas?`)) return;
  try {
    await Promise.all(ids.map(id => {
      const s = state.stickers.find(x=>x.id===id);
      if (s?._localOnly) return Promise.resolve();
      return db.collection('stickers').doc(id).delete();
    }));
    state.stickers = state.stickers.filter(s => !ids.includes(s.id));
    localSave(localLoad().filter(s=>!ids.includes(s.id)));
    state.selected.clear(); state.selectMode=false; setMsg('Figuritas eliminadas.');
  } catch(e){ setMsg('No pude eliminar todas. Revisá conexión o reglas.', true); }
}

function filteredStickers(){
  let arr = [...state.stickers];
  if (state.filter !== 'all') arr = arr.filter(s=>s.status===state.filter);
  return arr.sort((a,b) => String(a.country).localeCompare(String(b.country)) || Number(a.number)-Number(b.number));
}

function render(){
  if (state.loading && !state.user) return $app.innerHTML = splash();
  if (!state.user) return renderAuth();
  const html = `${topbar()}<main class="page">${messages()}${viewHtml()}</main>${nav()}${bulkbar()}`;
  $app.innerHTML = html;
  bindCommon();
  bindView();
}
function splash(){ return `<div class="splash"><div class="logo-ball">⚽</div><h1>FiguScan Mundial</h1><p>Cargando app...</p></div>`; }
function topbar(){
  return `<header class="topbar"><div class="topbar-row"><div class="brand"><div class="brand-logo">⚽</div><div><h1>FiguScan</h1><p>${esc(state.profile?.name || state.user?.email || 'Mi álbum')}</p></div></div><button class="icon-btn" data-action="logout" title="Salir">⏻</button></div></header>`;
}
function messages(){ return `${state.message?`<div class="notice good">${esc(state.message)}</div>`:''}${state.error?`<div class="notice bad">${esc(state.error)}</div>`:''}`; }
function nav(){
  const items = [['home','🏠','Inicio'],['scan','📷','Escanear'],['album','🧩','Álbum'],['friends','👥','Amigos'],['share','📲','Compartir']];
  return `<nav class="nav">${items.map(([v,e,l])=>`<button data-nav="${v}" class="${state.view===v?'active':''}"><span>${e}</span>${l}</button>`).join('')}</nav>`;
}
function bulkbar(){
  if (!state.selectMode) return '';
  const n = state.selected.size;
  return `<div class="bulkbar"><strong>${n} seleccionada${n===1?'':'s'}</strong><div class="bulkrow"><button class="green" data-bulk="tengo">Tengo</button><button class="red" data-bulk="faltante">Me falta</button><button class="orange" data-bulk="repetida">Repetida</button><button class="ghost" data-bulk="delete">Eliminar</button></div></div>`;
}
function viewHtml(){
  if (state.view==='home') return homeHtml();
  if (state.view==='scan') return scanHtml();
  if (state.view==='album') return listHtml('Mi álbum', 'Todas tus figuritas');
  if (state.view==='add') return manualHtml();
  if (state.view==='friends') return friendsHtml();
  if (state.view==='share') return shareHtml();
  if (state.view==='profile') return profileHtml();
  return homeHtml();
}
function homeHtml(){
  const c=counts();
  return `<section class="hero-card"><h2 class="hero-title">Tu álbum, tus repetidas y tus cambios en un solo lugar.</h2><p class="hero-sub">Sacá foto, cargá figuritas y compartí con amigos por WhatsApp.</p><div class="cta-grid"><button class="cta primary" data-nav="scan"><span>📷</span><strong>Escanear figurita</strong><small>Con recuadro guía</small></button><button class="cta dark" data-nav="add"><span>✍️</span><strong>Cargar manual</strong><small>Rápido y seguro</small></button></div></section>
  <div class="stats"><button class="stat green" data-list="tengo"><span class="emoji">✅</span><span class="label">Tengo</span><span class="num">${c.tengo}</span></button><button class="stat red" data-list="faltante"><span class="emoji">❌</span><span class="label">Me faltan</span><span class="num">${c.faltante}</span></button><button class="stat orange" data-list="repetida"><span class="emoji">🔁</span><span class="label">Repetidas</span><span class="num">${c.repetida}</span></button></div>
  <h2 class="section-title">Accesos rápidos</h2><div class="cta-grid"><button class="cta green" data-nav="album"><span>🧩</span><strong>Ver álbum</strong><small>${c.total} figuritas</small></button><button class="cta orange" data-nav="friends"><span>👥</span><strong>Intercambios</strong><small>Con amigos</small></button></div>`;
}
function listHtml(title, subtitle){
  const arr = filteredStickers();
  const filterTitle = state.filter==='tengo'?'Tengo':state.filter==='faltante'?'Me faltan':state.filter==='repetida'?'Repetidas':title;
  return `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><div><h2 class="section-title">${esc(filterTitle)}</h2><p class="section-sub">${esc(subtitle)} · ${arr.length} resultado${arr.length===1?'':'s'}</p></div><button class="btn inline secondary" data-action="toggleSelect">${state.selectMode?'Cancelar':'Marcar'}</button></div>
  <div class="filters"><button class="chip ${state.filter==='all'?'active':''}" data-filter="all">Todas</button><button class="chip ${state.filter==='tengo'?'active':''}" data-filter="tengo">✅ Tengo</button><button class="chip ${state.filter==='faltante'?'active':''}" data-filter="faltante">❌ Me faltan</button><button class="chip ${state.filter==='repetida'?'active':''}" data-filter="repetida">🔁 Repetidas</button></div>
  ${arr.length?`<div class="list">${arr.map(stickerCard).join('')}</div>`:emptyHtml('Todavía no hay figuritas acá','Cargá o escaneá tu primera figurita.')}`;
}
function stickerCard(s){
  const cfg=STATUS[s.status]||STATUS.tengo;
  const selected=state.selected.has(s.id);
  return `<article class="sticker ${cfg.color}" data-id="${s.id}">${state.selectMode?`<button class="select-check ${selected?'on':''}" data-select="${s.id}">${selected?'✓':''}</button>`:''}<div class="sticker-img">${s.image?`<img src="${s.image}" alt="Figurita ${esc(s.number)}">`:`<div class="placeholder"><span>${flag(s.country)}</span><b>#${esc(s.number)}</b></div>`}<span class="badge ${cfg.color}">${cfg.emoji} ${s.status==='repetida'?'x'+(s.quantity||2):cfg.short}</span></div><div class="sticker-body"><div class="sticker-title">${flag(s.country)} #${esc(s.number)} ${esc(s.country)}</div><div class="sticker-meta">${esc(s.player||'Sin jugador')} · ${esc(s.year||'')}</div><div class="sticker-actions"><button class="mini" data-edit="${s.id}">Editar</button><button class="mini red" data-delete="${s.id}">Eliminar</button></div></div></article>`;
}
function emptyHtml(t,s){ return `<div class="empty"><div class="big">🧩</div><h3>${esc(t)}</h3><p>${esc(s)}</p><button class="btn" data-nav="add">Cargar figurita</button></div>`; }

function manualHtml(prefill={}){
  const s = state.editing || state.prefill || prefill || {};
  const status = s.status || 'tengo';
  const image = state.capturedImage || s.image || '';
  return `<h2 class="section-title">${state.editing?'Editar figurita':'Guardar figurita'}</h2><p class="section-sub">Elegí los datos. Las opciones importantes están grandes y con color.</p>${image?`<div class="preview"><img src="${image}" alt="Foto de figurita"></div><br>`:''}<section class="card"><form class="form" id="stickerForm"><input type="hidden" name="image" value="${esc(image)}"><div class="field"><label>Año del Mundial</label><select name="year">${YEARS.map(y=>`<option ${String(s.year||'2026')===y?'selected':''}>${y}</option>`).join('')}</select></div><div class="field"><label>Selección / País</label><select name="country">${COUNTRIES.map(c=>`<option ${String(s.country||'Argentina')===c?'selected':''}>${c}</option>`).join('')}</select></div><div class="field"><label>Número de figurita</label><input name="number" inputmode="numeric" placeholder="Ej: 10" value="${esc(s.number||'')}"></div><div class="field"><label>Jugador o nombre</label><input name="player" placeholder="Ej: Messi" value="${esc(s.player||'')}"></div><div class="field"><label>Estado de la figurita</label><div class="status-grid">${Object.entries(STATUS).map(([key,c])=>`<button type="button" class="status-option ${c.color} ${status===key?'active':''}" data-status="${key}"><span class="ico">${c.emoji}</span><span><strong>${c.label}</strong><small>${c.help}</small></span></button>`).join('')}</div><input type="hidden" name="status" value="${status}"></div><div class="field qty-field ${status==='repetida'?'':'hidden'}"><label>¿Cuántas repetidas tenés?</label><div class="qty-row">${[2,3,4,5,6].map(n=>`<button type="button" class="qty ${Number(s.quantity||2)===n?'active':''}" data-qty="${n}">${n}</button>`).join('')}</div><input type="hidden" name="quantity" value="${s.quantity||2}"></div><button class="btn green" type="submit" ${state.busy?'disabled':''}>💾 Guardar figurita</button><button class="btn secondary" type="button" data-nav="home">Cancelar</button></form></section>`;
}
function scanHtml(){
  if (state.capturedImage) {
    return `<h2 class="section-title">Foto lista</h2><p class="section-sub">La recorté para que quede como figurita.</p><div class="preview"><img src="${state.capturedImage}" alt="Figurita recortada"></div><br>${state.scanText?`<div class="scan-status ${state.scanText.includes('Encontré')?'scan-ok':''}">${esc(state.scanText)}</div><br>`:''}<button class="btn green" data-action="useCaptured">Guardar con esta foto</button><br><button class="btn secondary" data-action="retake">Volver a sacar</button>`;
  }
  return `<h2 class="section-title">Escanear figurita</h2><p class="section-sub">Poné la figurita dentro del recuadro amarillo.</p><div class="camera-box"><video class="camera" id="cameraVideo" autoplay playsinline muted></video><div class="guide"></div></div><br><button class="btn" data-action="startCamera">📷 Abrir cámara</button><br><button class="btn green" data-action="capturePhoto">✅ Sacar foto</button><br><label class="btn secondary">🖼️ Elegir foto<input type="file" accept="image/*" capture="environment" id="fileInput" class="hidden"></label><br><div class="notice">Si el reconocimiento no encuentra los datos, igual vas a poder cargarlos a mano.</div>`;
}
function friendsHtml(){
  return `<h2 class="section-title">Amigos</h2><p class="section-sub">Agregá amigos por código y buscá intercambios.</p><section class="share-card"><h3>Tu código</h3><p>Compartilo con tus amigos.</p><div class="code">${esc(state.profile?.shareCode||'------')}</div><br><button class="btn secondary" data-action="shareCode">Compartir mi código</button></section><br><section class="card"><form id="friendForm" class="form"><div class="field"><label>Código de amigo</label><input name="code" placeholder="Ej: ABC123" maxlength="10"></div><button class="btn" type="submit">Agregar amigo</button></form></section><h2 class="section-title">Mis amigos</h2>${state.friends.length?state.friends.map(friendCard).join(''):emptyHtml('No agregaste amigos','Compartí tu código o agregá el de otra persona.')}`;
}
function friendCard(f){ return `<section class="card" style="margin-bottom:10px"><strong style="font-size:20px">👤 ${esc(f.profile?.name||'Amigo')}</strong><p class="section-sub">Código: ${esc(f.profile?.shareCode||'')}</p><button class="btn green" data-compare="${f.friendUserId}">Ver intercambios</button></section>`; }
function shareHtml(){
  return `<h2 class="section-title">Compartir</h2><p class="section-sub">Mandá tus listas por WhatsApp con mejor presentación.</p><section class="share-card"><h3>⚽ FiguScan Mundial</h3><p>Elegí qué querés compartir.</p><button class="btn green" data-share="repetida">🔁 Mis repetidas</button><br><button class="btn red" data-share="faltante">❌ Mis faltantes</button><br><button class="btn secondary" data-action="shareImage">🖼️ Compartir imagen resumen</button></section><br><div class="notice">WhatsApp no siempre deja adjuntar una imagen automáticamente desde el navegador. Si tu celular lo permite, se abrirá el menú para enviar la imagen con el logo.</div>`;
}
function profileHtml(){ return `<h2 class="section-title">Perfil</h2><section class="card"><p><b>Usuario:</b> ${esc(state.profile?.name||'')}</p><p><b>Email:</b> ${esc(state.user?.email||'')}</p><p><b>Código:</b> ${esc(state.profile?.shareCode||'')}</p><button class="btn red" data-action="logout">Cerrar sesión</button></section>`; }

function renderAuth(){
  $app.innerHTML = `<div class="auth-wrap"><div class="auth-logo"><div class="brand-logo">⚽</div><h1>FiguScan Mundial</h1><p>Tu álbum de figuritas para compartir.</p></div><section class="auth-card">${messages()}<div class="toggle"><button class="${state.authMode==='login'?'active':''}" data-authmode="login">Entrar</button><button class="${state.authMode==='signup'?'active':''}" data-authmode="signup">Crear cuenta</button></div><form id="authForm" class="form">${state.authMode==='signup'?`<div class="field"><label>Nombre</label><input name="name" placeholder="Tu nombre" required></div>`:''}<div class="field"><label>Email</label><input name="email" type="email" placeholder="tu@email.com" required></div><div class="field"><label>Contraseña</label><input name="password" type="password" minlength="6" placeholder="mínimo 6 caracteres" required></div><button class="btn" ${state.busy?'disabled':''}>${state.authMode==='login'?'Entrar':'Crear mi cuenta'}</button></form></section></div>`;
  document.querySelectorAll('[data-authmode]').forEach(b=>b.onclick=()=>{state.authMode=b.dataset.authmode; renderAuth();});
  document.getElementById('authForm').onsubmit = (e)=>{e.preventDefault(); const f=new FormData(e.target); const email=f.get('email'), pass=f.get('password'); if(state.authMode==='signup') signUp(f.get('name'),email,pass); else signIn(email,pass);};
}

function bindCommon(){
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>setView(b.dataset.nav));
  document.querySelectorAll('[data-list]').forEach(b=>b.onclick=()=>setView('album',b.dataset.list));
  document.querySelectorAll('[data-action="logout"]').forEach(b=>b.onclick=logout);
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter; render();});
  const toggle = document.querySelector('[data-action="toggleSelect"]');
  if(toggle) toggle.onclick=()=>{state.selectMode=!state.selectMode; state.selected.clear(); render();};
  document.querySelectorAll('[data-bulk]').forEach(b=>b.onclick=()=>{ const a=b.dataset.bulk; if(a==='delete') bulkDelete(); else bulkStatus(a); });
}
function bindView(){
  document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=(e)=>{e.stopPropagation(); deleteSticker(b.dataset.delete);});
  document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=(e)=>{e.stopPropagation(); state.editing=state.stickers.find(s=>s.id===b.dataset.edit); state.view='add'; render();});
  document.querySelectorAll('[data-select]').forEach(b=>b.onclick=(e)=>{e.stopPropagation(); const id=b.dataset.select; state.selected.has(id)?state.selected.delete(id):state.selected.add(id); render();});
  const form = document.getElementById('stickerForm');
  if(form){
    form.querySelectorAll('[data-status]').forEach(btn=>btn.onclick=()=>{ form.status.value=btn.dataset.status; form.querySelectorAll('[data-status]').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); form.querySelector('.qty-field').classList.toggle('hidden', btn.dataset.status!=='repetida'); });
    form.querySelectorAll('[data-qty]').forEach(btn=>btn.onclick=()=>{ form.quantity.value=btn.dataset.qty; form.querySelectorAll('[data-qty]').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); });
    form.onsubmit=(e)=>{e.preventDefault(); const f=new FormData(form); saveSticker(Object.fromEntries(f.entries()));};
  }
  const start = document.querySelector('[data-action="startCamera"]'); if(start) start.onclick=startCamera;
  const cap = document.querySelector('[data-action="capturePhoto"]'); if(cap) cap.onclick=capturePhoto;
  const retake = document.querySelector('[data-action="retake"]'); if(retake) retake.onclick=()=>{state.capturedImage=''; state.scanText=''; render();};
  const useCap = document.querySelector('[data-action="useCaptured"]'); if(useCap) useCap.onclick=()=>{state.view='add'; render();};
  const file = document.getElementById('fileInput'); if(file) file.onchange=async(e)=>{ const img=await fileToData(e.target.files[0]); await handleImage(img); };
  const friendForm = document.getElementById('friendForm'); if(friendForm) friendForm.onsubmit=addFriend;
  document.querySelectorAll('[data-share]').forEach(b=>b.onclick=()=>shareText(b.dataset.share));
  const shareImg=document.querySelector('[data-action="shareImage"]'); if(shareImg) shareImg.onclick=shareImageSummary;
  const shareCode=document.querySelector('[data-action="shareCode"]'); if(shareCode) shareCode.onclick=()=>sharePlain(`⚽ FiguScan Mundial\nMi código para intercambiar figuritas es: ${state.profile?.shareCode}\nAbrí la app y agregame como amigo.`);
  document.querySelectorAll('[data-compare]').forEach(b=>b.onclick=()=>compareFriend(b.dataset.compare));
}

async function startCamera(){
  try {
    stopCamera();
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' }, audio:false });
    state.cameraStream = stream;
    const video = document.getElementById('cameraVideo');
    if(video) video.srcObject = stream;
  } catch(e){ setMsg('No pude abrir la cámara. Usá “Elegir foto”.', true); }
}
function stopCamera(){ if(state.cameraStream){ state.cameraStream.getTracks().forEach(t=>t.stop()); state.cameraStream=null; } }
async function capturePhoto(){
  const video = document.getElementById('cameraVideo');
  if(!video || !video.videoWidth) return setMsg('Primero tocá “Abrir cámara”.', true);
  const data = cropMedia(video, video.videoWidth, video.videoHeight);
  await handleImage(data);
  stopCamera();
}
function cropMedia(source,w,h){
  const ratio = 3/4;
  let sx=0, sy=0, sw=w, sh=h;
  const current = w/h;
  if(current > ratio){ sw = h*ratio; sx = (w-sw)/2; } else { sh = w/ratio; sy = (h-sh)/2; }
  const canvas=document.createElement('canvas'); canvas.width=540; canvas.height=720;
  const ctx=canvas.getContext('2d'); ctx.drawImage(source,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',0.72);
}
function fileToData(file){ return new Promise((resolve,reject)=>{ if(!file) return reject(); const reader=new FileReader(); reader.onload=()=>{ const img=new Image(); img.onload=()=>resolve(cropMedia(img,img.width,img.height)); img.src=reader.result; }; reader.readAsDataURL(file); }); }
async function handleImage(data){
  state.capturedImage=data; state.scanText='Estoy intentando reconocer la figurita...'; render();
  const res = await recognizeSticker(data);
  if(res && (res.number || res.country || res.player)){
    state.scanText = 'Encontré algunos datos. Revisalos antes de guardar.';
    state.editing = null;
    state.prefill = res;
  } else {
    state.scanText = 'No pude reconocerla con seguridad. Cargala manualmente, la foto queda guardada.';
  }
  render();
}
async function recognizeSticker(img){
  try {
    if(!window.Tesseract) return {};
    const out = await Tesseract.recognize(img, 'eng+spa', { logger: () => {} });
    const text = out?.data?.text || '';
    const upper = text.toUpperCase();
    const country = COUNTRIES.find(c => upper.includes(c.toUpperCase())) || '';
    const year = (upper.match(/20(26|22|18|14|10|06|02)/)||[])[0] || '2026';
    const nums = [...upper.matchAll(/\b(\d{1,3})\b/g)].map(m=>m[1]).filter(n=>Number(n)>0 && Number(n)<700);
    const number = nums[0] || '';
    const lines = text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
    const player = lines.find(l => l.length>3 && !/\d/.test(l) && (!country || l.toUpperCase()!==country.toUpperCase())) || '';
    return { country, year, number, player, status:'tengo', image:img };
  } catch(e){ return {}; }
}

async function addFriend(e){
  e.preventDefault();
  const code = new FormData(e.target).get('code').toString().trim().toUpperCase();
  if(!code) return;
  try {
    const qs = await db.collection('profiles').where('shareCode','==',code).get();
    if(qs.empty) return setMsg('No encontré ese código.', true);
    const doc=qs.docs[0];
    if(doc.id===state.user.uid) return setMsg('Ese es tu propio código.', true);
    await db.collection('friends').doc(`${state.user.uid}_${doc.id}`).set({ userId:state.user.uid, friendUserId:doc.id, status:'active', createdAt:firebase.firestore.FieldValue.serverTimestamp() });
    await loadFriends(); setMsg('Amigo agregado.');
  } catch(err){ setMsg('No pude agregar el amigo.', true); }
}
async function compareFriend(friendUserId){
  try {
    const qs = await db.collection('stickers').where('userId','==',friendUserId).get();
    const fs = qs.docs.map(d=>({id:d.id,...d.data()}));
    const myDup = state.stickers.filter(s=>s.status==='repetida');
    const myMiss = state.stickers.filter(s=>s.status==='faltante');
    const friendDup = fs.filter(s=>s.status==='repetida');
    const friendMiss = fs.filter(s=>s.status==='faltante');
    const give = myDup.filter(a=>friendMiss.some(b=>sameSticker(a,b)));
    const receive = friendDup.filter(a=>myMiss.some(b=>sameSticker(a,b)));
    alert(`Intercambios posibles:\n\nVos podés dar: ${give.length}\nTu amigo puede darte: ${receive.length}`);
  } catch(e){ setMsg('No pude comparar con ese amigo.', true); }
}
function sameSticker(a,b){ return String(a.country).toLowerCase()===String(b.country).toLowerCase() && String(a.number)===String(b.number); }
function shareText(type){
  const list = state.stickers.filter(s=>s.status===type);
  const title = type==='repetida'?'repetidas':'faltantes';
  const lines = list.length ? list.map(s=>`- ${s.country} #${s.number}${s.player?' - '+s.player:''}`).join('\n') : '- Todavía no cargué ninguna';
  sharePlain(`⚽ FiguScan Mundial\n\nEstas son mis figuritas ${title}:\n${lines}\n\n¿Intercambiamos? Mi código: ${state.profile?.shareCode || ''}`);
}
function sharePlain(text){
  if(navigator.share){ navigator.share({ title:'FiguScan Mundial', text }).catch(()=>openWhats(text)); }
  else openWhats(text);
}
function openWhats(text){ window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank'); }
async function shareImageSummary(){
  const blob = await makeSummaryImage();
  const file = new File([blob], 'figuscan-mundial.png', { type:'image/png' });
  const text = `⚽ FiguScan Mundial\nMi resumen de figuritas. Código: ${state.profile?.shareCode || ''}`;
  if(navigator.canShare && navigator.canShare({files:[file]})){
    try { await navigator.share({ files:[file], title:'FiguScan Mundial', text }); return; } catch(e){}
  }
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='figuscan-mundial.png'; a.click();
  openWhats(text + '\n\nTe descargué una imagen resumen para adjuntar.');
}
function makeSummaryImage(){
  return new Promise(resolve=>{
    const c=counts(); const canvas=document.createElement('canvas'); canvas.width=900; canvas.height=1300; const ctx=canvas.getContext('2d');
    const g=ctx.createLinearGradient(0,0,900,1300); g.addColorStop(0,'#0b5cff'); g.addColorStop(1,'#061b53'); ctx.fillStyle=g; ctx.fillRect(0,0,900,1300);
    ctx.fillStyle='rgba(255,255,255,.12)'; ctx.beginPath(); ctx.arc(790,140,170,0,7); ctx.fill();
    ctx.font='bold 86px system-ui'; ctx.fillStyle='white'; ctx.fillText('⚽ FiguScan',70,150);
    ctx.font='bold 48px system-ui'; ctx.fillStyle='#dbeafe'; ctx.fillText('Mundial',72,215);
    const boxes=[['✅ Tengo',c.tengo,'#16a34a'],['❌ Me faltan',c.faltante,'#dc2626'],['🔁 Repetidas',c.repetida,'#f97316']];
    boxes.forEach((b,i)=>{ const y=300+i*150; ctx.fillStyle='white'; roundRect(ctx,70,y,760,115,34,true); ctx.fillStyle=b[2]; ctx.font='bold 38px system-ui'; ctx.fillText(b[0],110,y+70); ctx.font='bold 56px system-ui'; ctx.textAlign='right'; ctx.fillText(String(b[1]),790,y+76); ctx.textAlign='left'; });
    ctx.fillStyle='white'; ctx.font='bold 42px system-ui'; ctx.fillText('Mis repetidas principales',70,820);
    ctx.font='30px system-ui'; ctx.fillStyle='#e0ecff'; const reps=state.stickers.filter(s=>s.status==='repetida').slice(0,8); (reps.length?reps:[{country:'Sin repetidas',number:'-'}]).forEach((s,i)=>ctx.fillText(`${i+1}. ${s.country} #${s.number}${s.player?' - '+s.player:''}`,90,880+i*46));
    ctx.font='bold 34px system-ui'; ctx.fillStyle='#facc15'; ctx.fillText(`Código: ${state.profile?.shareCode||''}`,70,1230);
    canvas.toBlob(resolve,'image/png');
  });
}
function roundRect(ctx,x,y,w,h,r,fill){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); if(fill)ctx.fill(); }

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js').catch(()=>null);
if (firebaseReady) auth.onAuthStateChanged(async user => { state.user=user; if(user) await loadData(); else { state.loading=false; render(); } });
else { state.loading=false; render(); }
