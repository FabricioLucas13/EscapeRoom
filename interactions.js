import { INTERFACE_DIMENSIONS, ROOM } from "./config.js"

// =========================================================================
// 🚀 ¿CÓMO AÑADIR NUEVOS BOTONES O INTERACCIONES? (Guía rápida para el equipo)
// =========================================================================
const gameEngineBridge = {
	changeRoom: null,
	openExitKeypad: null,
	getIsMusicMuted: () => false,
	toggleMusic: null,
	closeOptionsModal: null,
	openOptionsModal: null,
	getGameMusic: null,

	// Teclado numérico
	closeExitKeypad: null,
	keypadPress: null,
	keypadReset: null,
	keypadCheck: null,

	// Puzzle de las velas
	openCandles: null,
	closeCandles: null,
	toggleCandle: null,
	checkCandles: null,

	// Puzzle de Colores
	openColorPuzzle: null,
	closeColorPuzzle: null,
	addColorToSequence: null,
	checkColorSequence: null,

	// Cofre de runas
	openRuneChest: null,

	// Pasarela de datos para la vista del pergamino desenrollado
	openScroll: null,
	closeScroll: null,
	nextScrollPage: null,
	previousScrollPage: null
}

export function initializeInteractions(engineActions) {
	gameEngineBridge.changeRoom = engineActions.changeRoom
	gameEngineBridge.openExitKeypad = engineActions.openExitKeypad
	gameEngineBridge.getIsMusicMuted = engineActions.getIsMusicMuted
	gameEngineBridge.toggleMusic = engineActions.toggleMusic
	gameEngineBridge.closeOptionsModal = engineActions.closeOptionsModal
	gameEngineBridge.openOptionsModal = engineActions.openOptionsModal
	gameEngineBridge.getGameMusic = engineActions.getGameMusic

	gameEngineBridge.closeExitKeypad = engineActions.closeExitKeypad
	gameEngineBridge.keypadPress = engineActions.keypadPress
	gameEngineBridge.keypadReset = engineActions.keypadReset
	gameEngineBridge.keypadCheck = engineActions.keypadCheck

	gameEngineBridge.openCandles = engineActions.openCandles
	gameEngineBridge.closeCandles = engineActions.closeCandles
	gameEngineBridge.toggleCandle = engineActions.toggleCandle
	gameEngineBridge.checkCandles = engineActions.checkCandles

	gameEngineBridge.openColorPuzzle = engineActions.openColorPuzzle
	gameEngineBridge.closeColorPuzzle = engineActions.closeColorPuzzle
	gameEngineBridge.addColorToSequence = engineActions.addColorToSequence
	gameEngineBridge.checkColorSequence = engineActions.checkColorSequence
	gameEngineBridge.openRuneChest = engineActions.openRuneChest

	// Conectamos los cables del pergamino
	gameEngineBridge.openScroll = engineActions.openScroll
	gameEngineBridge.closeScroll = engineActions.closeScroll
	gameEngineBridge.nextScrollPage = engineActions.nextScrollPage
	gameEngineBridge.previousScrollPage = engineActions.previousScrollPage
}

export function toggleMusic() {
	gameEngineBridge.toggleMusic()
}

export function getModalInteractions(canvasElement) {
	const modalTopY = canvasElement.height / 2 - INTERFACE_DIMENSIONS.OPTIONS_MODAL_HEIGHT / 2
	const modalButtonLeftX = canvasElement.width / 2 - INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH / 2

	return [
		{
			x: modalButtonLeftX,
			y: modalTopY + INTERFACE_DIMENSIONS.OPTIONS_AUDIO_BUTTON_Y_OFFSET,
			width: INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH,
			height: INTERFACE_DIMENSIONS.MODAL_BUTTON_HEIGHT,
			action: toggleMusic
		},
		{
			x: modalButtonLeftX,
			y: modalTopY + INTERFACE_DIMENSIONS.OPTIONS_BACK_BUTTON_Y_OFFSET,
			width: INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH,
			height: INTERFACE_DIMENSIONS.MODAL_BUTTON_HEIGHT,
			action: () => gameEngineBridge.closeOptionsModal()
		}
	]
}

export function getKeypadInteractions(canvasElement) {
	const keypadWidth = INTERFACE_DIMENSIONS.KEYPAD_WIDTH || 270
	const keypadHeight = INTERFACE_DIMENSIONS.KEYPAD_HEIGHT || 380
	const buttonSize = INTERFACE_DIMENSIONS.KEYPAD_BUTTON_SIZE || 50
	const gap = INTERFACE_DIMENSIONS.KEYPAD_GAP || 10

	const panelX = canvasElement.width / 2 - keypadWidth / 2
	const panelY = canvasElement.height / 2 - keypadHeight / 2

	const startGridX = panelX + (keypadWidth - (buttonSize * 3 + gap * 2)) / 2
	const startGridY = panelY + INTERFACE_DIMENSIONS.KEYPAD_GRID_START_Y_OFFSET

	const layout = [
		{ label: "1", action: () => gameEngineBridge.keypadPress("1") },
		{ label: "2", action: () => gameEngineBridge.keypadPress("2") },
		{ label: "3", action: () => gameEngineBridge.keypadPress("3") },
		{ label: "4", action: () => gameEngineBridge.keypadPress("4") },
		{ label: "5", action: () => gameEngineBridge.keypadPress("5") },
		{ label: "6", action: () => gameEngineBridge.keypadPress("6") },
		{ label: "7", action: () => gameEngineBridge.keypadPress("7") },
		{ label: "8", action: () => gameEngineBridge.keypadPress("8") },
		{ label: "9", action: () => gameEngineBridge.keypadPress("9") },
		{ label: "←", action: () => gameEngineBridge.closeExitKeypad() },
		{ label: "0", action: () => gameEngineBridge.keypadPress("0") },
		{ label: "✓", action: () => gameEngineBridge.keypadCheck() }
	]

	const interactiveButtons = []

	layout.forEach((button, index) => {
		const column = index % 3
		const row = Math.floor(index / 3)

		interactiveButtons.push({
			x: startGridX + column * (buttonSize + gap),
			y: startGridY + row * (buttonSize + gap),
			width: buttonSize,
			height: buttonSize,
			action: button.action,
			label: button.label
		})
	})

	return interactiveButtons
}

export function getCandleInteractions(canvasElement) {
	const candlePanelWidth = INTERFACE_DIMENSIONS.CANDLE_MODAL_WIDTH || 420
	const candlePanelHeight = INTERFACE_DIMENSIONS.CANDLE_MODAL_HEIGHT || 260
	const candleWidth = INTERFACE_DIMENSIONS.CANDLE_WIDTH || 70
	const candleHeight = INTERFACE_DIMENSIONS.CANDLE_HEIGHT || 90
	const gap = INTERFACE_DIMENSIONS.CANDLE_GAP || 10

	const panelX = canvasElement.width / 2 - candlePanelWidth / 2
	const panelY = canvasElement.height / 2 - candlePanelHeight / 2

	const totalGridWidth = (candleWidth * 4) + (gap * 3)
	const startGridX = panelX + (candlePanelWidth - totalGridWidth) / 2
	const startGridY = panelY + INTERFACE_DIMENSIONS.CANDLE_GRID_START_Y_OFFSET

	const interactiveCandles = []

	const candleLabels = ["1", "2", "3", "4"]
	candleLabels.forEach((label, index) => {
		interactiveCandles.push({
			x: startGridX + index * (candleWidth + gap),
			y: startGridY,
			width: candleWidth,
			height: candleHeight,
			action: () => gameEngineBridge.toggleCandle(index + 1),
			label: `candle_${index + 1}`
		})
	})

	interactiveCandles.push({
		x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.CANDLE_ACTION_BUTTON_WIDTH / 2,
		y: panelY + candlePanelHeight - INTERFACE_DIMENSIONS.CANDLE_ACTION_BUTTON_BOTTOM_OFFSET,
		width: INTERFACE_DIMENSIONS.CANDLE_ACTION_BUTTON_WIDTH,
		height: 35,
		action: () => gameEngineBridge.checkCandles(),
		label: "Activar"
	})

	interactiveCandles.push({
		x: 0,
		y: 0,
		width: canvasElement.width,
		height: canvasElement.height,
		action: () => gameEngineBridge.closeCandles(),
		label: "BACKGROUND_CLOSE_ZONE"
	})

	return interactiveCandles
}

export function getColorPuzzleInteractions(canvasElement) {
	const modalWidth = INTERFACE_DIMENSIONS.CANDLE_MODAL_WIDTH || 420
	const modalHeight = INTERFACE_DIMENSIONS.CANDLE_MODAL_HEIGHT || 260
	const slotWidth = INTERFACE_DIMENSIONS.CANDLE_WIDTH || 70
	const slotHeight = INTERFACE_DIMENSIONS.CANDLE_HEIGHT || 90
	const gap = INTERFACE_DIMENSIONS.CANDLE_GAP || 10

	const panelX = canvasElement.width / 2 - modalWidth / 2
	const panelY = canvasElement.height / 2 - modalHeight / 2

	const totalGridWidth = (slotWidth * 4) + (gap * 3)
	const startGridX = panelX + (modalWidth - totalGridWidth) / 2
	const startGridY = panelY + INTERFACE_DIMENSIONS.CANDLE_GRID_START_Y_OFFSET

	const interactiveButtons = []

	const colorsList = ["morado", "azul", "amarillo", "verde"]
	colorsList.forEach((colorName, index) => {
		interactiveButtons.push({
			x: startGridX + index * (slotWidth + gap),
			y: startGridY,
			width: slotWidth,
			height: slotHeight,
			action: () => gameEngineBridge.addColorToSequence(colorName),
			label: `color_${colorName}`
		})
	})

	interactiveButtons.push({
		x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.CANDLE_ACTION_BUTTON_WIDTH / 2,
		y: panelY + modalHeight - INTERFACE_DIMENSIONS.CANDLE_ACTION_BUTTON_BOTTOM_OFFSET,
		width: INTERFACE_DIMENSIONS.CANDLE_ACTION_BUTTON_WIDTH,
		height: 35,
		action: () => gameEngineBridge.checkColorSequence(),
		label: "Activar"
	})

	interactiveButtons.push({
		x: 0,
		y: 0,
		width: canvasElement.width,
		height: canvasElement.height,
		action: () => gameEngineBridge.closeColorPuzzle(),
		label: "BACKGROUND_CLOSE_ZONE"
	})

	return interactiveButtons
}

// Zona invisible para cerrar el pergamino blanco al hacer clic fuera
export function getScrollInteractions(canvasElement) {
	const scrollWidth = INTERFACE_DIMENSIONS.SCROLL_MODAL_WIDTH
	const scrollHeight = INTERFACE_DIMENSIONS.SCROLL_MODAL_HEIGHT
	const scrollLeftX = canvasElement.width / 2 - scrollWidth / 2
	const scrollTopY = canvasElement.height / 2 - scrollHeight / 2
	const sideButtonWidth = INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_WIDTH
	const sideButtonHeight = INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_HEIGHT
	const sideButtonY = scrollTopY + scrollHeight / 2 - sideButtonHeight / 2

	return [
		{
			x: scrollLeftX - sideButtonWidth - INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_GAP_X,
			y: sideButtonY,
			width: sideButtonWidth,
			height: sideButtonHeight,
			action: () => gameEngineBridge.previousScrollPage(),
			label: "SCROLL_PREV_PAGE"
		},
		{
			x: scrollLeftX + scrollWidth + INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_GAP_X,
			y: sideButtonY,
			width: sideButtonWidth,
			height: sideButtonHeight,
			action: () => gameEngineBridge.nextScrollPage(),
			label: "SCROLL_NEXT_PAGE"
		},
		{
			x: 0,
			y: 0,
			width: canvasElement.width,
			height: scrollTopY,
			action: () => gameEngineBridge.closeScroll(),
			label: "BACKGROUND_CLOSE_TOP"
		},
		{
			x: 0,
			y: scrollTopY + scrollHeight,
			width: canvasElement.width,
			height: canvasElement.height - (scrollTopY + scrollHeight),
			action: () => gameEngineBridge.closeScroll(),
			label: "BACKGROUND_CLOSE_BOTTOM"
		},
		{
			x: 0,
			y: scrollTopY,
			width: scrollLeftX,
			height: scrollHeight,
			action: () => gameEngineBridge.closeScroll(),
			label: "BACKGROUND_CLOSE_LEFT"
		},
		{
			x: scrollLeftX + scrollWidth,
			y: scrollTopY,
			width: canvasElement.width - (scrollLeftX + scrollWidth),
			height: scrollHeight,
			action: () => gameEngineBridge.closeScroll(),
			label: "BACKGROUND_CLOSE_RIGHT"
		}
	]
}

export function getRoomInteractions(canvasElement) {
	return {
		[ROOM.START]: [
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 - 35,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH,
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => {
					gameEngineBridge.changeRoom(ROOM.MAIN)
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
		[ROOM.MAIN]: [
			{
				x: INTERFACE_DIMENSIONS.ARROW_X_ROOM_ONE - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE,
				y: INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE,
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2,
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + INTERFACE_DIMENSIONS.NAVIGATION_ARROW_HITBOX_EXTRA_HEIGHT,
				action: () => gameEngineBridge.changeRoom(ROOM.EXIT_GATE)
			},
			{
				x: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_X,
				y: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_Y,
				width: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_ONE_CANDLES_HEIGHT,
				action: () => gameEngineBridge.openCandles()
			},
			{
				x: INTERFACE_DIMENSIONS.ROOM_ONE_COLORS_X,
				y: INTERFACE_DIMENSIONS.ROOM_ONE_COLORS_Y,
				width: INTERFACE_DIMENSIONS.ROOM_ONE_COLORS_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_ONE_COLORS_HEIGHT,
				action: () => gameEngineBridge.openColorPuzzle()
			},
			{
				x: INTERFACE_DIMENSIONS.ROOM_ONE_RUNES_X,
				y: INTERFACE_DIMENSIONS.ROOM_ONE_RUNES_Y,
				width: INTERFACE_DIMENSIONS.ROOM_ONE_RUNES_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_ONE_RUNES_HEIGHT,
				action: () => gameEngineBridge.openRuneChest()
			},
			{
				// 🛠️ CONFIGURADO: Ahora abre oficialmente la vista del pergamino
				x: INTERFACE_DIMENSIONS.ROOM_ONE_SCROLL_X,
				y: INTERFACE_DIMENSIONS.ROOM_ONE_SCROLL_Y,
				width: INTERFACE_DIMENSIONS.ROOM_ONE_SCROLL_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_ONE_SCROLL_HEIGHT,
				action: () => gameEngineBridge.openScroll()
			}
		],
		[ROOM.EXIT_GATE]: [
			{
				x: INTERFACE_DIMENSIONS.ROOM_FOUR_COLORS_X,
				y: INTERFACE_DIMENSIONS.ROOM_FOUR_COLORS_Y,
				width: INTERFACE_DIMENSIONS.ROOM_FOUR_COLORS_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_FOUR_COLORS_HEIGHT,
				action: () => gameEngineBridge.openColorPuzzle()
			},
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE,
				y: canvasElement.height - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE - 10,
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2,
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + INTERFACE_DIMENSIONS.NAVIGATION_ARROW_HITBOX_EXTRA_HEIGHT,
				action: () => gameEngineBridge.changeRoom(ROOM.MAIN)
			},
			{
				x: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_X,
				y: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_Y,
				width: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_WIDTH,
				height: INTERFACE_DIMENSIONS.ROOM_FOUR_KEYPAD_HEIGHT,
				action: () => gameEngineBridge.openExitKeypad()
			}
		]
	}
}





