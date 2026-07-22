function getGameContainer() {
	return document.getElementById('gameContainer');
}

function isMobileLike() {
	return window.innerWidth <= 900 && (
		window.matchMedia('(pointer: coarse)').matches ||
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0
	);
}

export function toggleFullscreen() {
	const container = getGameContainer();
	if (!container) return;
	if (document.fullscreenElement) {
		document.exitFullscreen().catch(() => {});
	} else if (container.requestFullscreen) {
		container.requestFullscreen().catch(() => {});
	}
}

export function maybeRequestFullscreenFromGesture() {
}

export function checkOrientation() {
	const blocked = isMobileLike() && window.matchMedia('(orientation: portrait)').matches;
	document.body.classList.toggle('portrait-blocked', blocked);
}

export function refreshResponsiveLayout() {
}

export function canStartGameInCurrentOrientation() {
	return !(isMobileLike() && window.matchMedia('(orientation: portrait)').matches);
}

export function initTouchControls(keyboard) {
	const controls = document.getElementById('mobile-controls');
	if (!controls) return;
	if (controls.dataset.bound === 'true') return;

	const bindings = [
		['btn-left', 'LEFT_ARROW'],
		['btn-right', 'RIGHT_ARROW'],
		['btn-jump', 'SPACE'],
		['btn-throw', 'KEY_D']
	];

	bindings.forEach(([id, key]) => {
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
	});

	controls.addEventListener('contextmenu', (event) => event.preventDefault());
	controls.dataset.bound = 'true';
}


