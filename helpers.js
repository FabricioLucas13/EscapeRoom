// 🟢 Función de cálculo matemático pura: comprueba si el ratón está en un área activa
export function isInside(clickX, clickY, interactionZone) {
	return clickX >= interactionZone.x &&
		clickX <= interactionZone.x + interactionZone.width &&
		clickY >= interactionZone.y &&
		clickY <= interactionZone.y + interactionZone.height;
}

// 🟢 Dibuja los botones biselados del juego y del modal
export function drawBeveledButton(drawInGame, canvas, COLOR_THEME, buttonZone, isHovered, textLabel, bevel = 8) {
	drawInGame.beginPath();
	drawInGame.moveTo(buttonZone.x + bevel, buttonZone.y);
	drawInGame.lineTo(buttonZone.x + buttonZone.width - bevel, buttonZone.y);
	drawInGame.lineTo(buttonZone.x + buttonZone.width, buttonZone.y + bevel);
	drawInGame.lineTo(buttonZone.x + buttonZone.width, buttonZone.y + buttonZone.height - bevel);
	drawInGame.lineTo(buttonZone.x + buttonZone.width - bevel, buttonZone.y + buttonZone.height);
	drawInGame.lineTo(buttonZone.x + bevel, buttonZone.y + buttonZone.height);
	drawInGame.lineTo(buttonZone.x, buttonZone.y + buttonZone.height - bevel);
	drawInGame.lineTo(buttonZone.x, buttonZone.y + bevel);
	drawInGame.closePath();

	drawInGame.fillStyle = isHovered ? COLOR_THEME.HOVER_DARK : COLOR_THEME.PRIMARY_DARK;
	drawInGame.fill();
	drawInGame.strokeStyle = isHovered ? COLOR_THEME.BORDER_HOVER : COLOR_THEME.BORDER_DEFAULT;
	drawInGame.lineWidth = isHovered ? 2 : 1.5;
	drawInGame.stroke();

	drawInGame.fillStyle = isHovered ? COLOR_THEME.TEXT_HOVER : COLOR_THEME.TEXT_DEFAULT;
	drawInGame.fillText(textLabel, buttonZone.x + buttonZone.width / 2, buttonZone.y + buttonZone.height / 2);
}

// 🟢 Dibuja el fondo del menú principal adaptando la imagen de forma proporcional
export function drawProportionalBackground(drawInGame, canvas, imageAsset) {
	drawInGame.fillStyle = "black";
	drawInGame.fillRect(0, 0, canvas.width, canvas.height);

	const scale = Math.min(canvas.width / imageAsset.width, canvas.height / imageAsset.height);
	const newWidth = imageAsset.width * scale;
	const newHeight = imageAsset.height * scale;
	drawInGame.drawImage(imageAsset, (canvas.width - newWidth) / 2, (canvas.height - newHeight) / 2, newWidth, newHeight);
}

// 🟢 Dibuja el fondo plano de las habitaciones normales o el color de respaldo
export function drawStandardRoomBackground(drawInGame, canvas, roomImage, fallbackColor) {
	if (roomImage.complete) {
		drawInGame.drawImage(roomImage, 0, 0, canvas.width, canvas.height);
	} else {
		drawInGame.fillStyle = fallbackColor;
		drawInGame.fillRect(0, 0, canvas.width, canvas.height);
	}
}

// 🟢 Dibuja los triángulos de navegación blancos (Hacia arriba o abajo)
export function drawNavigationArrow(drawInGame, canvas, ARROW_SIZE, direction, yPosition) {
	const centerX = canvas.width / 2;
	drawInGame.fillStyle = "white";
	drawInGame.beginPath();

	if (direction === "UP") {
		drawInGame.moveTo(centerX, yPosition);
		drawInGame.lineTo(centerX - ARROW_SIZE, yPosition + ARROW_SIZE);
		drawInGame.lineTo(centerX + ARROW_SIZE, yPosition + ARROW_SIZE);
	} else if (direction === "DOWN") {
		drawInGame.moveTo(centerX, yPosition);
		drawInGame.lineTo(centerX - ARROW_SIZE, yPosition - ARROW_SIZE);
		drawInGame.lineTo(centerX + ARROW_SIZE, yPosition - ARROW_SIZE);
	}
	drawInGame.closePath();
	drawInGame.fill();
}
