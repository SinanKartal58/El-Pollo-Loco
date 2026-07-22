import MovableObject, {GROUND_Y} from "./moveble-object.class.js";
import SalsaBottle from "./salsa-bottle.class.js";
import { isLongIdle } from './js/idle-timer.js';


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
    THROW_COOLDOWN = 100;
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

    
    animate() {
        this.startAnimationLoop();
        this.startGameLogicLoop();
    }

    
    startAnimationLoop() {
        setInterval(() => this.updateAnimationFrame(), 50);
    }

    
    startGameLogicLoop() {
        setInterval(() => {
            this.handleMovement();
            this.handleThrow();
        }, 1000 / 60);
    }

    
    updateAnimationFrame() {
        const now = Date.now();
        const ms = this.getCurrentFrameMs();
        if (now - this.lastFrameAt < ms) return;
        this.lastFrameAt = now;

        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.world.keyboard.RIGHT_ARROW || this.world.keyboard.LEFT_ARROW) {
            this.playAnimation(this.IMAGES_WALKING);
        } else if (isLongIdle()) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_IDLE_SHORT);
        }
    }

    getCurrentFrameMs() {
        if (this.isDead())         return this.FRAME_MS.hurt;
        if (this.isAboveGround())  return this.FRAME_MS.jumping;
        if (this.isHurt())         return this.FRAME_MS.hurt;
        if (this.world.keyboard.RIGHT_ARROW || this.world.keyboard.LEFT_ARROW) return this.FRAME_MS.walking;
        if (isLongIdle())          return this.FRAME_MS.sleep;
        return this.FRAME_MS.idle;
    }

    
    handleMovement() {
        if (this.isDead()) {
            if (!this.deathTriggered) {
                this.deathTriggered = true;
                setTimeout(() => this.world.showGameOverScreen(), 560);
            }
            return;
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
        if (this.world.keyboard.RIGHT_ARROW && this.x < this.world.activeLevel.level_end_x) {
            this.otherDirection = false;
            this.moveRight();
        } else if (this.world.keyboard.LEFT_ARROW && this.x > 60) {
            this.otherDirection = true;
            this.moveLeft();
        }
        this.world.camera_x = -this.x + 60;
    }

    
    handleThrow() {
        if (this.isDead()) return;
        const isThrowPressed = this.world.keyboard.KEY_D;
        if (!isThrowPressed) {
            this.throwKeyPressed = false;
            return;
        }
        if (this.throwKeyPressed || this.bottleCount <= 0) return;
        this.throwKeyPressed = true;
        if (this.otherDirection) {
            this.bottleCount--;
            this.world.statusBarBottles.setPercentage(this.bottleCount * 20);
        } else {
            this.throw();
        }
    }

    
    calculateThrowPosition(throwToRight) {
        return {
            x: throwToRight ? this.x + this.width + 30 : this.x - 60,
            y: this.y + 100
        };
    }

    
    throw() {
        const now = new Date().getTime();
        if (now - this.lastThrowTime < this.THROW_COOLDOWN) return;
        this.lastThrowTime = now;

        const throwToRight = !this.otherDirection;
        const pos = this.calculateThrowPosition(throwToRight);
        const bottle = new SalsaBottle(pos.x, pos.y, throwToRight);
        this.world.activeLevel.throwableBottles.push(bottle);
        this.bottleCount--;
        this.world.statusBarBottles.setPercentage(this.bottleCount * 20);
        this.world.playSound("throw");
    }

    
    isNearBoss() {
        return this.x > 5073;
    }
}

