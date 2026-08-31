import createLevel1Objects from "../levels/level1.js";
import World from "../classes/world.class.js";
import Keyboard from "../classes/keyboard.class.js";
import Level from "../classes/level.class.js";
import {
    backgroundMusic, lostSound, winSound, coinSound, bottleSound, throwSound, walkingSound, hurtSound, chickenHitSound,
    applyMuteState, playBackgroundMusic, toggleMute
} from "./audio.js";
import {
    toggleFullscreen, maybeRequestFullscreenFromGesture, checkOrientation,
    refreshResponsiveLayout, canStartGameInCurrentOrientation,
    initTouchControls
} from "./input.js";
import { resetIdleTimer } from "./idle-timer.js";

let canvas;
let world;
let keyboard = new Keyboard();
let hasGameStarted = false;


function openDialog(id) {
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


function setWinScreenImage() {
    const winScreenImage = document.getElementById('winScreenImage');
    winScreenImage.src = 'img/You won, you lost/You Won B.png';
}


function initWinScreenImageRandomizer() {
    const winScreen = document.getElementById('win-screen');
    if (!winScreen) return;
    const observer = new MutationObserver(() => {
        if (!winScreen.classList.contains('d-none')) setWinScreenImage();
    });
    observer.observe(winScreen, { attributes: true, attributeFilter: ['class'] });
}


function stopAllSoundsOnWin() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
}


function showWinScreen() {
    stopActiveGameSession();
    stopAllSoundsOnWin();
    winSound.currentTime = 0;
    winSound.play().catch(() => {});
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.remove('d-none');
}


function stopAllSoundsOnGameOver() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    walkingSound.pause();
    walkingSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    lostSound.play().catch(() => {});
}


function showGameOverScreen() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (!gameOverScreen || !gameOverScreen.classList.contains('d-none')) return;
    stopActiveGameSession();
    document.getElementById('win-screen').classList.add('d-none');
    stopAllSoundsOnGameOver();
    gameOverScreen.classList.remove('d-none');
}


function stopActiveGameSession() {
    if (world) {
        world.stopped = true;
        if (world.animationFrameId) {
            cancelAnimationFrame(world.animationFrameId);
            world.animationFrameId = null;
        }
    }
    walkingSound.pause();
    walkingSound.currentTime = 0;
    for (let i = 1; i < 9999; i++) window.clearInterval(i);
}


function startGame() {
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    closeAllDialogs();
    prepareGameStart();
}


function restartGame() {
    if (!canStartGameInCurrentOrientation()) return;
    maybeRequestFullscreenFromGesture();
    stopActiveGameSession();
    closeAllDialogs();
    prepareGameStart();
}


function hideGameScreens() {
    document.body.classList.remove('game-start-screen');
    document.getElementById('startScreen').classList.add('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


function prepareGameStart() {
    hideGameScreens();
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
    setWinScreenImage();
    keyboard.reset();
    hasGameStarted = true;
    playBackgroundMusic();
    generateWorld();
}


function showMainMenuScreens() {
    document.body.classList.add('game-start-screen');
    document.getElementById('startScreen').classList.remove('d-none');
    document.getElementById('gameOverScreen').classList.add('d-none');
    document.getElementById('win-screen').classList.add('d-none');
}


function stopAllSoundsOnMenu() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    lostSound.pause();
    lostSound.currentTime = 0;
    winSound.pause();
    winSound.currentTime = 0;
}


function backToMainMenu() {
    stopActiveGameSession();
    closeAllDialogs();
    showMainMenuScreens();
    keyboard.reset();
    hasGameStarted = false;
    stopAllSoundsOnMenu();
}


function createActiveLevel() {
    const levelData = createLevel1Objects();
    return new Level(
        levelData.enemies,
        levelData.clouds,
        levelData.backgroundObjects,
        levelData.coins,
        levelData.levelEndX,
        levelData.bottles
    );
}


function generateWorld() {
    canvas = document.getElementById("gameCanvas");
    world = new World(canvas, keyboard, createActiveLevel());
    world.sounds = {
        coin: coinSound,
        bottle: bottleSound,
        throw: throwSound,
        walking: walkingSound,
        hurt: hurtSound,
        chickenHit: chickenHitSound
    };
}

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

window.addEventListener("keydown", (event) => {
    resetIdleTimer();
    switch (event.code) {
        case "Space":
            event.preventDefault();
            keyboard.SPACE = true;
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = true;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = true;
            break;
        case "KeyD":
            keyboard.KEY_D = true;
            break;
        default:
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.code) {
        case "Space":
            keyboard.SPACE = false;
            break;
        case "ArrowLeft":
            keyboard.LEFT_ARROW = false;
            break;
        case "ArrowRight":
            keyboard.RIGHT_ARROW = false;
            break;
        case "KeyD":
            keyboard.KEY_D = false;
            break;
        default:
            break;
    }
});

window.startGame = startGame;
window.restartGame = restartGame;
window.backToMainMenu = backToMainMenu;
window.toggleMute = (event) => toggleMute(event, hasGameStarted);
window.openDialog = openDialog;
window.closeDialog = closeDialog;
window.showWinScreen = showWinScreen;
window.showGameOverScreen = showGameOverScreen;

const fullscreenButton = document.getElementById('fullscreen-btn');
if (fullscreenButton) {
    fullscreenButton.addEventListener('click', toggleFullscreen);
}

initTouchControls(keyboard);
initWinScreenImageRandomizer();
checkOrientation();
refreshResponsiveLayout();
applyMuteState();
setWinScreenImage();

['click', 'touchstart', 'mousemove'].forEach(type =>
    document.addEventListener(type, resetIdleTimer, { passive: true })
);

window.addEventListener('resize', refreshResponsiveLayout);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => setTimeout(() => {
    refreshResponsiveLayout();
    checkOrientation();
}, 50));

