(function(){
  'use strict';
  var STORAGE_KEY='figuscan_v12_stickers';
  var keepManualUntil=0;

  function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();}
  function up(v){return String(v||'').trim().toUpperCase().replace(/\s+/g,' ');}
  function parts(v){var s=up(v),m=s.match(/([A-Z]{3})\s*(\d+)/);if(m)return{code:m[1],num:m[2],key:m[1]+'-'+m[2],full:m[1]+' '+m[2]};m=s.match(/(\d+)/);return{code:'',num:m?m[1]:'',key:m?m[1]:'',full:m?m[1]:s};}
  function codeFromText(text){
    var raw=String(text||''),m=raw.match(/\b[A-Z]{3}\b/);if(m)return m[0];
    var t=norm(raw),map={argentina:'ARG',brasil:'BRA',brazil:'BRA',sudafrica:'RSA',francia:'FRA',espana:'ESP',alemania:'GER',italia:'ITA',uruguay:'URU',mexico:'MEX',portugal:'POR',inglaterra:'ENG',japon:'JPN',canada:'CAN',marruecos:'MAR',belgica:'BEL',croacia:'CRO',colombia:'COL',senegal:'SEN',suiza:'SUI',dinamarca:'DEN',iran:'IRN',turquia:'TUR',ecuador:'ECU',austria:'AUT',nigeria:'NGA',australia:'AUS',argelia:'ALG',egipto:'EGY',noruega:'NOR',ucrania:'UKR',panama:'PAN'};
    for(var k in map){if(t.indexOf(norm(k))>-1)return map[k];}return '';
  }
  function countryName(c){var m={ARG:'Argentina',BRA:'Brasil',RSA:'Sudáfrica',FRA:'Francia',ESP:'España',GER:'Alemania',ITA:'Italia',URU:'Uruguay',MEX:'México',POR:'Portugal',ENG:'Inglaterra',JPN:'Japón',CAN:'Canadá'};return m[c]||c||'país';}
  function isNumberInput(i){if(!i||i.tagName!=='INPUT')return false;var txt=norm([i.name,i.id,i.placeholder,i.getAttribute('aria-label'),i.getAttribute('inputmode')].join(' '));var p=i.closest('.field')||i.parentElement;var lab=p?norm(p.textContent||''):'';return i.type==='number'||txt.indexOf('figurita')>-1||txt.indexOf('numero')>-1||lab.indexOf('numero de figurita')>-1||lab.indexOf('pais + numero')>-1||lab.indexOf('país + número')>-1;}
  function patchNumberInput(i){if(!isNumberInput(i))return;try{i.type='text';}catch(e){}i.setAttribute('type','text');i.setAttribute('inputmode','text');i.removeAttribute('pattern');i.placeholder='Ej: ARG 10';i.style.textTransform='uppercase';var f=i.closest('form');if(f){f.noValidate=true;f.setAttribute('novalidate','novalidate');}var box=i.closest('.field')||i.parentElement;if(box&&!box.querySelector('.fs-code-help')){var h=document.createElement('small');h.className='fs-code-help';h.textContent='Ejemplos: ARG 10, BRA 10, RSA 10';i.insertAdjacentElement('afterend',h);}}
  function selectedCountryCode(){var t='';document.querySelectorAll('select,[aria-selected="true"],.active').forEach(function(el){t+=' '+(el.textContent||'')+' '+(el.value||'');});return codeFromText(t);}
  function normalizeManualInput(){var i=Array.from(document.querySelectorAll('input')).find(isNumberInput);if(!i)return;patchNumberInput(i);var p=parts(i.value);if(!p.code)p.code=selectedCountryCode();if(p.num)i.value=(p.code?p.code+' ':'')+p.num;i.value=up(i.value);i.dispatchEvent(new Event('input',{bubbles:true}));i.dispatchEvent(new Event('change',{bubbles:true}));}
  function manualVisible(){return !!Array.from(document.querySelectorAll('input')).find(isNumberInput);}
  function keepManualOpen(){if(Date.now()>keepManualUntil)return;if(!manualVisible()){var b=Array.from(document.querySelectorAll('button,.btn,[role="button"]')).find(function(x){return norm(x.textContent).indexOf('agregar manualmente')>-1;});if(b)b.click();}var i=Array.from(document.querySelectorAll('input')).find(isNumberInput);if(i){patchNumberInput(i);try{i.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}}}
  function hideHaveDebug(){document.querySelectorAll('span,small,div,b,strong,p').forEach(function(el){if(el.children.length===0&&norm(el.textContent)==='have')el.classList.add('fs-hidden-debug-have');});}

  function itemCode(it){return parts([it.number,it.numero,it.num,it.stickerNumber,it.id,it.countryCode,it.country,it.countryName,it.pais,it.seleccion,it.selection,it.team].join(' ')).code||codeFromText([it.countryCode,it.country,it.countryName,it.pais,it.seleccion,it.selection,it.team].join(' '));}
  function itemNum(it){return parts([it.number,it.numero,it.num,it.stickerNumber,it.id].join(' ')).num;}
  function itemKey(it){var c=itemCode(it),n=itemNum(it);return c&&n?c+'-'+n:String(it.id||'');}
  function itemTitle(it){var c=itemCode(it),n=itemNum(it);return c&&n?c+' '+n:(it.number||it.numero||it.num||it.id||'');}
  function itemName(it){return it.player||it.name||it.nombre||it.jugador||'Sin nombre';}
  function itemCountry(it){return it.countryName||it.country||it.pais||it.seleccion||countryName(itemCode(it));}
  function itemStatus(it){var s=norm(it.status||it.estado||it.state||'');if(s==='have')return'Tengo';if(s==='repeated')return'Repetida';if(s==='missing')return'Me falta';return s||'';}
  function itemPhoto(it){return it.photo||it.image||it.img||it.photoData||it.imageData||it.dataUrl||it.picture||'';}
  function loadItems(){try{var raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');var arr=Array.isArray(raw)?raw:Object.keys(raw).map(function(k){return raw[k];});return arr.filter(function(x){return x&&typeof x==='object';});}catch(e){return[];}}
  function clickedKey(card){var t=(card.querySelector('.number')?card.querySelector('.number').textContent+' ':'')+(card.textContent||'');var p=parts(t);return p.code&&p.num?p.code+'-'+p.num:'';}
  function openViewer(card){
    var key=clickedKey(card),items=loadItems();if(!items.length)return false;
    var start=items.find(function(it){return itemKey(it)===key;})||items[0];var code=itemCode(start);
    var same=items.filter(function(it){return itemCode(it)===code;});var other=items.filter(function(it){return itemCode(it)!==code;});var list=same.concat(other);var idx=Math.max(0,list.findIndex(function(it){return itemKey(it)===itemKey(start);}));
    document.querySelectorAll('.fs-viewer').forEach(function(x){x.remove();});
    var modal=document.createElement('div');modal.className='fs-viewer';modal.innerHTML='<div class="fs-viewer-card"><div class="fs-viewer-head"><button class="fs-v-close">×</button><div><h2></h2><p></p></div></div><div class="fs-v-photo"></div><button class="fs-v-prev">‹</button><button class="fs-v-next">›</button><div class="fs-v-info"><span></span><h3></h3><p></p></div></div>';
    document.body.appendChild(modal);
    function draw(){var it=list[idx],photo=itemPhoto(it),title=itemTitle(it);modal.querySelector('h2').textContent='Figurita #'+title;modal.querySelector('.fs-viewer-head p').textContent=(idx+1)+' de '+list.length+' · primero '+countryName(code);modal.querySelector('.fs-v-photo').innerHTML=photo?'<img src="'+photo+'" alt="Foto">':'<div class="fs-v-empty">Sin foto</div>';modal.querySelector('.fs-v-info span').textContent=itemStatus(it);modal.querySelector('.fs-v-info h3').textContent=itemName(it);modal.querySelector('.fs-v-info p').textContent=itemCountry(it);}
    modal.querySelector('.fs-v-close').onclick=function(){modal.remove();};modal.querySelector('.fs-v-prev').onclick=function(){idx=(idx-1+list.length)%list.length;draw();};modal.querySelector('.fs-v-next').onclick=function(){idx=(idx+1)%list.length;draw();};draw();return true;
  }
  function run(){document.querySelectorAll('input').forEach(patchNumberInput);document.querySelectorAll('form').forEach(function(f){f.noValidate=true;f.setAttribute('novalidate','novalidate');});hideHaveDebug();keepManualOpen();}
  document.addEventListener('input',function(e){if(!isNumberInput(e.target))return;var i=e.target,pos=i.selectionStart;i.value=up(i.value);try{i.setSelectionRange(pos,pos);i.setCustomValidity('');}catch(err){}},false);
  document.addEventListener('click',function(e){var card=e.target.closest('.sticker-card');var interactive=e.target.closest('button,.btn,[role="button"],input,select,textarea,a,.icon-btn');if(card&&!interactive){if(openViewer(card)){e.preventDefault();e.stopImmediatePropagation();return false;}}var btn=e.target.closest('button,.btn,[role="button"]');if(!btn)return;var t=norm(btn.textContent||'');if((t.indexOf('guardar')>-1||t.indexOf('agregar')>-1||t.indexOf('confirmar')>-1)&&manualVisible()){normalizeManualInput();keepManualUntil=Date.now()+3500;setTimeout(keepManualOpen,350);setTimeout(keepManualOpen,1000);setTimeout(run,1600);}},true);
  document.addEventListener('submit',function(){normalizeManualInput();keepManualUntil=Date.now()+3500;setTimeout(keepManualOpen,500);},true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();setInterval(run,2500);
})();