import { INTERFACE_COLORS, INTERFACE_DIMENSIONS, INTERFACE_FONTS } from "./config.js"

function getDialogText(gameState, dialogType) {
	const DIALOG_TEXT = {
	candles: {
		notStarted: "Las velas parecen esperar un antiguo ritual. Tal vez el libro sepa cómo despertarlas.",
		startedAgain: "La llama recuerda... pero el orden aún no es el correcto.",
		solved: "Una llama cambia de color. Entre las cenizas aparece grabado un 3.",
		error: "Las llamas se apagan de golpe. El ritual debe seguir otro orden."
	},

	colors: {
		notStarted: "Extraños cristales aguardan una secuencia. Sus tonos recuerdan al brillo de las velas.",
		patternHint: "Las llamas dejaron una pista. Quizá sus colores también lo hagan.",
		error: "La luz se desvanece antes de completarse el patrón.",
		solved: "Los cristales vibran un instante. Entre ellos aparece marcado un 9."
	},

	book: {
		firstOpen: "El libro está cubierto de versos. Tal vez oculten algo más que palabras.",
		again: "Cada estrofa parece guardar un secreto distinto."
	},

	keypad: {
		solvedAll: "Tres cifras... tres enigmas... ya puedo probar la combinación.",
		needsClues: "Aún me faltan partes de la combinación.",
		failed: "La cerradura permanece inmóvil.",
		opened: "La puerta cede."
	},

	runes: {
		firstOpen: "El cofre se entreabre, como si hubiera esperado este momento.",
		opened: "Las runas parecen reclamar un orden concreto.",
		failed: "Las piedras se apagan. No era esa la secuencia.",
		solved: "Las runas resplandecen. Un 7 aparece grabado en el interior del cofre."
	},

	intro: {
		whereAmI: "¿Dónde... estoy?",
		mustLeave: "Sea lo que sea este lugar, debo encontrar la salida."
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
				return DIALOG_TEXT.colors.solved
			}
			if (gameState.candleResultText === "3") {
				return DIALOG_TEXT.colors.patternHint
			}
			if (gameState.colorHintSeen) {
				return DIALOG_TEXT.colors.error
			}
			return DIALOG_TEXT.colors.notStarted

		case "book":
			return gameState.bookHintSeen ? DIALOG_TEXT.book.again : DIALOG_TEXT.book.firstOpen

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
				return DIALOG_TEXT.keypad.needsClues
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

	if (dialogType === "book") {
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
	const drawX = INTERFACE_DIMENSIONS.DIALOG_CHARACTER_X
	const drawY = INTERFACE_DIMENSIONS.DIALOG_BOX_Y - drawHeight - 6

	canvasContext.drawImage(characterImage, drawX, drawY, drawWidth, drawHeight)
}

function getWrappedLines(canvasContext, text, maxWidth) {
	const words = text.split(" ")
	return words.reduce((accumulator, word) => {
		const previousLine = accumulator[accumulator.length - 1] || ""
		const testLine = previousLine ? `${previousLine} ${word}` : word

		if (canvasContext.measureText(testLine).width > maxWidth && previousLine) {
			return [...accumulator, word]
		}

		return [...accumulator.slice(0, -1), testLine]
	}, [""])
}

export function drawDialogBox(canvasContext, canvasElement, gameState, dialogType, gameImages = null) {
	const dialogText = getDialogText(gameState, dialogType)
	const visible = (
		dialogType === "candles" && gameState.candleHintVisible ||
		dialogType === "colors" && gameState.colorHintVisible ||
		dialogType === "book" && gameState.bookHintVisible ||
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
	const panelGradient = canvasContext.createLinearGradient(panelX, panelY, panelX, panelY + panelHeight)
	panelGradient.addColorStop(0, "rgba(0, 0, 0, 0.78)")
	panelGradient.addColorStop(1, "rgba(0, 0, 0, 0.62)")
	canvasContext.fillStyle = panelGradient
	canvasContext.fillRect(panelX, panelY, panelWidth, panelHeight)

	canvasContext.strokeStyle = INTERFACE_COLORS.DIALOG_BOX_BORDER
	canvasContext.lineWidth = INTERFACE_DIMENSIONS.DIALOG_BOX_BORDER_WIDTH
	canvasContext.strokeRect(panelX, panelY, panelWidth, panelHeight)

	canvasContext.fillStyle = INTERFACE_COLORS.DIALOG_BOX_TEXT
	canvasContext.textAlign = "left"
	canvasContext.textBaseline = "top"
	canvasContext.shadowColor = "rgba(0, 0, 0, 0.35)"
	canvasContext.shadowBlur = 1
	canvasContext.shadowOffsetX = 0
	canvasContext.shadowOffsetY = 1

	const textX = panelX + INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING
	const textY = panelY + INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING
	const maxTextWidth = panelWidth - INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING * 2
	const maxTextHeight = panelHeight - INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_PADDING * 2

	const fontCandidates = [
		{ font: INTERFACE_FONTS.DIALOG_BOX_BODY, lineHeight: INTERFACE_DIMENSIONS.DIALOG_BOX_TEXT_LINE_HEIGHT },
		{ font: "15px 'Georgia', serif", lineHeight: 19 },
		{ font: "14px 'Georgia', serif", lineHeight: 18 }
	]

	let selectedFont = fontCandidates[fontCandidates.length - 1]
	let selectedLines = []
	for (let i = 0; i < fontCandidates.length; i++) {
		canvasContext.font = fontCandidates[i].font
		const candidateLines = getWrappedLines(canvasContext, dialogText, maxTextWidth)
		if (candidateLines.length * fontCandidates[i].lineHeight <= maxTextHeight) {
			selectedFont = fontCandidates[i]
			selectedLines = candidateLines
			break
		}

		selectedLines = candidateLines
	}

	canvasContext.font = selectedFont.font
	selectedLines.forEach((line, index) => {
		canvasContext.fillText(line.trim(), textX, textY + index * selectedFont.lineHeight)
	})

	canvasContext.shadowColor = "transparent"
	canvasContext.restore()
}
