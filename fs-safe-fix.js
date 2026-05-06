(function(){
  'use strict';
  var STORAGE_KEY='figuscan_v12_stickers';
  var LS_SOUND='figuscan_photo_sound';
  var soundOn=localStorage.getItem(LS_SOUND)!=='off';
  var lastSignal=0;
  var savingStore=false;

  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
  function up(v){return String(v||'').trim().toUpperCase().replace(/\s+/g,' ');}
  function codeFromText(text){
    var raw=String(text||'');
    var m=raw.match(/\b[A-Z]{3}\b/); if(m) return m[0];
    var t=norm(raw);
    var map={argentina:'ARG',brasil:'BRA',brazil:'BRA',sudafrica:'RSA','sudáfrica':'RSA','south africa':'RSA',francia:'FRA',espana:'ESP','españa':'ESP',alemania:'GER',italia:'ITA',uruguay:'URU',mexico:'MEX','méxico':'MEX',portugal:'POR',inglaterra:'ENG',japon:'JPN','japón':'JPN',canada:'CAN','canadá':'CAN'};
    for(var k in map){if(t.indexOf(norm(k))>-1)return map[k];}
    return '';
  }
  function numberParts(value){
    var s=up(value);
    var m=s.match(/^([A-Z]{3})\s*(\d+)$/); if(m) return {code:m[1],num:m[2],full:m[1]+' '+m[2]};
    m=s.match(/^(\d+)$/); if(m) return {code:'',num:m[1],full:m[1]};
    m=s.match(/([A-Z]{3})\s*(\d+)/); if(m) return {code:m[1],num:m[2],full:m[1]+' '+m[2]};
    m=s.match(/(\d+)/); if(m) return {code:'',num:m[1],full:m[1]};
    return {code:'',num:'',full:s};
  }
  function isNumberField(input){
    if(!input || input.tagName!=='INPUT') return false;
    var ph=norm(input.getAttribute('placeholder')||'');
    var attrs=norm([input.name,input.id,input.getAttribute('aria-label'),input.getAttribute('inputmode')].join(' '));
    var field=input.closest('.field')||input.parentElement;
    var label=field?norm(field.textContent||''):'';
    return input.type==='number' || ph.indexOf('ej 24')>-1 || attrs.indexOf('numero')>-1 || attrs.indexOf('figurita')>-1 || label.indexOf('numero de figurita')>-1 || label.indexOf('número de figurita')>-1 || label.indexOf('pais + numero')>-1 || label.indexOf('país + número')>-1;
  }
  function setNativeValue(input,value){
    var setter=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    setter.call(input,value);
  }
  function patchInput(input){
    if(!isNumberField(input)) return;
    try{input.type='text';}catch(e){}
    input.setAttribute('type','text');
    input.setAttribute('inputmode','text');
    input.removeAttribute('pattern'); input.removeAttribute('min'); input.removeAttribute('max'); input.removeAttribute('step');
    input.setAttribute('autocomplete','off'); input.setAttribute('autocorrect','off'); input.setAttribute('spellcheck','false');
    try{input.setCustomValidity('');}catch(e){}
    input.autocapitalize='characters'; input.placeholder='Ej: ARG 10'; input.style.textTransform='uppercase'; input.classList.add('fs-code-input');
    var form=input.closest('form'); if(form){form.noValidate=true;form.setAttribute('novalidate','novalidate');}
    var field=input.closest('.field')||input.parentElement;
    if(field){
      var label=field.querySelector('label');
      if(label && norm(label.textContent).indexOf('figurita')>-1) label.textContent='PAÍS + NÚMERO DE FIGURITA';
      if(!field.querySelector('.fs-code-help')){
        var help=document.createElement('small'); help.className='fs-code-help'; help.textContent='Usá letras y números. Ej: ARG 10, BRA 4, RSA 4';
        input.insertAdjacentElement('afterend',help);
      }
    }
  }
  function currentCountryCode(){
    var text='';
    document.querySelectorAll('select').forEach(function(sel){var opt=sel.options&&sel.options[sel.selectedIndex]; text+=' '+(opt?opt.textContent:'')+' '+(sel.value||'');});
    document.querySelectorAll('[aria-selected="true"],.active').forEach(function(el){text+=' '+(el.textContent||'');});
    return codeFromText(text);
  }
  function normalizeBeforeSave(){
    var input=Array.prototype.slice.call(document.querySelectorAll('input')).find(isNumberField);
    if(!input) return;
    patchInput(input);
    var p=numberParts(input.value);
    if(!p.code) p.code=currentCountryCode();
    var v=p.num ? ((p.code?p.code+' ':'')+p.num) : up(input.value);
    try{setNativeValue(input,v);}catch(e){input.value=v;}
    try{input.setCustomValidity('');}catch(e){}
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function objectValues(data){
    if(Array.isArray(data)) return data.map(function(x){return {value:x};});
    if(data && typeof data==='object') return Object.keys(data).map(function(k){return {key:k,value:data[k]};});
    return [];
  }
  function countryFromItem(it, fallback){
    if(!it || typeof it!=='object') return fallback||'';
    var texts=[];
    ['country','countryId','countryName','pais','país','seleccion','selection','team','teamId','countryCode','short'].forEach(function(k){
      var v=it[k];
      if(v && typeof v==='object') texts.push([v.short,v.code,v.id,v.name,v.label].join(' '));
      else if(v!=null) texts.push(String(v));
    });
    var fromNumber=numberParts(it.number||it.numero||it.num||it.stickerNumber||it.id||'').code;
    return fromNumber || codeFromText(texts.join(' ')) || fallback || '';
  }
  function normalizeItem(raw, fallbackCode){
    if(!raw || typeof raw!=='object') return {item:raw,key:'',num:'',code:''};
    var it=Object.assign({},raw);
    var n=numberParts(it.number||it.numero||it.num||it.stickerNumber||it.id||'');
    var code=n.code || countryFromItem(it,fallbackCode);
    var num=n.num;
    if(code && num){
      var full=code+' '+num;
      if('number' in it) it.number=full; else if('numero' in it) it.numero=full; else if('num' in it) it.num=full; else it.number=full;
      it.countryCode=code;
      it.fsKey=code+'-'+num;
      var idStr=String(it.id||'');
      if(!idStr || /^\d+$/.test(idStr) || /^[A-Z]{3}\s*\d+$/i.test(idStr)) it.id=code+'-'+num;
      return {item:it,key:code+'-'+num,num:num,code:code};
    }
    return {item:it,key:'',num:num,code:code};
  }
  function getStatus(it){return norm(it && (it.status||it.estado||it.state||''));}
  function setHave(it){
    if(!it || typeof it!=='object') return;
    if('status' in it) it.status='have';
    if('estado' in it) it.estado='have';
    if('state' in it) it.state='have';
  }
  function fixedStoreValue(nextRaw, prevRaw){
    var fallback=currentCountryCode();
    var nextList=objectValues(nextRaw).map(function(e){var n=normalizeItem(e.value,fallback); n.oldKey=e.key; return n;});
    var prevList=objectValues(prevRaw).map(function(e){var n=normalizeItem(e.value,''); n.oldKey=e.key; return n;});
    var map={};
    prevList.concat(nextList).forEach(function(e){
      if(e.key) map[e.key]=e; else if(e.oldKey) map[e.oldKey]=e;
    });
    var list=Object.keys(map).map(function(k){return map[k];});
    var byNum={};
    list.forEach(function(e){if(e.num){if(!byNum[e.num])byNum[e.num]=[]; byNum[e.num].push(e);}});
    list.forEach(function(e){
      var sameNum=e.num?byNum[e.num]:[];
      var differentCountries=sameNum.some(function(x){return x.code&&e.code&&x.code!==e.code;});
      var exactCount=sameNum.filter(function(x){return x.key===e.key;}).length;
      var st=getStatus(e.item);
      if(differentCountries && exactCount<=1 && (st==='repeated'||st==='repetida')) setHave(e.item);
    });
    if(Array.isArray(nextRaw)) return list.map(function(e){return e.item;});
    var out={};
    list.forEach(function(e){out[e.key||e.oldKey||Math.random().toString(36).slice(2)]=e.item;});
    return out;
  }
  var originalSet=localStorage.setItem.bind(localStorage);
  localStorage.setItem=function(key,value){
    if(key===STORAGE_KEY && !savingStore){
      try{
        var prev=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
        var next=JSON.parse(value);
        value=JSON.stringify(fixedStoreValue(next,prev));
      }catch(e){}
    }
    return originalSet(key,value);
  };
  function migrateStored(){
    if(savingStore) return;
    try{
      var raw=localStorage.getItem(STORAGE_KEY); if(!raw) return;
      var parsed=JSON.parse(raw); var fixed=fixedStoreValue(parsed,parsed); var s=JSON.stringify(fixed);
      if(s!==raw){savingStore=true; originalSet(STORAGE_KEY,s); savingStore=false;}
    }catch(e){savingStore=false;}
  }

  function photoSignal(){
    var now=Date.now(); if(now-lastSignal<700) return; lastSignal=now;
    try{navigator.vibrate&&navigator.vibrate(60);}catch(e){}
    if(!soundOn) return;
    try{var C=window.AudioContext||window.webkitAudioContext; var ctx=new C(); var osc=ctx.createOscillator(); var gain=ctx.createGain(); osc.type='triangle'; osc.frequency.value=950; gain.gain.value=0.16; osc.connect(gain); gain.connect(ctx.destination); osc.start(); setTimeout(function(){try{osc.stop();ctx.close();}catch(e){}},90);}catch(e){}
  }
  function addSoundToggle(){
    var scanner=document.querySelector('.scanner-wrap'); if(!scanner || scanner.querySelector('.fs-sound-toggle')) return;
    if(getComputedStyle(scanner).position==='static') scanner.style.position='relative';
    var b=document.createElement('button'); b.type='button'; b.className='fs-sound-toggle'; b.textContent=soundOn?'Sonido ON':'Sonido OFF';
    b.style.cssText='position:absolute;right:14px;top:14px;z-index:9;border:1px solid rgba(255,255,255,.35);background:rgba(6,25,71,.75);color:#fff;border-radius:999px;padding:10px 13px;font-weight:1000;font-size:14px;box-shadow:0 8px 20px rgba(0,0,0,.25);';
    b.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();soundOn=!soundOn;localStorage.setItem(LS_SOUND,soundOn?'on':'off');b.textContent=soundOn?'Sonido ON':'Sonido OFF';});
    scanner.appendChild(b);
  }
  function hideVercel(){document.querySelectorAll('[data-vercel-toolbar],iframe[src*="vercel"],iframe[title*="Vercel"],[id*="vercel-toolbar"],[class*="vercel-toolbar"]').forEach(function(el){el.style.display='none';el.style.visibility='hidden';el.style.pointerEvents='none';});}
  function tick(){document.querySelectorAll('input').forEach(patchInput); document.querySelectorAll('form').forEach(function(f){f.noValidate=true;f.setAttribute('novalidate','novalidate');}); document.querySelectorAll('.fs-shutter-hotspot').forEach(function(el){el.remove();}); addSoundToggle(); hideVercel();}
  document.addEventListener('focusin',function(e){if(isNumberField(e.target))patchInput(e.target);},false);
  document.addEventListener('input',function(e){if(!isNumberField(e.target))return;var input=e.target;var p=input.selectionStart;var v=up(input.value);try{setNativeValue(input,v);}catch(err){input.value=v;}try{input.setSelectionRange(p,p);input.setCustomValidity('');}catch(err){}},false);
  document.addEventListener('click',function(e){var b=e.target.closest('button,.btn,[role="button"]'); if(!b) return; var t=norm(b.textContent||''); if(t.indexOf('guardar')>-1||t.indexOf('agregar')>-1||t.indexOf('confirmar')>-1){normalizeBeforeSave(); setTimeout(migrateStored,250);} if(t.indexOf('sacar foto')>-1||t.indexOf('guardar imagen')>-1||t.indexOf('capturar')>-1) photoSignal();},true);
  document.addEventListener('submit',function(e){normalizeBeforeSave(); setTimeout(migrateStored,250);},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){tick();migrateStored();});else{tick();migrateStored();}
  setTimeout(tick,400); setTimeout(function(){tick();migrateStored();},1200); setInterval(tick,2500);
})();
