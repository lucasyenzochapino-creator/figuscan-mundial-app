import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import { getFirestore, collection, addDoc, setDoc, updateDoc, deleteDoc, getDoc, getDocs, doc, query, where, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

const firebaseConfig = window.FIGUSCAN_FIREBASE;
const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').catch(() => null);
}

const COUNTRIES = ['Argentina','Brasil','Uruguay','Francia','España','Alemania','Italia','Portugal','Inglaterra','México','Estados Unidos','Japón','Marruecos','Croacia','Países Bajos','Bélgica','Chile','Colombia','Ecuador','Paraguay','Perú','Canadá','Australia','Suiza','Dinamarca','Polonia','Senegal','Corea del Sur','Arabia Saudita','Catar'];
const FLAGS = { Argentina:'🇦🇷', Brasil:'🇧🇷', Uruguay:'🇺🇾', Francia:'🇫🇷', España:'🇪🇸', Alemania:'🇩🇪', Italia:'🇮🇹', Portugal:'🇵🇹', Inglaterra:'🏴', México:'🇲🇽', 'Estados Unidos':'🇺🇸', Japón:'🇯🇵', Marruecos:'🇲🇦', Croacia:'🇭🇷', 'Países Bajos':'🇳🇱', Bélgica:'🇧🇪', Chile:'🇨🇱', Colombia:'🇨🇴', Ecuador:'🇪🇨', Paraguay:'🇵🇾', Perú:'🇵🇪', Canadá:'🇨🇦', Australia:'🇦🇺', Suiza:'🇨🇭', Dinamarca:'🇩🇰', Polonia:'🇵🇱', Senegal:'🇸🇳', 'Corea del Sur':'🇰🇷', 'Arabia Saudita':'🇸🇦', Catar:'🇶🇦' };
const STATUS = { tengo:'La tengo', faltante:'Me falta', repetida:'Repetida' };
const PLAYERS = {
  messi:'Argentina', lionel:'Argentina', neymar:'Brasil', vinicius:'Brasil', mbappe:'Francia', kylian:'Francia', griezmann:'Francia', cristiano:'Portugal', ronaldo:'Portugal', kane:'Inglaterra', bellingham:'Inglaterra', modric:'Croacia', suarez:'Uruguay', valverde:'Uruguay', morata:'España', musiala:'Alemania', neuer:'Alemania', lewandowski:'Polonia'
};

let state = {
  user:null, profile:null, tab:'home', stickers:[], friends:[], loading:true, message:'', messageType:'success', scanImage:'', scanGuess:null, scanText:'', selectedFriend:null, saving:false, recognizing:false
};

const root = document.getElementById('app');
const $ = (id) => document.getElementById(id);

function esc(v='') { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function uidCode(){ const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let out=''; for(let i=0;i<8;i++) out+=chars[Math.floor(Math.random()*chars.length)]; return out; }
function localKey(){ return 'figuscan_local_' + (state.user?.uid || 'anon'); }
function getLocalStickers(){ try { return JSON.parse(localStorage.getItem(localKey()) || '[]'); } catch { return []; } }
function setLocalStickers(list){ localStorage.setItem(localKey(), JSON.stringify(list)); }
function toast(text,type='success'){ state.message=text; state.messageType=type; render(); if(text) setTimeout(()=>{ if(state.message===text){ state.message=''; render(); } }, 4200); }
function msgHtml(){ return state.message ? `<div class="${state.messageType}">${esc(state.message)}</div>` : ''; }
function translateAuthError(err){ const code=err?.code||''; const map={ 'auth/email-already-in-use':'Ese email ya tiene cuenta. Tocá “Ya tengo cuenta”.', 'auth/invalid-email':'El email no parece válido.', 'auth/weak-password':'La contraseña debe tener al menos 6 caracteres.', 'auth/invalid-credential':'Email o contraseña incorrectos.', 'auth/network-request-failed':'No hay conexión a internet.' }; return map[code] || 'Algo salió mal. Probá de nuevo.'; }

async function ensureProfile(user, name){
  const ref = doc(db,'profiles',user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id:snap.id, ...snap.data() };
  const profile = { userId:user.uid, name:name || user.displayName || user.email?.split('@')[0] || 'Coleccionista', email:user.email || '', shareCode:uidCode(), createdAt:serverTimestamp() };
  await setDoc(ref, profile);
  return { id:user.uid, ...profile };
}

async function loadAll(){
  if (!state.user) return;
  let cloud = [];
  try {
    const q = query(collection(db,'stickers'), where('userId','==',state.user.uid));
    const snap = await getDocs(q);
    cloud = snap.docs.map(d => ({ id:d.id, _cloud:true, ...d.data() }));
  } catch (e) {
    console.error('No pude leer Firestore', e);
    toast('No pude conectar con la nube. Te muestro lo guardado en este teléfono.', 'notice');
  }
  const local = getLocalStickers();
  const ids = new Set(cloud.map(s => s.id));
  state.stickers = [...cloud, ...local.filter(s => !ids.has(s.id))].sort((a,b) => (b.createdAtMs || b.createdAt?.seconds || 0) - (a.createdAtMs || a.createdAt?.seconds || 0));

  try {
    const friendsQ = query(collection(db,'friends'), where('userId','==',state.user.uid));
    const friendsSnap = await getDocs(friendsQ);
    state.friends = [];
    for (const f of friendsSnap.docs) {
      const friend = { id:f.id, ...f.data() };
      const p = await getDoc(doc(db,'profiles',friend.friendUserId));
      state.friends.push({ ...friend, profile: p.exists() ? p.data() : { name:'Amigo', shareCode:'' } });
    }
  } catch (e) { state.friends = []; }
}

onAuthStateChanged(auth, async (user) => {
  state.user = user; state.loading = true; render();
  try {
    if (user) { state.profile = await ensureProfile(user); await loadAll(); }
    else { state.profile=null; state.stickers=[]; state.friends=[]; }
  } catch (e) { console.error(e); state.message='No pude cargar tus datos. Revisá conexión o reglas de Firebase.'; state.messageType='error'; }
  state.loading = false; render();
});

function nav(tab){ state.tab=tab; state.message=''; state.selectedFriend=null; render(); }
window.nav = nav;

async function signup(e){ e.preventDefault(); const name=$('name').value.trim(); const email=$('email').value.trim(); const pass=$('password').value; try{ const cred=await createUserWithEmailAndPassword(auth,email,pass); await updateProfile(cred.user,{ displayName:name }); state.profile=await ensureProfile(cred.user,name); await loadAll(); nav('home'); }catch(err){ toast(translateAuthError(err),'error'); } }
async function login(e){ e.preventDefault(); try{ await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value); }catch(err){ toast(translateAuthError(err),'error'); } }
async function logout(){ await signOut(auth); }
window.signup=signup; window.login=login; window.logout=logout;

function authScreen(){ return `<div class="auth-page"><div class="auth-card"><span class="pill">⚽ Mundial · App por link</span><h1 class="auth-title">FiguScan Mundial</h1><p class="auth-sub muted">Tu álbum, tus repetidas y tus faltantes en una app simple.</p>${msgHtml()}<form onsubmit="signup(event)"><label class="field">Tu nombre</label><input id="name" class="input" placeholder="Lucas" autocomplete="name"/><label class="field">Email</label><input id="email" class="input" type="email" placeholder="tu@email.com" autocomplete="email" required/><label class="field">Contraseña</label><input id="password" class="input" type="password" placeholder="Mínimo 6 caracteres" autocomplete="current-password" required/><button class="primary">Crear cuenta</button><button class="secondary" type="button" onclick="login(event)">Ya tengo cuenta, entrar</button></form><p class="version">Versión 3 · guardado reforzado</p></div></div>`; }

function shell(content){ const tabs=[['home','🏠','Inicio'],['scan','📷','Escanear'],['album','📚','Álbum'],['friends','🤝','Amigos'],['profile','👤','Perfil']]; return `<div class="app-shell"><div class="hero"><div class="hero-row"><div><h1>FiguScan Mundial</h1><p>${esc(state.profile?.name || 'Coleccionista')}, armá tu álbum ganador.</p></div><div class="logo">⚽</div></div></div><div class="wrap">${msgHtml()}${content}</div><nav class="tabs">${tabs.map(t=>`<button class="tab ${state.tab===t[0]?'active':''}" onclick="nav('${t[0]}')"><span class="ico">${t[1]}</span><span>${t[2]}</span></button>`).join('')}</nav></div>`; }

function home(){ const have=state.stickers.filter(s=>s.status==='tengo').length, miss=state.stickers.filter(s=>s.status==='faltante').length, dup=state.stickers.filter(s=>s.status==='repetida').length; return `<div class="card"><span class="pill">📌 Resumen rápido</span><h2>Tu colección</h2><p class="muted">Tenés ${state.stickers.length} figuritas cargadas.</p><div class="stats-row"><div class="stat green"><b>${have}</b><span>TENGO</span></div><div class="stat red"><b>${miss}</b><span>FALTAN</span></div><div class="stat orange"><b>${dup}</b><span>REPETIDAS</span></div></div><div class="grid" style="margin-top:14px"><button class="action blue" onclick="nav('scan')"><span>📷</span>Escanear</button><button class="action green" onclick="nav('album')"><span>📚</span>Mi álbum</button><button class="action red" onclick="nav('missing')"><span>❌</span>Faltantes</button><button class="action orange" onclick="nav('duplicates')"><span>🔁</span>Repetidas</button></div></div><div class="card"><h3>Modo simple</h3><div class="scan-tips"><div class="tip">1. Sacá foto</div><div class="tip">2. Revisá datos</div><div class="tip">3. Guardá</div><div class="tip">4. Compartí</div></div></div>`; }
function statusSelect(value='tengo'){ return `<select id="status"><option value="tengo" ${value==='tengo'?'selected':''}>✅ La tengo</option><option value="faltante" ${value==='faltante'?'selected':''}>❌ Me falta</option><option value="repetida" ${value==='repetida'?'selected':''}>🔁 Repetida</option></select>`; }
function countryOptions(selected='Argentina'){ return COUNTRIES.map(c=>`<option value="${esc(c)}" ${c===selected?'selected':''}>${FLAGS[c]||'⚽'} ${esc(c)}</option>`).join(''); }

function scanner(){ const g=state.scanGuess || {}; return `<div class="card"><span class="pill">📷 Cámara</span><h2>Escanear figurita</h2><p class="muted">Sacale una foto clara. Si no la reconoce, igual podés guardarla a mano.</p><div class="scan-tips"><div class="tip">Buena luz</div><div class="tip">Figurita derecha</div><div class="tip">Texto visible</div><div class="tip">Sin reflejo</div></div><div class="filebox"><strong>📸 Tocar para sacar foto</strong><br><span class="muted small">También podés elegir una foto de galería.</span><input type="file" accept="image/*" capture="environment" onchange="handlePhoto(event)" /></div>${state.scanImage?`<img class="preview" src="${state.scanImage}" alt="Foto de figurita"/><button class="primary" onclick="tryRecognize()" ${state.recognizing?'disabled':''}>${state.recognizing?'Mirando figurita...':'Reconocer datos visibles'}</button>`:''}${state.scanGuess?`<div class="guess-box">Encontré una sugerencia. Revisala antes de guardar.<div class="confidence"><div style="width:${Math.max(20, Math.min(95, state.scanGuess.confidence || 38))}%"></div></div><p class="small">Confianza aproximada: ${Math.round(state.scanGuess.confidence || 38)}%</p></div>`:''}<form onsubmit="saveSticker(event)"><label class="field">Año del Mundial</label><input id="year" class="input" inputmode="numeric" placeholder="2026" value="${esc(g.year||'2026')}"/><label class="field">País</label><select id="country">${countryOptions(g.country||'Argentina')}</select><label class="field">Número de figurita</label><input id="number" class="input" inputmode="numeric" placeholder="10" value="${esc(g.number||'')}" required/><label class="field">Jugador o descripción</label><input id="player" class="input" placeholder="Messi, escudo, arquero..." value="${esc(g.player||'')}"/><label class="field">Estado</label>${statusSelect(g.status||'tengo')}<label class="field">Cantidad</label><input id="quantity" class="input" type="number" min="1" value="${esc(g.quantity||1)}"/><button class="primary" ${state.saving?'disabled':''}>${state.saving?'Guardando...':'Guardar figurita'}</button></form><div class="warn">Aclaración: para reconocer cualquier figurita de cualquier año de forma perfecta hace falta una base de imágenes. Esta versión reconoce texto visible y aprende con lo que cargás.</div></div>`; }

async function handlePhoto(e){ const file=e.target.files?.[0]; if(!file) return; try{ state.scanImage=await compressImage(file, 460, .42); state.scanGuess=null; state.scanText=''; toast('Foto lista. Ahora tocá “Reconocer datos visibles”.','success'); render(); }catch{ toast('No pude leer la foto. Probá otra imagen.','error'); } }
window.handlePhoto=handlePhoto;
function compressImage(file, max=460, quality=.42){ return new Promise((resolve,reject)=>{ const img=new Image(); img.onload=()=>{ const scale=Math.min(max/img.width,max/img.height,1); const canvas=document.createElement('canvas'); canvas.width=Math.max(1,Math.round(img.width*scale)); canvas.height=Math.max(1,Math.round(img.height*scale)); const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0,canvas.width,canvas.height); let out=canvas.toDataURL('image/jpeg',quality); if(out.length>700000) out=canvas.toDataURL('image/jpeg',.30); resolve(out); URL.revokeObjectURL(img.src); }; img.onerror=reject; img.src=URL.createObjectURL(file); }); }
async function preprocessForOCR(dataUrl){ return new Promise((resolve,reject)=>{ const img=new Image(); img.onload=()=>{ const canvas=document.createElement('canvas'); canvas.width=img.width; canvas.height=img.height; const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0); const data=ctx.getImageData(0,0,canvas.width,canvas.height); for(let i=0;i<data.data.length;i+=4){ const avg=(data.data[i]*.299+data.data[i+1]*.587+data.data[i+2]*.114); const v=avg>142?255:0; data.data[i]=data.data[i+1]=data.data[i+2]=v; } ctx.putImageData(data,0,0); resolve(canvas.toDataURL('image/png')); }; img.onerror=reject; img.src=dataUrl; }); }
function parseStickerText(text){ const clean=(text||'').replace(/\s+/g,' ').trim(); const lower=clean.toLowerCase(); let country=COUNTRIES.find(c=>lower.includes(c.toLowerCase())); for(const key of Object.keys(PLAYERS)){ if(lower.includes(key)){ country=PLAYERS[key]; break; } } const nums=(clean.match(/\b\d{1,3}\b/g)||[]).map(n=>Number(n)).filter(n=>n>0 && n<700); const number=nums.length ? String(nums[0]) : ''; const years=(clean.match(/20(18|22|26)|19(86|90|94|98)/g)||[]); const playerGuess=Object.keys(PLAYERS).find(k=>lower.includes(k)); const player=playerGuess ? playerGuess.charAt(0).toUpperCase()+playerGuess.slice(1) : clean.slice(0,44); let confidence=20; if(number) confidence+=30; if(country) confidence+=30; if(playerGuess) confidence+=18; if(years[0]) confidence+=8; return { number, country: country || 'Argentina', year: years[0] || '2026', player, confidence, raw: clean }; }
async function tryRecognize(){ if(!state.scanImage) return; state.recognizing=true; toast('Estoy mirando la figurita. Puede tardar unos segundos...','notice'); render(); try{ if(!window.Tesseract) throw new Error('OCR no cargó'); const processed=await preprocessForOCR(state.scanImage); const [r1,r2]=await Promise.allSettled([window.Tesseract.recognize(state.scanImage,'eng+spa'), window.Tesseract.recognize(processed,'eng+spa')]); const t1=r1.value?.data?.text||''; const t2=r2.value?.data?.text||''; const parsed=parseStickerText(`${t1} ${t2}`); state.scanGuess=parsed; state.scanText=parsed.raw; state.recognizing=false; toast(parsed.number || parsed.country ? 'Encontré algunos datos. Revisalos antes de guardar.' : 'No la pude reconocer bien. Cargala a mano.', parsed.number ? 'success':'notice'); render(); }catch(e){ console.error(e); state.recognizing=false; toast('No la pude reconocer bien. Cargala a mano.', 'notice'); render(); } }
window.tryRecognize=tryRecognize;

async function saveSticker(e){ e.preventDefault(); if(!state.user){ toast('Primero tenés que entrar con tu cuenta.','error'); return; } const status=$('status').value; const now=Date.now(); const data={ userId:state.user.uid, year:$('year').value.trim()||'2026', country:$('country').value, number:$('number').value.trim(), player:$('player').value.trim(), status, quantity:status==='repetida'?Math.max(2,Number($('quantity').value||2)):1, image:state.scanImage||'', createdAt:serverTimestamp(), updatedAt:serverTimestamp(), createdAtMs:now };
  if(!data.number){ toast('Falta el número de la figurita.','error'); return; }
  state.saving=true; render();
  try{ const ref=await addDoc(collection(db,'stickers'),data); state.scanImage=''; state.scanGuess=null; await loadAll(); state.saving=false; toast('Figurita guardada en tu cuenta.','success'); nav('album'); }
  catch(err){ console.error('Error guardando en Firestore', err); const local={ ...data, id:'local_'+now, _local:true, createdAt:null, updatedAt:null, createdAtMs:now }; const list=getLocalStickers(); list.unshift(local); setLocalStickers(list); state.scanImage=''; state.scanGuess=null; await loadAll(); state.saving=false; toast('La guardé en este teléfono. La nube falló: revisá permisos de Firebase.', 'notice'); nav('album'); }
}
window.saveSticker=saveSticker;

function stickerCard(s){ const flag=FLAGS[s.country]||'⚽'; const img=s.image?`<img src="${s.image}" alt=""/>`:`<div class="placeholder">${flag}<br><b>#${esc(s.number)}</b></div>`; return `<div class="sticker ${s.status}"><div class="photo">${img}</div><div class="sticker-body"><p class="sticker-title">${flag} #${esc(s.number)}</p><div class="muted small">${esc(s.country)} · ${esc(s.year||'2026')}</div>${s.player?`<div class="small"><b>${esc(s.player)}</b></div>`:''}<span class="badge ${s.status}">${STATUS[s.status]}${s.status==='repetida' && s.quantity>1?' x'+s.quantity:''}${s._local?' · teléfono':''}</span><div class="mini-actions"><button onclick="changeStatus('${s.id}','tengo')">✅</button><button onclick="changeStatus('${s.id}','faltante')">❌</button><button onclick="changeStatus('${s.id}','repetida')">🔁</button><button onclick="removeSticker('${s.id}')">🗑️</button></div></div></div>`; }
async function changeStatus(id,status){ const qty=status==='repetida'?2:1; if(id.startsWith('local_')){ const list=getLocalStickers().map(s=>s.id===id?{...s,status,quantity:qty,createdAtMs:s.createdAtMs||Date.now()}:s); setLocalStickers(list); await loadAll(); render(); return; } try{ await updateDoc(doc(db,'stickers',id),{ status, quantity:qty, updatedAt:serverTimestamp() }); await loadAll(); render(); }catch(e){ toast('No pude cambiar el estado. Revisá conexión.','error'); } }
async function removeSticker(id){ if(!confirm('¿Eliminar esta figurita?')) return; if(id.startsWith('local_')){ setLocalStickers(getLocalStickers().filter(s=>s.id!==id)); await loadAll(); render(); return; } try{ await deleteDoc(doc(db,'stickers',id)); await loadAll(); render(); }catch(e){ toast('No pude eliminarla.','error'); } }
window.changeStatus=changeStatus; window.removeSticker=removeSticker;
function album(filter='all'){ let list=state.stickers; if(filter!=='all') list=list.filter(s=>s.status===filter); return `<div class="card"><h2>${filter==='all'?'Mi álbum':STATUS[filter]}</h2><div class="searchbar"><select onchange="nav(this.value)"><option value="album" ${state.tab==='album'?'selected':''}>Todas</option><option value="missing" ${state.tab==='missing'?'selected':''}>Me faltan</option><option value="duplicates" ${state.tab==='duplicates'?'selected':''}>Repetidas</option></select></div>${list.length?`<div class="sticker-grid">${list.map(stickerCard).join('')}</div>`:`<div class="empty"><div class="big">📭</div><b>No hay figuritas acá.</b><p>Cargá la primera desde Escanear.</p></div>`}${filter!=='all'?`<button class="primary" onclick="shareList('${filter}')">Compartir por WhatsApp</button>`:''}</div>`; }
function buildListText(filter){ const list=state.stickers.filter(s=>s.status===filter); if(!list.length) return filter==='faltante'?'Todavía no cargué mis faltantes.':'Todavía no cargué mis repetidas.'; const title=filter==='faltante'?'Me faltan estas figuritas:':'Tengo repetidas estas figuritas:'; return `${title}\n`+list.map(s=>`- ${s.country} #${s.number}${s.player?' '+s.player:''}${s.status==='repetida'?' x'+(s.quantity||2):''}`).join('\n')+`\n\nMi código FiguScan: ${state.profile?.shareCode||''}`; }
async function shareText(text){ if(navigator.share){ try{ await navigator.share({ text }); return; }catch{} } window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank'); }
function shareList(filter){ shareText(buildListText(filter)); }
window.shareText=shareText; window.shareList=shareList;
function profile(){ return `<div class="card"><h2>Mi perfil</h2><p class="muted">Compartí este código para que te agreguen como amigo.</p><p class="code">${esc(state.profile?.shareCode||'')}</p><button class="primary" onclick="shareText('Sumame en FiguScan Mundial. Mi código es: ${esc(state.profile?.shareCode||'')}')">Compartir mi código</button><button class="secondary" onclick="logout()">Cerrar sesión</button></div><div class="card"><h3>Instalar como app</h3><p>Android: Chrome → tres puntitos → Agregar a pantalla principal.</p><p>iPhone: Safari → Compartir → Agregar a pantalla de inicio.</p></div>`; }
async function addFriend(e){ e.preventDefault(); const code=$('friendCode').value.trim().toUpperCase(); if(!code) return; try{ const q=query(collection(db,'profiles'),where('shareCode','==',code)); const snap=await getDocs(q); if(snap.empty) return toast('No encontré ese código.','error'); const friendDoc=snap.docs[0]; if(friendDoc.id===state.user.uid) return toast('Ese es tu propio código.','error'); const id=`${state.user.uid}_${friendDoc.id}`; await setDoc(doc(db,'friends',id),{ userId:state.user.uid, friendUserId:friendDoc.id, createdAt:serverTimestamp() }); await loadAll(); toast('Amigo agregado.','success'); }catch(e){ toast('No pude agregar amigo. Revisá conexión.','error'); } }
async function compareFriend(friendUserId){ try{ const q=query(collection(db,'stickers'),where('userId','==',friendUserId)); const snap=await getDocs(q); const friendStickers=snap.docs.map(d=>({ id:d.id, ...d.data() })); const myDup=state.stickers.filter(s=>s.status==='repetida'); const myMiss=state.stickers.filter(s=>s.status==='faltante'); const friendDup=friendStickers.filter(s=>s.status==='repetida'); const friendMiss=friendStickers.filter(s=>s.status==='faltante'); const give=myDup.filter(a=>friendMiss.some(b=>b.country===a.country && b.number===a.number)); const receive=friendDup.filter(a=>myMiss.some(b=>b.country===a.country && b.number===a.number)); state.selectedFriend={ give, receive }; render(); }catch(e){ toast('No pude comparar con ese amigo.','error'); } }
window.addFriend=addFriend; window.compareFriend=compareFriend;
function friends(){ const comp=state.selectedFriend; return `<div class="card"><h2>Amigos</h2><p class="muted">Agregá amigos con su código y compará intercambios.</p><form onsubmit="addFriend(event)"><label class="field">Código de amigo</label><input id="friendCode" class="input" placeholder="Ej: ABCD1234"/><button class="primary">Agregar amigo</button></form></div><div class="card"><h3>Mi código</h3><p class="code">${esc(state.profile?.shareCode||'')}</p><button class="secondary" onclick="shareText('Sumame en FiguScan Mundial. Mi código es: ${esc(state.profile?.shareCode||'')}')">Compartir código</button></div><div class="card"><h3>Lista de amigos</h3>${state.friends.length?state.friends.map(f=>`<div class="friend-card"><b>${esc(f.profile?.name||'Amigo')}</b><div class="muted small">Código: ${esc(f.profile?.shareCode||'')}</div><button class="secondary" onclick="compareFriend('${f.friendUserId}')">Ver intercambios</button></div>`).join(''):'<div class="empty"><div class="big">🤝</div><b>Aún no agregaste amigos.</b></div>'}</div>${comp?`<div class="card"><h3>Intercambios posibles</h3><p><b>Vos podés dar:</b></p>${comp.give.length?comp.give.map(s=>`<p>✅ ${esc(s.country)} #${esc(s.number)}</p>`).join(''):'<p class="muted">No hay coincidencias para dar.</p>'}<p><b>Tu amigo puede darte:</b></p>${comp.receive.length?comp.receive.map(s=>`<p>🎁 ${esc(s.country)} #${esc(s.number)}</p>`).join(''):'<p class="muted">No hay coincidencias para recibir.</p>'}<button class="primary" onclick="shareText('Tengo posibles intercambios en FiguScan Mundial. Revisemos nuestras figuritas.')">Compartir por WhatsApp</button></div>`:''}`; }
function render(){ if(state.loading){ root.innerHTML=`<div class="auth-page"><div class="auth-card"><span class="pill">⚽ Cargando</span><h1 class="auth-title">FiguScan Mundial</h1><p class="muted">Preparando tu álbum...</p></div></div>`; return; } if(!state.user){ root.innerHTML=authScreen(); return; } let content=''; if(state.tab==='home') content=home(); if(state.tab==='scan') content=scanner(); if(state.tab==='album') content=album('all'); if(state.tab==='missing') content=album('faltante'); if(state.tab==='duplicates') content=album('repetida'); if(state.tab==='friends') content=friends(); if(state.tab==='profile') content=profile(); root.innerHTML=shell(content); }
render();
