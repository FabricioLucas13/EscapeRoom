import { GAME_PUZZLES, GAME_RUNTIME } from "./config.js"
import { runesState } from "./runePuzzle.js"

const RUNE_CHEST_CLOSED_STEP_MS = 2200
const RUNE_CHEST_OPEN_STEP_MS = 1000

/**
 * 🗃️ GESTOR DE ESTADO GLOBAL DEL JUEGO (State Manager)
 * Centraliza las variables de juego y su lógica para mantener el main.js limpio.
 */
export const gameState = {
	// =========================================================================
	// 🕯️ PUZZLE DE LAS VELAS (Habitación 1)
	// =========================================================================
	isCandleOpen: false,    // Estado de apertura del panel
	candlesOn: [],          // Orden de las velas encendidas
	candleResultText: "",   // Mensaje de código "3" o error
	candleHintVisible: false,
	candleHintSeen: false,

	// 🚪 Abrir el panel de forma segura
	openCandles(isOptionsOpen) {
		if (!this.isCandleOpen && !isOptionsOpen && !this.isColorPuzzleOpen && !this.isBookOpen) {
			this.isCandleOpen = true
			this.candleHintVisible = true
		}
	},

	// ❌ Cerrar el panel de forma inteligente
	closeCandles() {
		this.isCandleOpen = false
		this.candleHintVisible = false
		this.candleHintSeen = true
		// Solo borramos los datos si el jugador no ha adivinado la secuencia todavía
		if (this.candleResultText !== "3") {
			this.resetCandles()
		}
	},

	// 🕯️ Alternar estado (encendido/apagado) de una vela
	toggleCandleState(candleId) {
		// Bloqueo de seguridad: Si ya se resolvió, no dejamos que pulsen nada más
		if (this.candleResultText === "3") {
			return
		}

		this.candleResultText = ""

		if (this.candlesOn.includes(candleId)) {
			this.candlesOn = this.candlesOn.filter(activeId => activeId !== candleId)
		} else {
			this.candlesOn.push(candleId)
		}
	},

	// 🔄 Apagar todas las velas automáticamente
	resetCandles() {
		this.candlesOn = []
		this.candleResultText = ""
	},

	// ⚙️ Validar el orden secuencial de encendido desde config.js
	checkCandles() {
		if (this.candleResultText === "3") {
			return
		}

		const correctOrderMatch = JSON.stringify(this.candlesOn) === JSON.stringify(GAME_PUZZLES.CANDLE_SECRET_ORDER)

		if (correctOrderMatch) {
			this.candleResultText = "3"
			this.candleHintVisible = true
			this.candleHintSeen = true
		} else {
			this.candleResultText = "❌ ERROR: Las velas se han apagado"
			this.candleHintVisible = true
			this.candleHintSeen = true
			this.candlesOn = []
		}
	},

	// =========================================================================
	// 🔢 TECLADO NUMÉRICO (Habitación 4)
	// =========================================================================
	isKeypadOpen: false,       // Estado de apertura del teclado
	keypadInput: "",           // Dígitos pulsados (máx 3)
	keypadResultStatus: "",    // Estado de validación ("success"/"error")
	keypadHintVisible: false,
	keypadHintSeen: false,
	thirdPuzzleResolved: true,  // Se asume resuelto temporalmente hasta definir el tercer puzzle
	gameWon: false,
	winTriggeredAt: null,

	// =========================================================================
	// 🗿 PUZZLE DEL COFRE DE RUNAS (Habitación 1)
	// =========================================================================
	isRuneChestOpen: false,
	isRuneChestSolved: false,
	runeChestStatus: "idle",
	runeChestHintVisible: false,
	runeChestHintSeen: false,
	runeSequenceClosedTimeoutId: null,
	runeSequenceOpenTimeoutId: null,

	clearRuneChestTimers() {
		if (this.runeSequenceClosedTimeoutId !== null) {
			clearTimeout(this.runeSequenceClosedTimeoutId)
			this.runeSequenceClosedTimeoutId = null
		}

		if (this.runeSequenceOpenTimeoutId !== null) {
			clearTimeout(this.runeSequenceOpenTimeoutId)
			this.runeSequenceOpenTimeoutId = null
		}
	},

	openRuneChest(isOptionsOpen) {
		if (this.isRuneChestOpen || isOptionsOpen || this.isKeypadOpen || this.isCandleOpen || this.isColorPuzzleOpen || this.isBookOpen) {
			return
		}

		this.clearRuneChestTimers()
		this.isRuneChestOpen = true
		this.runeChestHintVisible = true
		this.runeChestHintSeen = true

		if (this.isRuneChestSolved) {
			this.runeChestStatus = "modal"
			runesState.isOpen = true
			runesState.resultText = GAME_PUZZLES.RUNES_SOLVED_CODE
			return
		}

		runesState.reset()
		runesState.isOpen = false
		runesState.resultText = ""
		this.runeChestStatus = "intro_closed"

		this.runeSequenceClosedTimeoutId = setTimeout(() => {
			if (!this.isRuneChestOpen || this.runeChestStatus !== "intro_closed") {
				return
			}

			this.runeChestStatus = "intro_open"
			this.runeSequenceClosedTimeoutId = null
			this.runeSequenceOpenTimeoutId = setTimeout(() => {
				if (!this.isRuneChestOpen || this.runeChestStatus !== "intro_open") {
					return
				}

				this.runeChestStatus = "modal"
				runesState.isOpen = true
				this.runeSequenceOpenTimeoutId = null
			}, RUNE_CHEST_OPEN_STEP_MS)
		}, RUNE_CHEST_CLOSED_STEP_MS)
	},

	closeRuneChest() {
		this.clearRuneChestTimers()
		this.isRuneChestOpen = false
		runesState.isOpen = false
		this.runeChestStatus = "idle"
		this.runeChestHintVisible = false
		this.runeChestHintSeen = true
		if (!this.isRuneChestSolved) {
			runesState.resultText = ""
		}
	},

	failRuneChest() {
		this.runeChestStatus = "failed"
		this.runeChestHintVisible = true
		this.runeChestHintSeen = true
	},

	solveRuneChest() {
		this.clearRuneChestTimers()
		this.isRuneChestOpen = true
		this.isRuneChestSolved = true
		runesState.isOpen = true
		this.runeChestStatus = "modal"
		this.runeChestHintVisible = true
		this.runeChestHintSeen = true
		runesState.resultText = GAME_PUZZLES.RUNES_SOLVED_CODE
	},

	resetRuneChestState() {
		this.clearRuneChestTimers()
		this.isRuneChestOpen = false
		this.isRuneChestSolved = false
		runesState.isOpen = false
		runesState.reset()
		runesState.resultText = ""
		this.runeChestStatus = "idle"
		this.runeChestHintVisible = true
		this.runeChestHintSeen = true
	},

	// =========================================================================
	// SECUENCIA DE INTRO DEL JUEGO
	// =========================================================================
	introVisible: false,
	introStage: 0,
	introStartedAt: null,
	introSeen: false,






























	// 🚪 Abrir el teclado de forma segura
	openKeypad(isOptionsOpen) {
		if (!this.isKeypadOpen && !isOptionsOpen) {
			this.isKeypadOpen = true
			this.keypadHintVisible = true
		}
	},

	// 🚀 Inicia la secuencia de introducción cuando el jugador entra a la sala principal
	startIntroSequence() {
		if (this.introSeen || this.introVisible) {
			return
		}
		this.introVisible = true
		this.introStage = 1
		this.introStartedAt = Date.now()
	},

	updateIntroSequence() {
		if (!this.introVisible || !this.introStartedAt) {
			return
		}

		const elapsed = Date.now() - this.introStartedAt
		const firstLineDurationMs = GAME_RUNTIME.INTRO_SEQUENCE.FIRST_LINE_DURATION_MS
		const totalDurationMs = GAME_RUNTIME.INTRO_SEQUENCE.TOTAL_DURATION_MS

		if (elapsed >= totalDurationMs) {
			this.introVisible = false
			this.introSeen = true
			this.introStage = 0
			return
		}

		if (elapsed >= firstLineDurationMs) {
			this.introStage = 2
		}
	},

	// ❌ Cerrar el teclado y limpiar el rastro
	closeKeypad() {
		this.isKeypadOpen = false
		this.keypadInput = ""
		this.keypadResultStatus = ""
		this.keypadHintVisible = false
		this.keypadHintSeen = true
	},

	// 🎹 Registrar la pulsación de un número
	pressKey(keypadNumber) {
		if (this.keypadInput.length < 3) {
			this.keypadInput += keypadNumber
		}
	},

	// ← Borrar la pantalla digital
	resetKeypad() {
		this.keypadInput = ""
		this.keypadResultStatus = ""
	},

	// ✓ Validar la contraseña de escape desde config.js
	checkKeypad() {
		if (this.keypadInput === GAME_PUZZLES.EXIT_SECRET_CODE) {
			this.keypadResultStatus = "success"
			this.keypadHintVisible = false
			this.keypadHintSeen = true
			this.isKeypadOpen = false
			this.isCandleOpen = false
			this.isColorPuzzleOpen = false
			this.isBookOpen = false
			this.gameWon = true
			this.winTriggeredAt = Date.now()
		} else {
			this.keypadResultStatus = "error"
			this.keypadHintVisible = true
			this.keypadHintSeen = true
			this.keypadInput = ""
		}
	},

	// =========================================================================
	// 🎨 PUZZLE DE COLORES PERSISTENTE (Habitación 1)
	// =========================================================================
	isColorPuzzleOpen: false,        // Estado de apertura del puzle de colores
	colorSelectedSequence: [],       // Secuencia de colores pulsada por el usuario
	colorsResultText: "",            // Mensaje en pantalla de éxito ("9") o error
	colorHintVisible: false,
	colorHintSeen: false,

	// 🚪 Abrir el panel de forma segura controlando que no haya otros puzles abiertos
	openColorPuzzle(isOptionsOpen) {
		if (!this.isColorPuzzleOpen && !isOptionsOpen && !this.isCandleOpen && !this.isBookOpen) {
			this.isColorPuzzleOpen = true
			this.colorHintVisible = true
		}
	},

	// ❌ Cerrar el panel de forma inteligente
	closeColorPuzzle() {
		this.isColorPuzzleOpen = false
		this.colorHintVisible = false
		this.colorHintSeen = true
		// Solo borramos la secuencia introducida si no han ganado el puzle todavía
		if (this.colorsResultText !== "9") {
			this.colorSelectedSequence = []
			this.colorsResultText = ""
		}
	},

	// 🟡 Añadir el color seleccionado al array de control
	addColorToSequence(colorName) {
		// Bloqueo de seguridad. Si ya se resolvió, congelamos los clics
		if (this.colorsResultText === "9") {
			return
		}

		this.colorsResultText = ""
		this.colorSelectedSequence.push(colorName)
	},

	// ⚙️ Validar combinación usando una secuencia fija desde config.js
	checkColorSequence() {
		if (this.colorsResultText === "9") {
			return
		}

		const isSequenceCorrect = JSON.stringify(this.colorSelectedSequence) === JSON.stringify(GAME_PUZZLES.COLOR_SOLUTION_SEQUENCE)

		if (isSequenceCorrect) {
			this.colorsResultText = "9"
			this.colorHintVisible = true
			this.colorHintSeen = true
		} else {
			this.colorsResultText = "❌ COMBINACIÓN ERRÓNEA"
			this.colorHintVisible = true
			this.colorHintSeen = true
			this.colorSelectedSequence = []
		}
	},

	// =========================================================================
	// 📖 🚀 NUEVO - LIBRO (Habitación 1)
	// =========================================================================
	isBookOpen: false,             // Estado de apertura de la vista del manuscrito
	bookPageIndex: 0,
	bookHintVisible: false,
	bookHintSeen: false,

	// 🚪 Abrir el manuscrito de forma segura controlando la jerarquía de interfaces
	openBook(isOptionsOpen) {
		if (!this.isBookOpen && !isOptionsOpen && !this.isCandleOpen && !this.isColorPuzzleOpen) {
			this.isBookOpen = true
			this.bookPageIndex = 0
			this.bookHintVisible = true
		}
	},

	nextBookPage() {
		this.bookPageIndex = Math.min(this.bookPageIndex + 1, GAME_PUZZLES.BOOK_PAGES.length - 1)
	},

	previousBookPage() {
		this.bookPageIndex = Math.max(this.bookPageIndex - 1, 0)
	},

	// ❌ Cerrar la vista del manuscrito
	closeBook() {
		this.isBookOpen = false
		this.bookPageIndex = 0
		this.bookHintVisible = false
		this.bookHintSeen = true
	},

	resetForNewGame() {
		this.isCandleOpen = false
		this.candlesOn = []
		this.candleResultText = ""
		this.candleHintVisible = false
		this.candleHintSeen = false

		this.isKeypadOpen = false
		this.keypadInput = ""
		this.keypadResultStatus = ""
		this.keypadHintVisible = false
		this.keypadHintSeen = false
		this.thirdPuzzleResolved = true
		this.gameWon = false
		this.winTriggeredAt = null

		this.isColorPuzzleOpen = false
		this.colorSelectedSequence = []
		this.colorsResultText = ""
		this.colorHintVisible = false
		this.colorHintSeen = false

		this.isBookOpen = false
		this.bookPageIndex = 0
		this.bookHintVisible = false
		this.bookHintSeen = false

		this.clearRuneChestTimers()
		this.isRuneChestOpen = false
		this.isRuneChestSolved = false
		this.runeChestStatus = "idle"
		this.runeChestHintVisible = false
		this.runeChestHintSeen = false
		runesState.isOpen = false
		runesState.reset()
		runesState.resultText = ""

		this.introVisible = false
		this.introStage = 0
		this.introStartedAt = null
		this.introSeen = false
	}
}
