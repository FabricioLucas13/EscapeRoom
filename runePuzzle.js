// =========================================================================
// 🗿 CONFIGURACIÓN INTERNA Y ESTADO DEL PUZZLE DE RUNAS
// =========================================================================
import { INTERFACE_COLORS, INTERFACE_DIMENSIONS, INTERFACE_FONTS } from "./config.js"

export const runesState = {
	isOpen: false,
	resultText: "",
	draggedIndex: null,
	
	dimensions: {
		modalW: INTERFACE_DIMENSIONS.RUNE_MODAL_WIDTH,
		modalH: INTERFACE_DIMENSIONS.RUNE_MODAL_HEIGHT,
		boardW: INTERFACE_DIMENSIONS.RUNE_BOARD_WIDTH,
		boardH: INTERFACE_DIMENSIONS.RUNE_BOARD_HEIGHT,
		runeSize: INTERFACE_DIMENSIONS.RUNE_SIZE,
		pedestalSize: INTERFACE_DIMENSIONS.RUNE_PEDESTAL_SIZE,
		btnW: INTERFACE_DIMENSIONS.RUNE_BUTTON_WIDTH,
		btnH: INTERFACE_DIMENSIONS.RUNE_BUTTON_HEIGHT,
		boardPadding: INTERFACE_DIMENSIONS.RUNE_BOARD_PADDING,
		boardTop: INTERFACE_DIMENSIONS.RUNE_BOARD_TOP
	},

	runes: [
		{ id: 1, x: 80,  y: 80,  homeX: 80,  homeY: 80,  imageKey: "runeOne" },
		{ id: 2, x: 200, y: 80,  homeX: 200, homeY: 80,  imageKey: "runeTwo" },
		{ id: 3, x: 320, y: 80,  homeX: 320, homeY: 80,  imageKey: "runeThree" },
		{ id: 4, x: 440, y: 80,  homeX: 440, homeY: 80,  imageKey: "runeFour" }
	],

	pedestals: [
		{ id: 0, x: 145, y: 260, assignedRuneId: null },
		{ id: 1, x: 265, y: 260, assignedRuneId: null },
		{ id: 2, x: 385, y: 260, assignedRuneId: null }
	],

	reset() {
		this.resultText = "";
		this.draggedIndex = null;
		this.runes.forEach(r => { r.x = r.homeX; r.y = r.homeY; });
		this.pedestals.forEach(p => p.assignedRuneId = null);
	},

	check() {
		if (this.resultText === "7") return;
		const currentOrder = this.pedestals.map(p => p.assignedRuneId || 0);
		if (JSON.stringify(currentOrder) === JSON.stringify([4, 1, 3])) {
			this.resultText = "7";
		} else {
			this.resultText = "❌ ERROR";
			setTimeout(() => this.reset(), 1000);
		}
	}
};

// =========================================================================
// 🖱️ CONTROLADORES DE EVENTOS EN CANVAS (Mousedown, Mouseup)
// =========================================================================
export function handleRunesMousedown(mouseX, mouseY, canvasWidth, canvasHeight) {
	if (!runesState.isOpen) return;

	const modalX = canvasWidth / 2 - runesState.dimensions.modalW / 2;
	const modalY = canvasHeight / 2 - runesState.dimensions.modalH / 2;

	runesState.runes.forEach((rune, index) => {
		const absX = modalX + rune.x;
		const absY = modalY + rune.y;
		if (mouseX >= absX && mouseX <= absX + runesState.dimensions.runeSize &&
			mouseY >= absY && mouseY <= absY + runesState.dimensions.runeSize) {
			runesState.draggedIndex = index;
			runesState.pedestals.forEach(p => {
				if (p.assignedRuneId === rune.id) p.assignedRuneId = null;
			});
		}
	});
}

export function handleRunesMouseup(mouseX, mouseY, canvasWidth, canvasHeight) {
	if (!runesState.isOpen || runesState.draggedIndex === null) return;

	const rune = runesState.runes[runesState.draggedIndex];
	const modalX = canvasWidth / 2 - runesState.dimensions.modalW / 2;
	const modalY = canvasHeight / 2 - runesState.dimensions.modalH / 2;
	let dropped = false;

	runesState.pedestals.forEach(p => {
		const absX = modalX + p.x;
		const absY = modalY + p.y;
		const size = runesState.dimensions.pedestalSize;

		if (mouseX >= absX && mouseX <= absX + size && mouseY >= absY && mouseY <= absY + size) {
			if (p.assignedRuneId !== null) {
				const oldRune = runesState.runes.find(r => r.id === p.assignedRuneId);
				if (oldRune) { oldRune.x = oldRune.homeX; oldRune.y = oldRune.homeY; }
			}
			rune.x = p.x + (size - runesState.dimensions.runeSize) / 2;
			rune.y = p.y + (size - runesState.dimensions.runeSize) / 2;
			p.assignedRuneId = rune.id;
			dropped = true;
		}
	});

	if (!dropped) {
		rune.x = rune.homeX;
		rune.y = rune.homeY;
	}
	runesState.draggedIndex = null;
}

export function handleRunesClick(mouseX, mouseY, canvasWidth, canvasHeight) {
	if (!runesState.isOpen) return;

	const modalX = canvasWidth / 2 - runesState.dimensions.modalW / 2;
	const modalY = canvasHeight / 2 - runesState.dimensions.modalH / 2;

	const btnX = canvasWidth / 2 - runesState.dimensions.btnW / 2;
	const btnY = modalY + runesState.dimensions.modalH - 75;
	if (mouseX >= btnX && mouseX <= btnX + runesState.dimensions.btnW && mouseY >= btnY && mouseY <= btnY + runesState.dimensions.btnH) {
		runesState.check();
		return;
	}

	const insideModal = mouseX >= modalX && mouseX <= modalX + runesState.dimensions.modalW &&
		mouseY >= modalY && mouseY <= modalY + runesState.dimensions.modalH;
	if (!insideModal) {
		runesState.isOpen = false;
	}
}

// =========================================================================
// 🎨 RENDERIZADO DEL POP-UP EN EL CANVAS
// =========================================================================
export function drawRunesPuzzle(canvasContext, canvasElement, gameImages, mouseX, mouseY) {
	if (!runesState.isOpen) return;

	const modalX = canvasElement.width / 2 - runesState.dimensions.modalW / 2;
	const modalY = canvasElement.height / 2 - runesState.dimensions.modalH / 2;

	if (runesState.draggedIndex !== null) {
		runesState.runes[runesState.draggedIndex].x = mouseX - modalX - runesState.dimensions.runeSize / 2;
		runesState.runes[runesState.draggedIndex].y = mouseY - modalY - runesState.dimensions.runeSize / 2;
	}

	canvasContext.fillStyle = "rgba(0, 0, 0, 0.78)";
	canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

	let gradient = canvasContext.createLinearGradient(modalX, modalY, modalX, modalY + runesState.dimensions.modalH);
	gradient.addColorStop(0, "#3b322a");
	gradient.addColorStop(1, "#1c1713");
	canvasContext.fillStyle = gradient;
	canvasContext.fillRect(modalX, modalY, runesState.dimensions.modalW, runesState.dimensions.modalH);
	canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT;
	canvasContext.lineWidth = 2;
	canvasContext.strokeRect(modalX, modalY, runesState.dimensions.modalW, runesState.dimensions.modalH);

	canvasContext.textAlign = "center";
	canvasContext.textBaseline = "middle";
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER;
	canvasContext.font = INTERFACE_FONTS.BUTTON_TITLE;
	canvasContext.fillText("ALINEACIÓN DE RUNAS ANCESTRALES", canvasElement.width / 2, modalY + 30);

	canvasContext.fillStyle = "rgba(255,255,255,0.05)";
	canvasContext.fillRect(modalX + 45, modalY + 50, runesState.dimensions.boardW, runesState.dimensions.boardH);

	runesState.pedestals.forEach(p => {
		canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT;
		canvasContext.lineWidth = 2;
		canvasContext.setLineDash([6, 4]);
		canvasContext.strokeRect(modalX + p.x, modalY + p.y, runesState.dimensions.pedestalSize, runesState.dimensions.pedestalSize);
		canvasContext.setLineDash([]);
	});

	const btnX = canvasElement.width / 2 - runesState.dimensions.btnW / 2;
	const btnY = modalY + runesState.dimensions.modalH - 65;
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_BACKGROUND_DEFAULT;
	canvasContext.fillRect(btnX, btnY, runesState.dimensions.btnW, runesState.dimensions.btnH);
	canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT;
	canvasContext.strokeRect(btnX, btnY, runesState.dimensions.btnW, runesState.dimensions.btnH);
	canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER;
	canvasContext.font = INTERFACE_FONTS.ACTION_BUTTON;
	canvasContext.fillText("EJECUTAR", canvasElement.width / 2, btnY + 24);

	runesState.runes.forEach(rune => {
		const img = gameImages[rune.imageKey];
		const drawX = modalX + rune.x;
		const drawY = modalY + rune.y;
		
		if (img && img.complete && img.naturalWidth > 0) {
			canvasContext.drawImage(img, drawX, drawY, runesState.dimensions.runeSize, runesState.dimensions.runeSize);
		} else {
			canvasContext.fillStyle = "#2f2a1f";
			canvasContext.fillRect(drawX, drawY, runesState.dimensions.runeSize, runesState.dimensions.runeSize);
			canvasContext.strokeStyle = INTERFACE_COLORS.BUTTON_BORDER_DEFAULT;
			canvasContext.lineWidth = 2;
			canvasContext.strokeRect(drawX, drawY, runesState.dimensions.runeSize, runesState.dimensions.runeSize);
			canvasContext.fillStyle = INTERFACE_COLORS.BUTTON_TEXT_HOVER;
			canvasContext.font = INTERFACE_FONTS.BUTTON_TITLE;
			canvasContext.textAlign = "center";
			canvasContext.textBaseline = "middle";
			canvasContext.fillText(String(rune.id), drawX + runesState.dimensions.runeSize / 2, drawY + runesState.dimensions.runeSize / 2 + 1);
		}
	});

	if (runesState.resultText !== "") {
		canvasContext.fillStyle = (runesState.resultText === "7") ? "#7cffb2" : "#ff5a5a";
		canvasContext.font = "bold 24px 'Georgia', serif";
		canvasContext.fillText(runesState.resultText, canvasElement.width / 2, modalY + runesState.dimensions.modalH - 25);
	}
}
