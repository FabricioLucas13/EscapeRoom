import { INTERFACE_COLORS } from "./config.js"

// 🎯 COMPROBAR SI EL RATÓN ESTÁ ENCIMA DE UN BOTÓN (Detectar clics y hovers)
export function isMouseInsideZone(mouseX, mouseY, interactionZone) {
	return mouseX >= interactionZone.x &&
		mouseX <= interactionZone.x + interactionZone.width &&
		mouseY >= interactionZone.y &&
		mouseY <= interactionZone.y + interactionZone.height
}

// 🖌️ DIBUJAR UN BOTÓN CON ESQUINAS DIAGONALES (Estilo Medieval)
export function drawBeveledButton(canvasContext, canvasElement, interfaceColors, button, isHovered, buttonText, bevelSize = 8) {
	canvasContext.beginPath()
	canvasContext.moveTo(button.x + bevelSize, button.y)
	canvasContext.lineTo(button.x + button.width - bevelSize, button.y)
	canvasContext.lineTo(button.x + button.width, button.y + bevelSize)
	canvasContext.lineTo(button.x + button.width, button.y + button.height - bevelSize)
	canvasContext.lineTo(button.x + button.width - bevelSize, button.y + button.height)
	canvasContext.lineTo(button.x + bevelSize, button.y + button.height)
	canvasContext.lineTo(button.x, button.y + button.height - bevelSize)
	canvasContext.lineTo(button.x, button.y + bevelSize)
	canvasContext.closePath()

	canvasContext.fillStyle = isHovered ? interfaceColors.BUTTON_BACKGROUND_HOVER : interfaceColors.BUTTON_BACKGROUND_DEFAULT
	canvasContext.fill()
	canvasContext.strokeStyle = isHovered ? interfaceColors.BUTTON_BORDER_HOVER : interfaceColors.BUTTON_BORDER_DEFAULT
	canvasContext.lineWidth = isHovered ? 2 : 1.5
	canvasContext.stroke()

	canvasContext.fillStyle = isHovered ? interfaceColors.BUTTON_TEXT_HOVER : interfaceColors.BUTTON_TEXT_DEFAULT
	canvasContext.fillText(buttonText, button.x + button.width / 2, button.y + button.height / 2)
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
export function drawNavigationArrow(canvasContext, canvasElement, arrowSize, direction, arrowTipY, customX = null) {
	// 🛠️ MODIFICADO: Si customX tiene un número, usa ese. Si es null, calcula el centro de la pantalla de forma automática.
	const targetX = customX !== null ? customX : (canvasElement.width / 2)
	
	canvasContext.fillStyle = INTERFACE_COLORS.NAVIGATION_ARROW 
	canvasContext.beginPath()

	if (direction === "UP") {
		canvasContext.moveTo(targetX, arrowTipY)
		canvasContext.lineTo(targetX - arrowSize, arrowTipY + arrowSize)
		canvasContext.lineTo(targetX + arrowSize, arrowTipY + arrowSize)
	} else if (direction === "DOWN") {
		canvasContext.moveTo(targetX, arrowTipY)
		canvasContext.lineTo(targetX - arrowSize, arrowTipY - arrowSize)
		canvasContext.lineTo(targetX + arrowSize, arrowTipY - arrowSize)
	}

	canvasContext.closePath()
	canvasContext.fill()
}
