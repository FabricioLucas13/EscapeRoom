import { INTERFACE_DIMENSIONS, INTERFACE_COLORS, INTERFACE_FONTS, GAME_PUZZLES } from "./config.js"
import { drawDialogBox } from "./dialogBox.js"

/**
 * 📜 DRAW UNROLLED SCROLL (Text Detail View Component)
 * SCENARIO EFFECT: Renders the background texture with an ancient interactive pop-up document layered over it.
 */
export function drawScrollText(canvasContext, canvasElement, gameState, backgroundImage, gameImages) {
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

	// Textura de pergamino antiguo (capas suaves para dar desgaste y fibra)
	const parchmentGradient = canvasContext.createLinearGradient(scrollLeftX, scrollTopY, scrollLeftX + scrollWidth, scrollTopY + scrollHeight)
	parchmentGradient.addColorStop(0, "rgba(224, 197, 144, 0.52)")
	parchmentGradient.addColorStop(0.35, "rgba(249, 236, 196, 0.18)")
	parchmentGradient.addColorStop(0.7, "rgba(232, 208, 162, 0.22)")
	parchmentGradient.addColorStop(1, "rgba(186, 149, 95, 0.42)")
	canvasContext.fillStyle = parchmentGradient
	canvasContext.fillRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)

	const edgeShade = canvasContext.createRadialGradient(
		scrollLeftX + scrollWidth / 2,
		scrollTopY + scrollHeight / 2,
		scrollWidth * 0.2,
		scrollLeftX + scrollWidth / 2,
		scrollTopY + scrollHeight / 2,
		scrollWidth * 0.72
	)
	edgeShade.addColorStop(0, "rgba(0, 0, 0, 0)")
	edgeShade.addColorStop(1, "rgba(78, 49, 21, 0.28)")
	canvasContext.fillStyle = edgeShade
	canvasContext.fillRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)

	// Banda superior e inferior para simular enrollado y desgaste en bordes
	const topBand = canvasContext.createLinearGradient(scrollLeftX, scrollTopY, scrollLeftX, scrollTopY + 28)
	topBand.addColorStop(0, "rgba(118, 80, 40, 0.34)")
	topBand.addColorStop(1, "rgba(118, 80, 40, 0)")
	canvasContext.fillStyle = topBand
	canvasContext.fillRect(scrollLeftX, scrollTopY, scrollWidth, 28)

	const bottomBand = canvasContext.createLinearGradient(scrollLeftX, scrollTopY + scrollHeight - 30, scrollLeftX, scrollTopY + scrollHeight)
	bottomBand.addColorStop(0, "rgba(104, 70, 34, 0)")
	bottomBand.addColorStop(1, "rgba(104, 70, 34, 0.30)")
	canvasContext.fillStyle = bottomBand
	canvasContext.fillRect(scrollLeftX, scrollTopY + scrollHeight - 30, scrollWidth, 30)

	canvasContext.save()
	canvasContext.beginPath()
	canvasContext.rect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)
	canvasContext.clip()
	canvasContext.strokeStyle = "rgba(122, 88, 50, 0.16)"
	canvasContext.lineWidth = 1
	for (let y = scrollTopY + 12; y < scrollTopY + scrollHeight - 10; y += 14) {
		const waveOffset = (y % 28 === 0) ? 4 : -3
		canvasContext.beginPath()
		canvasContext.moveTo(scrollLeftX + 10, y)
		canvasContext.quadraticCurveTo(scrollLeftX + scrollWidth / 2 + waveOffset, y + 2, scrollLeftX + scrollWidth - 10, y)
		canvasContext.stroke()
	}

	// Motas y manchas de tinta envejecida en posiciones deterministas
	for (let i = 0; i < 22; i++) {
		const px = scrollLeftX + 18 + ((i * 37) % (scrollWidth - 36))
		const py = scrollTopY + 16 + ((i * 53) % (scrollHeight - 32))
		const radius = 1 + (i % 3)
		const alpha = i % 2 === 0 ? 0.08 : 0.05
		canvasContext.beginPath()
		canvasContext.fillStyle = `rgba(95, 64, 30, ${alpha})`
		canvasContext.arc(px, py, radius, 0, Math.PI * 2)
		canvasContext.fill()
	}

	// Borde irregular interno para reforzar estilo papiro
	canvasContext.strokeStyle = "rgba(120, 82, 44, 0.30)"
	canvasContext.lineWidth = 1.2
	canvasContext.beginPath()
	canvasContext.moveTo(scrollLeftX + 9, scrollTopY + 8)
	canvasContext.lineTo(scrollLeftX + scrollWidth - 12, scrollTopY + 10)
	canvasContext.lineTo(scrollLeftX + scrollWidth - 8, scrollTopY + scrollHeight - 12)
	canvasContext.lineTo(scrollLeftX + 12, scrollTopY + scrollHeight - 8)
	canvasContext.closePath()
	canvasContext.stroke()
	canvasContext.restore()
	
	canvasContext.strokeStyle = INTERFACE_COLORS.SCROLL_PAPER_BORDER
	canvasContext.lineWidth = INTERFACE_DIMENSIONS.SCROLL_BORDER_LINE_WIDTH
	canvasContext.strokeRect(scrollLeftX, scrollTopY, scrollWidth, scrollHeight)

	// 5. Standard context global alignment properties
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "top"

	// 6. Dynamic text calculation loops mapping lore text array segments
	canvasContext.font = INTERFACE_FONTS.SCROLL_BODY
	canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_SECONDARY_TEXT

	const totalPages = GAME_PUZZLES.SCROLL_PAGES.length
	const currentPageIndex = Math.max(0, Math.min(gameState.scrollPageIndex || 0, totalPages - 1))
	const pageLines = GAME_PUZZLES.SCROLL_PAGES[currentPageIndex]
	const textMarginX = INTERFACE_DIMENSIONS.SCROLL_TEXT_MARGIN_X
	const textStartX = scrollLeftX + textMarginX
	const textMaxWidth = scrollWidth - (textMarginX * 2)
	const lineHeight = INTERFACE_DIMENSIONS.SCROLL_TEXT_LINE_SPACING_Y + INTERFACE_DIMENSIONS.SCROLL_TEXT_EXTRA_LINE_SPACING_Y

	function wrapTextLines(text, maxWidth) {
		const words = text.split(" ")
		const wrapped = []
		let current = ""

		for (let i = 0; i < words.length; i++) {
			const test = current ? `${current} ${words[i]}` : words[i]
			if (canvasContext.measureText(test).width <= maxWidth || !current) {
				current = test
			} else {
				wrapped.push(current)
				current = words[i]
			}
		}

		if (current) {
			wrapped.push(current)
		}

		return wrapped
	}

	let visualLineIndex = 0
	let initialLetterStyled = false
	canvasContext.shadowColor = "rgba(88, 56, 27, 0.14)"
	canvasContext.shadowBlur = 2
	canvasContext.shadowOffsetX = 0
	canvasContext.shadowOffsetY = 1
	pageLines.forEach((lineText) => {
		const wrappedLines = wrapTextLines(lineText, textMaxWidth)
		wrappedLines.forEach((wrappedLine) => {
			const targetY = scrollTopY + INTERFACE_DIMENSIONS.SCROLL_TEXT_START_PADDING_Y + (visualLineIndex * lineHeight)

			// Primera letra roja estilo manuscrito, resto del texto normal.
			if (!initialLetterStyled && wrappedLine.trim().length > 0) {
				const firstCharacter = wrappedLine[0]
				const remainingText = wrappedLine.slice(1)

				canvasContext.font = INTERFACE_FONTS.SCROLL_DROP_CAP
				canvasContext.fillStyle = "#8d1f17"
				canvasContext.fillText(firstCharacter, textStartX, targetY - 3)

				const firstCharacterWidth = canvasContext.measureText(firstCharacter).width
				canvasContext.font = INTERFACE_FONTS.SCROLL_BODY
				canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_SECONDARY_TEXT
				canvasContext.fillText(remainingText, textStartX + firstCharacterWidth + 2, targetY)
				initialLetterStyled = true
			} else {
				canvasContext.font = INTERFACE_FONTS.SCROLL_BODY
				canvasContext.fillStyle = INTERFACE_COLORS.SCROLL_PAPER_SECONDARY_TEXT
				canvasContext.fillText(wrappedLine, textStartX, targetY)
			}

			visualLineIndex++
		})
	})
	canvasContext.shadowColor = "transparent"

	// Botones laterales visuales para cambiar de página
	const sideButtonWidth = INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_WIDTH
	const sideButtonHeight = INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_HEIGHT
	const sideButtonY = scrollTopY + scrollHeight / 2 - sideButtonHeight / 2
	const leftButtonX = scrollLeftX - sideButtonWidth - INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_GAP_X
	const rightButtonX = scrollLeftX + scrollWidth + INTERFACE_DIMENSIONS.SCROLL_SIDE_BUTTON_GAP_X
	const canGoPrevious = currentPageIndex > 0
	const canGoNext = currentPageIndex < totalPages - 1

	canvasContext.fillStyle = "rgba(20, 14, 11, 0.78)"
	canvasContext.strokeStyle = INTERFACE_COLORS.SCROLL_PAPER_BORDER
	canvasContext.lineWidth = 2

	if (canGoPrevious) {
		canvasContext.fillRect(leftButtonX, sideButtonY, sideButtonWidth, sideButtonHeight)
		canvasContext.strokeRect(leftButtonX, sideButtonY, sideButtonWidth, sideButtonHeight)
	}
	if (canGoNext) {
		canvasContext.fillRect(rightButtonX, sideButtonY, sideButtonWidth, sideButtonHeight)
		canvasContext.strokeRect(rightButtonX, sideButtonY, sideButtonWidth, sideButtonHeight)
	}

	canvasContext.fillStyle = "#f3e6c9"
	canvasContext.font = "bold 26px 'Georgia', serif"
	canvasContext.textBaseline = "middle"
	if (canGoPrevious) {
		canvasContext.fillText("‹", leftButtonX + sideButtonWidth / 2, sideButtonY + sideButtonHeight / 2)
	}
	if (canGoNext) {
		canvasContext.fillText("›", rightButtonX + sideButtonWidth / 2, sideButtonY + sideButtonHeight / 2)
	}
	canvasContext.textBaseline = "top"

	drawDialogBox(canvasContext, canvasElement, gameState, "scroll", gameImages)

	// Revert canvas graphics engine base configurations
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
