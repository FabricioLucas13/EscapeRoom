const canvas = document.getElementById("game-screen")
const drawInGame = canvas.getContext("2d")

let mouseX = 0
let mouseY = 0

// --- CONFIGURACIÓN DE AUDIO ---
let isOptionsOpen = false       // Controla si el modal está visible
let isMusicMuted = false        // Controla si la música está silenciada

const gameMusic = new Audio("assets/musicEscapeRoom.mp3")
gameMusic.loop = true

// 1. ESTADOS DEL JUEGO Y CONSTANTES
const ROOM = {
	START: 0,
	ONE: 1,
	FOUR: 4
}

let currentRoom = ROOM.START

// --- FUNCIONES DE ACCIÓN PARA LAS INTERACCIONES ---
function changeRoom(targetRoom) {
	currentRoom = targetRoom
}

function openExitKeypad() {
	console.log("Haz hecho click donde en el keypad")
}

function toggleMusic() {
	isMusicMuted = !isMusicMuted
	gameMusic.muted = isMusicMuted

	if (!isMusicMuted) {
		gameMusic.play().catch((e) =>
			console.log("Esperando interacción del usuario para reproducir audio.")
		)
	}
}

// Zonas interactivas del modal de opciones
function getModalInteractions() {
	const modalWidth = 300
	const modalHeight = 220
	const modalTopY = canvas.height / 2 - modalHeight / 2
	const modalButtonWidth = 160
	const modalButtonLeftX = canvas.width / 2 - modalButtonWidth / 2

	return {
		audioMuteButtonZone: {
			x: modalButtonLeftX,
			y: modalTopY + 70,
			width: modalButtonWidth,
			height: 38,
			action: () => toggleMusic()
		},
		backToMenuButtonZone: {
			x: modalButtonLeftX,
			y: modalTopY + 140,
			width: modalButtonWidth,
			height: 38,
			action: () => isOptionsOpen = false
		}
	}
}

// 2. ESTRUCTURA DE DATOS: MAPA DE INTERACCIONES
const roomInteractions = {
	[ROOM.START]: {
		playButtonZone: {
			x: canvas.width / 2 - 112.5,
			y: canvas.height / 2 - 35,
			width: 225,
			height: 44,
			action: () => {
				changeRoom(ROOM.ONE)
				// Arranca la música si no está muteada al pulsar JUGAR
				if (!isMusicMuted) {
					gameMusic.play().catch((e) =>
						console.log("Esperando interacción del usuario para reproducir audio.")
					)
				}
			}
		},
		optionsButtonZone: {
			x: canvas.width / 2 - 112.5,
			y: canvas.height / 2 + 25,
			width: 225,
			height: 44,
			action: () => { if (!isOptionsOpen) isOptionsOpen = true }
		}
	},
	[ROOM.ONE]: [
		// Flecha de avance directo hacia la Sala Cuatro
		{ x: canvas.width / 2 - 35, y: 0, width: 70, height: 40, action: () => changeRoom(ROOM.FOUR) }
	],
	[ROOM.FOUR]: [
		// Flecha hacia abajo para regresar a la Sala Uno
		{ x: canvas.width / 2 - 35, y: canvas.height - 40, width: 70, height: 40, action: () => changeRoom(ROOM.ONE) },
		{ x: 490, y: 235, width: 140, height: 185, action: () => openExitKeypad() }
	]
}

// 3. CARGA DE IMÁGENES (ASSETS)
const roomStart = new Image()
roomStart.src = "assets/roomStart.png"

const roomOne = new Image()
roomOne.src = "assets/roomOne.jpg"

const roomFour = new Image()
roomFour.src = "assets/roomFour.jpg"

// 4. FUNCIONES HELPER / AUXILIARES
function isInside(clickX, clickY, interactionZone) {
	return clickX >= interactionZone.x &&
		clickX <= interactionZone.x + interactionZone.width &&
		clickY >= interactionZone.y &&
		clickY <= interactionZone.y + interactionZone.height
}

function drawBeveledButton(buttonZone, isHovered, textLabel, bevel = 8) {
	drawInGame.beginPath()
	drawInGame.moveTo(buttonZone.x + bevel, buttonZone.y)
	drawInGame.lineTo(buttonZone.x + buttonZone.width - bevel, buttonZone.y)
	drawInGame.lineTo(buttonZone.x + buttonZone.width, buttonZone.y + bevel)
	drawInGame.lineTo(buttonZone.x + buttonZone.width, buttonZone.y + buttonZone.height - bevel)
	drawInGame.lineTo(buttonZone.x + buttonZone.width - bevel, buttonZone.y + buttonZone.height)
	drawInGame.lineTo(buttonZone.x + bevel, buttonZone.y + buttonZone.height)
	drawInGame.lineTo(buttonZone.x, buttonZone.y + buttonZone.height - bevel)
	drawInGame.lineTo(buttonZone.x, buttonZone.y + bevel)
	drawInGame.closePath()

	drawInGame.fillStyle = isHovered ? "#241a16" : "#1a1310"
	drawInGame.fill()
	drawInGame.strokeStyle = isHovered ? "#d1ab7e" : "#8c6f4f"
	drawInGame.lineWidth = isHovered ? 2 : 1.5
	drawInGame.stroke()

	drawInGame.fillStyle = isHovered ? "#e8d8c3" : "#a89276"
	drawInGame.fillText(textLabel, canvas.width / 2, buttonZone.y + buttonZone.height / 2)
}

function drawProportionalBackground(imageAsset) {
	drawInGame.fillStyle = "black"
	drawInGame.fillRect(0, 0, canvas.width, canvas.height)

	const scale = Math.min(canvas.width / imageAsset.width, canvas.height / imageAsset.height)
	const newWidth = imageAsset.width * scale
	const newHeight = imageAsset.height * scale
	const x = (canvas.width - newWidth) / 2
	const y = (canvas.height - newHeight) / 2

	drawInGame.drawImage(imageAsset, x, y, newWidth, newHeight)
}

function drawStandardRoomBackground(roomImage, fallbackColor) {
	if (roomImage.complete) {
		drawInGame.drawImage(roomImage, 0, 0, canvas.width, canvas.height)
	} else {
		drawInGame.fillStyle = fallbackColor
		drawInGame.fillRect(0, 0, canvas.width, canvas.height)
	}
}

// 5. CONTROL DE INPUTS Y EVENTOS
canvas.addEventListener("mousemove", (event) => {
	const rect = canvas.getBoundingClientRect()
	mouseX = Math.floor(event.clientX - rect.left)
	mouseY = Math.floor(event.clientY - rect.top)
})

canvas.addEventListener("click", (event) => {
	const rect = canvas.getBoundingClientRect()
	const clickX = event.clientX - rect.left
	const clickY = event.clientY - rect.top

	if (currentRoom === ROOM.START && isOptionsOpen) {
		const modalInteractions = getModalInteractions()
		if (isInside(clickX, clickY, modalInteractions.audioMuteButtonZone)) modalInteractions.audioMuteButtonZone.action()
		if (isInside(clickX, clickY, modalInteractions.backToMenuButtonZone)) modalInteractions.backToMenuButtonZone.action()
		return
	}

	const currentRoomInteractions = roomInteractions[currentRoom]

	if (currentRoomInteractions) {
		if (currentRoom === ROOM.START) {
			if (isInside(clickX, clickY, currentRoomInteractions.playButtonZone)) currentRoomInteractions.playButtonZone.action()
			if (isInside(clickX, clickY, currentRoomInteractions.optionsButtonZone)) currentRoomInteractions.optionsButtonZone.action()
		} else {
			currentRoomInteractions.forEach(interactionZone => {
				if (isInside(clickX, clickY, interactionZone)) {
					interactionZone.action()
				}
			})
		}
	}
})

// 6. SISTEMA DE RENDERIZADO E INTERFAZ DE USUARIO
function drawMouseCoordinates() {
	drawInGame.fillStyle = "white"
	drawInGame.font = "14px Arial"
	drawInGame.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20)
}

function draw() {
	switch (currentRoom) {
		case ROOM.START:
			if (roomStart.complete) {
				drawProportionalBackground(roomStart)

				const { playButtonZone, optionsButtonZone } = roomInteractions[ROOM.START]

				const isMouseOverPlay = isInside(mouseX, mouseY, playButtonZone)
				const isMouseOverOptions = isInside(mouseX, mouseY, optionsButtonZone)

				drawInGame.textAlign = "center"
				drawInGame.textBaseline = "middle"
				drawInGame.font = "16px 'Times New Roman', serif"

				drawBeveledButton(playButtonZone, isMouseOverPlay, "JUGAR")
				drawBeveledButton(optionsButtonZone, isMouseOverOptions, "OPCIONES")

				if (isOptionsOpen) {
					const modalWidth = 300
					const modalHeight = 220
					const modalX = canvas.width / 2 - modalWidth / 2
					const modalTopY = canvas.height / 2 - modalHeight / 2
					const mBevel = 12

					drawInGame.beginPath()
					drawInGame.moveTo(modalX + mBevel, modalTopY)
					drawInGame.lineTo(modalX + modalWidth - mBevel, modalTopY)
					drawInGame.lineTo(modalX + modalWidth, modalTopY + mBevel)
					drawInGame.lineTo(modalX + modalWidth, modalTopY + modalHeight - mBevel)
					drawInGame.lineTo(modalX + modalWidth - mBevel, modalTopY + modalHeight)
					drawInGame.lineTo(modalX + mBevel, modalTopY + modalHeight)
					drawInGame.lineTo(modalX, modalTopY + modalHeight - mBevel)
					drawInGame.lineTo(modalX, modalTopY + mBevel)
					drawInGame.closePath()

					drawInGame.fillStyle = "rgba(18, 13, 11, 0.95)"
					drawInGame.fill()
					drawInGame.strokeStyle = "#8c6f4f"
					drawInGame.lineWidth = 2
					drawInGame.stroke()

					drawInGame.fillStyle = "#e8d8c3"
					drawInGame.font = "bold 18px 'Times New Roman', serif"
					drawInGame.fillText("SONIDO", canvas.width / 2, modalTopY + 30)

					const modalInteractions = getModalInteractions()
					const { audioMuteButtonZone, backToMenuButtonZone } = modalInteractions

					const isMouseOverAudio = isInside(mouseX, mouseY, audioMuteButtonZone)
					const isMouseOverBack = isInside(mouseX, mouseY, backToMenuButtonZone)

					drawInGame.font = "14px 'Times New Roman', serif"
					const textoMusica = isMusicMuted ? "MÚSICA: OFF" : "MÚSICA: ON"

					drawBeveledButton(audioMuteButtonZone, isMouseOverAudio, textoMusica, 6)
					drawBeveledButton(backToMenuButtonZone, isMouseOverBack, "VOLVER", 6)
				}

				drawInGame.textAlign = "left"
				drawInGame.textBaseline = "alphabetic"

			} else {
				drawInGame.fillStyle = "#121212"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)
			}
			break

		case ROOM.ONE:
			drawStandardRoomBackground(roomOne, "#2d2d2d")
			break

		case ROOM.FOUR:
			drawStandardRoomBackground(roomFour, "#245b3b")
			break
	}

	// --- DIBUJAR INDICADORES DE NAVEGACIÓN ---
	drawInGame.fillStyle = "white"

	if (currentRoom === ROOM.ONE) {
		// Únicamente la flecha de avance (Hacia arriba) hacia ROOM.FOUR
		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width / 2, 5)
		drawInGame.lineTo(canvas.width / 2 - 30, 35)
		drawInGame.lineTo(canvas.width / 2 + 30, 35)
		drawInGame.closePath()
		drawInGame.fill()
	}

	if (currentRoom === ROOM.FOUR) {
		// Únicamente la flecha de retorno (Hacia abajo) hacia ROOM.ONE
		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width / 2, canvas.height - 5)
		drawInGame.lineTo(canvas.width / 2 - 30, canvas.height - 35)
		drawInGame.lineTo(canvas.width / 2 + 30, canvas.height - 35)
		drawInGame.closePath()
		drawInGame.fill()
	}

	drawMouseCoordinates()
	requestAnimationFrame(draw)
}

// 7. Inicio del Juego
draw()
