import MovableObject from "./moveble-object.class.js";


export default class Endboss extends MovableObject {
    IMAGES_WALKING = [
        "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png",
    ]
    IMAGES_ALERT = [
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png"
    ]
    IMAGES_ATTACK = [
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png"
    ]
    IMAGES_HURT = [
        "img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png",
    ]
    IMAGES_DEAD = [
        "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png",
        "img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png",
    ]
    height = 325
    width = 275
    y = 130
    hitboxW = 280;
    hitboxH = 280;
    speed = 3
    hasBeenTriggered = false
    knockbackActive = false
    isAttacking = false
    ATTACK_DISTANCE = 190

    /**
     * Creates the end boss at its supplied horizontal position.
     * @param {number} x Initial horizontal position.
     */
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.animate();
    }
    /**
     * Starts the end boss sprite and movement timers.
     * @returns {void}
     */
    animate() {
        this.startSpriteInterval();
        this.startMovementInterval();
    }

    /**
     * Starts the end boss sprite update timer.
     * @returns {void}
     */
    startSpriteInterval() {
        this.currentAnimationState = 'walking';
        setInterval(() => this.updateSpriteAnimation(), 100);
    }

    /**
     * Selects and displays the end boss animation for the current state.
     * @returns {void}
     */
    updateSpriteAnimation() {
        if (this.isDead()) return this.setAnimationState('dead', this.IMAGES_DEAD);
        if (this.isHurt()) return this.setAnimationState('hurt', this.IMAGES_HURT);
        if (this.isAttacking) return this.setAnimationState('attack', this.IMAGES_ATTACK);
        if (!this.hasBeenTriggered) return this.setAnimationState('walking', this.IMAGES_WALKING);
        const alertDone = this.currentImage >= this.IMAGES_ALERT.length;
        const state = alertDone ? 'walking' : 'alert';
        const images = alertDone ? this.IMAGES_WALKING : this.IMAGES_ALERT;
        this.setAnimationState(state, images);
    }

    /**
     * Applies the image sequence for a new or existing animation state.
     * @param {string} nextState State to display.
     * @param {string[]} images Image paths for the state.
     * @returns {void}
     */
    setAnimationState(nextState, images) {
        if (this.currentAnimationState !== nextState) {
            this.currentImage = 0;
            this.currentAnimationState = nextState;
        }
        this.playAnimation(images);
    }

    /**
     * Starts the end boss movement timer.
     * @returns {void}
     */
    startMovementInterval() {
        setInterval(() => {
            if (!this.world || this.isDead() || this.knockbackActive) return;
            const bossTriggerX = this.world.activeLevel?.level_end_x ? this.world.activeLevel.level_end_x - 480 : 5200;
            if (!this.hasBeenTriggered && this.world.character.x >= bossTriggerX) {
                this.hasBeenTriggered = true;
            }
            if (this.hasBeenTriggered) this.chaseCharacter();
        }, 1000 / 60);
    }

    /**
     * Moves the end boss toward the character's current position.
     * @returns {void}
     */
    chaseCharacter() {
        const distanceToCharacter = this.world.character.x - this.x;
        this.isAttacking = Math.abs(distanceToCharacter) <= this.ATTACK_DISTANCE;
        if (this.isAttacking) return;
        if (distanceToCharacter < 0) this.moveLeft();
        else this.moveRight();
    }


    /**
     * Applies incoming damage and starts the knockback animation if needed.
     * @param {number} damage Damage to apply.
     * @returns {void}
     */
    hit(damage) {
        super.hit(damage);
        if (!this.isDead()) this.startKnockback();
    }

    /**
     * Starts the end boss knockback animation.
     * @returns {void}
     */
    startKnockback() {
        if (this.knockbackActive) return;
        this.knockbackActive = true;
        const knockback = this.createKnockbackState();
        const interval = setInterval(() => {
            if (this.updateKnockback(knockback)) clearInterval(interval);
        }, 1000 / 60);
    }

    /**
     * Creates the fixed values required for one knockback animation.
     * @returns {{startY: number, startX: number, arcHeight: number, driftRight: number, duration: number, startedAt: number}} Knockback state.
     */
    createKnockbackState() {
        return {
            startY: this.y, startX: this.x, arcHeight: 70,
            driftRight: 55, duration: 500, startedAt: Date.now()
        };
    }

    /**
     * Advances the end boss by one frame of the knockback animation.
     * @param {object} knockback Values created for the active animation.
     * @returns {boolean} Whether the animation has finished.
     */
    updateKnockback(knockback) {
        const progress = (Date.now() - knockback.startedAt) / knockback.duration;
        if (progress >= 1) {
            this.y = knockback.startY;
            this.x = knockback.startX + knockback.driftRight;
            this.knockbackActive = false;
            return true;
        }
        this.y = knockback.startY - knockback.arcHeight * 4 * progress * (1 - progress);
        this.x = knockback.startX + knockback.driftRight * progress;
        return false;
    }
}

