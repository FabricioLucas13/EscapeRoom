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
	KEYPAD_OVERLAY: "rgba(0, 0, 0, 0.8)",         // El fondo oscuro que tapa la habitación
	KEYPAD_SCREEN_TEXT: "#7CFFB2",               // Color verde de los números/puntos
	KEYPAD_TEXT_SUCCESS: "#7CFFB2",              // Color verde de victoria
	KEYPAD_TEXT_ERROR: "#ff5a5a",                 // Color rojo de fallo

	// 🆕 COLORES DEL PANEL DEL TECLADO (Extraídos del main.js)
	KEYPAD_PANEL_BACKGROUND: "#1c1c1c",          // El color gris oscuro de la caja del teclado
	KEYPAD_PANEL_BORDER: "#7a6a4f",              // El borde dorado medieval de la caja del teclado

	// 🆕 COLORES PARA LOS BOTONES ESPECIALES DEL TECLADO (Extraídos del main.js)
	KEYPAD_BTN_NUM_BG: "#3a3a3a",                // Color gris de los botones de números (0-9)
	KEYPAD_BTN_NUM_TEXT: "#e8d9b5",              // Color de las letras de los números
	KEYPAD_BTN_RESET_BG: "#7a1f16",              // Color rojo para el botón de borrar (←)
	KEYPAD_BTN_RESET_TEXT: "#ffffff",            // Color de la flecha de borrar
	KEYPAD_BTN_CHECK_BG: "#1f8f4d",              // Color verde para el botón de validar (✓)
	KEYPAD_BTN_CHECK_TEXT: "#000000"             // Color del check de validar
}


// 📏 MEDIDAS DEL JUEGO (Todo está medido en píxeles)
export const INTERFACE_DIMENSIONS = {
	MENU_BUTTON_WIDTH: 225,          // Ancho de los botones JUGAR y OPCIONES
	MENU_BUTTON_HEIGHT: 44,          // Alto de los botones JUGAR y OPCIONES
	OPTIONS_MODAL_WIDTH: 300,        // Ancho de la caja del menú de sonido
	OPTIONS_MODAL_HEIGHT: 220,       // Alto de la caja del menú de sonido
	MODAL_BUTTON_WIDTH: 160,         // Ancho de los botones de dentro del menú de sonido (MÚSICA y VOLVER)
	MODAL_BUTTON_HEIGHT: 38,         // Alto de los botones de dentro del menú de sonido
	NAVIGATION_ARROW_SIZE: 30,       // Tamaño de las flechas blancas para cambiar de habitación
	ARROW_Y_ROOM_ONE: 360,       // Altura exacta en la pantalla donde se dibuja la flecha en la Habitación 1
	KEYPAD_WIDTH: 270,                           // Ancho total del panel del teclado
	KEYPAD_HEIGHT: 380,                          // Alto total del panel del teclado
	KEYPAD_GRID_COLS: 3,                         // Columnas de botones
	KEYPAD_BTN_SIZE: 50,                         // Tamaño cuadrado de cada botón numérico
	KEYPAD_GAP: 10                               // Separación entre botones
}

// Añade la solución del enigma al final del archivo
export const GAME_PUZZLES = {
	EXIT_SECRET_CODE: "739"                      // Contraseña que programó el equipo
}
