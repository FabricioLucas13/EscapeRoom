// =========================================================================
// 🗿 CONFIGURACIÓN INTERNA Y ESTADO DEL PUZZLE DE RUNAS
// =========================================================================
import { INTERFACE_COLORS, INTERFACE_DIMENSIONS, INTERFACE_FONTS, GAME_PUZZLES, GAME_RUNTIME } from "./config.js"
import { drawBeveledButton } from "./helpers.js"

const runeImageKeys = GAME_PUZZLES.RUNE_IMAGE_KEYS
const RUNE_CLOSE_GUARD_AFTER_SOLVE_MS = GAME_RUNTIME.RUNES.CLOSE_GUARD_AFTER_SOLVE_MS
const RUNE_SLOT_ROW_Y = INTERFACE_DIMENSIONS.RUNE_SLOT_ROW_Y
const RUNE_ROW_Y = INTERFACE_DIMENSIONS.RUNE_ROW_Y
const RUNE_ROW_GAP = INTERFACE_DIMENSIONS.RUNE_ROW_GAP
const RUNE_SLOT_GAP = INTERFACE_DIMENSIONS.RUNE_SLOT_GAP

function createRuneLayout() {
	const runeSize = INTERFACE_DIMENSIONS.RUNE_SIZE
	const totalWidth = runeSize * 4 + RUNE_ROW_GAP * 3
	const startX = (INTERFACE_DIMENSIONS.RUNE_MODAL_WIDTH - totalWidth) / 2

	return [1, 2, 3, 4].map((id, index) => ({
		id,
		x: startX + index * (runeSize + RUNE_ROW_GAP),
		y: RUNE_ROW_Y,
		homeX: startX + index * (runeSize + RUNE_ROW_GAP),
		homeY: RUNE_ROW_Y,
		imageKey: runeImageKeys[id]
	}))
}

function createPedestalLayout() {
	const pedestalSize = INTERFACE_DIMENSIONS.RUNE_PEDESTAL_SIZE
	const totalWidth = pedestalSize * 3 + RUNE_SLOT_GAP * 2
	const startX = (INTERFACE_DIMENSIONS.RUNE_MODAL_WIDTH - totalWidth) / 2

	return [0, 1, 2].map((id, index) => ({
		id,
		x: startX + index * (pedestalSize + RUNE_SLOT_GAP),
		y: RUNE_SLOT_ROW_Y,
		assignedRuneId: null
	}))
}

export const runesState = {
	isOpen: false,
	resultText: "",
	draggedIndex: null,
	lastSolvedAt: 0,
	onSolved: null,
	onClose: null,
	onFailed: null,

	dimensions: {
		modalWidth: INTERFACE_DIMENSIONS.RUNE_MODAL_WIDTH,
		modalHeight: INTERFACE_DIMENSIONS.RUNE_MODAL_HEIGHT,
		boardWidth: INTERFACE_DIMENSIONS.RUNE_BOARD_WIDTH,
		boardHeight: INTERFACE_DIMENSIONS.RUNE_BOARD_HEIGHT,
		runeSize: INTERFACE_DIMENSIONS.RUNE_SIZE,
		pedestalSize: INTERFACE_DIMENSIONS.RUNE_PEDESTAL_SIZE,
		buttonWidth: INTERFACE_DIMENSIONS.RUNE_BUTTON_WIDTH,
		buttonHeight: INTERFACE_DIMENSIONS.RUNE_BUTTON_HEIGHT,
		buttonMarginBottom: INTERFACE_DIMENSIONS.RUNE_BUTTON_MARGIN_BOTTOM,
		resultMarginBottom: INTERFACE_DIMENSIONS.RUNE_RESULT_MARGIN_BOTTOM,
		boardPadding: INTERFACE_DIMENSIONS.RUNE_BOARD_PADDING,
		boardTop: INTERFACE_DIMENSIONS.RUNE_BOARD_TOP
	},

	runes: createRuneLayout(),

	pedestals: createPedestalLayout(),

	reset() {
		this.resultText = ""
		this.draggedIndex = null
		this.lastSolvedAt = 0
		this.runes.forEach(rune => {
			rune.x = rune.homeX
			rune.y = rune.homeY
		})
		this.pedestals.forEach(pedestal => {
			pedestal.assignedRuneId = null
		})
	},

	check() {
		if (this.resultText === GAME_PUZZLES.RUNES_SOLVED_CODE) return

		const currentOrder = this.pedestals.map(pedestal => pedestal.assignedRuneId || 0)
		const solution = GAME_PUZZLES.RUNES_SOLUTION_SEQUENCE

		if (solution.length === currentOrder.length && solution.every((value, index) => value === currentOrder[index])) {
			this.resultText = GAME_PUZZLES.RUNES_SOLVED_CODE
			this.lastSolvedAt = Date.now()
			if (typeof this.onSolved === "function") {
				this.onSolved()
			}
		} else {
			this.resultText = "❌ ERROR"
			if (typeof this.onFailed === "function") {
				this.onFailed()
			}
			setTimeout(() => this.reset(), GAME_RUNTIME.RUNES.RESET_AFTER_FAIL_MS)
		}
	}
}

// =========================================================================
// 🖱️ CONTROLADORES DE EVENTOS EN CANVAS (Mousedown, Mouseup)
// =========================================================================
function getModalPosition(canvasWidth, canvasHeight) {
	return {
		modalX: canvasWidth / 2 - runesState.dimensions.modalWidth / 2,
		modalY: canvasHeight / 2 - runesState.dimensions.modalHeight / 2
	}
}

export function handleRunesMousedown(mouseX, mouseY, canvasWidth, canvasHeight) {
	if (!runesState.isOpen) return

	const { modalX, modalY } = getModalPosition(canvasWidth, canvasHeight)
	const runeSize = runesState.dimensions.runeSize

	runesState.runes.forEach((rune, index) => {
		const absX = modalX + rune.x
		const absY = modalY + rune.y

		if (mouseX >= absX && mouseX <= absX + runeSize && mouseY >= absY && mouseY <= absY + runeSize) {
			runesState.draggedIndex = index
			runesState.pedestals.forEach(pedestal => {
				if (pedestal.assignedRuneId === rune.id) {
					pedestal.assignedRuneId = null
				}
			})
		}
	})
}

export function handleRunesMouseup(mouseX, mouseY, canvasWidth, canvasHeight) {
	if (!runesState.isOpen || runesState.draggedIndex === null) return

	const rune = runesState.runes[runesState.draggedIndex]
	const { modalX, modalY } = getModalPosition(canvasWidth, canvasHeight)
	const pedestalSize = runesState.dimensions.pedestalSize
	let dropped = false

	runesState.pedestals.forEach(pedestal => {
		const absX = modalX + pedestal.x
		const absY = modalY + pedestal.y
		const centerX = absX + pedestalSize / 2
		const centerY = absY + pedestalSize / 2
		const distance = Math.hypot(mouseX - centerX, mouseY - centerY)

		if (distance <= pedestalSize / 2) {
			if (pedestal.assignedRuneId !== null) {
				const previousRune = runesState.runes.find(entry => entry.id === pedestal.assignedRuneId)
				if (previousRune) {
					previousRune.x = previousRune.homeX
					previousRune.y = previousRune.homeY
				}
			}

			rune.x = pedestal.x + (pedestalSize - runesState.dimensions.runeSize) / 2
			rune.y = pedestal.y + (pedestalSize - runesState.dimensions.runeSize) / 2
			pedestal.assignedRuneId = rune.id
			dropped = true
		}
	})

	if (!dropped) {
		rune.x = rune.homeX
		rune.y = rune.homeY
	}

	runesState.draggedIndex = null
}

export function handleRunesClick(mouseX, mouseY, canvasWidth, canvasHeight) {
	if (!runesState.isOpen) return false

	const { modalX, modalY } = getModalPosition(canvasWidth, canvasHeight)
	const buttonWidth = runesState.dimensions.buttonWidth
	const buttonHeight = runesState.dimensions.buttonHeight
	const buttonY = modalY + runesState.dimensions.modalHeight - runesState.dimensions.buttonMarginBottom
	const buttonX = modalX + (runesState.dimensions.modalWidth - buttonWidth) / 2

	if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
		runesState.check()
		return false
	}

	const screenInsideModal = mouseX >= modalX && mouseX <= modalX + runesState.dimensions.modalWidth && mouseY >= modalY && mouseY <= modalY + runesState.dimensions.modalHeight
	if (!screenInsideModal) {
		if (Date.now() - runesState.lastSolvedAt < RUNE_CLOSE_GUARD_AFTER_SOLVE_MS) {
			return false
		}

		if (typeof runesState.onClose === "function") {
			runesState.onClose("outside-click")
		} else {
			runesState.isOpen = false
		}
		return true
	}

	return false
}

// =========================================================================
// 🎨 RENDERIZADO DEL POP-UP EN EL CANVAS
// =========================================================================
function drawModalPanel(canvasContext, x, y, width, height) {
	const cornerInset = INTERFACE_DIMENSIONS.RUNE_MODAL_CORNER_INSET
	canvasContext.beginPath()
	canvasContext.moveTo(x + cornerInset, y)
	canvasContext.lineTo(x + width - cornerInset, y)
	canvasContext.lineTo(x + width, y + cornerInset)
	canvasContext.lineTo(x + width, y + height - cornerInset)
	canvasContext.lineTo(x + width - cornerInset, y + height)
	canvasContext.lineTo(x + cornerInset, y + height)
	canvasContext.lineTo(x, y + height - cornerInset)
	canvasContext.lineTo(x, y + cornerInset)
	canvasContext.closePath()
}

export function drawRunesPuzzle(canvasContext, canvasElement, gameImages, mouseX, mouseY) {
	if (!runesState.isOpen) return

	canvasContext.save()
	canvasContext.globalAlpha = 1
	canvasContext.globalCompositeOperation = "source-over"
	canvasContext.shadowColor = "transparent"
	canvasContext.shadowBlur = 0
	canvasContext.shadowOffsetX = 0
	canvasContext.shadowOffsetY = 0
	canvasContext.filter = "none"
	canvasContext.setLineDash([])

	const { modalX, modalY } = getModalPosition(canvasElement.width, canvasElement.height)
	const { modalWidth, modalHeight, runeSize, boardWidth, boardHeight, pedestalSize, buttonWidth, buttonHeight, buttonMarginBottom } = runesState.dimensions

	if (runesState.draggedIndex !== null) {
		runesState.runes[runesState.draggedIndex].x = mouseX - modalX - runeSize / 2
		runesState.runes[runesState.draggedIndex].y = mouseY - modalY - runeSize / 2
	}

	canvasContext.fillStyle = INTERFACE_DIMENSIONS.RUNE_MODAL_OVERLAY
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height)

	const gradient = canvasContext.createLinearGradient(modalX, modalY, modalX, modalY + modalHeight)
	gradient.addColorStop(0, "#3b322a")
	gradient.addColorStop(1, "#1c1713")

	drawModalPanel(canvasContext, modalX, modalY, modalWidth, modalHeight)
	canvasContext.fillStyle = gradient
	canvasContext.fill()
	canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT
	canvasContext.lineWidth = 2
	canvasContext.stroke()

	const boardLeftX = modalX + INTERFACE_DIMENSIONS.RUNE_BOARD_PADDING
	const boardTopY = modalY + INTERFACE_DIMENSIONS.RUNE_BOARD_TOP
	canvasContext.fillStyle = "rgba(255,255,255,0.04)"
	canvasContext.fillRect(boardLeftX, boardTopY, boardWidth, boardHeight)
	canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT
	canvasContext.lineWidth = 1.2
	canvasContext.strokeRect(boardLeftX, boardTopY, boardWidth, boardHeight)

	canvasContext.strokeStyle = "rgba(232, 216, 195, 0.12)"
	canvasContext.beginPath()
	canvasContext.moveTo(boardLeftX + INTERFACE_DIMENSIONS.RUNE_BOARD_RULE_MARGIN_X, modalY + INTERFACE_DIMENSIONS.RUNE_BOARD_RULE_Y)
	canvasContext.lineTo(boardLeftX + boardWidth - INTERFACE_DIMENSIONS.RUNE_BOARD_RULE_MARGIN_X, modalY + INTERFACE_DIMENSIONS.RUNE_BOARD_RULE_Y)
	canvasContext.stroke()

	runesState.pedestals.forEach(pedestal => {
		const pedestalX = modalX + pedestal.x
		const pedestalY = modalY + pedestal.y
		const pedestalCenterX = pedestalX + pedestalSize / 2
		const pedestalCenterY = pedestalY + pedestalSize / 2

		canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_BACKGROUND_HOVER
		canvasContext.beginPath()
		canvasContext.arc(pedestalCenterX, pedestalCenterY, pedestalSize / 2, 0, Math.PI * 2)
		canvasContext.fill()

		canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT
		canvasContext.lineWidth = 2
		canvasContext.beginPath()
		canvasContext.arc(pedestalCenterX, pedestalCenterY, pedestalSize / 2, 0, Math.PI * 2)
		canvasContext.stroke()
	})

	const buttonZone = {
		x: modalX + (modalWidth - buttonWidth) / 2,
		y: modalY + modalHeight - buttonMarginBottom,
		width: buttonWidth,
		height: buttonHeight
	}

	const isButtonHovered = mouseX >= buttonZone.x && mouseX <= buttonZone.x + buttonZone.width && mouseY >= buttonZone.y && mouseY <= buttonZone.y + buttonZone.height
	const buttonColors = { ...INTERFACE_COLORS }
	buttonColors.BUTTON_BACKGROUND_DEFAULT = INTERFACE_COLORS.KEYPAD_BUTTON_NUMBER_BACKGROUND
	buttonColors.BUTTON_TEXT_DEFAULT = INTERFACE_COLORS.KEYPAD_SCREEN_TEXT
	canvasContext.font = INTERFACE_FONTS.ACTION_BUTTON
	drawBeveledButton(canvasContext, canvasElement, buttonColors, buttonZone, isButtonHovered, "ACTIVAR", 6)

	runesState.runes.forEach(rune => {
		const img = gameImages[rune.imageKey]
		const drawX = modalX + rune.x
		const drawY = modalY + rune.y

		if (img && img.complete && img.naturalWidth > 0) {
			canvasContext.drawImage(img, drawX, drawY, runeSize, runeSize)
		} else {
			canvasContext.fillStyle = "#2f2a1f"
			canvasContext.fillRect(drawX, drawY, runeSize, runeSize)
			canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT
			canvasContext.lineWidth = 2
			canvasContext.strokeRect(drawX, drawY, runeSize, runeSize)
			canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER
			canvasContext.font = INTERFACE_FONTS.BUTTON_TITLE
			canvasContext.textAlign = "center"
			canvasContext.textBaseline = "middle"
			canvasContext.fillText(String(rune.id), drawX + runeSize / 2, drawY + runeSize / 2 + 1)
		}
	})

	canvasContext.restore()

}
