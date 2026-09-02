/**
 * Closes an open dialog.
 * @param {string} id ID of the dialog to close.
 * @returns {void}
 */
export function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || !dialog.open) return;
    dialog.close();
}


/**
 * Closes every dialog currently displayed on the page.
 * @returns {void}
 */
export function closeAllDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => {
        dialog.close();
    });
}


/**
 * Hides every game overlay before a game session begins.
 * @returns {void}
 */
export function hideGameScreens() {
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


/**
 * Shows the start overlay and hides end-game overlays.
 * @returns {void}
 */
export function showMainMenuScreens() {
    document.body.classList.add('game-start-screen');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}
