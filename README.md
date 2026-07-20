# Escape Room

Juego web de escape room en 2D desarrollado con HTML, CSS y JavaScript sobre `canvas`. El jugador debe explorar la sala, resolver varios puzles y obtener el código final antes de que se agote el tiempo.

## Descripción

El proyecto plantea una experiencia breve de misterio con estética narrativa y puzles encadenados. La partida transcurre entre una sala principal y una zona de salida, donde cada interacción activa paneles, pistas visuales o secuencias que desbloquean el avance.

Incluye soporte para ratón y pantallas táctiles, por lo que funciona tanto en escritorio como en móvil.

## Mecánicas principales

- Exploración por habitaciones con navegación lateral.
- Cuenta atrás de 10 minutos por partida.
- Puzle de velas con orden secreto.
- Puzle de colores con secuencia correcta.
- Libro o pergamino interactivo con texto dividido en páginas.
- Cofre de runas con lógica propia de apertura y resolución.
- Teclado numérico final para escapar.
- Estados visuales que cambian según los puzles resueltos.

## Controles

- `Clic` o `toque` para interactuar con objetos y botones.
- `Flechas de navegación` dentro de la escena para cambiar de zona.
- `Botones laterales` en el manuscrito para pasar páginas.
- `Paneles emergentes` que se cierran tocando fuera cuando corresponde.

## Tecnologías

- HTML5
- CSS3
- JavaScript ES Modules
- Renderizado con `canvas`

No requiere frameworks ni dependencias externas.

## Cómo ejecutarlo

### Opción rápida

Abre [index.html](index.html) en el navegador.

### Opción recomendada

Ejecuta el proyecto con un servidor local para evitar problemas de carga de assets en algunos navegadores.

Ejemplo con VS Code y Live Server:

```bash
Abrir index.html con Live Server
```

Si prefieres Python:

```bash
python -m http.server 8000
```

Y después abre `http://localhost:8000`.

## Estructura del proyecto

- [index.html](index.html): punto de entrada del juego.
- [main.js](main.js): bucle principal, carga de assets y renderizado general.
- [config.js](config.js): constantes, medidas, puzzles, textos y catálogo de assets.
- [stateManager.js](stateManager.js): estado global del juego y lógica de progreso.
- [interactions.js](interactions.js): hitboxes e interacciones por pantalla.
- [style.css](style.css): estilos base de la página.
- [audioEngine.js](audioEngine.js): música y control de sonido.
- [dialogBox.js](dialogBox.js): caja de diálogo narrativa.
- [scrollText.js](scrollText.js): visor del manuscrito o libro.
- [candlesPuzzle.js](candlesPuzzle.js): puzle de velas.
- [colorsPuzzle.js](colorsPuzzle.js): puzle de colores.
- [keypadPuzzle.js](keypadPuzzle.js): teclado final.
- [runePuzzle.js](runePuzzle.js): lógica y render del puzle de runas.
- [helpers.js](helpers.js): utilidades de dibujo y colisión.
- [assets/](assets/): imágenes, fondos, personajes y audio.

## Configuración del juego

La mayor parte del ajuste del proyecto está centralizada en [config.js](config.js).

Desde ahí puedes modificar:

- Tiempo total de la partida.
- Colores de interfaz.
- Posición y tamaño de hitboxes.
- Orden y solución de los puzles.
- Textos del manuscrito.
- Rutas de imágenes y música.

## Objetivo del jugador

Resolver las pistas repartidas por la escena, descubrir los dígitos ocultos y usarlos en el teclado final para escapar antes de que termine la cuenta atrás.

## Estado actual

El proyecto ya incluye:

- Navegación entre pantallas.
- Lógica de victoria y derrota.
- Compatibilidad táctil.
- Ajustes de hitbox afinados para escritorio y móvil.
- Organización modular del código para seguir ampliándolo.

## Posibles mejoras futuras

- Añadir una pantalla inicial con instrucciones narrativas.
- Incorporar más habitaciones o variantes de puzles.
- Guardado de progreso o reinicio parcial.
- Efectos de sonido por interacción.
- Pantalla final con estadísticas de tiempo.

## Autoría

Proyecto desarrollado como Escape Room web interactivo y preparado para seguir iterándose desde una estructura modular y fácil de mantener.
