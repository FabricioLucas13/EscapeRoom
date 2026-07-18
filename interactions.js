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
const gameEngineBridge = {
	changeRoomRef: null,          // Guarda la función para cambiar de habitación
	openExitKeypadRef: null,      // Guarda la función para abrir el teclado numérico
	getIsMusicMuted: () => false, // Mira si la música está silenciada en el menú principal
	toggleMusicCallback: null,    // Función para silenciar o activar la música
	closeOptionsModal: null,      // Función para cerrar el cuadro de opciones
	openOptionsModal: null,       // Función para abrir el cuadro de opciones
	getGameMusic: null,            // Accede al reproductor de música del juego

	// Enlaces nuevos para el teclado numérico:
	closeExitKeypadRef: null,     // Función para cerrar el teclado numérico
	keypadPressRef: null,         // Función para registrar un número pulsado
	keypadResetRef: null,         // Función para borrar (botón flecha)
	keypadCheckRef: null,          // Función para comprobar la contraseña (botón check)

	// Enlaces nuevos para el puzzle de las velas:
	openCandlesRef: null,         // Función para abrir el panel de las velas
	closeCandlesRef: null,        // Función para cerrar el panel de las velas
	toggleCandleRef: null,        // Función para encender/apagar una vela
	checkCandlesRef: null         // Función para comprobar el orden de las velas
}

// 🟢 CONECTAR LOS ARCHIVOS (Se ejecuta una sola vez al arrancar el juego)
export function initializeInteractions(engineActions) {
	gameEngineBridge.changeRoomRef = engineActions.changeRoom
	gameEngineBridge.openExitKeypadRef = engineActions.openExitKeypad
	gameEngineBridge.getIsMusicMuted = engineActions.getIsMusicMuted
	gameEngineBridge.toggleMusicCallback = engineActions.toggleMusic
	gameEngineBridge.closeOptionsModal = engineActions.closeOptionsModal
	gameEngineBridge.openOptionsModal = engineActions.openOptionsModal
	gameEngineBridge.getGameMusic = engineActions.getGameMusic

	// Conexión de las nuevas funciones del teclado:
	gameEngineBridge.closeExitKeypadRef = engineActions.closeExitKeypad
	gameEngineBridge.keypadPressRef = engineActions.keypadPress
	gameEngineBridge.keypadResetRef = engineActions.keypadReset
	gameEngineBridge.keypadCheckRef = engineActions.keypadCheck

	// Conexión de las nuevas funciones del puzzle de las velas:
	gameEngineBridge.openCandlesRef = engineActions.openCandles
	gameEngineBridge.closeCandlesRef = engineActions.closeCandles
	gameEngineBridge.toggleCandleRef = engineActions.toggleCandle
	gameEngineBridge.checkCandlesRef = engineActions.checkCandles
}

// 🎵 SILENCIAR O ACTIVAR LA MÚSICA
export function toggleMusic() {
	gameEngineBridge.toggleMusicCallback()
}

// 🔳 ZONAS DE CLIC PARA EL MENÚ DE OPCIONES (El cuadro de sonido)
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

// 🔢 ZONAS DE CLIC DINÁMICAS PARA EL TECLADO NUMÉRICO (Grid 3x4 + Cruz de cerrar)
export function getKeypadInteractions(canvasElement) {
	const padWidth = INTERFACE_DIMENSIONS.KEYPAD_WIDTH || 270
	const padHeight = INTERFACE_DIMENSIONS.KEYPAD_HEIGHT || 380
	const btnSize = INTERFACE_DIMENSIONS.KEYPAD_BTN_SIZE || 50
	const gap = INTERFACE_DIMENSIONS.KEYPAD_GAP || 10

	const panelX = canvasElement.width / 2 - padWidth / 2
	const panelY = canvasElement.height / 2 - padHeight / 2

	const startGridX = panelX + (padWidth - (btnSize * 3 + gap * 2)) / 2
	const startGridY = panelY + 130

	const layout = [
		{ label: "1", action: () => gameEngineBridge.keypadPressRef("1") },
		{ label: "2", action: () => gameEngineBridge.keypadPressRef("2") },
		{ label: "3", action: () => gameEngineBridge.keypadPressRef("3") },
		{ label: "4", action: () => gameEngineBridge.keypadPressRef("4") },
		{ label: "5", action: () => gameEngineBridge.keypadPressRef("5") },
		{ label: "6", action: () => gameEngineBridge.keypadPressRef("6") },
		{ label: "7", action: () => gameEngineBridge.keypadPressRef("7") },
		{ label: "8", action: () => gameEngineBridge.keypadPressRef("8") },
		{ label: "9", action: () => gameEngineBridge.keypadPressRef("9") },
		{ label: "←", action: () => gameEngineBridge.keypadResetRef() },
		{ label: "0", action: () => gameEngineBridge.keypadPressRef("0") },
		{ label: "✓", action: () => gameEngineBridge.keypadCheckRef() }
	]

	const zones = []

	layout.forEach((btn, index) => {
		const col = index % 3
		const row = Math.floor(index / 3)

		zones.push({
			x: startGridX + col * (btnSize + gap),
			y: startGridY + row * (btnSize + gap),
			width: btnSize,
			height: btnSize,
			action: btn.action,
			label: btn.label
		})
	})

	zones.push({
		x: panelX + padWidth - 30,
		y: panelY + 10,
		width: 20,
		height: 20,
		action: () => gameEngineBridge.closeExitKeypadRef(),
		label: "✕"
	})

	return zones
}

// 🕯️ ZONAS DE CLIC PARA EL PANEL DE LAS VELAS (4 velas alineadas + Cruz + Ejecutar)
export function getCandleInteractions(canvasElement) {
	const padWidth = INTERFACE_DIMENSIONS.CANDLE_MODAL_WIDTH || 420
	const padHeight = INTERFACE_DIMENSIONS.CANDLE_MODAL_HEIGHT || 260
	const btnWidth = INTERFACE_DIMENSIONS.CANDLE_WIDTH || 70
	const btnHeight = INTERFACE_DIMENSIONS.CANDLE_HEIGHT || 90
	const gap = INTERFACE_DIMENSIONS.CANDLE_GAP || 10

	const panelX = canvasElement.width / 2 - padWidth / 2
	const panelY = canvasElement.height / 2 - padHeight / 2

	// Centramos la fila de las 4 velas horizontalmente
	const totalGridWidth = (btnWidth * 4) + (gap * 3)
	const startGridX = panelX + (padWidth - totalGridWidth) / 2
	const startGridY = panelY + 70

	const zones = []

	// Mapeamos los 4 botones de velas sin usar un bucle "for" rígido
	const candleLabels = ["1", "2", "3", "4"]
	candleLabels.forEach((label, index) => {
		zones.push({
			x: startGridX + index * (btnWidth + gap),
			y: startGridY,
			width: btnWidth,
			height: btnHeight,
			action: () => gameEngineBridge.toggleCandleRef(index + 1),
			label: `candle_${index + 1}`
		})
	})

	// Botón inferior para ejecutar/validar el orden
	const execBtnWidth = 120
	const execBtnHeight = 35
	zones.push({
		x: canvasElement.width / 2 - execBtnWidth / 2,
		y: panelY + padHeight - 55,
		width: execBtnWidth,
		height: execBtnHeight,
		action: () => gameEngineBridge.checkCandlesRef(),
		label: "⚙️ Ejecutar"
	})

	// Botón de aspa (✕) para cerrar el modal arriba a la derecha
	zones.push({
		x: panelX + padWidth - 30,
		y: panelY + 10,
		width: 20,
		height: 20,
		action: () => gameEngineBridge.closeCandlesRef(),
		label: "✕"
	})

	return zones
}

// 🗺️ MAPA DE CLICS DE TODO EL JUEGO (Zonas interactivas de cada habitación)
export function getRoomInteractions(canvasElement) {
	return {
		[ROOM.START]: [
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 - 35,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH,
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => {
					gameEngineBridge.changeRoomRef(ROOM.ONE)
					if (!gameEngineBridge.getIsMusicMuted()) {
						gameEngineBridge.getGameMusic().play().catch(() => { })
					}
				}
			},
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 + 25,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH,
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => gameEngineBridge.openOptionsModal()
			}
		],
		[ROOM.ONE]: [
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE,
				y: INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE,
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2,
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + 10,
				action: () => gameEngineBridge.changeRoomRef(ROOM.FOUR)
			},
			{
				x: 200,
				y: 220,
				width: 80,
				height: 70,
				// 🚀 CONECTADO: Al pinchar en las velas se llama al puente real del motor
				action: () => gameEngineBridge.openCandlesRef()
			}
		],
		[ROOM.FOUR]: [
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE,
				y: canvasElement.height - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE - 10,
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2,
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + 10,
				action: () => gameEngineBridge.changeRoomRef(ROOM.ONE)
			},
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
