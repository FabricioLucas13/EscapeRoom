/**
 * 🗃️ GESTOR DE ESTADO GLOBAL DEL JUEGO (State Manager)
 * Centraliza las variables de juego y su lógica para mantener el main.js limpio.
 */
export const gameState = {
		// 📦 Variables de estado para el puzzle de las velas
	isCandleOpen: false,
	candlesOn: [], // Guardará el orden de las velas encendidas (ej:)
	candleResultText: "", // Guardará el código "3" o el aviso de error
	candlesSecretOrder:[1, 2, 3, 4], // El orden correcto que programó el equipo

	// 🚪 Abrir el panel de las velas de forma segura
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

	// 🕯️ Encender o apagar una vela (Lógica del .toggle de las compañeras)
	toggleCandleState(num) {
		this.candleResultText = "" // Limpia mensajes anteriores

		if (this.candlesOn.includes(num)) {
			// Si ya estaba encendida, la apagamos (la sacamos del array)
			this.candlesOn = this.candlesOn.filter(x => x !== num)
		} else {
			// Si estaba apagada, la encendemos (la metemos al array)
			this.candlesOn.push(num)
		}
	},

	// 🔄 Apagar todas las velas automáticamente
	resetCandles() {
		this.candlesOn = []
		this.candleResultText = ""
	},

	// ⚙️ Botón Ejecutar: Validar el orden de encendido
	checkCandles() {
		// Comparamos si el array actual es igual al secreto [1, 2, 3, 4]
		const isCorrect = JSON.stringify(this.candlesOn) === JSON.stringify(this.candlesSecretOrder)

		if (isCorrect) {
			this.candleResultText = "3" // Da el código de recompensa del HTML
		} else {
			this.candleResultText = "❌ ERROR: Las velas se han apagado"
			this.candlesOn = [] // Al fallar las apaga todas automáticamente como en su código
		}
	},

	
	// 📦 Variables de estado del teclado numérico
	isKeypadOpen: false,
	keypadInput: "",
	keypadResultText: "",
	keypadResultStatus: "",
	secretCode: "739", // La contraseña se queda protegida dentro de su lógica

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

	// 🎹 Registrar la pulsación de un número (máx 3)
	pressKey(num) {
		if (this.keypadInput.length < 3) {
			this.keypadInput += num
			this.keypadResultText = "" // Limpia texto anterior al volver a escribir
		}
	},

	// ← Borrar todo el contenido de la pantalla
	resetKeypad() {
		this.keypadInput = ""
		this.keypadResultText = ""
		this.keypadResultStatus = ""
	},

	// ✓ Validar si el código introducido es el correcto
	checkKeypad() {
		if (this.keypadInput === this.secretCode) {
			this.keypadResultText = "🎉 ACCESO CONCEDIDO"
			this.keypadResultStatus = "success"
		} else {
			this.keypadResultText = "💀 ERROR"
			this.keypadResultStatus = "error"
			this.keypadInput = "" // Resetea automáticamente como el HTML original
		}
	}

}
