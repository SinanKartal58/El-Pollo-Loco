/**
 * Checks whether the current device supports touch-oriented controls.
 * @returns {boolean} Whether mobile controls should be shown.
 */
export function shouldUseMobileControls() {
    return (
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
    );
}


/**
 * Checks whether a touch device is currently in portrait orientation.
 * @returns {boolean} Whether portrait mode blocks gameplay.
 */
export function isPortraitMobile() {
    return shouldUseMobileControls() && window.matchMedia('(orientation: portrait)').matches;
}


/**
 * Checks whether gameplay is permitted in the current orientation.
 * @returns {boolean} Whether the game can start.
 */
export function canStartGameInCurrentOrientation() {
    return !isPortraitMobile();
}


/**
 * Updates the orientation warning and mobile control visibility.
 * @returns {void}
 */
export function updateOrientationState() {
    document.body.classList.toggle('portrait-blocked', isPortraitMobile());
    updateMobileControlsVisibility();
}


/**
 * Shows mobile controls only during active gameplay on touch devices in landscape orientation.
 * @returns {void}
 */
export function updateMobileControlsVisibility() {
    const mobileControls = document.getElementById('mobile-controls');
    if (!mobileControls) return;

    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const winScreen = document.getElementById('win-screen');
    const isMenuScreen = document.body.classList.contains('game-start-screen')
        || (startScreen && !startScreen.classList.contains('d-none'))
        || (gameOverScreen && !gameOverScreen.classList.contains('d-none'))
        || (winScreen && !winScreen.classList.contains('d-none'));

    const showControls = shouldUseMobileControls() && !isPortraitMobile() && !isMenuScreen;
    mobileControls.classList.toggle('d-none', !showControls);
    mobileControls.style.pointerEvents = showControls ? 'auto' : 'none';
}
