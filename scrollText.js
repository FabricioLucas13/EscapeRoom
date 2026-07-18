import { INTERFACE_DIMENSIONS, INTERFACE_COLORS } from "./config.js"

/**
 * 📜 DIBUJAR EL PERGAMINO DESENROLLADO (Vista de Detalle de Texto)
 * EFECTO SCENARIO: Dibuja la foto roomFive.jpg a pantalla completa con un pop-up blanco de texto encima.
 */
export function drawScrollText(canvasContext, canvasElement, gameState, backgroundImage) {
	// 1. Pintamos el fondo negro por si la imagen tarda unos milisegundos en cargar
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. Dibujamos la foto de cerca a pantalla completa (roomFive.jpg)
	if (backgroundImage && backgroundImage.complete) {
		canvasContext.drawImage(backgroundImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}

	// 3. Medidas leídas directamente desde config.js
	const scrollWidth = INTERFACE_DIMENSIONS.SCROLL_MODAL_WIDTH || 460
	const scrollHeight = INTERFACE_DIMENSIONS.SCROLL_MODAL_HEIGHT || 320
	const scrollLeftX = canvasElement.width / 2 - scrollWidth / 2
	const scrollTopY = canvasElement.height / 2 - scrollHeight / 2

	// 4. Dibujar la hoja de papel blanca usando los colores centralizados
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_BACKGROUND
	canvasContext.fillRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)
	
	canvasContext.strokeStyle = INTERFACE_COLORS.SCROLL_PAPER_BORDER
	canvasContext.lineWidth = 4
	canvasContext.strokeRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)

	// 5. Configuración base para el texto
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "top"

	// Título principal
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_TEXT
	canvasContext.font = "bold 20px 'Georgia', serif"
	canvasContext.fillText("MANUSCRITO ANTIGUO", canvasElement.width / 2, scrollTopY + 30)

	// Configuración de los párrafos de Lore/Pistas
	canvasContext.font = "14px 'Georgia', serif"
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_SECONDARY_TEXT

	// PÁRRAFO 1 
	canvasContext.fillText(
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor",
		canvasElement.width / 2, 
		scrollTopY + 85
	)
	canvasContext.fillText(
		"incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis.",
		canvasElement.width / 2, 
		scrollTopY + 105
	)

	// PÁRRAFO 2 
	canvasContext.fillText(
		"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
		canvasElement.width / 2, 
		scrollTopY + 155
	)
	canvasContext.fillText(
		"eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
		canvasElement.width / 2, 
		scrollTopY + 175
	)

	// PÁRRAFO 3 
	canvasContext.fillText(
		"Sunt in culpa qui officia deserunt mollit anim id est laborum. El misterio",
		canvasElement.width / 2, 
		scrollTopY + 225
	)
	canvasContext.fillText(
		"aguarda en las sombras de la cripta, sigue el rastro de la luz ancestral.",
		canvasElement.width / 2, 
		scrollTopY + 245
	)

	// Texto de ayuda inferior
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_BORDER
	canvasContext.font = "italic 11px Arial"
	canvasContext.fillText("(Haz clic en cualquier lugar fuera del pergamino para guardarlo)", canvasElement.width / 2, scrollTopY + scrollHeight - 25)

	// Restauramos fuentes por defecto del motor gráfico
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
