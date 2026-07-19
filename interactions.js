import { INTERFACE_DIMENSIONS, ROOM } from "./config.js"

// =========================================================================
// 🚀 ¿CÓMO AÑADIR NUEVOS BOTONES O INTERACCIONES? (Guía rápida para el equipo)
// =========================================================================
//
// ➡️ SI QUIERES PONER ZONAS DE CLIC EN UNA HABITACIÓN NUEVA:
//    - Añade una lista nueva abajo del todo dentro de "getRoomInteractions".
//    - Ejemplo para la Habitación Dos: 
//      [ROOM.TWO]: [ { x: 100, y: 150, width: 50, height: 50, action: () => { ... } } ]
//
// ➡️ SI QUIERES HACER ALGO COMPLEJO (como guardar datos o cambiar un estado de main.js):
//    - Primero escribe la función en "main.js" y pásala dentro de "initializeInteractions".
//    - Añade su nombre en la lista "gameEngineBridge" de aquí abajo y úsala en tu botón.
//
// =========================================================================

// 🔗 ENLACES HACIA EL ARCHIVO PRINCIPAL (main.js)
const gameEngineBridge = {
	changeRoomRef: null,          // Guarda la función para cambiar de habitación
	openExitKeypadRef: null,      // Guarda la función para abrir el teclado numérico
	getIsMusicMuted: () => false, // Mira si la música está silenciada en el menú principal
	toggleMusicCallback: null,    // Función para silenciar o activar la música
	closeOptionsModal: null,      // Función para cerrar el cuadro de opciones
	openOptionsModal: null,       // Función para abrir el cuadro de opciones
	getGameMusic: null,            // Accede al reproductor de música del juego
	
	// Enlaces nuevos para el teclado numérico:
	closeExitKeypadRef: null,     // Función para cerrar el teclado numérico
	keypadPressRef: null,         // Función para registrar un número pulsado
	keypadResetRef: null,         // Función para borrar (botón flecha)
	keypadCheckRef: null          // Función para comprobar la contraseña (botón check)
}

// 🟢 CONECTAR LOS ARCHIVOS (Se ejecuta una sola vez al arrancar el juego)
export function initializeInteractions(engineActions) {
	gameEngineBridge.changeRoomRef = engineActions.changeRoom
	gameEngineBridge.openExitKeypadRef = engineActions.openExitKeypad
	gameEngineBridge.getIsMusicMuted = engineActions.getIsMusicMuted
	gameEngineBridge.toggleMusicCallback = engineActions.toggleMusic
	gameEngineBridge.closeOptionsModal = engineActions.closeOptionsModal
	gameEngineBridge.openOptionsModal = engineActions.openOptionsModal
	gameEngineBridge.getGameMusic = engineActions.getGameMusic
	
	// Conexión de las nuevas funciones del teclado:
	gameEngineBridge.closeExitKeypadRef = engineActions.closeExitKeypad
	gameEngineBridge.keypadPressRef = engineActions.keypadPress
	gameEngineBridge.keypadResetRef = engineActions.keypadReset
	gameEngineBridge.keypadCheckRef = engineActions.keypadCheck
}

// 🎵 SILENCIAR O ACTIVAR LA MÚSICA
export function toggleMusic() {
	gameEngineBridge.toggleMusicCallback()
}

// 🔳 ZONAS DE CLIC PARA EL MENÚ DE OPCIONES (El cuadro de sonido)
export function getModalInteractions(canvasElement) {
	const modalTopY = canvasElement.height / 2 - INTERFACE_DIMENSIONS.OPTIONS_MODAL_HEIGHT / 2
	const modalButtonLeftX = canvasElement.width / 2 - INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH / 2

	return [
		{ 
			x: modalButtonLeftX, 
			y: modalTopY + 70, 
			width: INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH, 
			height: INTERFACE_DIMENSIONS.MODAL_BUTTON_HEIGHT, 
			action: toggleMusic 
		},
		{ 
			x: modalButtonLeftX, 
			y: modalTopY + 140, 
			width: INTERFACE_DIMENSIONS.MODAL_BUTTON_WIDTH, 
			height: INTERFACE_DIMENSIONS.MODAL_BUTTON_HEIGHT, 
			action: () => gameEngineBridge.closeOptionsModal() 
		}
	]
}

// 🔢 ZONAS DE CLIC DINÁMICAS PARA EL TECLADO NUMÉRICO (Grid 3x4 + Cruz de cerrar)
export function getKeypadInteractions(canvasElement) {
	const padWidth = INTERFACE_DIMENSIONS.KEYPAD_WIDTH || 270
	const padHeight = INTERFACE_DIMENSIONS.KEYPAD_HEIGHT || 380
	const btnSize = INTERFACE_DIMENSIONS.KEYPAD_BTN_SIZE || 50
	const gap = INTERFACE_DIMENSIONS.KEYPAD_GAP || 10

	const panelX = canvasElement.width / 2 - padWidth / 2
	const panelY = canvasElement.height / 2 - padHeight / 2
	
	// El teclado empieza a calcular sus botones abajo del título y la pantalla (Y: +130)
	const startGridX = panelX + (padWidth - (btnSize * 3 + gap * 2)) / 2
	const startGridY = panelY + 130

	// Orden exacto de los botones tal y como lo diseñó el equipo en el HTML
	const layout = [
		{ label: "1", action: () => gameEngineBridge.keypadPressRef("1") },
		{ label: "2", action: () => gameEngineBridge.keypadPressRef("2") },
		{ label: "3", action: () => gameEngineBridge.keypadPressRef("3") },
		{ label: "4", action: () => gameEngineBridge.keypadPressRef("4") },
		{ label: "5", action: () => gameEngineBridge.keypadPressRef("5") },
		{ label: "6", action: () => gameEngineBridge.keypadPressRef("6") },
		{ label: "7", action: () => gameEngineBridge.keypadPressRef("7") },
		{ label: "8", action: () => gameEngineBridge.keypadPressRef("8") },
		{ label: "9", action: () => gameEngineBridge.keypadPressRef("9") },
		{ label: "←", action: () => gameEngineBridge.keypadResetRef() },
		{ label: "0", action: () => gameEngineBridge.keypadPressRef("0") },
		{ label: "✓", action: () => gameEngineBridge.keypadCheckRef() }
	]

	const zones = []

	// Generamos matemáticamente las cajas de colisión para los 12 botones
	layout.forEach((btn, index) => {
		const col = index % 3
		const row = Math.floor(index / 3)

		zones.push({
			x: startGridX + col * (btnSize + gap),
			y: startGridY + row * (btnSize + gap),
			width: btnSize,
			height: btnSize,
			action: btn.action,
			label: btn.label // Pasamos la etiqueta para que main.js la dibuje
		})
	})

	// Añadimos la cruz (✕) para poder cerrar el pop-up arriba a la derecha
	zones.push({
		x: panelX + padWidth - 30,
		y: panelY + 10,
		width: 20,
		height: 20,
		action: () => gameEngineBridge.closeExitKeypadRef(),
		label: "✕"
	})

	return zones
}

// 🗺️ MAPA DE CLICS DE TODO EL JUEGO (Zonas interactivas)
export function getRoomInteractions(canvasElement) {
	return {
		[ROOM.START]: [
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 - 35,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH, 
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => { 
					gameEngineBridge.changeRoomRef(ROOM.ONE) 
					if (!gameEngineBridge.getIsMusicMuted()) {
						gameEngineBridge.getGameMusic().play().catch(() => {})
					}
				}
			},
			{
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH / 2,
				y: canvasElement.height / 2 + 25,
				width: INTERFACE_DIMENSIONS.MENU_BUTTON_WIDTH, 
				height: INTERFACE_DIMENSIONS.MENU_BUTTON_HEIGHT,
				action: () => gameEngineBridge.openOptionsModal()
			}
		],
		[ROOM.ONE]: [
			{ 
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, 
				y: INTERFACE_DIMENSIONS.ARROW_Y_ROOM_ONE, 
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2, 
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + 10, 
				action: () => gameEngineBridge.changeRoomRef(ROOM.FOUR) 
			}
		],
		[ROOM.FOUR]: [
			{ 
				x: canvasElement.width / 2 - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE, 
				y: canvasElement.height - INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE - 10, 
				width: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE * 2, 
				height: INTERFACE_DIMENSIONS.NAVIGATION_ARROW_SIZE + 10, 
				action: () => gameEngineBridge.changeRoomRef(ROOM.ONE) 
			},
			{ 
				x: 490, 
				y: 235, 
				width: 140, 
				height: 185, 
				action: () => gameEngineBridge.openExitKeypadRef() 
			}
		]
	}
}

















// añadi esto fabri 

import { gameState } from "./stateManager.js" // Asegúrate de que tienes este import arriba si no existía

// =========================================================================
// 🎯 INTERACCIONES DEL PUZZLE DE SÍMBOLOS (Añadir al final de interactions.js)
// =========================================================================

export function getSymbolsInteractions(canvasElement) {
    const padWidth = 420;
    const padHeight = 280;
    const padLeftX = canvasElement.width / 2 - padWidth / 2;
    const padTopY = canvasElement.height / 2 - padHeight / 2;

    const zones = [];

    // 1. Botón Cerrar (✕) - Arriba a la derecha
    zones.push({
        label: "✕",
        x: padLeftX + padWidth - 35,
        y: padTopY + 15,
        width: 25,
        height: 25,
        action: () => { gameState.closeSymbols(); }
    });

    // 2. Botones de los 4 símbolos: ☀️(1), 🔺(2), ✦(3), 🌙(4)
    const btnSize = 60;
    const gap = 15;
    const totalButtonsWidth = (btnSize * 4) + (gap * 3);
    const startX = canvasElement.width / 2 - totalButtonsWidth / 2;
    const buttonsY = padTopY + 100;

    const symbols = [
        { label: "☀️", id: 1 },
        { label: "🔺", id: 2 },
        { label: "✦", id: 3 },
        { label: "🌙", id: 4 }
    ];

    symbols.forEach((symbol, index) => {
        zones.push({
            label: symbol.label,
            symbolId: symbol.id,
            x: startX + index * (btnSize + gap),
            y: buttonsY,
            width: btnSize,
            height: btnSize,
            action: () => { gameState.pressSymbol(symbol.id); }
        });
    });

    // 3. Botón Ejecutar (⚙️ Ejecutar) - Abajo en el centro
    const devBtnWidth = 140;
    const devBtnHeight = 36;
    zones.push({
        label: "⚙️ Ejecutar",
        x: canvasElement.width / 2 - devBtnWidth / 2,
        y: padTopY + padHeight - 65,
        width: devBtnWidth,
        height: devBtnHeight,
        action: () => { gameState.checkSymbols(); }
    });

    return zones;
}