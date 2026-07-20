import { INTERFACE_DIMENSIONS, INTERFACE_COLORS, INTERFACE_FONTS, GAME_PUZZLES } from "./config.js"
import { drawDialogBox } from "./dialogBox.js"

/**
 * 📖 DRAW BOOK TEXT (Text Detail View Component)
 * SCENARIO EFFECT: Renders the background texture with an ancient interactive pop-up document layered over it.
 */
export function drawBookText(canvasContext, canvasElement, gameState, backgroundImage, gameImages) {
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
	const bookWidth = INTERFACE_DIMENSIONS.BOOK_MODAL_WIDTH
	const bookHeight = INTERFACE_DIMENSIONS.BOOK_MODAL_HEIGHT
	const bookLeftX = canvasElement.width / 2 - bookWidth / 2
	const bookTopY = canvasElement.height / 2 - bookHeight / 2

	// 4. Render ancient container paper card layers
	canvasContext.fillStyle = INTERFACE_COLORS.BOOK_PAPER_BACKGROUND
	canvasContext.fillRect(bookLeftX, bookTopY, bookWidth, bookHeight)

	// Textura de pergamino antiguo (capas suaves para dar desgaste y fibra)
	const parchmentGradient = canvasContext.createLinearGradient(bookLeftX, bookTopY, bookLeftX + bookWidth, bookTopY + bookHeight)
	parchmentGradient.addColorStop(0, "rgba(224, 197, 144, 0.52)")
	parchmentGradient.addColorStop(0.35, "rgba(249, 236, 196, 0.18)")
	parchmentGradient.addColorStop(0.7, "rgba(232, 208, 162, 0.22)")
	parchmentGradient.addColorStop(1, "rgba(186, 149, 95, 0.42)")
	canvasContext.fillStyle = parchmentGradient
	canvasContext.fillRect(bookLeftX, bookTopY, bookWidth, bookHeight)

	const edgeShade = canvasContext.createRadialGradient(
		bookLeftX + bookWidth / 2,
		bookTopY + bookHeight / 2,
		bookWidth * 0.2,
		bookLeftX + bookWidth / 2,
		bookTopY + bookHeight / 2,
		bookWidth * 0.72
	)
	edgeShade.addColorStop(0, "rgba(0, 0, 0, 0)")
	edgeShade.addColorStop(1, "rgba(78, 49, 21, 0.28)")
	canvasContext.fillStyle = edgeShade
	canvasContext.fillRect(bookLeftX, bookTopY, bookWidth, bookHeight)

	// Banda superior e inferior para simular enrollado y desgaste en bordes
	const topBand = canvasContext.createLinearGradient(bookLeftX, bookTopY, bookLeftX, bookTopY + 28)
	topBand.addColorStop(0, "rgba(118, 80, 40, 0.34)")
	topBand.addColorStop(1, "rgba(118, 80, 40, 0)")
	canvasContext.fillStyle = topBand
	canvasContext.fillRect(bookLeftX, bookTopY, bookWidth, 28)

	const bottomBand = canvasContext.createLinearGradient(bookLeftX, bookTopY + bookHeight - 30, bookLeftX, bookTopY + bookHeight)
	bottomBand.addColorStop(0, "rgba(104, 70, 34, 0)")
	bottomBand.addColorStop(1, "rgba(104, 70, 34, 0.30)")
	canvasContext.fillStyle = bottomBand
	canvasContext.fillRect(bookLeftX, bookTopY + bookHeight - 30, bookWidth, 30)

	canvasContext.save()
	canvasContext.beginPath()
	canvasContext.rect(bookLeftX, bookTopY, bookWidth, bookHeight)
	canvasContext.clip()
	canvasContext.strokeStyle = "rgba(122, 88, 50, 0.16)"
	canvasContext.lineWidth = 1
	for (let y = bookTopY + 12; y < bookTopY + bookHeight - 10; y += 14) {
		const waveOffset = (y % 28 === 0) ? 4 : -3
		canvasContext.beginPath()
		canvasContext.moveTo(bookLeftX + 10, y)
		canvasContext.quadraticCurveTo(bookLeftX + bookWidth / 2 + waveOffset, y + 2, bookLeftX + bookWidth - 10, y)
		canvasContext.stroke()
	}

	// Motas y manchas de tinta envejecida en posiciones deterministas
	for (let i = 0; i < 22; i++) {
		const px = bookLeftX + 18 + ((i * 37) % (bookWidth - 36))
		const py = bookTopY + 16 + ((i * 53) % (bookHeight - 32))
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
	canvasContext.moveTo(bookLeftX + 9, bookTopY + 8)
	canvasContext.lineTo(bookLeftX + bookWidth - 12, bookTopY + 10)
	canvasContext.lineTo(bookLeftX + bookWidth - 8, bookTopY + bookHeight - 12)
	canvasContext.lineTo(bookLeftX + 12, bookTopY + bookHeight - 8)
	canvasContext.closePath()
	canvasContext.stroke()
	canvasContext.restore()
	
	canvasContext.strokeStyle = INTERFACE_COLORS.BOOK_PAPER_BORDER
	canvasContext.lineWidth = INTERFACE_DIMENSIONS.BOOK_BORDER_LINE_WIDTH
	canvasContext.strokeRect(bookLeftX, bookTopY, bookWidth, bookHeight)

	// 5. Standard context global alignment properties
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "top"

	// 6. Dynamic text calculation loops mapping lore text array segments
	canvasContext.font = INTERFACE_FONTS.BOOK_BODY
	canvasContext.fillStyle = INTERFACE_COLORS.BOOK_PAPER_SECONDARY_TEXT

	const totalPages = GAME_PUZZLES.BOOK_PAGES.length
	const currentPageIndex = Math.max(0, Math.min(gameState.bookPageIndex || 0, totalPages - 1))
	const pageLines = GAME_PUZZLES.BOOK_PAGES[currentPageIndex]
	const textMarginX = INTERFACE_DIMENSIONS.BOOK_TEXT_MARGIN_X
	const textStartX = bookLeftX + textMarginX
	const textMaxWidth = bookWidth - (textMarginX * 2)
	const lineHeight = INTERFACE_DIMENSIONS.BOOK_TEXT_LINE_SPACING_Y + INTERFACE_DIMENSIONS.BOOK_TEXT_EXTRA_LINE_SPACING_Y

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
			const targetY = bookTopY + INTERFACE_DIMENSIONS.BOOK_TEXT_START_PADDING_Y + (visualLineIndex * lineHeight)

			// Primera letra roja estilo manuscrito, resto del texto normal.
			if (!initialLetterStyled && wrappedLine.trim().length > 0) {
				const firstCharacter = wrappedLine[0]
				const remainingText = wrappedLine.slice(1)

				canvasContext.font = INTERFACE_FONTS.BOOK_DROP_CAP
				canvasContext.fillStyle = "#8d1f17"
				canvasContext.fillText(firstCharacter, textStartX, targetY - 3)

				const firstCharacterWidth = canvasContext.measureText(firstCharacter).width
				canvasContext.font = INTERFACE_FONTS.BOOK_BODY
				canvasContext.fillStyle = INTERFACE_COLORS.BOOK_PAPER_SECONDARY_TEXT
				canvasContext.fillText(remainingText, textStartX + firstCharacterWidth + 2, targetY)
				initialLetterStyled = true
			} else {
				canvasContext.font = INTERFACE_FONTS.BOOK_BODY
				canvasContext.fillStyle = INTERFACE_COLORS.BOOK_PAPER_SECONDARY_TEXT
				canvasContext.fillText(wrappedLine, textStartX, targetY)
			}

			visualLineIndex++
		})
	})
	canvasContext.shadowColor = "transparent"

	// Botones laterales visuales para cambiar de página
	const sideButtonWidth = INTERFACE_DIMENSIONS.BOOK_SIDE_BUTTON_WIDTH
	const sideButtonHeight = INTERFACE_DIMENSIONS.BOOK_SIDE_BUTTON_HEIGHT
	const sideButtonY = bookTopY + bookHeight / 2 - sideButtonHeight / 2
	const leftButtonX = bookLeftX - sideButtonWidth - INTERFACE_DIMENSIONS.BOOK_SIDE_BUTTON_GAP_X
	const rightButtonX = bookLeftX + bookWidth + INTERFACE_DIMENSIONS.BOOK_SIDE_BUTTON_GAP_X
	const canGoPrevious = currentPageIndex > 0
	const canGoNext = currentPageIndex < totalPages - 1

	canvasContext.fillStyle = "rgba(20, 14, 11, 0.78)"
	canvasContext.strokeStyle = INTERFACE_COLORS.BOOK_PAPER_BORDER
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

	drawDialogBox(canvasContext, canvasElement, gameState, "book", gameImages)

	// Revert canvas graphics engine base configurations
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "alphabetic"
}
