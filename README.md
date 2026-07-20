# Escape Room

Juego web 2D de misterio creado con HTML, CSS y JavaScript sobre `canvas`.

El objetivo es resolver enigmas, descubrir los tres dígitos ocultos y escapar antes de que se agote el tiempo.

## Características actuales

- Dos zonas principales: sala de enigmas y puerta de salida.
- Puzles integrados: velas, colores, manuscrito/libro, cofre de runas y teclado final.
- Diálogos narrativos contextuales según progreso.
- Dificultad configurable desde Opciones:
	- `FÁCIL`: 10 min
	- `ESTÁNDAR`: 7 min
	- `DIFÍCIL`: 5 min
- Selector de dificultad con flechas izquierda/derecha.
- Botón de pantalla completa (`FULL` / `SALIR`) en la esquina inferior derecha.
- Compatibilidad escritorio y móvil (ratón + táctil).
- Estados visuales de habitaciones según puzles resueltos.

## Controles

- `Clic` / `toque`: interactuar con objetos y botones.
- `Flechas de navegación` en escena: cambiar de zona.
- `Flechas del manuscrito`: avanzar o retroceder páginas.
- `FULL` / `SALIR`: alternar pantalla completa.
- `Opciones`: música ON/OFF y dificultad.

## Cómo jugar

1. Entrar a la sala principal.
2. Resolver los puzles para obtener los dígitos ocultos.
3. Ir al teclado de salida e introducir el código correcto.
4. Escapar antes de que termine la cuenta atrás.

## Ejecución local

### Opción rápida

Abre [index.html](index.html) directamente en el navegador.

### Opción recomendada

Usa un servidor local para evitar bloqueos de carga de algunos navegadores.

Con Python:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Estructura del proyecto

- [index.html](index.html): entrada principal.
- [main.js](main.js): motor de render, bucle principal, HUD y flujo de juego.
- [config.js](config.js): configuración central (colores, dimensiones, tiempos, assets y soluciones).
- [stateManager.js](stateManager.js): estado global, secuencias y resolución de puzles.
- [interactions.js](interactions.js): hitboxes y acciones por pantalla/modal.
- [dialogBox.js](dialogBox.js): caja de diálogo narrativa.
- [scrollText.js](scrollText.js): vista del manuscrito/libro.
- [candlesPuzzle.js](candlesPuzzle.js): puzle de velas.
- [colorsPuzzle.js](colorsPuzzle.js): puzle de colores.
- [keypadPuzzle.js](keypadPuzzle.js): teclado de salida.
- [runePuzzle.js](runePuzzle.js): cofre y puzle de runas.
- [helpers.js](helpers.js): utilidades de dibujo y colisiones.
- [audioEngine.js](audioEngine.js): control de música.
- [style.css](style.css): estilos generales de la página.
- [assets/](assets/): imágenes y audio.

## Configuración clave

La personalización principal está en [config.js](config.js):

- `GAME_SETTINGS.TIMER_DIFFICULTIES`: tiempos por dificultad.
- `GAME_RUNTIME.INTRO_SEQUENCE`: duración de los diálogos de introducción.
- `INTERFACE_DIMENSIONS`: tamaño y posición de hitboxes y controles.
- `GAME_ASSET_SOURCES`: catálogo centralizado de assets.
- `GAME_PUZZLES`: soluciones y secuencias de los enigmas.

## Tecnologías

- HTML5
- CSS3
- JavaScript (ES Modules)
- Canvas 2D API

Sin frameworks ni dependencias externas.

## Estado del proyecto

Proyecto funcional y jugable, con arquitectura modular preparada para seguir iterando contenido, balance de dificultad y mejoras de UX.
