// ==========================================================
// ESCAPE ROOM - PROTOTIPO
//
// Este proyecto es un point & click sencillo.
//
// Distribución de las salas:
//
//             [ Sala 4 ]
//                 ↑
//                 │
// [ Sala 2 ] ← [ Sala 1 ] → [ Sala 3 ]
//
// De momento:
// - Cada sala tiene un color distinto.
// - Las flechas permiten navegar entre salas.
// - Se muestran las coordenadas del ratón para desarrollo.
//
// Más adelante:
// [ ] Sustituir colores por imágenes.
// [ ] Añadir objetos interactivos.
// [ ] Añadir puzles.
// [ ] Añadir sonidos.
// [ ] Añadir la salida final.
//
// ==========================================================


// ==========================================================
// CONFIGURACIÓN DEL JUEGO
// ==========================================================

// Canvas principal
const canvas = document.getElementById("game-screen")
const drawInGame = canvas.getContext("2d")

// Coordenadas del ratón (solo para desarrollo)
let mouseX = 0
let mouseY = 0

// Sala actual
// 1 = Centro
// 2 = Izquierda
// 3 = Derecha
// 4 = Arriba
let currentRoom = 1

// Imágenes de las salas

const roomOne = new Image();
roomOne.src = "assets/roomOne.jpg";

const roomTwo = new Image();
roomTwo.src = "assets/roomTwo.jpg";

const roomThree = new Image();
roomThree.src = "assets/roomThree.jpg";

const roomFour = new Image();
roomFour.src = "assets/roomFour.jpg";


// ==========================================================
// FUTURO:
//
// Aquí se cargarán todas las imágenes.
//
// Ejemplo:
//
// const room1 = new Image()
// room1.src = "img/room1.png"
//
// const room2 = new Image()
// room2.src = "img/room2.png"
//
// También se cargarán:
//
// - Objetos
// - Flechas
// - Animaciones
//
// ==========================================================


// ==========================================================
// POSICIÓN DEL RATÓN
// ==========================================================

canvas.addEventListener("mousemove", (event) => {

	const rect = canvas.getBoundingClientRect()

	mouseX = Math.floor(event.clientX - rect.left)
	mouseY = Math.floor(event.clientY - rect.top)

})


// ==========================================================
// DETECCIÓN DE CLICS
//
// Aquí irá toda la lógica del juego:
//
// - Cambiar de sala.
// - Objetos.
// - Puzles.
// - Llaves.
// - Puertas.
// ==========================================================

canvas.addEventListener("click", (event) => {

	const rect = canvas.getBoundingClientRect()

	const clickX = event.clientX - rect.left
	const clickY = event.clientY - rect.top

	// Sala 1 -> Sala 2 (izquierda)
	if (
		currentRoom === 1 &&
		clickX >= 0 &&
		clickX <= 40 &&
		clickY >= canvas.height / 2 - 35 &&
		clickY <= canvas.height / 2 + 35
	) {
		currentRoom = 2
	}

	// Sala 2 -> Sala 1 (derecha)
	else if (
		currentRoom === 2 &&
		clickX >= canvas.width - 40 &&
		clickX <= canvas.width &&
		clickY >= canvas.height / 2 - 35 &&
		clickY <= canvas.height / 2 + 35
	) {
		currentRoom = 1
	}

	// Sala 1 -> Sala 3 (derecha)
	else if (
		currentRoom === 1 &&
		clickX >= canvas.width - 40 &&
		clickX <= canvas.width &&
		clickY >= canvas.height / 2 - 35 &&
		clickY <= canvas.height / 2 + 35
	) {
		currentRoom = 3
	}

	// Sala 3 -> Sala 1 (izquierda)
	else if (
		currentRoom === 3 &&
		clickX >= 0 &&
		clickX <= 40 &&
		clickY >= canvas.height / 2 - 35 &&
		clickY <= canvas.height / 2 + 35
	) {
		currentRoom = 1
	}

	// Sala 1 -> Sala 4 (arriba)
	else if (
		currentRoom === 1 &&
		clickX >= canvas.width / 2 - 35 &&
		clickX <= canvas.width / 2 + 35 &&
		clickY >= 0 &&
		clickY <= 40
	) {
		currentRoom = 4
	}

	// Sala 4 -> Sala 1 (abajo)
	else if (
		currentRoom === 4 &&
		clickX >= canvas.width / 2 - 35 &&
		clickX <= canvas.width / 2 + 35 &&
		clickY >= canvas.height - 40 &&
		clickY <= canvas.height
	) {
		currentRoom = 1
	}

})


// ==========================================================
// MUESTRA LAS COORDENADAS DEL RATÓN
//
// SOLO PARA DESARROLLO.
//
// Borrar al terminar el proyecto.
// ==========================================================

function drawMouseCoordinates() {

	drawInGame.fillStyle = "white"
	drawInGame.font = "14px Arial"

	drawInGame.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20)

}


// ==========================================================
// DIBUJAR EL JUEGO
//
// Este método se ejecuta continuamente.
//
// Se encarga de:
//
// - Dibujar la sala.
// - Dibujar objetos.
// - Dibujar flechas.
// - Dibujar interfaz.
//
// ==========================================================

function draw() {

	// ======================================================
	// FONDO DE CADA SALA
	//
	// De momento se utilizan colores.
	//
	// Más adelante sustituir por:
	//
	// drawInGame.drawImage(room1, 0, 0)
	// ======================================================

	switch (currentRoom) {

		case 1:
			if (roomTwo.complete) {
				drawInGame.drawImage(roomOne, 0, 0, canvas.width, canvas.height);
			} else
			{drawInGame.fillStyle = "#2d2d2d";
			drawInGame.fillRect(0, 0, canvas.width, canvas.height);}
			break;

		case 2:
			if (roomTwo.complete) {
				drawInGame.drawImage(roomTwo, 0, 0, canvas.width, canvas.height);
			} else {
				drawInGame.fillStyle = "#1e3a5f";
				drawInGame.fillRect(0, 0, canvas.width, canvas.height);
			}
			break;

		case 3:
			if (roomThree.complete) {
				drawInGame.drawImage(roomThree, 0, 0, canvas.width, canvas.height);
			} else {
				drawInGame.fillStyle = "#4b2e1e";
				drawInGame.fillRect(0, 0, canvas.width, canvas.height);
			}
			break;

		case 4:
			if (roomFour.complete) {
				drawInGame.drawImage(roomFour, 0, 0, canvas.width, canvas.height);
			} else {
				drawInGame.fillStyle = "#245b3b";
				drawInGame.fillRect(0, 0, canvas.width, canvas.height);
			}
			break;
	}


	// ======================================================
	// FLECHAS DE NAVEGACIÓN
	//
	// De momento son triángulos.
	//
	// Más adelante sustituir por imágenes PNG.
	// ======================================================

  drawInGame.fillStyle = "white";

	// ---------------- SALA 1 ----------------
	//
	// Sala central.
	//
	// Aquí irán:
	//
	// - Imagen de fondo.
	// - Objetos.
	// - Puzles.
	// - Decoración.
	//

	if (currentRoom === 1) {

		// Flecha izquierda
		drawInGame.beginPath()
		drawInGame.moveTo(5, canvas.height / 2)
		drawInGame.lineTo(35, canvas.height / 2 - 30)
		drawInGame.lineTo(35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()

		// Flecha derecha
		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width - 5, canvas.height / 2)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 - 30)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()

		// Flecha arriba
		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width / 2, 5)
		drawInGame.lineTo(canvas.width / 2 - 30, 35)
		drawInGame.lineTo(canvas.width / 2 + 30, 35)
		drawInGame.closePath()
		drawInGame.fill()
	}


	// ---------------- SALA 2 ----------------
	//
	// Sala izquierda.
	//
	// Aquí irá la imagen y sus objetos.
	//

	if (currentRoom === 2) {

		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width - 5, canvas.height / 2)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 - 30)
		drawInGame.lineTo(canvas.width - 35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()

	}


	// ---------------- SALA 3 ----------------
	//
	// Sala derecha.
	//
	// Aquí irá la imagen y sus objetos.
	//

	if (currentRoom === 3) {

		drawInGame.beginPath()
		drawInGame.moveTo(5, canvas.height / 2)
		drawInGame.lineTo(35, canvas.height / 2 - 30)
		drawInGame.lineTo(35, canvas.height / 2 + 30)
		drawInGame.closePath()
		drawInGame.fill()

	}


	// ---------------- SALA 4 ----------------
	//
	// Sala superior.
	//
	// Aquí irá la imagen y sus objetos.
	//

	if (currentRoom === 4) {

		drawInGame.beginPath()
		drawInGame.moveTo(canvas.width / 2, canvas.height - 5)
		drawInGame.lineTo(canvas.width / 2 - 30, canvas.height - 35)
		drawInGame.lineTo(canvas.width / 2 + 30, canvas.height - 35)
		drawInGame.closePath()
		drawInGame.fill()

	}


	// Coordenadas del ratón (desarrollo)
	drawMouseCoordinates()

	// Actualiza la pantalla continuamente
	requestAnimationFrame(draw)

}


// ==========================================================
// INICIO DEL JUEGO
// ==========================================================

draw()