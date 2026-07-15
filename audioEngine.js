// --- CONFIGURAR EL REPRODUCTOR DE MÚSICA INTERNO ---
const gameMusic = new Audio("assets/musicEscapeRoom.mp3")
gameMusic.loop = true

let isMusicMuted = false

/**
 * 🎵 REPRODUCIR LA MÚSICA PRINCIPAL
 * Gestiona de forma segura el bloqueo de reproducción del navegador.
 */
export function playMusic() {
	if (!isMusicMuted) {
		gameMusic.play().catch(() => {
			console.log("Audio en espera: El navegador requiere una interacción previa del usuario (clic).")
		})
	}
}

/**
 * 🔇 INVERTIR EL ESTADO DE SILENCIO (Mute / Unmute)
 */
export function toggleMusic() {
	isMusicMuted = !isMusicMuted
	gameMusic.muted = isMusicMuted
	
	// Si acabamos de activar el sonido, intentamos reproducirlo de inmediato
	if (!isMusicMuted) {
		playMusic()
	}
}

/**
 * 📊 CONSULTAR SI EL AUDIO ESTÁ SILENCIADO
 * Devuelve un booleano (true/false) para que la interfaz sepa qué texto pintar en pantalla.
 */
export function getIsMuted() {
	return isMusicMuted
}
