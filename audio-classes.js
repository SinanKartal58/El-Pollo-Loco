/**
 * Shared audio primitives used by the game sound system.
 */

/**
 * Creates and reuses the browser audio context for all game sounds.
 * @returns {AudioContext|null} The active audio context or null if not supported.
 */
let audioContext = null;

export function getAudioContext() {
    if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        audioContext = new AudioCtx();
    }
    return audioContext;
}

export function ensureAudioContextReady() {
    const ctx = getAudioContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
    }
    return ctx.state !== 'closed';
}

export function playTone(frequency, duration = 0.08, type = 'sine', volume = 0.05, delay = 0) {
    const ctx = getAudioContext();
    if (!ctx || !ensureAudioContextReady()) return;

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

/**
 * Represents a short one-time sound effect made of a tone sequence.
 */
export class BurstSound {
    constructor(pattern) {
        this.pattern = pattern;
        this.paused = true;
        this.currentTime = 0;
    }

    play() {
        this.paused = false;
        if (this.pattern) {
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

/**
 * Represents a continuous tone, used for looping effects such as walking.
 */
export class LoopSound {
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

        const ctx = getAudioContext();
        if (!ctx || !ensureAudioContextReady()) return Promise.resolve();

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

/**
 * Repeats a sequence of tones in a regular interval, used for background music.
 */
export class PatternLoopSound {
    constructor(pattern, intervalMs = 420) {
        this.pattern = pattern;
        this.intervalMs = intervalMs;
        this.timer = null;
        this.stepIndex = 0;
        this.paused = true;
        this.currentTime = 0;
    }

    play() {
        if (this.timer) return Promise.resolve();
        if (!ensureAudioContextReady()) return Promise.resolve();

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
