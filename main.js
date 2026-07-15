/**
 * 📦 TRAER LAS PIEZAS DE LOS OTROS ARCHIVOS (Imports)
 * Conectamos las configuraciones, las funciones de dibujo y los mapas de clics.
 */
import { ROOM, INTERFACE_COLORS, INTERFACE_DIMENSIONS } from "./config.js";
import { isMouseInsideZone, drawBeveledButton, drawProportionalBackground, drawStandardRoomBackground, drawNavigationArrow } from "./helpers.js";
import { initializeInteractions, getModalInteractions, getRoomInteractions } from "./interactions.js";

// --- CONFIGURAR EL CANVAS (El lienzo de dibujo) ---
const canvasElement = document.getElementById("game-screen");
const canvasContext = canvasElement.getContext("2d");

// --- LAS CAJAS DE DATOS DEL JUEGO (Variables de Estado) ---
let mouseX = 0;                  // Guarda la posición horizontal (X) del ratón en cada momento
let mouseY = 0;                  // Guarda la posición vertical (Y) del ratón en cada momento
let currentRoom = ROOM.START;    // Controla en qué habitación o pantalla está el jugador ahora mismo
let isOptionsOpen = false;       // Controla si el menú de sonido está abierto en la pantalla
let isMusicMuted = false;        // Controla si la música del juego está silenciada o no

// --- CONFIGURAR EL REPRODUCTOR DE MÚSICA ---
const gameMusic = new Audio("assets/musicEscapeRoom.mp3");
gameMusic.loop = true;           // Hace que la canción vuelva a empezar automáticamente al terminar

// --- CONECTAR NUESTRAS VARIABLES CON EL ARCHIVO DE CLICS ---
// Le pasamos estas funciones a 'interactions.js' para que cuando alguien clique un botón,
// este archivo pueda enterarse y cambiar de sala, silenciar el audio, etc.
initializeInteractions({
	changeRoom: (targetRoom) => { currentRoom = targetRoom; },
	openExitKeypad: () => { console.log("Se ha activado la interfaz del teclado numérico."); },
	getIsMusicMuted: () => isMusicMuted,
	getGameMusic: () => gameMusic,
	openOptionsModal: () => { if (!isOptionsOpen) isOptionsOpen = true; },
	closeOptionsModal: () => { isOptionsOpen = false; },
	toggleMusic: () => {
		isMusicMuted = !isMusicMuted;
		gameMusic.muted = isMusicMuted;
		if (!isMusicMuted) {
			gameMusic.play().catch(() => console.log("Esperando a que el usuario haga clic para reproducir el audio."));
		}
	}
});

// --- GENERAR EL MAPA DE BOTONES Y HITBOXES ---
const roomInteractions = getRoomInteractions(canvasElement);

// --- CARGAR LAS IMÁGENES AUTOMÁTICAMENTE ---
const gameImages = {};
const imageSources = { start: "roomStart.png", one: "roomOne.jpg", four: "roomFour.jpg" };

// Recorremos la lista de imágenes para crearlas todas sin repetir líneas de código
Object.entries(imageSources).forEach(([key, filename]) => {
	gameImages[key] = new Image();
	gameImages[key].src = `assets/${filename}`;
});

// =========================================================================
// 🎯 CONTROLAR EL RATÓN (Eventos de movimiento y clics)
// =========================================================================

// Detectar cuándo se mueve el ratón para actualizar las coordenadas X e Y
canvasElement.addEventListener("mousemove", (event) => {
	const boundaries = canvasElement.getBoundingClientRect();
	mouseX = Math.floor(event.clientX - boundaries.left);
	mouseY = Math.floor(event.clientY - boundaries.top);
});

// Detectar cuándo el jugador hace clic en la pantalla
canvasElement.addEventListener("click", (event) => {
	const boundaries = canvasElement.getBoundingClientRect();
	const clickX = event.clientX - boundaries.left;
	const clickY = event.clientY - boundaries.top;

	// Si el menú de sonido está abierto, solo hacemos caso a los botones de dentro del menú.
	// Si está cerrado, hacemos caso a los botones normales de la habitación actual.
	const activeZones = (currentRoom === ROOM.START && isOptionsOpen)
		? getModalInteractions(canvasElement)
		: roomInteractions[currentRoom];

	// Revisamos todos los botones activos uno por uno para ver si el clic cayó dentro de alguno
	if (activeZones) {
		activeZones.forEach(zone => {
			if (isMouseInsideZone(clickX, clickY, zone)) zone.action();
		});
	}
});
// =========================================================================
// 🛠️ HERRAMIENTA DE DESARROLLO: VISOR DE COORDENADAS
// =========================================================================
// Muestra la X y la Y del cursor arriba a la izquierda para saber dónde poner los botones.
// 🔕 ¡EQUIPO!: Para quitar el visor en el juego final, buscad la línea 'drawMouseCoordinates();' 
// abajo del todo en la función 'draw()' y ponedle dos barras '//' delante para comentarla.
function drawMouseCoordinates() {
	canvasContext.fillStyle = "white";
	canvasContext.font = "14px Arial";
	canvasContext.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20);
}

// =========================================================================
// 🔄 EL MOTOR DE ANIMACIÓN DEL JUEGO (Game Loop)
// =========================================================================
// Esta función se ejecuta sola unas 60 veces por segundo. Borra todo y vuelve 
// a dibujar la pantalla según la habitación en la que te encuentres.
function draw() {
	switch (currentRoom) {

		// 🏠 CASO 1: ESTAMOS EN EL MENÚ DE INICIO
		case ROOM.START:
			if (gameImages.start.complete) {
				// Dibujamos el fondo adaptado a la pantalla
				drawProportionalBackground(canvasContext, canvasElement, gameImages.start);

				// Buscamos los botones de JUGAR (posición 0) y OPCIONES (posición 1)
				const startZones = roomInteractions[ROOM.START];
				const isMouseOverPlay = isMouseInsideZone(mouseX, mouseY, startZones[0]);
				const isMouseOverOptions = isMouseInsideZone(mouseX, mouseY, startZones[1]);

				// Ajustes de texto generales para este menú
				canvasContext.textAlign = "center";
				canvasContext.textBaseline = "middle";
				canvasContext.font = "16px 'Times New Roman', serif";

				// Pintamos los dos botones usando la función del archivo helpers
				drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, startZones[0], isMouseOverPlay, "JUGAR");
				drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, startZones[1], isMouseOverOptions, "OPCIONES");

				// 🔳 RECUADRO DE OPCIONES (Si el menú de sonido está abierto)
				if (isOptionsOpen) {
					const modalWidth = INTERFACE_DIMENSIONS.OPTIONS_MODAL_WIDTH;
					const modalHeight = INTERFACE_DIMENSIONS.OPTIONS_MODAL_HEIGHT;
					const modalLeftX = canvasElement.width / 2 - modalWidth / 2;
					const modalTopY = canvasElement.height / 2 - modalHeight / 2;
					const modalBevelSize = 12;

					// Dibujamos las líneas del recuadro del menú de sonido
					canvasContext.beginPath();
					canvasContext.moveTo(modalLeftX + modalBevelSize, modalTopY);
					canvasContext.lineTo(modalLeftX + modalWidth - modalBevelSize, modalTopY);
					canvasContext.lineTo(modalLeftX + modalWidth, modalTopY + modalBevelSize);
					canvasContext.lineTo(modalLeftX + modalWidth, modalTopY + modalHeight - modalBevelSize);
					canvasContext.lineTo(modalLeftX + modalWidth - modalBevelSize, modalTopY + modalHeight);
					canvasContext.lineTo(modalLeftX + modalBevelSize, modalTopY + modalHeight);
					canvasContext.lineTo(modalLeftX, modalTopY + modalHeight - modalBevelSize);
					canvasContext.lineTo(modalLeftX, modalTopY + modalBevelSize);
					canvasContext.closePath();

					// Rellenamos el recuadro con su color translúcido
					canvasContext.fillStyle = INTERFACE_COLORS.OPTIONS_MODAL_OVERLAY;
					canvasContext.fill();
					canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT;
					canvasContext.lineWidth = 2;
					canvasContext.stroke();

					// Escribimos el título "SONIDO" arriba en el centro del cuadro
					canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER;
					canvasContext.font = "bold 18px 'Times New Roman', serif";
					canvasContext.fillText("SONIDO", canvasElement.width / 2, modalTopY + 30);

					// Buscamos las posiciones de los botones internos (MÚSICA = 0, VOLVER = 1)
					const modalZones = getModalInteractions(canvasElement);
					const isMouseOverAudio = isMouseInsideZone(mouseX, mouseY, modalZones[0]);
					const isMouseOverBack = isMouseInsideZone(mouseX, mouseY, modalZones[1]);

					// Cambiamos la fuente para las letras de dentro del menú y los dibujamos
					canvasContext.font = "14px 'Times New Roman', serif";
					const textoMusica = isMusicMuted ? "MÚSICA: OFF" : "MÚSICA: ON";
					drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, modalZones[0], isMouseOverAudio, textoMusica, 6);
					drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, modalZones[1], isMouseOverBack, "VOLVER", 6);
				}

				// Devolvemos los ajustes de texto a su estado por defecto para no romper las otras salas
				canvasContext.textAlign = "left";
				canvasContext.textBaseline = "alphabetic";
			} else {
				// Pantalla negra por si la foto del menú de inicio tarda unos milisegundos en cargar
				canvasContext.fillStyle = "#121212";
				canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
			}
			break;

		// 🚪 CASO 2: ESTAMOS EN LA HABITACIÓN UNO
		case ROOM.ONE:
			drawStandardRoomBackground(canvasContext, canvasElement, gameImages.one, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE);
			break;

		// 🗝️ CASO 3: ESTAMOS EN LA HABITACIÓN CUATRO
		case ROOM.FOUR:
			drawStandardRoomBackground(canvasContext, canvasElement, gameImages.four, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_FOUR);
			break;
	}

	// --- DIBUJAR LAS FLECHAS PARA MOVERSE ENTRE SALAS ---
	// Si estás en la Habitación 1, dibuja la flecha hacia arriba para avanzar (en Y: 360)
	if (currentRoom === ROOM.ONE) {
		drawNavigationArrow(canvasContext, canvasElement, INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, "UP", INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE);
	}
	// Si estás en la Habitación 4, dibuja la flecha hacia abajo en la base de la pantalla para volver
	if (currentRoom === ROOM.FOUR) {
		drawNavigationArrow(canvasContext, canvasElement, INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, "DOWN", canvasElement.height - 5);
	}

	// Ejecuta la herramienta que pinta la posición X e Y del ratón (Comentar para la versión final)
	drawMouseCoordinates();

	// Le pide al navegador que vuelva a ejecutar esta función 'draw' en el próximo fotograma
	requestAnimationFrame(draw);
}

// 🎬 ENMÁRCHATE: Llama a la función draw por primera vez para arrancar el bucle del juego
draw()
