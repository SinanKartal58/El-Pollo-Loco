/**
 * Gets the element containing the game.
 * @returns {HTMLElement|null} Game container element.
 */
function getGameContainer() {
	return document.getElementById('gameContainer');
}

/**
 * Checks whether the current device supports touch-oriented controls.
 * @returns {boolean} Whether the device is touch-oriented.
 */
function isMobileLike() {
	return (
		window.matchMedia('(pointer: coarse)').matches ||
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0
	);
}

/**
 * Toggles browser fullscreen for the game container.
 * @returns {void}
 */
export function toggleFullscreen() {
	const container = getGameContainer();
	if (!container) return;
	if (document.fullscreenElement) {
		document.exitFullscreen().catch((error) => console.warn('Unable to exit fullscreen mode.', error));
	} else if (container.requestFullscreen) {
		container.requestFullscreen().catch((error) => console.warn('Unable to enter fullscreen mode.', error));
	}
}

/**
 * Placeholder for requesting fullscreen from a user gesture.
 * @returns {void}
 */
export function maybeRequestFullscreenFromGesture() {
}

/**
 * Updates the portrait-mode warning for touch devices.
 * @returns {void}
 */
export function checkOrientation() {
	const blocked = isMobileLike() && window.matchMedia('(orientation: portrait)').matches;
	document.body.classList.toggle('portrait-blocked', blocked);
}

/**
 * Placeholder for responsive layout updates.
 * @returns {void}
 */
export function refreshResponsiveLayout() {
}

/**
 * Checks whether the device orientation permits gameplay.
 * @returns {boolean} Whether the game can start.
 */
export function canStartGameInCurrentOrientation() {
	return !(isMobileLike() && window.matchMedia('(orientation: portrait)').matches);
}

/**
 * Binds a control button to one keyboard state property.
 * @param {string} id ID of the control button.
 * @param {string} key Keyboard property controlled by the button.
 * @param {Keyboard} keyboard Keyboard state object.
 * @returns {void}
 */
function bindTouchControl(id, key, keyboard) {
	const button = document.getElementById(id);
	if (!button) return;
	const press = (event) => {
		event.preventDefault();
		keyboard[key] = true;
	};
	const release = (event) => {
		event.preventDefault();
		keyboard[key] = false;
	};
	button.addEventListener('pointerdown', press);
	button.addEventListener('pointerup', release);
	button.addEventListener('pointercancel', release);
	button.addEventListener('pointerleave', release);
	button.addEventListener('touchstart', press, { passive: false });
	button.addEventListener('touchend', release, { passive: false });
	button.addEventListener('touchcancel', release, { passive: false });
}

/**
 * Connects all mobile buttons to the provided keyboard state.
 * @param {Keyboard} keyboard Keyboard state object.
 * @returns {void}
 */
export function initTouchControls(keyboard) {
	const controls = document.getElementById('mobile-controls');
	if (!controls) return;
	if (controls.dataset.bound === 'true') return;
	const bindings = [['btn-left', 'LEFT_ARROW'], ['btn-right', 'RIGHT_ARROW'], ['btn-jump', 'SPACE'], ['btn-throw', 'KEY_D']];
	bindings.forEach(([id, key]) => bindTouchControl(id, key, keyboard));
	controls.addEventListener('contextmenu', (event) => event.preventDefault());
	controls.dataset.bound = 'true';
}


