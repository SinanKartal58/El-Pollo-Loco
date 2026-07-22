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

    constructor() {
        super();
    }

    
    applyGravity() {
        if (this.gravityInterval) clearInterval(this.gravityInterval);
        this.gravityInterval = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    
    isAboveGround() {
        return this.y + this.height < GROUND_Y;
    }

    
    moveRight() {
        this.x += this.speed;
    }

    
    moveLeft() {
        this.x -= this.speed;
    }

    
    isColliding(obj) {
        return this.hbLeft + this.hbWidth  > obj.hbLeft &&
               this.hbTop  + this.hbHeight > obj.hbTop  &&
               this.hbLeft                 < obj.hbLeft + obj.hbWidth &&
               this.hbTop                  < obj.hbTop  + obj.hbHeight;
    }

    
    jump() {
        this.speedY = 25;
    }

    
    hit(damage) {
        this.health -= damage;

        if (this.health < 0) {
            this.health = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    
    isDead() {
        return this.health === 0;
    }

    
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
}

