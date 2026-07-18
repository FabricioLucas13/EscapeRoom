import { INTERFACE_DIMENSIONS, INTERFACE_COLORS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getCandleInteractions } from "./interactions.js"

/**
 * 🕯️ DIBUJAR EL PUZZLE DE LAS VELAS (Componente Autónomo)
 * Renderiza el modal, las velas medievales y las llamas de colores según su estado.
 */
export function drawCandlePuzzle(canvasContext, canvasElement, state) {
	
	const padWidth = INTERFACE_DIMENSIONS.CANDLE_MODAL_WIDTH || 420
	const padHeight = INTERFACE_DIMENSIONS.CANDLE_MODAL_HEIGHT || 260
	const padLeftX = canvasElement.width / 2 - padWidth / 2
	const padTopY = canvasElement.height / 2 - padHeight / 2

	// 1. Fondo oscuro translúcido (El .overlay de CSS)
	canvasContext.fillStyle = INTERFACE_COLORS.KEYPAD_OVERLAY
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. El panel con esquinas biseladas (El .modal de CSS)
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

	// 3. Título (<h2>)
	canvasContext.fillStyle = "#e0d2a8"
	canvasContext.font = "bold 16px 'Georgia', serif"
	canvasContext.fillText("ENCIENDE LAS VELAS", canvasElement.width / 2, padTopY + 35)

	// 4. Dibujar los botones del Grid (Las 4 velas, Ejecutar y Cruz)
	const candleZones = getCandleInteractions(canvasElement)
	
	// Mapeamos los colores de fuego específicos que programó el equipo en el CSS
	const flameColors = [
		INTERFACE_COLORS.CANDLE_FLAME_YELLOW, // Vela 1
		INTERFACE_COLORS.CANDLE_FLAME_BLUE,   // Vela 2
		INTERFACE_COLORS.CANDLE_FLAME_GREEN,  // Vela 3
		INTERFACE_COLORS.CANDLE_FLAME_PURPLE  // Vela 4
	]

	candleZones.forEach((zone, index) => {
		const isHovered = isMouseInsideZone(state.mouseX, state.mouseY, zone)

		if (zone.label === "✕") {
			// Cruz de cerrar arriba a la derecha
			canvasContext.fillStyle = isHovered ? "#ff5a5a" : "#c9b98a"
			canvasContext.font = "bold 24px Arial"
			canvasContext.fillText(zone.label, zone.x + zone.width / 2, zone.y + zone.height / 2)
		} else if (zone.label === "⚙️ Ejecutar") {
			// Botón de validar inferior (.dev-btn)
			let execColors = { ...INTERFACE_COLORS }
			execColors.BUTTON_BACKGROUND_DEFAULT = "#333333"
			execColors.BUTTON_TEXT_DEFAULT = "#7cffb2"
			canvasContext.font = "14px monospace"
			drawBeveledButton(canvasContext, canvasElement, execColors, zone, isHovered, zone.label, 6)
		} else {
			// Es una de las 4 velas
			const candleNum = index + 1 // Número de la vela (1 al 4)
			const isOn = state.candlesOn.includes(candleNum) // ¿Está encendida en el state manager?

			// Dibujamos la caja base medieval gris de la vela
			let candleColors = { ...INTERFACE_COLORS }
			candleColors.BUTTON_BACKGROUND_DEFAULT = "#222222"
			drawBeveledButton(canvasContext, canvasElement, candleColors, zone, isHovered, "", 8)

			// Dibujamos los elementos internos de la vela (Cuerpo y Mecha)
			const centerX = zone.x + zone.width / 2

			// Cuerpo de la vela (.bodyCandle)
			canvasContext.fillStyle = "#efe8c8"
			canvasContext.fillRect(centerX - 11, zone.y + zone.height - 55, 22, 40)

			// Mecha de la vela (.wick)
			canvasContext.fillStyle = "black"
			canvasContext.fillRect(centerX - 1, zone.y + 24, 2, 8)

			// 🎛️ Lógica de la Llama (.flame): Solo se pinta si la vela está en el array "on"
			if (isOn) {
				canvasContext.fillStyle = flameColors[index] // Asigna su color radial correspondiente
				canvasContext.beginPath()
				// Dibujamos una pequeña forma de gota/llama de fuego en el Canvas sobre la mecha
				canvasContext.arc(centerX, zone.y + 18, 7, 0, Math.PI, false)
				canvasContext.lineTo(centerX, zone.y + 5)
				canvasContext.closePath()
				canvasContext.fill()
				
				// Efecto de brillo de la llama (.box-shadow)
				canvasContext.shadowColor = flameColors[index]
				canvasContext.shadowBlur = isHovered ? 12 : 6
				canvasContext.fill()
				canvasContext.shadowBlur = 0 // Quitamos el sombreado para no pintar borroso el resto
			}
		}
	})

	// 5. Mensaje de resultado o feedback debajo de los botones (<p id="r2">)
	if (state.candleResultText !== "") {
		// Si es el código correcto "3", lo pinta en verde. Si es error, en rojo.
		canvasContext.fillStyle = (state.candleResultText === "3") ? "#7CFFB2" : "#ff5a5a"
		canvasContext.font = "bold 16px 'Georgia', serif"
		canvasContext.fillText(state.candleResultText, canvasElement.width / 2, padTopY + padHeight - 20)
	}

	// Restauramos fuentes por defecto del motor
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
