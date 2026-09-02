import { toggleMute as toggleMuteAudio, isMuted } from './audio.js';

/**
 * Toggles game audio from the mute button event.
 * @param {Event} event Click event from the mute button.
 * @returns {void}
 */
export function toggleMute(event) {
    event.preventDefault();
    toggleMuteAudio();
    updateMuteButtonIcon();
}


/**
 * Updates the mute button icon to reflect the current audio state.
 * @returns {void}
 */
export function updateMuteButtonIcon() {
    const muteButton = document.getElementById('muteButton');
    if (!muteButton) return;
    muteButton.innerHTML = isMuted() ? '&#128263;' : '&#128266;';
}
