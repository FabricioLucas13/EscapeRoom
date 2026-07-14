import { ROOM, COLOR_THEME, INTERFACE_CONFIG } from "./config.js";
import { isInside, drawBeveledButton, drawProportionalBackground, drawStandardRoomBackground, drawNavigationArrow } from "./helpers.js";
import { initializeInteractions, getModalInteractions, getRoomInteractions } from "./interactions.js";

const canvas = document.getElementById("game-screen");
const drawInGame = canvas.getContext("2d");

let mouseX = 0;
let mouseY = 0;

// --- CONFIGURACIÓN DE AUDIO ---
let isOptionsOpen = false;       
let isMusicMuted = false;        

const gameMusic = new Audio("assets/musicEscapeRoom.mp3");
gameMusic.loop = true;

// 🟢 CORRECCIÓN: 'currentRoom' debe ir aquí arriba, declarada antes de usarse
let currentRoom = ROOM.START;

// --- REGISTRO DE ACCIONES PARA EL MÓDULO DE INTERACCIONES ---
initializeInteractions({
	changeRoom: (targetRoom) => { currentRoom = targetRoom; },
	openExitKeypad: () => { console.log("Se ha activado el teclado numérico de salida."); },
	getIsMusicMuted: () => isMusicMuted,
	getGameMusic: () => gameMusic,
	openOptionsModal: () => { if (!isOptionsOpen) isOptionsOpen = true; },
	closeOptionsModal: () => { isOptionsOpen = false; },
	toggleMusic: () => {
		isMusicMuted = !isMusicMuted;
		gameMusic.muted = isMusicMuted;
		if (!isMusicMuted) {
			gameMusic.play().catch(() => console.log("Esperando interacción para audio."));
		}
	}
});

// --- MAPA DE INTERACCIONES CALCULADO ---
const roomInteractions = getRoomInteractions(canvas);

// --- CARGA INTELIGENTE DE IMÁGENES ---
const gameImages = {};
const imageSources = { start: "roomStart.png", one: "roomOne.jpg", four: "roomFour.jpg" };
Object.entries(imageSources).forEach(([key, src]) => {
	gameImages[key] = new Image();
	gameImages[key].src = `assets/${src}`;
});

// --- SISTEMA DE CAPTURA DE INPUTS Y EVENTOS ---
canvas.addEventListener("mousemove", (event) => {
	const rect = canvas.getBoundingClientRect();
	mouseX = Math.floor(event.clientX - rect.left);
	mouseY = Math.floor(event.clientY - rect.top);
});

canvas.addEventListener("click", (event) => {
	const rect = canvas.getBoundingClientRect();
	const clickX = event.clientX - rect.left;
	const clickY = event.clientY - rect.top;

	// 🟢 CORRECCIÓN: Llamado en plural idéntico al de interactions.js
	const activeZones = (currentRoom === ROOM.START && isOptionsOpen) 
		? getModalInteractions(canvas) 
		: roomInteractions[currentRoom];

	if (activeZones) {
		activeZones.forEach(zone => {
			if (isInside(clickX, clickY, zone)) zone.action();
		});
	}
});

function drawMouseCoordinates() {
	drawInGame.fillStyle = "white";
	drawInGame.font = "14px Arial";
	drawInGame.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20);
}

// --- BUCLE PRINCIPAL DE RENDERIZADO DEL JUEGO ---
function draw() {
	switch (currentRoom) {
		case ROOM.START:
			if (gameImages.start.complete) {
				drawProportionalBackground(drawInGame, canvas, gameImages.start);

				const startZones = roomInteractions[ROOM.START];
				const isMouseOverPlay = isInside(mouseX, mouseY, startZones[0]);
				const isMouseOverOptions = isInside(mouseX, mouseY, startZones[1]);

				drawInGame.textAlign = "center";
				drawInGame.textBaseline = "middle";
				drawInGame.font = "16px 'Times New Roman', serif";

				drawBeveledButton(drawInGame, canvas, COLOR_THEME, startZones[0], isMouseOverPlay, "JUGAR");
				drawBeveledButton(drawInGame, canvas, COLOR_THEME, startZones[1], isMouseOverOptions, "OPCIONES");

				if (isOptionsOpen) {
					const modalWidth = INTERFACE_CONFIG.MODAL_WIDTH;
					const modalHeight = INTERFACE_CONFIG.MODAL_HEIGHT;
					const modalLeftX = canvas.width / 2 - modalWidth / 2;
					const modalTopY = canvas.height / 2 - modalHeight / 2;
					const modalBevelSize = 12;

					drawInGame.beginPath();
					drawInGame.moveTo(modalLeftX + modalBevelSize, modalTopY);
					drawInGame.lineTo(modalLeftX + modalWidth - modalBevelSize, modalTopY);
					drawInGame.lineTo(modalLeftX + modalWidth, modalTopY + modalBevelSize);
					drawInGame.lineTo(modalLeftX + modalWidth, modalTopY + modalHeight - modalBevelSize);
					drawInGame.lineTo(modalLeftX + modalWidth - modalBevelSize, modalTopY + modalHeight);
					drawInGame.lineTo(modalLeftX + modalBevelSize, modalTopY + modalHeight);
					drawInGame.lineTo(modalLeftX, modalTopY + modalHeight - modalBevelSize);
					drawInGame.lineTo(modalLeftX, modalTopY + modalBevelSize);
					drawInGame.closePath();

					drawInGame.fillStyle = COLOR_THEME.MODAL_OVERLAY;
					drawInGame.fill();
					drawInGame.strokeStyle = COLOR_THEME.BORDER_DEFAULT;
					drawInGame.lineWidth = 2;
					drawInGame.stroke();

					drawInGame.fillStyle = COLOR_THEME.TEXT_HOVER;
					drawInGame.font = "bold 18px 'Times New Roman', serif";
					drawInGame.fillText("SONIDO", canvas.width / 2, modalTopY + 30);

					// 🟢 CORRECCIÓN: Llamado coincidente con S al final
					const modalZones = getModalInteractions(canvas);
					const isMouseOverAudio = isInside(mouseX, mouseY, modalZones[0]);
					const isMouseOverBack = isInside(mouseX, mouseY, modalZones[1]);

					drawInGame.font = "14px 'Times New Roman', serif";
					drawBeveledButton(drawInGame, canvas, COLOR_THEME, modalZones[0], isMouseOverAudio, isMusicMuted ? "MÚSICA: OFF" : "MÚSICA: ON", 6);
					drawBeveledButton(drawInGame, canvas, COLOR_THEME, modalZones[1], isMouseOverBack, "VOLVER", 6);
				}
				drawInGame.textAlign = "left";
				drawInGame.textBaseline = "alphabetic";
			} else {
				drawInGame.fillStyle = "#121212";
				drawInGame.fillRect(0, 0, canvas.width, canvas.height);
			}
			break;

		case ROOM.ONE:
			drawStandardRoomBackground(drawInGame, canvas, gameImages.one, COLOR_THEME.FALLBACK_ROOM_ONE);
			break;

		case ROOM.FOUR:
			drawStandardRoomBackground(drawInGame, canvas, gameImages.four, COLOR_THEME.FALLBACK_ROOM_FOUR);
			break;
	}

	if (currentRoom === ROOM.ONE) drawNavigationArrow(drawInGame, canvas, INTERFACE_CONFIG.ARROW_SIZE, "UP", INTERFACE_CONFIG.ARROW_Y_ROOM_ONE);
	if (currentRoom === ROOM.FOUR) drawNavigationArrow(drawInGame, canvas, INTERFACE_CONFIG.ARROW_SIZE, "DOWN", canvas.height - 5);

	drawMouseCoordinates();
	requestAnimationFrame(draw);
}

draw();
