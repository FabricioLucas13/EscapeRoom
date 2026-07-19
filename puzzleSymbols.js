import { INTERFACE_COLORS } from "./config.js"
import { isMouseInsideZone, drawBeveledButton } from "./helpers.js"
import { getSymbolsInteractions } from "./interactions.js"

/**
 * 🔮 DIBUJAR EL PUZZLE DE SÍMBOLOS (Componente Autónomo Canvas - Coordenadas Fijas)
 */
export function drawSymbolsPuzzle(canvasContext, canvasElement, state, mouseX, mouseY) {
    state.updateShake();

    const padWidth = 420;
    const padHeight = 280;

    // 🧠 EFECTO SHAKE (Vibración matemática horizontal)
    let offsetX = 0;
    if (state.symbolsShakeTimer > 0) {
        offsetX = Math.sin(state.symbolsShakeTimer * 0.8) * 8;
    }

    // Usamos tus coordenadas exactas
    const padLeftX = 878 + offsetX;
    const padTopY = 290;

    // 1. Fondo oscuro translúcido
    canvasContext.fillStyle = "rgba(10, 10, 10, 0.8)";
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // 2. El panel con esquinas biseladas en la posición fija
    canvasContext.beginPath();
    canvasContext.moveTo(padLeftX + 18, padTopY);
    canvasContext.lineTo(padLeftX + padWidth - 18, padTopY);
    canvasContext.lineTo(padLeftX + padWidth, padTopY + 18);
    canvasContext.lineTo(padLeftX + padWidth, padTopY + padHeight - 18);
    canvasContext.lineTo(padLeftX + padWidth - 18, padTopY + padHeight);
    canvasContext.lineTo(padLeftX + 18, padTopY + padHeight);
    canvasContext.lineTo(padLeftX, padTopY + padHeight - 18);
    canvasContext.lineTo(padLeftX, padTopY + 18);
    canvasContext.closePath();

    const gradient = canvasContext.createLinearGradient(padLeftX, padTopY, padLeftX, padTopY + padHeight);
    gradient.addColorStop(0, "#3a3a3a");
    gradient.addColorStop(1, "#1b1b1b");
    canvasContext.fillStyle = gradient;
    canvasContext.fill();

    canvasContext.strokeStyle = "#6b6b6b";
    canvasContext.lineWidth = 2;
    canvasContext.stroke();

    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";

    // 3. Título del puzzle (Centrado en el ancho del panel)
    canvasContext.fillStyle = "#d6c7a1";
    canvasContext.font = "bold 16px 'Georgia', serif";
    canvasContext.fillText("COMBINACIÓN DE RUNAS", padLeftX + padWidth / 2, padTopY + 35);

    // 4. Mostrar combinación actual
    const symbolMap = { 1: "☀️", 2: "🔺", 3: "✦", 4: "🌙" };
    const currentCombinationText = state.symbolsInput.map(id => symbolMap[id]).join(" - ");

    canvasContext.fillStyle = "#e0d2a8";
    canvasContext.font = "18px Arial";
    canvasContext.fillText(currentCombinationText || "(Pulsa los símbolos en orden)", padLeftX + padWidth / 2, padTopY + 75);

    // 5. Dibujar botones interactivos en coordenadas fijas
    const symbolsZones = getSymbolsInteractions(canvasElement);

    symbolsZones.forEach(zone => {
        const adjustedZone = { ...zone, x: zone.x + offsetX };
        const isHovered = isMouseInsideZone(state.mouseX, state.mouseY, adjustedZone);

        if (adjustedZone.label === "✕") {
            canvasContext.fillStyle = isHovered ? "#ff5a5a" : "#c9b98a";
            canvasContext.font = "bold 22px Arial";
            canvasContext.fillText(adjustedZone.label, adjustedZone.x + adjustedZone.width / 2, adjustedZone.y + adjustedZone.height / 2);
        } else if (adjustedZone.label === "⚙️ Ejecutar") {
            let customColors = { ...INTERFACE_COLORS };
            customColors.BUTTON_BACKGROUND_DEFAULT = "#333333";
            customColors.BUTTON_TEXT_DEFAULT = "#7cffb2";
            customColors.BUTTON_BORDER_DEFAULT = "#6b6b6b";

            canvasContext.font = "14px monospace";
            drawBeveledButton(canvasContext, canvasElement, customColors, adjustedZone, isHovered, adjustedZone.label, 6);
        } else {
            let customColors = { ...INTERFACE_COLORS };
            customColors.BUTTON_BACKGROUND_DEFAULT = "#222222";
            customColors.BUTTON_TEXT_DEFAULT = "#d6c7a1";
            customColors.BUTTON_BORDER_DEFAULT = "#444444";

            canvasContext.font = "30px Arial";
            drawBeveledButton(canvasContext, canvasElement, customColors, adjustedZone, isHovered, adjustedZone.label, 8);
        }
    });

    // 6. Mensaje de resultado
    if (state.symbolsResultText !== "") {
        canvasContext.fillStyle = (state.symbolsResultStatus === "success") ? "#7CFFB2" : "#ff5a5a";
        canvasContext.font = "bold 15px 'Georgia', serif";
        canvasContext.fillText(state.symbolsResultText, padLeftX + padWidth / 2, padTopY + padHeight - 25);
    }

    canvasContext.textAlign = "left";
    canvasContext.textBaseline = "alphabetic";
}