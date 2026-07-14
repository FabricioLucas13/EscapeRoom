// 1. ESTADOS DEL JUEGO Y CONSTANTES DE HABITACIONES
export const ROOM = { 
	START: 0, 
	ONE: 1, 
	FOUR: 4 
};

// 🎨 PALETA DE COLORES GLOBAL (Ideal para que tu equipo cambie el arte fácilmente)
export const COLOR_THEME = {
	PRIMARY_DARK: "#1a1310",     // Fondo de botones por defecto
	HOVER_DARK: "#241a16",       // Fondo de botones con cursor encima
	BORDER_DEFAULT: "#8c6f4f",   // Borde bronce por defecto
	BORDER_HOVER: "#d1ab7e",     // Borde bronce iluminado
	TEXT_DEFAULT: "#a89276",     // Texto apagado
	TEXT_HOVER: "#e8d8c3",       // Texto iluminado
	MODAL_OVERLAY: "rgba(18, 13, 11, 0.95)",
	FALLBACK_ROOM_ONE: "#2d2d2d",
	FALLBACK_ROOM_FOUR: "#245b3b"
};

// 📏 CONFIGURACIÓN DE DIMENSIONES (Modifica esto para alterar tamaños y posiciones)
export const INTERFACE_CONFIG = {
	MAIN_BUTTON_WIDTH: 225, 
	MAIN_BUTTON_HEIGHT: 44,
	MODAL_WIDTH: 300, 
	MODAL_HEIGHT: 220,
	MODAL_BUTTON_WIDTH: 160, 
	MODAL_BUTTON_HEIGHT: 38,
	ARROW_SIZE: 30, 
	ARROW_Y_ROOM_ONE: 360        // Posición vertical de la flecha de avance en ROOM.ONE
};
