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

	// 🚪 Abrir el panel de forma segura
	openCandles(isOptionsOpen) {
		if (!this.isCandleOpen && !isOptionsOpen && !this.isColorPuzzleOpen) {
			this.isCandleOpen = true
		}
	},

	// ❌ Cerrar el panel y apagar todo
	closeCandles() {
		this.isCandleOpen = false
		this.resetCandles()
	},

	// 🕯️ Alternar estado (encendido/apagado) de una vela
	toggleCandleState(candleId) {
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
		const correctOrderMatch = JSON.stringify(this.candlesOn) === JSON.stringify(GAME_PUZZLES.CANDLE_SECRET_ORDER)

		if (correctOrderMatch) {
			this.candleResultText = "3"
		} else {
			this.candleResultText = "❌ ERROR: Las velas se han apagado"
			this.candlesOn = []
		}
	},

	// =========================================================================
	// 🔢 TECLADO NUMÉRICO (Habitación 4)
	// =========================================================================
	isKeypadOpen: false,       // Estado de apertura del teclado
	keypadInput: "",           // Dígitos pulsados (máx 3)
	keypadResultText: "",      // Texto de éxito o fallo
	keypadResultStatus: "",    // Estado de validación ("success"/"error")

	// 🚪 Abrir el teclado de forma segura
	openKeypad(isOptionsOpen) {
		if (!this.isKeypadOpen && !isOptionsOpen) {
			this.isKeypadOpen = true
		}
	},

	// ❌ Cerrar el teclado y limpiar el rastro
	closeKeypad() {
		this.isKeypadOpen = false
		this.keypadInput = ""
		this.keypadResultText = ""
		this.keypadResultStatus = ""
	},

	// 🎹 Registrar la pulsación de un número
	pressKey(keypadNumber) {
		if (this.keypadInput.length < 3) {
			this.keypadInput += keypadNumber
			this.keypadResultText = ""
		}
	},

	// ← Borrar la pantalla digital
	resetKeypad() {
		this.keypadInput = ""
		this.keypadResultText = ""
		this.keypadResultStatus = ""
	},

	// ✓ Validar la contraseña de escape desde config.js
	checkKeypad() {
		if (this.keypadInput === GAME_PUZZLES.EXIT_SECRET_CODE) {
			this.keypadResultText = "🎉 ACCESO CONCEDIDO"
			this.keypadResultStatus = "success"
		} else {
			this.keypadResultText = "💀 ERROR"
			this.keypadResultStatus = "error"
			this.keypadInput = ""
		}
	},

	// =========================================================================
	// 🎨 🚀 PUZZLE DE COLORES INTERCONECTADO (Habitación 1)
	// =========================================================================
	isColorPuzzleOpen: false,        // Estado de apertura del puzle de colores
	colorSelectedSequence: [],       // Secuencia de colores pulsada por el usuario (Antiguo let a)
	colorsResultText: "",            // Mensaje en pantalla de éxito ("9") o error

	// 🚪 Abrir el panel de forma segura controlando que no haya otros puzles abiertos
	openColorPuzzle(isOptionsOpen) {
		if (!this.isColorPuzzleOpen && !isOptionsOpen && !this.isCandleOpen) {
			this.isColorPuzzleOpen = true
		}
	},

	// ❌ Cerrar el panel y limpiar los datos introducidos (Antiguo closeModal)
	closeColorPuzzle() {
		this.isColorPuzzleOpen = false
		this.colorSelectedSequence = []
		this.colorsResultText = ""
	},

	// 🟡 Añadir el color seleccionado al array de control (Antigua función add)
	addColorToSequence(colorName) {
		this.colorsResultText = ""
		this.colorSelectedSequence.push(colorName)
	},

	// ⚙️ Validar combinación calculando la solución dinámicamente según el orden de las velas (Antiguo check)
	checkColorSequence() {
		// Diccionario de traducción: vincula la ID de la vela física con el string de su color
		const colorTranslationMap = {
			1: "amarillo",
			2: "azul",
			3: "verde",
			4: "morado"
		}

		// Convierte la secuencia secreta de números en su lista equivalente de colores
		// Ejemplo: si el orden es, genera ["amarillo", "azul", "verde", "morado"]
		const correctColorSequence = GAME_PUZZLES.CANDLE_SECRET_ORDER.map(candleId => colorTranslationMap[candleId])

		// Compara la combinación del jugador con la solución autocalculada
		const isSequenceCorrect = JSON.stringify(this.colorSelectedSequence) === JSON.stringify(correctColorSequence)

		if (isSequenceCorrect) {
			this.colorsResultText = "9" // Éxito: otorga el número clave del puzle
		} else {
			this.colorsResultText = "❌ COMBINACIÓN ERRÓNEA"
			this.colorSelectedSequence = [] // Resetea el puzle al fallar (Efecto shake simulado limpiando datos)
		}
	}
}

