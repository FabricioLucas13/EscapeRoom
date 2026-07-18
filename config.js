// =========================================================================
// 🚀 ¿CÓMO AÑADIR COSAS NUEVAS AL JUEGO? (Guía rápida para todo el equipo)
// =========================================================================
//
// ➡️ SI QUIERES CREAR UNA HABITACIÓN NUEVA:
//    1. Ponle un número aquí abajo en la lista "ROOM" (por ejemplo: TWO: 2).
//    2. Dale un color de seguridad abajo en "INTERFACE_COLORS" por si la foto no carga.
//    3. Abre el archivo "main.js" y añade el nombre de su foto en "imageSources".
//    4. Abre "interactions.js" y añade sus zonas de clic para que el jugador pueda interactuar.
//
// ➡️ SI QUIERES CAMBIAR COLORES O TAMAÑOS:
//    - Cambia los textos con '#' en "INTERFACE_COLORS" o los números en "INTERFACE_DIMENSIONS".
//    - No hace falta tocar nada más, todo el diseño del juego se actualizará solo.
//
// =========================================================================

// 🗺️ LISTA DE HABITACIONES Y PANTALLAS (Los números que controlan dónde está el jugador)
export const ROOM = {
	START: 0,     // El menú principal donde empiezas
	ONE: 1,       // La primera habitación (usa la foto roomOne.jpg)
	FOUR: 4       // La última habitación del puzzle (usa la foto roomFour.jpg)
}

// 🎨 LOS COLORES DEL JUEGO (Copia y pega aquí tus códigos de color)
export const INTERFACE_COLORS = {
	BUTTON_BACKGROUND_DEFAULT: "#1a1310",   // Color de fondo de los botones normales
	BUTTON_BACKGROUND_HOVER: "#241a16",     // Color de fondo de un botón cuando le pasas el ratón por encima
	BUTTON_BORDER_DEFAULT: "#8c6f4f",       // Color del borde de los botones y del modal
	BUTTON_BORDER_HOVER: "#d1ab7e",         // Color del borde cuando pasas el ratón por encima (efecto brillo)
	BUTTON_TEXT_DEFAULT: "#a89276",         // Color de las letras de los botones normales
	BUTTON_TEXT_HOVER: "#e8d8c3",           // Color de las letras cuando pasas el ratón por encima
	OPTIONS_MODAL_OVERLAY: "rgba(18, 13, 11, 0.95)", // El color oscuro de fondo que tapa el juego al abrir las opciones
	FALLBACK_BACKGROUND_ROOM_ONE: "#2d2d2d",  // Color de pantalla si la foto de la habitación 1 no se encuentra
	FALLBACK_BACKGROUND_ROOM_FOUR: "#245b3b",  // Color de pantalla si la foto de la habitación 4 no se encuentra
	NAVIGATION_ARROW: "#ffffff",             // Color centralizado de las flechas de navegación
	
	// Interfaz del Teclado Numérico
	KEYPAD_OVERLAY: "rgba(0, 0, 0, 0.8)",         
	KEYPAD_SCREEN_TEXT: "#7CFFB2",               
	KEYPAD_TEXT_SUCCESS: "#7CFFB2",              
	KEYPAD_TEXT_ERROR: "#ff5a5a",                 
	KEYPAD_PANEL_BACKGROUND: "#1c1c1c",          
	KEYPAD_PANEL_BORDER: "#7a6a4f",              
	KEYPAD_BTN_NUM_BG: "#3a3a3a",                
	KEYPAD_BTN_NUM_TEXT: "#e8d9b5",              
	KEYPAD_BTN_RESET_BG: "#7a1f16",              
	KEYPAD_BTN_RESET_TEXT: "#ffffff",            
	KEYPAD_BTN_CHECK_BG: "#1f8f4d",              
	KEYPAD_BTN_CHECK_TEXT: "#000000",             

	// Interfaz de las Velas
	CANDLE_FLAME_YELLOW: "#ffca28",
	CANDLE_FLAME_BLUE: "#29b6f6",
	CANDLE_FLAME_GREEN: "#66bb6a",
	CANDLE_FLAME_PURPLE: "#ab47bc"
}

// 📏 MEDIDAS DEL JUEGO (Todo está medido en píxeles)
export const INTERFACE_DIMENSIONS = {
	MENU_BUTTON_WIDTH: 225,          
	MENU_BUTTON_HEIGHT: 44,          
	OPTIONS_MODAL_WIDTH: 300,        
	OPTIONS_MODAL_HEIGHT: 220,       
	MODAL_BUTTON_WIDTH: 160,         
	MODAL_BUTTON_HEIGHT: 38,         
	NAVIGATION_ARROW_SIZE: 30,       
	ARROW_Y_ROOM_ONE: 360,       
	
	// Medidas del Teclado
	KEYPAD_WIDTH: 270,                           
	KEYPAD_HEIGHT: 380,                          
	KEYPAD_GRID_COLS: 3,                         
	KEYPAD_BTN_SIZE: 50,                         
	KEYPAD_GAP: 10,                               

	// Medidas de las Velas
	CANDLE_MODAL_WIDTH: 420,          
	CANDLE_MODAL_HEIGHT: 260,         
	CANDLE_WIDTH: 70,                 
	CANDLE_HEIGHT: 90,
	CANDLE_GAP: 10,
	CANDLE_TITLE_Y: 40,                // 🧹 OPTIMIZADO: Altura fija del título del puzzle
	CANDLE_RESULT_BOTTOM_GAP: 30,      // 🧹 OPTIMIZADO: Separación inferior para el texto del código/error

	// Coordenadas fijas de los objetos interactivos (Hitboxes)
	ROOM_ONE_CANDLES_X: 130,
	ROOM_ONE_CANDLES_Y: 230,
	ROOM_ONE_CANDLES_WIDTH: 105,
	ROOM_ONE_CANDLES_HEIGHT: 90,

	ROOM_FOUR_KEYPAD_X: 490,
	ROOM_FOUR_KEYPAD_Y: 235,
	ROOM_FOUR_KEYPAD_WIDTH: 140,
	ROOM_FOUR_KEYPAD_HEIGHT: 185
}

// 🧩 LOS ENIGMAS Y RESPUESTAS DEL JUEGO
export const GAME_PUZZLES = {
	EXIT_SECRET_CODE: "739",                      
	CANDLE_SECRET_ORDER: [1, 2, 3, 4]  
}
