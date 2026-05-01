import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const firebaseConfig = window.FIGUSCAN_FIREBASE;
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(() => null);
}

const COUNTRIES = ['Argentina', 'Brasil', 'Uruguay', 'Francia', 'España', 'Alemania', 'Italia', 'Portugal', 'Inglaterra', 'México', 'Estados Unidos', 'Japón', 'Marruecos', 'Croacia', 'Países Bajos', 'Bélgica', 'Chile', 'Colombia', 'Ecuador', 'Paraguay', 'Perú'];
const FLAGS = { Argentina:'🇦🇷', Brasil:'🇧🇷', Uruguay:'🇺🇾', Francia:'🇫🇷', España:'🇪🇸', Alemania:'🇩🇪', Italia:'🇮🇹', Portugal:'🇵🇹', Inglaterra:'🏴', México:'🇲🇽', 'Estados Unidos':'🇺🇸', Japón:'🇯🇵', Marruecos:'🇲🇦', Croacia:'🇭🇷', 'Países Bajos':'🇳🇱', Bélgica:'🇧🇪', Chile:'🇨🇱', Colombia:'🇨🇴', Ecuador:'🇪🇨', Paraguay:'🇵🇾', Perú:'🇵🇪' };
const STATUS = { tengo: 'La tengo', faltante: 'Me falta', repetida: 'Repetida' };

let state = {
  user: null,
  profile: null,
  tab: 'home',
  stickers: [],
  friends: [],
  loading: true,
  message: '',
  scanImage: '',
  scanGuess: null,
  selectedFriend: null
};

const $ = (id) => document.getElementById(id);
const root = $('app');

function uidCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function esc(v='') {
  return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function setMsg(text, type='success') {
  state.message = text ? `<div class="${type}">${esc(text)}</div>` : '';
  render();
  if (text) setTimeout(() => { state.message = ''; render(); }, 3600);
}

function translateAuthError(err) {
  const code = err?.code || '';
  const map = {
    'auth/email-already-in-use': 'Ese email ya tiene cuenta. Probá entrar.',
    'auth/invalid-email': 'El email no parece válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/network-request-failed': 'No hay conexión a internet.'
  };
  return map[code] || 'Algo salió mal. Probá de nuevo.';
}

async function ensureProfile(user, name) {
  const ref = doc(db, 'profiles', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  const profile = {
    userId: user.uid,
    name: name || user.displayName || user.email?.split('@')[0] || 'Coleccionista',
    email: user.email || '',
    shareCode: uidCode(),
    createdAt: serverTimestamp()
  };
  await setDoc(ref, profile);
  return { id: user.uid, ...profile };
}

async function loadAll() {
  if (!state.user) return;
  const stickersQ = query(collection(db, 'stickers'), where('userId', '==', state.user.uid));
  const friendsQ = query(collection(db, 'friends'), where('userId', '==', state.user.uid));
  const [stickersSnap, friendsSnap] = await Promise.all([getDocs(stickersQ), getDocs(friendsQ)]);
  state.stickers = stickersSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  state.friends = [];
  for (const f of friendsSnap.docs) {
    const friend = { id: f.id, ...f.data() };
    const p = await getDoc(doc(db, 'profiles', friend.friendUserId));
    state.friends.push({ ...friend, profile: p.exists() ? p.data() : { name: 'Amigo', shareCode: '' } });
  }
}

onAuthStateChanged(auth, async (user) => {
  state.user = user;
  state.loading = true;
  render();
  try {
    if (user) {
      state.profile = await ensureProfile(user);
      await loadAll();
    } else {
      state.profile = null;
      state.stickers = [];
      state.friends = [];
    }
  } catch (e) {
    console.error(e);
    state.message = `<div class="error">No pude cargar tus datos. Revisá conexión o reglas de Firebase.</div>`;
  }
  state.loading = false;
  render();
});

function nav(tab) { state.tab = tab; state.message = ''; render(); }
window.nav = nav;

async function signup(e) {
  e.preventDefault();
  const name = $('name').value.trim();
  const email = $('email').value.trim();
  const pass = $('password').value;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    state.profile = await ensureProfile(cred.user, name);
    await loadAll();
    nav('home');
  } catch (err) { setMsg(translateAuthError(err), 'error'); }
}
window.signup = signup;

async function login(e) {
  e.preventDefault();
  try { await signInWithEmailAndPassword(auth, $('email').value.trim(), $('password').value); }
  catch (err) { setMsg(translateAuthError(err), 'error'); }
}
window.login = login;

async function logout() { await signOut(auth); }
window.logout = logout;

function authScreen() {
  return `<div class="auth-page"><div class="auth-card">
    <span class="pill">App por link</span>
    <h1 class="auth-title">FiguScan Mundial</h1>
    <p class="muted">Guardá tus figuritas, repetidas y faltantes. Compartí con amigos por WhatsApp.</p>
    ${state.message}
    <form id="authForm" onsubmit="signup(event)">
      <label>Tu nombre</label><input id="name" class="input" placeholder="Lucas" autocomplete="name" />
      <label>Email</label><input id="email" class="input" type="email" placeholder="tu@email.com" autocomplete="email" required />
      <label>Contraseña</label><input id="password" class="input" type="password" placeholder="Mínimo 6 caracteres" autocomplete="current-password" required />
      <button class="primary" type="submit">Crear cuenta</button>
      <button class="secondary" type="button" onclick="login(event)">Ya tengo cuenta, entrar</button>
    </form>
  </div></div>`;
}

function shell(content) {
  const tabs = [
    ['home','🏠','Inicio'], ['scan','📷','Escanear'], ['album','📚','Álbum'], ['friends','🤝','Amigos'], ['profile','👤','Perfil']
  ];
  return `<div class="app-shell">
    <div class="hero"><div class="hero-row"><div><h1>FiguScan Mundial</h1><p>${esc(state.profile?.name || 'Coleccionista')}, organizá tus figuritas fácil.</p></div><div class="logo">⚽</div></div></div>
    <div class="wrap">${state.message}${content}</div>
    <nav class="tabs">${tabs.map(t => `<button class="tab ${state.tab===t[0]?'active':''}" onclick="nav('${t[0]}')"><span class="ico">${t[1]}</span><span>${t[2]}</span></button>`).join('')}</nav>
  </div>`;
}

function home() {
  const have = state.stickers.filter(s => s.status === 'tengo').length;
  const miss = state.stickers.filter(s => s.status === 'faltante').length;
  const dup = state.stickers.filter(s => s.status === 'repetida').length;
  return `<div class="card"><h2>Resumen</h2><p class="muted">Tenés ${state.stickers.length} figuritas cargadas.</p><div class="grid">
    <button class="action blue" onclick="nav('scan')"><span>📷</span>Escanear figurita</button>
    <button class="action green" onclick="nav('album')"><span>✅</span>Tengo: ${have}</button>
    <button class="action red" onclick="nav('missing')"><span>❌</span>Me faltan: ${miss}</button>
    <button class="action orange" onclick="nav('duplicates')"><span>🔁</span>Repetidas: ${dup}</button>
  </div></div>
  <div class="card"><h3>Cómo usarla</h3><p>1. Cargá una figurita.<br>2. Marcá si la tenés, falta o repetida.<br>3. Compartí por WhatsApp.<br>4. Agregá amigos con código.</p></div>`;
}

function statusSelect(value='tengo') {
  return `<select id="status"><option value="tengo" ${value==='tengo'?'selected':''}>La tengo</option><option value="faltante" ${value==='faltante'?'selected':''}>Me falta</option><option value="repetida" ${value==='repetida'?'selected':''}>Repetida</option></select>`;
}
function countryOptions(selected='Argentina') {
  return COUNTRIES.map(c => `<option value="${esc(c)}" ${c===selected?'selected':''}>${FLAGS[c] || '⚽'} ${esc(c)}</option>`).join('');
}

function scanner() {
  const guess = state.scanGuess || {};
  return `<div class="card"><h2>Escanear figurita</h2><p class="muted">Sacale foto. Si no reconoce, la cargás a mano.</p>
    <div class="filebox"><strong>📷 Apuntar a la figurita</strong><br><span class="muted small">Usá una foto clara, con buena luz.</span>
    <input class="input" type="file" accept="image/*" capture="environment" onchange="handlePhoto(event)" /></div>
    ${state.scanImage ? `<img class="preview" src="${state.scanImage}" alt="Foto de figurita" />` : ''}
    ${state.scanImage ? `<button class="secondary" onclick="tryRecognize()">Intentar reconocer</button>` : ''}
    <form onsubmit="saveSticker(event)">
      <label>Año del Mundial</label><input id="year" class="input" inputmode="numeric" placeholder="2026" value="${esc(guess.year || '')}" />
      <label>País</label><select id="country">${countryOptions(guess.country || 'Argentina')}</select>
      <label>Número</label><input id="number" class="input" inputmode="numeric" placeholder="10" value="${esc(guess.number || '')}" required />
      <label>Jugador o descripción</label><input id="player" class="input" placeholder="Messi, arquero, escudo..." value="${esc(guess.player || '')}" />
      <label>Estado</label>${statusSelect(guess.status || 'tengo')}
      <label>Cantidad</label><input id="quantity" class="input" type="number" min="1" value="${esc(guess.quantity || 1)}" />
      <button class="primary" type="submit">Guardar figurita</button>
    </form></div>`;
}

async function handlePhoto(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  state.scanImage = await compressImage(file);
  state.scanGuess = null;
  render();
}
window.handlePhoto = handlePhoto;

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const max = 700;
      const scale = Math.min(max / img.width, max / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', .58));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

async function tryRecognize() {
  if (!state.scanImage) return;
  setMsg('Estoy mirando la figurita. Puede tardar unos segundos...', 'notice');
  try {
    if (!window.Tesseract) throw new Error('No OCR');
    const result = await window.Tesseract.recognize(state.scanImage, 'eng+spa');
    const text = (result?.data?.text || '').replace(/\s+/g, ' ').trim();
    const number = (text.match(/\b\d{1,3}\b/) || [])[0] || '';
    const upper = text.toLowerCase();
    const country = COUNTRIES.find(c => upper.includes(c.toLowerCase())) || 'Argentina';
    state.scanGuess = { number, country, player: text.slice(0, 40) };
    state.message = `<div class="notice">Creo que encontré algunos datos. Revisalos antes de guardar.</div>`;
    render();
  } catch (e) {
    state.message = `<div class="notice">No la pude reconocer bien. Cargala a mano.</div>`;
    render();
  }
}
window.tryRecognize = tryRecognize;

async function saveSticker(e) {
  e.preventDefault();
  const status = $('status').value;
  const data = {
    userId: state.user.uid,
    year: $('year').value.trim() || '2026',
    country: $('country').value,
    number: $('number').value.trim(),
    player: $('player').value.trim(),
    status,
    quantity: status === 'repetida' ? Math.max(2, Number($('quantity').value || 2)) : 1,
    image: state.scanImage || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await addDoc(collection(db, 'stickers'), data);
  state.scanImage = '';
  state.scanGuess = null;
  await loadAll();
  setMsg('Figurita guardada.');
  nav('album');
}
window.saveSticker = saveSticker;

function stickerCard(s) {
  const flag = FLAGS[s.country] || '⚽';
  const img = s.image ? `<img src="${s.image}" alt="" />` : `<div class="placeholder">${flag}<br><b>#${esc(s.number)}</b></div>`;
  return `<div class="sticker ${s.status}"><div class="photo">${img}</div><div class="sticker-body">
    <p class="sticker-title">${flag} #${esc(s.number)}</p>
    <div class="muted small">${esc(s.country)} ${s.year ? '· ' + esc(s.year) : ''}</div>
    ${s.player ? `<div class="small"><b>${esc(s.player)}</b></div>` : ''}
    <span class="badge ${s.status}">${STATUS[s.status]}${s.status==='repetida' && s.quantity>1 ? ' x'+s.quantity : ''}</span>
    <div class="mini-actions">
      <button onclick="changeStatus('${s.id}','tengo')">✅</button><button onclick="changeStatus('${s.id}','faltante')">❌</button><button onclick="changeStatus('${s.id}','repetida')">🔁</button><button onclick="removeSticker('${s.id}')">🗑️</button>
    </div></div></div>`;
}

async function changeStatus(id, status) {
  const patch = { status, quantity: status === 'repetida' ? 2 : 1, updatedAt: serverTimestamp() };
  await updateDoc(doc(db, 'stickers', id), patch);
  await loadAll(); render();
}
window.changeStatus = changeStatus;
async function removeSticker(id) {
  if (!confirm('¿Eliminar esta figurita?')) return;
  await deleteDoc(doc(db, 'stickers', id));
  await loadAll(); render();
}
window.removeSticker = removeSticker;

function album(filter='all') {
  let list = state.stickers;
  if (filter !== 'all') list = list.filter(s => s.status === filter);
  return `<div class="card"><h2>${filter==='all'?'Mi álbum':STATUS[filter]}</h2><div class="searchbar"><select onchange="nav(this.value)"><option value="album" ${state.tab==='album'?'selected':''}>Todas</option><option value="missing" ${state.tab==='missing'?'selected':''}>Me faltan</option><option value="duplicates" ${state.tab==='duplicates'?'selected':''}>Repetidas</option></select></div>
  ${list.length ? `<div class="sticker-grid">${list.map(stickerCard).join('')}</div>` : `<div class="empty"><div class="big">📭</div><b>No hay figuritas acá.</b><p>Cargá la primera desde Escanear.</p></div>`}
  ${filter!=='all' ? `<button class="secondary" onclick="shareList('${filter}')">Compartir por WhatsApp</button>` : ''}</div>`;
}

function buildListText(filter) {
  const list = state.stickers.filter(s => s.status === filter);
  if (!list.length) return filter === 'faltante' ? 'Todavía no cargué mis faltantes.' : 'Todavía no cargué mis repetidas.';
  const title = filter === 'faltante' ? 'Me faltan estas figuritas:' : 'Tengo repetidas estas figuritas:';
  return `${title}\n` + list.map(s => `- ${s.country} #${s.number}${s.player ? ' ' + s.player : ''}${s.status==='repetida' ? ' x' + (s.quantity||2) : ''}`).join('\n') + `\n\nMi código FiguScan: ${state.profile?.shareCode || ''}`;
}
async function shareText(text) {
  if (navigator.share) {
    try { await navigator.share({ text }); return; } catch {}
  }
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}
function shareList(filter) { shareText(buildListText(filter)); }
window.shareList = shareList;

function profile() {
  return `<div class="card"><h2>Mi perfil</h2><p class="muted">Compartí este código para que te agreguen como amigo.</p><p class="code">${esc(state.profile?.shareCode || '')}</p>
  <button class="primary" onclick="shareText('Sumame en FiguScan Mundial. Mi código es: ${esc(state.profile?.shareCode || '')}')">Compartir mi código</button>
  <button class="secondary" onclick="logout()">Cerrar sesión</button></div>
  <div class="card"><h3>Instalar como app</h3><p>En Android: abrí el link en Chrome, tocá los tres puntitos y elegí “Agregar a pantalla principal”.</p><p>En iPhone: abrí en Safari, Compartir y “Agregar a pantalla de inicio”.</p></div>`;
}

async function addFriend(e) {
  e.preventDefault();
  const code = $('friendCode').value.trim().toUpperCase();
  if (!code) return;
  const q = query(collection(db, 'profiles'), where('shareCode', '==', code));
  const snap = await getDocs(q);
  if (snap.empty) return setMsg('No encontré ese código.', 'error');
  const friendDoc = snap.docs[0];
  if (friendDoc.id === state.user.uid) return setMsg('Ese es tu propio código.', 'error');
  const id = `${state.user.uid}_${friendDoc.id}`;
  await setDoc(doc(db, 'friends', id), { userId: state.user.uid, friendUserId: friendDoc.id, createdAt: serverTimestamp() });
  await loadAll();
  setMsg('Amigo agregado.');
}
window.addFriend = addFriend;

async function compareFriend(friendUserId) {
  const q = query(collection(db, 'stickers'), where('userId', '==', friendUserId));
  const snap = await getDocs(q);
  const friendStickers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const myDup = state.stickers.filter(s => s.status === 'repetida');
  const myMiss = state.stickers.filter(s => s.status === 'faltante');
  const friendDup = friendStickers.filter(s => s.status === 'repetida');
  const friendMiss = friendStickers.filter(s => s.status === 'faltante');
  const give = myDup.filter(a => friendMiss.some(b => b.country === a.country && b.number === a.number));
  const receive = friendDup.filter(a => myMiss.some(b => b.country === a.country && b.number === a.number));
  state.selectedFriend = { give, receive };
  render();
}
window.compareFriend = compareFriend;

function friends() {
  const comp = state.selectedFriend;
  return `<div class="card"><h2>Amigos</h2><p class="muted">Agregá amigos con su código y compará intercambios.</p>
  <form onsubmit="addFriend(event)"><label>Código de amigo</label><input id="friendCode" class="input" placeholder="Ej: ABCD1234" /><button class="primary">Agregar amigo</button></form></div>
  <div class="card"><h3>Mi código</h3><p class="code">${esc(state.profile?.shareCode || '')}</p></div>
  <div class="card"><h3>Lista de amigos</h3>${state.friends.length ? state.friends.map(f => `<div class="card"><b>${esc(f.profile?.name || 'Amigo')}</b><div class="muted small">Código: ${esc(f.profile?.shareCode || '')}</div><button class="secondary" onclick="compareFriend('${f.friendUserId}')">Ver intercambios</button></div>`).join('') : '<div class="empty"><div class="big">🤝</div><b>Aún no agregaste amigos.</b></div>'}</div>
  ${comp ? `<div class="card"><h3>Intercambios posibles</h3><p><b>Vos podés dar:</b></p>${comp.give.length ? comp.give.map(s=>`<p>✅ ${esc(s.country)} #${esc(s.number)}</p>`).join('') : '<p class="muted">No hay coincidencias para dar.</p>'}<p><b>Tu amigo puede darte:</b></p>${comp.receive.length ? comp.receive.map(s=>`<p>🎁 ${esc(s.country)} #${esc(s.number)}</p>`).join('') : '<p class="muted">No hay coincidencias para recibir.</p>'}<button class="primary" onclick="shareText('Tengo posibles intercambios en FiguScan Mundial. Revisemos nuestras figuritas.')">Compartir por WhatsApp</button></div>` : ''}`;
}

function render() {
  if (state.loading) { root.innerHTML = `<div class="auth-page"><div class="auth-card"><h1 class="auth-title">FiguScan Mundial</h1><p>Cargando...</p></div></div>`; return; }
  if (!state.user) { root.innerHTML = authScreen(); return; }
  let content = '';
  if (state.tab === 'home') content = home();
  if (state.tab === 'scan') content = scanner();
  if (state.tab === 'album') content = album('all');
  if (state.tab === 'missing') content = album('faltante');
  if (state.tab === 'duplicates') content = album('repetida');
  if (state.tab === 'friends') content = friends();
  if (state.tab === 'profile') content = profile();
  root.innerHTML = shell(content);
}

window.shareText = shareText;
render();
