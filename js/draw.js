/* =========================================================================
   draw.js — Primitivas SVG para los diagramas de las preguntas.
   Todas las funciones devuelven cadenas SVG. Los colores salen de CSS
   (clases .s, .gear, .rope, etc.), así el modo oscuro funciona solo.
   ========================================================================= */
(function (global) {
  'use strict';

  const r2 = n => Math.round(n * 100) / 100;
  const rad = d => (d * Math.PI) / 180;
  /** Punto polar: ángulo en grados, 0° = derecha, positivo = horario (eje y hacia abajo). */
  const P = (cx, cy, r, a) => [r2(cx + r * Math.cos(rad(a))), r2(cy + r * Math.sin(rad(a)))];
  const pts = arr => arr.map(p => p.join(',')).join(' ');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------- Contenedor y texto ---------- */
  function svg(w, h, body, label) {
    return `<svg class="dg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label || 'Diagrama de la pregunta')}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }
  /** Texto. cls: t (normal), tb (negrita), ts (pequeño), tq (signo de pregunta), tg (letra de engranaje) */
  function txt(x, y, s, cls = 't', anchor = 'middle', rot = 0) {
    const tr = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
    return `<text x="${r2(x)}" y="${r2(y)}" class="${cls}" text-anchor="${anchor}" dominant-baseline="central"${tr}>${esc(s)}</text>`;
  }
  const line = (x1, y1, x2, y2, cls = 's') => `<line class="${cls}" x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}"/>`;
  const poly = (arr, cls = 's') => `<polyline class="${cls}" points="${pts(arr)}"/>`;
  const polygon = (arr, cls = 's') => `<polygon class="${cls}" points="${pts(arr)}"/>`;
  const circ = (cx, cy, r, cls = 's') => `<circle class="${cls}" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"/>`;
  const rect = (x, y, w, h, cls = 's', rx = 0) => `<rect class="${cls}" x="${r2(x)}" y="${r2(y)}" width="${r2(w)}" height="${r2(h)}"${rx ? ` rx="${rx}"` : ''}/>`;
  const path = (d, cls = 's') => `<path class="${cls}" d="${d}"/>`;
  const dot = (x, y, r = 3.2, cls = 'dot') => circ(x, y, r, cls);

  /* ---------- Flechas ---------- */
  function head(x, y, u, cls = 'arw') {
    const L = 9, W = 4.6, n = [-u[1], u[0]];
    const bx = x - u[0] * L, by = y - u[1] * L;
    return `<polygon class="${cls}-h" points="${r2(x)},${r2(y)} ${r2(bx + n[0] * W)},${r2(by + n[1] * W)} ${r2(bx - n[0] * W)},${r2(by - n[1] * W)}"/>`;
  }
  /** Flecha recta con punta en (x2,y2). */
  function arrow(x1, y1, x2, y2, cls = 'arw') {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, u = [(x2 - x1) / L, (y2 - y1) / L];
    return line(x1, y1, x2 - u[0] * 6, y2 - u[1] * 6, cls) + head(x2, y2, u, cls);
  }
  /** Flecha curva de giro alrededor de (cx,cy). dir: 'cw' horario | 'ccw' antihorario. */
  function rot(cx, cy, r, dir, a0 = -150, span = 70, cls = 'arw') {
    const a1 = dir === 'cw' ? a0 + span : a0 - span;
    const [x0, y0] = P(cx, cy, r, a0), [x1, y1] = P(cx, cy, r, a1);
    const t = rad(a1);
    const u = dir === 'cw' ? [-Math.sin(t), Math.cos(t)] : [Math.sin(t), -Math.cos(t)];
    const sweep = dir === 'cw' ? 1 : 0;
    const large = span > 180 ? 1 : 0;
    return `<path class="${cls}" d="M${x0},${y0} A${r},${r} 0 ${large} ${sweep} ${x1},${y1}"/>` + head(x1 + u[0] * 3, y1 + u[1] * 3, u, cls);
  }

  /* ---------- Engranajes ---------- */
  const depthOf = r => Math.max(5, Math.min(9, r * 0.18));
  /** Radio primitivo (donde engranan los dientes). */
  const pitch = r => r - depthOf(r) / 2;
  /** Distancia entre centros de dos engranajes que engranan. */
  const mesh = (ra, rb) => pitch(ra) + pitch(rb);

  /**
   * Engranaje recto visto de frente.
   * o.label: letra en el cubo; o.phase: desfase angular; o.cls: clase extra; o.hub: radio del cubo
   */
  function gear(cx, cy, r, n, o = {}) {
    const d = depthOf(r), ri = r - d, s = 360 / n, ph = o.phase || 0;
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = ph + i * s;
      p.push(P(cx, cy, ri, a), P(cx, cy, r, a + s * 0.2), P(cx, cy, r, a + s * 0.46), P(cx, cy, ri, a + s * 0.66));
    }
    const hub = o.hub || (r >= 26 ? Math.max(10, r * 0.27) : r * 0.34);
    let out = `<g class="gear-g${o.cls ? ' ' + o.cls : ''}"><polygon class="gear" points="${pts(p)}"/>`;
    if (r >= 26) out += circ(cx, cy, ri - 4, 'gear-ring');
    out += circ(cx, cy, hub, 'hub');
    if (o.label && hub >= 9) out += txt(cx, cy + 0.5, o.label, 'tg');
    else out += dot(cx, cy, 2.2, 'axle');
    return out + '</g>';
  }

  /* ---------- Poleas, cuerdas y correas ---------- */
  function pulley(cx, cy, r, o = {}) {
    return `<g class="pul-g">${circ(cx, cy, r, 'pul')}${circ(cx, cy, r * 0.62, 'pul-in')}${o.label ? txt(cx, cy + 0.5, o.label, 'tg') : dot(cx, cy, 2.6, 'axle')}</g>`;
  }
  /** Correa abierta entre dos poleas alineadas en y (c1 a la izquierda). */
  function beltOpen(x1, y, r1, x2, r2_, cls = 'belt', wrap = false) {
    const d = x2 - x1, b = Math.acos((r1 - r2_) / d);
    const c = Math.cos(b), s = Math.sin(b);
    const lines = line(x1 + r1 * c, y - r1 * s, x2 + r2_ * c, y - r2_ * s, cls) +
           line(x1 + r1 * c, y + r1 * s, x2 + r2_ * c, y + r2_ * s, cls);
    if (!wrap) return lines;
    return lines +
           // tramos que abrazan las poleas
           `<path class="${cls}" d="M${r2(x1 + r1 * c)},${r2(y - r1 * s)} A${r1},${r1} 0 ${c > 0 ? 1 : 0} 0 ${r2(x1 + r1 * c)},${r2(y + r1 * s)}"/>` +
           `<path class="${cls}" d="M${r2(x2 + r2_ * c)},${r2(y - r2_ * s)} A${r2_},${r2_} 0 ${c < 0 ? 1 : 0} 1 ${r2(x2 + r2_ * c)},${r2(y + r2_ * s)}"/>`;
  }
  /** Correa cruzada entre dos poleas alineadas en y. */
  function beltCross(x1, y, r1, x2, r2_, cls = 'belt', wrap = false) {
    const d = x2 - x1, b = Math.acos((r1 + r2_) / d);
    const c = Math.cos(b), s = Math.sin(b);
    const lines = line(x1 + r1 * c, y - r1 * s, x2 - r2_ * c, y + r2_ * s, cls) +
           line(x1 + r1 * c, y + r1 * s, x2 - r2_ * c, y - r2_ * s, cls);
    if (!wrap) return lines;
    return lines +
           `<path class="${cls}" d="M${r2(x1 + r1 * c)},${r2(y - r1 * s)} A${r1},${r1} 0 1 0 ${r2(x1 + r1 * c)},${r2(y + r1 * s)}"/>` +
           `<path class="${cls}" d="M${r2(x2 - r2_ * c)},${r2(y + r2_ * s)} A${r2_},${r2_} 0 1 0 ${r2(x2 - r2_ * c)},${r2(y - r2_ * s)}"/>`;
  }

  /* ---------- Apoyos, techo, piso ---------- */
  function hatch(x1, x2, y, up = false, step = 9) {
    let h = line(x1, y, x2, y, 's2');
    for (let x = x1 + 3; x < x2; x += step) h += line(x, y, x + (up ? 6 : -6), y + (up ? -7 : 7), 'hatch');
    return h;
  }
  const ceil = (x1, x2, y) => hatch(x1, x2, y, true);
  const ground = (x1, x2, y) => hatch(x1, x2, y, false);
  /** Muro vertical empotrado (a la izquierda de x). */
  function wall(x, y1, y2) {
    let h = line(x, y1, x, y2, 's2');
    for (let y = y1 + 3; y < y2; y += 9) h += line(x, y, x - 7, y + 6, 'hatch');
    return h;
  }
  /** Apoyo triangular con vértice en (x,y). */
  function fulcrum(x, y, s = 16) {
    return polygon([[x, y], [x - s * 0.75, y + s * 1.15], [x + s * 0.75, y + s * 1.15]], 'fulc') + ground(x - s * 1.4, x + s * 1.4, y + s * 1.15);
  }
  /** Barra horizontal centrada en y. */
  const beam = (x1, x2, y, th = 8) => rect(x1, y - th / 2, x2 - x1, th, 'beam', 1.5);
  /** Caja/carga con texto (x,y = esquina superior izquierda). */
  function box(x, y, w, h, label, cls = 'load') {
    return rect(x, y, w, h, cls, 2) + (label ? txt(x + w / 2, y + h / 2 + 0.5, label, w < 34 ? 'ts' : 'tb') : '');
  }
  /** Cota horizontal con etiqueta. */
  function dim(x1, x2, y, label, o = {}) {
    const ly = o.ly != null ? o.ly : y - 9, lx = o.lx != null ? o.lx : (x1 + x2) / 2;
    return line(x1, y, x2, y, 'dim') + line(x1, y - 5, x1, y + 5, 'dim') + line(x2, y - 5, x2, y + 5, 'dim') +
      txt(lx, ly, label, 'td');
  }
  /** Cota vertical. */
  function dimV(x, y1, y2, label, o = {}) {
    const lx = o.lx != null ? o.lx : x + 8;
    return line(x, y1, x, y2, 'dim') + line(x - 5, y1, x + 5, y1, 'dim') + line(x - 5, y2, x + 5, y2, 'dim') +
      txt(lx, (y1 + y2) / 2, label, 'td', o.anchor || 'start');
  }

  /* ---------- Resortes ---------- */
  function springV(x, y1, y2, coils = 6, w = 9) {
    const lead = 6, seg = (y2 - y1 - 2 * lead) / (coils * 2);
    let d = `M${x},${y1} L${x},${y1 + lead}`;
    for (let i = 0; i < coils * 2; i++) d += ` L${r2(x + (i % 2 ? -w : w))},${r2(y1 + lead + seg * (i + 0.5))}`;
    d += ` L${x},${r2(y2 - lead)} L${x},${y2}`;
    return path(d, 'spr');
  }

  /* ---------- Circuitos ---------- */
  const wire = arr => poly(arr, 'wire');
  function bulb(x, y, label, o = {}) {
    const r = 11, k = r * 0.68;
    let out = circ(x, y, r, 'bulb') + line(x - k, y - k, x + k, y + k, 'bulb-x') + line(x - k, y + k, x + k, y - k, 'bulb-x');
    if (label) {
      const [dx, dy, an] = o.lab || [0, -22, 'middle'];
      out += txt(x + dx, y + dy, label, 'tb', an);
    }
    return out;
  }
  /** Batería. 'h' = sobre cable horizontal; 'v' = sobre cable vertical (positivo arriba). */
  function batt(x, y, orient = 'v', label) {
    if (orient === 'h') {
      return rect(x - 6, y - 14, 12, 28, 'mask') + line(x - 4, y - 13, x - 4, y + 13, 'plate') + line(x + 4, y - 7, x + 4, y + 7, 'plate2') +
        txt(x - 12, y - 16, '+', 'ts') + (label ? txt(x, y + 26, label, 'tb') : '');
    }
    return rect(x - 15, y - 6, 30, 12, 'mask') + line(x - 14, y - 4, x + 14, y - 4, 'plate') + line(x - 7, y + 4, x + 7, y + 4, 'plate2') +
      txt(x + 18, y - 9, '+', 'ts', 'start') + (label ? txt(x - 20, y, label, 'tb', 'end') : '');
  }
  /** Interruptor sobre cable horizontal entre xa y xb. */
  function sw(xa, xb, y, open, label, o = {}) {
    const len = xb - xa, a = rad(-28);
    const bx = open ? xa + len * Math.cos(a) : xb, by = open ? y + len * Math.sin(a) : y;
    return rect(xa, y - 3, len, 6, 'mask') + line(xa, y, bx, by, 'blade') + circ(xa, y, 3, 'term') + circ(xb, y, 3, 'term') +
      (label ? txt((xa + xb) / 2 + (o.dx || 0), y + (o.dy || 15), label, 'tb') : '');
  }
  /** Interruptor sobre cable vertical entre ya (arriba) y yb (abajo). */
  function swV(x, ya, yb, open, label, o = {}) {
    const len = yb - ya, a = rad(28);
    const bx = open ? x + len * Math.sin(a) : x, by = open ? yb - len * Math.cos(a) : ya;
    return rect(x - 3, ya, 6, len, 'mask') + line(x, yb, bx, by, 'blade') + circ(x, ya, 3, 'term') + circ(x, yb, 3, 'term') +
      (label ? txt(x + (o.dx || -14), (ya + yb) / 2, label, 'tb', 'end') : '');
  }
  /** Resistencia (rectángulo IEC). */
  function res(x, y, orient = 'h', label, o = {}) {
    const w = orient === 'h' ? 30 : 12, h = orient === 'h' ? 12 : 30;
    const lab = label ? (orient === 'h' ? txt(x, y - 17, label, 'tb') : txt(x + (o.dx || 14), y, label, 'tb', o.an || 'start')) : '';
    return rect(x - w / 2, y - h / 2, w, h, 'resistor', 1) + lab;
  }
  /** Instrumento circular (amperímetro, fuente CA…). */
  function meter(x, y, letter, label, o = {}) {
    return circ(x, y, 12, 'bulb') + txt(x, y + 0.5, letter, 'tb') + (label ? txt(x + (o.dx || 0), y + (o.dy || -22), label, 'tb', o.an || 'middle') : '');
  }

  /* ---------- Fluidos ---------- */
  /** Tanque abierto: paredes y agua hasta el nivel ly. */
  function tank(x, y, w, h, ly) {
    let out = '';
    if (ly != null) out += rect(x, ly, w, y + h - ly, 'water');
    out += poly([[x, y], [x, y + h], [x + w, y + h], [x + w, y]], 'wall');
    return out;
  }

  global.D = {
    r2, rad, P, svg, txt, line, poly, polygon, circ, rect, path, dot, head, arrow, rot,
    gear, pitch, mesh, pulley, beltOpen, beltCross, ceil, ground, wall, fulcrum, beam, box, dim, dimV,
    springV, wire, bulb, batt, sw, swV, res, meter, tank
  };
})(window);
