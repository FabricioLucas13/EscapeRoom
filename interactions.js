import { INTERFACE_DIMENSIONS, ROOM } from "./config.js"

// =========================================================================
// 🚀 ¿CÓMO AÑADIR NUEVOS BOTONES O INTERACCIONES? (Guía rápida para el equipo)
// =========================================================================
//
// ➡️ SI QUIERES PONER ZONAS DE CLIC EN UNA HABITACIÓN NUEVA:
//    - Añade una lista nueva abajo del todo dentro de "getRoomInteractions".
//    - Ejemplo para la Habitación Dos: 
//      [ROOM.TWO]: [ { x: 100, y: 150, width: 50, height: 50, action: () => { ... } } ]
//
// ➡️ SI QUIERES HACER ALGO COMPLEJO (como guardar datos o cambiar un estado de main.js):
//    - Primero escribe la función en "main.js" y pásala dentro de "initializeInteractions".
//    - Añade su nombre en la lista "gameEngineBridge" de aquí abajo y úsala en tu botón.
//
// =========================================================================

// 🔗 ENLACES HACIA EL ARCHIVO PRINCIPAL (main.js)
// Esta lista guarda las funciones de "main.js" para que podamos usarlas desde este archivo.
const gameEngineBridge = {
	changeRoomRef: null,          // Guarda la función para cambiar de habitación
	openExitKeypadRef: null,      // Guarda la función para abrir el teclado numérico
	getIsMusicMuted: () => false, // Mira si la música está silenciada en el menú principal
	toggleMusicCallback: null,    // Función para silenciar o activar la música
	closeOptionsModal: null,      // Función para cerrar el cuadro de opciones
	openOptionsModal: null,       // Función para abrir el cuadro de opciones
	getGameMusic: null            // Accede al reproductor de música del juego
}

// 🟢 CONECTAR LOS ARCHIVOS (Se ejecuta una sola vez al arrancar el juego)
// Toma las funciones reales de "main.js" y las mete en nuestra lista de enlaces de arriba.
export function initializeInteractions(engineActions) {
	gameEngineBridge.changeRoomRef = engineActions.changeRoom
	gameEngineBridge.openExitKeypadRef = engineActions.openExitKeypad
	gameEngineBridge.getIsMusicMuted = engineActions.getIsMusicMuted
	gameEngineBridge.toggleMusicCallback = engineActions.toggleMusic
	gameEngineBridge.closeOptionsModal = engineActions.closeOptionsModal
	gameEngineBridge.openOptionsModal = engineActions.openOptionsModal
	gameEngineBridge.getGameMusic = engineActions.getGameMusic
}

// 🎵 SILENCIAR O ACTIVAR LA MÚSICA
// Llama a la función de sonido que está guardada en nuestro enlace.
export function toggleMusic() {
	gameEngineBridge.toggleMusicCallback()
}

// 🔳 ZONAS DE CLIC PARA EL MENÚ DE OPCIONES (El cuadro de sonido)
// Devuelve las posiciones X e Y de los botones de dentro del menú de sonido (MÚSICA y VOLVER).
export function getModalInteractions(canvasElement) {
	const modalTopY = canvasElement.height / 2 - INTERFACE_DIMENSIONS.OPTIONS_MODAL_HEIGHT / 2
	const modalButtonLeftX = canvasElement.width / 2 - INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH / 2

	return [
		{ 
			x: modalButtonLeftX, 
			y: modalTopY + 70, 
			width: INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH, 
			height: INTERFACE_DIMENSIONS.MODAL_BUTTON_HEIGHT, 
			action: toggleMusic 
		},
		{ 
			x: modalButtonLeftX, 
			y: modalTopY + 140, 
			width: INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH, 
			height: INTERFACE_DIMENSIONS.MODAL_BUTTON_HEIGHT, 
			action: () => gameEngineBridge.closeOptionsModal() 
		}
	]
}

// 🗺️ MAPA DE CLICS DE TODO EL JUEGO (Zonas interactivas)
// Aquí guardamos los rectángulos invisibles de cada sala y lo que pasa cuando haces clic en ellos.
export function getRoomInteractions(canvasElement) {
	return {
		[ROOM.START]: [
			// Botón de la posición: Iniciar la partida (JUGAR)
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 - 35,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH, 
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => { 
					gameEngineBridge.changeRoomRef(ROOM.ONE) 
					if (!gameEngineBridge.getIsMusicMuted()) {
						gameEngineBridge.getGameMusic().play().catch(() => {})
					}
				}
			},
			// Botón de la posición: Abrir configuración (OPCIONES)
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 + 25,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH, 
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => gameEngineBridge.openOptionsModal()
			}
		],
		[ROOM.ONE]: [
			// Botón de la posición: Flecha blanca para ir a la Habitación Cuatro
			{ 
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, 
				y: INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE, 
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2, 
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + 10, 
				action: () => gameEngineBridge.changeRoomRef(ROOM.FOUR) 
			}
		],
		[ROOM.FOUR]: [
			// Botón de la posición: Flecha blanca para volver a la Habitación Uno
			{ 
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, 
				y: canvasElement.height - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE - 10, 
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2, 
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + 10, 
				action: () => gameEngineBridge.changeRoomRef(ROOM.ONE) 
			},
			// Botón de la posición: El teclado numérico de la pared para escapar
			{ 
				x: 490, 
				y: 235, 
				width: 140, 
				height: 185, 
				action: () => gameEngineBridge.openExitKeypadRef() 
			}
		]
	}
}
