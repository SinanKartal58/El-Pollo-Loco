const IDLE_THRESHOLD_MS = 15000;
let lastActivityAt = Date.now();

export function resetIdleTimer() {
	lastActivityAt = Date.now();
}

export function isLongIdle() {
	return Date.now() - lastActivityAt >= IDLE_THRESHOLD_MS;
}

if (typeof window !== 'undefined') {
	['click', 'mousemove', 'touchstart', 'keydown'].forEach((eventType) => {
		window.addEventListener(eventType, resetIdleTimer, { passive: eventType !== 'keydown' });
	});
}


