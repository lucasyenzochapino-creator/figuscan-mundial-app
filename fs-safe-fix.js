(function(){
  'use strict';
  var LS_SOUND='figuscan_photo_sound';
  var soundOn=localStorage.getItem(LS_SOUND)!=='off';
  var lastSignal=0;

  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
  function isNumberField(input){
    if(!input || input.tagName!=='INPUT') return false;
    var ph=norm(input.getAttribute('placeholder')||'');
    var attrs=norm([input.name,input.id,input.getAttribute('aria-label'),input.getAttribute('inputmode')].join(' '));
    var field=input.closest('.field')||input.parentElement;
    var label=field?norm(field.textContent||''):'';
    return input.type==='number' || ph.indexOf('ej 24')>-1 || attrs.indexOf('numero')>-1 || attrs.indexOf('figurita')>-1 || label.indexOf('numero de figurita')>-1 || label.indexOf('número de figurita')>-1 || label.indexOf('pais + numero')>-1 || label.indexOf('país + número')>-1;
  }
  function patchInput(input){
    if(!isNumberField(input)) return;
    try{input.type='text';}catch(e){}
    input.setAttribute('type','text');
    input.setAttribute('inputmode','text');
    input.removeAttribute('pattern');
    input.removeAttribute('min');
    input.removeAttribute('max');
    input.removeAttribute('step');
    input.setAttribute('autocomplete','off');
    input.setAttribute('autocorrect','off');
    input.setAttribute('spellcheck','false');
    try{input.setCustomValidity('');}catch(e){}
    input.autocapitalize='characters';
    input.placeholder='Ej: ARG 10';
    input.style.textTransform='uppercase';
    input.classList.add('fs-code-input');
    var form=input.closest('form');
    if(form){form.noValidate=true;form.setAttribute('novalidate','novalidate');}
    var field=input.closest('.field')||input.parentElement;
    if(field){
      var label=field.querySelector('label');
      if(label && norm(label.textContent).indexOf('figurita')>-1) label.textContent='PAÍS + NÚMERO DE FIGURITA';
      if(!field.querySelector('.fs-code-help')){
        var help=document.createElement('small');
        help.className='fs-code-help';
        help.textContent='Usá letras y números. Ej: ARG 10, BRA 4, RSA 4';
        input.insertAdjacentElement('afterend',help);
      }
    }
  }
  function currentCountryCode(){
    var text='';
    document.querySelectorAll('select').forEach(function(sel){
      var opt=sel.options&&sel.options[sel.selectedIndex];
      text+=' '+(opt?opt.textContent:'')+' '+(sel.value||'');
    });
    document.querySelectorAll('[aria-selected="true"],.active').forEach(function(el){text+=' '+(el.textContent||'');});
    var direct=text.match(/\b[A-Z]{3}\b/); if(direct) return direct[0];
    var t=norm(text);
    var map={argentina:'ARG',brasil:'BRA',brazil:'BRA',sudafrica:'RSA','south africa':'RSA',francia:'FRA',espana:'ESP',alemania:'GER',italia:'ITA',uruguay:'URU',mexico:'MEX',portugal:'POR',inglaterra:'ENG',japon:'JPN',canada:'CAN'};
    for(var k in map){if(t.indexOf(norm(k))>-1)return map[k];}
    return '';
  }
  function normalizeBeforeSave(){
    var input=Array.prototype.slice.call(document.querySelectorAll('input')).find(isNumberField);
    if(!input) return;
    patchInput(input);
    var v=String(input.value||'').trim().toUpperCase().replace(/\s+/g,' ');
    if(/^[A-Z]{3}\s*\d+$/.test(v)) v=v.replace(/^([A-Z]{3})\s*(\d+)$/,'$1 $2');
    else if(/^\d+$/.test(v)){var c=currentCountryCode(); if(c) v=c+' '+v;}
    input.value=v;
    try{input.setCustomValidity('');}catch(e){}
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  function photoSignal(){
    var now=Date.now(); if(now-lastSignal<700) return; lastSignal=now;
    try{navigator.vibrate&&navigator.vibrate(60);}catch(e){}
    if(!soundOn) return;
    try{
      var C=window.AudioContext||window.webkitAudioContext;
      var ctx=new C(); var osc=ctx.createOscillator(); var gain=ctx.createGain();
      osc.type='triangle'; osc.frequency.value=950; gain.gain.value=0.16;
      osc.connect(gain); gain.connect(ctx.destination); osc.start();
      setTimeout(function(){try{osc.stop();ctx.close();}catch(e){}},90);
    }catch(e){}
  }
  function addSoundToggle(){
    var scanner=document.querySelector('.scanner-wrap');
    if(!scanner || scanner.querySelector('.fs-sound-toggle')) return;
    if(getComputedStyle(scanner).position==='static') scanner.style.position='relative';
    var b=document.createElement('button');
    b.type='button'; b.className='fs-sound-toggle'; b.textContent=soundOn?'Sonido ON':'Sonido OFF';
    b.style.cssText='position:absolute;right:14px;top:14px;z-index:9;border:1px solid rgba(255,255,255,.35);background:rgba(6,25,71,.75);color:#fff;border-radius:999px;padding:10px 13px;font-weight:1000;font-size:14px;box-shadow:0 8px 20px rgba(0,0,0,.25);';
    b.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();soundOn=!soundOn;localStorage.setItem(LS_SOUND,soundOn?'on':'off');b.textContent=soundOn?'Sonido ON':'Sonido OFF';});
    scanner.appendChild(b);
  }
  function hideVercel(){
    document.querySelectorAll('[data-vercel-toolbar],iframe[src*="vercel"],iframe[title*="Vercel"],[id*="vercel-toolbar"],[class*="vercel-toolbar"]').forEach(function(el){el.style.display='none';el.style.visibility='hidden';el.style.pointerEvents='none';});
  }
  function tick(){
    document.querySelectorAll('input').forEach(patchInput);
    document.querySelectorAll('form').forEach(function(f){f.noValidate=true;f.setAttribute('novalidate','novalidate');});
    document.querySelectorAll('.fs-shutter-hotspot').forEach(function(el){el.remove();});
    addSoundToggle();
    hideVercel();
  }
  document.addEventListener('focusin',function(e){if(isNumberField(e.target))patchInput(e.target);},false);
  document.addEventListener('input',function(e){if(!isNumberField(e.target))return;var input=e.target;var p=input.selectionStart;input.value=String(input.value||'').toUpperCase();try{input.setSelectionRange(p,p);input.setCustomValidity('');}catch(err){}},false);
  document.addEventListener('click',function(e){
    var b=e.target.closest('button,.btn,[role="button"]'); if(!b) return;
    var t=norm(b.textContent||'');
    if(t.indexOf('guardar')>-1||t.indexOf('agregar')>-1||t.indexOf('confirmar')>-1) normalizeBeforeSave();
    if(t.indexOf('sacar foto')>-1||t.indexOf('guardar imagen')>-1||t.indexOf('capturar')>-1) photoSignal();
  },false);
  document.addEventListener('submit',function(e){normalizeBeforeSave();},false);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick);else tick();
  setTimeout(tick,400); setTimeout(tick,1200); setInterval(tick,2500);
})();
