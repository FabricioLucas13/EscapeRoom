/**
 * 🗃️ GESTOR DE ESTADO GLOBAL DEL JUEGO (State Manager)
 * Centraliza las variables de juego y su lógica para mantener el main.js limpio.
 */
export const gameState = {
	// 📦 Variables de estado del teclado numérico
	isKeypadOpen: false,
	keypadInput: "",
	keypadResultText: "",
	keypadResultStatus: "",
	secretCode: "739", // La contraseña se queda protegida dentro de su lógica












// esto tambien lo añadi
// =========================================================================
    // 🧩 NUEVAS PROPIEDADES PARA EL PUZZLE DE SÍMBOLOS (Añadir dentro de gameState)
    // =========================================================================
    isSymbolsOpen: false,
    symbolsInput: [],          
    symbolsResultText: "",     
    symbolsResultStatus: "",   
    symbolsShakeTimer: 0,      

    openSymbols(isOptionsOpen) {
        if (!this.isSymbolsOpen && !isOptionsOpen) {
            this.isSymbolsOpen = true;
            this.symbolsInput = [];
            this.symbolsResultText = "";
            this.symbolsResultStatus = "";
            this.symbolsShakeTimer = 0;
        }
    },

    closeSymbols() {
        this.isSymbolsOpen = false;
        this.symbolsInput = [];
        this.symbolsResultText = "";
        this.symbolsResultStatus = "";
        this.symbolsShakeTimer = 0;
    },

    pressSymbol(symbolId) {
        if (this.symbolsResultStatus === "success") return;
        this.symbolsInput.push(symbolId);
        this.symbolsResultText = ""; 
    },

    checkSymbols() {
        const correctSequence = [4, 1, 2, 3]; // Luna, Sol, Triángulo, Estrella
        
        if (JSON.stringify(this.symbolsInput) === JSON.stringify(correctSequence)) {
            this.symbolsResultText = "CÓDIGO OBTENIDO: 7";
            this.symbolsResultStatus = "success";
        } else {
            this.symbolsInput = [];
            this.symbolsResultText = "ERROR: INTÉNTALO DE NUEVO";
            this.symbolsResultStatus = "error";
            this.symbolsShakeTimer = 24; // Activa el efecto visual de vibración
        }
    },

    updateShake() {
        if (this.symbolsShakeTimer > 0) {
            this.symbolsShakeTimer--;
        }
    },





























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
