import { ensureAudioContextReady, getAudioContext } from './audio-utils.js';

/**
 * Represents a continuous tone, used for looping effects.
 */
export default class LoopSound {
    /**
     * Creates a continuous tone.
     * @param {number} frequency Tone frequency in hertz.
     * @param {OscillatorType} [type='sine'] Oscillator waveform.
     * @param {number} [volume=0.02] Playback volume.
     */
    constructor(frequency, type = 'sine', volume = 0.02) {
        this.frequency = frequency;
        this.type = type;
        this.volume = volume;
        this.paused = true;
        this.currentTime = 0;
        this.oscillator = null;
        this.gain = null;
    }

    /**
     * Starts the continuous sound when it is not already playing.
     * @returns {Promise<void>} A resolved promise after starting playback.
     */
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

    /**
     * Stops the continuous sound and releases its audio nodes.
     * @returns {void}
     */
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
