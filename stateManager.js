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
		if (!this.isCandleOpen && !isOptionsOpen) {
			this.isCandleOpen = true
		}
	},

	// ❌ Cerrar el panel y apagar todo
	closeCandles() {
		this.isCandleOpen = false
		this.resetCandles()
	},

	// 🕯️ Alternar estado (encendido/apagado) de una vela
	toggleCandleState(num) {
		this.candleResultText = ""

		if (this.candlesOn.includes(num)) {
			this.candlesOn = this.candlesOn.filter(x => x !== num)
		} else {
			this.candlesOn.push(num)
		}
	},

	// 🔄 Apagar todas las velas automáticamente
	resetCandles() {
		this.candlesOn = []
		this.candleResultText = ""
	},

	// ⚙️ Validar el orden secuencial de encendido desde config.js
	checkCandles() {
		const isCorrect = JSON.stringify(this.candlesOn) === JSON.stringify(GAME_PUZZLES.CANDLE_SECRET_ORDER)

		if (isCorrect) {
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
	pressKey(num) {
		if (this.keypadInput.length < 3) {
			this.keypadInput += num
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
	}
}
