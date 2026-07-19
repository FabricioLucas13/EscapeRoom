import { INTERFACE_DIMENSIONS, INTERFACE_COLORS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getCandleInteractions } from "./interactions.js"
import { drawDialogBox } from "./dialogBox.js"

export function drawCandlePuzzle(canvasContext, canvasElement, gameState, backgroundImage) {
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	if (backgroundImage && backgroundImage.complete) {
		canvasContext.drawImage(backgroundImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_PANEL_BACKGROUND
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}

	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "middle"

	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
	canvasContext.font = "bold 16px 'Georgia', serif"
	canvasContext.fillText("ENCIENDE LAS VELAS", canvasElement.width / 2, INTERFACE_DIMENSIONS.CANDLE_TITLE_Y)

	const candleZones = getCandleInteractions(canvasElement)
	
	const flameColors = [
		INTERFACE_COLORS.CANDLE_FLAME_YELLOW, 
		INTERFACE_COLORS.CANDLE_FLAME_BLUE,   
		INTERFACE_COLORS.CANDLE_FLAME_GREEN,  
		INTERFACE_COLORS.CANDLE_FLAME_PURPLE  
	]

	candleZones.forEach((zone, index) => {
		const isHovered = isMouseInsideZone(gameState.mouseX, gameState.mouseY, zone)

		// 🛠️ MODIFICADO: Ignoramos el renderizado de la zona invisible de fondo y la cruz ya no existe
		if (zone.label === "BACKGROUND_CLOSE_ZONE") {
			return; 
		}

		if (zone.label === "Activar") {
			let actionButtonColors = { ...INTERFACE_COLORS }
			actionButtonColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_NUMBER_BACKGROUND
			actionButtonColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_SCREEN_TEXT
			canvasContext.font = "14px monospace"
			drawBeveledButton(canvasContext, canvasElement, actionButtonColors, zone, isHovered, zone.label, 6)
		} else {
			const candleId = index + 1 
			const isCandleActive = gameState.candlesOn.includes(candleId) 

			let customCandleColors = { ...INTERFACE_COLORS }
			customCandleColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.BUTTON_BACKGROUND_HOVER
			drawBeveledButton(canvasContext, canvasElement, customCandleColors, zone, isHovered, "", 8)

			const centerX = zone.x + zone.width / 2

			canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_BUTTON_NUMBER_TEXT
			canvasContext.fillRect(
				centerX - INTERFACE_DIMENSIONS.BUTTON_INNER_RECT_WIDTH / 2,
				zone.y + zone.height - INTERFACE_DIMENSIONS.BUTTON_INNER_RECT_HEIGHT - INTERFACE_DIMENSIONS.CANDLE_RESULT_BOTTOM_GAP + INTERFACE_DIMENSIONS.CANDLE_RESULT_BOTTOM_GAP,
				INTERFACE_DIMENSIONS.BUTTON_INNER_RECT_WIDTH,
				INTERFACE_DIMENSIONS.BUTTON_INNER_RECT_HEIGHT
			)

			canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_BACKGROUND_DEFAULT
			canvasContext.fillRect(centerX - INTERFACE_DIMENSIONS.CANDLE_STEM_WIDTH / 2, zone.y + INTERFACE_DIMENSIONS.CANDLE_STEM_Y_OFFSET, INTERFACE_DIMENSIONS.CANDLE_STEM_WIDTH, INTERFACE_DIMENSIONS.CANDLE_STEM_HEIGHT)

			if (isCandleActive) {
				canvasContext.fillStyle = flameColors[index]
				canvasContext.beginPath()
				canvasContext.arc(centerX, zone.y + INTERFACE_DIMENSIONS.CANDLE_FLAME_Y_OFFSET, INTERFACE_DIMENSIONS.CANDLE_FLAME_RADIUS, 0, Math.PI, false)
				canvasContext.lineTo(centerX, zone.y + 5)
				canvasContext.closePath()
				canvasContext.fill()

				canvasContext.shadowColor = flameColors[index]
				canvasContext.shadowBlur = isHovered ? INTERFACE_DIMENSIONS.SHADOW_BLUR_LARGE : INTERFACE_DIMENSIONS.SHADOW_BLUR_SMALL
				canvasContext.fill()
				canvasContext.shadowBlur = 0
			}
		}
	})

	if (gameState.candleResultText !== "") {
		canvasContext.fillStyle = (gameState.candleResultText === "3") ? INTERFACE_COLORS.KEYPAD_TEXT_SUCCESS : INTERFACE_COLORS.KEYPAD_TEXT_ERROR
		canvasContext.font = "bold 16px 'Georgia', serif"
		canvasContext.fillText(gameState.candleResultText, canvasElement.width / 2, canvasElement.height - INTERFACE_DIMENSIONS.CANDLE_RESULT_BOTTOM_GAP)
	}

	drawDialogBox(canvasContext, canvasElement, gameState, "candles")

	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
