import { updateMobileControlsVisibility } from './orientation.js';

/**
 * Gets the element containing the game canvas and overlays.
 * @returns {HTMLElement|null} Game container element.
 */
export function getGameContainer() {
    return document.getElementById('gameContainer');
}


/**
 * Checks whether browser fullscreen mode is active.
 * @returns {boolean} Whether native fullscreen is active.
 */
export function isNativeFullscreenActive() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}


/**
 * Enables the CSS fallback for immersive game mode.
 * @returns {void}
 */
export function enterImmersiveMode() {
    document.body.classList.add('immersive-mode');
    const gameContainer = getGameContainer();
    if (gameContainer) {
        gameContainer.classList.add('immersive-mode');
    }
    updateMobileControlsVisibility();
}


/**
 * Disables the CSS fallback for immersive game mode.
 * @returns {void}
 */
export function exitImmersiveMode() {
    document.body.classList.remove('immersive-mode');
    const gameContainer = getGameContainer();
    if (gameContainer) {
        gameContainer.classList.remove('immersive-mode');
    }
    updateMobileControlsVisibility();
}


/**
 * Toggles native fullscreen mode or its CSS fallback.
 * @returns {Promise<void>} Resolves after the fullscreen state changes.
 */
export async function toggleFullscreenMode() {
    const gameContainer = getGameContainer();
    if (!gameContainer) return;

    if (isNativeFullscreenActive()) {
        if (document.exitFullscreen) {
            await document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        exitImmersiveMode();
        return;
    }

    if (document.body.classList.contains('immersive-mode')) {
        exitImmersiveMode();
        return;
    }

    try {
        if (gameContainer.requestFullscreen) {
            await gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) {
            gameContainer.webkitRequestFullscreen();
        } else {
            enterImmersiveMode();
        }
    } catch {
        enterImmersiveMode();
    }
}
