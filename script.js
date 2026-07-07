const canvas = document.getElementById("game-screen")
const drawInGame = canvas.getContext("2d")

let mouseX = 0
let mouseY = 0

// 1. Estados del Juego y Constantes
const ROOM = {
    ONE: 1, 
    TWO: 2, 
    THREE: 3,
    FOUR: 4
}

let currentRoom = ROOM.ONE

// --- FUNCIONES DE ACCIÓN PARA LAS INTERACCIONES ---
// Aquí es donde meterás la lógica real de lo que pasa al interactuar
function changeRoom(targetRoom) {
    currentRoom = targetRoom
}

function openExitKeypad() {
    console.log("Haz hecho click donde en el keypad")
}


// 2. Estructura de Datos: Mapa de Interacciones
const roomInteractions = {
    [ROOM.ONE]: [
        { x: 0, y: canvas.height / 2 - 35, width: 40, height: 70, action: () => changeRoom(ROOM.TWO) },
        { x: canvas.width - 40, y: canvas.height / 2 - 35, width: 40, height: 70, action: () => changeRoom(ROOM.THREE) },
        { x: canvas.width / 2 - 35, y: 0, width: 70, height: 40, action: () => changeRoom(ROOM.FOUR) }
    ],
    [ROOM.TWO]: [
        { x: canvas.width - 40, y: canvas.height / 2 - 35, width: 40, height: 70, action: () => changeRoom(ROOM.ONE) }
    ],
    [ROOM.THREE]: [
        { x: 0, y: canvas.height / 2 - 35, width: 40, height: 70, action: () => changeRoom(ROOM.ONE) }
    ],
    [ROOM.FOUR]: [
        { x: canvas.width / 2 - 35, y: canvas.height - 40, width: 70, height: 40, action: () => changeRoom(ROOM.ONE) },
        { x: 490, y: 235, width: 140, height: 185, action: () => openExitKeypad() }
    ]
}

// 3. Carga de Imágenes (Assets)
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