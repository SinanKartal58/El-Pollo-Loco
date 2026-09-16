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
    playBackgroundMusic
} from './js/audio.js';
import { resetIdleTimer } from './js/idle-timer.js';
import { keyboard } from './js/game-state.js';
import { isNativeFullscreenActive, exitImmersiveMode, toggleFullscreenMode } from './js/fullscreen.js';
import { updateMobileControlsVisibility, canStartGameInCurrentOrientation, updateOrientationState } from './js/orientation.js';
import { closeDialog, closeAllDialogs, hideGameScreens, showMainMenuScreens } from './js/screens.js';
import { setupMobileControls } from './js/mobile-controls.js';
import { toggleMute, updateMuteButtonIcon } from './js/audio-ui.js';
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
let hasGameStarted = false;
let keyboardListenersAttached = false;


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
    winSound.play().catch((error) => console.warn('Unable to play win sound:', error));
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
    lostSound.play().catch((error) => console.warn('Unable to play lose sound:', error));
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
            toggleFullscreenMode().catch((error) => console.warn('Fullscreen toggle failed:', error));
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


