/**
 * 📦 TRAER LAS PIEZAS DE LOS OTROS ARCHIVOS (Imports)
 */
import { ROOM, INTERFACE_COLORS, INTERFACE_DIMENSIONS, GAME_SETTINGS } from "./config.js"
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
let lossSequenceState = {
	triggered: false,
	phase: "idle",
	startedAt: null
}

// --- CONECTAR NUESTRAS VARIABLES CON EL ARCHIVO DE CLICS ---
initializeInteractions({
	changeRoom: (targetRoom) => {
		currentRoom = targetRoom
		if (targetRoom === ROOM.ONE) {
			gameState.startIntroSequence()
			if (!timerActive) {
				timerActive = true
				timerStartedAt = Date.now()
			}
		}
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

	// COFRE DE RUNAS
	openRuneChest: () => { gameState.openRuneChest(isOptionsOpen) }
})

// --- GENERAR EL MAPA DE BOTONES Y HITBOXES ---
const roomInteractions = getRoomInteractions(canvasElement)

// --- CARGAR LAS IMÁGENES AUTOMÁTIMAMENTE ---
const gameImages = {}
const imageSources = {
	start: "roomStart.jpg",
	one: "roomMain.jpg",
	four: "roomExitGate.jpg",
	candlesDetail: "candleOff.jpg",
	colorsDetail: "colorPanelOff.jpg",
	scrollDetail: "tableScroll.jpg",
	chestClosed: "chestClosed.jpeg",
	chestOpenRune: "chestOpenRune.jpg",
	runeOne: "runeOne.png",
	runeTwo: "runeTwo.png",
	runeThree: "runeThree.png",
	runeFour: "runeFour.png",
	winDoor: "winDoor.jpg",
	loseDoor: "loseDoor.jpg"
}

Object.entries(imageSources).forEach(([key, filename]) => {
	gameImages[key] = new Image()
	gameImages[key].src = `assets/${filename}`
})

runesState.onSolved = () => { gameState.solveRuneChest() }
runesState.onClose = () => { gameState.closeRuneChest() }
runesState.onFailed = () => { gameState.failRuneChest() }

// =========================================================================
// 🎯 CONTROLAR EL RATÓN (Eventos de movimiento y clics)
// =========================================================================
canvasElement.addEventListener("mousemove", (event) => {
	const boundaries = canvasElement.getBoundingClientRect()
	mouseX = Math.floor(event.clientX - boundaries.left)
	mouseY = Math.floor(event.clientY - boundaries.top)
})

canvasElement.addEventListener("mousedown", (event) => {
	const boundaries = canvasElement.getBoundingClientRect()
	const clickX = event.clientX - boundaries.left
	const clickY = event.clientY - boundaries.top

	if (runesState.isOpen) {
		handleRunesMousedown(clickX, clickY, canvasElement.width, canvasElement.height)
	}
})

canvasElement.addEventListener("mouseup", (event) => {
	const boundaries = canvasElement.getBoundingClientRect()
	const clickX = event.clientX - boundaries.left
	const clickY = event.clientY - boundaries.top

	if (runesState.isOpen) {
		handleRunesMouseup(clickX, clickY, canvasElement.width, canvasElement.height)
	}
})

canvasElement.addEventListener("click", (event) => {
	const boundaries = canvasElement.getBoundingClientRect()
	const clickX = event.clientX - boundaries.left
	const clickY = event.clientY - boundaries.top

	// PRIORIDAD JERÁRQUICA: Teclado > Velas > Colores > Manuscrito > Runas > Opciones > Habitación normal
	if (runesState.isOpen) {
		handleRunesClick(clickX, clickY, canvasElement.width, canvasElement.height)
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
})

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

	const elapsed = Date.now() - lossSequenceState.startedAt
	const dialogDurationMs = 1000
	const waitDurationMs = 2000

	if (lossSequenceState.phase === "dialog") {
		drawStandardRoomBackground(canvasContext, canvasElement, gameImages.loseDoor, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE)

		const panelX = 80
		const panelY = canvasElement.height - 140
		const panelWidth = canvasElement.width - 160
		const panelHeight = 90

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
	canvasContext.fillText("HAS MUERTO", canvasElement.width / 2, canvasElement.height / 2)

	return true
}

// =========================================================================
// 🔄 EL MOTOR DE ANIMACIÓN DEL JUEGO (Game Loop)
// =========================================================================
export function draw() {
	// Actualizar imágenes de detalle según el estado de los puzzles
	try {
		if (gameState.colorsResultText === "9") {
			if (gameImages.colorsDetail && !gameImages.colorsDetail.src.includes("colorPanelOn.jpg")) {
				gameImages.colorsDetail.src = "assets/colorPanelOn.jpg"
			}
		} else {
			if (gameImages.colorsDetail && !gameImages.colorsDetail.src.includes("colorPanelOff.jpg")) {
				gameImages.colorsDetail.src = "assets/colorPanelOff.jpg"
			}
		}

		if (gameState.candleResultText === "3") {
			if (gameImages.candlesDetail && !gameImages.candlesDetail.src.includes("candleOn.jpg")) {
				gameImages.candlesDetail.src = "assets/candleOn.jpg"
			}
		} else {
			if (gameImages.candlesDetail && !gameImages.candlesDetail.src.includes("candleOff.jpg")) {
				gameImages.candlesDetail.src = "assets/candleOff.jpg"
			}
		}

		// Actualizar la imagen principal de la habitación 1 según el estado de los puzzles
		try {
			const candleDone = gameState.candleResultText === "3"
			const colorDone = gameState.colorsResultText === "9"
			let desiredOne = "assets/roomMain.jpg"
			if (candleDone && !colorDone) {
				desiredOne = "assets/roomMainCandleOn.jpg"
			} else if (colorDone && !candleDone) {
				desiredOne = "assets/roomMainColorPanelOn.jpg"
			} else if (candleDone && colorDone) {
				desiredOne = "assets/roomMainPuzzleOn.jpg"
			}

			if (gameImages.one && !gameImages.one.src.includes(desiredOne.split('/').pop())) {
				gameImages.one.src = desiredOne
			}
		} catch (e) {
			console.warn("Error actualizando fondo de la habitación 1:", e)
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
			canvasContext.fillText("HAS ESCAPADO", canvasElement.width / 2, canvasElement.height / 2)
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

		// 🚪 CASO 2: ESTAMOS EN LA HABITACIÓN UNO
		case ROOM.ONE: {
			let roomOneBackground = gameImages.one
			if (gameState.runeChestStatus === "opening") {
				roomOneBackground = gameImages.chestClosed || gameImages.one
			} else if (gameState.runeChestStatus === "opened") {
				roomOneBackground = gameImages.chestOpenRune || gameImages.one
			} else if (gameState.runeChestStatus === "solved") {
				roomOneBackground = gameImages.chestClosed || gameImages.one
			}
			drawStandardRoomBackground(canvasContext, canvasElement, roomOneBackground, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE)
			break
		}

		// 🗝️ CASO 3: ESTAMOS EN LA HABITACIÓN CUATRO
		case ROOM.FOUR:
			drawStandardRoomBackground(canvasContext, canvasElement, gameImages.four, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_FOUR)
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
	if (currentRoom === ROOM.ONE) {
		drawDialogBox(canvasContext, canvasElement, gameState, "intro")
		drawNavigationArrow(
			canvasContext,
			canvasElement,
			INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE,
			"UP",
			INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE,
			INTERFACE_DIMENSIONS.ARROW_X_ROOM_ONE
		)
	}
	if (currentRoom === ROOM.FOUR) {
		drawNavigationArrow(canvasContext, canvasElement, INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, "DOWN", canvasElement.height - 5)
	}

	// =========================================================================
	// 🖲️ INTERFAZ DEL POP-UP: TECLADO NUMÉRICO (Prioridad y delegación limpia)
	// =========================================================================
	// =========================================================================
	// 🖲️ INTERFAZ DEL POP-UP: TECLADO NUMÉRICO (Prioridad y delegación limpia)
	// =========================================================================
	if (currentRoom === ROOM.ONE) {
		gameState.updateIntroSequence()
	}

	if (gameState.isKeypadOpen) {
		drawKeypadPuzzle(canvasContext, canvasElement, gameState)
	}

	// =========================================================================
	// 🕯️ INTERFAZ DEL POP-UP: PUZZLE DE LAS VELAS (Delegación limpia)
	// =========================================================================
	if (gameState.isCandleOpen) {
		drawCandlePuzzle(canvasContext, canvasElement, gameState, gameImages.candlesDetail)
	}

	// =========================================================================
	// 🎨 INTERFAZ DEL POP-UP: PUZZLE DE COLORES (Delegación limpia)
	// =========================================================================
	if (gameState.isColorPuzzleOpen) {
		drawColorPuzzle(canvasContext, canvasElement, gameState, gameImages.colorsDetail)
	}

	// =========================================================================
	// 📜 INTERFAZ DEL POP-UP: VISTA DEL PERGAMINO (Delegación limpia)
	// =========================================================================
	if (gameState.isScrollOpen) {
		drawScrollText(canvasContext, canvasElement, gameState, gameImages.scrollDetail)
	}

	// =========================================================================
	// 🗿 INTERFAZ DEL POP-UP: PUZZLE DE RUNAS (Delegación limpia)
	// =========================================================================
	drawRunesPuzzle(canvasContext, canvasElement, gameImages, mouseX, mouseY)
	drawDialogBox(canvasContext, canvasElement, gameState, "runes")

	// Ejecuta la herramienta que pinta la posición X e Y del ratón
	drawMouseCoordinates()

	// Le pide al navegador que vuelva a ejecutar esta función 'draw' en el próximo fotograma
	requestAnimationFrame(draw)
}

// 🎬 ENMÁRCHATE: Arrancamos el bucle por primera vez
draw()
