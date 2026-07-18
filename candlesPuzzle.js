import { INTERFACE_DIMENSIONS, INTERFACE_COLORS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getCandleInteractions } from "./interactions.js"

/**
 * 🕯️ DIBUJAR EL PUZZLE DE LAS VELAS (Vista de Detalle)
 * Sustituye la habitación y dibuja la imagen de cerca a pantalla completa con las llamas encima.
 */
export function drawCandlePuzzle(canvasContext, canvasElement, state, bgImage) {
	// 1. Pintamos el fondo negro por si la imagen tarda unos milisegundos en cargar
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. EFECTO SCENARIO: Dibujamos la foto de cerca a pantalla completa
	if (bgImage && bgImage.complete) {
		canvasContext.drawImage(bgImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_PANEL_BACKGROUND
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}

	// Configuración base de textos para los títulos
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "middle"

	// 3. Título del puzzle
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
	canvasContext.font = "bold 16px 'Georgia', serif"
	canvasContext.fillText("ENCIENDE LAS VELAS", canvasElement.width / 2, INTERFACE_DIMENSIONS.CANDLE_TITLE_Y)

	// 4. Dibujar los botones del Grid (Las 4 velas, Ejecutar y Cruz)
	const candleZones = getCandleInteractions(canvasElement)
	
	const flameColors = [
		INTERFACE_COLORS.CANDLE_FLAME_YELLOW, 
		INTERFACE_COLORS.CANDLE_FLAME_BLUE,   
		INTERFACE_COLORS.CANDLE_FLAME_GREEN,  
		INTERFACE_COLORS.CANDLE_FLAME_PURPLE  
	]

	candleZones.forEach((zone, index) => {
		const isHovered = isMouseInsideZone(state.mouseX, state.mouseY, zone)

		if (zone.label === "✕") {
			// Cruz de cerrar arriba a la derecha (Regresa a la Habitación Uno)
			canvasContext.fillStyle = isHovered ? INTERFACE_COLORS.KEYPAD_TEXT_ERROR : INTERFACE_COLORS.BUTTON_TEXT_DEFAULT
			canvasContext.font = "bold 24px Arial"
			canvasContext.fillText(zone.label, zone.x + zone.width / 2, zone.y + zone.height / 2)
		} else if (zone.label === "⚙️ Ejecutar") {
			// Botón de validar inferior (.dev-btn)
			let execColors = { ...INTERFACE_COLORS }
			execColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BTN_NUM_BG
			execColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_SCREEN_TEXT
			canvasContext.font = "14px monospace"
			drawBeveledButton(canvasContext, canvasElement, execColors, zone, isHovered, zone.label, 6)
		} else {
			// Es una de las 4 velas físicas
			const candleNum = index + 1 
			const isOn = state.candlesOn.includes(candleNum) 

			// Dibujamos la caja base medieval gris de la vela
			let candleColors = { ...INTERFACE_COLORS }
			candleColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.BUTTON_BACKGROUND_HOVER
			drawBeveledButton(canvasContext, canvasElement, candleColors, zone, isHovered, "", 8)

			const centerX = zone.x + zone.width / 2

			// Cuerpo de la vela (.bodyCandle)
			canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_BTN_NUM_TEXT
			canvasContext.fillRect(centerX - 11, zone.y + zone.height - 55, 22, 40)

			// Mecha de la vela (.wick)
			canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_BACKGROUND_DEFAULT
			canvasContext.fillRect(centerX - 1, zone.y + 24, 2, 8)

			// Lógica de la Llama (.flame): Solo se pinta si la vela está encendida
			if (isOn) {
				canvasContext.fillStyle = flameColors[index] 
				canvasContext.beginPath()
				canvasContext.arc(centerX, zone.y + 18, 7, 0, Math.PI, false)
				canvasContext.lineTo(centerX, zone.y + 5)
				canvasContext.closePath()
				canvasContext.fill()
				
				// Efecto de brillo de la llama (.box-shadow simulado)
				canvasContext.shadowColor = flameColors[index]
				canvasContext.shadowBlur = isHovered ? 12 : 6
				canvasContext.fill()
				canvasContext.shadowBlur = 0 
			}
		}
	})

	// 5. Mensaje de resultado o código final debajo de los botones
	if (state.candleResultText !== "") {
		canvasContext.fillStyle = (state.candleResultText === "3") ? INTERFACE_COLORS.KEYPAD_TEXT_SUCCESS : INTERFACE_COLORS.KEYPAD_TEXT_ERROR
		canvasContext.font = "bold 16px 'Georgia', serif"
		// 🧹 OPTIMIZADO: Ahora calcula la altura leyendo la medida exacta de config.js
		canvasContext.fillText(state.candleResultText, canvasElement.width / 2, canvasElement.height - INTERFACE_DIMENSIONS.CANDLE_RESULT_BOTTOM_GAP)
	}

	// Restauramos fuentes por defecto del motor gráfico
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
