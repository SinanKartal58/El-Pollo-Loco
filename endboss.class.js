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

    
    constructor(x) {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.animate();
    }

    animate() {
        this.startSpriteInterval();
        this.startMovementInterval();
    }

    
    startSpriteInterval() {
        this.currentAnimationState = 'walking';

        setInterval(() => {
            if (this.isDead()) {
                this.setAnimationState('dead', this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.setAnimationState('hurt', this.IMAGES_HURT);
            } else if (this.hasBeenTriggered) {
                const alertDone = this.currentImage >= this.IMAGES_ALERT.length;
                this.setAnimationState(alertDone ? 'walking' : 'alert', alertDone ? this.IMAGES_WALKING : this.IMAGES_ALERT);
            } else {
                this.setAnimationState('walking', this.IMAGES_WALKING);
            }
        }, 100);
    }

    setAnimationState(nextState, images) {
        if (this.currentAnimationState !== nextState) {
            this.currentImage = 0;
            this.currentAnimationState = nextState;
        }
        this.playAnimation(images);
    }

    
    startMovementInterval() {
        setInterval(() => {
            if (!this.world || this.isDead() || this.knockbackActive) return;
            const bossTriggerX = this.world.activeLevel?.level_end_x ? this.world.activeLevel.level_end_x - 480 : 5200;
            const distanceToCharacter = this.world.character.x - this.x;
            const reachedBossZone = this.world.character.x >= bossTriggerX;

            if (reachedBossZone) this.hasBeenTriggered = true;
            if (this.hasBeenTriggered && reachedBossZone) this.moveLeft();
        }, 1000 / 60);
    }

    
    hit(damage) {
        super.hit(damage);
        if (!this.isDead()) this.startKnockback();
    }

    
    startKnockback() {
        if (this.knockbackActive) return;
        this.knockbackActive = true;

        const startY  = this.y;
        const startX  = this.x;
        const arcHeight  = 70;
        const driftRight = 55;
        const duration   = 500;
        const t0 = Date.now();

        const interval = setInterval(() => {
            const t = (Date.now() - t0) / duration;
            if (t >= 1) {
                this.y = startY;
                this.x = startX + driftRight;
                this.knockbackActive = false;
                clearInterval(interval);
                return;
            }
            this.y = startY - arcHeight * 4 * t * (1 - t);
            this.x = startX + driftRight * t;
        }, 1000 / 60);
    }
}

