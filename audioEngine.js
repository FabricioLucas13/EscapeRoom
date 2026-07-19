import { GAME_ASSET_SOURCES } from "./config.js"

// --- CONFIGURAR EL REPRODUCTOR DE MÚSICA INTERNO ---
const backgroundMusic = new Audio(`assets/${GAME_ASSET_SOURCES.AUDIO.BACKGROUND_MUSIC}`)
backgroundMusic.loop = true
backgroundMusic.preload = "none"

let isAudioMuted = false

/**
 * 🎵 REPRODUCIR LA MÚSICA PRINCIPAL
 * Gestiona de forma segura el bloqueo de reproducción del navegador.
 */
export function playMusic() {
	if (!isAudioMuted) {
		backgroundMusic.play().catch(() => {
			console.log("Audio en espera: El navegador requiere una interacción previa del usuario (clic).")
		})
	}
}

/**
 * 🔇 INVERTIR EL ESTADO DE SILENCIO (Mute / Unmute)
 */
export function toggleMusic() {
	isAudioMuted = !isAudioMuted
	backgroundMusic.muted = isAudioMuted
	
	// Si acabamos de activar el sonido, intentamos reproducirlo de inmediato
	if (!isAudioMuted) {
		playMusic()
	}
}

/**
 * 📊 CONSULTAR SI EL AUDIO ESTÁ SILENCIADO
 * Devuelve un booleano (true/false) para que la interfaz sepa qué texto pintar en pantalla.
 */
export function getIsMuted() {
	return isAudioMuted
}
