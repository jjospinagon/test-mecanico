/* =========================================================================
   app.js — Lógica de la app: inicio, test, resultado y reporte.
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
  const db = Object.assign({ name: '', best: {}, history: [], current: null, lastResult: null }, store.load());
  const save = () => store.save(db);

  /* ---------- Utilidades ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const testById = id => TESTS.find(t => t.id === id);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const orderOf = (c, i, q) => (c.orders && c.orders[i]) || q.o.map((_, k) => k);
  const pad = n => String(n).padStart(2, '0');
  const fmtClock = ms => { const s = Math.floor(ms / 1000); const h = Math.floor(s / 3600); return (h ? h + ':' + pad(Math.floor(s / 60) % 60) : Math.floor(s / 60)) + ':' + pad(s % 60); };
  const fmtLong = ms => { const s = Math.round(ms / 1000), m = Math.floor(s / 60); return m ? `${m} min ${pad(s % 60)} s` : `${s} s`; };
  const fmtDate = ts => new Date(ts).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
    new Date(ts).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });

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
    if (c && c.resumeAt) { c.elapsed += Date.now() - c.resumeAt; c.resumeAt = null; save(); }
  }
  function startClock() {
    stopClock();
    const c = db.current; if (!c) return;
    c.resumeAt = Date.now();
    tick = setInterval(() => { const el = document.getElementById('clock'); if (el) el.textContent = fmtClock(elapsed()); }, 1000);
  }
  function stopClock() { if (tick) clearInterval(tick); tick = null; commitTime(); }
  document.addEventListener('visibilitychange', () => {
    if (route() !== 'test') return;
    if (document.hidden) stopClock(); else startClock();
  });
  window.addEventListener('pagehide', commitTime);

  /* ---------- Rutas ---------- */
  const route = () => (location.hash.replace(/^#\/?/, '') || 'inicio');
  function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
  window.addEventListener('hashchange', render);

  function render() {
    closeModal();
    const r = route();
    if (r !== 'test') stopClock();
    if (r === 'test' && db.current) return renderQuiz(true);
    if (r === 'resultado' && db.lastResult) return renderResult();
    if (r !== 'inicio') { history.replaceState(null, '', '#/'); }
    renderHome();
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
      D.dim(x1 - r1, right, 150, '3 tests, 60 preguntas', { ly: 139 }) +
      D.line(x1 - r1, 136, x1 - r1, 155, 'ext') + D.line(right, 60, right, 155, 'ext');
    return `<svg class="dg hero-art" viewBox="0 0 ${Math.ceil(right + 12)} 160" aria-hidden="true">${body}</svg>`;
  }

  function renderHome() {
    const c = db.current;
    let resume = '';
    if (c) {
      const t = testById(c.testId);
      const done = c.answers.filter(a => a !== null).length;
      resume = `<div class="resume">
        <div><strong>Tienes un test sin terminar</strong>
        <span>${esc(t.name)}${c.mode === 'errors' ? ', repaso de errores' : ''}: ${done} de ${c.ids.length} respondidas, ${fmtLong(c.elapsed)}</span></div>
        <div class="row"><button class="btn btn-primary" data-act="resume">Continuar</button><button class="btn btn-ghost" data-act="discard">Descartar</button></div>
      </div>`;
    }
    const cards = TESTS.map(t => {
      const b = db.best[t.id];
      const best = b ? `<span class="best">Mejor resultado: ${b.score}/${b.total}</span>` : '<span>Aún sin intentos</span>';
      return `<button class="sheet-card" data-act="start" data-test="${t.id}" aria-label="Empezar ${esc(t.name)}, ${esc(t.level)}">
        <span class="num" aria-hidden="true">${t.id}</span>
        <h2>${esc(t.level)}</h2>
        <p>${esc(t.blurb)}</p>
        <div class="meta"><span>${t.qs.length} preguntas</span><span>Unos ${SUGGESTED_MIN} minutos</span>${best}</div>
        <span class="go" aria-hidden="true">${ICON.right}</span>
      </button>`;
    }).join('');

    app.innerHTML = `<main class="home">
      <header class="hero">
        ${heroArt()}
        <h1>Comprensión mecánica</h1>
        <p>Práctica con diagramas: engranajes, poleas, palancas, resortes, circuitos y fluidos. Al terminar cada test ves tu puntaje y la explicación de cada pregunta que fallaste.</p>
      </header>
      ${resume}
      <div class="field">
        <label for="name">Tu nombre, para que aparezca en el reporte</label>
        <input id="name" type="text" autocomplete="name" maxlength="60" placeholder="Escribe tu nombre" value="${esc(db.name)}">
      </div>
      <section class="tests" aria-label="Tests disponibles">${cards}</section>
      <section class="how">
        <h3>Cómo funciona</h3>
        <ol>
          <li>Elige un test. Cada uno tiene 20 preguntas con su diagrama.</li>
          <li>Responde a tu ritmo; puedes ir y volver entre preguntas y cambiar respuestas antes de terminar.</li>
          <li>Al terminar ves el puntaje y, en cada error, la respuesta correcta con su explicación completa.</li>
          <li>Guarda el reporte en PDF o compártelo, y repasa solo las preguntas que fallaste.</li>
        </ol>
      </section>
      <p class="credits">Preguntas, diagramas y explicaciones originales, elaborados para esta app de práctica. Tu avance se guarda solo en este dispositivo.</p>
    </main>`;
    const inp = document.getElementById('name');
    inp.addEventListener('input', () => { db.name = inp.value.trim(); save(); });
    window.scrollTo(0, 0);
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
    const c = db.current;
    const t = testById(c.testId), n = c.ids.length, i = c.idx, q = t.qs[c.ids[i]], sel = c.answers[i];
    const ticks = c.ids.map((_, k) => `<i class="${k === i ? 'now' : c.answers[k] !== null ? 'done' : ''}"></i>`).join('');
    const num = `${i + 1} de ${n}`;
    app.innerHTML = `<section class="quiz">
      <header class="qbar">
        <button class="ico-btn" data-act="exit" aria-label="Salir al inicio (se guarda el avance)">${ICON.close}</button>
        <div class="qtitle"><strong>${esc(t.name)}${c.mode === 'errors' ? ': repaso de errores' : ''}</strong><span>${esc(t.level)}</span></div>
        <div class="timer" title="Tiempo transcurrido">${ICON.clock}<span id="clock">${fmtClock(elapsed())}</span></div>
      </header>
      <div class="ticks" style="--n:${n}" aria-hidden="true">${ticks}</div>
      <main class="qmain" id="qmain">
        <div class="qgrid">
          <figure class="drawing">
            <div class="frame">${q.d}</div>
            <figcaption class="rotulo"><div><span>Pregunta</span> <b>${num}</b></div><div>${esc(q.t)}</div></figcaption>
          </figure>
          <div class="qbody">
            <p class="qtext" id="qtext">${esc(q.q)}</p>
            <div class="opts" role="radiogroup" aria-labelledby="qtext">
              ${orderOf(c, i, q).map(k => `<button class="opt" role="radio" aria-checked="${sel === k}" data-act="pick" data-k="${k}"><span class="mark" aria-hidden="true"></span><span>${esc(q.o[k])}</span></button>`).join('')}
            </div>
          </div>
        </div>
      </main>
      <footer class="qnav">
        <button class="btn btn-ghost" data-act="prev" ${i === 0 ? 'disabled' : ''} aria-label="Pregunta anterior">${ICON.left}<span>Anterior</span></button>
        <button class="pos" data-act="map" aria-label="Ver todas las preguntas">${ICON.grid}${i + 1}/${n}</button>
        ${i < n - 1
          ? `<button class="btn btn-primary" data-act="next" aria-label="Pregunta siguiente"><span>Siguiente</span>${ICON.right}</button>`
          : `<button class="btn btn-primary" data-act="finish">Terminar</button>`}
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
    const c = db.current;
    const cells = c.ids.map((_, k) => `<button class="${k === c.idx ? 'now' : ''} ${c.answers[k] !== null ? 'done' : ''}" data-act="goto" data-i="${k}" aria-label="Pregunta ${k + 1}${c.answers[k] !== null ? ', respondida' : ', sin responder'}">${k + 1}</button>`).join('');
    const left = c.answers.filter(a => a === null).length;
    openModal(`<h3>Preguntas</h3><p>${left ? (left === 1 ? 'Te falta 1 por responder.' : `Te faltan ${left} por responder.`) : 'Ya respondiste todas.'} Toca un número para ir a esa pregunta.</p>
      <div class="qmap">${cells}</div>
      <div class="legend"><span><i class="d"></i>Respondida</span><span><i></i>Sin responder</span></div>
      <div class="actions"><button class="btn btn-primary" data-act="finish">Terminar el test</button><button class="btn btn-ghost" data-act="close">Seguir respondiendo</button></div>`, 'Mapa de preguntas');
  }

  function askFinish() {
    const c = db.current;
    const left = c.answers.filter(a => a === null).length;
    if (!left) return finish();
    const first = c.answers.findIndex(a => a === null);
    openModal(`<h3>Te ${left === 1 ? 'falta 1 pregunta' : `faltan ${left} preguntas`}</h3>
      <p>Las preguntas sin responder cuentan como error. Puedes volver a la primera que falta o terminar ahora.</p>
      <div class="actions"><button class="btn btn-primary" data-act="goto" data-i="${first}">Ir a la pregunta ${first + 1}</button>
      <button class="btn" data-act="finish-now">Terminar de todas formas</button></div>`, 'Confirmar fin del test');
  }

  function finish() {
    stopClock();
    const c = db.current, t = testById(c.testId);
    const score = c.ids.reduce((s, qi, k) => s + (c.answers[k] === t.qs[qi].a ? 1 : 0), 0);
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
  function verdict(p) {
    if (p >= 90) return 'Excelente. Dominas estos principios; prueba con el siguiente test.';
    if (p >= 75) return 'Buen nivel. Lee las explicaciones de los errores para afinar.';
    if (p >= 50) return 'Vas bien encaminado. Revisa los temas con más errores y vuelve a intentarlo.';
    return 'Hay que reforzar la base. Lee con calma cada explicación y repite el test.';
  }

  function renderResult() {
    const r = db.lastResult, t = testById(r.testId);
    const items = r.ids.map((qi, k) => {
      const q = t.qs[qi], a = r.answers[k];
      return { k, num: qi + 1, q, a, state: a === null ? 'skip' : a === q.a ? 'ok' : 'bad' };
    });
    const wrong = items.filter(x => x.state !== 'ok'), right = items.filter(x => x.state === 'ok');
    const pct = Math.round((r.score / r.total) * 100);

    // Por tema
    const byTopic = {};
    items.forEach(x => { const o = byTopic[x.q.t] || (byTopic[x.q.t] = { ok: 0, n: 0 }); o.n++; if (x.state === 'ok') o.ok++; });
    const topics = Object.entries(byTopic).sort((a, b) => (a[1].ok / a[1].n) - (b[1].ok / b[1].n) || b[1].n - a[1].n)
      .map(([name, o]) => `<div class="topic"><span>${esc(name)}</span><b>${o.ok}/${o.n}</b><div class="bar"><i style="width:${(o.ok / o.n) * 100}%"></i></div></div>`).join('');

    const strip = items.map(x => `<a href="#r-${x.k}" class="${x.state}" data-act="jump" data-k="${x.k}" aria-label="Pregunta ${x.num}: ${x.state === 'ok' ? 'correcta' : x.state === 'bad' ? 'incorrecta' : 'sin responder'}">${x.num}</a>`).join('');

    const wrongHtml = wrong.length ? wrong.map(x => `
      <article class="item ${x.state}" id="r-${x.k}">
        <div class="ih"><b>Pregunta ${x.num}</b><span>${esc(x.q.t)}</span></div>
        <p class="iq">${esc(x.q.q)}</p>
        <div class="idg">${x.q.d}</div>
        <div class="ans">
          <div class="yours ${x.state === 'skip' ? 'skipped' : ''}"><small>${x.state === 'skip' ? 'Sin responder' : 'Tu respuesta'}</small>${x.state === 'skip' ? 'No marcaste ninguna opción.' : esc(x.q.o[x.a])}</div>
          <div class="right"><small>Respuesta correcta</small>${esc(x.q.o[x.q.a])}</div>
        </div>
        <div class="expl"><small>Explicación</small><p>${esc(x.q.e)}</p></div>
      </article>`).join('')
      : '<p class="empty">No fallaste ninguna. Abajo puedes repasar las explicaciones de todas las preguntas.</p>';

    const rightHtml = right.length ? right.map(x => `
      <details class="item ok" id="r-${x.k}">
        <summary><div><div class="ih"><b>Pregunta ${x.num}</b><span>${esc(x.q.t)}</span></div><p class="iq">${esc(x.q.q)}</p></div>${ICON.down}</summary>
        <div class="idg">${x.q.d}</div>
        <div class="ans"><div class="right"><small>Respondiste bien</small>${esc(x.q.o[x.q.a])}</div></div>
        <div class="expl"><small>Explicación</small><p>${esc(x.q.e)}</p></div>
      </details>`).join('')
      : '<p class="empty">Ninguna todavía. Lee las explicaciones de arriba y vuelve a intentarlo.</p>';

    app.innerHTML = `<main class="result">
      <div class="rbar">
        <button class="ico-btn" data-act="home" aria-label="Volver al inicio">${ICON.close}</button>
        <div class="qtitle"><strong>Resultado</strong><span>${esc(t.name)}, ${esc(t.level)}${r.mode === 'errors' ? ': repaso de errores' : ''}</span></div>
      </div>
      <section class="score" aria-label="Puntaje">
        <div class="frame">
          <div class="big" aria-label="${r.score} de ${r.total}"><span class="n">${r.score}</span><span class="of">/${r.total}</span></div>
          <div>
            <div class="pct">${pct} % de aciertos</div>
            <p class="verdict">${verdict(pct)}</p>
            <div class="facts">
              ${r.name ? `<span>Nombre: <b>${esc(r.name)}</b></span>` : ''}
              <span>Tiempo: <b>${fmtLong(r.elapsed)}</b></span>
              <span>Fecha: <b>${fmtDate(r.date)}</b></span>
            </div>
          </div>
          <nav class="strip" aria-label="Resultado por pregunta">${strip}</nav>
        </div>
      </section>
      <div class="ractions">
        ${wrong.length ? `<button class="btn btn-primary wide" data-act="retry-errors">Repasar mis ${wrong.length} ${wrong.length === 1 ? 'error' : 'errores'}</button>` : ''}
        <button class="btn" data-act="retry">Repetir el test</button>
        <button class="btn" data-act="print">Guardar en PDF</button>
        <button class="btn" data-act="share">Compartir</button>
        <button class="btn btn-ghost" data-act="home">Inicio</button>
      </div>
      <section class="block"><h2>Resultado por tema</h2><div class="topics">${topics}</div></section>
      <section class="block"><h2>Preguntas que fallaste <small>(${wrong.length})</small></h2>${wrongHtml}</section>
      <section class="block"><h2>Preguntas que acertaste <small>(${right.length})</small></h2>${rightHtml}</section>
    </main>`;
    window.scrollTo(0, 0);
  }

  function jumpTo(k) {
    const el = document.getElementById('r-' + k); if (!el) return;
    if (el.tagName === 'DETAILS') el.open = true;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  async function share() {
    const r = db.lastResult, t = testById(r.testId);
    const fails = r.ids.map((qi, k) => (r.answers[k] === t.qs[qi].a ? null : qi + 1)).filter(Boolean);
    const text = `Test de comprensión mecánica\n${r.name ? r.name + ' — ' : ''}${t.name} (${t.level}): ${r.score}/${r.total}, ${Math.round(r.score / r.total * 100)} %\nTiempo: ${fmtLong(r.elapsed)}\n` +
      (fails.length ? `Preguntas falladas: ${fails.join(', ')}` : 'Sin errores');
    const url = location.href.split('#')[0];
    try {
      if (navigator.share) { await navigator.share({ title: 'Resultado del test', text, url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + '\n' + url); toast('Resultado copiado. Pégalo donde quieras.'); }
    catch (e) { toast('No se pudo compartir desde este navegador.'); }
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
    const act = el.dataset.act;
    switch (act) {
      case 'start': {
        const id = +el.dataset.test;
        if (db.current && db.current.answers.some(a => a !== null)) {
          openModal(`<h3>Tienes un test sin terminar</h3><p>Si empiezas otro, se pierde el avance del test anterior.</p>
            <div class="actions"><button class="btn btn-primary" data-act="resume">Continuar el anterior</button>
            <button class="btn" data-act="start-force" data-test="${id}">Empezar el ${esc(testById(id).name)}</button></div>`, 'Test sin terminar');
        } else startTest(id);
        break;
      }
      case 'start-force': startTest(+el.dataset.test); break;
      case 'resume': go('#/test'); break;
      case 'discard': db.current = null; save(); renderHome(); toast('Test descartado'); break;
      case 'pick': pick(+el.dataset.k); break;
      case 'prev': moveTo(db.current.idx - 1); break;
      case 'next': moveTo(db.current.idx + 1); break;
      case 'map': showMap(); break;
      case 'goto': closeModal(); moveTo(+el.dataset.i); break;
      case 'close': closeModal(); break;
      case 'finish': closeModal(); askFinish(); break;
      case 'finish-now': closeModal(); finish(); break;
      case 'exit': stopClock(); go('#/'); toast('Tu avance quedó guardado'); break;
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

  render();
})();
