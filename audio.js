const MUTE_STORAGE_KEY = 'elPolloMuted';

let muted = false;

try {
	muted = localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
} catch {
	muted = false;
}

let audioContext = null;

function getAudioContext() {
	if (!audioContext) {
		const AudioCtx = window.AudioContext || window.webkitAudioContext;
		if (!AudioCtx) return null;
		audioContext = new AudioCtx();
	}
	return audioContext;
}

function playTone(frequency, duration = 0.08, type = 'sine', volume = 0.05, delay = 0) {
	const ctx = getAudioContext();
	if (!ctx || muted) return;
	const startAt = ctx.currentTime + delay;
	const endAt = startAt + duration;

	const osc = ctx.createOscillator();
	const gain = ctx.createGain();

	osc.type = type;
	osc.frequency.value = frequency;

	gain.gain.setValueAtTime(0, startAt);
	gain.gain.linearRampToValueAtTime(volume, startAt + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

	osc.connect(gain);
	gain.connect(ctx.destination);

	osc.start(startAt);
	osc.stop(endAt + 0.01);
}

class BurstSound {
	constructor(pattern) {
		this.pattern = pattern;
		this.paused = true;
		this.currentTime = 0;
	}

	play() {
		this.paused = false;
		if (!muted) {
			this.pattern.forEach((step) => {
				playTone(step.freq, step.duration, step.type, step.volume, step.delay);
			});
		}

		const totalDuration = this.pattern.reduce(
			(maxDelay, step) => Math.max(maxDelay, step.delay + step.duration),
			0
		);

		setTimeout(() => {
			this.paused = true;
		}, Math.ceil(totalDuration * 1000));

		return Promise.resolve();
	}

	pause() {
		this.paused = true;
	}
}

class LoopSound {
	constructor(frequency, type = 'sine', volume = 0.02) {
		this.frequency = frequency;
		this.type = type;
		this.volume = volume;
		this.paused = true;
		this.currentTime = 0;
		this.oscillator = null;
		this.gain = null;
	}

	play() {
		if (!this.paused) return Promise.resolve();
		if (muted) return Promise.resolve();

		const ctx = getAudioContext();
		if (!ctx) return Promise.resolve();

		this.oscillator = ctx.createOscillator();
		this.gain = ctx.createGain();

		this.oscillator.type = this.type;
		this.oscillator.frequency.value = this.frequency;
		this.gain.gain.value = this.volume;

		this.oscillator.connect(this.gain);
		this.gain.connect(ctx.destination);
		this.oscillator.start();
		this.paused = false;

		return Promise.resolve();
	}

	pause() {
		if (this.oscillator) {
			this.oscillator.stop();
			this.oscillator.disconnect();
			this.gain.disconnect();
			this.oscillator = null;
			this.gain = null;
		}
		this.paused = true;
	}
}

class PatternLoopSound {
	constructor(pattern, intervalMs = 420) {
		this.pattern = pattern;
		this.intervalMs = intervalMs;
		this.timer = null;
		this.stepIndex = 0;
		this.paused = true;
		this.currentTime = 0;
	}

	play() {
		if (this.timer || muted) return Promise.resolve();

		const playStep = () => {
			const step = this.pattern[this.stepIndex % this.pattern.length];
			playTone(step.freq, step.duration, step.type, step.volume, 0);
			this.stepIndex++;
		};

		playStep();
		this.timer = setInterval(playStep, this.intervalMs);
		this.paused = false;
		return Promise.resolve();
	}

	pause() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		this.paused = true;
	}
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


