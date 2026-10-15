/* =========================================================================
   questions.js — Banco ORIGINAL de 60 preguntas de comprensión mecánica.
   Preguntas, diagramas y explicaciones elaborados para esta app.
   Estructura de cada pregunta:
     { t: tema, q: enunciado, o: [opciones], a: índice correcto, e: explicación, d: svg }
   ========================================================================= */
(function (global) {
  'use strict';
  const {
    svg, txt, line, poly, polygon, circ, rect, path, dot, arrow, rot, gear, pitch, mesh, pulley,
    beltOpen, beltCross, ceil, ground, wall, fulcrum, beam, box, dim, dimV, springV, wire, bulb,
    batt, sw, swV, res, meter, tank, P, r2, rad
  } = D;

  const T = {
    ENG: 'Engranajes',
    POL: 'Poleas, correas y cadenas',
    PAL: 'Palancas y momentos',
    RES: 'Resortes',
    ELE: 'Electricidad',
    FLU: 'Fluidos y presión',
    EST: 'Equilibrio y estabilidad',
    MOV: 'Movimiento y energía',
    MAQ: 'Máquinas simples',
    CAL: 'Calor'
  };

  /* ---------------- Ayudas de dibujo reutilizables ---------------- */
  const ext = (x, y1, y2) => line(x, y1, x, y2, 'ext');

  /** Objeto apoyado sobre una pendiente: devuelve polígono rotado y su centro. */
  function onSlope(x0, y0, deg, s, w, h, cls = 'load', label) {
    const u = [Math.cos(rad(deg)), -Math.sin(rad(deg))];      // dirección cuesta arriba
    const n = [-Math.sin(rad(deg)), -Math.cos(rad(deg))];     // normal hacia afuera
    const S = [x0 + u[0] * s, y0 + u[1] * s];
    const c = (a, b) => [r2(S[0] + u[0] * a + n[0] * b), r2(S[1] + u[1] * a + n[1] * b)];
    const g = c(0, h / 2);
    let out = polygon([c(-w / 2, 0), c(w / 2, 0), c(w / 2, h), c(-w / 2, h)], cls);
    if (label) out += txt(g[0], g[1], label, 'ts', 'middle', -deg);
    return { svg: out, cg: g, at: c, u, n };
  }

  /** Llave de boca vista de frente: tuerca en (x,y) y mango hacia la derecha. */
  function wrench(x, y, len) {
    const hex = [];
    for (let i = 0; i < 6; i++) hex.push(P(x, y, 11, i * 60 + 30));
    return rect(x + 12, y - 6, len - 12, 12, 'beam', 5) + circ(x, y, 19, 'ring') + polygon(hex, 'nut') + dot(x, y, 2.4, 'axle');
  }

  /** Prensa / gato hidráulico. lb = {f1, f2, a1, a2} etiquetas. */
  function hydra(lb) {
    return rect(50, 74, 26, 96, 'water') + rect(76, 150, 94, 20, 'water') + rect(170, 100, 92, 70, 'water') +
      poly([[50, 46], [50, 170], [262, 170], [262, 66]], 'wall') +
      poly([[76, 46], [76, 150], [170, 150], [170, 66]], 'wall') +
      rect(51, 66, 24, 8, 'piston') + rect(171, 92, 90, 8, 'piston') +
      arrow(63, 18, 63, 64) + txt(80, 28, lb.f1, 'tb', 'start') +
      arrow(216, 90, 216, 50) + txt(232, 60, lb.f2, 'tb', 'start') +
      txt(63, 186, lb.a1, 'ts') + txt(216, 186, lb.a2, 'ts');
  }

  /** Piñón sobre cremallera. */
  function rackPinion(n, extra = '') {
    const cx = 160, cy = 66, r = 40, p = (2 * Math.PI * pitch(r)) / n;
    let teeth = '';
    for (let x0 = 30; x0 + p * 0.72 <= 290; x0 += p) {
      teeth += polygon([[r2(x0), 112], [r2(x0 + p * 0.22), 104], [r2(x0 + p * 0.5), 104], [r2(x0 + p * 0.72), 112]], 'gear');
    }
    return rect(30, 112, 260, 22, 'gear', 2) + teeth + gear(cx, cy, r, n, { phase: -6 }) + rot(cx, cy, 50, 'cw', -150, 70) + extra;
  }

  /** Bloque/carga colgado con gancho. */
  const hang = (x, y1, y2, w, h, label) => line(x, y1, x, y2, 's2') + box(x - w / 2, y2, w, h, label);

  /* =========================================================================
     TEST 1 — Fundamentos
     ========================================================================= */
  const test1 = [
    { // 1
      sh: 1,
      t: T.ENG,
      q: 'El engranaje A gira en sentido horario. ¿En qué sentido gira el engranaje C?',
      o: ['En sentido horario', 'En sentido antihorario', 'No gira: el sistema se traba'],
      a: 0,
      e: 'Cada vez que dos engranajes engranan directamente, el sentido de giro se invierte. A gira en sentido horario, así que B gira en sentido antihorario, y C, que engrana con B, vuelve a girar en sentido horario. Regla práctica: en una fila de engranajes, los que ocupan posición impar (1.º, 3.º, 5.º…) giran igual que el primero y los de posición par giran al contrario. El sistema solo se trabaría si tres engranajes formaran un triángulo cerrado engranando entre sí.',
      d: (() => {
        const y = 82, xA = 100, xB = xA + mesh(38, 28), xC = xB + mesh(28, 38);
        return svg(320, 160, gear(xA, y, 38, 16, { label: 'A' }) + gear(xB, y, 28, 12, { label: 'B', phase: 14 }) +
          gear(xC, y, 38, 16, { label: 'C', phase: 10 }) + rot(xA, y, 48, 'cw', -165, 70) + txt(xC, y - 58, '?', 'tq'),
          'Tres engranajes en fila, A, B y C. A gira en sentido horario.');
      })()
    },
    { // 2
      t: T.ENG,
      q: 'El engranaje A, de 40 dientes, mueve al engranaje B, de 10 dientes. Si A da una vuelta completa, ¿cuántas vueltas da B?',
      o: ['Un cuarto de vuelta', 'Una vuelta', 'Cuatro vueltas', 'Diez vueltas'],
      a: 2,
      e: 'Por el punto de contacto pasa el mismo número de dientes en los dos engranajes. Una vuelta de A hace pasar 40 dientes, y B completa una vuelta cada 10 dientes: 40 ÷ 10 = 4 vueltas. El engranaje pequeño siempre gira más rápido que el grande; a cambio, transmite menos fuerza de giro (par).',
      d: (() => {
        const y = 84, xA = 110, xB = xA + mesh(50, 14);
        return svg(320, 168, gear(xA, y, 50, 40, { label: 'A' }) + gear(xB, y, 14, 10, { phase: 8 }) +
          rot(xA, y, 60, 'cw', -165, 70) + txt(xA, y + 70, '40 dientes', 'ts') +
          txt(xB + 22, y - 10, 'B', 'tb', 'start') + txt(xB + 22, y + 8, '10 dientes', 'ts', 'start'),
          'Engranaje grande A de 40 dientes que mueve un engranaje pequeño B de 10 dientes.');
      })()
    },
    { // 3
      t: T.POL,
      q: 'Con la polea fija del dibujo se sostiene una carga de 30 kg. Sin tener en cuenta la fricción, ¿qué fuerza F hay que aplicar en la cuerda?',
      o: ['La equivalente a 10 kg', 'La equivalente a 15 kg', 'La equivalente a 30 kg', 'La equivalente a 60 kg'],
      a: 2,
      e: 'Una polea fija no da ventaja mecánica: solo cambia la dirección de la fuerza (se hala hacia abajo para subir la carga). La carga cuelga de un único tramo de cuerda, y ese tramo debe soportar todo el peso, así que la fuerza es la equivalente a 30 kg. Su utilidad es la comodidad: halar hacia abajo permite aprovechar el propio peso del cuerpo.',
      d: svg(320, 178, ceil(115, 205, 20) + line(160, 20, 160, 44, 's2') + pulley(160, 60, 18) +
        line(142, 60, 142, 132, 'rope') + line(178, 60, 178, 112, 'rope') + path('M142,60 A18,18 0 0 1 178,60', 'rope') +
        arrow(178, 112, 178, 152) + txt(190, 132, 'F', 'tb', 'start') + box(117, 132, 50, 32, '30 kg'),
        'Polea fija colgada del techo; de un lado cuelga una carga de 30 kg y del otro se hala hacia abajo.')
    },
    { // 4
      t: T.PAL,
      q: 'La barra está apoyada en su centro y su peso es despreciable. ¿Qué masa X hay que colocar en el extremo derecho para que quede en equilibrio?',
      o: ['5 kg', '10 kg', '20 kg', '40 kg'],
      a: 1,
      e: 'Una palanca está en equilibrio cuando los momentos a cada lado del apoyo son iguales (momento = peso × distancia al apoyo). Lado izquierdo: 20 kg × 2 m = 40 kg·m. Lado derecho: X × 4 m = 40 kg·m, de donde X = 10 kg. Al doble de distancia se necesita la mitad del peso.',
      d: svg(320, 172, ext(104, 108, 161) + ext(160, 134, 161) + ext(272, 108, 161) +
        beam(70, 290, 104) + box(84, 70, 40, 30, '20 kg') + box(255, 72, 34, 28, 'X') + fulcrum(160, 108) +
        dim(104, 160, 156, '2 m') + dim(160, 272, 156, '4 m'),
        'Barra apoyada en el centro: 20 kg a 2 m a la izquierda y una masa X a 4 m a la derecha.')
    },
    { // 5
      t: T.RES,
      q: 'Cada resorte se alarga 2 cm cuando se le cuelgan 10 N. Si se unen dos de estos resortes uno a continuación del otro (en serie) y se cuelgan los mismos 10 N, ¿cuánto se alarga el conjunto?',
      o: ['1 cm', '2 cm', '4 cm', '8 cm'],
      a: 2,
      e: 'En serie, cada resorte soporta la carga completa: tanto el de arriba como el de abajo reciben 10 N, y cada uno se alarga 2 cm. El alargamiento total es la suma: 2 cm + 2 cm = 4 cm. El conjunto en serie es más blando que un resorte solo; si los resortes se colocaran lado a lado (en paralelo), cada uno cargaría la mitad y el alargamiento sería de 1 cm.',
      d: svg(320, 172, ceil(62, 118, 18) + springV(90, 18, 100, 6, 9) + box(68, 100, 44, 28, '10 N') +
        txt(90, 146, 'Un resorte:', 'ts') + txt(90, 160, 'se alarga 2 cm', 'ts') +
        ceil(202, 258, 18) + springV(230, 18, 64, 4, 9) + rect(221, 63, 18, 4, 'beam') + springV(230, 67, 113, 4, 9) +
        box(208, 113, 44, 28, '10 N') + txt(230, 153, 'Dos en serie:', 'ts') + txt(230, 167, '¿cuánto se alargan?', 'ts'),
        'A la izquierda, un resorte con 10 N; a la derecha, dos resortes iguales en serie con 10 N.')
    },
    { // 6
      t: T.ELE,
      q: 'En el circuito, el interruptor S está abierto. ¿Qué bombillos encienden?',
      o: ['Solo X', 'Solo Y', 'X y Y', 'Ninguno'],
      a: 3,
      e: 'Los dos bombillos están en serie: la corriente tiene un único camino que pasa por la batería, por X, por Y y por el interruptor. Con S abierto ese camino queda interrumpido, no circula corriente por ninguna parte del circuito y ningún bombillo enciende. En un circuito en serie, una sola interrupción (un interruptor abierto o un bombillo fundido) apaga todo.',
      d: svg(320, 178, wire([[50, 40], [270, 40], [270, 150], [50, 150], [50, 40]]) + batt(50, 95, 'v') +
        bulb(130, 40, 'X') + bulb(205, 40, 'Y') + sw(140, 180, 150, true, 'S', { dy: 16 }),
        'Circuito en serie con una batería, los bombillos X y Y y el interruptor S abierto.')
    },
    { // 7
      t: T.ELE,
      q: 'Una batería de 12 V alimenta una resistencia de 4 Ω. ¿Qué corriente marca el amperímetro A?',
      o: ['0,33 A', '3 A', '8 A', '48 A'],
      a: 1,
      e: 'Por la ley de Ohm, la corriente es el voltaje dividido entre la resistencia: I = V ÷ R = 12 V ÷ 4 Ω = 3 A. Para recordarla: V = I × R; si se conocen dos de las tres magnitudes, se despeja la tercera. Las otras opciones salen de dividir al revés (4 ÷ 12), restar (12 − 4) o multiplicar (12 × 4).',
      d: svg(320, 176, wire([[70, 40], [270, 40], [270, 150], [70, 150], [70, 40]]) + batt(70, 95, 'v', '12 V') +
        res(170, 40, 'h', '4 Ω') + meter(270, 95, 'A'),
        'Batería de 12 V, resistencia de 4 ohmios y amperímetro en serie.')
    },
    { // 8
      t: T.EST,
      q: 'Los tres contenedores tienen la misma masa, repartida de forma uniforme. ¿Cuál se vuelca con más facilidad si se empuja de lado?',
      o: ['El contenedor A', 'El contenedor B', 'El contenedor C', 'Los tres por igual'],
      a: 2,
      e: 'Un cuerpo se vuelca cuando la vertical que baja desde su centro de gravedad sale de su base de apoyo. C tiene la base más angosta y el centro de gravedad más alto, así que basta inclinarlo muy poco para que esa vertical salga de la base. A, con base ancha y centro de gravedad bajo, es el más estable. Por eso la carga pesada se acomoda abajo y los equipos altos se anclan o se les amplía la base.',
      d: svg(320, 190, ground(15, 305, 160) + rect(25, 118, 84, 42, 'load', 2) + dot(67, 139, 3.6, 'cg') +
        rect(140, 90, 50, 70, 'load', 2) + dot(165, 125, 3.6, 'cg') + rect(238, 50, 28, 110, 'load', 2) + dot(252, 105, 3.6, 'cg') +
        txt(67, 178, 'A', 'tb') + txt(165, 178, 'B', 'tb') + txt(252, 178, 'C', 'tb'),
        'Tres contenedores: A bajo y ancho, B mediano y C alto y angosto. El punto marca el centro de gravedad.')
    },
    { // 9
      t: T.FLU,
      q: 'El tanque está lleno de agua hasta el nivel indicado. Si se destapan a la vez los tres orificios, ¿por cuál sale el agua con más presión?',
      o: ['Por el orificio A', 'Por el orificio B', 'Por el orificio C', 'Sale igual por los tres'],
      a: 2,
      e: 'La presión en un líquido aumenta con la profundidad, porque cada punto soporta el peso de toda la columna de agua que tiene encima (P = ρ · g · h). El orificio C es el más profundo, así que por él el agua sale con mayor presión y mayor velocidad. Por la misma razón, los tanques y los muros de contención se refuerzan en la parte inferior.',
      d: svg(320, 188, tank(100, 30, 110, 140, 48) + ground(80, 300, 170) +
        circ(210, 72, 4, 'hole') + circ(210, 110, 4, 'hole') + circ(210, 150, 4, 'hole') +
        txt(226, 72, 'A', 'tb', 'start') + txt(226, 110, 'B', 'tb', 'start') + txt(226, 150, 'C', 'tb', 'start'),
        'Tanque con agua y tres orificios en la pared derecha a distintas alturas: A arriba, B en el medio y C abajo.')
    },
    { // 10
      sh: 1,
      t: T.POL,
      q: 'La polea A gira en sentido horario y mueve a la polea B mediante una correa cruzada. ¿En qué sentido gira B?',
      o: ['En sentido horario', 'En sentido antihorario', 'Depende del tamaño de las poleas'],
      a: 1,
      e: 'Con una correa abierta (sin cruzar), las dos poleas giran en el mismo sentido. Cuando la correa se cruza en forma de 8, el sentido se invierte, igual que en dos engranajes que engranan. Como A gira en sentido horario, B gira en sentido antihorario. El tamaño de las poleas cambia la velocidad, no el sentido.',
      d: svg(320, 166, pulley(90, 88, 40, { label: 'A' }) + pulley(235, 88, 28, { label: 'B' }) +
        beltCross(90, 88, 40, 235, 28) + rot(90, 88, 50, 'cw', -165, 70) + txt(235, 40, '?', 'tq'),
        'Dos poleas unidas por una correa cruzada. A gira en sentido horario.')
    },
    { // 11
      t: T.MAQ,
      q: 'Hay que subir la misma caja hasta la misma altura usando una de estas rampas. Sin fricción, ¿con cuál se necesita menos fuerza para empujarla?',
      o: ['Con la rampa A', 'Con la rampa B', 'Con la rampa C', 'Con las tres se necesita la misma'],
      a: 2,
      e: 'El trabajo para subir la caja es el mismo en las tres rampas (peso × altura), y ese trabajo es igual a fuerza × distancia recorrida. En la rampa C la caja recorre la distancia más larga, así que la fuerza necesaria es la menor: F = peso × altura ÷ longitud de la rampa. A cambio, hay que empujar durante más recorrido. Es el principio de las rampas de acceso y de las vías que suben en zigzag por una ladera.',
      d: (() => {
        const g = 160, h = 70;
        const ramp = (x0, b, lab) => {
          const deg = Math.atan2(h, b) * 180 / Math.PI;
          const L = Math.hypot(b, h);
          return polygon([[x0, g], [x0 + b, g], [x0 + b, g - h]], 'ramp') + onSlope(x0, g, deg, L * 0.45, 16, 16).svg + txt(x0 + b / 2 + 6, g + 16, lab, 'tb');
        };
        return svg(320, 186, ground(8, 312, g) + ramp(18, 40, 'A') + ramp(90, 82, 'B') + ramp(194, 114, 'C'),
          'Tres rampas de la misma altura: A corta y empinada, B intermedia y C larga y suave.');
      })()
    },
    { // 12
      t: T.MOV,
      q: 'Se suelta el péndulo desde el punto A. Sin rozamiento, ¿en qué punto lleva la mayor velocidad?',
      o: ['En el punto A', 'En el punto B', 'En el punto C', 'En el punto D'],
      a: 2,
      e: 'Al soltarse, el péndulo convierte energía potencial (altura) en energía cinética (velocidad). En los extremos A y D se detiene un instante y su velocidad es cero. A medida que baja gana velocidad, y la máxima la alcanza en C, el punto más bajo de la trayectoria, donde toda la altura perdida se ha convertido en movimiento. Desde ahí empieza a subir y a frenarse.',
      d: (() => {
        const px = 160, py = 22, L = 118;
        const at = (phi, extra = 0) => P(px, py, L + extra, 90 - phi);
        const [ax, ay] = at(-40), [bx, by] = at(-20), [cx, cy] = at(0), [dx, dy] = at(40);
        const lab = (phi, s, ex) => { const [x, y] = at(phi, ex); return txt(x, y, s, 'tb'); };
        return svg(320, 176, ceil(130, 190, py) + `<path class="trail" d="M${ax},${ay} A${L},${L} 0 0 0 ${dx},${dy}"/>` +
          line(px, py, ax, ay, 's2') + line(px, py, cx, cy, 'ext') + circ(ax, ay, 10, 'bob') + dot(bx, by, 3.6, 'pt') + dot(cx, cy, 3.6, 'pt') + dot(dx, dy, 3.6, 'pt') +
          lab(-40, 'A', 22) + lab(-20, 'B', 16) + lab(0, 'C', 16) + lab(40, 'D', 16),
          'Péndulo que se suelta desde A, a la izquierda. B está a medio camino, C es el punto más bajo y D el extremo derecho.');
      })()
    },
    { // 13
      t: T.PAL,
      q: 'Se quiere aflojar una tuerca muy apretada aplicando la fuerza en el extremo del mango. ¿Con cuál llave se necesita menos fuerza?',
      o: ['Con la llave A', 'Con la llave B', 'Con las dos se necesita la misma fuerza'],
      a: 1,
      e: 'Lo que afloja la tuerca es el par o torque: fuerza × distancia entre la mano y el centro de la tuerca. La llave B tiene el mango más largo, así que con una fuerza menor produce el mismo par. Si B mide el doble que A, basta la mitad de la fuerza. Por eso, para tuercas trabadas, se usa una llave de mango largo o se le añade un tubo de extensión.',
      d: svg(320, 172, wrench(62, 62, 108) + wrench(62, 142, 214) + arrow(160, 24, 160, 54) + arrow(266, 104, 266, 134) +
        txt(172, 34, 'F', 'tb', 'start') + txt(278, 114, 'F', 'tb', 'start') + txt(24, 62, 'A', 'tb') + txt(24, 142, 'B', 'tb'),
        'Dos llaves sobre tuercas iguales: A con mango corto y B con mango largo. La fuerza se aplica en el extremo.')
    },
    { // 14
      t: T.FLU,
      q: 'En la prensa hidráulica se aplican 50 N sobre el pistón pequeño, de 10 cm². ¿Qué fuerza se obtiene en el pistón grande, de 100 cm²?',
      o: ['5 N', '50 N', '500 N', '5 000 N'],
      a: 2,
      e: 'Por el principio de Pascal, la presión aplicada a un líquido encerrado se transmite igual a todos sus puntos. Presión en el pistón pequeño: 50 N ÷ 10 cm² = 5 N/cm². Esa misma presión actúa sobre el grande: 5 N/cm² × 100 cm² = 500 N. La fuerza se multiplica por la relación de áreas (100 ÷ 10 = 10). A cambio, el pistón grande se desplaza diez veces menos que el pequeño.',
      d: svg(320, 196, hydra({ f1: '50 N', f2: 'F = ?', a1: '10 cm²', a2: '100 cm²' }),
        'Prensa hidráulica con un pistón pequeño de 10 centímetros cuadrados y uno grande de 100.')
    },
    { // 15
      sh: 1,
      t: T.ENG,
      q: 'El piñón gira en sentido horario engranado con la cremallera, que está debajo de él. El eje del piñón no se desplaza. ¿Hacia dónde se mueve la cremallera?',
      o: ['Hacia la izquierda', 'Hacia la derecha', 'No se mueve; solo vibra'],
      a: 0,
      e: 'Al girar en sentido horario, la parte superior del piñón se mueve hacia la derecha y la parte inferior hacia la izquierda. La cremallera está engranada en la parte inferior del piñón, así que es arrastrada hacia la izquierda. Este mecanismo convierte giro en movimiento lineal; se usa en la dirección de los vehículos y en las puertas corredizas motorizadas.',
      d: svg(320, 166, rackPinion(16, txt(160, 154, '¿Hacia dónde se mueve la cremallera?', 'ts')),
        'Piñón que gira en sentido horario engranado sobre una cremallera horizontal.')
    },
    { // 16
      t: T.ELE,
      q: 'Con el interruptor S abierto, ¿qué ocurre con los bombillos?',
      o: ['Encienden X y Y', 'Enciende solo X', 'Enciende solo Y', 'No enciende ninguno'],
      a: 2,
      e: 'Los bombillos están en paralelo: cada uno tiene su propio camino entre los polos de la batería. El interruptor S está solo en la rama de X, así que al abrirse corta únicamente esa rama. La rama de Y sigue cerrada y Y permanece encendido. Así se cablean las instalaciones de una casa: apagar una lámpara no apaga las demás.',
      d: svg(320, 172, wire([[50, 40], [250, 40]]) + wire([[50, 150], [250, 150]]) + wire([[50, 40], [50, 150]]) +
        wire([[150, 40], [150, 150]]) + wire([[250, 40], [250, 150]]) + batt(50, 95, 'v') + dot(150, 40, 3, 'jn') + dot(150, 150, 3, 'jn') +
        bulb(150, 72, 'X', { lab: [20, 0, 'start'] }) + swV(150, 106, 136, true, 'S', { dx: -12 }) + bulb(250, 95, 'Y', { lab: [20, 0, 'start'] }),
        'Dos bombillos en paralelo. En la rama de X hay un interruptor S abierto; la rama de Y no tiene interruptor.')
    },
    { // 17
      t: T.PAL,
      q: 'La barra, de peso despreciable, está en equilibrio. ¿Cuál de las dos cargas es más pesada?',
      o: ['La carga A', 'La carga B', 'Pesan lo mismo'],
      a: 0,
      e: 'En equilibrio, los momentos se igualan: peso de A × 1 m = peso de B × 3 m. Para que eso se cumpla, A debe pesar tres veces más que B. La carga más cercana al apoyo es la más pesada: una carga liviana compensa a una pesada si se coloca más lejos del punto de apoyo.',
      d: svg(320, 172, ext(125, 108, 161) + ext(160, 134, 161) + ext(265, 108, 161) + beam(95, 290, 104) +
        box(107, 70, 36, 30, 'A') + box(247, 70, 36, 30, 'B') + fulcrum(160, 108) + dim(125, 160, 156, '1 m') + dim(160, 265, 156, '3 m'),
        'Barra en equilibrio con la carga A a 1 m del apoyo y la carga B a 3 m.')
    },
    { // 18
      t: T.POL,
      q: 'La carga de 80 kg cuelga de una polea móvil. Sin contar la fricción ni el peso de la polea, ¿qué fuerza F hay que aplicar para sostenerla?',
      o: ['La equivalente a 20 kg', 'La equivalente a 40 kg', 'La equivalente a 80 kg', 'La equivalente a 160 kg'],
      a: 1,
      e: 'La polea móvil queda sostenida por dos tramos de cuerda: uno amarrado al techo y otro del que se hala. Cada tramo soporta la mitad de la carga, así que la fuerza necesaria es 80 kg ÷ 2 = 40 kg. La contrapartida es la distancia: para subir la carga 1 m hay que halar 2 m de cuerda.',
      d: svg(320, 182, ceil(92, 150, 22) + line(120, 22, 120, 112, 'rope') + line(160, 112, 160, 66, 'rope') +
        hang(140, 112, 140, 50, 30, '80 kg') + pulley(140, 112, 20) + path('M120,112 A20,20 0 0 0 160,112', 'rope') +
        arrow(160, 66, 160, 30) + txt(172, 46, 'F', 'tb', 'start'),
        'Polea móvil: una cuerda amarrada al techo baja, pasa por debajo de la polea y sube hasta la mano. La carga de 80 kg cuelga de la polea.')
    },
    { // 19
      t: T.MOV,
      q: 'La rueda gira a velocidad constante. ¿Cuál de los dos puntos recorre más distancia en cada vuelta y, por tanto, va más rápido?',
      o: ['El punto A', 'El punto B', 'Los dos van igual de rápido'],
      a: 1,
      e: 'Los dos puntos dan el mismo número de vueltas por minuto (igual velocidad angular), pero B describe un círculo mucho más grande. En cada vuelta recorre una circunferencia de 2π × su radio, así que su velocidad lineal es mayor en proporción a su distancia al centro (v = ω × r). Como B está casi tres veces más lejos del centro que A, va casi tres veces más rápido.',
      d: (() => {
        const cx = 160, cy = 92;
        const [ax, ay] = P(cx, cy, 24, -35), [bx, by] = P(cx, cy, 66, -35);
        return svg(320, 184, circ(cx, cy, 70, 'wheel') + circ(cx, cy, 58, 'pul-in') + circ(cx, cy, 40, 'pul-in') + circ(cx, cy, 10, 'hub') +
          line(cx, cy, bx, by, 'ext') +
          dot(ax, ay, 4.6, 'pt') + dot(bx, by, 4.6, 'pt') + txt(ax - 2, ay - 14, 'A', 'tb') + txt(bx + 14, by - 12, 'B', 'tb') +
          rot(cx, cy, 82, 'cw', 105, 60),
          'Rueda que gira. El punto A está cerca del centro y el punto B en el borde.');
      })()
    },
    { // 20
      sh: 1,
      t: T.FLU,
      q: 'Los tres recipientes están unidos por un tubo en la base. Se vierte agua por A hasta que todo queda en reposo. ¿Cómo quedan los niveles?',
      o: ['Más alto en A, por donde entra el agua', 'Más alto en B, el más ancho', 'Más alto en C, el de forma de embudo', 'Al mismo nivel en los tres'],
      a: 3,
      e: 'Los recipientes conectados por la base se llaman vasos comunicantes. En reposo, la presión en el fondo tiene que ser la misma en todos los puntos conectados, y la presión de un líquido depende solo de la profundidad, no de la forma ni del ancho del recipiente. Por eso el agua queda al mismo nivel en A, B y C. Es el principio del nivel de manguera que se usa en obra para trasladar cotas.',
      d: svg(320, 192, rect(52, 150, 218, 16, 'water') +
        line(52, 40, 52, 166, 'wall') + line(74, 40, 74, 150, 'wall') + line(125, 62, 125, 150, 'wall') + line(195, 62, 195, 150, 'wall') +
        line(228, 50, 250, 150, 'wall') + line(292, 50, 270, 150, 'wall') + line(270, 150, 270, 166, 'wall') +
        line(74, 150, 125, 150, 'wall') + line(195, 150, 250, 150, 'wall') + line(52, 166, 270, 166, 'wall') +
        arrow(63, 6, 63, 34, 'arw') + txt(80, 16, 'agua', 'ts', 'start') +
        txt(63, 182, 'A', 'tb') + txt(160, 182, 'B', 'tb') + txt(260, 182, 'C', 'tb'),
        'Tres recipientes de formas distintas unidos por un tubo en la base: A angosto, B ancho y C en forma de embudo.')
    }
  ];

  /* =========================================================================
     TEST 2 — Intermedio
     ========================================================================= */
  const test2 = [
    { // 1
      sh: 1,
      t: T.ENG,
      q: 'Cada engranaje engrana solo con el siguiente de la cadena. Si A gira en sentido antihorario, ¿en qué sentido gira D?',
      o: ['En sentido horario', 'En sentido antihorario', 'No se puede saber sin conocer el número de dientes'],
      a: 0,
      e: 'El sentido se invierte en cada engrane: A antihorario, B horario, C antihorario y D horario. D ocupa la cuarta posición (par), así que gira al contrario que A. El número de dientes cambia la velocidad de cada engranaje, nunca el sentido de giro.',
      d: (() => {
        const d = mesh(30, 26), dx = d * Math.cos(rad(30)), dy = d * Math.sin(rad(30));
        const x0 = 160 - dx * 1.5, y0 = 112;
        const A = [x0, y0], B = [x0 + dx, y0 - dy], C = [x0 + 2 * dx, y0], Dd = [x0 + 3 * dx, y0 - dy];
        return svg(320, 162, gear(A[0], A[1], 30, 14, { label: 'A' }) + gear(B[0], B[1], 26, 12, { label: 'B', phase: 8 }) +
          gear(C[0], C[1], 30, 14, { label: 'C', phase: 4 }) + gear(Dd[0], Dd[1], 26, 12, { label: 'D', phase: 12 }) +
          rot(A[0], A[1], 39, 'ccw', 165, 70) + txt(Dd[0], Dd[1] - 44, '?', 'tq'),
          'Cuatro engranajes en zigzag: A, B, C y D. A gira en sentido antihorario.');
      })()
    },
    { // 2
      t: T.ENG,
      q: 'El piñón A, de 12 dientes, gira a 60 rpm y mueve la rueda B, de 36 dientes. ¿A cuántas rpm gira B?',
      o: ['20 rpm', '36 rpm', '60 rpm', '180 rpm'],
      a: 0,
      e: 'La velocidad se reparte en proporción inversa al número de dientes: rpm de B = rpm de A × dientes de A ÷ dientes de B = 60 × 12 ÷ 36 = 20 rpm. B tiene el triple de dientes, así que gira tres veces más lento, pero entrega el triple de par. Es el principio de un reductor de velocidad.',
      d: (() => {
        const y = 84, xA = 84, xB = xA + mesh(18, 50);
        return svg(320, 164, gear(xA, y, 18, 12) + gear(xB, y, 50, 36, { label: 'B', phase: 3 }) + rot(xA, y, 27, 'cw', -175, 80) +
          txt(xA, y + 36, 'A', 'tb') + txt(xA, y + 51, '12 dientes', 'ts') + txt(xA, y + 65, '60 rpm', 'ts') +
          txt(xB + 60, y - 8, '36 dientes', 'ts', 'start') + txt(xB + 60, y + 8, '¿rpm?', 'ts', 'start'),
          'Piñón A de 12 dientes a 60 rpm que mueve una rueda B de 36 dientes.');
      })()
    },
    { // 3
      t: T.ENG,
      q: 'A (20 dientes) mueve a B (40 dientes). C (10 dientes) está montado en el mismo eje que B y mueve a D (30 dientes). Si A da 12 vueltas, ¿cuántas vueltas da D?',
      o: ['2 vueltas', '4 vueltas', '6 vueltas', '36 vueltas'],
      a: 0,
      e: 'Se resuelve por etapas. De A a B: 12 × 20 ÷ 40 = 6 vueltas de B. C está en el mismo eje que B, así que también da 6 vueltas. De C a D: 6 × 10 ÷ 30 = 2 vueltas de D. En un tren compuesto, la reducción total es el producto de las reducciones de cada etapa: (40 ÷ 20) × (30 ÷ 10) = 6, por eso D gira 6 veces más lento que A.',
      d: (() => {
        const y = 84, xA = 54, xB = xA + mesh(24, 46), xC = 252, xD = xC + mesh(16, 44);
        return svg(360, 162, gear(xA, y, 24, 20) + gear(xB, y, 46, 40, { label: 'B', phase: 4 }) +
          gear(xC, y, 16, 10, { cls: 'shaft-mate' }) + gear(xD, y, 44, 30, { label: 'D', phase: 6 }) +
          circ(xB, y, 14, 'shaft-ring') + circ(xC, y, 7, 'shaft-ring') +
          line(xB + 46, y, xC - 16, y, 'link') + txt((xB + 46 + xC - 16) / 2, y - 11, 'mismo eje', 'ts') +
          txt(xA, y - 36, 'A', 'tb') + txt(xC, y - 28, 'C', 'tb') + txt(xC, y - 44, '10 dientes', 'ts') +
          txt(xA, y + 38, '20 dientes', 'ts') + txt(xB, y + 60, '40 dientes', 'ts') + txt(xD, y + 58, '30 dientes', 'ts'),
          'Tren de engranajes compuesto: A mueve a B; C va en el mismo eje que B y mueve a D.');
      })()
    },
    { // 4
      t: T.POL,
      q: 'Con el aparejo del dibujo se sostiene una carga de 200 kg. Sin fricción ni peso de las poleas, ¿qué fuerza F se necesita?',
      o: ['La equivalente a 25 kg', 'La equivalente a 50 kg', 'La equivalente a 100 kg', 'La equivalente a 200 kg'],
      a: 1,
      e: 'Para saber la ventaja mecánica de un aparejo se cuentan los tramos de cuerda que sostienen el bloque móvil (el de abajo, que sube con la carga). Aquí son 4. La carga se reparte entre ellos, así que cada tramo, y por tanto la mano, soporta 200 kg ÷ 4 = 50 kg. El tramo del que se hala no se cuenta, porque sale de la polea fija y baja hacia la mano.',
      d: svg(300, 206, ceil(72, 228, 12) + line(150, 12, 150, 24, 's2') + rect(78, 24, 140, 7, 'beam', 1) +
        line(100, 31, 100, 55, 's2') + line(160, 31, 160, 55, 's2') + pulley(100, 55, 15) + pulley(160, 55, 15) +
        line(130, 135, 130, 152, 's2') + line(190, 135, 190, 152, 's2') + rect(120, 152, 80, 6, 'beam', 1) +
        pulley(130, 135, 15) + pulley(190, 135, 15) + hang(160, 158, 170, 60, 28, '200 kg') +
        line(85, 55, 85, 150, 'rope') + path('M85,55 A15,15 0 0 1 115,55', 'rope') + line(115, 55, 115, 135, 'rope') +
        path('M115,135 A15,15 0 0 0 145,135', 'rope') + line(145, 135, 145, 55, 'rope') + path('M145,55 A15,15 0 0 1 175,55', 'rope') +
        line(175, 55, 175, 135, 'rope') + path('M175,135 A15,15 0 0 0 205,135', 'rope') + line(205, 135, 205, 31, 'rope') +
        arrow(85, 150, 85, 184) + txt(73, 168, 'F', 'tb', 'end'),
        'Aparejo con dos poleas fijas arriba y dos poleas móviles abajo. Cuatro tramos de cuerda sostienen el bloque inferior, del que cuelgan 200 kg.')
    },
    { // 5
      t: T.PAL,
      q: 'La carretilla lleva 60 kg, cuyo centro está a 0,5 m del eje de la rueda. Las manijas están a 1,5 m del eje. Sin contar el peso de la carretilla, ¿qué fuerza hay que hacer en las manijas para levantarla?',
      o: ['La equivalente a 10 kg', 'La equivalente a 20 kg', 'La equivalente a 30 kg', 'La equivalente a 60 kg'],
      a: 1,
      e: 'La carretilla es una palanca de segundo grado: el apoyo es el eje de la rueda, la carga está en el medio y la fuerza se aplica en el extremo. Momentos respecto al eje: 60 kg × 0,5 m = F × 1,5 m, de donde F = 30 ÷ 1,5 = 20 kg. Cuanto más cerca de la rueda se acomode la carga, menos fuerza se necesita en las manijas.',
      d: svg(320, 228, ext(60, 174, 222) + ext(130, 124, 204) + ext(270, 150, 222) +
        line(60, 150, 272, 108, 'frame') + line(178, 127, 184, 172, 'frame') + line(100, 124, 100, 142, 's2') + line(160, 124, 160, 130, 's2') +
        polygon([[82, 92], [178, 92], [165, 124], [95, 124]], 'load') + txt(130, 108, '60 kg', 'tb') +
        circ(60, 150, 22, 'wheel') + circ(60, 150, 4, 'hub') + ground(20, 300, 172) +
        arrow(270, 150, 270, 114) + txt(282, 132, 'F', 'tb', 'start') +
        dim(60, 130, 200, '0,5 m') + dim(60, 270, 218, '1,5 m'),
        'Carretilla vista de lado: rueda a la izquierda, carga de 60 kg a 0,5 m del eje y manijas a 1,5 m.')
    },
    { // 6
      t: T.RES,
      q: 'Un resorte solo se alarga 3 cm con una carga de 30 N. Si dos resortes iguales a ese se colocan lado a lado (en paralelo) y entre ambos sostienen los mismos 30 N, ¿cuánto se alarga el conjunto?',
      o: ['0,75 cm', '1,5 cm', '3 cm', '6 cm'],
      a: 1,
      e: 'En paralelo, la carga se reparte entre los dos resortes: cada uno soporta 15 N, la mitad. Como el alargamiento es proporcional a la fuerza (ley de Hooke), cada resorte se alarga la mitad: 3 cm ÷ 2 = 1,5 cm. Los dos se estiran lo mismo porque están unidos por la misma barra. El conjunto en paralelo es el doble de rígido que un resorte solo.',
      d: svg(320, 164, ceil(110, 210, 18) + springV(135, 18, 100, 6, 8) + springV(185, 18, 100, 6, 8) +
        rect(124, 100, 72, 7, 'beam', 1) + hang(160, 107, 122, 50, 30, '30 N'),
        'Dos resortes iguales colgados lado a lado, unidos abajo por una barra de la que cuelgan 30 N.')
    },
    { // 7
      t: T.ELE,
      q: 'Las dos baterías y los cuatro bombillos son iguales. ¿En qué circuito alumbran más los bombillos?',
      o: ['En el circuito A', 'En el circuito B', 'Alumbran igual en los dos'],
      a: 1,
      e: 'En el circuito A, los bombillos en serie se reparten el voltaje de la batería: cada uno recibe la mitad y alumbra débil. En el circuito B, en paralelo, cada bombillo queda conectado directamente a la batería y recibe el voltaje completo, así que alumbra con toda su intensidad. La contrapartida es que el circuito B consume más corriente y descarga la batería más rápido.',
      d: svg(320, 176, wire([[24, 40], [150, 40], [150, 140], [24, 140], [24, 40]]) + batt(24, 90, 'v') + bulb(66, 40) + bulb(112, 40) +
        wire([[180, 40], [296, 40]]) + wire([[180, 140], [296, 140]]) + wire([[180, 40], [180, 140]]) + wire([[240, 40], [240, 140]]) + wire([[296, 40], [296, 140]]) +
        batt(180, 90, 'v') + bulb(240, 90) + bulb(296, 90) + dot(240, 40, 3, 'jn') + dot(240, 140, 3, 'jn') +
        txt(87, 164, 'Circuito A', 'tb') + txt(238, 164, 'Circuito B', 'tb'),
        'Circuito A: dos bombillos en serie. Circuito B: dos bombillos en paralelo. Baterías iguales.')
    },
    { // 8
      t: T.ELE,
      q: 'Un calentador conectado a 120 V consume una corriente de 10 A. ¿Qué potencia tiene?',
      o: ['12 W', '130 W', '1 200 W', '12 000 W'],
      a: 2,
      e: 'La potencia eléctrica es el producto del voltaje por la corriente: P = V × I = 120 V × 10 A = 1 200 W (1,2 kW). Si funciona una hora, consume 1,2 kWh, que es la unidad con la que se factura la energía. Las otras opciones salen de dividir (120 ÷ 10), sumar (120 + 10) o equivocarse en un cero.',
      d: svg(320, 176, wire([[80, 40], [270, 40], [270, 150], [80, 150], [80, 40]]) +
        meter(80, 95, '~', '120 V', { dx: -18, dy: 0, an: 'end' }) + meter(175, 40, 'A', '10 A') + res(270, 95, 'v') + txt(254, 95, 'Calentador', 'tb', 'end'),
        'Fuente de 120 voltios, amperímetro que marca 10 amperios y un calentador.')
    },
    { // 9
      t: T.EST,
      q: 'Dos camiones iguales llevan las mismas tres cajas, acomodadas de forma distinta. Vistos desde atrás, ¿cuál tiene más riesgo de volcarse al tomar una curva?',
      o: ['El camión A', 'El camión B', 'Tienen el mismo riesgo'],
      a: 0,
      e: 'En una curva aparece una fuerza lateral aplicada en el centro de gravedad del camión y su carga. Cuanto más alto está ese punto, mayor es el momento que tiende a voltear el camión sobre las ruedas exteriores. A lleva las cajas apiladas en altura, con el centro de gravedad alto, y se vuelca primero. La regla en el cargue: lo pesado abajo y centrado.',
      d: (() => {
        const truck = (x, high) => {
          let s = rect(x, 128, 100, 14, 'beam', 2) + circ(x + 18, 152, 12, 'wheel') + circ(x + 82, 152, 12, 'wheel');
          if (high) { for (let i = 0; i < 3; i++) s += rect(x + 35, 106 - i * 22, 30, 22, 'load', 1); s += dot(x + 50, 95, 3.6, 'cg'); }
          else { for (let i = 0; i < 3; i++) s += rect(x + 5 + i * 30, 106, 30, 22, 'load', 1); s += dot(x + 50, 117, 3.6, 'cg'); }
          return s;
        };
        return svg(320, 190, ground(10, 310, 164) + truck(28, true) + truck(192, false) + txt(78, 180, 'Camión A', 'tb') + txt(242, 180, 'Camión B', 'tb'),
          'Dos camiones vistos desde atrás. A lleva tres cajas apiladas; B lleva las mismas tres cajas en fila. El punto marca el centro de gravedad.');
      })()
    },
    { // 10
      t: T.FLU,
      q: 'El agua circula de izquierda a derecha por la tubería, que siempre va llena. ¿En qué tramo lleva mayor velocidad?',
      o: ['En el tramo A', 'En el tramo B', 'En el tramo C', 'Lleva la misma velocidad en los tres'],
      a: 1,
      e: 'Si la tubería va llena y no hay fugas, por cada sección pasa el mismo caudal (Q = área × velocidad). Donde el área es menor, la velocidad tiene que ser mayor para que pase el mismo volumen cada segundo. B es el tramo más angosto, así que allí el agua va más rápido. Es el mismo efecto de tapar con el dedo parte de la salida de una manguera.',
      d: (() => {
        const top = [[16, 62], [96, 62], [122, 82], [184, 82], [206, 72], [304, 72]];
        const bot = top.map(([x, y]) => [x, 200 - y]);
        return svg(320, 160, polygon(top.concat(bot.slice().reverse()), 'water-f') + poly(top, 'wall') + poly(bot, 'wall') +
          arrow(28, 100, 70, 100, 'arw') + txt(56, 46, 'A', 'tb') + txt(153, 66, 'B', 'tb') + txt(255, 56, 'C', 'tb'),
          'Tubería con tres tramos: A ancho, B angosto y C intermedio. El agua fluye hacia la derecha.');
      })()
    },
    { // 11
      sh: 1,
      t: T.FLU,
      q: '¿Por qué los muros de las presas se construyen mucho más gruesos en la base que en la corona?',
      o: ['Porque la presión del agua aumenta con la profundidad', 'Porque el agua del fondo está más fría', 'Porque así el muro pesa menos', 'Porque el agua empuja con la misma presión en toda la altura'],
      a: 0,
      e: 'La presión del agua crece en proporción a la profundidad (P = ρ · g · h): en la superficie es prácticamente cero y en el fondo es máxima. El empuje sobre el muro es por eso mucho mayor en la parte baja, y la sección se ensancha hacia la base para resistirlo. La diferencia de temperatura del agua tiene un efecto despreciable frente a la profundidad.',
      d: svg(320, 182, rect(16, 56, 134, 104, 'water') + polygon([[150, 40], [174, 40], [250, 160], [150, 160]], 'concrete') + ground(10, 310, 160) +
        txt(162, 28, 'Corona', 'ts') + txt(200, 174, 'Base', 'ts') + txt(80, 106, 'Agua', 'tb'),
        'Corte de una presa: el muro es angosto arriba, en la corona, y ancho abajo, en la base.')
    },
    { // 12
      sh: 1,
      t: T.POL,
      q: 'La polea A gira en sentido horario. A mueve a B con una correa abierta, y B mueve a C con una correa cruzada. ¿En qué sentido gira C?',
      o: ['En sentido horario', 'En sentido antihorario', 'C no gira'],
      a: 1,
      e: 'La correa abierta conserva el sentido: B gira igual que A, en sentido horario. La correa cruzada lo invierte: C gira al contrario que B, en sentido antihorario. Basta contar las correas cruzadas: si su número es impar, la última polea gira al contrario que la primera.',
      d: svg(320, 160, pulley(60, 90, 30, { label: 'A' }) + pulley(162, 90, 24, { label: 'B' }) + pulley(262, 90, 30, { label: 'C' }) +
        beltOpen(60, 90, 30, 162, 24) + beltCross(162, 90, 24, 262, 30) + rot(60, 90, 40, 'cw', -165, 70) + txt(262, 44, '?', 'tq'),
        'Tres poleas: A y B unidas por correa abierta; B y C unidas por correa cruzada.')
    },
    { // 13
      t: T.PAL,
      q: 'Se aplica una fuerza de 50 N, perpendicular al mango, a 0,3 m del centro de la tuerca. ¿Qué par (torque) recibe la tuerca?',
      o: ['1,5 N·m', '15 N·m', '150 N·m', '167 N·m'],
      a: 1,
      e: 'El par es la fuerza multiplicada por la distancia perpendicular al eje de giro: M = F × d = 50 N × 0,3 m = 15 N·m. Si la fuerza no fuera perpendicular al mango, solo contaría su componente perpendicular y el par sería menor. Las llaves de torque permiten apretar pernos al valor especificado, como exigen muchas uniones estructurales.',
      d: svg(320, 150, wrench(60, 80, 222) + arrow(252, 36, 252, 72) + txt(264, 48, '50 N', 'tb', 'start') +
        ext(60, 100, 126) + ext(252, 88, 126) + dim(60, 252, 122, '0,3 m', { ly: 136 }),
        'Llave con una fuerza de 50 N aplicada a 0,3 m del centro de la tuerca.')
    },
    { // 14
      t: T.MAQ,
      q: 'Se sube una carga de 400 N por una rampa de 6 m de largo hasta una altura de 1,5 m. Sin fricción, ¿qué fuerza paralela a la rampa hay que aplicar?',
      o: ['100 N', '150 N', '267 N', '400 N'],
      a: 0,
      e: 'Subir la carga directamente exige un trabajo de peso × altura = 400 N × 1,5 m = 600 J. Por la rampa se hace el mismo trabajo, pero a lo largo de 6 m: F × 6 m = 600 J, de donde F = 100 N. La ventaja mecánica de un plano inclinado es longitud ÷ altura = 6 ÷ 1,5 = 4: se necesita la cuarta parte de la fuerza.',
      d: (() => {
        const x0 = 20, g = 165, H = 65, L = 260, base = Math.sqrt(L * L - H * H), deg = Math.asin(H / L) * 180 / Math.PI;
        const b = onSlope(x0, g, deg, 112, 38, 24, 'load', '400 N');
        const [sx, sy] = b.at(22, 12), [ex, ey] = b.at(62, 12);
        const [mx, my] = b.at(70, -14);
        return svg(320, 182, polygon([[x0, g], [x0 + base, g], [x0 + base, g - H]], 'ramp') + ground(10, 310, g) + b.svg +
          arrow(sx, sy, ex, ey) + txt(ex + 4, ey - 12, 'F', 'tb') +
          txt(mx, my + 8, '6 m', 'td', 'middle', -deg) + txt(x0 + base + 8, g - H / 2, '1,5 m', 'td', 'start'),
          'Rampa de 6 m de largo y 1,5 m de altura con una carga de 400 N.');
      })()
    },
    { // 15
      t: T.MAQ,
      q: 'La leva del dibujo tiene dos lóbulos iguales y gira sobre su eje. ¿Cuántas veces sube y baja la varilla por cada vuelta completa de la leva?',
      o: ['Una vez', 'Dos veces', 'Cuatro veces', 'Ninguna; la varilla permanece quieta'],
      a: 1,
      e: 'La varilla (seguidor) se apoya sobre el perfil de la leva y sube cada vez que pasa por debajo un lóbulo, es decir, una zona más alejada del eje. En una vuelta completa pasan los dos lóbulos, así que la varilla sube y baja dos veces. Las levas convierten un giro en un movimiento de vaivén; así se abren y cierran las válvulas de un motor.',
      d: svg(320, 178, `<ellipse class="gear" cx="160" cy="122" rx="44" ry="26"/>` + circ(160, 122, 6, 'hub') +
        line(160, 80, 160, 22, 'rod') + circ(160, 88, 8, 'hub') + rect(144, 40, 8, 18, 'beam', 1) + rect(168, 40, 8, 18, 'beam', 1) +
        rot(160, 122, 56, 'cw', 10, 70) + txt(160, 166, 'Leva', 'ts') + txt(184, 26, 'Varilla', 'ts', 'start'),
        'Leva ovalada de dos lóbulos que gira bajo una varilla vertical guiada.')
    },
    { // 16
      t: T.ELE,
      q: 'Dos resistencias, de 4 Ω y 8 Ω, están conectadas en serie a una batería de 24 V. ¿Qué corriente marca el amperímetro?',
      o: ['1 A', '2 A', '3 A', '6 A'],
      a: 1,
      e: 'En serie, las resistencias se suman: R total = 4 Ω + 8 Ω = 12 Ω. Por la ley de Ohm, I = V ÷ R = 24 V ÷ 12 Ω = 2 A, la misma corriente en todo el circuito. La resistencia de 4 Ω recibe 8 V y la de 8 Ω recibe 16 V; entre las dos suman los 24 V de la batería.',
      d: svg(320, 176, wire([[70, 40], [270, 40], [270, 150], [70, 150], [70, 40]]) + batt(70, 95, 'v', '24 V') +
        res(170, 40, 'h', '4 Ω') + res(270, 95, 'v', '8 Ω', { dx: 14 }) + meter(170, 150, 'A'),
        'Batería de 24 V con resistencias de 4 y 8 ohmios en serie y un amperímetro.')
    },
    { // 17
      t: T.PAL,
      q: 'La barra está apoyada en su centro y su peso es despreciable. ¿Qué masa X se necesita para equilibrarla?',
      o: ['5 kg', '10 kg', '15 kg', '20 kg'],
      a: 1,
      e: 'Se suman los momentos de cada lado. Izquierda: 30 kg × 2 m = 60 kg·m. Derecha: 20 kg × 1,5 m + X × 3 m = 30 + 3X. Igualando: 60 = 30 + 3X, de donde X = 10 kg. Cuando hay varias cargas en un mismo lado, sus momentos se suman.',
      d: svg(330, 192, ext(80, 108, 161) + ext(160, 134, 183) + ext(220, 108, 161) + ext(280, 108, 183) +
        beam(50, 302, 104) + box(60, 70, 40, 30, '30 kg') + box(200, 72, 40, 28, '20 kg') + box(263, 72, 34, 28, 'X') + fulcrum(160, 108) +
        dim(80, 160, 156, '2 m') + dim(160, 220, 156, '1,5 m') + dim(160, 280, 178, '3 m'),
        'Barra apoyada en el centro: 30 kg a 2 m a la izquierda; 20 kg a 1,5 m y una masa X a 3 m a la derecha.')
    },
    { // 18
      sh: 1,
      t: T.FLU,
      q: 'Se pone a flotar el mismo bloque de madera en agua dulce y en agua salada. ¿En cuál queda más alto, con menos parte sumergida?',
      o: ['En el agua dulce', 'En el agua salada', 'Queda igual en las dos'],
      a: 1,
      e: 'Un cuerpo flota cuando el peso del líquido que desaloja iguala su propio peso (principio de Arquímedes). El agua salada es más densa: cada litro pesa más, así que el bloque necesita desalojar menos volumen para equilibrar su peso y queda más alto. Por eso es más fácil flotar en el mar que en una piscina, y un barco se hunde un poco más al pasar del mar a un río.',
      d: svg(320, 188, tank(30, 70, 110, 90, 92) + tank(180, 70, 110, 90, 92) + `<rect class="water2" x="181" y="92" width="108" height="67"/>` +
        rect(65, 26, 40, 26, 'wood', 2) + rect(215, 26, 40, 26, 'wood', 2) + arrow(85, 56, 85, 86) + arrow(235, 56, 235, 86) +
        txt(85, 176, 'Agua dulce', 'tb') + txt(235, 176, 'Agua salada', 'tb'),
        'El mismo bloque de madera a punto de ponerse en agua dulce y en agua salada.')
    },
    { // 19
      t: T.MOV,
      q: 'Un carro de montaña rusa parte del reposo en A y rueda sin fricción por la pista. ¿En qué punto va más rápido?',
      o: ['En el punto A', 'En el punto B', 'En el punto C', 'En el punto D'],
      a: 2,
      e: 'Sin fricción, la energía total se conserva: la altura que pierde el carro se convierte en velocidad. Por eso la velocidad en cada punto depende solo de cuánto ha bajado desde A, no de la forma de la pista. C es el punto más bajo de todo el recorrido; ahí ha perdido más altura y lleva la mayor velocidad. En A la velocidad es cero porque parte del reposo.',
      d: svg(320, 196, path('M14,42 C50,42 65,138 95,138 C125,138 130,84 155,84 C180,84 195,160 225,160 C255,160 275,100 304,100', 'track') +
        rect(8, 28, 24, 12, 'car', 3) + circ(14, 42, 3, 'axle') + circ(27, 42, 3, 'axle') + dot(155, 84, 3.6, 'pt') + dot(225, 160, 3.6, 'pt') + dot(304, 100, 3.6, 'pt') +
        txt(20, 14, 'A', 'tb') + txt(155, 68, 'B', 'tb') + txt(225, 176, 'C', 'tb') + txt(304, 84, 'D', 'tb') + ground(8, 312, 188),
        'Perfil de una montaña rusa: A es la salida, la más alta; B una cima intermedia; C el valle más bajo; D un punto en la subida final.')
    },
    { // 20
      t: T.MAQ,
      q: 'Un tornillo tiene un paso de rosca de 2 mm. ¿Cuántas vueltas completas hay que darle a la tuerca para que avance 10 mm?',
      o: ['2 vueltas', '5 vueltas', '10 vueltas', '20 vueltas'],
      a: 1,
      e: 'El paso es la distancia que avanza la tuerca en una vuelta completa (en una rosca de una entrada, la distancia entre dos crestas). Para avanzar 10 mm con un paso de 2 mm se necesitan 10 ÷ 2 = 5 vueltas. Una rosca de paso fino avanza menos por vuelta, pero aprieta con más fuerza y se afloja menos con la vibración.',
      d: (() => {
        let th = '';
        for (let x = 60; x <= 272; x += 10) th += line(x, 75, x + 5, 105, 'thread');
        return svg(320, 150, rect(30, 60, 26, 60, 'beam', 2) + rect(56, 75, 224, 30, 'shank') + th + rect(180, 62, 40, 56, 'load', 2) +
          rot(200, 90, 44, 'cw', -135, 70) + dim(80, 90, 66, 'paso 2 mm', { ly: 48 }) + txt(200, 136, 'Tuerca', 'ts'),
          'Tornillo con paso de rosca de 2 mm y una tuerca.');
      })()
    }
  ];

  /* =========================================================================
     TEST 3 — Avanzado
     ========================================================================= */
  const test3 = [
    { // 1
      sh: 1,
      t: T.ENG,
      q: 'A y C tienen 20 dientes cada uno; B, el engranaje intermedio, tiene 50. Si A gira a 100 rpm en sentido horario, ¿cómo gira C?',
      o: ['A 100 rpm, en sentido horario', 'A 100 rpm, en sentido antihorario', 'A 40 rpm, en sentido horario', 'A 250 rpm, en sentido antihorario'],
      a: 0,
      e: 'B es un engranaje intermedio (también llamado loco): su número de dientes no cambia la relación final. De A a B: 100 × 20 ÷ 50 = 40 rpm. De B a C: 40 × 50 ÷ 20 = 100 rpm, lo mismo que si A engranara directamente con C. Lo que sí hace el intermedio es invertir el sentido una vez más: A horario, B antihorario, C horario. Se usa para conservar el sentido de giro o para salvar la distancia entre dos ejes.',
      d: (() => {
        const y = 84, d = mesh(26, 55), xA = 160 - d, xC = 160 + d;
        return svg(320, 168, gear(xA, y, 26, 20, { label: 'A' }) + gear(160, y, 55, 50, { label: 'B', phase: 2 }) + gear(xC, y, 26, 20, { label: 'C', phase: 4 }) +
          rot(xA, y, 35, 'cw', -170, 70) + txt(xA, y + 42, '20 dientes', 'ts') + txt(xA, y + 56, '100 rpm', 'ts') +
          txt(160, y + 72, '50 dientes', 'ts') + txt(xC, y + 42, '20 dientes', 'ts') + txt(xC, y - 44, '?', 'tq'),
          'Engranaje A de 20 dientes, intermedio B de 50 y C de 20, en fila.');
      })()
    },
    { // 2
      t: T.ENG,
      q: 'Un tornillo sinfín de una entrada mueve una rueda de 40 dientes. ¿Cuántas vueltas debe dar el sinfín para que la rueda dé una vuelta completa?',
      o: ['1 vuelta', '4 vueltas', '20 vueltas', '40 vueltas'],
      a: 3,
      e: 'En un sinfín de una entrada, cada vuelta del tornillo hace avanzar la rueda exactamente un diente. Para que la rueda de 40 dientes complete una vuelta, el sinfín debe girar 40 veces: la reducción es de 40 a 1. Por esa gran reducción, y porque por lo general la rueda no puede hacer girar al sinfín, se usa en malacates, compuertas y en las clavijas de las guitarras.',
      d: (() => {
        let h = '';
        for (let x = 78; x <= 240; x += 11) h += line(x, 38, x + 8, 66, 'thread');
        return svg(320, 194, gear(160, 118, 52, 40) + line(36, 52, 70, 52, 'shaft') + line(250, 52, 286, 52, 'shaft') +
          rect(70, 38, 180, 28, 'shank', 6) + h + rot(36, 52, 13, 'cw', -200, 250) +
          txt(160, 22, 'Tornillo sinfín', 'ts') + txt(160, 184, 'Rueda de 40 dientes', 'ts'),
          'Tornillo sinfín horizontal engranado sobre una rueda dentada de 40 dientes.');
      })()
    },
    { // 3
      t: T.POL,
      q: 'La carga de 120 kg cuelga del bloque inferior del aparejo. Sin fricción ni peso de las poleas, ¿qué fuerza F se necesita para sostenerla?',
      o: ['La equivalente a 30 kg', 'La equivalente a 40 kg', 'La equivalente a 60 kg', 'La equivalente a 120 kg'],
      a: 1,
      e: 'Se cuentan los tramos de cuerda que sostienen el bloque inferior: el que está amarrado a él y los dos que pasan por su polea, en total 3. La carga se reparte entre ellos: 120 kg ÷ 3 = 40 kg. Amarrar el extremo de la cuerda al bloque móvil, en lugar de al fijo, añade un tramo de apoyo y aumenta la ventaja mecánica.',
      d: svg(320, 200, ceil(98, 222, 12) + line(160, 12, 160, 24, 's2') + rect(105, 24, 110, 7, 'beam', 1) +
        line(130, 31, 130, 52, 's2') + line(190, 31, 190, 52, 's2') + pulley(130, 52, 15) + pulley(190, 52, 15) +
        line(160, 122, 160, 146, 's2') + rect(108, 146, 70, 6, 'beam', 1) + pulley(160, 122, 15) + hang(143, 152, 164, 56, 28, '120 kg') +
        line(115, 146, 115, 52, 'rope') + path('M115,52 A15,15 0 0 1 145,52', 'rope') + line(145, 52, 145, 122, 'rope') +
        path('M145,122 A15,15 0 0 0 175,122', 'rope') + line(175, 122, 175, 52, 'rope') + path('M175,52 A15,15 0 0 1 205,52', 'rope') +
        line(205, 52, 205, 150, 'rope') + arrow(205, 150, 205, 182) + txt(217, 166, 'F', 'tb', 'start'),
        'Aparejo con dos poleas fijas arriba y una polea móvil abajo; la cuerda está amarrada al bloque inferior, del que cuelgan 120 kg.')
    },
    { // 4
      t: T.PAL,
      q: 'El antebrazo funciona como una palanca: el apoyo es el codo, el músculo tira hacia arriba a 5 cm del codo y la mano sostiene 5 kg a 30 cm. Despreciando el peso del antebrazo, ¿qué fuerza hace el músculo?',
      o: ['La equivalente a 0,8 kg', 'La equivalente a 5 kg', 'La equivalente a 30 kg', 'La equivalente a 150 kg'],
      a: 2,
      e: 'Es una palanca de tercer grado: la fuerza se aplica entre el apoyo y la carga. Momentos respecto al codo: F × 5 cm = 5 kg × 30 cm, de donde F = 150 ÷ 5 = 30 kg. Este tipo de palanca exige más fuerza que la carga, pero a cambio la mano se mueve mucho más rápido y recorre más distancia que el punto donde tira el músculo. Las pinzas y las escobas trabajan igual.',
      d: svg(320, 204, ext(60, 119, 196) + ext(95, 116, 174) + ext(270, 156, 196) +
        line(60, 110, 60, 22, 'limb') + rect(60, 104, 222, 12, 'limb-r', 6) + circ(60, 110, 9, 'hub') +
        hang(270, 116, 128, 40, 28, '5 kg') + arrow(95, 102, 95, 56) + txt(106, 68, 'F', 'tb', 'start') +
        txt(70, 30, 'brazo', 'ts', 'start') + txt(28, 110, 'codo', 'ts', 'end') +
        dim(60, 95, 170, '5 cm') + dim(60, 270, 192, '30 cm'),
        'Antebrazo horizontal con el codo como apoyo, el músculo tirando hacia arriba a 5 cm y una carga de 5 kg en la mano a 30 cm.')
    },
    { // 5
      t: T.RES,
      q: 'Todos los resortes son iguales y cada uno se alarga 1 cm por cada 10 N de carga. ¿Cuánto baja la carga de 20 N respecto a la posición sin carga?',
      o: ['1,5 cm', '2 cm', '3 cm', '4 cm'],
      a: 2,
      e: 'Se analiza por partes. El resorte inferior soporta toda la carga, 20 N, y se alarga 2 cm. Los dos resortes superiores están en paralelo y se reparten esos 20 N: cada uno carga 10 N y se alarga 1 cm, así que la barra baja 1 cm. El desplazamiento total de la carga es la suma: 1 cm + 2 cm = 3 cm.',
      d: svg(320, 180, ceil(110, 210, 15) + springV(135, 15, 75, 5, 8) + springV(185, 15, 75, 5, 8) + rect(124, 75, 72, 6, 'beam', 1) +
        springV(160, 81, 140, 5, 8) + box(135, 140, 50, 28, '20 N'),
        'Dos resortes en paralelo arriba, unidos por una barra, y debajo un tercer resorte en serie del que cuelgan 20 N.')
    },
    { // 6
      t: T.ELE,
      q: 'En el circuito, el interruptor A está cerrado y el interruptor B está abierto. ¿Qué bombillos encienden?',
      o: ['X, Y y Z', 'X y Z', 'Solo Z', 'Ninguno'],
      a: 1,
      e: 'X está en la línea principal, en serie con todo lo demás; Y y Z están en paralelo entre sí. Con A cerrado, la corriente sale de la batería y pasa por X. Al llegar al punto donde el circuito se divide, la rama de Y está cortada por B, pero la rama de Z está completa. La corriente vuelve a la batería por Z, así que encienden X y Z. Si se abriera A, se apagaría todo, porque está en la línea principal.',
      d: svg(320, 176, wire([[40, 40], [290, 40]]) + wire([[40, 150], [290, 150]]) + wire([[40, 40], [40, 150]]) +
        wire([[200, 40], [200, 150]]) + wire([[290, 40], [290, 150]]) + batt(40, 95, 'v') +
        sw(66, 100, 40, false, 'A', { dy: -15 }) + bulb(145, 40, 'X') + dot(200, 40, 3, 'jn') + dot(200, 150, 3, 'jn') +
        bulb(200, 74, 'Y', { lab: [-18, 0, 'end'] }) + swV(200, 106, 136, true, 'B', { dx: -12 }) + bulb(290, 95, 'Z', { lab: [-18, 0, 'end'] }),
        'Batería, interruptor A cerrado y bombillo X en la línea principal; luego dos ramas en paralelo: Y con el interruptor B abierto, y Z.')
    },
    { // 7
      t: T.ELE,
      q: 'Dos resistencias de 6 Ω están conectadas en paralelo a una batería de 12 V. ¿Qué corriente marca el amperímetro A de la línea principal?',
      o: ['1 A', '2 A', '4 A', '6 A'],
      a: 2,
      e: 'Cada resistencia queda conectada directamente a los 12 V de la batería, así que por cada una pasan I = 12 V ÷ 6 Ω = 2 A. El amperímetro está en la línea principal y mide la suma de las dos ramas: 2 A + 2 A = 4 A. Visto de otra forma, dos resistencias iguales en paralelo equivalen a la mitad de una (3 Ω), y 12 V ÷ 3 Ω = 4 A.',
      d: svg(320, 176, wire([[70, 40], [280, 40]]) + wire([[70, 150], [280, 150]]) + wire([[70, 40], [70, 150]]) +
        wire([[190, 40], [190, 150]]) + wire([[280, 40], [280, 150]]) + batt(70, 95, 'v', '12 V') + meter(128, 40, 'A') +
        dot(190, 40, 3, 'jn') + dot(190, 150, 3, 'jn') + res(190, 95, 'v', '6 Ω', { dx: 13 }) + res(280, 95, 'v', '6 Ω', { dx: -13, an: 'end' }),
        'Batería de 12 V con dos resistencias de 6 ohmios en paralelo y un amperímetro en la línea principal.')
    },
    { // 8
      t: T.EST,
      q: 'Una barra uniforme de 4 m y 10 kg tiene colgado en su extremo izquierdo un bloque de 10 kg. ¿En qué punto hay que apoyarla para que quede en equilibrio?',
      o: ['En A, a 0,5 m del extremo izquierdo', 'En B, a 1 m del extremo izquierdo', 'En C, a 1,5 m del extremo izquierdo', 'En D, en el centro de la barra'],
      a: 1,
      e: 'El peso de una barra uniforme actúa en su centro, a 2 m del extremo. El apoyo debe quedar en el centro de gravedad del conjunto: (10 kg × 0 m + 10 kg × 2 m) ÷ 20 kg = 1 m desde el extremo izquierdo, es decir, en B. Comprobación con momentos respecto a B: el bloque da 10 kg × 1 m = 10 kg·m a la izquierda, y la barra 10 kg × 1 m = 10 kg·m a la derecha.',
      d: (() => {
        let m = '';
        [['A', 70], ['B', 100], ['C', 130], ['D', 160]].forEach(([l, x]) => { m += line(x, 86, x, 95, 's2') + txt(x, 76, l, 'tb'); });
        return svg(320, 186, ext(40, 152, 174) + ext(280, 105, 174) + beam(40, 280, 100, 10) + m + hang(40, 105, 124, 36, 28, '10 kg') +
          txt(214, 120, 'Barra uniforme de 10 kg', 'ts') + dim(40, 280, 170, '4 m'),
          'Barra uniforme de 4 m con un bloque de 10 kg colgado del extremo izquierdo. Puntos A, B, C y D a 0,5, 1, 1,5 y 2 m del extremo.');
      })()
    },
    { // 9
      t: T.FLU,
      q: 'En un gato hidráulico, el pistón pequeño (5 cm²) baja 10 cm. ¿Cuánto sube el pistón grande (50 cm²)?',
      o: ['0,1 cm', '1 cm', '10 cm', '100 cm'],
      a: 1,
      e: 'El aceite es prácticamente incompresible: el volumen que desplaza el pistón pequeño es el mismo que entra bajo el grande. Volumen desplazado: 5 cm² × 10 cm = 50 cm³. En el pistón grande: 50 cm³ ÷ 50 cm² = 1 cm. La fuerza se multiplica por 10, pero el recorrido se divide por 10; el trabajo (fuerza × distancia) es el mismo a la entrada y a la salida. Por eso hay que bombear muchas veces la palanca del gato para subir un carro unos centímetros.',
      d: svg(320, 196, hydra({ f1: 'baja 10 cm', f2: '¿cuánto sube?', a1: '5 cm²', a2: '50 cm²' }),
        'Gato hidráulico: el pistón pequeño de 5 centímetros cuadrados baja 10 cm; el grande es de 50.')
    },
    { // 10
      t: T.FLU,
      q: 'Una máquina que pesa 1 200 N descansa sobre una base cuya área de contacto con el piso es de 0,4 m². ¿Qué presión ejerce sobre el piso?',
      o: ['480 Pa', '1 200 Pa', '3 000 Pa', '30 000 Pa'],
      a: 2,
      e: 'La presión es la fuerza repartida sobre el área: P = F ÷ A = 1 200 N ÷ 0,4 m² = 3 000 Pa (3 kPa). Si se duplica el área de apoyo, la presión se reduce a la mitad. Es el mismo criterio con el que se dimensionan las zapatas: se amplía la base hasta que la presión quede por debajo de la que admite el suelo.',
      d: svg(320, 178, ground(20, 300, 150) + rect(90, 134, 140, 16, 'concrete') + box(118, 64, 84, 70, 'Máquina') +
        arrow(160, 18, 160, 58) + txt(172, 30, '1 200 N', 'tb', 'start') + txt(160, 166, 'Área de contacto: 0,4 m²', 'ts'),
        'Máquina de 1 200 N sobre una base con 0,4 metros cuadrados de contacto con el piso.')
    },
    { // 11
      t: T.POL,
      q: 'La polea del motor, de 10 cm de diámetro, gira a 1 200 rpm y mueve con una correa una polea de 30 cm de diámetro. ¿A cuántas rpm gira la polea grande?',
      o: ['133 rpm', '400 rpm', '1 200 rpm', '3 600 rpm'],
      a: 1,
      e: 'La correa avanza a la misma velocidad sobre las dos poleas, así que las rpm son inversamente proporcionales a los diámetros: rpm de la grande = 1 200 × 10 ÷ 30 = 400 rpm. La polea grande gira tres veces más lento, pero con el triple de par. Así se reducen las revoluciones de un motor eléctrico para mover una mezcladora o una bomba.',
      d: svg(320, 176, box(26, 52, 46, 56, 'M') + line(72, 80, 96, 80, 'shaft') + pulley(96, 80, 18) + pulley(236, 80, 54) + beltOpen(96, 80, 18, 236, 54) +
        txt(96, 114, '10 cm', 'ts') + txt(96, 129, '1 200 rpm', 'ts') + txt(236, 148, '30 cm', 'ts') + txt(236, 163, '¿rpm?', 'ts') + txt(49, 122, 'Motor', 'ts'),
        'Motor con polea de 10 cm unida por correa a una polea de 30 cm.')
    },
    { // 12
      t: T.EST,
      q: 'Los tres bloques son macizos y uniformes, y la fricción impide que se deslicen. A es más ancho que alto, B es un cubo y C es cuatro veces más alto que ancho. Sobre esta pendiente de 25°, ¿cuál se vuelca?',
      o: ['El bloque A', 'El bloque B', 'El bloque C', 'Ninguno'],
      a: 2,
      e: 'Un bloque sobre una pendiente se vuelca cuando la vertical trazada desde su centro de gravedad cae por fuera de su base. En un bloque uniforme eso ocurre cuando la tangente de la pendiente supera la relación ancho ÷ alto. Aquí la tangente de 25° es ≈ 0,47. A (ancho ÷ alto ≈ 2,4) y B (= 1) están muy por encima de ese valor y se mantienen. C es cuatro veces más alto que ancho (ancho ÷ alto = 0,25): la vertical de su centro de gravedad cae fuera de la base y se vuelca.',
      d: (() => {
        const x0 = 16, y0 = 170, deg = 25, L = 290;
        const end = [x0 + L * Math.cos(rad(deg)), y0 - L * Math.sin(rad(deg))];
        const A = onSlope(x0, y0, deg, 46, 52, 22), B = onSlope(x0, y0, deg, 128, 34, 34), C = onSlope(x0, y0, deg, 206, 16, 64);
        const lab = (o, h, s) => { const [x, y] = o.at(0, h + 13); return txt(x, y, s, 'tb'); };
        const [ax2, ay2] = P(x0, y0, 36, -deg);
        return svg(320, 184, polygon([[x0, y0], [r2(end[0]), y0], end.map(r2)], 'ramp') + ground(8, 312, y0) +
          A.svg + B.svg + C.svg + dot(A.cg[0], A.cg[1], 3.2, 'cg') + dot(B.cg[0], B.cg[1], 3.2, 'cg') + dot(C.cg[0], C.cg[1], 3.2, 'cg') +
          lab(A, 22, 'A') + lab(B, 34, 'B') + lab(C, 64, 'C') +
          `<path class="dim" d="M${x0 + 36},${y0} A36,36 0 0 0 ${ax2},${ay2}"/>` + txt(x0 + 50, y0 - 8, '25°', 'td', 'start'),
          'Pendiente de 25 grados con tres bloques: A bajo y ancho, B cúbico y C alto y angosto. El punto marca el centro de gravedad.');
      })()
    },
    { // 13
      sh: 1,
      t: T.MOV,
      q: 'En el mismo instante, la bola A se deja caer desde el borde izquierdo de la mesa y la bola B sale disparada horizontalmente por el borde derecho. Sin resistencia del aire, ¿cuál llega primero al piso?',
      o: ['La bola A', 'La bola B', 'Llegan al mismo tiempo'],
      a: 2,
      e: 'El movimiento horizontal y el vertical son independientes. Las dos bolas parten de la misma altura con velocidad vertical cero, y la gravedad las acelera hacia abajo exactamente igual, así que tardan lo mismo en caer. La velocidad horizontal de B solo hace que caiga más lejos, no que tarde más. Desde 0,8 m de altura, por ejemplo, ambas tardan unos 0,4 s.',
      d: svg(320, 184, rect(70, 50, 100, 8, 'beam', 1) + line(80, 58, 80, 172, 's2') + line(160, 58, 160, 172, 's2') + ground(10, 310, 172) +
        line(62, 50, 62, 165, 'trail') + path('M172,42 Q236,42 300,165', 'trail') +
        circ(62, 42, 7, 'bob') + circ(160, 43, 7, 'bob') + arrow(168, 26, 204, 26) + txt(62, 22, 'A', 'tb') + txt(150, 24, 'B', 'tb'),
        'Mesa: la bola A cae libre desde el borde izquierdo y la bola B sale horizontal por el borde derecho.')
    },
    { // 14
      t: T.PAL,
      q: 'Con una barra de 2 m, de peso despreciable, se quiere levantar una piedra de 700 N que está en un extremo. El apoyo está a 0,25 m de la piedra. ¿Qué fuerza hay que aplicar en el otro extremo?',
      o: ['100 N', '175 N', '350 N', '700 N'],
      a: 0,
      e: 'Brazo de la carga: 0,25 m. Brazo de la fuerza: 2 m − 0,25 m = 1,75 m. Equilibrio de momentos: F × 1,75 m = 700 N × 0,25 m = 175 N·m, de donde F = 100 N. Una barra apoyada cerca de la carga es una palanca de primer grado con ventaja mecánica de 1,75 ÷ 0,25 = 7.',
      d: svg(330, 172, ext(40, 116, 154) + ext(72.5, 132, 154) + ext(300, 116, 154) + beam(40, 300, 110) +
        polygon([[18, 106], [24, 76], [44, 68], [62, 78], [64, 106]], 'rock') + txt(41, 92, '700 N', 'ts') +
        fulcrum(72.5, 114, 14) + arrow(300, 62, 300, 104) + txt(312, 76, 'F', 'tb', 'start') +
        dim(40, 72.5, 150, '0,25 m', { ly: 164, lx: 50 }) + dim(72.5, 300, 150, '1,75 m'),
        'Barra de 2 m con el apoyo a 0,25 m de una piedra de 700 N; la fuerza se aplica en el otro extremo.')
    },
    { // 15
      t: T.ENG,
      q: 'Un piñón de 20 dientes engrana con una cremallera cuyos dientes están separados 5 mm (paso). Si el piñón da una vuelta completa, ¿cuánto avanza la cremallera?',
      o: ['20 mm', '50 mm', '100 mm', '200 mm'],
      a: 2,
      e: 'En una vuelta completa, los 20 dientes del piñón pasan por el punto de contacto, y cada uno empuja la cremallera un diente, es decir, un paso. Avance = 20 dientes × 5 mm = 100 mm. Si el piñón da media vuelta, la cremallera avanza 50 mm; el desplazamiento es siempre proporcional al giro.',
      d: (() => {
        const p = (2 * Math.PI * pitch(40)) / 20, c1 = 30 + 18 * p + 0.36 * p, c2 = c1 + p;
        return svg(320, 166, rackPinion(20, txt(212, 40, '20 dientes', 'ts', 'start') + dim(r2(c1), r2(c2), 96, 'paso 5 mm', { ly: 82, lx: 252 })),
          'Piñón de 20 dientes sobre una cremallera con paso de 5 mm.');
      })()
    },
    { // 16
      sh: 1,
      t: T.CAL,
      q: 'La lámina bimetálica está formada por latón (arriba) y acero (abajo), unidos firmemente. El latón se dilata más que el acero con el calor. Al calentarla, ¿hacia dónde se curva el extremo libre?',
      o: ['Hacia arriba, del lado del latón', 'Hacia abajo, del lado del acero', 'No se curva; solo se alarga'],
      a: 1,
      e: 'Al calentarse, el latón se alarga más que el acero, pero como están unidos, la lámina solo puede acomodar esa diferencia curvándose. La capa que más se alarga queda en el lado exterior de la curva y la que menos se alarga, en el interior. El latón queda por fuera, arriba, y la lámina se curva hacia abajo, hacia el acero. Este principio se usa en termostatos e interruptores térmicos.',
      d: svg(320, 160, wall(40, 40, 120) + rect(40, 74, 230, 10, 'brass') + rect(40, 84, 230, 10, 'steel') +
        txt(150, 62, 'Latón', 'ts') + txt(150, 108, 'Acero', 'ts') + path('M150,118 C164,132 164,146 150,152 C136,146 136,132 150,118 Z', 'flame') +
        txt(170, 140, 'calor', 'ts', 'start') + txt(286, 84, '?', 'tq'),
        'Lámina de latón arriba y acero abajo, empotrada a la izquierda, con una llama debajo.')
    },
    { // 17
      sh: 1,
      t: T.FLU,
      q: 'El sifón está lleno de agua y sus dos extremos están sumergidos. ¿Hasta cuándo pasa agua del tanque A al tanque B?',
      o: ['Hasta que A se vacíe por completo', 'Hasta que los niveles de A y B se igualen', 'Hasta que B se llene hasta el borde', 'No pasa agua, porque tendría que subir'],
      a: 1,
      e: 'Un sifón funciona por la diferencia de nivel entre las superficies de agua de los dos tanques: la columna del lado de B es más larga, pesa más y arrastra el agua, mientras la presión atmosférica empuja el agua de A hacia arriba por el tubo. Mientras el nivel de A esté más alto que el de B, el agua pasa de A a B. Cuando los niveles se igualan, desaparece la diferencia que la impulsa y el flujo se detiene. Si el extremo del tubo en A quedara al aire antes, el sifón se descebaría.',
      d: svg(320, 192, tank(30, 46, 92, 124, 66) + tank(198, 46, 92, 124, 128) + ground(16, 306, 170) +
        path('M100,152 V26 H220 V156', 'tube-o') + path('M100,152 V26 H220 V156', 'tube-i') +
        txt(76, 184, 'Tanque A', 'tb') + txt(244, 184, 'Tanque B', 'tb'),
        'Dos tanques: A con el nivel de agua alto y B con el nivel bajo, unidos por un sifón.')
    },
    { // 18
      t: T.POL,
      q: 'El plato de una bicicleta tiene 48 dientes y el piñón trasero tiene 16. ¿Cuántas vueltas da la rueda trasera por cada vuelta completa de los pedales?',
      o: ['Un tercio de vuelta', '1 vuelta', '3 vueltas', '32 vueltas'],
      a: 2,
      e: 'Una vuelta del plato arrastra 48 eslabones de cadena, y el piñón da una vuelta cada 16 eslabones: 48 ÷ 16 = 3 vueltas. La rueda trasera está fija al piñón, así que también da 3 vueltas. Con un piñón más grande la relación baja: se pedalea más suave, pero la bicicleta avanza menos por cada pedalazo.',
      d: (() => {
        const [px, py] = P(100, 92, 40, 60);
        return svg(320, 174, circ(240, 92, 72, 'ghost') + gear(100, 92, 50, 48) + gear(240, 92, 18, 16) + beltOpen(100, 92, pitch(50), 240, pitch(18), 'chain') +
          line(100, 92, px, py, 'crank') + rect(px - 10, py - 3, 20, 6, 'beam', 2) +
          txt(100, 158, 'Plato: 48 dientes', 'ts') + txt(240, 126, 'Piñón: 16 dientes', 'ts') + txt(292, 26, 'Rueda', 'ts'),
          'Transmisión de bicicleta: plato de 48 dientes unido por cadena a un piñón trasero de 16 dientes.');
      })()
    },
    { // 19
      t: T.ELE,
      q: 'Un horno eléctrico de 2 400 W funciona a 120 V. ¿Cuál es el fusible más adecuado para protegerlo?',
      o: ['De 10 A', 'De 15 A', 'De 25 A', 'De 60 A'],
      a: 2,
      e: 'Primero se calcula la corriente normal de trabajo: I = P ÷ V = 2 400 W ÷ 120 V = 20 A. El fusible debe soportar esa corriente sin fundirse, así que se descartan los de 10 A y 15 A. Además debe fundirse ante una sobrecarga o un cortocircuito, por lo que se elige el valor inmediatamente superior a la corriente normal: 25 A. Uno de 60 A dejaría pasar corrientes peligrosas para el cable sin cortar el circuito.',
      d: svg(320, 176, wire([[80, 40], [270, 40], [270, 150], [80, 150], [80, 40]]) +
        meter(80, 95, '~', '120 V', { dx: -18, dy: 0, an: 'end' }) + rect(150, 33, 50, 14, 'fuse', 2) + line(150, 40, 200, 40, 'wire') +
        txt(175, 20, 'Fusible', 'tb') + res(270, 95, 'v') + txt(254, 88, 'Horno', 'tb', 'end') + txt(254, 104, '2 400 W', 'ts', 'end'),
        'Fuente de 120 voltios, un fusible y un horno de 2 400 vatios.')
    },
    { // 20
      t: T.MOV,
      q: 'Los tres péndulos se sueltan desde un ángulo pequeño. ¿Cuál tarda más en completar una oscilación de ida y vuelta?',
      o: ['A, el de la masa más pesada', 'B, el de la cuerda más larga', 'C', 'Los tres tardan lo mismo'],
      a: 1,
      e: 'Para oscilaciones pequeñas, el periodo de un péndulo depende solo de la longitud de la cuerda y de la gravedad: T = 2π √(L ÷ g). La masa no influye, así que A y C, que tienen la misma longitud, oscilan al mismo ritmo aunque A sea más pesado. B tiene la cuerda más larga y es el más lento. Para que un péndulo tarde el doble en cada oscilación, su cuerda debe ser cuatro veces más larga.',
      d: svg(320, 192, ceil(30, 290, 20) + line(70, 20, 70, 85, 's2') + circ(70, 85, 11, 'bob') + line(160, 20, 160, 150, 's2') + circ(160, 150, 7, 'bob') +
        line(250, 20, 250, 85, 's2') + circ(250, 85, 7, 'bob') +
        txt(78, 50, '1 m', 'td', 'start') + txt(168, 84, '2 m', 'td', 'start') + txt(258, 50, '1 m', 'td', 'start') +
        txt(70, 108, '1 kg', 'ts') + txt(70, 124, 'A', 'tb') + txt(160, 168, '0,2 kg', 'ts') + txt(160, 184, 'B', 'tb') +
        txt(250, 108, '0,2 kg', 'ts') + txt(250, 124, 'C', 'tb'),
        'Tres péndulos: A de 1 m con 1 kg, B de 2 m con 0,2 kg y C de 1 m con 0,2 kg.')
    }
  ];

  global.TESTS = [
    { id: 1, name: 'Test 1', level: 'Fundamentos', blurb: 'Engranajes, poleas, palancas, circuitos simples y presión del agua.', qs: test1 },
    { id: 2, name: 'Test 2', level: 'Intermedio', blurb: 'Trenes de engranajes, aparejos, carretilla, potencia eléctrica y caudal.', qs: test2 },
    { id: 3, name: 'Test 3', level: 'Avanzado', blurb: 'Engranaje loco, sinfín, centro de gravedad, sifón, dilatación y fusibles.', qs: test3 }
  ];
  global.TOPICS = T;
})(window);
