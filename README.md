# Comprensión mecánica · Mechanical comprehension

App web para practicar pruebas de comprensión mecánica desde el celular, en **español o inglés** (selector ES | EN).

Mobile web app to practice mechanical comprehension tests, in **Spanish or English** (ES | EN switch).

**Abrir la app:** https://jjospinagon.github.io/test-mecanico/

## Qué trae

- 3 tests de 20 preguntas (Fundamentos, Intermedio y Avanzado), 60 en total, cada una con su diagrama.
- Temas: engranajes, poleas, correas y cadenas, palancas y momentos, resortes, electricidad, fluidos y presión, equilibrio y estabilidad, movimiento y energía, máquinas simples y calor.
- Al terminar: puntaje inmediato, resultado por pregunta y por tema, y en cada error la respuesta correcta con su explicación completa.
- Reporte para guardar en PDF o compartir, y opción de repasar solo las preguntas falladas.
- Bilingüe: el selector ES | EN cambia la interfaz, las preguntas, las opciones, las explicaciones y los textos de los diagramas, incluso a mitad de un test sin perder las respuestas. La app recuerda el idioma elegido.
- Se adapta al celular en vertical y en horizontal, y al modo oscuro. El avance se guarda en el propio dispositivo.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Página principal |
| `css/styles.css` | Estilos (móvil primero, vertical/horizontal, impresión) |
| `js/draw.js` | Funciones para dibujar los diagramas en SVG |
| `js/questions.js` | Banco de preguntas en español, respuesta correcta y diagramas |
| `js/questions-en.js` | Versión en inglés de enunciados, opciones y explicaciones |
| `js/app.js` | Flujo del test, puntaje y reporte |

## Agregar o corregir preguntas

Cada pregunta en `js/questions.js` tiene esta forma:

```js
{
  t: T.ENG,                 // tema
  q: 'Enunciado…',          // pregunta
  o: ['Opción 1', 'Opción 2', 'Opción 3'],
  a: 0,                     // índice de la opción correcta (0 = la primera)
  e: 'Explicación completa…',
  d: svg(320, 160, …)       // diagrama
}
```

La versión en inglés va en `js/questions-en.js` con la clave `"test-pregunta"` (por ejemplo `'2-5'`) y las opciones en el mismo orden. Los textos de los diagramas usan `LG('español', 'English')`.

Con `sh: 1` las opciones se barajan en cada intento (solo para opciones que no son números ni letras del dibujo).

## Créditos

Preguntas, diagramas y explicaciones originales, elaborados para esta app de práctica. No reproducen material de libros ni de pruebas oficiales.
