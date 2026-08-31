import DrawableObject from './js/drawable-object.class.js';
import MoveableObject, { GROUND_Y } from './js/moveble-object.class.js';
import Character from './js/character.class.js';
import Chicken from './js/chicken.class.js';
import Cloud from './js/cloud.class.js';
import Coins from './js/coin.class.js';
import BottleGround from './js/bottle.class.js';
import SalsaBottle from './js/salsa-bottle.class.js';
import ThrowableObject from './js/throwable-object.class.js';
import StatusBar from './js/statusbar.class.js';
import Endboss from './js/endboss.class.js';
import BackgroundObject from './js/background.object.class.js';
import Keyboard from './js/keyboard.class.js';
import World from './js/world.class.js';
import Level from './js/level.class.js';
import createLevel1 from './js/levels.js';
import {
    backgroundMusic,
    lostSound,
    winSound,
    coinSound,
    bottleSound,
    throwSound,
    walkingSound,
    hurtSound,
    chickenHitSound,
    applyMuteState,
    playBackgroundMusic,
    toggleMute as toggleMuteAudio,
    isMuted
} from './js/audio.js';
import { resetIdleTimer } from './js/idle-timer.js';
window.DrawableObject = DrawableObject;
window.MoveableObject = MoveableObject;
window.Character = Character;
window.Chicken = Chicken;
window.Cloud = Cloud;
window.Coin = Coins;
window.Bottle = BottleGround;
window.SalsaBottle = SalsaBottle;
window.ThrowableObject = ThrowableObject;
window.StatusBar = StatusBar;
window.Endboss = Endboss;
window.BackgroundObject = BackgroundObject;
window.Keyboard = Keyboard;
window.World = World;
window.Level = Level;
window.GROUND_Y = GROUND_Y;
let canvas;
let world;
let keyboard = new Keyboard();
let hasGameStarted = false;
let keyboardListenersAttached = false;

const mobileButtonBindings = [
    { id: 'btn-left', key: 'LEFT_ARROW' },
    { id: 'btn-right', key: 'RIGHT_ARROW' },
    { id: 'btn-jump', key: 'SPACE' },
    { id: 'btn-throw', key: 'KEY_D' }
];


/**
 * Gets the element containing the game canvas and overlays.
 * @returns {HTMLElement|null} Game container element.
 */
function getGameContainer() {
    return document.getElementById('gameContainer');
}


/**
 * Checks whether browser fullscreen mode is active.
 * @returns {boolean} Whether native fullscreen is active.
 */
function isNativeFullscreenActive() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}


/**
 * Enables the CSS fallback for immersive game mode.
 * @returns {void}
 */
function enterImmersiveMode() {
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
function exitImmersiveMode() {
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
async function toggleFullscreenMode() {
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


/**
 * Opens a dialog when it is available and currently closed.
 * @param {string} id ID of the dialog to open.
 * @returns {void}
 */
function openDialog(id) {
    if (hasGameStarted && id === 'controlsDialog') {
        return;
    }
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    dialog.showModal();
}


/**
 * Closes an open dialog.
 * @param {string} id ID of the dialog to close.
 * @returns {void}
 */
function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || !dialog.open) return;
    dialog.close();
}


/**
 * Closes every dialog currently displayed on the page.
 * @returns {void}
 */
function closeAllDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => {
        dialog.close();
    });
}


/**
 * Stops the active world and resets movement-related input state.
 * @returns {void}
 */
function stopActiveGameSession() {
    if (world && typeof world.stopGameLoop === 'function') {
        world.stopGameLoop();
    }
    walkingSound.pause();
    walkingSound.currentTime = 0;
    keyboard.reset();
}


/**
 * Starts a new game when the device orientation permits it.
 * @returns {void}
 */
function startGame() {
    if (!canStartGameInCurrentOrientation()) {
        updateOrientationState();
        return;
    }

    closeAllDialogs();
    hideGameScreens();
    hasGameStarted = true;
    createWorld();
    playBackgroundMusic();
    setupKeyboardListeners();
    updateMobileControlsVisibility();
}


/**
 * Stops the game and displays the victory screen.
 * @returns {void}
 */
function showWinScreen() {
    stopActiveGameSession();
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
    hasGameStarted = false;
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.remove('d-none');
    updateMobileControlsVisibility();
}


/**
 * Stops the game and displays the game-over screen once.
 * @returns {void}
 */
function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (!gameOverScreen || !gameOverScreen.classList.contains('d-none')) return;
    stopActiveGameSession();
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    lostSound.currentTime = 0;
    lostSound.play().catch(() => {});
    hasGameStarted = false;
    document.getElementById('win-screen').classList.add('d-none');
    gameOverScreen.classList.remove('d-none');
    updateMobileControlsVisibility();
}


/**
 * Resets the active world and starts a new game.
 * @returns {void}
 */
function restartGame() {
    if (!canStartGameInCurrentOrientation()) {
        updateOrientationState();
        return;
    }
    closeAllDialogs();
    stopActiveGameSession();
    hideGameScreens();
    hasGameStarted = true;
    createWorld();
    playBackgroundMusic();
    updateMobileControlsVisibility();
}


/**
 * Stops the game and returns to the start screen.
 * @returns {void}
 */
function backToMainMenu() {
    closeAllDialogs();
    stopActiveGameSession();
    hasGameStarted = false;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    showMainMenuScreens();
    updateMobileControlsVisibility();
}


/**
 * Toggles game audio from the mute button event.
 * @param {Event} event Click event from the mute button.
 * @returns {void}
 */
function toggleMute(event) {
    event.preventDefault();
    toggleMuteAudio();
    updateMuteButtonIcon();
}


/**
 * Updates the game keyboard state for a browser keyboard event.
 * @param {KeyboardEvent} event Browser keyboard event.
 * @param {boolean} isPressed Whether the key was pressed or released.
 * @returns {void}
 */
function updateKeyboardState(event, isPressed) {
    const keys = { ArrowLeft: 'LEFT_ARROW', ArrowRight: 'RIGHT_ARROW', d: 'KEY_D' };
    const key = keys[event.key.toLowerCase()] || keys[event.key];
    if (key) keyboard[key] = isPressed;
    if (event.key === ' ') {
        keyboard.SPACE = isPressed;
        event.preventDefault();
    }
}

/**
 * Handles a key press for the game controls.
 * @param {KeyboardEvent} event Browser keyboard event.
 * @returns {void}
 */
function handleKeyDown(event) {
    resetIdleTimer();
    updateKeyboardState(event, true);
}

/**
 * Handles a key release for the game controls.
 * @param {KeyboardEvent} event Browser keyboard event.
 * @returns {void}
 */
function handleKeyUp(event) {
    updateKeyboardState(event, false);
}

/**
 * Attaches the keyboard listeners once per page load.
 * @returns {void}
 */
function setupKeyboardListeners() {
    if (keyboardListenersAttached) return;
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    keyboardListenersAttached = true;
}


/**
 * Checks whether the current device supports touch-oriented controls.
 * @returns {boolean} Whether mobile controls should be shown.
 */
function shouldUseMobileControls() {
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
function isPortraitMobile() {
    return shouldUseMobileControls() && window.matchMedia('(orientation: portrait)').matches;
}


/**
 * Checks whether gameplay is permitted in the current orientation.
 * @returns {boolean} Whether the game can start.
 */
function canStartGameInCurrentOrientation() {
    return !isPortraitMobile();
}


/**
 * Updates the orientation warning and mobile control visibility.
 * @returns {void}
 */
function updateOrientationState() {
    document.body.classList.toggle('portrait-blocked', isPortraitMobile());
    updateMobileControlsVisibility();
}


/**
 * Shows mobile controls only on touch devices in landscape orientation.
 * @returns {void}
 */
function updateMobileControlsVisibility() {
    const mobileControls = document.getElementById('mobile-controls');
    if (!mobileControls) return;
    const showControls = shouldUseMobileControls() && !isPortraitMobile();
    mobileControls.classList.toggle('d-none', !showControls);
}


/**
 * Hides every game overlay before a game session begins.
 * @returns {void}
 */
function hideGameScreens() {
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


/**
 * Shows the start overlay and hides end-game overlays.
 * @returns {void}
 */
function showMainMenuScreens() {
    document.body.classList.add('game-start-screen');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


/**
 * Creates a new world and assigns its game sound effects.
 * @returns {void}
 */
function createWorld() {
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas, keyboard, createLevel1());
    world.sounds = {
        coin: coinSound,
        bottle: bottleSound,
        throw: throwSound,
        walking: walkingSound,
        hurt: hurtSound,
        chickenHit: chickenHitSound
    };
}


/**
 * Updates the mute button icon to reflect the current audio state.
 * @returns {void}
 */
function updateMuteButtonIcon() {
    const muteButton = document.getElementById('muteButton');
    if (!muteButton) return;
    muteButton.innerHTML = isMuted() ? '&#128263;' : '&#128266;';
}


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
function setupMobileControls() {
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
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.startGame = startGame;
window.restartGame = restartGame;
window.backToMainMenu = backToMainMenu;
window.toggleMute = toggleMute;
window.showWinScreen = showWinScreen;
window.showGameOverScreen = showGameOverScreen;
document.addEventListener('DOMContentLoaded', () => {
    const controlsBtn = document.getElementById('controls-info-btn');
    if (controlsBtn) {
        controlsBtn.addEventListener('click', () => openDialog('controlsDialog'));
    }
    
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            toggleFullscreenMode().catch(() => {});
        });
    }

    document.addEventListener('fullscreenchange', () => {
        if (!isNativeFullscreenActive()) {
            exitImmersiveMode();
        }
    });
    document.addEventListener('webkitfullscreenchange', () => {
        if (!isNativeFullscreenActive()) {
            exitImmersiveMode();
        }
    });

    applyMuteState();
    updateMuteButtonIcon();
    updateOrientationState();
    setupMobileControls();

    ['click', 'touchstart', 'mousemove', 'keydown'].forEach(type =>
        document.addEventListener(type, resetIdleTimer, { passive: type !== 'keydown' })
    );
});


