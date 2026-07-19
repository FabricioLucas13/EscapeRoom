import { INTERFACE_DIMENSIONS, INTERFACE_COLORS, INTERFACE_FONTS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getKeypadInteractions } from "./interactions.js"
import { drawDialogBox } from "./dialogBox.js"

/**
 * 🖲️ DIBUJAR EL TECLADO NUMÉRICO (Componente Autónomo)
 * Delegamos todo el renderizado visual que antes saturaba el main.js
 */
export function drawKeypadPuzzle(canvasContext, canvasElement, gameState, gameImages) {
	const keypadWidth = INTERFACE_DIMENSIONS.KEYPAD_WIDTH || 270
	const keypadHeight = INTERFACE_DIMENSIONS.KEYPAD_HEIGHT || 380
	const keypadLeftX = canvasElement.width / 2 - keypadWidth / 2
	const keypadTopY = canvasElement.height / 2 - keypadHeight / 2
	const cornerBevel = INTERFACE_DIMENSIONS.KEYPAD_PANEL_CORNER_BEVEL

	// 1. Fondo oscuro translúcido (El .overlay de CSS)
	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_OVERLAY
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. El panel con esquinas biseladas (El .panel de CSS)
	canvasContext.beginPath()
	canvasContext.moveTo(keypadLeftX + cornerBevel, keypadTopY)
	canvasContext.lineTo(keypadLeftX + keypadWidth - cornerBevel, keypadTopY)
	canvasContext.lineTo(keypadLeftX + keypadWidth, keypadTopY + cornerBevel)
	canvasContext.lineTo(keypadLeftX + keypadWidth, keypadTopY + keypadHeight - cornerBevel)
	canvasContext.lineTo(keypadLeftX + keypadWidth - cornerBevel, keypadTopY + keypadHeight)
	canvasContext.lineTo(keypadLeftX + cornerBevel, keypadTopY + keypadHeight)
	canvasContext.lineTo(keypadLeftX, keypadTopY + keypadHeight - cornerBevel)
	canvasContext.lineTo(keypadLeftX, keypadTopY + cornerBevel)
	canvasContext.closePath()

	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_PANEL_BACKGROUND
	canvasContext.fill()
	canvasContext.strokeStyle = INTERFACE_COLORS.KEYPAD_PANEL_BORDER
	canvasContext.lineWidth = 2
	canvasContext.stroke()

	// Configuración base de textos para el cuadro
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "middle"

	// 3. Título 
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
	canvasContext.font = INTERFACE_FONTS.KEYPAD_TITLE
	canvasContext.fillText("DANOS TU CÓDIGO", canvasElement.width / 2, keypadTopY + INTERFACE_DIMENSIONS.KEYPAD_TITLE_Y_OFFSET)

	// 4. Pantalla digital con puntos y guiones (.screen)
	let maskedInputText = gameState.keypadInput.replace(/./g, "•")
	maskedInputText = maskedInputText.padEnd(3, "-")

	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_SCREEN_TEXT
	canvasContext.font = INTERFACE_FONTS.KEYPAD_SCREEN
	canvasContext.fillText(maskedInputText, canvasElement.width / 2, keypadTopY + INTERFACE_DIMENSIONS.KEYPAD_SCREEN_Y_OFFSET)

	// 5. Dibujar los botones del teclado numérico (La cruz visual ha sido eliminada)
	const keypadButtonZones = getKeypadInteractions(canvasElement)
	
	keypadButtonZones.forEach(zone => {
		const isHovered = isMouseInsideZone(gameState.mouseX, gameState.mouseY, zone)
		let buttonColors = { ...INTERFACE_COLORS }
		let currentButtonLabel = zone.label
		
		if (zone.label === "←") {
			buttonColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_RESET_BACKGROUND
			buttonColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_RESET_TEXT
			currentButtonLabel = "←" // 🛠️ MODIFICADO: Ahora el botón rojo dice CLOSE en lugar de la flecha
		} else if (zone.label === "✓") {
			buttonColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_CHECK_BACKGROUND
			buttonColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_CHECK_TEXT
		} else {
			buttonColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_NUMBER_BACKGROUND
			buttonColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_NUMBER_TEXT
		}

		// Ajustar dinámicamente el tamaño de fuente si el texto es largo como "CLOSE"
		canvasContext.font = currentButtonLabel === "CLOSE" ? INTERFACE_FONTS.KEYPAD_BUTTON_SMALL : INTERFACE_FONTS.KEYPAD_BUTTON
		drawBeveledButton(canvasContext, canvasElement, buttonColors, zone, isHovered, currentButtonLabel, INTERFACE_DIMENSIONS.BEVEL_SIZE_SMALL)
	})

	// 6. El diálogo de teclado ahora se maneja en dialogBox.js
	drawDialogBox(canvasContext, canvasElement, gameState, "keypad", gameImages)

	// Restauramos fuentes por defecto del motor
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
