import { ensureAudioContextReady, playTone } from './audio-utils.js';

/**
 * Repeats a sequence of tones in a regular interval.
 */
export default class PatternLoopSound {
    /**
     * Creates a repeating tone sequence.
     * @param {Array<object>} pattern Tone definitions for the loop.
     * @param {number} [intervalMs=420] Delay between tones in milliseconds.
     */
    constructor(pattern, intervalMs = 420) {
        this.pattern = pattern;
        this.intervalMs = intervalMs;
        this.timer = null;
        this.stepIndex = 0;
        this.paused = true;
        this.currentTime = 0;
    }

    /**
     * Starts playback of the tone sequence.
     * @returns {Promise<void>} A resolved promise after playback starts.
     */
    play() {
        if (this.timer || !ensureAudioContextReady()) return Promise.resolve();

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

    /**
     * Stops playback of the tone sequence.
     * @returns {void}
     */
    pause() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.paused = true;
    }
}
