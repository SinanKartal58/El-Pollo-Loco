import MovableObject, {GROUND_Y} from "./moveble-object.class.js";
import SalsaBottle from "./salsa-bottle.class.js";
import { isLongIdle } from './idle-timer.js';


/**
 * Represents the main playable character.
 * Handles movement, jumping, animation states, damage, and bottle throws.
 */
export default class Character extends MovableObject {
    x = 60
    width = 170;
    height = 300;
    y = GROUND_Y - this.height - 20
    hitboxX = 40;
    hitboxY = 100;
    hitboxW = 90;
    hitboxH = 180;
    speed = 10;
    health = 100;
    bottleCount = 0;
    lastThrowTime = 0;
    THROW_COOLDOWN = 600;
    throwKeyPressed = false;
    IMAGES_WALKING = [
        "img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
        "img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
        "img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
        "img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
        "img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
        "img_pollo_locco/img/2_character_pepe/2_walk/W-26.png"
    ]
    IMAGES_JUMPING = [
        "img_pollo_locco/img/2_character_pepe/3_jump/J-31.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-32.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-33.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
        "img_pollo_locco/img/2_character_pepe/3_jump/J-39.png"
    ]
    IMAGES_HURT = [
        "img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png",
        "img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png",
        "img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png",
    ]
    IMAGES_DEAD = [
        "img_pollo_locco/img/2_character_pepe/5_dead/D-51.png",
        "img_pollo_locco/img/2_character_pepe/5_dead/D-52.png",
        "img_pollo_locco/img/2_character_pepe/5_dead/D-53.png",
        "img_pollo_locco/img/2_character_pepe/5_dead/D-54.png",
        "img_pollo_locco/img/2_character_pepe/5_dead/D-55.png",
        "img_pollo_locco/img/2_character_pepe/5_dead/D-56.png",
        "img_pollo_locco/img/2_character_pepe/5_dead/D-57.png"
    ]
    
    IMAGES_IDLE_SHORT = [
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png",
    ]
    
    IMAGES_IDLE = [
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png",
        "img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png",
    ]
    world;
    lastFrameAt = 0;

    
    FRAME_MS = {
        jumping:  80,
        hurt:    100,
        dead:     80,
        walking: 110,
        sleep:   200,
        idle:    150,
    };

    
    /**
     * Initializes the player, loads all sprite sets, and starts the animation/game loops.
     */
    constructor() {
        super().loadImage("img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png");
        this.loadImages(this.IMAGES_IDLE_SHORT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.applyGravity();
        this.animate();
    }

    
    /**
     * Starts the animation and gameplay update timers.
     */
    animate() {
        this.startAnimationLoop();
        this.startGameLogicLoop();
    }

    /**
     * Starts the animation timer.
     * @returns {void}
     */
    startAnimationLoop() {
        setInterval(() => this.updateAnimationFrame(), 50);
    }

    /**
     * Starts the movement and throw input timer.
     * @returns {void}
     */
    startGameLogicLoop() {
        setInterval(() => {
            this.handleMovement();
            this.handleThrow();
        }, 1000 / 60);
    }

    /**
     * Updates the character sprite when the current frame interval has elapsed.
     * @returns {void}
     */
    updateAnimationFrame() {
        const nextState = this.getCurrentAnimationState();
        if (this.currentAnimationState !== nextState) {
            this.currentAnimationState = nextState;
            this.currentImage = 0;
        }

        const now = Date.now();
        const ms = this.getCurrentFrameMs();
        if (now - this.lastFrameAt < ms) return;
        this.lastFrameAt = now;
        this.playAnimation(this.getCurrentAnimationImages());
    }

    /**
     * Determines the character animation state for the current gameplay situation.
     * @returns {string} Current animation state key.
     */
    getCurrentAnimationState() {
        if (this.isDead()) return 'dead';
        if (this.isHurt()) return 'hurt';
        if (this.isAboveGround()) return 'jump';
        if (this.isWalking()) return 'walk';
        return isLongIdle() ? 'idle-long' : 'idle-short';
    }

    /**
     * Gets the sprite sequence for the character's current state.
     * @returns {string[]} Image paths for the next animation frame.
     */
    getCurrentAnimationImages() {
        if (this.isDead()) {
            return this.IMAGES_DEAD;
        }
        if (this.isHurt()) return this.IMAGES_HURT;
        if (this.isAboveGround()) return this.IMAGES_JUMPING;
        if (this.isWalking()) return this.IMAGES_WALKING;
        return isLongIdle() ? this.IMAGES_IDLE : this.IMAGES_IDLE_SHORT;
    }

    /**
     * Checks whether a horizontal movement key is pressed.
     * @returns {boolean} Whether the character is walking.
     */
    isWalking() {
        return this.world.keyboard.RIGHT_ARROW || this.world.keyboard.LEFT_ARROW;
    }

    /**
     * Gets the delay for the current animation state.
     * @returns {number} Delay in milliseconds.
     */
    getCurrentFrameMs() {
        if (this.isDead())         return this.FRAME_MS.hurt;
        if (this.isAboveGround())  return this.FRAME_MS.jumping;
        if (this.isHurt())         return this.FRAME_MS.hurt;
        if (this.isWalking())      return this.FRAME_MS.walking;
        if (isLongIdle())          return this.FRAME_MS.sleep;
        return this.FRAME_MS.idle;
    }

    /**
     * Handles the character movement inputs and camera position.
     * @returns {void}
     */
    handleMovement() {
        if (this.handleDeath()) return;
        this.handleJumpInput();
        this.handleHorizontalMovement();
        this.updateCamera();
    }

    /**
     * Schedules the game-over screen when the character dies.
     * @returns {boolean} Whether the character is dead.
     */
    handleDeath() {
        if (!this.isDead()) return false;
        if (!this.deathTriggered) {
            this.deathTriggered = true;
            setTimeout(() => this.world.showGameOverScreen(), 560);
        }
        return true;
    }

    /**
     * Starts a jump when the jump key is pressed on the ground.
     * @returns {void}
     */
    handleJumpInput() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
    }

    /**
     * Moves the character left or right according to keyboard input.
     * @returns {void}
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT_ARROW && this.x < this.world.activeLevel.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
        } else if (this.world.keyboard.LEFT_ARROW && this.x > 60) {
            this.otherDirection = true;
            this.moveLeft();
        }
    }

    /**
     * Aligns the camera with the character's horizontal position.
     * @returns {void}
     */
    updateCamera() {
        this.world.camera_x = -this.x + 60;
    }

    
    /**
     * Checks whether the player is pressing the throw key and triggers a bottle throw if possible.
     */
    handleThrow() {
        if (this.isDead()) return;
        const isThrowPressed = this.world.keyboard.KEY_D;
        if (!isThrowPressed) {
            this.throwKeyPressed = false;
            return;
        }
        if (this.throwKeyPressed || this.bottleCount <= 0) return;
        this.throwKeyPressed = true;
        this.throw();
    }

    
    /**
     * Gets the starting position of a thrown bottle.
     * @param {boolean} throwToRight Direction of the throw.
     * @returns {{x: number, y: number}} Bottle starting position.
     */
    calculateThrowPosition(throwToRight) {
        return {
            x: throwToRight ? this.x + this.width - 20 : this.x - 10,
            y: this.y + 100
        };
    }

    
    /**
     * Creates a new salsa bottle projectile and updates the throw state.
     * @returns {void}
     */
    throw() {
        const now = new Date().getTime();
        if (now - this.lastThrowTime < this.THROW_COOLDOWN) return;
        this.lastThrowTime = now;
        const bottle = this.createThrowableBottle();
        this.world.activeLevel.throwableBottles.push(bottle);
        this.updateThrowState();
    }

    /**
     * Creates a bottle with the direction and speed of the current throw.
     * @returns {SalsaBottle} Configured bottle projectile.
     */
    createThrowableBottle() {
        const throwToRight = !this.otherDirection;
        const pos = this.calculateThrowPosition(throwToRight);
        const bottle = new SalsaBottle(pos.x, pos.y, throwToRight);
        bottle.speedY = -7;
        bottle.speedX = throwToRight ? 12 : -12;
        return bottle;
    }

    /**
     * Reduces ammunition, updates the status bar, and plays the throw sound.
     * @returns {void}
     */
    updateThrowState() {
        this.bottleCount--;
        this.world.statusBarBottles.setPercentage(this.bottleCount * 20);
        this.world.playSound("throw");
    }

    /**
     * Checks whether the character is near the end boss area.
     * @returns {boolean} Whether the character is near the boss.
     */
    isNearBoss() {
        return this.x > 5073;
    }
}

