import { INTERFACE_DIMENSIONS, INTERFACE_COLORS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getKeypadInteractions } from "./interactions.js"

/**
 * 🖲️ DIBUJAR EL TECLADO NUMÉRICO (Componente Autónomo)
 * Delegamos todo el renderizado visual que antes saturaba el main.js
 */
export function drawKeypadPuzzle(canvasContext, canvasElement, state) {
	const padWidth = INTERFACE_DIMENSIONS.KEYPAD_WIDTH || 270
	const padHeight = INTERFACE_DIMENSIONS.KEYPAD_HEIGHT || 380
	const padLeftX = canvasElement.width / 2 - padWidth / 2
	const padTopY = canvasElement.height / 2 - padHeight / 2

	// 1. Fondo oscuro translúcido (El .overlay de CSS)
	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_OVERLAY
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. El panel con esquinas biseladas (El .panel de CSS)
	canvasContext.beginPath()
	canvasContext.moveTo(padLeftX + 15, padTopY)
	canvasContext.lineTo(padLeftX + padWidth - 15, padTopY)
	canvasContext.lineTo(padLeftX + padWidth, padTopY + 15)
	canvasContext.lineTo(padLeftX + padWidth, padTopY + padHeight - 15)
	canvasContext.lineTo(padLeftX + padWidth - 15, padTopY + padHeight)
	canvasContext.lineTo(padLeftX + 15, padTopY + padHeight)
	canvasContext.lineTo(padLeftX, padTopY + padHeight - 15)
	canvasContext.lineTo(padLeftX, padTopY + 15)
	canvasContext.closePath()

	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_PANEL_BACKGROUND
	canvasContext.fill()
	canvasContext.strokeStyle = INTERFACE_COLORS.KEYPAD_PANEL_BORDER
	canvasContext.lineWidth = 2
	canvasContext.stroke()

	// Configuración base de textos para el cuadro
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "middle"

	// 3. Título (🧹 OPTIMIZADO: Ahora usa el color de texto hover del config)
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
	canvasContext.font = "bold 16px 'Georgia', serif"
	canvasContext.fillText("DANOS TU CÓDIGO", canvasElement.width / 2, padTopY + 40)

	// 4. Pantalla digital con puntos y guiones (.screen)
	let displayPoints = state.keypadInput.replace(/./g, "•")
	displayPoints = displayPoints.padEnd(3, "-")

	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_SCREEN_TEXT
	canvasContext.font = "42px 'Georgia', serif"
	canvasContext.fillText(displayPoints, canvasElement.width / 2, padTopY + 85)

	// 5. Dibujar los 12 botones y la Cruz (El .grid)
	const keypadZones = getKeypadInteractions(canvasElement)
	
	keypadZones.forEach(zone => {
		const isHovered = isMouseInsideZone(state.mouseX, state.mouseY, zone)

		if (zone.label === "✕") {
			// 🧹 OPTIMIZADO: Aspa de cerrar unificada con los colores de la config central
			canvasContext.fillStyle = isHovered ? INTERFACE_COLORS.KEYPAD_TEXT_ERROR : INTERFACE_COLORS.BUTTON_TEXT_DEFAULT
			canvasContext.font = "bold 20px Arial"
			canvasContext.fillText(zone.label, zone.x + zone.width / 2, zone.y + zone.height / 2)
		} else {
			let customColors = { ...INTERFACE_COLORS }
			
			if (zone.label === "←") {
				customColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_RESET_BG
				customColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_RESET_TEXT
			} else if (zone.label === "✓") {
				customColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_CHECK_BG
				customColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_CHECK_TEXT
			} else {
				customColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_NUM_BG
				customColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_NUM_TEXT
			}

			canvasContext.font = "20px 'Georgia', serif"
			drawBeveledButton(canvasContext, canvasElement, customColors, zone, isHovered, zone.label, 6)
		}
	})

	// 6. Mensaje de resultado (Error / Éxito)
	if (state.keypadResultText !== "") {
		canvasContext.fillStyle = (state.keypadResultStatus === "success") ? INTERFACE_COLORS.KEYPAD_TEXT_SUCCESS : INTERFACE_COLORS.KEYPAD_TEXT_ERROR
		canvasContext.font = "bold 16px 'Georgia', serif"
		// 🧹 UNIFICADO: Calcula la altura exacta idéntica a las velas usando el fondo del lienzo y la constante centralizada
		canvasContext.fillText(state.keypadResultText, canvasElement.width / 2, canvasElement.height - INTERFACE_DIMENSIONS.CANDLE_RESULT_BOTTOM_GAP)
	}

	// Restauramos fuentes por defecto del motor
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
