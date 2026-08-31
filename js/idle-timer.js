const IDLE_THRESHOLD_MS = 15000;
let lastActivityAt = Date.now();

/**
 * Resets the time of the most recent player interaction.
 * @returns {void}
 */
export function resetIdleTimer() {
	lastActivityAt = Date.now();
}

/**
 * Checks whether the player has been inactive for the idle threshold.
 * @returns {boolean} Whether long-idle animation should be used.
 */
export function isLongIdle() {
	return Date.now() - lastActivityAt >= IDLE_THRESHOLD_MS;
}

if (typeof window !== 'undefined') {
	['click', 'mousemove', 'touchstart', 'keydown'].forEach((eventType) => {
		window.addEventListener(eventType, resetIdleTimer, { passive: eventType !== 'keydown' });
	});
}


