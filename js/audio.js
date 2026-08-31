/**
 * Shared game audio configuration and mute state.
 */
import BurstSound from './burst-sound.class.js';
import LoopSound from './loop-sound.class.js';
import PatternLoopSound from './pattern-loop-sound.class.js';

const MUTE_STORAGE_KEY = 'elPolloMuted';

let muted = false;

try {
    muted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
} catch {
    muted = false;
}

/**
 * Schedules a tone pattern when audio is not muted.
 * @param {Array<object>} pattern Tone definitions to play.
 * @returns {void}
 */
function playSoundIfNotMuted(pattern) {
    if (muted) return;
    pattern.forEach((step) => {
        playTone(step.freq, step.duration, step.type, step.volume, step.delay);
    });
}

export const backgroundMusic = new PatternLoopSound([
    { freq: 196, duration: 0.12, type: 'triangle', volume: 0.035 },
    { freq: 247, duration: 0.12, type: 'triangle', volume: 0.03 },
    { freq: 294, duration: 0.12, type: 'triangle', volume: 0.03 },
    { freq: 247, duration: 0.12, type: 'triangle', volume: 0.03 }
], 380);

export const lostSound = new BurstSound([
    { freq: 220, duration: 0.12, type: 'sawtooth', volume: 0.05, delay: 0 },
    { freq: 174, duration: 0.18, type: 'sawtooth', volume: 0.05, delay: 0.14 },
    { freq: 130, duration: 0.22, type: 'sawtooth', volume: 0.06, delay: 0.34 }
]);

export const winSound = new BurstSound([
    { freq: 392, duration: 0.12, type: 'triangle', volume: 0.05, delay: 0 },
    { freq: 494, duration: 0.12, type: 'triangle', volume: 0.05, delay: 0.12 },
    { freq: 587, duration: 0.18, type: 'triangle', volume: 0.055, delay: 0.24 }
]);

export const coinSound = new BurstSound([
    { freq: 880, duration: 0.06, type: 'square', volume: 0.04, delay: 0 },
    { freq: 1320, duration: 0.08, type: 'square', volume: 0.04, delay: 0.06 }
]);

export const bottleSound = new BurstSound([
    { freq: 460, duration: 0.09, type: 'triangle', volume: 0.035, delay: 0 }
]);

export const throwSound = new BurstSound([
    { freq: 280, duration: 0.08, type: 'sawtooth', volume: 0.04, delay: 0 },
    { freq: 360, duration: 0.08, type: 'sawtooth', volume: 0.03, delay: 0.08 }
]);

export const walkingSound = new LoopSound(90, 'square', 0.008);

export const hurtSound = new BurstSound([
    { freq: 200, duration: 0.09, type: 'sawtooth', volume: 0.05, delay: 0 }
]);

export const chickenHitSound = new BurstSound([
    { freq: 320, duration: 0.07, type: 'square', volume: 0.04, delay: 0 },
    { freq: 260, duration: 0.09, type: 'square', volume: 0.04, delay: 0.08 }
]);

export function applyMuteState() {
	try {
		muted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
	} catch {
		muted = false;
	}

	if (muted) {
		backgroundMusic.pause();
		walkingSound.pause();
	}
}

export function playBackgroundMusic() {
	return backgroundMusic.play();
}

export function toggleMute() {
	muted = !muted;

	try {
		localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
	} catch {
	}

	if (muted) {
		backgroundMusic.pause();
		walkingSound.pause();
	}

	return muted;
}

export function isMuted() {
	return muted;
}


