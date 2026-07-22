import DrawableObject from './drawable-object.class.js';
import MoveableObject, { GROUND_Y } from './moveble-object.class.js';
import Character from './character.class.js';
import Chicken from './chicken.class.js';
import Cloud from './cloud.class.js';
import Coins from './coin.class.js';
import BottleGround from './bottle.class.js';
import SalsaBottle from './salsa-bottle.class.js';
import ThrowableObject from './throwable-object.class.js';
import StatusBar from './statusbar.class.js';
import Endboss from './endboss.class.js';
import BackgroundObject from './background.object.class.js';
import Keyboard from './keyboard.class.js';
import World from './world.class.js';
import Level from './level.class.js';
import createLevel1 from './levels.js';
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
} from './audio.js';
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


function openDialog(id) {
    if (hasGameStarted && id === 'controlsDialog') {
        return;
    }
    const dialog = document.getElementById(id);
    if (!dialog || dialog.open) return;
    dialog.showModal();
}


function closeDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || !dialog.open) return;
    dialog.close();
}


function closeAllDialogs() {
    document.querySelectorAll('dialog[open]').forEach((dialog) => {
        dialog.close();
    });
}


function stopActiveGameSession() {
    if (world && typeof world.stopGameLoop === 'function') {
        world.stopGameLoop();
    }
    walkingSound.pause();
    walkingSound.currentTime = 0;
    keyboard.reset();
}


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


function toggleMute(event) {
    event.preventDefault();
    toggleMuteAudio();
    updateMuteButtonIcon();
}


function setupKeyboardListeners() {
    if (keyboardListenersAttached) return;
    const handleKeyDown = (e) => {
        resetIdleTimer();
        if (e.key === 'ArrowLeft') keyboard.LEFT_ARROW = true;
        if (e.key === 'ArrowRight') keyboard.RIGHT_ARROW = true;
        if (e.key === ' ') {
            keyboard.SPACE = true;
            e.preventDefault();
        }
        if (e.key.toLowerCase() === 'd') keyboard.KEY_D = true;
    };
    
    const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft') keyboard.LEFT_ARROW = false;
        if (e.key === 'ArrowRight') keyboard.RIGHT_ARROW = false;
        if (e.key === ' ') {
            keyboard.SPACE = false;
            e.preventDefault();
        }
        if (e.key.toLowerCase() === 'd') keyboard.KEY_D = false;
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    keyboardListenersAttached = true;
}


function shouldUseMobileControls() {
    return window.innerWidth <= 900 && (
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
    );
}


function isPortraitMobile() {
    return shouldUseMobileControls() && window.matchMedia('(orientation: portrait)').matches;
}


function canStartGameInCurrentOrientation() {
    return !isPortraitMobile();
}


function updateOrientationState() {
    document.body.classList.toggle('portrait-blocked', isPortraitMobile());
    updateMobileControlsVisibility();
}


function updateMobileControlsVisibility() {
    const mobileControls = document.getElementById('mobile-controls');
    if (!mobileControls) return;
    const showControls = hasGameStarted && shouldUseMobileControls() && !isPortraitMobile();
    mobileControls.classList.toggle('d-none', !showControls);
}


function hideGameScreens() {
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


function showMainMenuScreens() {
    document.body.classList.add('game-start-screen');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


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


function updateMuteButtonIcon() {
    const muteButton = document.getElementById('muteButton');
    if (!muteButton) return;
    muteButton.innerHTML = isMuted() ? '&#128263;' : '&#128266;';
}


function setupMobileControls() {
    const setKeyState = (key, isPressed) => {
        keyboard[key] = isPressed;
    };

    mobileButtonBindings.forEach(({ id, key }) => {
        const button = document.getElementById(id);
        if (!button) return;

        const press = (event) => {
            event.preventDefault();
            resetIdleTimer();
            setKeyState(key, true);
        };

        const release = (event) => {
            event.preventDefault();
            setKeyState(key, false);
        };

        button.addEventListener('pointerdown', press);
        button.addEventListener('pointerup', release);
        button.addEventListener('pointerleave', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('touchstart', press, { passive: false });
        button.addEventListener('touchend', release, { passive: false });
        button.addEventListener('touchcancel', release, { passive: false });
    });

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
            const container = document.getElementById('gameContainer');
            if (!container) return;
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            } else if (container.requestFullscreen) {
                container.requestFullscreen().catch(() => {});
            }
        });
    }

    applyMuteState();
    updateMuteButtonIcon();
    updateOrientationState();
    setupMobileControls();

    ['click', 'touchstart', 'mousemove', 'keydown'].forEach(type =>
        document.addEventListener(type, resetIdleTimer, { passive: type !== 'keydown' })
    );
});


