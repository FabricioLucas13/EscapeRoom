import { INTERFACE_CONFIG, ROOM } from "./config.js";

const stateLink = {
	changeRoomRef: null,
	openExitKeypadRef: null,
	getIsMusicMuted: () => false,
	toggleMusicCallback: null,
	closeOptionsModal: null,
	openOptionsModal: null,
	getGameMusic: null
};

export function initializeInteractions(actions) {
	stateLink.changeRoomRef = actions.changeRoom;
	stateLink.openExitKeypadRef = actions.openExitKeypad;
	stateLink.getIsMusicMuted = actions.getIsMusicMuted;
	stateLink.toggleMusicCallback = actions.toggleMusic;
	stateLink.closeOptionsModal = actions.closeOptionsModal;
	stateLink.openOptionsModal = actions.openOptionsModal;
	stateLink.getGameMusic = actions.getGameMusic;
}

export function toggleMusic() {
	stateLink.toggleMusicCallback();
}

// 🟢 CORRECCIÓN: Nombre exacto de la función exportada en plural
export function getModalInteractions(canvas) {
	const modalTopY = canvas.height / 2 - INTERFACE_CONFIG.MODAL_HEIGHT / 2;
	const modalButtonLeftX = canvas.width / 2 - INTERFACE_CONFIG.MODAL_BUTTON_WIDTH / 2;

	return [
		{ 
			x: modalButtonLeftX, 
			y: modalTopY + 70, 
			width: INTERFACE_CONFIG.MODAL_BUTTON_WIDTH, 
			height: INTERFACE_CONFIG.MODAL_BUTTON_HEIGHT, 
			action: toggleMusic 
		},
		{ 
			x: modalButtonLeftX, 
			y: modalTopY + 140, 
			width: INTERFACE_CONFIG.MODAL_BUTTON_WIDTH, 
			height: INTERFACE_CONFIG.MODAL_BUTTON_HEIGHT, 
			action: () => stateLink.closeOptionsModal() 
		}
	];
}

export function getRoomInteractions(canvas) {
	return {
		[ROOM.START]: [
			{
				x: canvas.width / 2 - INTERFACE_CONFIG.MAIN_BUTTON_WIDTH / 2,
				y: canvas.height / 2 - 35,
				width: INTERFACE_CONFIG.MAIN_BUTTON_WIDTH, 
				height: INTERFACE_CONFIG.MAIN_BUTTON_HEIGHT,
				action: () => { 
					stateLink.changeRoomRef(ROOM.ONE); 
					if (!stateLink.getIsMusicMuted()) {
						stateLink.getGameMusic().play().catch(() => {});
					}
				}
			},
			{
				x: canvas.width / 2 - INTERFACE_CONFIG.MAIN_BUTTON_WIDTH / 2,
				y: canvas.height / 2 + 25,
				width: INTERFACE_CONFIG.MAIN_BUTTON_WIDTH, 
				height: INTERFACE_CONFIG.MAIN_BUTTON_HEIGHT,
				action: () => stateLink.openOptionsModal()
			}
		],
		[ROOM.ONE]: [
			{ 
				x: canvas.width / 2 - INTERFACE_CONFIG.ARROW_SIZE, 
				y: INTERFACE_CONFIG.ARROW_Y_ROOM_ONE, 
				width: INTERFACE_CONFIG.ARROW_SIZE * 2, 
				height: INTERFACE_CONFIG.ARROW_SIZE + 10, 
				action: () => stateLink.changeRoomRef(ROOM.FOUR) 
			}
		],
		[ROOM.FOUR]: [
			{ 
				x: canvas.width / 2 - INTERFACE_CONFIG.ARROW_SIZE, 
				y: canvas.height - INTERFACE_CONFIG.ARROW_SIZE - 10, 
				width: INTERFACE_CONFIG.ARROW_SIZE * 2, 
				height: INTERFACE_CONFIG.ARROW_SIZE + 10, 
				action: () => stateLink.changeRoomRef(ROOM.ONE) 
			},
			{ 
				x: 490, 
				y: 235, 
				width: 140, 
				height: 185, 
				action: () => stateLink.openExitKeypadRef() 
			}
		]
	};
}
