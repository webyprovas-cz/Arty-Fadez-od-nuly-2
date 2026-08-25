(function () {
  'use strict';

  var ICONS = {
    scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    comb: '<path d="M4 4h16"/><path d="M8 4v6"/><path d="M12 4v6"/><path d="M16 4v6"/><path d="M20 4v6"/>',
    razor: '<rect x="4" y="10" width="16" height="4" rx="1"/><path d="M4 10 2 6"/><path d="M20 10 22 6"/>',
    lines: '<path d="M3 7h18"/><path d="M3 12h18"/><path d="M3 17h18"/>',
    ruler: '<path d="M4 6h16M6 6v14M18 6v14"/>',
    baby: '<circle cx="12" cy="8" r="5"/><path d="M8 19c0-3 2-4 4-4s4 1 4 4"/>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 8h18"/><path d="M12 8v13"/><path d="M12 8c-1.7 0-3-1.6-3-3.2C9 3.3 10 2.5 11 3c1 .5 1 2 1 5z"/><path d="M12 8c1.7 0 3-1.6 3-3.2 0-1.5-1-2.3-2-1.8-1 .5-1 2-1 5z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  };

  var SERVICES = [
    { id: 'strih', name: 'Pánský střih', desc: 'Klasický i moderní střih na míru.', price: 450, duration: 30, icon: 'scissors' },
    { id: 'fade', name: 'Fade / skin fade', desc: 'Plynulý přechod, ostré kontury.', price: 500, duration: 40, icon: 'zap' },
    { id: 'strih-vousy', name: 'Střih & vousy', desc: 'Kompletní úprava střihu a vousů.', price: 650, duration: 50, icon: 'comb' },
    { id: 'holeni', name: 'Holení břitvou', desc: 'Tradiční holení horkým ručníkem.', price: 380, duration: 25, icon: 'razor' },
    { id: 'vousy', name: 'Úprava vousů', desc: 'Tvarování a zastřižení vousů.', price: 250, duration: 15, icon: 'lines' },
    { id: 'kontury', name: 'Linie & kontury', desc: 'Doladění přesných linií strojkem.', price: 150, duration: 10, icon: 'ruler' },
    { id: 'detsky', name: 'Dětský střih', desc: 'Šetrný střih pro děti do 12 let.', price: 300, duration: 25, icon: 'baby' },
    { id: 'balicek', name: 'Balíček Arty', desc: 'Střih, vousy i horký ručník v jednom.', price: 750, duration: 60, icon: 'gift' },
  ];

  var MESICE = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
  var DNY_TYDNE = ['po', 'út', 'st', 'čt', 'pá', 'so', 'ne'];
  var DNY_DLOUZE = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];

  var clockIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var today = todayStr();
  var state = {
    step: 1,
    service: null,
    date: null,
    time: null,
    calendarMonth: (function () { var d = new Date(); d.setDate(1); return d; })(),
  };

  var stepsEl = document.getElementById('steps');
  var headEl = document.getElementById('wizardHead');
  var bodyEl = document.getElementById('wizardBody');
  var navEl = document.getElementById('wizardNav');

  function updateStepIndicator() {
    stepsEl.querySelectorAll('.step').forEach(function (el) {
      var n = Number(el.dataset.step);
      el.classList.toggle('is-active', n === state.step);
      el.classList.toggle('is-done', n < state.step);
      el.querySelector('.step-circle').innerHTML = n < state.step
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>'
        : String(n);
    });
  }

  function goToStep(n) {
    state.step = n;
    updateStepIndicator();
    if (n === 1) renderStep1();
    else if (n === 2) renderStep2();
    else renderStep3();
    wizardPanelScrollIntoView();
  }

  function wizardPanelScrollIntoView() {
    var panel = document.getElementById('wizardPanel');
    var y = panel.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  /* ---------- STEP 1: SERVICE ---------- */
  function renderStep1() {
    headEl.innerHTML = '<h2>Vyberte Službu</h2><p>Zvolte službu, která nejlépe vyhovuje vašim potřebám</p>';
    bodyEl.innerHTML = '<div class="service-select-grid" id="serviceGrid"></div>';
    navEl.innerHTML = '';

    var grid = document.getElementById('serviceGrid');
    grid.innerHTML = SERVICES.map(function (s) {
      var selected = state.service && state.service.id === s.id ? ' is-selected' : '';
      return (
        '<div class="service-select-card' + selected + '" data-id="' + s.id + '">' +
        '<span class="service-icon-badge">' + icon(s.icon) + '</span>' +
        '<h3>' + s.name + '</h3>' +
        '<p class="desc">' + s.desc + '</p>' +
        '<div class="service-select-meta">' +
        '<span class="service-select-price">' + s.price + ' Kč</span>' +
        '<span class="service-select-duration">' + clockIcon + s.duration + ' min</span>' +
        '</div>' +
        '</div>'
      );
    }).join('');

    grid.querySelectorAll('.service-select-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var svc = SERVICES.find(function (s) { return s.id === card.dataset.id; });
        state.service = svc;
        goToStep(2);
      });
    });
  }

  /* ---------- STEP 2: DATE & TIME ---------- */
  function renderStep2() {
    headEl.innerHTML = '<h2>Vyberte Datum a Čas</h2><p>Zvolte si váš preferovaný termín</p>';
    bodyEl.innerHTML =
      '<div class="datetime-grid">' +
      '<div>' +
      '<p class="dt-label">Datum' + (state.date ? '<span class="selected-date-badge">(' + formatDateCz(state.date, true) + ')</span>' : '') + '</p>' +
      '<div class="calendar" id="calendar"></div>' +
      '</div>' +
      '<div class="time-panel">' +
      '<p class="dt-label">' + clockIcon + 'Čas</p>' +
      '<div id="timeList"></div>' +
      '</div>' +
      '</div>';

    renderCalendar();
    renderTimePanel();
    renderStep2Nav();
  }

  function renderStep2Nav() {
    navEl.innerHTML =
      '<button class="btn btn-outline btn-sm" id="btnBack">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg> Zpět</button>' +
      '<button class="btn btn-primary btn-sm" id="btnNext"' + (state.date && state.time ? '' : ' disabled') + '>Pokračovat ' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>';
    document.getElementById('btnBack').addEventListener('click', function () { goToStep(1); });
    document.getElementById('btnNext').addEventListener('click', function () {
      if (state.date && state.time) goToStep(3);
    });
  }

  function renderCalendar() {
    var cal = document.getElementById('calendar');
    var year = state.calendarMonth.getFullYear();
    var month = state.calendarMonth.getMonth();
    var firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    var daysInMonth = new Date(year, month + 1, 0).getDate();

    var isCurrentRealMonth = year === new Date().getFullYear() && month === new Date().getMonth();

    var html = '<div class="calendar-head">' +
      '<button class="calendar-nav-btn" id="calPrev"' + (isCurrentRealMonth ? ' disabled' : '') + '>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg></button>' +
      '<span class="calendar-title">' + MESICE[month] + ' ' + year + '</span>' +
      '<button class="calendar-nav-btn" id="calNext">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>' +
      '</div><div class="calendar-grid">';

    DNY_TYDNE.forEach(function (d) { html += '<span class="calendar-weekday">' + d + '</span>'; });

    for (var i = 0; i < firstDow; i++) html += '<span class="calendar-day is-outside"></span>';

    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      var classes = 'calendar-day';
      if (dateStr < today) classes += ' is-disabled';
      if (dateStr === today) classes += ' is-today';
      if (dateStr === state.date) classes += ' is-selected';
      html += '<button type="button" class="' + classes + '" data-date="' + dateStr + '">' + day + '</button>';
    }
    html += '</div>';
    cal.innerHTML = html;

    document.getElementById('calPrev').addEventListener('click', function () {
      state.calendarMonth = new Date(year, month - 1, 1);
      renderCalendar();
    });
    document.getElementById('calNext').addEventListener('click', function () {
      state.calendarMonth = new Date(year, month + 1, 1);
      renderCalendar();
    });
    cal.querySelectorAll('.calendar-day:not(.is-outside):not(.is-disabled)').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.date = btn.dataset.date;
        state.time = null;
        renderStep2();
      });
    });
  }

  function renderTimePanel() {
    var panel = document.getElementById('timeList');
    if (!state.date) {
      panel.innerHTML = '<div class="time-placeholder">' + icon('clock') + '<span>Zvolte si váš preferovaný termín</span></div>';
      return;
    }
    panel.innerHTML = '<div class="time-placeholder"><span>Načítám dostupné časy…</span></div>';

    fetch('/api/sloty?datum=' + state.date)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (state.date === null) return;
        if (!data.ok || data.sloty.length === 0) {
          panel.innerHTML = '<div class="time-empty">Tento den je bohužel plně obsazený nebo zavřeno. Zkuste prosím jiný den.</div>';
          return;
        }
        panel.innerHTML = '<div class="time-list">' + data.sloty.map(function (t) {
          var sel = t === state.time ? ' is-selected' : '';
          return '<button type="button" class="time-slot-btn' + sel + '" data-time="' + t + '">' + clockIcon + t + '</button>';
        }).join('') + '</div>';

        panel.querySelectorAll('.time-slot-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            state.time = btn.dataset.time;
            panel.querySelectorAll('.time-slot-btn').forEach(function (b) { b.classList.remove('is-selected'); });
            btn.classList.add('is-selected');
            renderStep2Nav();
          });
        });
      })
      .catch(function () {
        panel.innerHTML = '<div class="time-empty">Nepodařilo se načíst dostupné časy.</div>';
      });
  }

  function formatDateCz(dateStr, short) {
    var parts = dateStr.split('-').map(Number);
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (short) return String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
    return DNY_DLOUZE[d.getDay()].charAt(0).toUpperCase() + DNY_DLOUZE[d.getDay()].slice(1) + ' ' + d.getDate() + '. ' + MESICE[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ---------- STEP 3: CONFIRM ---------- */
  function renderStep3() {
    headEl.innerHTML = '<h2>Potvrďte Vaši Rezervaci</h2><p>Zkontrolujte podrobnosti vaší rezervace a zadejte své kontaktní údaje</p>';
    bodyEl.innerHTML =
      '<div class="confirm-grid">' +
      '<div class="summary-card">' +
      '<h3 style="font-size:1.1rem;font-family:Inter,sans-serif">Souhrn rezervace</h3>' +
      '<div class="summary-datetime">' +
      '<p class="date">' + formatDateCz(state.date) + '</p>' +
      '<p class="time">' + state.time + '</p>' +
      '</div>' +
      '<div class="summary-line">' +
      '<span class="label">' + icon(state.service.icon) + state.service.name + '</span>' +
      '<span class="price">' + state.service.price + ' Kč</span>' +
      '</div>' +
      '<div class="summary-line">' +
      '<span class="label">' + clockIcon + 'Délka</span>' +
      '<span>' + state.service.duration + ' min</span>' +
      '</div>' +
      '</div>' +
      '<div>' +
      '<h3 style="font-size:1.1rem;font-family:Inter,sans-serif;margin-bottom:18px">Vaše údaje</h3>' +
      '<form id="confirmForm" class="field-stack">' +
      '<label class="field">Celé jméno *<input type="text" name="jmeno" required autocomplete="name" placeholder="Jan Novák"></label>' +
      '<label class="field">E-mailová adresa *<input type="email" name="email" required autocomplete="email" placeholder="jan@priklad.cz"></label>' +
      '<label class="field">Telefonní číslo *<input type="tel" name="telefon" required autocomplete="tel" placeholder="+420 123 456 789"></label>' +
      '<label class="field">Poznámka (nepovinné)<textarea name="poznamka" rows="2"></textarea></label>' +
      '<button type="submit" class="btn btn-primary btn-block">Provést Rezervaci</button>' +
      '<p id="rezZprava" class="rez-zprava" role="status"></p>' +
      '</form>' +
      '</div>' +
      '</div>' +
      '<div class="summary-note">' +
      icon('info') +
      '<span>Po odeslání je vaše rezervace rovnou potvrzená. V případě potřeby vás budeme kontaktovat telefonicky.</span>' +
      '</div>';

    navEl.innerHTML =
      '<button class="btn btn-outline btn-sm" id="btnBack">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg> Zpět</button>';
    document.getElementById('btnBack').addEventListener('click', function () { goToStep(2); });

    var form = document.getElementById('confirmForm');
    var msg = document.getElementById('rezZprava');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      msg.textContent = 'Odesílám…';
      msg.className = 'rez-zprava';

      var fd = new FormData(form);
      var payload = {
        jmeno: fd.get('jmeno'),
        email: fd.get('email'),
        telefon: fd.get('telefon'),
        poznamka: fd.get('poznamka'),
        sluzba: state.service.name + ' — ' + state.service.price + ' Kč',
        datum: state.date,
        cas: state.time,
      };

      try {
        var res = await fetch('/api/rezervace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        var data = await res.json();
        if (!data.ok) throw new Error(data.error || 'Rezervaci se nepodařilo odeslat.');

        renderSuccess();
      } catch (err) {
        msg.textContent = err.message;
        msg.className = 'rez-zprava err';
        btn.disabled = false;
      }
    });
  }

  function renderSuccess() {
    stepsEl.querySelectorAll('.step').forEach(function (el) { el.classList.add('is-done'); el.classList.remove('is-active'); el.querySelector('.step-circle').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>'; });
    headEl.innerHTML = '';
    navEl.innerHTML = '';
    bodyEl.innerHTML =
      '<div style="text-align:center;padding:20px 10px">' +
      '<span class="service-icon-badge" style="width:64px;height:64px;border-radius:999px;margin:0 auto 20px">' +
      '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg></span>' +
      '<h2>Rezervace potvrzena!</h2>' +
      '<p style="color:var(--fg-dim);margin-top:10px">Těšíme se na vás ' + formatDateCz(state.date) + ' v ' + state.time + '.</p>' +
      '<a href="/" class="btn btn-primary" style="margin-top:28px">Zpět domů</a>' +
      '</div>';
  }

  goToStep(1);
})();
