(function(){
  'use strict';

  function norm(v){
    return String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  }
  function up(v){
    return String(v || '').trim().toUpperCase().replace(/\s+/g,' ');
  }
  function codeFromText(text){
    var raw = String(text || '');
    var direct = raw.match(/\b[A-Z]{3}\b/);
    if (direct) return direct[0];
    var t = norm(raw);
    var map = {
      argentina:'ARG', brasil:'BRA', brazil:'BRA', sudafrica:'RSA', francia:'FRA', espana:'ESP', alemania:'GER', italia:'ITA',
      uruguay:'URU', mexico:'MEX', portugal:'POR', inglaterra:'ENG', japon:'JPN', canada:'CAN', marruecos:'MAR', belgica:'BEL',
      croacia:'CRO', colombia:'COL', senegal:'SEN', suiza:'SUI', dinamarca:'DEN', iran:'IRN', turquia:'TUR', ecuador:'ECU',
      austria:'AUT', nigeria:'NGA', australia:'AUS', argelia:'ALG', egipto:'EGY', noruega:'NOR', ucrania:'UKR', panama:'PAN'
    };
    for (var k in map) if (t.indexOf(norm(k)) > -1) return map[k];
    return '';
  }
  function countryName(code){
    var map = {ARG:'Argentina',BRA:'Brasil',RSA:'Sudáfrica',FRA:'Francia',ESP:'España',GER:'Alemania',ITA:'Italia',URU:'Uruguay',MEX:'México',POR:'Portugal',ENG:'Inglaterra',JPN:'Japón',CAN:'Canadá'};
    return map[code] || code || 'país';
  }
  function parts(v){
    var s = up(v);
    var m = s.match(/([A-Z]{3})\s*(\d+)/);
    if (m) return {code:m[1], num:m[2]};
    m = s.match(/(\d+)/);
    return {code:'', num:m ? m[1] : ''};
  }
  function isNumberInput(i){
    if (!i || i.tagName !== 'INPUT') return false;
    var txt = norm([i.name, i.id, i.placeholder, i.getAttribute('aria-label'), i.getAttribute('inputmode')].join(' '));
    var parent = i.closest('.field') || i.parentElement;
    var label = parent ? norm(parent.textContent || '') : '';
    return i.type === 'number' || txt.indexOf('figurita') > -1 || txt.indexOf('numero') > -1 || label.indexOf('numero de figurita') > -1 || label.indexOf('pais + numero') > -1 || label.indexOf('país + número') > -1;
  }
  function patchNumberInput(i){
    if (!isNumberInput(i)) return;
    try { i.type = 'text'; } catch(e) {}
    i.setAttribute('type','text');
    i.setAttribute('inputmode','text');
    i.removeAttribute('pattern');
    i.placeholder = 'Ej: ARG 10';
    i.style.textTransform = 'uppercase';
    var form = i.closest('form');
    if (form) { form.noValidate = true; form.setAttribute('novalidate','novalidate'); }
    var box = i.closest('.field') || i.parentElement;
    if (box && !box.querySelector('.fs-code-help')) {
      var help = document.createElement('small');
      help.className = 'fs-code-help';
      help.textContent = 'Ejemplos: ARG 10, BRA 10, RSA 10';
      i.insertAdjacentElement('afterend', help);
    }
  }
  function selectedCountryCode(){
    var text = '';
    document.querySelectorAll('select,[aria-selected="true"],.active').forEach(function(el){ text += ' ' + (el.textContent || '') + ' ' + (el.value || ''); });
    return codeFromText(text);
  }
  function normalizeManualInput(){
    var i = Array.from(document.querySelectorAll('input')).find(isNumberInput);
    if (!i) return;
    patchNumberInput(i);
    var p = parts(i.value);
    if (!p.code) p.code = selectedCountryCode();
    if (p.num) i.value = (p.code ? p.code + ' ' : '') + p.num;
    i.value = up(i.value);
    i.dispatchEvent(new Event('input',{bubbles:true}));
    i.dispatchEvent(new Event('change',{bubbles:true}));
  }

  var keepManualUntil = 0;
  function manualVisible(){ return !!Array.from(document.querySelectorAll('input')).find(isNumberInput); }
  function keepManualOpen(){
    if (Date.now() > keepManualUntil) return;
    if (!manualVisible()) {
      var btn = Array.from(document.querySelectorAll('button,.btn,[role="button"]')).find(function(b){ return norm(b.textContent).indexOf('agregar manualmente') > -1; });
      if (btn) btn.click();
    }
    var input = Array.from(document.querySelectorAll('input')).find(isNumberInput);
    if (input) {
      patchNumberInput(input);
      try { input.scrollIntoView({block:'center', behavior:'smooth'}); } catch(e) {}
    }
  }
  function hideHaveDebug(){
    document.querySelectorAll('span,small,div,b,strong,p').forEach(function(el){
      if (el.children.length === 0 && norm(el.textContent) === 'have') {
        el.classList.add('fs-hidden-debug-have');
      }
    });
  }
  function cardCode(card){
    if (!card) return '';
    var number = card.querySelector('.number');
    var text = (number ? number.textContent + ' ' : '') + (card.textContent || '');
    return parts(text).code || codeFromText(text);
  }
  function prioritizeCountry(card){
    var code = cardCode(card);
    if (!code) return;
    var box = card.closest('.cards');
    if (!box) return;
    var cards = Array.from(box.querySelectorAll('.sticker-card'));
    var same = [], other = [];
    cards.forEach(function(c){ (cardCode(c) === code ? same : other).push(c); });
    if (same.length < 2) return;
    var banner = box.querySelector('.fs-country-priority');
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'fs-country-priority';
      box.insertBefore(banner, box.firstChild);
    }
    banner.textContent = 'Primero ' + countryName(code) + '. Después siguen las demás.';
    same.concat(other).forEach(function(c){ box.appendChild(c); c.classList.remove('fs-card-priority'); });
    same.forEach(function(c){ c.classList.add('fs-card-priority'); });
  }
  function run(){
    document.querySelectorAll('input').forEach(patchNumberInput);
    document.querySelectorAll('form').forEach(function(f){ f.noValidate = true; f.setAttribute('novalidate','novalidate'); });
    hideHaveDebug();
    keepManualOpen();
  }
  document.addEventListener('input', function(e){
    if (!isNumberInput(e.target)) return;
    var i = e.target;
    var pos = i.selectionStart;
    i.value = up(i.value);
    try { i.setSelectionRange(pos, pos); i.setCustomValidity(''); } catch(err) {}
  });
  document.addEventListener('click', function(e){
    var interactive = e.target.closest('button,.btn,[role="button"],input,select,textarea,a,.icon-btn');
    var card = e.target.closest('.sticker-card');
    if (card && !interactive) prioritizeCountry(card);
    var btn = e.target.closest('button,.btn,[role="button"]');
    if (!btn) return;
    var t = norm(btn.textContent || '');
    if ((t.indexOf('guardar') > -1 || t.indexOf('agregar') > -1 || t.indexOf('confirmar') > -1) && manualVisible()) {
      normalizeManualInput();
      keepManualUntil = Date.now() + 3500;
      setTimeout(keepManualOpen, 350);
      setTimeout(keepManualOpen, 1000);
      setTimeout(run, 1600);
    }
  }, true);
  document.addEventListener('submit', function(){ normalizeManualInput(); keepManualUntil = Date.now() + 3500; setTimeout(keepManualOpen, 500); }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  setInterval(run, 2500);
})();
