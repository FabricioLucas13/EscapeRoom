import { GAME_PUZZLES } from "./config.js"

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
		if (!this.isCandleOpen && !isOptionsOpen && !this.isColorPuzzleOpen && !this.isScrollOpen) {
			this.isCandleOpen = true
			this.candleHintVisible = true
		}
	},

	// ❌ Cerrar el panel de forma inteligente
	closeCandles() {
		this.isCandleOpen = false
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

		if (elapsed >= 2000) {
			this.introVisible = false
			this.introSeen = true
			this.introStage = 0
			return
		}

		if (elapsed >= 1000) {
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
			this.isScrollOpen = false
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
		if (!this.isColorPuzzleOpen && !isOptionsOpen && !this.isCandleOpen && !this.isScrollOpen) {
			this.isColorPuzzleOpen = true
			this.colorHintVisible = true
		}
	},

	// ❌ Cerrar el panel de forma inteligente
	closeColorPuzzle() {
		this.isColorPuzzleOpen = false
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

	// ⚙️ Validar combinación calculando la solución dinámicamente según el orden de las velas
	checkColorSequence() {
		if (this.colorsResultText === "9") {
			return
		}

		const colorTranslationMap = {
			1: "amarillo",
			2: "azul",
			3: "verde",
			4: "morado"
		}

		const correctColorSequence = GAME_PUZZLES.CANDLE_SECRET_ORDER.map(candleId => colorTranslationMap[candleId])
		const isSequenceCorrect = JSON.stringify(this.colorSelectedSequence) === JSON.stringify(correctColorSequence)

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
	// 📜 🚀 NUEVO - PERGAMINO DESENROLLADO (Habitación 1)
	// =========================================================================
	isScrollOpen: false,             // Estado de apertura de la vista del manuscrito
	scrollHintVisible: false,
	scrollHintSeen: false,

	// 🚪 Abrir el manuscrito de forma segura controlando la jerarquía de interfaces
	openScroll(isOptionsOpen) {
		if (!this.isScrollOpen && !isOptionsOpen && !this.isCandleOpen && !this.isColorPuzzleOpen) {
			this.isScrollOpen = true
			this.scrollHintVisible = true
		}
	},

	// ❌ Cerrar la vista del manuscrito
	closeScroll() {
		this.isScrollOpen = false
		this.scrollHintVisible = false
		this.scrollHintSeen = true
	}
}
