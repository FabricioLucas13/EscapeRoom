const canvas = document.getElementById("game-screen")
const drawInGame = canvas.getContext("2d")

let mouseX = 0
let mouseY = 0

//musica

let isOptionsOpen = false       // Controla si el modal está visible
let isMusicMuted = false        // Controla si la música está silenciada

const gameMusic = new Audio("assets/musicEscapeRoom.mp3")
gameMusic.loop = true

// 1. Estados del Juego y Constantes
const ROOM = {
	START: 0,
	ONE: 1,
	TWO: 2,
	THREE: 3,
	FOUR: 4
}

let currentRoom = ROOM.START

// --- FUNCIONES DE ACCIÓN PARA LAS INTERACCIONES ---
// Aquí es donde meterás la lógica real de lo que pasa al interactuar
function changeRoom(targetRoom) {
	currentRoom = targetRoom
}

function openExitKeypad() {
	console.log("Haz hecho click donde en el keypad")
}

function toggleMusic() {
	isMusicMuted = !isMusicMuted
	gameMusic.muted = isMusicMuted

	// Si quitamos el silencio, intentamos reproducir la música
	if (!isMusicMuted) {
		gameMusic.play().catch((e) =>
			console.log("Esperando interacción del usuario para reproducir audio.")
		)
	}
}

// Función que define las cajas de clic del modal (Paso 4)
function getModalInteractions() {
    const modalWidth = 300
    const modalHeight = 220
    const modalY = canvas.height / 2 - modalHeight / 2
    const audBtnW = 160
    const audBtnX = canvas.width / 2 - audBtnW / 2

    return [
        { 
            x: audBtnX, 
            y: modalY + 70, 
            width: audBtnW, 
            height: 38, 
            action: () => toggleMusic() 
        },
        { 
            x: audBtnX, 
            y: modalY + 140, 
            width: audBtnW, 
            height: 38, 
            action: () => isOptionsOpen = false 
        }
    ]
}



// 2. Estructura de Datos: Mapa de Interacciones
const roomInteractions = {
	[ROOM.START]: [
		// Botón JUGAR (Calculamos el centro del canvas para X)
		{
			x: canvas.width / 2 - 112.5,
			y: canvas.height / 2 - 35,
			width: 225,
			height: 44,
			action: () => changeRoom(ROOM.ONE)
		},
		// Botón OPCIONES (Un poco más abajo, en Y + 25)
		{
			x: canvas.width / 2 - 112.5,
			y: canvas.height / 2 + 25,
			width: 225,
			height: 44,
			action: () => { if (!isOptionsOpen) isOptionsOpen = true }
		}
	],
	[ROOM.ONE]: [
		{
			x: 0,
			y: canvas.height / 2 - 35,
			width: 40,
			height: 70,
			action: () => changeRoom(ROOM.TWO)
		},
		{
			x: canvas.width - 40,
			y: canvas.height / 2 - 35,
			width: 40,
			height: 70,
			action: () => changeRoom(ROOM.THREE)
		},
		{
			x: canvas.width / 2 - 35,
			y: 0,
			width: 70,
			height: 40,
			action: () => changeRoom(ROOM.FOUR)
		}
	],
	[ROOM.TWO]: [
		{
			x: canvas.width - 40,
			y: canvas.height / 2 - 35,
			width: 40,
			height: 70,
			action: () => changeRoom(ROOM.ONE)
		}
	],
	[ROOM.THREE]: [
		{
			x: 0,
			y: canvas.height / 2 - 35,
			width: 40,
			height: 70,
			action: () => changeRoom(ROOM.ONE)
		}
	],
	[ROOM.FOUR]: [
		{
			x: canvas.width / 2 - 35,
			y: canvas.height - 40,
			width: 70,
			height: 40,
			action: () => changeRoom(ROOM.ONE)
		},
		{
			x: 490,
			y: 235,
			width: 140,
			height: 185,
			action: () => openExitKeypad()
		}
	]
}


// 3. Carga de Imágenes (Assets)
const roomStart = new Image()
roomStart.src = "assets/roomStart.png"

const roomOne = new Image()
roomOne.src = "assets/roomOne.jpg"

const roomTwo = new Image()
roomTwo.src = "assets/roomTwo.jpg"

const roomThree = new Image()
roomThree.src = "assets/roomThree.jpg"

const roomFour = new Image()
roomFour.src = "assets/roomFour.jpg"

// 4. Funciones Ayudantes
function isInside(clickX, clickY, interactionZone) {
	return clickX >= interactionZone.x &&
		clickX <= interactionZone.x + interactionZone.width &&
		clickY >= interactionZone.y &&
		clickY <= interactionZone.y + interactionZone.height
}

// 5. Control de Inputs y Eventos
canvas.addEventListener("mousemove", (event) => {
	const rect = canvas.getBoundingClientRect()
	mouseX = Math.floor(event.clientX - rect.left)
	mouseY = Math.floor(event.clientY - rect.top)
})

canvas.addEventListener("click", (event) => {
	const rect = canvas.getBoundingClientRect()
	const clickX = event.clientX - rect.left
	const clickY = event.clientY - rect.top

	const currentRoomInteractions = roomInteractions[currentRoom]

	if (currentRoomInteractions) {
		currentRoomInteractions.forEach(interactionZone => {
			if (isInside(clickX, clickY, interactionZone)) {
				interactionZone.action()
			}
		})
	}
})

// 6. Sistema de Renderizado e Interfaz de Usuario
function drawMouseCoordinates() {
	drawInGame.fillStyle = "white"
	drawInGame.font = "14px Arial"
	drawInGame.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20)
}

function draw() {
	switch (currentRoom) {
		case ROOM.START: // <-- NUEVO CASO
			if (roomStart.complete) {
				// 1. Limpiamos el fondo con negro
				drawInGame.fillStyle = "black"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)

				// 2. Calculamos el ajuste y centrado proporcional de la imagen
				const scale = Math.min(
					canvas.width / roomStart.width,
					canvas.height / roomStart.height
				)
				const newWidth = roomStart.width * scale
				const newHeight = roomStart.height * scale
				const x = (canvas.width - newWidth) / 2
				const y = (canvas.height - newHeight) / 2

				drawInGame.drawImage(roomStart, x, y, newWidth, newHeight)
				// ==============================================================
				// DIBUJAR BOTONES DEL MENÚ PRINCIPAL
				// ==============================================================
				const btnJugar = roomInteractions[ROOM.START][0]
				const btnOpciones = roomInteractions[ROOM.START][1]
				const bevel = 8 // Tamaño del bisel en las esquinas

				// --- DETECCIÓN DE HOVER USANDO TU FUNCIÓN ISINSIDE ---
				const isHoverBtn1 = isInside(mouseX, mouseY, btnJugar)
				const isHoverBtn2 = isInside(mouseX, mouseY, btnOpciones)

				// Ajustes de texto para los botones
				drawInGame.textAlign = "center"
				drawInGame.textBaseline = "middle"
				drawInGame.font = "16px 'Times New Roman', serif"

				// --- 1. DIBUJAR BOTÓN JUGAR ---
				drawInGame.beginPath()
				drawInGame.moveTo(btnJugar.x + bevel, btnJugar.y)
				drawInGame.lineTo(btnJugar.x + btnJugar.width - bevel, btnJugar.y)
				drawInGame.lineTo(btnJugar.x + btnJugar.width, btnJugar.y + bevel)
				drawInGame.lineTo(btnJugar.x + btnJugar.width, btnJugar.y + btnJugar.height - bevel)
				drawInGame.lineTo(btnJugar.x + btnJugar.width - bevel, btnJugar.y + btnJugar.height)
				drawInGame.lineTo(btnJugar.x + bevel, btnJugar.y + btnJugar.height)
				drawInGame.lineTo(btnJugar.x, btnJugar.y + btnJugar.height - bevel)
				drawInGame.lineTo(btnJugar.x, btnJugar.y + bevel)
				drawInGame.closePath()

				// Colores si tiene el cursor encima o no
				drawInGame.fillStyle = isHoverBtn1 ? "#241a16" : "#1a1310"
				drawInGame.fill()
				drawInGame.strokeStyle = isHoverBtn1 ? "#d1ab7e" : "#8c6f4f"
				drawInGame.lineWidth = isHoverBtn1 ? 2 : 1.5
				drawInGame.stroke()

				// Texto de JUGAR
				drawInGame.fillStyle = isHoverBtn1 ? "#e8d8c3" : "#a89276"
				drawInGame.fillText("JUGAR", canvas.width / 2, btnJugar.y + btnJugar.height / 2)

				// --- 2. DIBUJAR BOTÓN OPCIONES ---
				drawInGame.beginPath()
				drawInGame.moveTo(btnOpciones.x + bevel, btnOpciones.y)
				drawInGame.lineTo(btnOpciones.x + btnOpciones.width - bevel, btnOpciones.y)
				drawInGame.lineTo(btnOpciones.x + btnOpciones.width, btnOpciones.y + bevel)
				drawInGame.lineTo(btnOpciones.x + btnOpciones.width, btnOpciones.y + btnOpciones.height - bevel)
				drawInGame.lineTo(btnOpciones.x + btnOpciones.width - bevel, btnOpciones.y + btnOpciones.height)
				drawInGame.lineTo(btnOpciones.x + bevel, btnOpciones.y + btnOpciones.height)
				drawInGame.lineTo(btnOpciones.x, btnOpciones.y + btnOpciones.height - bevel)
				drawInGame.lineTo(btnOpciones.x, btnOpciones.y + bevel)
				drawInGame.closePath()

				// Colores si tiene el cursor encima o no
				drawInGame.fillStyle = isHoverBtn2 ? "#241a16" : "#1a1310"
				drawInGame.fill()
				drawInGame.strokeStyle = isHoverBtn2 ? "#d1ab7e" : "#8c6f4f"
				drawInGame.lineWidth = isHoverBtn2 ? 2 : 1.5
				drawInGame.stroke()

				// Texto de OPCIONES
				drawInGame.fillStyle = isHoverBtn2 ? "#e8d8c3" : "#a89276"
				drawInGame.fillText("OPCIONES", canvas.width / 2, btnOpciones.y + btnOpciones.height / 2)

				if (isOptionsOpen) {
					const modalWidth = 300
					const modalHeight = 220
					const modalX = canvas.width / 2 - modalWidth / 2
					const modalY = canvas.height / 2 - modalHeight / 2
					const mBevel = 12

					// --- 1. MARCO DEL MODAL ---
					drawInGame.beginPath()
					drawInGame.moveTo(modalX + mBevel, modalY)
					drawInGame.lineTo(modalX + modalWidth - mBevel, modalY)
					drawInGame.lineTo(modalX + modalWidth, modalY + mBevel)
					drawInGame.lineTo(modalX + modalWidth, modalY + modalHeight - mBevel)
					drawInGame.lineTo(modalX + modalWidth - mBevel, modalY + modalHeight)
					drawInGame.lineTo(modalX + mBevel, modalY + modalHeight)
					drawInGame.lineTo(modalX, modalY + modalHeight - mBevel)
					drawInGame.lineTo(modalX, modalY + mBevel)
					drawInGame.closePath()

					drawInGame.fillStyle = "rgba(18, 13, 11, 0.95)"
					drawInGame.fill()
					drawInGame.strokeStyle = "#8c6f4f"
					drawInGame.lineWidth = 2
					drawInGame.stroke()

					// Título del Modal
					drawInGame.fillStyle = "#e8d8c3"
					drawInGame.font = "bold 18px 'Times New Roman', serif"
					drawInGame.fillText("SONIDO", canvas.width / 2, modalY + 30)

					// Zonas del modal para los hovers y botones
					const modalZones = getModalInteractions()
					const btnAudioZone = modalZones[0]
					const btnVolverZone = modalZones[1]

					const isHoverAudio = isInside(mouseX, mouseY, btnAudioZone)
					const isHoverVolver = isInside(mouseX, mouseY, btnVolverZone)

					// --- 2. BOTÓN AUDIO (Mute/Unmute) ---
					drawInGame.beginPath()
					drawInGame.moveTo(btnAudioZone.x + 6, btnAudioZone.y)
					drawInGame.lineTo(btnAudioZone.x + btnAudioZone.width - 6, btnAudioZone.y)
					drawInGame.lineTo(btnAudioZone.x + btnAudioZone.width, btnAudioZone.y + 6)
					drawInGame.lineTo(btnAudioZone.x + btnAudioZone.width, btnAudioZone.y + btnAudioZone.height - 6)
					drawInGame.lineTo(btnAudioZone.x + btnAudioZone.width - 6, btnAudioZone.y + btnAudioZone.height)
					drawInGame.lineTo(btnAudioZone.x + 6, btnAudioZone.y + btnAudioZone.height)
					drawInGame.lineTo(btnAudioZone.x, btnAudioZone.y + btnAudioZone.height - 6)
					drawInGame.lineTo(btnAudioZone.x, btnAudioZone.y + 6)
					drawInGame.closePath()

					drawInGame.fillStyle = isHoverAudio ? "#241a16" : "#1a1310"
					drawInGame.fill()
					drawInGame.strokeStyle = isHoverAudio ? "#d1ab7e" : "#8c6f4f"
					drawInGame.lineWidth = 1.5
					drawInGame.stroke()

					drawInGame.fillStyle = isHoverAudio ? "#e8d8c3" : "#a89276"
					drawInGame.font = "14px 'Times New Roman', serif"
					const textoMusica = isMusicMuted ? "MÚSICA: OFF" : "MÚSICA: ON"
					drawInGame.fillText(textoMusica, canvas.width / 2, btnAudioZone.y + btnAudioZone.height / 2)

					// --- 3. BOTÓN VOLVER ---
					drawInGame.beginPath()
					drawInGame.moveTo(btnVolverZone.x + 6, btnVolverZone.y)
					drawInGame.lineTo(btnVolverZone.x + btnVolverZone.width - 6, btnVolverZone.y)
					drawInGame.lineTo(btnVolverZone.x + btnVolverZone.width, btnVolverZone.y + 6)
					drawInGame.lineTo(btnVolverZone.x + btnVolverZone.width, btnVolverZone.y + btnVolverZone.height - 6)
					drawInGame.lineTo(btnVolverZone.x + btnVolverZone.width - 6, btnVolverZone.y + btnVolverZone.height)
					drawInGame.lineTo(btnVolverZone.x + 6, btnVolverZone.y + btnVolverZone.height)
					drawInGame.lineTo(btnVolverZone.x, btnVolverZone.y + btnVolverZone.height - 6)
					drawInGame.lineTo(btnVolverZone.x, btnVolverZone.y + 6)
					drawInGame.closePath()

					drawInGame.fillStyle = isHoverVolver ? "#241a16" : "#1a1310"
					drawInGame.fill()
					drawInGame.strokeStyle = isHoverVolver ? "#d1ab7e" : "#8c6f4f"
					drawInGame.stroke()

					drawInGame.fillStyle = isHoverVolver ? "#e8d8c3" : "#a89276"
					drawInGame.fillText("VOLVER", canvas.width / 2, btnVolverZone.y + btnVolverZone.height / 2)
				}

				// Restauramos la alineación de texto para no romper el resto del juego
				drawInGame.textAlign = "left"
				drawInGame.textBaseline = "alphabetic"

			} else {
				drawInGame.fillStyle = "#121212"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)
			}
			break

		case ROOM.ONE:
			if (roomOne.complete) {
				drawInGame.drawImage(roomOne, 0, 0, canvas.width, canvas.height)
			} else {
				drawInGame.fillStyle = "#2d2d2d"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)
			}
			break

		case ROOM.TWO:
			if (roomTwo.complete) {
				drawInGame.drawImage(roomTwo, 0, 0, canvas.width, canvas.height)
			} else {
				drawInGame.fillStyle = "#1e3a5f"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)
			}
			break

		case ROOM.THREE:
			if (roomThree.complete) {
				drawInGame.drawImage(roomThree, 0, 0, canvas.width, canvas.height)
			} else {
				drawInGame.fillStyle = "#4b2e1e"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)
			}
			break

		case ROOM.FOUR:
			if (roomFour.complete) {
				drawInGame.drawImage(roomFour, 0, 0, canvas.width, canvas.height)
			} else {
				drawInGame.fillStyle = "#245b3b"
				drawInGame.fillRect(0, 0, canvas.width, canvas.height)
			}
			break
	}

	drawInGame.fillStyle = "white"

	if (currentRoom === ROOM.ONE) {
		drawInGame.beginPath()
		drawInGame.moveTo(5, canvas.height / 2)
		drawInGame.lineTo(35, canvas.height / 2 - 30)
		drawInGame.lineTo(35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()

		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width - 5, canvas.height / 2)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 - 30)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()

		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width / 2, 5)
		drawInGame.lineTo(canvas.width / 2 - 30, 35)
		drawInGame.lineTo(canvas.width / 2 + 30, 35)
		drawInGame.closePath()
		drawInGame.fill()
	}

	if (currentRoom === ROOM.TWO) {
		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width - 5, canvas.height / 2)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 - 30)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()
	}

	if (currentRoom === ROOM.THREE) {
		drawInGame.beginPath()
		drawInGame.moveTo(5, canvas.height / 2)
		drawInGame.lineTo(35, canvas.height / 2 - 30)
		drawInGame.lineTo(35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()
	}

	if (currentRoom === ROOM.FOUR) {
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