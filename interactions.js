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

// 🔗 ENLACES HACIA EL ARCHIVO PRINCIPAL (Pasarela de funciones hacia main.js)
const gameEngineBridge = {
	changeRoomRef: null,          // Cambia la habitación actual
	openExitKeypadRef: null,      // Abre el panel del teclado numérico
	getIsMusicMuted: () => false, // Consulta si el audio del juego está silenciado
	toggleMusicCallback: null,    // Invierte el estado del silenciador de música
	closeOptionsModal: null,      // Cierra la ventana flotante de opciones
	openOptionsModal: null,       // Abre la ventana flotante de opciones
	getGameMusic: null,           // Entrega acceso directo al reproductor de sonido

	// Canales de control para el teclado numérico (Habitación 4)
	closeExitKeypadRef: null,     // Cierra el teclado numérico
	keypadPressRef: null,         // Añade un número a la pantalla del teclado
	keypadResetRef: null,         // Borra los números de la pantalla
	keypadCheckRef: null,         // Valida el código secreto de escape

	// Canales de control para el puzzle de las velas (Habitación 1)
	openCandlesRef: null,         // Abre el escenario de las velas
	closeCandlesRef: null,        // Cierra el escenario de las velas y regresa a la sala
	toggleCandleRef: null,        // Cambia el estado (encendido/apagado) de una vela
	checkCandlesRef: null         // Valida el orden secuencial de encendido
}

// 🟢 CONECTAR LOS ARCHIVOS (Asigna los cables de control al iniciar el motor)
export function initializeInteractions(engineActions) {
	gameEngineBridge.changeRoomRef = engineActions.changeRoom
	gameEngineBridge.openExitKeypadRef = engineActions.openExitKeypad
	gameEngineBridge.getIsMusicMuted = engineActions.getIsMusicMuted
	gameEngineBridge.toggleMusicCallback = engineActions.toggleMusic
	gameEngineBridge.closeOptionsModal = engineActions.closeOptionsModal
	gameEngineBridge.openOptionsModal = engineActions.openOptionsModal
	gameEngineBridge.getGameMusic = engineActions.getGameMusic

	// Enlaces del teclado numérico
	gameEngineBridge.closeExitKeypadRef = engineActions.closeExitKeypad
	gameEngineBridge.keypadPressRef = engineActions.keypadPress
	gameEngineBridge.keypadResetRef = engineActions.keypadReset
	gameEngineBridge.keypadCheckRef = engineActions.keypadCheck

	// Enlaces del puzzle de las velas
	gameEngineBridge.openCandlesRef = engineActions.openCandles
	gameEngineBridge.closeCandlesRef = engineActions.closeCandles
	gameEngineBridge.toggleCandleRef = engineActions.toggleCandle
	gameEngineBridge.checkCandlesRef = engineActions.checkCandles
}

// 🎵 DISPARADOR DE AUDIO (Silencia o activa la pista)
export function toggleMusic() {
	gameEngineBridge.toggleMusicCallback()
}

// 🔳 ZONAS DE CLIC PARA EL MENÚ DE OPCIONES (Ajustes de Sonido)
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

// 🔢 ZONAS DE CLIC DINÁMICAS PARA EL TECLADO NUMÉRICO (Rejilla de botones)
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

// 🕯️ ZONAS DE CLIC PARA EL PANEL DE LAS VELAS (Fila horizontal de botones)
export function getCandleInteractions(canvasElement) {
	const padWidth = INTERFACE_DIMENSIONS.CANDLE_MODAL_WIDTH || 420
	const padHeight = INTERFACE_DIMENSIONS.CANDLE_MODAL_HEIGHT || 260
	const btnWidth = INTERFACE_DIMENSIONS.CANDLE_WIDTH || 70
	const btnHeight = INTERFACE_DIMENSIONS.CANDLE_HEIGHT || 90
	const gap = INTERFACE_DIMENSIONS.CANDLE_GAP || 10

	const panelX = canvasElement.width / 2 - padWidth / 2
	const panelY = canvasElement.height / 2 - padHeight / 2

	const totalGridWidth = (btnWidth * 4) + (gap * 3)
	const startGridX = panelX + (padWidth - totalGridWidth) / 2
	const startGridY = panelY + 70

	const zones = []

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

	zones.push({
		x: canvasElement.width / 2 - 120 / 2,
		y: panelY + padHeight - 55,
		width: 120,
		height: 35,
		action: () => gameEngineBridge.checkCandlesRef(),
		label: "⚙️ Ejecutar"
	})

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

// 🗺️ MAPA DE CLICS DE TODO EL JUEGO (Zonas fijas en escenarios estáticos)
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
				// 🧹 OPTIMIZADO: Coordenadas centralizadas leídas de config.js
				x: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_X,
				y: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_Y,
				width: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_HEIGHT,
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
				// 🧹 OPTIMIZADO: Coordenadas centralizadas leídas de config.js
				x: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_X,
				y: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_Y,
				width: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_HEIGHT,
				action: () => gameEngineBridge.openExitKeypadRef()
			}
		]
	}
}
