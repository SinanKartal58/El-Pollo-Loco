import MovableObject from "./moveble-object.class.js";


/**
 * Base class for projectiles such as the thrown salsa bottle.
 */
export default class ThrowableObject extends MovableObject {
    IMAGES_ROTATION = [
        "img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    ];
    IMAGES_SPLASH = [
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "img_pollo_locco/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
    ];
    GROUND_Y = 350;
    width = 50;
    height = 50;
    isBroken = false;
    markedForRemoval = false;
    rotationInterval = null;
    moveInterval = null;
    splashInterval = null;
    speedY = 0;
    speed = 0;

    constructor(startX, startY, throwToRight = false) {
        super();
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        this.loadImage(this.IMAGES_ROTATION[0]);

        this.throw(startX, startY, throwToRight);
    }

    isAboveGround() {
        return !this.isBroken && this.y < this.GROUND_Y;
    }

    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_ROTATION);
        }, 60);

        this.moveInterval = setInterval(() => {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < this.GROUND_Y) {
                this.speedY += 0.35;
            }
        }, 25);
    }

    /**
     * Initializes the flight path for the bottle and starts the movement animation.
     * @param {number} startX - X position where the bottle starts
     * @param {number} startY - Y position where the bottle starts
     * @param {boolean} throwToRight - Direction of the throw
     */
    throw(startX, startY, throwToRight) {
        this.x = startX;
        this.y = startY;
        this.isBroken = false;
        this.markedForRemoval = false;
        this.otherDirection = !throwToRight;
        this.speedX = throwToRight ? 10 : -10;
        this.speedY = -8;
        this.animate();
    }

    
    stopFlightIntervals() {
        if (this.gravityInterval) clearInterval(this.gravityInterval);
        if (this.rotationInterval) clearInterval(this.rotationInterval);
        if (this.moveInterval) clearInterval(this.moveInterval);
    }

    
    playSplashAnimation() {
        let frame = 0;
        this.splashInterval = setInterval(() => {
            if (frame >= this.IMAGES_SPLASH.length) {
                clearInterval(this.splashInterval);
                this.markedForRemoval = true;
                return;
            }
            this.loadImage(this.IMAGES_SPLASH[frame]);
            frame++;
        }, 40);
    }

    
    /**
     * Stops the bottle motion and plays the impact splash animation.
     */
    break() {
        if (this.isBroken) return;
        this.isBroken = true;
        this.speed = 0;
        this.speedY = 0;
        this.stopFlightIntervals();
        this.playSplashAnimation();
    }
}

