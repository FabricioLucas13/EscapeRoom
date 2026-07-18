import { INTERFACE_COLORS } from "./config.js"

// 🎯 COMPROBAR SI EL RATÓN ESTÁ ENCIMA DE UN BOTÓN (Detectar clics y hovers)
export function isMouseInsideZone(inputX, inputY, interactionZone) {
	return inputX >= interactionZone.x &&
		inputX <= interactionZone.x + interactionZone.width &&
		inputY >= interactionZone.y &&
		inputY <= interactionZone.y + interactionZone.height
}

// 🖌️ DIBUJAR UN BOTÓN CON ESQUINAS DIAGONALES (Estilo Medieval)
export function drawBeveledButton(canvasContext, canvasElement, colorsObject, buttonZone, isHovered, textLabel, bevelSize = 8) {
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

	canvasContext.fillStyle = isHovered ? colorsObject.BUTTON_BACKGROUND_HOVER : colorsObject.BUTTON_BACKGROUND_DEFAULT
	canvasContext.fill()
	canvasContext.strokeStyle = isHovered ? colorsObject.BUTTON_BORDER_HOVER : colorsObject.BUTTON_BORDER_DEFAULT
	canvasContext.lineWidth = isHovered ? 2 : 1.5
	canvasContext.stroke()

	canvasContext.fillStyle = isHovered ? colorsObject.BUTTON_TEXT_HOVER : colorsObject.BUTTON_TEXT_DEFAULT
	canvasContext.fillText(textLabel, buttonZone.x + buttonZone.width / 2, buttonZone.y + buttonZone.height / 2)
}

// 🖼️ ADAPTAR LA IMAGEN DE FONDO (Para el Menú de Inicio)
export function drawProportionalBackground(canvasContext, canvasElement, backgroundImage) {
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	const scaleFactor = Math.min(canvasElement.width / backgroundImage.width, canvasElement.height / backgroundImage.height)
	const renderWidth = backgroundImage.width * scaleFactor
	const renderHeight = backgroundImage.height * scaleFactor

	canvasContext.drawImage(
		backgroundImage,
		(canvasElement.width - renderWidth) / 2,
		(canvasElement.height - renderHeight) / 2,
		renderWidth,
		renderHeight
	)
}

// 🗺️ PONER LA IMAGEN DE UNA HABITACIÓN
export function drawStandardRoomBackground(canvasContext, canvasElement, roomImage, fallbackColor) {
	if (roomImage.complete) {
		canvasContext.drawImage(roomImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = fallbackColor
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}
}

// 📐 DIBUJAR LAS FLECHAS DE NAVEGACIÓN (Triángulos de Color Centralizado)
export function drawNavigationArrow(canvasContext, canvasElement, arrowSize, direction, arrowTipY) {
	const centerX = canvasElement.width / 2 
	canvasContext.fillStyle = INTERFACE_COLORS.NAVIGATION_ARROW // 🧹 OPTIMIZADO: Ahora usa el color del config.js
	canvasContext.beginPath()

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
