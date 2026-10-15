/* =========================================================================
   app.js — Lógica de la app: inicio, test, resultado y reporte. Bilingüe ES/EN.
   Sin dependencias. El avance se guarda en el navegador (localStorage).
   Rutas: #/ (inicio) · #/test · #/resultado
   ========================================================================= */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const KEY = 'test-mecanico.v1';
  const SUGGESTED_MIN = 25;

  /* ---------- Persistencia (tolerante a modo privado) ---------- */
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* sin almacenamiento: la app sigue en memoria */ } }
  };
  const db = Object.assign({ name: '', lang: null, best: {}, history: [], current: null, lastResult: null }, store.load());
  const save = () => store.save(db);

  /* =========================================================================
     IDIOMA
     ========================================================================= */
  const detected = (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  window.LANG = db.lang === 'en' || db.lang === 'es' ? db.lang : detected;

  const STR = {
    es: {
      title: 'Comprensión mecánica',
      metaDesc: 'Práctica de comprensión mecánica: 3 tests de 20 preguntas con diagramas, puntaje inmediato y explicación de cada error.',
      heroDim: '3 tests, 60 preguntas',
      heroP: 'Práctica con diagramas: engranajes, poleas, palancas, resortes, circuitos y fluidos. Al terminar cada test ves tu puntaje y la explicación de cada pregunta que fallaste.',
      langGroup: 'Idioma',
      unfinished: 'Tienes un test sin terminar',
      errorsReview: 'repaso de errores',
      answeredOf: (d, n) => `${d} de ${n} respondidas`,
      resume: 'Continuar', discard: 'Descartar',
      bestScore: (s, t) => `Mejor resultado: ${s}/${t}`,
      noAttempts: 'Aún sin intentos',
      nQuestions: n => `${n} preguntas`,
      aboutMin: m => `Unos ${m} minutos`,
      startAria: (n, l) => `Empezar ${n}, ${l}`,
      nameLabel: 'Tu nombre, para que aparezca en el reporte',
      namePh: 'Escribe tu nombre',
      testsAria: 'Tests disponibles',
      howTitle: 'Cómo funciona',
      how: [
        'Elige un test. Cada uno tiene 20 preguntas con su diagrama.',
        'Responde a tu ritmo; puedes ir y volver entre preguntas y cambiar respuestas antes de terminar.',
        'Al terminar ves el puntaje y, en cada error, la respuesta correcta con su explicación completa.',
        'Guarda el reporte en PDF o compártelo, y repasa solo las preguntas que fallaste.'
      ],
      credits: 'Preguntas, diagramas y explicaciones originales, elaborados para esta app de práctica. Tu avance se guarda solo en este dispositivo.',
      exitAria: 'Salir al inicio (se guarda el avance)',
      elapsed: 'Tiempo transcurrido',
      question: 'Pregunta',
      of: (i, n) => `${i} de ${n}`,
      prev: 'Anterior', prevAria: 'Pregunta anterior',
      next: 'Siguiente', nextAria: 'Pregunta siguiente',
      finish: 'Terminar',
      mapAria: 'Ver todas las preguntas',
      mapTitle: 'Preguntas',
      leftOne: 'Te falta 1 por responder.',
      leftN: n => `Te faltan ${n} por responder.`,
      allDone: 'Ya respondiste todas.',
      tapNumber: 'Toca un número para ir a esa pregunta.',
      answered: 'Respondida', unanswered: 'Sin responder',
      qAria: (k, done) => `Pregunta ${k}, ${done ? 'respondida' : 'sin responder'}`,
      finishTest: 'Terminar el test', keepGoing: 'Seguir respondiendo',
      mapLabel: 'Mapa de preguntas',
      missingTitle: n => (n === 1 ? 'Te falta 1 pregunta' : `Te faltan ${n} preguntas`),
      missingP: 'Las preguntas sin responder cuentan como error. Puedes volver a la primera que falta o terminar ahora.',
      goTo: k => `Ir a la pregunta ${k}`,
      finishAnyway: 'Terminar de todas formas',
      confirmLabel: 'Confirmar fin del test',
      verdict: [
        'Excelente. Dominas estos principios; prueba con el siguiente test.',
        'Buen nivel. Lee las explicaciones de los errores para afinar.',
        'Vas bien encaminado. Revisa los temas con más errores y vuelve a intentarlo.',
        'Hay que reforzar la base. Lee con calma cada explicación y repite el test.'
      ],
      result: 'Resultado',
      scoreAria: 'Puntaje',
      scoreOf: (s, t) => `${s} de ${t}`,
      pct: p => `${p} % de aciertos`,
      name: 'Nombre', time: 'Tiempo', date: 'Fecha',
      stripAria: 'Resultado por pregunta',
      stateAria: (n, st) => `Pregunta ${n}: ${st === 'ok' ? 'correcta' : st === 'bad' ? 'incorrecta' : 'sin responder'}`,
      retryErrors: n => `Repasar mis ${n} ${n === 1 ? 'error' : 'errores'}`,
      retry: 'Repetir el test', pdf: 'Guardar en PDF', share: 'Compartir', home: 'Inicio', homeAria: 'Volver al inicio',
      byTopic: 'Resultado por tema',
      wrongTitle: 'Preguntas que fallaste',
      rightTitle: 'Preguntas que acertaste',
      yourAnswer: 'Tu respuesta', skipped: 'Sin responder', noOption: 'No marcaste ninguna opción.',
      correct: 'Respuesta correcta', gotIt: 'Respondiste bien', explanation: 'Explicación',
      noWrong: 'No fallaste ninguna. Abajo puedes repasar las explicaciones de todas las preguntas.',
      noRight: 'Ninguna todavía. Lee las explicaciones de arriba y vuelve a intentarlo.',
      shareTitle: 'Resultado del test',
      shareHead: 'Test de comprensión mecánica',
      shareFails: f => `Preguntas falladas: ${f}`,
      shareNoFails: 'Sin errores',
      copied: 'Resultado copiado. Pégalo donde quieras.',
      cantShare: 'No se pudo compartir desde este navegador.',
      startOther: 'Si empiezas otro, se pierde el avance del test anterior.',
      continuePrev: 'Continuar el anterior',
      startName: n => `Empezar el ${n}`,
      discarded: 'Test descartado',
      saved: 'Tu avance quedó guardado',
      locale: 'es-CO'
    },
    en: {
      title: 'Mechanical comprehension',
      metaDesc: 'Mechanical comprehension practice: 3 tests of 20 questions with diagrams, instant score and an explanation for every mistake.',
      heroDim: '3 tests, 60 questions',
      heroP: 'Practice with diagrams: gears, pulleys, levers, springs, circuits and fluids. When you finish each test you get your score and the explanation of every question you missed.',
      langGroup: 'Language',
      unfinished: 'You have an unfinished test',
      errorsReview: 'mistakes review',
      answeredOf: (d, n) => `${d} of ${n} answered`,
      resume: 'Continue', discard: 'Discard',
      bestScore: (s, t) => `Best score: ${s}/${t}`,
      noAttempts: 'No attempts yet',
      nQuestions: n => `${n} questions`,
      aboutMin: m => `About ${m} minutes`,
      startAria: (n, l) => `Start ${n}, ${l}`,
      nameLabel: 'Your name, to show on the report',
      namePh: 'Type your name',
      testsAria: 'Available tests',
      howTitle: 'How it works',
      how: [
        'Pick a test. Each one has 20 questions, each with its diagram.',
        'Answer at your own pace; you can move back and forth between questions and change answers before you finish.',
        'When you finish you get your score and, for every mistake, the correct answer with its full explanation.',
        'Save the report as a PDF or share it, and review only the questions you missed.'
      ],
      credits: 'Original questions, diagrams and explanations written for this practice app. Your progress is saved only on this device.',
      exitAria: 'Back to start (progress is saved)',
      elapsed: 'Time elapsed',
      question: 'Question',
      of: (i, n) => `${i} of ${n}`,
      prev: 'Back', prevAria: 'Previous question',
      next: 'Next', nextAria: 'Next question',
      finish: 'Finish',
      mapAria: 'See all questions',
      mapTitle: 'Questions',
      leftOne: '1 question left to answer.',
      leftN: n => `${n} questions left to answer.`,
      allDone: 'You have answered them all.',
      tapNumber: 'Tap a number to go to that question.',
      answered: 'Answered', unanswered: 'Not answered',
      qAria: (k, done) => `Question ${k}, ${done ? 'answered' : 'not answered'}`,
      finishTest: 'Finish the test', keepGoing: 'Keep answering',
      mapLabel: 'Question map',
      missingTitle: n => (n === 1 ? '1 question left' : `${n} questions left`),
      missingP: 'Unanswered questions count as wrong. You can go back to the first one missing or finish now.',
      goTo: k => `Go to question ${k}`,
      finishAnyway: 'Finish anyway',
      confirmLabel: 'Confirm finishing the test',
      verdict: [
        'Excellent. You have these principles down; try the next test.',
        'Good level. Read the explanations of your mistakes to sharpen up.',
        'You are on the right track. Review the topics with the most mistakes and try again.',
        'The basics need work. Read each explanation carefully and take the test again.'
      ],
      result: 'Result',
      scoreAria: 'Score',
      scoreOf: (s, t) => `${s} of ${t}`,
      pct: p => `${p}% correct`,
      name: 'Name', time: 'Time', date: 'Date',
      stripAria: 'Result by question',
      stateAria: (n, st) => `Question ${n}: ${st === 'ok' ? 'correct' : st === 'bad' ? 'wrong' : 'not answered'}`,
      retryErrors: n => `Review my ${n} ${n === 1 ? 'mistake' : 'mistakes'}`,
      retry: 'Retake the test', pdf: 'Save as PDF', share: 'Share', home: 'Home', homeAria: 'Back to start',
      byTopic: 'Result by topic',
      wrongTitle: 'Questions you missed',
      rightTitle: 'Questions you got right',
      yourAnswer: 'Your answer', skipped: 'Not answered', noOption: 'You did not choose an option.',
      correct: 'Correct answer', gotIt: 'You got it right', explanation: 'Explanation',
      noWrong: 'You did not miss any. Below you can review the explanations for every question.',
      noRight: 'None yet. Read the explanations above and try again.',
      shareTitle: 'Test result',
      shareHead: 'Mechanical comprehension test',
      shareFails: f => `Questions missed: ${f}`,
      shareNoFails: 'No mistakes',
      copied: 'Result copied. Paste it anywhere.',
      cantShare: 'Sharing is not available in this browser.',
      startOther: 'If you start another one, the progress of the previous test is lost.',
      continuePrev: 'Continue the previous one',
      startName: n => `Start ${n}`,
      discarded: 'Test discarded',
      saved: 'Your progress is saved',
      locale: 'en-US'
    }
  };
  const S = () => STR[window.LANG];
  const tl = v => (v && typeof v === 'object' ? v[window.LANG] || v.es : v);   // texto bilingüe {es, en}

  function setLang(l) {
    if (l !== 'es' && l !== 'en' || l === window.LANG) return;
    if (route() === 'test') commitTime();
    window.LANG = l; db.lang = l; save();
    applyDocLang();
    const y = window.scrollY, m = document.getElementById('qmain'), my = m ? m.scrollTop : 0;
    render(true);
    window.scrollTo(0, y);
    const m2 = document.getElementById('qmain'); if (m2) m2.scrollTop = my;
  }
  function applyDocLang() {
    document.documentElement.lang = window.LANG;
    document.title = S().title;
    const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', S().metaDesc);
  }
  const langSwitch = (cls = '') => `<div class="lang ${cls}" role="group" aria-label="${S().langGroup}">
      <button type="button" data-act="lang" data-l="es" aria-pressed="${window.LANG === 'es'}" lang="es" title="Español">ES</button>
      <button type="button" data-act="lang" data-l="en" aria-pressed="${window.LANG === 'en'}" lang="en" title="English">EN</button>
    </div>`;

  /* ---------- Utilidades ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const testById = id => TESTS.find(t => t.id === id);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const orderOf = (c, i, q) => (c.orders && c.orders[i]) || q.o.map((_, k) => k);
  const pad = n => String(n).padStart(2, '0');
  const fmtClock = ms => { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); return (h ? h + ':' + pad(Math.floor(s / 60) % 60) : Math.floor(s / 60)) + ':' + pad(s % 60); };
  const fmtLong = ms => { const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m ? `${m} min ${pad(s % 60)} s` : `${s} s`; };
  const fmtDate = ts => new Date(ts).toLocaleDateString(S().locale, { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
    new Date(ts).toLocaleTimeString(S().locale, { hour: 'numeric', minute: '2-digit' });

  const ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    down: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const el = document.createElement('div');
    el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 2600);
  }

  /* ---------- Modal (hoja inferior) ---------- */
  function openModal(html, label) {
    closeModal();
    const v = document.createElement('div');
    v.className = 'veil';
    v.innerHTML = `<div class="panel" role="dialog" aria-modal="true" aria-label="${esc(label)}">${html}</div>`;
    v.addEventListener('click', e => { if (e.target === v) closeModal(); });
    document.body.appendChild(v);
    const f = v.querySelector('button'); if (f) f.focus({ preventScroll: true });
  }
  function closeModal() { document.querySelectorAll('.veil').forEach(v => v.remove()); }

  /* ---------- Cronómetro ---------- */
  let tick = null;
  function elapsed() {
    const c = db.current; if (!c) return 0;
    return c.elapsed + (c.resumeAt ? Date.now() - c.resumeAt : 0);
  }
  function commitTime() {
    const c = db.current;
    if (c && c.resumeAt) { c.elapsed += Date.now() - c.resumeAt; c.resumeAt = Date.now(); save(); }
  }
  function startClock() {
    stopClock();
    const c = db.current; if (!c) return;
    c.resumeAt = Date.now();
    tick = setInterval(() => { const el = document.getElementById('clock'); if (el) el.textContent = fmtClock(elapsed()); }, 1000);
  }
  function stopClock() {
    if (tick) clearInterval(tick); tick = null;
    const c = db.current;
    if (c && c.resumeAt) { c.elapsed += Date.now() - c.resumeAt; c.resumeAt = null; save(); }
  }
  document.addEventListener('visibilitychange', () => {
    if (route() !== 'test') return;
    if (document.hidden) stopClock(); else startClock();
  });
  window.addEventListener('pagehide', stopClock);

  /* ---------- Rutas ---------- */
  const route = () => (location.hash.replace(/^#\/?/, '') || 'inicio');
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  window.addEventListener('hashchange', () => render());

  /** keep = true cuando solo cambia el idioma: no reinicia el cronómetro ni cierra el estado. */
  function render(keep) {
    if (!keep) closeModal();
    const r = route();
    if (r !== 'test') stopClock();
    if (r === 'test' && db.current) return renderQuiz(!keep);
    if (r === 'resultado' && db.lastResult) return renderResult(keep);
    if (r !== 'inicio') { history.replaceState(null, '', '#/'); }
    renderHome(keep);
  }

  /* =========================================================================
     INICIO
     ========================================================================= */
  function heroArt() {
    const r1 = 50, n1 = 26, r2_ = 30, n2 = 15, r3 = 40, n3 = 21;
    const x1 = 62, y1 = 82;
    const d12 = D.mesh(r1, r2_), d23 = D.mesh(r2_, r3);
    const x2 = x1 + d12, y2 = y1;
    const x3 = x2 + d23 * Math.cos(D.rad(-38)), y3 = y2 + d23 * Math.sin(D.rad(-38));
    const g = (cls, x, y, r, n, ph) => `<g class="${cls}" style="transform-origin:${D.r2(x)}px ${D.r2(y)}px">${D.gear(x, y, r, n, { phase: ph })}</g>`;
    const right = x3 + r3;
    const body = g('g1', x1, y1, r1, n1, 0) + g('g2', x2, y2, r2_, n2, 6) + g('g3', x3, y3, r3, n3, 3) +
      D.dim(x1 - r1, right, 150, S().heroDim, { ly: 139 }) +
      D.line(x1 - r1, 136, x1 - r1, 155, 'ext') + D.line(right, 60, right, 155, 'ext');
    return `<svg class="dg hero-art" viewBox="0 0 ${Math.ceil(right + 12)} 160" aria-hidden="true">${body}</svg>`;
  }

  let heroPlayed = false;
  function renderHome(keep) {
    const s = S(), c = db.current;
    let resume = '';
    if (c) {
      const t = testById(c.testId);
      const done = c.answers.filter(a => a !== null).length;
      resume = `<div class="resume">
        <div><strong>${s.unfinished}</strong>
        <span>${esc(t.name)}${c.mode === 'errors' ? ', ' + s.errorsReview : ''}: ${s.answeredOf(done, c.ids.length)}, ${fmtLong(c.elapsed)}</span></div>
        <div class="row"><button class="btn btn-primary" data-act="resume">${s.resume}</button><button class="btn btn-ghost" data-act="discard">${s.discard}</button></div>
      </div>`;
    }
    const cards = TESTS.map(t => {
      const b = db.best[t.id];
      const best = b ? `<span class="best">${s.bestScore(b.score, b.total)}</span>` : `<span>${s.noAttempts}</span>`;
      return `<button class="sheet-card" data-act="start" data-test="${t.id}" aria-label="${esc(s.startAria(t.name, tl(t.level)))}">
        <span class="num" aria-hidden="true">${t.id}</span>
        <h2>${esc(tl(t.level))}</h2>
        <p>${esc(tl(t.blurb))}</p>
        <div class="meta"><span>${s.nQuestions(t.qs.length)}</span><span>${s.aboutMin(SUGGESTED_MIN)}</span>${best}</div>
        <span class="go" aria-hidden="true">${ICON.right}</span>
      </button>`;
    }).join('');

    app.innerHTML = `<main class="home${heroPlayed ? ' calm' : ''}">
      <div class="topbar">${langSwitch()}</div>
      <header class="hero">
        ${heroArt()}
        <h1>${s.title}</h1>
        <p>${s.heroP}</p>
      </header>
      ${resume}
      <div class="field">
        <label for="name">${s.nameLabel}</label>
        <input id="name" type="text" autocomplete="name" maxlength="60" placeholder="${s.namePh}" value="${esc(db.name)}">
      </div>
      <section class="tests" aria-label="${s.testsAria}">${cards}</section>
      <section class="how">
        <h3>${s.howTitle}</h3>
        <ol>${s.how.map(li => `<li>${li}</li>`).join('')}</ol>
      </section>
      <p class="credits">${s.credits}</p>
    </main>`;
    heroPlayed = true;
    const inp = document.getElementById('name');
    inp.addEventListener('input', () => { db.name = inp.value.trim(); save(); });
    if (!keep) window.scrollTo(0, 0);
  }

  function startTest(testId, mode = 'full', ids) {
    const t = testById(testId);
    const list = ids || t.qs.map((_, i) => i);
    // Las opciones que son enunciados (sh) se barajan en cada intento; las numéricas conservan su orden.
    const orders = list.map(qi => { const q = t.qs[qi], o = q.o.map((_, k) => k); return q.sh ? shuffle(o) : o; });
    db.current = { testId, mode, ids: list, orders, answers: list.map(() => null), idx: 0, elapsed: 0, resumeAt: null, startedAt: Date.now() };
    save();
    go('#/test');
  }

  /* =========================================================================
     TEST
     ========================================================================= */
  function renderQuiz(fresh) {
    const s = S(), c = db.current;
    const t = testById(c.testId), n = c.ids.length, i = c.idx, q = t.qs[c.ids[i]], v = QV(q), sel = c.answers[i];
    const ticks = c.ids.map((_, k) => `<i class="${k === i ? 'now' : c.answers[k] !== null ? 'done' : ''}"></i>`).join('');
    app.innerHTML = `<section class="quiz">
      <header class="qbar">
        <button class="ico-btn" data-act="exit" aria-label="${s.exitAria}">${ICON.close}</button>
        <div class="qtitle"><strong>${esc(t.name)}${c.mode === 'errors' ? ': ' + s.errorsReview : ''}</strong><span>${esc(tl(t.level))}</span></div>
        ${langSwitch('sm')}
        <div class="timer" title="${s.elapsed}">${ICON.clock}<span id="clock">${fmtClock(elapsed())}</span></div>
      </header>
      <div class="ticks" style="--n:${n}" aria-hidden="true">${ticks}</div>
      <main class="qmain" id="qmain">
        <div class="qgrid">
          <figure class="drawing">
            <div class="frame">${v.d}</div>
            <figcaption class="rotulo"><div><span>${s.question}</span> <b>${s.of(i + 1, n)}</b></div><div>${esc(v.t)}</div></figcaption>
          </figure>
          <div class="qbody">
            <p class="qtext" id="qtext">${esc(v.q)}</p>
            <div class="opts" role="radiogroup" aria-labelledby="qtext">
              ${orderOf(c, i, q).map(k => `<button class="opt" role="radio" aria-checked="${sel === k}" data-act="pick" data-k="${k}"><span class="mark" aria-hidden="true"></span><span>${esc(v.o[k])}</span></button>`).join('')}
            </div>
          </div>
        </div>
      </main>
      <footer class="qnav">
        <button class="btn btn-ghost" data-act="prev" ${i === 0 ? 'disabled' : ''} aria-label="${s.prevAria}">${ICON.left}<span>${s.prev}</span></button>
        <button class="pos" data-act="map" aria-label="${s.mapAria}">${ICON.grid}${i + 1}/${n}</button>
        ${i < n - 1
          ? `<button class="btn btn-primary" data-act="next" aria-label="${s.nextAria}"><span>${s.next}</span>${ICON.right}</button>`
          : `<button class="btn btn-primary" data-act="finish">${s.finish}</button>`}
      </footer>
    </section>`;
    if (fresh || !tick) startClock();
  }

  function pick(k) {
    const c = db.current; c.answers[c.idx] = k; save();
    document.querySelectorAll('.opt').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.k === k)));
    const ticks = document.querySelectorAll('.ticks i');
    if (ticks[c.idx]) ticks[c.idx].className = 'now';
  }

  function moveTo(i) {
    const c = db.current;
    c.idx = Math.max(0, Math.min(c.ids.length - 1, i)); save();
    renderQuiz(false);
    const m = document.getElementById('qmain'); if (m) m.scrollTop = 0;
  }

  function showMap() {
    const s = S(), c = db.current;
    const cells = c.ids.map((_, k) => `<button class="${k === c.idx ? 'now' : ''} ${c.answers[k] !== null ? 'done' : ''}" data-act="goto" data-i="${k}" aria-label="${s.qAria(k + 1, c.answers[k] !== null)}">${k + 1}</button>`).join('');
    const left = c.answers.filter(a => a === null).length;
    openModal(`<h3>${s.mapTitle}</h3><p>${left ? (left === 1 ? s.leftOne : s.leftN(left)) : s.allDone} ${s.tapNumber}</p>
      <div class="qmap">${cells}</div>
      <div class="legend"><span><i class="d"></i>${s.answered}</span><span><i></i>${s.unanswered}</span></div>
      <div class="actions"><button class="btn btn-primary" data-act="finish">${s.finishTest}</button><button class="btn btn-ghost" data-act="close">${s.keepGoing}</button></div>`, s.mapLabel);
  }

  function askFinish() {
    const s = S(), c = db.current;
    const left = c.answers.filter(a => a === null).length;
    if (!left) return finish();
    const first = c.answers.findIndex(a => a === null);
    openModal(`<h3>${s.missingTitle(left)}</h3>
      <p>${s.missingP}</p>
      <div class="actions"><button class="btn btn-primary" data-act="goto" data-i="${first}">${s.goTo(first + 1)}</button>
      <button class="btn" data-act="finish-now">${s.finishAnyway}</button></div>`, s.confirmLabel);
  }

  function finish() {
    stopClock();
    const c = db.current, t = testById(c.testId);
    const score = c.ids.reduce((sum, qi, k) => sum + (c.answers[k] === t.qs[qi].a ? 1 : 0), 0);
    const res = { testId: c.testId, mode: c.mode, ids: c.ids, answers: c.answers, elapsed: c.elapsed, date: Date.now(), score, total: c.ids.length, name: db.name };
    db.lastResult = res;
    if (c.mode === 'full') {
      const b = db.best[c.testId];
      if (!b || score > b.score || (score === b.score && res.elapsed < b.elapsed)) db.best[c.testId] = { score, total: res.total, elapsed: res.elapsed, date: res.date };
    }
    db.history = [{ testId: res.testId, mode: res.mode, score, total: res.total, elapsed: res.elapsed, date: res.date }].concat(db.history || []).slice(0, 30);
    db.current = null;
    save();
    go('#/resultado');
  }

  /* =========================================================================
     RESULTADO Y REPORTE
     ========================================================================= */
  const verdict = p => S().verdict[p >= 90 ? 0 : p >= 75 ? 1 : p >= 50 ? 2 : 3];

  function renderResult(keep) {
    const s = S(), r = db.lastResult, t = testById(r.testId);
    const items = r.ids.map((qi, k) => {
      const q = t.qs[qi], a = r.answers[k];
      return { k, num: qi + 1, q, v: QV(q), a, state: a === null ? 'skip' : a === q.a ? 'ok' : 'bad' };
    });
    const wrong = items.filter(x => x.state !== 'ok'), right = items.filter(x => x.state === 'ok');
    const pct = Math.round((r.score / r.total) * 100);

    // Por tema
    const byTopic = {};
    items.forEach(x => { const o = byTopic[x.v.t] || (byTopic[x.v.t] = { ok: 0, n: 0 }); o.n++; if (x.state === 'ok') o.ok++; });
    const topics = Object.entries(byTopic).sort((a, b) => (a[1].ok / a[1].n) - (b[1].ok / b[1].n) || b[1].n - a[1].n)
      .map(([name, o]) => `<div class="topic"><span>${esc(name)}</span><b>${o.ok}/${o.n}</b><div class="bar"><i style="width:${(o.ok / o.n) * 100}%"></i></div></div>`).join('');

    const strip = items.map(x => `<a href="#r-${x.k}" class="${x.state}" data-act="jump" data-k="${x.k}" aria-label="${s.stateAria(x.num, x.state)}">${x.num}</a>`).join('');

    const wrongHtml = wrong.length ? wrong.map(x => `
      <article class="item ${x.state}" id="r-${x.k}">
        <div class="ih"><b>${s.question} ${x.num}</b><span>${esc(x.v.t)}</span></div>
        <p class="iq">${esc(x.v.q)}</p>
        <div class="idg">${x.v.d}</div>
        <div class="ans">
          <div class="yours ${x.state === 'skip' ? 'skipped' : ''}"><small>${x.state === 'skip' ? s.skipped : s.yourAnswer}</small>${x.state === 'skip' ? s.noOption : esc(x.v.o[x.a])}</div>
          <div class="right"><small>${s.correct}</small>${esc(x.v.o[x.q.a])}</div>
        </div>
        <div class="expl"><small>${s.explanation}</small><p>${esc(x.v.e)}</p></div>
      </article>`).join('')
      : `<p class="empty">${s.noWrong}</p>`;

    const rightHtml = right.length ? right.map(x => `
      <details class="item ok" id="r-${x.k}">
        <summary><div><div class="ih"><b>${s.question} ${x.num}</b><span>${esc(x.v.t)}</span></div><p class="iq">${esc(x.v.q)}</p></div>${ICON.down}</summary>
        <div class="idg">${x.v.d}</div>
        <div class="ans"><div class="right"><small>${s.gotIt}</small>${esc(x.v.o[x.q.a])}</div></div>
        <div class="expl"><small>${s.explanation}</small><p>${esc(x.v.e)}</p></div>
      </details>`).join('')
      : `<p class="empty">${s.noRight}</p>`;

    app.innerHTML = `<main class="result">
      <div class="rbar">
        <button class="ico-btn" data-act="home" aria-label="${s.homeAria}">${ICON.close}</button>
        <div class="qtitle"><strong>${s.result}</strong><span>${esc(t.name)}, ${esc(tl(t.level))}${r.mode === 'errors' ? ': ' + s.errorsReview : ''}</span></div>
        ${langSwitch('sm no-print')}
      </div>
      <section class="score" aria-label="${s.scoreAria}">
        <div class="frame">
          <div class="big" aria-label="${s.scoreOf(r.score, r.total)}"><span class="n">${r.score}</span><span class="of">/${r.total}</span></div>
          <div>
            <div class="pct">${s.pct(pct)}</div>
            <p class="verdict">${verdict(pct)}</p>
            <div class="facts">
              ${r.name ? `<span>${s.name}: <b>${esc(r.name)}</b></span>` : ''}
              <span>${s.time}: <b>${fmtLong(r.elapsed)}</b></span>
              <span>${s.date}: <b>${fmtDate(r.date)}</b></span>
            </div>
          </div>
          <nav class="strip" aria-label="${s.stripAria}">${strip}</nav>
        </div>
      </section>
      <div class="ractions">
        ${wrong.length ? `<button class="btn btn-primary wide" data-act="retry-errors">${s.retryErrors(wrong.length)}</button>` : ''}
        <button class="btn" data-act="retry">${s.retry}</button>
        <button class="btn" data-act="print">${s.pdf}</button>
        <button class="btn" data-act="share">${s.share}</button>
        <button class="btn btn-ghost" data-act="home">${s.home}</button>
      </div>
      <section class="block"><h2>${s.byTopic}</h2><div class="topics">${topics}</div></section>
      <section class="block"><h2>${s.wrongTitle} <small>(${wrong.length})</small></h2>${wrongHtml}</section>
      <section class="block"><h2>${s.rightTitle} <small>(${right.length})</small></h2>${rightHtml}</section>
    </main>`;
    if (!keep) window.scrollTo(0, 0);
  }

  function jumpTo(k) {
    const el = document.getElementById('r-' + k); if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  async function share() {
    const s = S(), r = db.lastResult, t = testById(r.testId);
    const fails = r.ids.map((qi, k) => (r.answers[k] === t.qs[qi].a ? null : qi + 1)).filter(Boolean);
    const text = `${s.shareHead}\n${r.name ? r.name + ' — ' : ''}${t.name} (${tl(t.level)}): ${r.score}/${r.total}, ${s.pct(Math.round(r.score / r.total * 100))}\n${s.time}: ${fmtLong(r.elapsed)}\n` +
      (fails.length ? s.shareFails(fails.join(', ')) : s.shareNoFails);
    const url = location.href.split('#')[0];
    try {
      if (navigator.share) { await navigator.share({ title: s.shareTitle, text, url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + '\n' + url); toast(s.copied); }
    catch (e) { toast(s.cantShare); }
  }

  // Abrir todas las explicaciones al imprimir y restaurar después
  let openedForPrint = [];
  window.addEventListener('beforeprint', () => {
    openedForPrint = [...document.querySelectorAll('details.item:not([open])')];
    openedForPrint.forEach(d => (d.open = true));
  });
  window.addEventListener('afterprint', () => { openedForPrint.forEach(d => (d.open = false)); openedForPrint = []; });

  /* =========================================================================
     EVENTOS
     ========================================================================= */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, s = S();
    switch (act) {
      case 'lang': setLang(el.dataset.l); break;
      case 'start': {
        const id = +el.dataset.test;
        if (db.current && db.current.answers.some(a => a !== null)) {
          openModal(`<h3>${s.unfinished}</h3><p>${s.startOther}</p>
            <div class="actions"><button class="btn btn-primary" data-act="resume">${s.continuePrev}</button>
            <button class="btn" data-act="start-force" data-test="${id}">${esc(s.startName(testById(id).name))}</button></div>`, s.unfinished);
        } else startTest(id);
        break;
      }
      case 'start-force': startTest(+el.dataset.test); break;
      case 'resume': go('#/test'); break;
      case 'discard': db.current = null; save(); renderHome(); toast(s.discarded); break;
      case 'pick': pick(+el.dataset.k); break;
      case 'prev': moveTo(db.current.idx - 1); break;
      case 'next': moveTo(db.current.idx + 1); break;
      case 'map': showMap(); break;
      case 'goto': closeModal(); moveTo(+el.dataset.i); break;
      case 'close': closeModal(); break;
      case 'finish': closeModal(); askFinish(); break;
      case 'finish-now': closeModal(); finish(); break;
      case 'exit': stopClock(); go('#/'); toast(s.saved); break;
      case 'home': go('#/'); break;
      case 'retry': startTest(db.lastResult.testId); break;
      case 'retry-errors': {
        const r = db.lastResult, t = testById(r.testId);
        const ids = r.ids.filter((qi, k) => r.answers[k] !== t.qs[qi].a);
        startTest(r.testId, 'errors', ids);
        break;
      }
      case 'print': window.print(); break;
      case 'share': share(); break;
      case 'jump': e.preventDefault(); jumpTo(+el.dataset.k); break;
    }
  });

  // Teclado (computador): 1-4 o A-D eligen; flechas navegan; Enter avanza
  document.addEventListener('keydown', e => {
    if (route() !== 'test' || !db.current || document.querySelector('.veil')) {
      if (e.key === 'Escape') closeModal();
      return;
    }
    if (e.target.tagName === 'INPUT') return;
    const c = db.current, q = testById(c.testId).qs[c.ids[c.idx]];
    const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const pos = map[e.key.toLowerCase()], order = orderOf(c, c.idx, q);
    if (pos !== undefined && pos < order.length) { pick(order[pos]); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || (e.key === 'Enter' && e.target === document.body)) { if (c.idx < c.ids.length - 1) moveTo(c.idx + 1); else askFinish(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { moveTo(c.idx - 1); e.preventDefault(); }
  });

  applyDocLang();
  render();
})();
