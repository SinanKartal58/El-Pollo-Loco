import { resetIdleTimer } from './idle-timer.js';
import { updateMobileControlsVisibility, updateOrientationState } from './orientation.js';
import { keyboard } from './game-state.js';

const mobileButtonBindings = [
    { id: 'btn-left', key: 'LEFT_ARROW' },
    { id: 'btn-right', key: 'RIGHT_ARROW' },
    { id: 'btn-jump', key: 'SPACE' },
    { id: 'btn-throw', key: 'KEY_D' }
];


/**
 * Sets a virtual keyboard key and prevents throwing while jumping.
 * @param {string} key Keyboard property to update.
 * @param {boolean} isPressed Whether the key is pressed.
 * @returns {void}
 */
function setMobileKeyState(key, isPressed) {
    keyboard[key] = isPressed;
    if (key === 'KEY_D' && isPressed && keyboard.SPACE) keyboard.SPACE = false;
}

/**
 * Handles a press event from a mobile control button.
 * @param {Event} event Pointer or touch event.
 * @param {string} key Keyboard property controlled by the button.
 * @returns {void}
 */
function handleMobileControlPress(event, key) {
    event.preventDefault();
    resetIdleTimer();
    setMobileKeyState(key, true);
}

/**
 * Handles a release event from a mobile control button.
 * @param {Event} event Pointer or touch event.
 * @param {string} key Keyboard property controlled by the button.
 * @returns {void}
 */
function handleMobileControlRelease(event, key) {
    event.preventDefault();
    setMobileKeyState(key, false);
}

/**
 * Attaches an event listener for each event name.
 * @param {HTMLElement} button Mobile control button.
 * @param {string[]} eventNames Event names to bind.
 * @param {Function} handler Listener callback.
 * @param {boolean} [isTouch=false] Whether touch listener options are needed.
 * @returns {void}
 */
function addMobileControlListeners(button, eventNames, handler, isTouch = false) {
    eventNames.forEach((eventName) => {
        button.addEventListener(eventName, handler, isTouch ? { passive: false } : undefined);
    });
}

/**
 * Attaches press and release listeners to one mobile control button.
 * @param {string} id ID of the control button.
 * @param {string} key Keyboard property controlled by the button.
 * @returns {void}
 */
function bindMobileControl(id, key) {
    const button = document.getElementById(id);
    if (!button) return;
    const press = (event) => handleMobileControlPress(event, key);
    const release = (event) => handleMobileControlRelease(event, key);
    addMobileControlListeners(button, ['pointerdown'], press);
    addMobileControlListeners(button, ['pointerup', 'pointerleave', 'pointercancel'], release);
    addMobileControlListeners(button, ['touchstart'], press, true);
    addMobileControlListeners(button, ['touchend', 'touchcancel'], release, true);
}

/**
 * Initializes touch controls and their orientation-dependent visibility.
 * @returns {void}
 */
export function setupMobileControls() {
    mobileButtonBindings.forEach(({ id, key }) => bindMobileControl(id, key));
    window.addEventListener('resize', updateMobileControlsVisibility);
    window.addEventListener('orientationchange', updateMobileControlsVisibility);
    window.addEventListener('resize', updateOrientationState);
    window.addEventListener('orientationchange', updateOrientationState);
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.addEventListener('contextmenu', (event) => event.preventDefault());
    }
    updateMobileControlsVisibility();
}
