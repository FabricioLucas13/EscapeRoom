/**
 * 📦 TRAER LAS PIEZAS DE LOS OTROS ARCHIVOS (Imports)
 */
import { ROOM, INTERFACE_COLORS, INTERFACE_DIMENSIONS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton, drawProportionalBackground, drawStandardRoomBackground, drawNavigationArrow } from "./helpers.js"
import { initializeInteractions, getModalInteractions, getRoomInteractions, getKeypadInteractions } from "./interactions.js"
import { drawKeypadPuzzle } from "./puzzleKeypad.js"
import { playMusic, toggleMusic, getIsMuted } from "./audioEngine.js"
// 🆕 Traemos el administrador de estados centralizado
import { gameState } from "./stateManager.js"

// --- CONFIGURAR EL CANVAS (El lienzo de dibujo) ---
const canvasElement = document.getElementById("game-screen")
const canvasContext = canvasElement.getContext("2d")

// --- LAS CAJAS DE DATOS DEL JUEGO (Variables de Estado del Motor) ---
let mouseX = 0                  
let mouseY = 0                  
let currentRoom = ROOM.START    
let isOptionsOpen = false       

// --- CONECTAR NUESTRAS VARIABLES CON EL ARCHIVO DE CLICS ---
initializeInteractions({
	changeRoom: (targetRoom) => { currentRoom = targetRoom },
	openExitKeypad: () => { gameState.openKeypad(isOptionsOpen) },
	getIsMusicMuted: () => getIsMuted(), 
	getGameMusic: () => ({ play: () => Promise.resolve(playMusic()) }), 
	openOptionsModal: () => { if (!isOptionsOpen && !gameState.isKeypadOpen) isOptionsOpen = true },
	closeOptionsModal: () => { isOptionsOpen = false },
	toggleMusic: () => { toggleMusic() }, 

	// 🚀 LIMPIEZA TOTAL: Las funciones delegan directamente en el administrador de estados
	closeExitKeypad: () => { gameState.closeKeypad() },
	keypadPress: (num) => { gameState.pressKey(num) },
	keypadReset: () => { gameState.resetKeypad() },
	keypadCheck: () => { gameState.checkKeypad() }
})

// --- GENERAR EL MAPA DE BOTONES Y HITBOXES ---
const roomInteractions = getRoomInteractions(canvasElement)

// --- CARGAR LAS IMÁGENES AUTOMÁTICAMENTE ---
const gameImages = {}
const imageSources = { start: "roomStart.png", one: "roomOne.jpg", four: "roomFour.jpg" }

Object.entries(imageSources).forEach(([key, filename]) => {
	gameImages[key] = new Image()
	gameImages[key].src = `assets/${filename}`
})

// =========================================================================
// 🎯 CONTROLAR EL RATÓN (Eventos de movimiento y clics)
// =========================================================================
canvasElement.addEventListener("mousemove", (event) => {
	const boundaries = canvasElement.getBoundingClientRect()
	mouseX = Math.floor(event.clientX - boundaries.left)
	mouseY = Math.floor(event.clientY - boundaries.top)
})

canvasElement.addEventListener("click", (event) => {
	const boundaries = canvasElement.getBoundingClientRect()
	const clickX = event.clientX - boundaries.left
	const clickY = event.clientY - boundaries.top

	let activeZones = []
	if (gameState.isKeypadOpen) {
		activeZones = getKeypadInteractions(canvasElement)
	} else if (currentRoom === ROOM.START && isOptionsOpen) {
		activeZones = getModalInteractions(canvasElement)
	} else {
		activeZones = roomInteractions[currentRoom]
	}

	if (activeZones) {
		activeZones.forEach(zone => {
			if (isMouseInsideZone(clickX, clickY, zone)) zone.action()
		})
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

// =========================================================================
// 🔄 EL MOTOR DE ANIMACIÓN DEL JUEGO (Game Loop)
// =========================================================================
function draw() {
	switch (currentRoom) {

		// 🏠 CASO 1: ESTAMOS EN EL MENÚ DE INICIO
		case ROOM.START:
			if (gameImages.start.complete) {
				drawProportionalBackground(canvasContext, canvasElement, gameImages.start)

				const startZones = roomInteractions[ROOM.START]
				const isMouseOverPlay = isMouseInsideZone(mouseX, mouseY, startZones[0])
				const isMouseOverOptions = isMouseInsideZone(mouseX, mouseY, startZones[1])

				canvasContext.textAlign = "center"
				canvasContext.textBaseline = "middle"
				canvasContext.font = "16px 'Times New Roman', serif"

				drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, startZones[0], isMouseOverPlay, "JUGAR")
				drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, startZones[1], isMouseOverOptions, "OPCIONES")

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

					const modalZones = getModalInteractions(canvasElement)
					const isMouseOverAudio = isMouseInsideZone(mouseX, mouseY, modalZones[0])
					const isMouseOverBack = isMouseInsideZone(mouseX, mouseY, modalZones[1])

					canvasContext.font = "14px 'Times New Roman', serif"
					
					const textoMusica = getIsMuted() ? "MÚSICA: OFF" : "MÚSICA: ON"
					drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, modalZones[0], isMouseOverAudio, textoMusica, 6)
					drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, modalZones[1], isMouseOverBack, "VOLVER", 6)
				}

				canvasContext.textAlign = "left"
				canvasContext.textBaseline = "alphabetic"
			} else {
				canvasContext.fillStyle = "#121212"
				canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
			}
			break

		// 🚪 CASO 2: ESTAMOS EN LA HABITACIÓN UNO
		case ROOM.ONE:
			drawStandardRoomBackground(canvasContext, canvasElement, gameImages.one, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE)
			break

		// 🗝️ CASO 3: ESTAMOS EN LA HABITACIÓN CUATRO
		case ROOM.FOUR:
			drawStandardRoomBackground(canvasContext, canvasElement, gameImages.four, INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_FOUR)
			break
	}

	// --- DIBUJAR LAS FLECHAS PARA MOVERSE ENTRE SALAS ---
	if (currentRoom === ROOM.ONE) {
		drawNavigationArrow(canvasContext, canvasElement, INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, "UP", INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE)
	}
	if (currentRoom === ROOM.FOUR) {
		drawNavigationArrow(canvasContext, canvasElement, INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, "DOWN", canvasElement.height - 5)
	}

	// =========================================================================
	// 🖲️ INTERFAZ DEL POP-UP: TECLADO NUMÉRICO (Prioridad y delegación limpia)
	// =========================================================================
	if (gameState.isKeypadOpen) {
		// 🧹 LIMPIEZA: Pasamos el objeto global directo con todas sus propiedades mutadas
		drawKeypadPuzzle(canvasContext, canvasElement, gameState)
	}

	// Ejecuta la herramienta que pinta la posición X e Y del ratón
	drawMouseCoordinates()

	// Le pide al navegador que vuelva a ejecutar esta función 'draw' en el próximo fotograma
	requestAnimationFrame(draw)
}

// 🎬 ENMÁRCHATE: Arrancamos el bucle por primera vez
draw()
