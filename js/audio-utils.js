/**
 * Shared Web Audio helpers used by the game sound system.
 */
let audioContext = null;
let muted = false;

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
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        audioContext = new AudioCtx();
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
        ctx.resume().catch(() => {});
    }
    return ctx.state !== 'closed';
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
