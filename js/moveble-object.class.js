import DrawableObject from "./drawable-object.class.js";



export const GROUND_Y = 430;

export default class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    health = 100;
    lastHit = 0;
    gravityInterval = null;

    /**
     * Creates a movable game object with default physics values.
     */
    constructor() {
        super();
    }

    /**
     * Applies gravity to the object while it is airborne.
     * @returns {void}
     */
    applyGravity() {
        if (this.gravityInterval) clearInterval(this.gravityInterval);
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object is above the ground level.
     * @returns {boolean} Whether the object is airborne.
     */
    isAboveGround() {
        return this.y + this.height < GROUND_Y;
    }

    /**
     * Moves the object right by its current speed.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object left by its current speed.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Checks whether this object's hitbox overlaps another object.
     * @param {MovableObject} obj Object to test.
     * @returns {boolean} Whether the hitboxes overlap.
     */
    isColliding(obj) {
        return this.hbLeft + this.hbWidth  > obj.hbLeft &&
               this.hbTop  + this.hbHeight > obj.hbTop  &&
               this.hbLeft                 < obj.hbLeft + obj.hbWidth &&
               this.hbTop                  < obj.hbTop  + obj.hbHeight;
    }

    /**
     * Sets the vertical speed needed for a jump.
     * @returns {void}
     */
    jump() {
        this.speedY = 25;
    }

    /**
     * Reduces health and stores the damage time.
     * @param {number} damage Damage to apply.
     * @returns {void}
     */
    hit(damage) {
        this.health -= damage;

        if (this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object has no remaining health.
     * @returns {boolean} Whether the object is dead.
     */
    isDead() {
        return this.health === 0;
    }

    /**
     * Checks whether the object was hit recently.
     * @returns {boolean} Whether the object is hurt.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
}

