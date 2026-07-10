// ==========================================================
// ESCAPE ROOM - PROTOTIPO
//
// Este proyecto es un point & click sencillo.
//
// Distribución de las salas:
//
//             [ Sala 4 ]
//                 ↑
//                 │
// [ Sala 2 ] ← [ Sala 1 ] → [ Sala 3 ]
//
// De momento:
// - Cada sala tiene un color distinto.
// - Las flechas permiten navegar entre salas.
// - Se muestran las coordenadas del ratón para desarrollo.
//
// Más adelante:
// [ ] Sustituir colores por imágenes.
// [ ] Añadir objetos interactivos.
// [ ] Añadir puzles.
// [ ] Añadir sonidos.
// [ ] Añadir la salida final.
//
// ==========================================================

// ==========================================================
// CONFIGURACIÓN DEL JUEGO
// ==========================================================

// Canvas principal
const canvas = document.getElementById("game-screen");
const drawInGame = canvas.getContext("2d");

// Estado del menú de opciones
let isOptionsOpen = false;

// Configuración del audio 
const gameMusic = new Audio("assets/musicScapeRoom.mp3");
gameMusic.loop = true;
let isMusicMuted = false;

// Coordenadas del ratón (solo para desarrollo)
let mouseX = 0;
let mouseY = 0;

// Sala actual
// 1 = Centro
// 2 = Izquierda
// 3 = Derecha
// 4 = Arriba
let currentRoom = 0;

// Imágenes de las salas

const roomStart = new Image();
roomStart.src = "assets/roomStart.png";

const roomOne = new Image();
roomOne.src = "assets/roomOne.jpg";

const roomTwo = new Image();
roomTwo.src = "assets/roomTwo.jpg";

const roomThree = new Image();
roomThree.src = "assets/roomThree.jpg";

const roomFour = new Image();
roomFour.src = "assets/roomFour.jpg";

// ==========================================================
// FUTURO:
//
// Aquí se cargarán todas las imágenes.
//
// Ejemplo:
//
// const room1 = new Image()
// room1.src = "img/room1.png"
//
// const room2 = new Image()
// room2.src = "img/room2.png"
//
// También se cargarán:
//
// - Objetos
// - Flechas
// - Animaciones
//
// ==========================================================

// ==========================================================
// POSICIÓN DEL RATÓN
// ==========================================================

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();

  mouseX = Math.floor(event.clientX - rect.left);
  mouseY = Math.floor(event.clientY - rect.top);
});

// ==========================================================
// DETECCIÓN DE CLICS
//
// Aquí irá toda la lógica del juego:
//
// - Cambiar de sala.
// - Objetos.
// - Puzles.
// - Llaves.
// - Puertas.
// ==========================================================

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // --- AQUÍ VA EL NUEVO CÓDIGO DE LA SALA 0 ---
  if (currentRoom === 0) {
    const btnWidth = 225;
    const btnHeight = 44;
    const btnX = canvas.width / 2 - btnWidth / 2;
    const btn1Y = canvas.height / 2 - 35;
    const btn2Y = canvas.height / 2 + 25;

    // SI EL MODAL ESTÁ ABIERTO: Bloqueamos los botones del fondo y leemos los del modal
    if (isOptionsOpen) {
      const modalWidth = 300;
      const modalHeight = 200;
      const modalX = canvas.width / 2 - modalWidth / 2;
      const modalY = canvas.height / 2 - modalHeight / 2;

      // Clic en el botón de Música (Mute/Unmute)
      if (
        clickX >= canvas.width / 2 - 80 &&
        clickX <= canvas.width / 2 + 80 &&
        clickY >= modalY + 60 &&
        clickY <= modalY + 60 + 40
      ) {
        isMusicMuted = !isMusicMuted;
        gameMusic.muted = isMusicMuted;

        // Si se quita el mute y no estaba reproduciéndose, la iniciamos
        if (!isMusicMuted) {
          gameMusic
            .play()
            .catch((e) =>
              console.log("Esperando interacción para reproducir audio."),
            );
        }
      }

      // Clic en el botón de Cerrar Modal (X)
      if (
        clickX >= canvas.width / 2 - 80 &&
        clickX <= canvas.width / 2 + 80 &&
        clickY >= modalY + 130 &&
        clickY <= modalY + 130 + 40
      ) {
        isOptionsOpen = false;
      }
    }
    // SI EL MODAL ESTÁ CERRADO: Funcionan los botones normales
    else {
      // Clic en JUGAR
      if (
        clickX >= btnX &&
        clickX <= btnX + btnWidth &&
        clickY >= btn1Y &&
        clickY <= btn1Y + btnHeight
      ) {
        currentRoom = 1;
        // Opcional: Iniciar la música automáticamente al empezar a jugar
        if (!isMusicMuted) {
          gameMusic
            .play()
            .catch((e) =>
              console.log(
                "Audio bloqueado por el navegador hasta interactuar.",
              ),
            );
        }
      }

      // Clic en OPCIONES
      else if (
        clickX >= btnX &&
        clickX <= btnX + btnWidth &&
        clickY >= btn2Y &&
        clickY <= btn2Y + btnHeight
      ) {
        isOptionsOpen = true;
      }
    }
  }

  // Sala 1 -> Sala 2 (izquierda)
  else if (
    currentRoom === 1 &&
    clickX >= 0 &&
    clickX <= 40 &&
    clickY >= canvas.height / 2 - 35 &&
    clickY <= canvas.height / 2 + 35
  ) {
    currentRoom = 2;
  }

  // Sala 2 -> Sala 1 (derecha)
  else if (
    currentRoom === 2 &&
    clickX >= canvas.width - 40 &&
    clickX <= canvas.width &&
    clickY >= canvas.height / 2 - 35 &&
    clickY <= canvas.height / 2 + 35
  ) {
    currentRoom = 1;
  }

  // Sala 1 -> Sala 3 (derecha)
  else if (
    currentRoom === 1 &&
    clickX >= canvas.width - 40 &&
    clickX <= canvas.width &&
    clickY >= canvas.height / 2 - 35 &&
    clickY <= canvas.height / 2 + 35
  ) {
    currentRoom = 3;
  }

  // Sala 3 -> Sala 1 (izquierda)
  else if (
    currentRoom === 3 &&
    clickX >= 0 &&
    clickX <= 40 &&
    clickY >= canvas.height / 2 - 35 &&
    clickY <= canvas.height / 2 + 35
  ) {
    currentRoom = 1;
  }

  // Sala 1 -> Sala 4 (arriba)
  else if (
    currentRoom === 1 &&
    clickX >= canvas.width / 2 - 35 &&
    clickX <= canvas.width / 2 + 35 &&
    clickY >= 0 &&
    clickY <= 40
  ) {
    currentRoom = 4;
  }

  // Sala 4 -> Sala 1 (abajo)
  else if (
    currentRoom === 4 &&
    clickX >= canvas.width / 2 - 35 &&
    clickX <= canvas.width / 2 + 35 &&
    clickY >= canvas.height - 40 &&
    clickY <= canvas.height
  ) {
    currentRoom = 1;
  }
});

// ==========================================================
// MUESTRA LAS COORDENADAS DEL RATÓN
//
// SOLO PARA DESARROLLO.
//
// Borrar al terminar el proyecto.
// ==========================================================

function drawMouseCoordinates() {
  drawInGame.fillStyle = "white";
  drawInGame.font = "14px Arial";

  drawInGame.fillText(`X: ${mouseX}  Y: ${mouseY}`, 10, 20);
}

// ==========================================================
// DIBUJAR EL JUEGO
//
// Este método se ejecuta continuamente.
//
// Se encarga de:
//
// - Dibujar la sala.
// - Dibujar objetos.
// - Dibujar flechas.
// - Dibujar interfaz.
//
// ==========================================================

function draw() {
  // ======================================================
  // FONDO DE CADA SALA
  //
  // De momento se utilizan colores.
  //
  // Más adelante sustituir por:
  //
  // drawInGame.drawImage(room1, 0, 0)
  // ======================================================

  switch (currentRoom) {
    case 0:
      if (roomStart.complete) {
        // 1. Limpiamos fondo
        drawInGame.fillStyle = "black";
        drawInGame.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Ajuste y centrado de la imagen original
        const scale = Math.min(
          canvas.width / roomStart.width,
          canvas.height / roomStart.height,
        );
        const newWidth = roomStart.width * scale;
        const newHeight = roomStart.height * scale;
        const x = (canvas.width - newWidth) / 2;
        const y = (canvas.height - newHeight) / 2;

        drawInGame.drawImage(roomStart, x, y, newWidth, newHeight);

        // ==============================================================
        // CONFIGURACIÓN DE LOS BOTONES (MÁS ALTOS)
        // ==============================================================
        const btnWidth = 225;
        const btnHeight = 44;
        const btnX = canvas.width / 2 - btnWidth / 2;
        const bevel = 8;

        // Coordenadas Y actualizadas (Subidas)
        const btn1Y = canvas.height / 2 - 35;
        const btn2Y = canvas.height / 2 + 25;

        // --- DETECCIÓN DE HOVER ---
        const isHoverBtn1 =
          mouseX >= btnX &&
          mouseX <= btnX + btnWidth &&
          mouseY >= btn1Y &&
          mouseY <= btn1Y + btnHeight;
        const isHoverBtn2 =
          mouseX >= btnX &&
          mouseX <= btnX + btnWidth &&
          mouseY >= btn2Y &&
          mouseY <= btn2Y + btnHeight;

        // --- DIBUJAR BOTÓN 1: JUGAR ---
        drawInGame.beginPath();
        drawInGame.moveTo(btnX + bevel, btn1Y);
        drawInGame.lineTo(btnX + btnWidth - bevel, btn1Y);
        drawInGame.lineTo(btnX + btnWidth, btn1Y + bevel);
        drawInGame.lineTo(btnX + btnWidth, btn1Y + btnHeight - bevel);
        drawInGame.lineTo(btnX + btnWidth - bevel, btn1Y + btnHeight);
        drawInGame.lineTo(btnX + bevel, btn1Y + btnHeight);
        drawInGame.lineTo(btnX, btn1Y + btnHeight - bevel);
        drawInGame.lineTo(btnX, btn1Y + bevel);
        drawInGame.closePath();

        drawInGame.fillStyle = isHoverBtn1 ? "#241a16" : "#1a1310";
        drawInGame.fill();
        drawInGame.strokeStyle = isHoverBtn1 ? "#d1ab7e" : "#8c6f4f";
        drawInGame.lineWidth = isHoverBtn1 ? 2 : 1.5;
        drawInGame.stroke();

        // Texto JUGAR
        drawInGame.fillStyle = isHoverBtn1 ? "#e8d8c3" : "#a89276";
        drawInGame.font = "16px 'Times New Roman', serif";
        drawInGame.textAlign = "center";
        drawInGame.textBaseline = "middle";
        drawInGame.fillText("JUGAR", canvas.width / 2, btn1Y + btnHeight / 2);

        // --- DIBUJAR BOTÓN 2: OPCIONES ---
        drawInGame.beginPath();
        drawInGame.moveTo(btnX + bevel, btn2Y);
        drawInGame.lineTo(btnX + btnWidth - bevel, btn2Y);
        drawInGame.lineTo(btnX + btnWidth, btn2Y + bevel);
        drawInGame.lineTo(btnX + btnWidth, btn2Y + btnHeight - bevel);
        drawInGame.lineTo(btnX + btnWidth - bevel, btn2Y + btnHeight);
        drawInGame.lineTo(btnX + bevel, btn2Y + btnHeight);
        drawInGame.lineTo(btnX, btn2Y + btnHeight - bevel);
        drawInGame.lineTo(btnX, btn2Y + bevel);
        drawInGame.closePath();

        drawInGame.fillStyle = isHoverBtn2 ? "#241a16" : "#1a1310";
        drawInGame.fill();
        drawInGame.strokeStyle = isHoverBtn2 ? "#d1ab7e" : "#8c6f4f";
        drawInGame.lineWidth = isHoverBtn2 ? 2 : 1.5;
        drawInGame.stroke();

        // Texto OPCIONES
        drawInGame.fillStyle = isHoverBtn2 ? "#e8d8c3" : "#a89276";
        drawInGame.fillText(
          "OPCIONES",
          canvas.width / 2,
          btn2Y + btnHeight / 2,
        );

        // ==============================================================
        // NUEVO: CAPA EN CASCADA PARA EL MODAL DE OPCIONES
        // ==============================================================
        if (typeof isOptionsOpen !== "undefined" && isOptionsOpen) {
          const modalWidth = 300;
          const modalHeight = 220;
          const modalX = canvas.width / 2 - modalWidth / 2;
          const modalY = canvas.height / 2 - modalHeight / 2;
          const mBevel = 12;

          const btnBgColor = "#1a1310";
          const btnBorderColor = "#8c6f4f";

          // Marco Principal del Modal
          drawInGame.beginPath();
          drawInGame.moveTo(modalX + mBevel, modalY);
          drawInGame.lineTo(modalX + modalWidth - mBevel, modalY);
          drawInGame.lineTo(modalX + modalWidth, modalY + mBevel);
          drawInGame.lineTo(modalX + modalWidth, modalY + modalHeight - mBevel);
          drawInGame.lineTo(modalX + modalWidth - mBevel, modalY + modalHeight);
          drawInGame.lineTo(modalX + mBevel, modalY + modalHeight);
          drawInGame.lineTo(modalX, modalY + modalHeight - mBevel);
          drawInGame.lineTo(modalX, modalY + mBevel);
          drawInGame.closePath();

          drawInGame.fillStyle = "rgba(18, 13, 11, 0.95)";
          drawInGame.fill();
          drawInGame.strokeStyle = btnBorderColor;
          drawInGame.lineWidth = 2;
          drawInGame.stroke();

          // Título del Modal
          drawInGame.fillStyle = "#e8d8c3";
          drawInGame.font = "bold 18px 'Times New Roman', serif";
          drawInGame.fillText("SONIDO", canvas.width / 2, modalY + 30);

          // Botón Audio (Mute / Unmute)
          const audBtnY = modalY + 70;
          const audBtnW = 160;
          const audBtnH = 38;
          const audBtnX = canvas.width / 2 - audBtnW / 2;

          const isHoverAudio =
            mouseX >= audBtnX &&
            mouseX <= audBtnX + audBtnW &&
            mouseY >= audBtnY &&
            mouseY <= audBtnY + audBtnH;

          drawInGame.beginPath();
          drawInGame.moveTo(audBtnX + 6, audBtnY);
          drawInGame.lineTo(audBtnX + audBtnW - 6, audBtnY);
          drawInGame.lineTo(audBtnX + audBtnW, audBtnY + 6);
          drawInGame.lineTo(audBtnX + audBtnW, audBtnY + audBtnH - 6);
          drawInGame.lineTo(audBtnX + audBtnW - 6, audBtnY + audBtnH);
          drawInGame.lineTo(audBtnX + 6, audBtnY + audBtnH);
          drawInGame.lineTo(audBtnX, audBtnY + audBtnH - 6);
          drawInGame.lineTo(audBtnX, audBtnY + 6);
          drawInGame.closePath();

          drawInGame.fillStyle = isHoverAudio ? "#241a16" : btnBgColor;
          drawInGame.fill();
          drawInGame.strokeStyle = isHoverAudio ? "#d1ab7e" : btnBorderColor;
          drawInGame.lineWidth = 1.5;
          drawInGame.stroke();

          drawInGame.fillStyle = isHoverAudio ? "#e8d8c3" : "#a89276";
          drawInGame.font = "14px 'Times New Roman', serif";
          const textoMusica =
            typeof isMusicMuted !== "undefined" && isMusicMuted
              ? "MÚSICA: OFF"
              : "MÚSICA: ON";
          drawInGame.fillText(
            textoMusica,
            canvas.width / 2,
            audBtnY + audBtnH / 2,
          );

          // Botón Volver
          const closeBtnY = modalY + 140;
          const isHoverClose =
            mouseX >= audBtnX &&
            mouseX <= audBtnX + audBtnW &&
            mouseY >= closeBtnY &&
            mouseY <= closeBtnY + audBtnH;

          drawInGame.beginPath();
          drawInGame.moveTo(audBtnX + 6, closeBtnY);
          drawInGame.lineTo(audBtnX + audBtnW - 6, closeBtnY);
          drawInGame.lineTo(audBtnX + audBtnW, closeBtnY + 6);
          drawInGame.lineTo(audBtnX + audBtnW, closeBtnY + audBtnH - 6);
          drawInGame.lineTo(audBtnX + audBtnW - 6, closeBtnY + audBtnH);
          drawInGame.lineTo(audBtnX + 6, closeBtnY + audBtnH);
          drawInGame.lineTo(audBtnX, closeBtnY + audBtnH - 6);
          drawInGame.lineTo(audBtnX, closeBtnY + 6);
          drawInGame.closePath();

          drawInGame.fillStyle = isHoverClose ? "#241a16" : btnBgColor;
          drawInGame.fill();
          drawInGame.strokeStyle = isHoverClose ? "#d1ab7e" : btnBorderColor;
          drawInGame.stroke();

          drawInGame.fillStyle = isHoverClose ? "#e8d8c3" : "#a89276";
          drawInGame.fillText(
            "VOLVER",
            canvas.width / 2,
            closeBtnY + audBtnH / 2,
          );
        }

        // Restaurar valores
        drawInGame.textAlign = "left";
        drawInGame.textBaseline = "alphabetic";
      } else {
        drawInGame.fillStyle = "#121212";
        drawInGame.fillRect(0, 0, canvas.width, canvas.height);
      }
      break;

    case 1:
      if (roomOne.complete) {
        drawInGame.drawImage(roomOne, 0, 0, canvas.width, canvas.height);
      } else {
        drawInGame.fillStyle = "#2d2d2d";
        drawInGame.fillRect(0, 0, canvas.width, canvas.height);
      }
      break;

    case 2:
      if (roomTwo.complete) {
        drawInGame.drawImage(roomTwo, 0, 0, canvas.width, canvas.height);
      } else {
        drawInGame.fillStyle = "#1e3a5f";
        drawInGame.fillRect(0, 0, canvas.width, canvas.height);
      }
      break;

    case 3:
      if (roomThree.complete) {
        drawInGame.drawImage(roomThree, 0, 0, canvas.width, canvas.height);
      } else {
        drawInGame.fillStyle = "#4b2e1e";
        drawInGame.fillRect(0, 0, canvas.width, canvas.height);
      }
      break;

    case 4:
      if (roomFour.complete) {
        drawInGame.drawImage(roomFour, 0, 0, canvas.width, canvas.height);
      } else {
        drawInGame.fillStyle = "#245b3b";
        drawInGame.fillRect(0, 0, canvas.width, canvas.height);
      }
      break;
  }

  // ======================================================
  // FLECHAS DE NAVEGACIÓN
  //
  // De momento son triángulos.
  //
  // Más adelante sustituir por imágenes PNG.
  // ======================================================

  drawInGame.fillStyle = "white";

  // ---------------- SALA 1 ----------------
  //
  // Sala central.
  //
  // Aquí irán:
  //
  // - Imagen de fondo.
  // - Objetos.
  // - Puzles.
  // - Decoración.
  //

  if (currentRoom === 1) {
    // Flecha izquierda
    drawInGame.beginPath();
    drawInGame.moveTo(5, canvas.height / 2);
    drawInGame.lineTo(35, canvas.height / 2 - 30);
    drawInGame.lineTo(35, canvas.height / 2 + 30);
    drawInGame.closePath();
    drawInGame.fill();

    // Flecha derecha
    drawInGame.beginPath();
    drawInGame.moveTo(canvas.width - 5, canvas.height / 2);
    drawInGame.lineTo(canvas.width - 35, canvas.height / 2 - 30);
    drawInGame.lineTo(canvas.width - 35, canvas.height / 2 + 30);
    drawInGame.closePath();
    drawInGame.fill();

    // Flecha arriba
    drawInGame.beginPath();
    drawInGame.moveTo(canvas.width / 2, 5);
    drawInGame.lineTo(canvas.width / 2 - 30, 35);
    drawInGame.lineTo(canvas.width / 2 + 30, 35);
    drawInGame.closePath();
    drawInGame.fill();
  }

  // ---------------- SALA 2 ----------------
  //
  // Sala izquierda.
  //
  // Aquí irá la imagen y sus objetos.
  //

  if (currentRoom === 2) {
    drawInGame.beginPath();
    drawInGame.moveTo(canvas.width - 5, canvas.height / 2);
    drawInGame.lineTo(canvas.width - 35, canvas.height / 2 - 30);
    drawInGame.lineTo(canvas.width - 35, canvas.height / 2 + 30);
    drawInGame.closePath();
    drawInGame.fill();
  }

  // ---------------- SALA 3 ----------------
  //
  // Sala derecha.
  //
  // Aquí irá la imagen y sus objetos.
  //

  if (currentRoom === 3) {
    drawInGame.beginPath();
    drawInGame.moveTo(5, canvas.height / 2);
    drawInGame.lineTo(35, canvas.height / 2 - 30);
    drawInGame.lineTo(35, canvas.height / 2 + 30);
    drawInGame.closePath();
    drawInGame.fill();
  }

  // ---------------- SALA 4 ----------------
  //
  // Sala superior.
  //
  // Aquí irá la imagen y sus objetos.
  //

  if (currentRoom === 4) {
    drawInGame.beginPath();
    drawInGame.moveTo(canvas.width / 2, canvas.height - 5);
    drawInGame.lineTo(canvas.width / 2 - 30, canvas.height - 35);
    drawInGame.lineTo(canvas.width / 2 + 30, canvas.height - 35);
    drawInGame.closePath();
    drawInGame.fill();
  }

  // Coordenadas del ratón (desarrollo)
  drawMouseCoordinates();

  // Actualiza la pantalla continuamente
  requestAnimationFrame(draw);
}

// ==========================================================
// INICIO DEL JUEGO
// ==========================================================

draw();
