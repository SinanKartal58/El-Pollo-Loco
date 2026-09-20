/**
 * Shared Web Audio helpers used by the game sound system.
 */
let audioContext = null;
let muted = false;
let audioWarningShown = false;

/**
 * Checks whether game audio is currently muted.
 * @returns {boolean} Whether audio is muted.
 */
export function isAudioMuted() {
    return muted;
}

/**
 * Sets the shared mute state used by all generated tones.
 * @param {boolean} value Whether audio should be muted.
 * @returns {void}
 */
export function setAudioMuted(value) {
    muted = value;
}

/**
 * Gets or creates the browser audio context.
 * @returns {AudioContext|null} The audio context or null if unsupported.
 */
export function getAudioContext() {
    if (!audioContext) {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            audioContext = new AudioCtx();
        } catch (error) {
            reportAudioIssue('Unable to create the audio context.', error);
            return null;
        }
    }
    return audioContext;
}

/**
 * Resumes the browser audio context when possible.
 * @returns {boolean} Whether the audio context can be used.
 */
export function ensureAudioContextReady() {
    const ctx = getAudioContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
        ctx.resume().catch((error) => reportAudioIssue('Unable to resume the audio context.', error));
    }
    return ctx.state !== 'closed';
}

/**
 * Reports an audio failure once and leaves gameplay available without sound.
 * @param {string} message Explanation of the audio failure.
 * @param {unknown} error Original error from the browser.
 * @returns {void}
 */
function reportAudioIssue(message, error) {
    if (audioWarningShown) return;
    audioWarningShown = true;
    console.warn(message, error);
}

/**
 * Schedules a single generated tone.
 * @param {number} frequency Tone frequency in hertz.
 * @param {number} [duration=0.08] Tone duration in seconds.
 * @param {OscillatorType} [type='sine'] Oscillator waveform.
 * @param {number} [volume=0.05] Tone volume.
 * @param {number} [delay=0] Start delay in seconds.
 * @returns {void}
 */
export function playTone(frequency, duration = 0.08, type = 'sine', volume = 0.05, delay = 0) {
    if (muted) return;
    const ctx = getAudioContext();
    if (!ctx || !ensureAudioContextReady()) return;
    scheduleTone(ctx, frequency, duration, type, volume, delay);
}

/**
 * Configures and schedules an oscillator tone.
 * @param {AudioContext} ctx Active audio context.
 * @param {number} frequency Tone frequency in hertz.
 * @param {number} duration Tone duration in seconds.
 * @param {OscillatorType} type Oscillator waveform.
 * @param {number} volume Tone volume.
 * @param {number} delay Start delay in seconds.
 * @returns {void}
 */
function scheduleTone(ctx, frequency, duration, type, volume, delay) {
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
