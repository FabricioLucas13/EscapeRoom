// =========================================================================
// 🚀 ¿CÓMO AÑADIR NUEVAS FUNCIONES VISUALES? (Guía rápida para el equipo)
// =========================================================================
//
// ➡️ SI QUIERES CAMBIAR EL DISEÑO DE LAS ESQUINAS DE LOS BOTONES:
//    - Modifica las líneas con ".lineTo" dentro de "drawBeveledButton".
//    - Esto cambiará el aspecto de todos los botones del juego automáticamente.
//
// ➡️ SI QUIERES AÑADIR FLECHAS HACIA LA IZQUIERDA O DERECHA:
//    - Añade un nuevo "else if (direction === 'LEFT')" dentro de "drawNavigationArrow".
//    - Usa las variables "centerX" y "arrowTipY" para dibujar el nuevo triángulo.
//
// =========================================================================

// 🎯 COMPROBAR SI EL RATÓN ESTÁ ENCIMA DE UN BOTÓN (Detectar clics y hovers)
// Esta función mira si la X y la Y del ratón están metidas dentro del rectángulo del botón.
export function isMouseInsideZone(inputX, inputY, interactionZone) {
	return inputX >= interactionZone.x &&
		inputX <= interactionZone.x + interactionZone.width &&
		inputY >= interactionZone.y &&
		inputY <= interactionZone.y + interactionZone.height
}

// 🖌️ DIBUJAR UN BOTÓN CON ESQUINAS DIAGONALES (Estilo Medieval)
// Pinta el botón, cambia su color si el ratón está encima y centra el texto automáticamente.
export function drawBeveledButton(canvasContext, canvasElement, INTERFACE_COLORS, buttonZone, isHovered, textLabel, bevelSize = 8) {
	// 1. Dibujamos las líneas que forman el contorno con las esquinas cortadas
	canvasContext.beginPath()
	canvasContext.moveTo(buttonZone.x + bevelSize, buttonZone.y)
	canvasContext.lineTo(buttonZone.x + buttonZone.width - bevelSize, buttonZone.y)
	canvasContext.lineTo(buttonZone.x + buttonZone.width, buttonZone.y + bevelSize)
	canvasContext.lineTo(buttonZone.x + buttonZone.width, buttonZone.y + buttonZone.height - bevelSize)
	canvasContext.lineTo(buttonZone.x + buttonZone.width - bevelSize, buttonZone.y + buttonZone.height)
	canvasContext.lineTo(buttonZone.x + bevelSize, buttonZone.y + buttonZone.height)
	canvasContext.lineTo(buttonZone.x, buttonZone.y + buttonZone.height - bevelSize)
	canvasContext.lineTo(buttonZone.x, buttonZone.y + bevelSize)
	canvasContext.closePath()

	// 2. Elegimos el color de fondo y del borde según si el jugador tiene el ratón encima o no
	canvasContext.fillStyle = isHovered ? INTERFACE_COLORS.BUTTON_BACKGROUND_HOVER : INTERFACE_COLORS.BUTTON_BACKGROUND_DEFAULT
	canvasContext.fill()
	canvasContext.strokeStyle = isHovered ? INTERFACE_COLORS.BUTTON_BORDER_HOVER : INTERFACE_COLORS.BUTTON_BORDER_DEFAULT
	canvasContext.lineWidth = isHovered ? 2 : 1.5
	canvasContext.stroke()

	// 3. Pintamos las letras justo en el centro del botón
	canvasContext.fillStyle = isHovered ? INTERFACE_COLORS.BUTTON_TEXT_HOVER : INTERFACE_COLORS.BUTTON_TEXT_DEFAULT
	canvasContext.fillText(textLabel, buttonZone.x + buttonZone.width / 2, buttonZone.y + buttonZone.height / 2)
}

// 🖼️ ADAPTAR LA IMAGEN DE FONDO (Para el Menú de Inicio)
// Hace que la imagen encaje bien y se centre en el lienzo sin deformarse ni estirarse feo.
export function drawProportionalBackground(canvasContext, canvasElement, backgroundImage) {
	// Pintamos todo el fondo de negro por si sobran huecos a los lados
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// Calculamos el tamaño ideal para que la imagen quepa entera sin romperse
	const scaleFactor = Math.min(canvasElement.width / backgroundImage.width, canvasElement.height / backgroundImage.height)
	const renderWidth = backgroundImage.width * scaleFactor
	const renderHeight = backgroundImage.height * scaleFactor

	// Dibujamos la foto bien centrada en la pantalla
	canvasContext.drawImage(
		backgroundImage,
		(canvasElement.width - renderWidth) / 2,
		(canvasElement.height - renderHeight) / 2,
		renderWidth,
		renderHeight
	)
}

// 🗺️ PONER LA IMAGEN DE UNA HABITACIÓN
// Dibuja la foto de la sala a pantalla completa. Si la foto no carga, usa el color de seguridad.
export function drawStandardRoomBackground(canvasContext, canvasElement, roomImage, fallbackColor) {
	if (roomImage.complete) {
		canvasContext.drawImage(roomImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = fallbackColor
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}
}

// 📐 DIBUJAR LAS FLECHAS DE NAVEGACIÓN (Triángulos blancos)
// Dibuja un triángulo equilátero que apunta hacia arriba ("UP") o hacia abajo ("DOWN").
export function drawNavigationArrow(canvasContext, canvasElement, arrowSize, direction, arrowTipY) {
	const centerX = canvasElement.width / 2 // Buscamos el centro exacto de la pantalla
	canvasContext.fillStyle = "white"
	canvasContext.beginPath()

	// Dibujamos el triángulo según la dirección que le hayamos pedido
	if (direction === "UP") {
		canvasContext.moveTo(centerX, arrowTipY)
		canvasContext.lineTo(centerX - arrowSize, arrowTipY + arrowSize)
		canvasContext.lineTo(centerX + arrowSize, arrowTipY + arrowSize)
	} else if (direction === "DOWN") {
		canvasContext.moveTo(centerX, arrowTipY)
		canvasContext.lineTo(centerX - arrowSize, arrowTipY - arrowSize)
		canvasContext.lineTo(centerX + arrowSize, arrowTipY - arrowSize)
	}

	canvasContext.closePath()
	canvasContext.fill()
}
