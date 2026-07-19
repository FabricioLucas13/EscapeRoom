import { INTERFACE_DIMENSIONS, INTERFACE_COLORS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getColorPuzzleInteractions } from "./interactions.js"
import { drawDialogBox } from "./dialogBox.js"

/**
 * 🎨 DIBUJAR EL PUZZLE DE COLORES (Vista de Detalle Autónoma)
 * EFECTO SCENARIO: Dibuja la foto roomThree.jpg a pantalla completa.
 */
export function drawColorPuzzle(canvasContext, canvasElement, gameState, backgroundImage, gameImages) {
	// 1. Pintamos el fondo negro por si la imagen tarda unos milisegundos en cargar
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. Dibuja la foto de cerca a pantalla completa
	if (backgroundImage && backgroundImage.complete) {
		canvasContext.drawImage(backgroundImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_PANEL_BACKGROUND
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}

	const panelWidth = INTERFACE_DIMENSIONS.CANDLE_MODAL_WIDTH || 420
	const panelHeight = INTERFACE_DIMENSIONS.CANDLE_MODAL_HEIGHT || 260
	const panelTopY = canvasElement.height / 2 - panelHeight / 2

	// Configuración base de textos centrados
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "middle"

	// 3. Título del puzzle
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
	canvasContext.font = "bold 16px 'Georgia', serif"
	canvasContext.fillText("ELIGE EL ORDEN CORRECTO", canvasElement.width / 2, panelTopY + 40)

	// 4. Dibujar los botones del Grid (Los 4 círculos de color y el botón de Ejecutar)
	const colorButtonZones = getColorPuzzleInteractions(canvasElement)
	
	// El orden de los colores cromáticos cambia a: morado, azul, amarillo, verde
	const colorSphereValues = [
		INTERFACE_COLORS.CANDLE_FLAME_PURPLE, 
		INTERFACE_COLORS.CANDLE_FLAME_BLUE,   
		INTERFACE_COLORS.CANDLE_FLAME_YELLOW,  
		INTERFACE_COLORS.CANDLE_FLAME_GREEN  
	]

	// El orden de los strings de validación cambia a: morado, azul, amarillo, verde
	const colorNames = ["morado", "azul", "amarillo", "verde"]

	colorButtonZones.forEach((zone, index) => {
		const isHovered = isMouseInsideZone(gameState.mouseX, gameState.mouseY, zone)

		if (zone.label === "BACKGROUND_CLOSE_ZONE") {
			return; // No se dibuja la zona invisible de fondo
		}

		if (zone.label === "Activar") {
			let actionButtonColors = { ...INTERFACE_COLORS }
			actionButtonColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_NUMBER_BACKGROUND
			actionButtonColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_SCREEN_TEXT
			canvasContext.font = "14px monospace"
			drawBeveledButton(canvasContext, canvasElement, actionButtonColors, zone, isHovered, zone.label, 6)
		} else {
			// Es una de las 4 esferas de colores
			let customColors = { ...INTERFACE_COLORS }
			customColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.BUTTON_BACKGROUND_HOVER
			drawBeveledButton(canvasContext, canvasElement, customColors, zone, isHovered, "", INTERFACE_DIMENSIONS.BEVEL_SIZE_DEFAULT)

			const centerX = zone.x + zone.width / 2
			const centerY = zone.y + zone.height / 2

			const currentBallColorName = colorNames[index]
			const isAlreadyPressed = gameState.colorSelectedSequence.includes(currentBallColorName)

			// Pintar la esfera de color base centralizada en su botón
			canvasContext.fillStyle = colorSphereValues[index]
			canvasContext.beginPath()
			canvasContext.arc(centerX, centerY, INTERFACE_DIMENSIONS.COLOR_SPHERE_RADIUS, 0, Math.PI * 2)
			canvasContext.closePath()
			canvasContext.fill()

			// Si ya está pulsada, brilla con intensidad. Si no, solo brilla si el ratón está encima
			if (isAlreadyPressed) {
				canvasContext.shadowColor = colorSphereValues[index]
				canvasContext.shadowBlur = INTERFACE_DIMENSIONS.SHADOW_BLUR_LARGE
				canvasContext.beginPath()
				canvasContext.arc(centerX, centerY, INTERFACE_DIMENSIONS.COLOR_SPHERE_RADIUS, 0, Math.PI * 2)
				canvasContext.closePath()
				canvasContext.fill()
				canvasContext.shadowBlur = 0
			} else if (isHovered) {
				canvasContext.shadowColor = colorSphereValues[index]
				canvasContext.shadowBlur = INTERFACE_DIMENSIONS.SHADOW_BLUR_MEDIUM
				canvasContext.beginPath()
				canvasContext.arc(centerX, centerY, INTERFACE_DIMENSIONS.COLOR_SPHERE_RADIUS, 0, Math.PI * 2)
				canvasContext.closePath()
				canvasContext.fill()
				canvasContext.shadowBlur = 0
			}
		}
	})

	// 5. Mensaje de resultado o número "9" final de recompensa
	drawDialogBox(canvasContext, canvasElement, gameState, "colors", gameImages)

	// Restauramos fuentes por defecto del motor gráfico
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
