import { playTone } from './audio-utils.js';

/**
 * Represents a short one-time sound effect made of a tone sequence.
 */
export default class BurstSound {
    /**
     * Creates a burst sound from a sequence of tones.
     * @param {Array<object>} pattern Tone definitions for the sound effect.
     */
    constructor(pattern) {
        this.pattern = pattern;
        this.paused = true;
        this.currentTime = 0;
    }

    /**
     * Plays all tones in the configured sequence.
     * @returns {Promise<void>} A resolved promise after scheduling playback.
     */
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

    /**
     * Marks the sound effect as paused.
     * @returns {void}
     */
    pause() {
        this.paused = true;
    }
}
