import { INTERFACE_COLORS, INTERFACE_DIMENSIONS, INTERFACE_FONTS } from "./config.js"

function getDialogText(gameState, dialogType) {
	const DIALOG_TEXT = {
		candles: {
			notStarted: "Toca las velas en un orden mágico para descifrar el código.",
			startedAgain: "Vuelve a probar el orden de las velas.",
			solved: "¡Perfecto! El código 3 aparecerá en la salida.",
			error: "No es correcto. Reordena las velas y vuelve a intentarlo."
		},
		colors: {
			notStarted: "Pulsa los colores en un orden oculto para desbloquear la Secuencia 9.",
			patternHint: "Usa el patrón dejado por las velas para elegir los colores.",
			alreadySolved: "La secuencia final ya está resuelta.",
			error: "Secuencia errónea, reinicia la selección y vuelve a probar."
		},
		scroll: {
			firstOpen: "Este manuscrito puede contener una pista importante.",
			again: "Lee el manuscrito con atención; haz clic fuera para cerrarlo."
		},
		keypad: {
			solvedAll: "Los números serán la combinación...",
			needsClues: "¿Abrirá pistas de la contraseña?",
			failed: "No abre.",
			opened: "Uhh, se ha abierto."
		},
		runes: {
			firstOpen: "Un cofre se ha abierto solo.",
			opened: "¿Tendrán un orden?",
			failed: "Hmm, así no es.",
			solved: "Ha aparecido un 7 en la cerradura."
		},
		intro: {
			whereAmI: "¿Dónde estoy?",
			mustLeave: "Tengo que salir de aquí."
		}
	}

	switch (dialogType) {
		case "candles":
			if (gameState.candleResultText === "3") {
				return DIALOG_TEXT.candles.solved
			}
			if (gameState.candleHintSeen) {
				return gameState.candleResultText === "" ? DIALOG_TEXT.candles.startedAgain : DIALOG_TEXT.candles.error
			}
			return DIALOG_TEXT.candles.notStarted

		case "colors":
			if (gameState.colorsResultText === "9") {
				return DIALOG_TEXT.colors.alreadySolved
			}
			if (gameState.candleResultText === "3") {
				return DIALOG_TEXT.colors.patternHint
			}
			if (gameState.colorHintSeen) {
				return DIALOG_TEXT.colors.error
			}
			return DIALOG_TEXT.colors.notStarted

		case "scroll":
			return gameState.scrollHintSeen ? DIALOG_TEXT.scroll.again : DIALOG_TEXT.scroll.firstOpen

		case "intro":
			if (gameState.introStage === 1) {
				return DIALOG_TEXT.intro.whereAmI
			}
			return DIALOG_TEXT.intro.mustLeave

		case "keypad":
			if (gameState.keypadResultStatus === "success") {
				return DIALOG_TEXT.keypad.opened
			}
			if (gameState.keypadResultStatus === "error") {
				return DIALOG_TEXT.keypad.failed
			}
			if (gameState.keypadHintSeen && !gameState.keypadHintVisible) {
				return DIALOG_TEXT.keypad.clues
			}
			return isAllPuzzlesSolved(gameState) ? DIALOG_TEXT.keypad.solvedAll : DIALOG_TEXT.keypad.needsClues

		case "runes":
			if (gameState.isRuneChestSolved) {
				return DIALOG_TEXT.runes.solved
			}
			if (gameState.runeChestStatus === "failed") {
				return DIALOG_TEXT.runes.failed
			}
			if (gameState.runeChestStatus === "intro_open" || gameState.runeChestStatus === "modal") {
				return DIALOG_TEXT.runes.opened
			}
			return DIALOG_TEXT.runes.firstOpen

		default:
			return ""
	}
}

function isAllPuzzlesSolved(gameState) {
	return gameState.candleResultText === "3" && gameState.colorsResultText === "9" && gameState.thirdPuzzleResolved
}

function getCharacterImageKey(gameState, dialogType) {
	if (dialogType === "intro") {
		return "mainCharacterIntro"
	}

	if (dialogType === "scroll") {
		return "mainCharacterSolving"
	}

	if (dialogType === "candles") {
		return gameState.candleResultText === "3" ? "mainCharacterSolvedPuzzle" : "mainCharacterSolving"
	}

	if (dialogType === "colors") {
		return gameState.colorsResultText === "9" ? "mainCharacterSolvedPuzzle" : "mainCharacterSolving"
	}

	if (dialogType === "runes") {
		return gameState.isRuneChestSolved ? "mainCharacterSolvedPuzzle" : "mainCharacterSolving"
	}

	if (dialogType === "keypad") {
		return gameState.keypadResultStatus === "success" ? "mainCharacterSolvedPuzzle" : "mainCharacterSolving"
	}

	return null
}

function drawCharacterPortrait(canvasContext, canvasElement, characterImage, dialogType) {
	if (!characterImage || !characterImage.complete || characterImage.naturalWidth <= 0) {
		return
	}

	const isIntro = dialogType === "intro"
	const maxHeight = isIntro ? 420 : 300
	const scale = Math.min(1, maxHeight / characterImage.naturalHeight)
	const drawWidth = characterImage.naturalWidth * scale
	const drawHeight = characterImage.naturalHeight * scale
	const drawX = 8
	const drawY = INTERFACE_DIMENSIONS.DIALOG_BOX_Y - drawHeight - 6

	canvasContext.drawImage(characterImage, drawX, drawY, drawWidth, drawHeight)
}

function wrapText(canvasContext, text, x, y, maxWidth, lineHeight) {
	const words = text.split(" ")

	const lines = words.reduce((accumulator, word) => {
		const previousLine = accumulator[accumulator.length - 1] || ""
		const testLine = previousLine ? `${previousLine} ${word}` : word

		if (canvasContext.measureText(testLine).width > maxWidth && previousLine) {
			return [...accumulator, word]
		}

		return [...accumulator.slice(0, -1), testLine]
	}, [""])

	lines.forEach((line, index) => {
		canvasContext.fillText(line.trim(), x, y + index * lineHeight)
	})
}

export function drawDialogBox(canvasContext, canvasElement, gameState, dialogType, gameImages = null) {
	const dialogText = getDialogText(gameState, dialogType)
	const visible = (
		dialogType === "candles" && gameState.candleHintVisible ||
		dialogType === "colors" && gameState.colorHintVisible ||
		dialogType === "scroll" && gameState.scrollHintVisible ||
		dialogType === "keypad" && gameState.keypadHintVisible ||
		dialogType === "runes" && gameState.runeChestHintVisible ||
		dialogType === "intro" && gameState.introVisible
	)

	if (!visible || !dialogText) {
		return
	}

	const characterImageKey = getCharacterImageKey(gameState, dialogType)
	const characterImage = characterImageKey && gameImages ? gameImages[characterImageKey] : null

	canvasContext.save()
	drawCharacterPortrait(canvasContext, canvasElement, characterImage, dialogType)
	canvasContext.restore()

	const panelX = INTERFACE_DIMENSIONS.DIALOG_BOX_MARGIN
	const panelY = INTERFACE_DIMENSIONS.DIALOG_BOX_Y
	const panelWidth = canvasElement.width - INTERFACE_DIMENSIONS.DIALOG_BOX_MARGIN * 2
	const panelHeight = INTERFACE_DIMENSIONS.DIALOG_BOX_HEIGHT

	canvasContext.save()
	canvasContext.fillStyle = INTERFACE_COLORS.DIALOG_BOX_BACKGROUND
	canvasContext.fillRect(panelX, panelY, panelWidth, panelHeight)

	canvasContext.strokeStyle = INTERFACE_COLORS.DIALOG_BOX_BORDER
	canvasContext.lineWidth = INTERFACE_DIMENSIONS.DIALOG_BOX_BORDER_WIDTH
	canvasContext.strokeRect(panelX, panelY, panelWidth, panelHeight)

	canvasContext.fillStyle = INTERFACE_COLORS.DIALOG_BOX_TEXT
	canvasContext.font = INTERFACE_FONTS.DIALOG_BOX_BODY
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "top"

	const textX = panelX + INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING
	const textY = panelY + INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING
	const maxTextWidth = panelWidth - INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING * 2

	wrapText(canvasContext, dialogText, textX, textY, maxTextWidth, INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_LINE_HEIGHT)
	canvasContext.restore()
}
