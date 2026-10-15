# Comprensión mecánica · app de práctica

App web para practicar pruebas de comprensión mecánica desde el celular.

**Abrir la app:** https://jjospinagon.github.io/test-mecanico/

## Qué trae

- 3 tests de 20 preguntas (Fundamentos, Intermedio y Avanzado), 60 en total, cada una con su diagrama.
- Temas: engranajes, poleas, correas y cadenas, palancas y momentos, resortes, electricidad, fluidos y presión, equilibrio y estabilidad, movimiento y energía, máquinas simples y calor.
- Al terminar: puntaje inmediato, resultado por pregunta y por tema, y en cada error la respuesta correcta con su explicación completa.
- Reporte para guardar en PDF o compartir, y opción de repasar solo las preguntas falladas.
- Se adapta al celular en vertical y en horizontal, y al modo oscuro. El avance se guarda en el propio dispositivo.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Página principal |
| `css/styles.css` | Estilos (móvil primero, vertical/horizontal, impresión) |
| `js/draw.js` | Funciones para dibujar los diagramas en SVG |
| `js/questions.js` | Banco de preguntas, opciones, respuesta correcta y explicación |
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

Con `sh: 1` las opciones se barajan en cada intento (solo para opciones que no son números ni letras del dibujo).

## Créditos

Preguntas, diagramas y explicaciones originales, elaborados para esta app de práctica. No reproducen material de libros ni de pruebas oficiales.
