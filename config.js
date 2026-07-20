// =========================================================================
// 🚀 ¿CÓMO AÑADIR COSAS NUEVAS AL JUEGO? (Guía rápida para todo el equipo)
// =========================================================================
//
// ➡️ SI QUIERES CREAR UNA HABITACIÓN NUEVA:
//    1. Ponle un número aquí abajo en la lista "ROOM" (por ejemplo: TWO: 2).
//    2. Dale un color de seguridad abajo en "INTERFACE_COLORS" por si la foto no carga.
//    3. Abre el archivo "main.js" and añade el nombre de su foto en "imageSources".
//    4. Abre "interactions.js" and añade sus zonas de clic para que el jugador pueda interactuar.
//
// ➡️ SI QUIERES CAMBIAR COLORES O TAMAÑOS:
//    - Cambia los textos con '#' en "INTERFACE_COLORS" o los números en "INTERFACE_DIMENSIONS".
//    - No hace falta tocar nada más, todo el diseño del juego se actualizará solo.
//
// =========================================================================

// 🗺️ LISTA DE HABITACIONES Y PANTALLAS (Los números que controlan dónde está el jugador)
export const ROOM = {
	START: 0,         // Menú principal: roomStart.jpg
	MAIN: 1,          // Habitación principal con los puzzles: roomMain.jpg
	EXIT_GATE: 2      // Última habitación: roomExitGate.jpg
}

// 🎨 LOS COLORES DEL JUEGO (Copia y pega aquí tus códigos de color)
export const INTERFACE_COLORS = {
	BUTTON_BACKGROUND_DEFAULT: "#1a1310",   // Color de fondo de los botones normales
	BUTTON_BACKGROUND_HOVER: "#241a16",     // Color de fondo de un botón cuando le pasas el ratón por encima
	BUTTON_BORDER_DEFAULT: "#8c6f4f",       // Color del borde de los botones and del modal
	BUTTON_BORDER_HOVER: "#d1ab7e",         // Color del borde cuando pasas el ratón por encima (efecto brillo)
	BUTTON_TEXT_DEFAULT: "#a89276",         // Color de las letras de los botones normales
	BUTTON_TEXT_HOVER: "#e8d8c3",           // Color de las letras cuando pasas el ratón por encima
	OPTIONS_MODAL_OVERLAY: "rgba(18, 13, 11, 0.95)", // El color oscuro de fondo que tapa el juego al abrir las opciones
	FALLBACK_BACKGROUND_ROOM_MAIN: "#2d2d2d",   // Color de pantalla si la foto de la habitación principal no se encuentra
	FALLBACK_BACKGROUND_ROOM_EXIT_GATE: "#245b3b", // Color de pantalla si la foto de la salida no se encuentra
	FALLBACK_BACKGROUND_ROOM_ONE: "#2d2d2d",    // Alias de compatibilidad
	FALLBACK_BACKGROUND_ROOM_FOUR: "#245b3b",   // Alias de compatibilidad
	NAVIGATION_ARROW: "#ffffff",             // Color centralizado de las flechas de navegación

	// Interfaz del Teclado Numérico (Abreviaturas BTN -> BUTTON eliminadas)
	KEYPAD_OVERLAY: "rgba(0, 0, 0, 0.8)",
	KEYPAD_SCREEN_TEXT: "#7CFFB2",
	KEYPAD_TEXT_SUCCESS: "#7CFFB2",
	KEYPAD_TEXT_ERROR: "#ff5a5a",
	KEYPAD_PANEL_BACKGROUND: "#1c1c1c",
	KEYPAD_PANEL_BORDER: "#7a6a4f",
	KEYPAD_BUTTON_NUMBER_BACKGROUND: "#3a3a3a",
	KEYPAD_BUTTON_NUMBER_TEXT: "#e8d9b5",
	KEYPAD_BUTTON_RESET_BACKGROUND: "#7a1f16",
	KEYPAD_BUTTON_RESET_TEXT: "#ffffff",
	KEYPAD_BUTTON_CHECK_BACKGROUND: "#1f8f4d",
	KEYPAD_BUTTON_CHECK_TEXT: "#000000",

	// Interfaz de las Velas
	CANDLE_FLAME_YELLOW: "#ffca28",
	CANDLE_FLAME_BLUE: "#29b6f6",
	CANDLE_FLAME_GREEN: "#66bb6a",
	CANDLE_FLAME_PURPLE: "#ab47bc",

	// 🚀 NUEVO: Estilos centralizados del pergamino blanco
	SCROLL_PAPER_BACKGROUND: "#fcf9e8",     // Color blanco hueso / pergamino antiguo
	SCROLL_PAPER_TEXT: "#1a1310",           // Color de texto oscuro para alta legibilidad
	SCROLL_PAPER_SECONDARY_TEXT: "#2b221e", // Color secundario para los párrafos de lore
	SCROLL_PAPER_BORDER: "#8c6f4f",         // Color del borde del manuscrito

	// Caja de diálogo inferior
	DIALOG_BOX_BACKGROUND: "rgba(0, 0, 0, 0.72)",
	DIALOG_BOX_BORDER: "#e8d8c3",
	DIALOG_BOX_TEXT: "#e8d8c3"
}

// 📏 MEDIDAS DEL JUEGO (Todo está medido en píxeles)
export const INTERFACE_DIMENSIONS = {
	// Menú y Modales Generales
	MENU_BUTTON_WIDTH: 225,
	MENU_BUTTON_HEIGHT: 44,
	OPTIONS_MODAL_WIDTH: 300,
	OPTIONS_MODAL_HEIGHT: 360,
	MODAL_BUTTON_WIDTH: 160,
	MODAL_BUTTON_HEIGHT: 38,
	OPTIONS_AUDIO_BUTTON_Y_OFFSET: 64,
	OPTIONS_DIFFICULTY_TITLE_Y_OFFSET: 122,
	OPTIONS_DIFFICULTY_SELECTOR_Y_OFFSET: 176,
	OPTIONS_DIFFICULTY_ARROW_SIZE: 38,
	OPTIONS_DIFFICULTY_ARROW_GAP: 12,
	OPTIONS_DIFFICULTY_LABEL_WIDTH: 150,
	OPTIONS_BACK_BUTTON_Y_OFFSET: 300,
	FULLSCREEN_BUTTON_WIDTH: 82,
	FULLSCREEN_BUTTON_HEIGHT: 30,
	FULLSCREEN_BUTTON_RIGHT_OFFSET: 18,
	FULLSCREEN_BUTTON_BOTTOM_OFFSET: 18,
	NAVIGATION_ARROW_SIZE: 22,
	NAVIGATION_ARROW_HITBOX_EXTRA_HEIGHT: 10,
	ARROW_Y_ROOM_ONE: 324,
	ARROW_X_ROOM_ONE: 600,
	ARROW_Y_ROOM_MAIN: 324, // Alias de compatibilidad
	ARROW_X_ROOM_MAIN: 600, // Alias de compatibilidad

	// Medidas del Teclado (Abreviatura BTN -> BUTTON eliminadas)
	KEYPAD_WIDTH: 270,
	KEYPAD_HEIGHT: 380,
	KEYPAD_GRID_COLUMNS: 3,
	KEYPAD_BUTTON_SIZE: 50,
	KEYPAD_GAP: 10,
	KEYPAD_GRID_START_Y_OFFSET: 130,
	KEYPAD_PANEL_CORNER_BEVEL: 15,

	// Medidas de las Velas
	CANDLE_MODAL_WIDTH: 420,
	CANDLE_MODAL_HEIGHT: 260,
	CANDLE_WIDTH: 70,
	CANDLE_HEIGHT: 90,
	CANDLE_GAP: 10,
	CANDLE_GRID_START_Y_OFFSET: 70,
	CANDLE_ACTION_BUTTON_WIDTH: 120,
	CANDLE_ACTION_BUTTON_BOTTOM_OFFSET: 55,
	CANDLE_TITLE_Y: 40,
	CANDLE_RESULT_BOTTOM_GAP: 30,
	ROOM_ONE_CANDLES_X: 130,
	ROOM_ONE_CANDLES_Y: 230,
	ROOM_ONE_CANDLES_WIDTH: 105,
	ROOM_ONE_CANDLES_HEIGHT: 90,

	ROOM_ONE_COLORS_X: 730,
	ROOM_ONE_COLORS_Y: 165,
	ROOM_ONE_COLORS_WIDTH: 70,
	ROOM_ONE_COLORS_HEIGHT: 80,

	ROOM_ONE_RUNES_X: 860,
	ROOM_ONE_RUNES_Y: 270,
	ROOM_ONE_RUNES_WIDTH: 40,
	ROOM_ONE_RUNES_HEIGHT: 40,

	// Dimensiones reales del pergamino en la Habitación Uno
	ROOM_ONE_SCROLL_X: 500,
	ROOM_ONE_SCROLL_Y: 390,
	ROOM_ONE_SCROLL_WIDTH: 125,
	ROOM_ONE_SCROLL_HEIGHT: 35,

	// Hitbox del puzzle de colores visible en la Habitación Cuatro
	ROOM_FOUR_COLORS_X: 900,
	ROOM_FOUR_COLORS_Y: 155,
	ROOM_FOUR_COLORS_WIDTH: 180,
	ROOM_FOUR_COLORS_HEIGHT: 220,

	// Dimensiones reales del teclado de la Habitación Cuatro
	ROOM_FOUR_KEYPAD_X: 440,
	ROOM_FOUR_KEYPAD_Y: 180,
	ROOM_FOUR_KEYPAD_WIDTH: 200,
	ROOM_FOUR_KEYPAD_HEIGHT: 265,

	// Alias de compatibilidad con nombres antiguos
	ROOM_MAIN_CANDLES_X: 130,
	ROOM_MAIN_CANDLES_Y: 230,
	ROOM_MAIN_CANDLES_WIDTH: 105,
	ROOM_MAIN_CANDLES_HEIGHT: 90,

	ROOM_MAIN_COLORS_X: 730,
	ROOM_MAIN_COLORS_Y: 165,
	ROOM_MAIN_COLORS_WIDTH: 70,
	ROOM_MAIN_COLORS_HEIGHT: 80,

	ROOM_MAIN_RUNES_X: 860,
	ROOM_MAIN_RUNES_Y: 270,
	ROOM_MAIN_RUNES_WIDTH: 40,
	ROOM_MAIN_RUNES_HEIGHT: 40,

	ROOM_MAIN_SCROLL_X: 500,
	ROOM_MAIN_SCROLL_Y: 390,
	ROOM_MAIN_SCROLL_WIDTH: 125,
	ROOM_MAIN_SCROLL_HEIGHT: 35,

	ROOM_EXIT_GATE_COLORS_X: 900,
	ROOM_EXIT_GATE_COLORS_Y: 155,
	ROOM_EXIT_GATE_COLORS_WIDTH: 180,
	ROOM_EXIT_GATE_COLORS_HEIGHT: 220,

	ROOM_EXIT_GATE_KEYPAD_X: 440,
	ROOM_EXIT_GATE_KEYPAD_Y: 180,
	ROOM_EXIT_GATE_KEYPAD_WIDTH: 200,
	ROOM_EXIT_GATE_KEYPAD_HEIGHT: 265,

	// 🚀 NUEVO: Medidas centralizadas de la caja del pergamino blanco
	SCROLL_MODAL_WIDTH: 460,
	SCROLL_MODAL_HEIGHT: 320,

	// Puzzle de runas
	RUNE_MODAL_OVERLAY: "rgba(0, 0, 0, 0.65)",
	RUNE_TITLE_Y: 30,
	RUNE_START_X: 70,
	RUNE_START_Y: 72,
	RUNE_RUNE_SPACING: 92,
	RUNE_PEDESTAL_START_X: 90,
	RUNE_PEDESTAL_Y: 215,
	RUNE_PEDESTAL_SPACING: 92,
	RUNE_MODAL_WIDTH: 490,
	RUNE_MODAL_HEIGHT: 345,
	RUNE_BOARD_WIDTH: 420,
	RUNE_BOARD_HEIGHT: 155,
	RUNE_SIZE: 70,
	RUNE_PEDESTAL_SIZE: 56,
	RUNE_BUTTON_WIDTH: 120,
	RUNE_BUTTON_HEIGHT: 32,
	RUNE_BUTTON_MARGIN_BOTTOM: 48,
	RUNE_RESULT_MARGIN_BOTTOM: 18,
	RUNE_BOARD_PADDING: 28,
	RUNE_BOARD_TOP: 28,
	RUNE_SLOT_ROW_Y: 88,
	RUNE_ROW_Y: 178,
	RUNE_ROW_GAP: 18,
	RUNE_SLOT_GAP: 44,
	RUNE_MODAL_CORNER_INSET: 18,
	RUNE_BOARD_RULE_MARGIN_X: 20,
	RUNE_BOARD_RULE_Y: 150,

	// 🛠️ NUEVAS MEDIDAS EXTRAÍDAS DE SCROLLTEXT.JS
	SCROLL_BORDER_LINE_WIDTH: 4,
	SCROLL_TITLE_PADDING_Y: 30,
	SCROLL_TEXT_START_PADDING_Y: 85,
	SCROLL_TEXT_LINE_SPACING_Y: 20,
	SCROLL_TEXT_MARGIN_X: 44,
	SCROLL_TEXT_EXTRA_LINE_SPACING_Y: 2,
	SCROLL_SIDE_BUTTON_WIDTH: 44,
	SCROLL_SIDE_BUTTON_HEIGHT: 72,
	SCROLL_SIDE_BUTTON_GAP_X: 12,
	SCROLL_FOOTER_PADDING_BOTTOM: 25,

	// Caja de diálogo inferior
	DIALOG_BOX_Y: 500,
	DIALOG_BOX_HEIGHT: 90,
	DIALOG_BOX_MARGIN: 24,
	DIALOG_BOX_BORDER_WIDTH: 2,
	DIALOG_BOX_TEXT_PADDING: 18,
	DIALOG_BOX_TEXT_LINE_HEIGHT: 20,
	DIALOG_CHARACTER_X: -90,

	// =====================
	// Visual tuning constants (extracts from components)
	// =====================
	BEVEL_SIZE_DEFAULT: 8,
	BEVEL_SIZE_SMALL: 6,
	BUTTON_STROKE_WIDTH_DEFAULT: 1.5,
	BUTTON_STROKE_WIDTH_HOVER: 2,

	SHADOW_BLUR_SMALL: 6,
	SHADOW_BLUR_MEDIUM: 10,
	SHADOW_BLUR_LARGE: 20,

	COLOR_SPHERE_RADIUS: 18,
	CANDLE_FLAME_RADIUS: 7,

	BUTTON_INNER_RECT_WIDTH: 22,
	BUTTON_INNER_RECT_HEIGHT: 40,

	CANDLE_STEM_WIDTH: 2,
	CANDLE_STEM_Y_OFFSET: 24,
	CANDLE_STEM_HEIGHT: 8,
	CANDLE_FLAME_Y_OFFSET: 18,

	// Keypad specific offsets
	KEYPAD_TITLE_Y_OFFSET: 40,
	KEYPAD_SCREEN_Y_OFFSET: 85
}

// 🔤 TIPOGRAFÍAS Y FUENTES CENTRALIZADAS (Nombres completamente descriptivos en inglés)
export const INTERFACE_FONTS = {
	SCROLL_TITLE: "bold 20px 'Georgia', serif",
	SCROLL_BODY: "italic 17px 'Palatino Linotype', 'Book Antiqua', serif",
	SCROLL_DROP_CAP: "bold italic 27px 'Palatino Linotype', 'Book Antiqua', serif",
	SCROLL_FOOTER: "italic 11px Arial",
	DIALOG_BOX_BODY: "16px 'Georgia', serif",

	// Keypad and common UI fonts
	BUTTON_TITLE: "bold 16px 'Georgia', serif",
	KEYPAD_TITLE: "bold 16px 'Georgia', serif",
	KEYPAD_SCREEN: "42px 'Georgia', serif",
	KEYPAD_BUTTON: "20px 'Georgia', serif",
	KEYPAD_BUTTON_SMALL: "bold 12px Arial",
	KEYPAD_RESULT: "bold 16px 'Georgia', serif",
	ACTION_BUTTON: "14px monospace"
}

// ⚙️ CONFIGURACIÓN GENERAL DEL JUEGO
export const GAME_SETTINGS = {
	DEFAULT_TIMER_DIFFICULTY: "easy",
	TIMER_DIFFICULTIES: {
		easy: {
			label: "FÁCIL",
			durationMs: 10 * 60 * 1000
		},
		standard: {
			label: "ESTÁNDAR",
			durationMs: 7 * 60 * 1000
		},
		hard: {
			label: "DIFÍCIL",
			durationMs: 5 * 60 * 1000
		}
	}
}

// ⚡ CONFIGURACIÓN DE FLUJO Y RENDIMIENTO
export const GAME_RUNTIME = {
	SHOW_MOUSE_COORDINATES: false,
	SHOW_INTERACTION_HITBOXES: false,
	TOUCH_CLICK_GUARD_MS: 600,
	REPLAY_BUTTON: {
		WIDTH: 225,
		HEIGHT: 44,
		BOTTOM_OFFSET_Y: 110
	},
	LOSS_SEQUENCE: {
		DIALOG_DURATION_MS: 1000,
		WAIT_DURATION_MS: 2000,
		INTRO_CHARACTER_MAX_HEIGHT: 300,
		INTRO_CHARACTER_X: 10,
		INTRO_CHARACTER_BOTTOM_OFFSET_Y: 96,
		PANEL_MARGIN_X: 80,
		PANEL_BOTTOM_OFFSET_Y: 140,
		PANEL_HEIGHT: 90
	},
	INTRO_SEQUENCE: {
		FIRST_LINE_DURATION_MS: 2500,
		TOTAL_DURATION_MS: 5000
	},
	RUNES: {
		CLOSE_GUARD_AFTER_SOLVE_MS: 200,
		RESET_AFTER_FAIL_MS: 1000
	}
}

// 🗂️ CATÁLOGO CENTRALIZADO DE ASSETS
export const GAME_ASSET_SOURCES = {
	AUDIO: {
		BACKGROUND_MUSIC: "musicEscapeRoom.mp3"
	},
	IMAGES: {
		start: "roomStart.jpg",
		main: "roomMain.jpg",
		exitGate: "roomExitGate.jpg",
		candlesDetail: "candleOff.jpg",
		colorsDetail: "colorPanelOff.jpg",
		scrollDetail: "tableScroll.jpg",
		chestClosed: "chestClosed.jpeg",
		chestOpenRune: "chestOpenRune.jpg",
		mainCharacterIntro: "mainCharacterIntro.png",
		mainCharacterSolving: "mainCharacterSolving.png",
		mainCharacterSolvedPuzzle: "mainCharacterSolvedPuzzle.png",
		runeOne: "runeOne.png",
		runeTwo: "runeTwo.png",
		runeThree: "runeThree.png",
		runeFour: "runeFour.png",
		winDoor: "winDoor.jpg",
		loseDoor: "loseDoor.jpg"
	},
	STAGE_VARIANTS: {
		CANDLE_ON: "candleOn.jpg",
		CANDLE_OFF: "candleOff.jpg",
		COLOR_ON: "colorPanelOn.jpg",
		COLOR_OFF: "colorPanelOff.jpg",
		MAIN_DEFAULT: "roomMain.jpg",
		MAIN_CANDLE_ON: "roomMainCandleOn.jpg",
		MAIN_COLOR_ON: "roomMainColorPanelOn.jpg",
		MAIN_ALL_ON: "roomMainPuzzleOn.jpg",
		EXIT_GATE_DEFAULT: "roomExitGate.jpg",
		EXIT_GATE_COLOR_ON: "roomExitGateColorPanelOn.jpg",
		LOSE_DOOR_DEFAULT: "loseDoor.jpg",
		LOSE_DOOR_COLOR_ON: "loseDoorColorPanelOn.jpg"
	}
}

// 🧩 LOS ENIGMAS Y RESPUESTAS DEL JUEGO
export const GAME_PUZZLES = {
	EXIT_SECRET_CODE: "739",
	CANDLE_SECRET_ORDER: [2, 3, 1, 4],
	COLOR_SOLUTION_SEQUENCE: ["amarillo", "azul", "verde", "morado"],
	RUNES_SOLUTION_SEQUENCE: [4, 1, 3],
	RUNES_SOLVED_CODE: "7",
	RUNE_IMAGE_KEYS: {
		1: "runeOne",
		2: "runeTwo",
		3: "runeThree",
		4: "runeFour"
	},

	// Textos del manuscrito paginados en 3 páginas
	SCROLL_PAGES: [
		[
			"En la danza callada del cirio y la cera,",
			"no despierta primero quien nació más cercano.",
			"La que sigue al comienzo reclama la llama,",
			"y tras ella, su hermana inmediata responde.",
			"Cuando el fuego ya aprende el camino del viento,",
			"regresa al origen que aguardaba en silencio.",
			"La que quedó más lejos contempla la escena,",
			"hasta heredar al fin la última chispa."
		],
		[
			"El viejo cofre no escucha a todas las voces.",
			"Primero reclama a quien custodia el final.",
			"Después reconoce a quien abrió el camino.",
			"Solo entonces acepta a la que precede al ocaso.",
			"Una runa aguardará en silencio,",
			"pues ninguna cerradura recibe todas las llaves."
		],
		[
			"Habla la roca.",
			"Responde después el fuego.",
			"El iris despierta."
		]
	]
}
