import { INTERFACE_DIMENSIONS, INTERFACE_COLORS, INTERFACE_FONTS, GAME_PUZZLES } from "./config.js"
import { drawDialogBox } from "./dialogBox.js"

/**
 * 📜 DRAW UNROLLED SCROLL (Text Detail View Component)
 * SCENARIO EFFECT: Renders the background texture with an ancient interactive pop-up document layered over it.
 */
export function drawScrollText(canvasContext, canvasElement, gameState, backgroundImage) {
	// 1. Solid black fallback canvas backdrop while loading textures
	canvasContext.fillStyle = "black"
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	// 2. Render background scene image asset safely
	if (backgroundImage && backgroundImage.complete) {
		canvasContext.drawImage(backgroundImage, 0, 0, canvasElement.width, canvasElement.height)
	} else {
		canvasContext.fillStyle = INTERFACE_COLORS.FALLBACK_BACKGROUND_ROOM_ONE
		canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)
	}

	// 3. Coordinate layouts fetched securely from configurations
	const scrollWidth = INTERFACE_DIMENSIONS.SCROLL_MODAL_WIDTH
	const scrollHeight = INTERFACE_DIMENSIONS.SCROLL_MODAL_HEIGHT
	const scrollLeftX = canvasElement.width / 2 - scrollWidth / 2
	const scrollTopY = canvasElement.height / 2 - scrollHeight / 2

	// 4. Render ancient container paper card layers
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_BACKGROUND
	canvasContext.fillRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)
	
	canvasContext.strokeStyle = INTERFACE_COLORS.SCROLL_PAPER_BORDER
	canvasContext.lineWidth = INTERFACE_DIMENSIONS.SCROLL_BORDER_LINE_WIDTH
	canvasContext.strokeRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)

	// 5. Standard context global alignment properties
	canvasContext.textAlign = "center"
	canvasContext.textBaseline = "top"

	// 6. Header title text rendering
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_TEXT
	canvasContext.font = INTERFACE_FONTS.SCROLL_TITLE
	canvasContext.fillText("MANUSCRITO ANTIGUO", canvasElement.width / 2, scrollTopY + INTERFACE_DIMENSIONS.SCROLL_TITLE_PADDING_Y)

	// 7. Dynamic text calculation loops mapping lore text array segments
	canvasContext.font = INTERFACE_FONTS.SCROLL_BODY
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_SECONDARY_TEXT

	GAME_PUZZLES.SCROLL_LORE_LINES.forEach((lineText, lineIndex) => {
		const targetY = scrollTopY + INTERFACE_DIMENSIONS.SCROLL_TEXT_START_PADDING_Y + (lineIndex * INTERFACE_DIMENSIONS.SCROLL_TEXT_LINE_SPACING_Y)
		canvasContext.fillText(lineText, canvasElement.width / 2, targetY)
	})

	// 8. Footer notification guidance hint
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_BORDER
	canvasContext.font = INTERFACE_FONTS.SCROLL_FOOTER
	canvasContext.fillText(
		"(Haz clic en cualquier lugar fuera del pergamino para guardarlo)", 
		canvasElement.width / 2, 
		scrollTopY + scrollHeight - INTERFACE_DIMENSIONS.SCROLL_FOOTER_PADDING_BOTTOM
	)

	drawDialogBox(canvasContext, canvasElement, gameState, "scroll")

	// Revert canvas graphics engine base configurations
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
