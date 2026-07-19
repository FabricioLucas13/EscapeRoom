/**
 * 📦 TRAER LAS PIEZAS DE LOS OTROS ARCHIVOS (Imports)
 */
import { ROOM, INTERFACE_COLORS, INTERFACE_DIMENSIONS, GAME_SETTINGS, GAME_RUNTIME, GAME_ASSET_SOURCES } from "./config.js"
import { isMouseInsideZone, drawBeveledButton, drawProportionalBackground, drawStandardRoomBackground, drawNavigationArrow } from "./helpers.js"
import { initializeInteractions, getModalInteractions, getRoomInteractions, getKeypadInteractions, getCandleInteractions, getColorPuzzleInteractions, getScrollInteractions } from "./interactions.js"
import { drawKeypadPuzzle } from "./keypadPuzzle.js"
import { drawCandlePuzzle } from "./candlesPuzzle.js"
import { drawColorPuzzle } from "./colorsPuzzle.js"
import { drawScrollText } from "./scrollText.js"
import { drawDialogBox } from "./dialogBox.js"
import { playMusic, toggleMusic, getIsMuted } from "./audioEngine.js"
import { gameState } from "./stateManager.js"
import { runesState, handleRunesMousedown, handleRunesMouseup, handleRunesClick, drawRunesPuzzle } from "./runePuzzle.js"

// --- CONFIGURAR EL CANVAS (El lienzo de dibujo) ---
const canvasElement = document.getElementById("game-screen")
const canvasContext = canvasElement.getContext("2d")

// --- LAS CAJAS DE DATOS DEL JUEGO (Variables de Estado del Motor) ---
let mouseX = 0
let mouseY = 0
let currentRoom = ROOM.START
let isOptionsOpen = false
let timerStartedAt = null
let timerActive = false
let lastTouchTimestamp = 0
const SHOW_MOUSE_COORDINATES = GAME_RUNTIME.SHOW_MOUSE_COORDINATES

const replayButton = {
	width: GAME_RUNTIME.REPLAY_BUTTON.WIDTH,
	height: GAME_RUNTIME.REPLAY_BUTTON.HEIGHT
}

function getReplayButtonZone() {
	return {
		x: canvasElement.width / 2 - replayButton.width / 2,
		y: canvasElement.height - GAME_RUNTIME.REPLAY_BUTTON.BOTTOM_OFFSET_Y,
		width: replayButton.width,
		height: replayButton.height
	}
}

function isReplayButtonVisibleOnWin() {
	return gameState.gameWon && gameState.winTriggeredAt !== null && (Date.now() - gameState.winTriggeredAt) >= 2000
}

function isReplayButtonVisibleOnLoss() {
	return lossSequenceState.triggered && lossSequenceState.phase === "death"
}

function resetToStartMenu() {
	gameState.resetForNewGame()
	lossSequenceState.triggered = false
	lossSequenceState.phase = "idle"
	lossSequenceState.startedAt = null
	timerStartedAt = null
	timerActive = false
	isOptionsOpen = false
	currentRoom = ROOM.START
}

function drawReplayButton() {
	const buttonZone = getReplayButtonZone()
	const isHovered = isMouseInsideZone(mouseX, mouseY, buttonZone)
	canvasContext.font = "16px 'Times New Roman', serif"
	drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, buttonZone, isHovered, "VOLVER A JUGAR")
}

function getCanvasPointFromMouseEvent(event) {
	const boundaries = canvasElement.getBoundingClientRect()
	const scaleX = canvasElement.width / boundaries.width
	const scaleY = canvasElement.height / boundaries.height
	return {
		x: (event.clientX - boundaries.left) * scaleX,
		y: (event.clientY - boundaries.top) * scaleY
	}
}

function getCanvasPointFromTouchEvent(event) {
	const touch = event.changedTouches && event.changedTouches[0]
	if (!touch) {
		return null
	}

	const boundaries = canvasElement.getBoundingClientRect()
	const scaleX = canvasElement.width / boundaries.width
	const scaleY = canvasElement.height / boundaries.height
	return {
		x: (touch.clientX - boundaries.left) * scaleX,
		y: (touch.clientY - boundaries.top) * scaleY
	}
}

function processPressStart(clickX, clickY) {
	if (gameState.introVisible) {
		return
	}

	if (runesState.isOpen) {
		handleRunesMousedown(clickX, clickY, canvasElement.width, canvasElement.height)
	}
}

function processPressEnd(clickX, clickY) {
	if (gameState.introVisible) {
		return
	}

	if (runesState.isOpen) {
		handleRunesMouseup(clickX, clickY, canvasElement.width, canvasElement.height)
	}
}

function processPrimaryAction(clickX, clickY) {
	if (isReplayButtonVisibleOnWin() || isReplayButtonVisibleOnLoss()) {
		if (isMouseInsideZone(clickX, clickY, getReplayButtonZone())) {
			resetToStartMenu()
		}
		return
	}

	if (gameState.introVisible) {
		return
	}

	// PRIORIDAD JERÁRQUICA: Teclado > Velas > Colores > Manuscrito > Runas > Opciones > Habitación normal
	if (runesState.isOpen) {
		handleRunesClick(clickX, clickY, canvasElement.width, canvasElement.height)
		return
	}

	if (gameState.isRuneChestOpen && !runesState.isOpen) {
		return
	}

	let activeButtons = []
	if (gameState.isKeypadOpen) {
		activeButtons = getKeypadInteractions(canvasElement)
	} else if (gameState.isCandleOpen) {
		activeButtons = getCandleInteractions(canvasElement)
	} else if (gameState.isColorPuzzleOpen) {
		activeButtons = getColorPuzzleInteractions(canvasElement)
	} else if (gameState.isScrollOpen) {
		activeButtons = getScrollInteractions(canvasElement)
	} else if (currentRoom === ROOM.START && isOptionsOpen) {
		activeButtons = getModalInteractions(canvasElement)
	} else {
		activeButtons = roomInteractions[currentRoom]
	}

	if (activeButtons) {
		for (let i = 0; i < activeButtons.length; i++) {
			const button = activeButtons[i]
			if (isMouseInsideZone(clickX, clickY, button)) {
				button.action()
				break
			}
		}
	}
}

function changeToRoom(targetRoom) {
	currentRoom = targetRoom
	if (targetRoom === ROOM.MAIN) {
		gameState.startIntroSequence()
		queueGameplayAssetPreload()
		if (!timerActive) {
			timerActive = true
			timerStartedAt = Date.now()
		}
	}
}
let lossSequenceState = {
	triggered: false,
	phase: "idle",
	startedAt: null
}

// --- CONECTAR NUESTRAS VARIABLES CON EL ARCHIVO DE CLICS ---
initializeInteractions({
	changeRoom: (targetRoom) => {
		changeToRoom(targetRoom)
	},
	openExitKeypad: () => { gameState.openKeypad(isOptionsOpen) },
	getIsMusicMuted: () => getIsMuted(),
	getGameMusic: () => ({ play: () => Promise.resolve(playMusic()) }),
	openOptionsModal: () => { if (!isOptionsOpen && !gameState.isKeypadOpen && !gameState.isCandleOpen && !gameState.isColorPuzzleOpen && !gameState.isScrollOpen) isOptionsOpen = true },
	closeOptionsModal: () => { isOptionsOpen = false },
	toggleMusic: () => { toggleMusic() },

	// FUNCIONES DEL TECLADO CONECTADAS
	closeExitKeypad: () => { gameState.closeKeypad() },
	keypadPress: (keypadNumber) => { gameState.pressKey(keypadNumber) },
	keypadReset: () => { gameState.resetKeypad() },
	keypadCheck: () => { gameState.checkKeypad() },

	// CABLES DEL PUZZLE DE LAS VELAS CONECTADOS AL GESTOR DE ESTADO
	openCandles: () => { gameState.openCandles(isOptionsOpen) },
	closeCandles: () => { gameState.closeCandles() },
	toggleCandle: (candleId) => { gameState.toggleCandleState(candleId) },
	checkCandles: () => { gameState.checkCandles() },

	// CABLES DEL PUZZLE DE COLORES CONECTADOS AL GESTOR DE ESTADO
	openColorPuzzle: () => { gameState.openColorPuzzle(isOptionsOpen) },
	closeColorPuzzle: () => { gameState.closeColorPuzzle() },
	addColorToSequence: (colorName) => { gameState.addColorToSequence(colorName) },
	checkColorSequence: () => { gameState.checkColorSequence() },

	// CABLES DE LA VISTA DEL PERGAMINO CONECTADOS AL GESTOR DE ESTADO
	openScroll: () => { gameState.openScroll(isOptionsOpen) },
	closeScroll: () => { gameState.closeScroll() },
	nextScrollPage: () => { gameState.nextScrollPage() },
	previousScrollPage: () => { gameState.previousScrollPage() },

	// COFRE DE RUNAS
	openRuneChest: () => { gameState.openRuneChest(isOptionsOpen) }
})

// --- GENERAR EL MAPA DE BOTONES Y HITBOXES ---
const roomInteractions = getRoomInteractions(canvasElement)

// --- CARGAR LAS IMÁGENES AUTOMÁTIMAMENTE ---
const gameImages = {}
const imageSources = GAME_ASSET_SOURCES.IMAGES

Object.keys(imageSources).forEach((key) => {
	gameImages[key] = new Image()
	gameImages[key].decoding = "async"
})

const loadedImageKeys = new Set()
const preloadedRawFiles = new Set()

function loadImageByKey(key) {
	if (loadedImageKeys.has(key) || !gameImages[key] || !imageSources[key]) {
		return
	}

	gameImages[key].src = `assets/${imageSources[key]}`
	loadedImageKeys.add(key)
}

function setImageSourceIfNeeded(key, filename) {
	const image = gameImages[key]
	if (!image) {
		return
	}

	if (!image.src || !image.src.includes(filename)) {
		image.src = `assets/${filename}`
	}
}

function preloadRawFile(filename) {
	if (preloadedRawFiles.has(filename)) {
		return
	}

	const preloadImage = new Image()
	preloadImage.decoding = "async"
	preloadImage.src = `assets/${filename}`
	preloadedRawFiles.add(filename)
}

function preloadImageBundle(keys) {
	keys.forEach(loadImageByKey)
}

function queueGameplayAssetPreload() {
	const preloadTask = () => {
		preloadImageBundle([
			"main",
			"exitGate",
			"candlesDetail",
			"colorsDetail",
			"scrollDetail",
			"chestClosed",
			"chestOpenRune",
			"mainCharacterIntro",
			"mainCharacterSolving",
			"mainCharacterSolvedPuzzle",
			"runeOne",
			"runeTwo",
			"runeThree",
			"runeFour",
			"winDoor",
			"loseDoor"
		])

		[
			GAME_ASSET_SOURCES.STAGE_VARIANTS.CANDLE_ON,
			GAME_ASSET_SOURCES.STAGE_VARIANTS.COLOR_ON,
			GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_CANDLE_ON,
			GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_COLOR_ON,
			GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_ALL_ON,
			GAME_ASSET_SOURCES.STAGE_VARIANTS.EXIT_GATE_COLOR_ON,
			GAME_ASSET_SOURCES.STAGE_VARIANTS.LOSE_DOOR_COLOR_ON
		].forEach(preloadRawFile)
	}

	if (typeof window.requestIdleCallback === "function") {
		window.requestIdleCallback(preloadTask, { timeout: 1200 })
	} else {
		setTimeout(preloadTask, 120)
	}
}

// Arranque rápido: solo se carga la portada del menú.
preloadImageBundle(["start"])

runesState.onSolved = () => { gameState.solveRuneChest() }
runesState.onClose = (closeReason) => {
	gameState.closeRuneChest()
	if (closeReason === "outside-click") {
		changeToRoom(ROOM.MAIN)
	}
	}
runesState.onFailed = () => { gameState.failRuneChest() }

// =========================================================================
// 🎯 CONTROLAR EL RATÓN (Eventos de movimiento y clics)
// =========================================================================
canvasElement.addEventListener("mousemove", (event) => {
	const point = getCanvasPointFromMouseEvent(event)
	mouseX = Math.floor(point.x)
	mouseY = Math.floor(point.y)
})

canvasElement.addEventListener("mousedown", (event) => {
	const point = getCanvasPointFromMouseEvent(event)
	processPressStart(point.x, point.y)
})

canvasElement.addEventListener("mouseup", (event) => {
	const point = getCanvasPointFromMouseEvent(event)
	processPressEnd(point.x, point.y)
})

canvasElement.addEventListener("click", (event) => {
	if (Date.now() - lastTouchTimestamp < GAME_RUNTIME.TOUCH_CLICK_GUARD_MS) {
		return
	}

	const point = getCanvasPointFromMouseEvent(event)
	processPrimaryAction(point.x, point.y)
})

canvasElement.addEventListener("touchstart", (event) => {
	lastTouchTimestamp = Date.now()
	const point = getCanvasPointFromTouchEvent(event)
	if (!point) {
		return
	}

	mouseX = Math.floor(point.x)
	mouseY = Math.floor(point.y)
	processPressStart(point.x, point.y)
	event.preventDefault()
}, { passive: false })

canvasElement.addEventListener("touchmove", (event) => {
	lastTouchTimestamp = Date.now()
	const point = getCanvasPointFromTouchEvent(event)
	if (!point) {
		return
	}

	mouseX = Math.floor(point.x)
	mouseY = Math.floor(point.y)
	event.preventDefault()
}, { passive: false })

canvasElement.addEventListener("touchend", (event) => {
	lastTouchTimestamp = Date.now()
	const point = getCanvasPointFromTouchEvent(event)
	if (!point) {
		return
	}

	mouseX = Math.floor(point.x)
	mouseY = Math.floor(point.y)
	processPressEnd(point.x, point.y)
	processPrimaryAction(point.x, point.y)
	event.preventDefault()
}, { passive: false })

canvasElement.addEventListener("touchcancel", (event) => {
	lastTouchTimestamp = Date.now()
	if (runesState.draggedIndex !== null) {
		runesState.draggedIndex = null
	}
	event.preventDefault()
}, { passive: false })

// =========================================================================
// 🛠️ HERRAMIENTA DE DESARROLLO: VISOR DE COORDENADAS
// =========================================================================
function drawMouseCoordinates() {
	canvasContext.fillStyle = "white"
	canvasContext.font = "14px Arial"
	canvasContext.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20)
}

function formatTimerText(remainingMs) {
	const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function startLossSequence() {
	if (lossSequenceState.triggered) {
		return
	}

	lossSequenceState.triggered = true
	lossSequenceState.phase = "dialog"
	lossSequenceState.startedAt = Date.now()
}

function drawLossSequence(canvasContext, canvasElement, gameImages) {
	if (!lossSequenceState.triggered) {
		return false
	}

	const introCharacter = gameImages.mainCharacterIntro
	const drawIntroCharacterOnLoss = () => {
		if (!introCharacter || !introCharacter.complete || introCharacter.naturalWidth <= 0) {
			return
		}

		const maxHeight = GAME_RUNTIME.LOSS_SEQUENCE.INTRO_CHARACTER_MAX_HEIGHT
		const scale = Math.min(1, maxHeight / introCharacter.naturalHeight)
		const drawWidth = introCharacter.naturalWidth * scale
		const drawHeight = introCharacter.naturalHeight * scale
		const drawX = GAME_RUNTIME.LOSS_SEQUENCE.INTRO_CHARACTER_X
		const drawY = canvasElement.height - drawHeight - GAME_RUNTIME.LOSS_SEQUENCE.INTRO_CHARACTER_BOTTOM_OFFSET_Y
		canvasContext.drawImage(introCharacter, drawX, drawY, drawWidth, drawHeight)
	}

	const elapsed = Date.now() - lossSequenceState.startedAt
	const dialogDurationMs = GAME_RUNTIME.LOSS_SEQUENCE.DIALOG_DURATION_MS
	const waitDurationMs = GAME_RUNTIME.LOSS_SEQUENCE.WAIT_DURATION_MS

	if (lossSequenceState.phase === "dialog") {
		drawStandardRoomBackground(canvasContext, canvasElement, gameImages.loseDoor, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE)
		drawIntroCharacterOnLoss()

		const panelX = GAME_RUNTIME.LOSS_SEQUENCE.PANEL_MARGIN_X
		const panelY = canvasElement.height - GAME_RUNTIME.LOSS_SEQUENCE.PANEL_BOTTOM_OFFSET_Y
		const panelWidth = canvasElement.width - (GAME_RUNTIME.LOSS_SEQUENCE.PANEL_MARGIN_X * 2)
		const panelHeight = GAME_RUNTIME.LOSS_SEQUENCE.PANEL_HEIGHT

		canvasContext.save()
		canvasContext.fillStyle = "rgba(0, 0, 0, 0.72)"
		canvasContext.fillRect(panelX, panelY, panelWidth, panelHeight)
		canvasContext.strokeStyle = "#e8d8c3"
		canvasContext.lineWidth = 2
		canvasContext.strokeRect(panelX, panelY, panelWidth, panelHeight)
		canvasContext.fillStyle = "#e8d8c3"
		canvasContext.font = "bold 24px 'Georgia', serif"
		canvasContext.textAlign = "center"
		canvasContext.textBaseline = "middle"
		canvasContext.fillText("HA VUELTO!", canvasElement.width / 2, panelY + panelHeight / 2)
		canvasContext.restore()

		if (elapsed >= dialogDurationMs) {
			lossSequenceState.phase = "wait"
			lossSequenceState.startedAt = Date.now()
		}

		return true
	}

	if (lossSequenceState.phase === "wait") {
		drawStandardRoomBackground(canvasContext, canvasElement, gameImages.loseDoor, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE)

		if (elapsed >= waitDurationMs) {
			lossSequenceState.phase = "death"
			lossSequenceState.startedAt = Date.now()
		}

		return true
	}

	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	canvasContext.fillStyle = "#ff0000"
	canvasContext.font = "bold 48px 'Georgia', serif"
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "middle"
	canvasContext.fillText("HAS MUERTO", canvasElement.width / 2, canvasElement.height / 2 - 30)
	drawReplayButton()

	return true
}

// =========================================================================
// 🔄 EL MOTOR DE ANIMACIÓN DEL JUEGO (Game Loop)
// =========================================================================
export function draw() {
	// Actualizar imágenes de detalle según el estado de los puzzles
	try {
		const hasGameplayStarted = currentRoom !== ROOM.START || timerActive || gameState.gameWon || lossSequenceState.triggered

		if (hasGameplayStarted) {
			if (gameState.colorsResultText === "9") {
				setImageSourceIfNeeded("colorsDetail", GAME_ASSET_SOURCES.STAGE_VARIANTS.COLOR_ON)
			} else {
				setImageSourceIfNeeded("colorsDetail", GAME_ASSET_SOURCES.STAGE_VARIANTS.COLOR_OFF)
			}

			if (gameState.candleResultText === "3") {
				setImageSourceIfNeeded("candlesDetail", GAME_ASSET_SOURCES.STAGE_VARIANTS.CANDLE_ON)
			} else {
				setImageSourceIfNeeded("candlesDetail", GAME_ASSET_SOURCES.STAGE_VARIANTS.CANDLE_OFF)
			}

			const colorPuzzleSolved = gameState.colorsResultText === "9"
			const desiredExitGate = colorPuzzleSolved ? GAME_ASSET_SOURCES.STAGE_VARIANTS.EXIT_GATE_COLOR_ON : GAME_ASSET_SOURCES.STAGE_VARIANTS.EXIT_GATE_DEFAULT
			setImageSourceIfNeeded("exitGate", desiredExitGate)

			const desiredLoseDoor = colorPuzzleSolved ? GAME_ASSET_SOURCES.STAGE_VARIANTS.LOSE_DOOR_COLOR_ON : GAME_ASSET_SOURCES.STAGE_VARIANTS.LOSE_DOOR_DEFAULT
			setImageSourceIfNeeded("loseDoor", desiredLoseDoor)

			// Actualizar la imagen principal de la habitación principal según el estado de los puzzles
			try {
				const candleDone = gameState.candleResultText === "3"
				const colorDone = gameState.colorsResultText === "9"
				let desiredMain = GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_DEFAULT
				if (candleDone && !colorDone) {
					desiredMain = GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_CANDLE_ON
				} else if (colorDone && !candleDone) {
					desiredMain = GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_COLOR_ON
				} else if (candleDone && colorDone) {
					desiredMain = GAME_ASSET_SOURCES.STAGE_VARIANTS.MAIN_ALL_ON
				}

				setImageSourceIfNeeded("main", desiredMain)
			} catch (e) {
				console.warn("Error actualizando fondo de la habitación principal:", e)
			}
		}
	} catch (e) {
		// No bloquear el bucle de dibujo por errores menores
		console.warn("Error actualizando imágenes de estado:", e)
	}
	if (gameState.gameWon) {
		const elapsed = Date.now() - gameState.winTriggeredAt

		if (elapsed >= 2000) {
			canvasContext.fillStyle = "white"
			canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

			canvasContext.fillStyle = "black"
			canvasContext.font = "bold 36px 'Georgia', serif"
			canvasContext.textAlign = "center"
			canvasContext.textBaseline = "middle"
			canvasContext.fillText("HAS ESCAPADO", canvasElement.width / 2, canvasElement.height / 2 - 30)
			drawReplayButton()
			requestAnimationFrame(draw)
			return
		}

		if (gameImages.winDoor && gameImages.winDoor.complete) {
			canvasContext.drawImage(gameImages.winDoor, 0, 0, canvasElement.width, canvasElement.height)
		} else {
			canvasContext.fillStyle = "black"
			canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
		}
		requestAnimationFrame(draw)
		return
	}

	switch (currentRoom) {

		// 🏠 CASO 1: ESTAMOS EN EL MENÚ DE INICIO
		case ROOM.START:
			if (gameImages.start.complete) {
				drawProportionalBackground(canvasContext, canvasElement, gameImages.start)

				const menuButtons = roomInteractions[ROOM.START]
				// 🛠️ REPARADO: Volvemos a colocar los índices fijos [0] y [1] para que se lea correctamente
				const isMouseOverPlay = isMouseInsideZone(mouseX, mouseY, menuButtons[0])
				const isMouseOverOptions = isMouseInsideZone(mouseX, mouseY, menuButtons[1])

				canvasContext.textAlign = "center"
				canvasContext.textBaseline = "middle"
				canvasContext.font = "16px 'Times New Roman', serif"

				// 🛠️ REPARADO: Pasamos los elementos individuales indexados para dibujarlos en pantalla
				drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, menuButtons[0], isMouseOverPlay, "JUGAR")
				drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, menuButtons[1], isMouseOverOptions, "OPCIONES")

				if (isOptionsOpen) {
					const modalWidth = INTERFACE_DIMENSIONS.OPTIONS_MODAL_WIDTH
					const modalHeight = INTERFACE_DIMENSIONS.OPTIONS_MODAL_HEIGHT
					const modalLeftX = canvasElement.width / 2 - modalWidth / 2
					const modalTopY = canvasElement.height / 2 - modalHeight / 2
					const modalBevelSize = 12

					canvasContext.beginPath()
					canvasContext.moveTo(modalLeftX + modalBevelSize, modalTopY)
					canvasContext.lineTo(modalLeftX + modalWidth - modalBevelSize, modalTopY)
					canvasContext.lineTo(modalLeftX + modalWidth, modalTopY + modalBevelSize)
					canvasContext.lineTo(modalLeftX + modalWidth, modalTopY + modalHeight - modalBevelSize)
					canvasContext.lineTo(modalLeftX + modalWidth - modalBevelSize, modalTopY + modalHeight)
					canvasContext.lineTo(modalLeftX + modalBevelSize, modalTopY + modalHeight)
					canvasContext.lineTo(modalLeftX, modalTopY + modalHeight - modalBevelSize)
					canvasContext.lineTo(modalLeftX, modalTopY + modalBevelSize)
					canvasContext.closePath()

					canvasContext.fillStyle = INTERFACE_COLORS.OPTIONS_MODAL_OVERLAY
					canvasContext.fill()
					canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT
					canvasContext.lineWidth = 2
					canvasContext.stroke()

					canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
					canvasContext.font = "bold 18px 'Times New Roman', serif"
					canvasContext.fillText("SONIDO", canvasElement.width / 2, modalTopY + 30)

					const modalButtons = getModalInteractions(canvasElement)
					// 🛠️ REPARADO: Índices fijos individuales colocados para el panel de ajustes
					const isMouseOverAudio = isMouseInsideZone(mouseX, mouseY, modalButtons[0])
					const isMouseOverBack = isMouseInsideZone(mouseX, mouseY, modalButtons[1])

					canvasContext.font = "14px 'Times New Roman', serif"

					const audioStatusText = getIsMuted() ? "MÚSICA: OFF" : "MÚSICA: ON"
					drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, modalButtons[0], isMouseOverAudio, audioStatusText, 6)
					drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, modalButtons[1], isMouseOverBack, "VOLVER", 6)
				}

				canvasContext.textAlign = "left"
				canvasContext.textBaseline = "alphabetic"
			} else {
				canvasContext.fillStyle = "#121212"
				canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
			}
			break

		// 🚪 CASO 2: ESTAMOS EN LA HABITACIÓN PRINCIPAL
		case ROOM.MAIN: {
			let mainRoomBackground = gameImages.main
			if (gameState.runeChestStatus === "intro_closed") {
				mainRoomBackground = gameImages.chestClosed || gameImages.main
			} else if (gameState.runeChestStatus === "intro_open" || gameState.runeChestStatus === "modal" || gameState.runeChestStatus === "failed") {
				mainRoomBackground = gameImages.chestOpenRune || gameImages.main
			}
			drawStandardRoomBackground(canvasContext, canvasElement, mainRoomBackground, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_MAIN)
			break
		}

		// 🗝️ CASO 3: ESTAMOS EN LA PUERTA DE SALIDA
		case ROOM.EXIT_GATE:
			drawStandardRoomBackground(canvasContext, canvasElement, gameImages.exitGate, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_EXIT_GATE)
			break
	}

	let remainingTimeMs = GAME_SETTINGS.TIMER_DURATION_MS
	if (timerActive && timerStartedAt !== null) {
		remainingTimeMs = Math.max(0, GAME_SETTINGS.TIMER_DURATION_MS - (Date.now() - timerStartedAt))
	}
	if (remainingTimeMs <= 0) {
		startLossSequence()
	}

	if (drawLossSequence(canvasContext, canvasElement, gameImages)) {
		canvasContext.save()
		canvasContext.textAlign = "right"
		canvasContext.textBaseline = "middle"
		canvasContext.font = "bold 18px 'Georgia', serif"
		canvasContext.fillStyle = "#f4e2b8"
		if (timerActive) {
			canvasContext.fillText(formatTimerText(remainingTimeMs), canvasElement.width - 18, 24)
		}
		canvasContext.restore()
		requestAnimationFrame(draw)
		return
	}

	canvasContext.save()
	canvasContext.textAlign = "right"
	canvasContext.textBaseline = "middle"
	canvasContext.font = "bold 18px 'Georgia', serif"
	canvasContext.fillStyle = "#f4e2b8"
	if (timerActive) {
		canvasContext.fillText(formatTimerText(remainingTimeMs), canvasElement.width - 18, 24)
	}
	canvasContext.restore()

	// --- DIBUJAR LAS FLECHAS PARA MOVERSE ENTRE SALAS ---
	if (currentRoom === ROOM.MAIN && !gameState.isRuneChestOpen) {
		drawNavigationArrow(
			canvasContext,
			canvasElement,
			INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE,
			"UP",
			INTERFACE_DIMENSIONS.ARROW_Y_ROOM_MAIN,
			INTERFACE_DIMENSIONS.ARROW_X_ROOM_MAIN
		)
		drawDialogBox(canvasContext, canvasElement, gameState, "intro", gameImages)
	}
	if (currentRoom === ROOM.EXIT_GATE) {
		drawNavigationArrow(canvasContext, canvasElement, INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, "DOWN", canvasElement.height - 5)
	}

	// =========================================================================
	// 🖲️ INTERFAZ DEL POP-UP: TECLADO NUMÉRICO (Prioridad y delegación limpia)
	// =========================================================================
	// =========================================================================
	// 🖲️ INTERFAZ DEL POP-UP: TECLADO NUMÉRICO (Prioridad y delegación limpia)
	// =========================================================================
	if (currentRoom === ROOM.MAIN) {
		gameState.updateIntroSequence()
	}

	if (gameState.isKeypadOpen) {
		loadImageByKey("mainCharacterSolving")
		loadImageByKey("mainCharacterSolvedPuzzle")
		drawKeypadPuzzle(canvasContext, canvasElement, gameState, gameImages)
	}

	// =========================================================================
	// 🕯️ INTERFAZ DEL POP-UP: PUZZLE DE LAS VELAS (Delegación limpia)
	// =========================================================================
	if (gameState.isCandleOpen) {
		loadImageByKey("candlesDetail")
		drawCandlePuzzle(canvasContext, canvasElement, gameState, gameImages.candlesDetail, gameImages)
	}

	// =========================================================================
	// 🎨 INTERFAZ DEL POP-UP: PUZZLE DE COLORES (Delegación limpia)
	// =========================================================================
	if (gameState.isColorPuzzleOpen) {
		loadImageByKey("colorsDetail")
		drawColorPuzzle(canvasContext, canvasElement, gameState, gameImages.colorsDetail, gameImages)
	}

	// =========================================================================
	// 📜 INTERFAZ DEL POP-UP: VISTA DEL PERGAMINO (Delegación limpia)
	// =========================================================================
	if (gameState.isScrollOpen) {
		loadImageByKey("scrollDetail")
		drawScrollText(canvasContext, canvasElement, gameState, gameImages.scrollDetail, gameImages)
	}

	// =========================================================================
	// 🗿 INTERFAZ DEL POP-UP: PUZZLE DE RUNAS (Delegación limpia)
	// =========================================================================
	loadImageByKey("runeOne")
	loadImageByKey("runeTwo")
	loadImageByKey("runeThree")
	loadImageByKey("runeFour")
	drawRunesPuzzle(canvasContext, canvasElement, gameImages, mouseX, mouseY)
	if (gameState.isRuneChestOpen) {
		drawDialogBox(canvasContext, canvasElement, gameState, "runes", gameImages)
	}

	// Herramienta de depuración opcional
	if (SHOW_MOUSE_COORDINATES) {
		drawMouseCoordinates()
	}

	// Le pide al navegador que vuelva a ejecutar esta función 'draw' en el próximo fotograma
	requestAnimationFrame(draw)
}

// 🎬 ENMÁRCHATE: Arrancamos el bucle por primera vez
draw()
