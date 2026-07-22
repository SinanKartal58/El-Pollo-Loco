import Character from "./character.class.js";
import Endboss from "./endboss.class.js";
import StatusBar from "./statusbar.class.js";
import { GROUND_Y } from "./moveble-object.class.js";

export default class World {
    MAX_BOTTLES = 5;
    BOTTLE_PERCENT_STEP = 20;
    character = new Character();
    activeLevel;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health');
    statusBarCoins = new StatusBar('coins');
    statusBarBottles = new StatusBar('bottles');
    statusBarEndboss = new StatusBar('endboss');
    coinPercentage = 0;
    gameOverShown = false;
    animationFrameId = null;
    stopped = false;
    sounds = null;

    
    constructor(canvas, keyboard, level) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.keyboard = keyboard;
        this.activeLevel = level;
        this.statusBarHealth.setPercentage(this.character.health);
        this.statusBarBottles.setPercentage(0);
        this.statusBarEndboss.setPercentage(100);
        this.setWorld();
        this.checkCollisions();
        this.draw();
    }

    
    setWorld() {
        this.character.world = this;
        this.activeLevel.enemies.forEach(enemy => { enemy.world = this; });
    }

    
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.isEnemyHittingCharacter(enemy)) return;
        if (this.character.isHurt() && !(enemy instanceof Endboss)) return;

        if (enemy instanceof Endboss) {

        }

        if (this.isStompingEnemy(enemy)) {
            enemy.kill();
            this.playSound('chickenHit');
            this.character.y = GROUND_Y - this.character.height - 20;
            this.character.jump();
            this.removeEnemy(enemy);
            return;
        }

        if (!this.isCharacterInAir()) {
            this.character.hit(20);
            this.statusBarHealth.setPercentage(this.character.health);
            this.playSound('hurt');
        }
    }

    
    checkCollisions() {
        setInterval(() => {
            this.isCharColliding(this.activeLevel.enemies, (enemy) => this.handleEnemyCollision(enemy));
            this.isCharColliding(this.activeLevel.coins, (coin, index) => this.updateCoins(index, 20));
            this.isCharColliding(this.activeLevel.bottles, (bottle, index) => this.updateBottles(index));
            this.checkThrowableBottleCollisions();
            this.checkIfEndbossDead();
            this.updateWalkingSound();
        }, 1000 / 60);
    }
    
    checkBottleImpact(bottle) {
        if (bottle.isBroken) return;
        if (this.isBottleHittingGround(bottle)) {
            bottle.break();
            return;
        }
        const hitEnemy = this.getBottleHitEnemy(bottle);
        if (hitEnemy) this.applyBottleHit(hitEnemy, bottle);
    }

    
    checkThrowableBottleCollisions() {
        for (let i = this.activeLevel.throwableBottles.length - 1; i >= 0; i--) {
            if (this.activeLevel.throwableBottles[i].markedForRemoval) {
                this.activeLevel.throwableBottles.splice(i, 1);
            }
        }
        this.activeLevel.throwableBottles.forEach(bottle => this.checkBottleImpact(bottle));
    }

    
    getBottleHitEnemy(bottle) {
        return this.activeLevel.enemies.find(
            enemy => !enemy.isDead() && bottle.isColliding(enemy)
        );
    }

    
    applyBottleHit(enemy, bottle) {
        bottle.break();
        if (enemy instanceof Endboss) {
            enemy.hit(13);
            this.statusBarEndboss.setPercentage(enemy.health);
        } else {
            enemy.kill();
            this.playSound('chickenHit');
            this.removeEnemy(enemy);
        }
    }

    
    isBottleHittingGround(bottle) {
        return bottle.speedY <= 0 && bottle.y >= bottle.GROUND_Y;
    }

    
    updateCoins(index, amount) {
        this.activeLevel.coins.splice(index, 1);
        this.coinPercentage = Math.min(this.coinPercentage + amount, 100);
        this.statusBarCoins.setPercentage(this.coinPercentage);
        this.playSound('coin');
    }

    
    updateBottles(index) {
        if (this.character.bottleCount >= this.MAX_BOTTLES) return;
        this.activeLevel.bottles.splice(index, 1);
        this.character.bottleCount = Math.min(this.character.bottleCount + 1, this.MAX_BOTTLES);
        this.statusBarBottles.setPercentage(this.character.bottleCount * this.BOTTLE_PERCENT_STEP);
        this.playSound('bottle');
    }

    
    isCharacterInAir() {
        return this.character.isAboveGround() || this.character.speedY > 0;
    }

    
    isEnemyHittingCharacter(enemy) {
        const charLeft  = this.character.hbLeft;
        const charRight = charLeft + this.character.hbWidth;
        const enemyLeft  = enemy.hbLeft;
        const enemyRight = enemyLeft + enemy.hbWidth;
        return charRight > enemyLeft && charLeft < enemyRight;
    }

    
    isStompingEnemy(enemy) {
        const characterBottom = this.character.hbTop + this.character.hbHeight;
        const enemyTopHitZone = enemy.hbTop + enemy.hbHeight * 0.4;
        return this.character.speedY < 0 &&
            this.isEnemyHittingCharacter(enemy) &&
            characterBottom >= enemy.hbTop &&
            characterBottom <= enemyTopHitZone;
    }

    
    removeEnemy(enemy) {
        setTimeout(() => {
            const idx = this.activeLevel.enemies.indexOf(enemy);
            if (idx > -1) this.activeLevel.enemies.splice(idx, 1);
        }, 2000);
    }

    
    isCharColliding(array, callback) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (this.character.isColliding(array[i])) callback(array[i], i);
        }
    }

    
    drawWorldObjects() {
        this.addObjectsToMap(this.activeLevel.backgroundObjects);
        this.addObjectsToMap(this.activeLevel.enemies);
        this.addObjectsToMap(this.activeLevel.clouds);
        this.addObjectsToMap(this.activeLevel.coins);
        this.addObjectsToMap(this.activeLevel.bottles);
        this.addObjectsToMap(this.activeLevel.throwableBottles);
        this.addToMap(this.character);
    }

    
    drawHUD() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        const endboss = this.activeLevel.enemies.find(e => e instanceof Endboss);
        if (endboss && endboss.hasBeenTriggered) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    
    draw() {
        if (this.stopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawHUD();
        this.animationFrameId = requestAnimationFrame(this.draw.bind(this));
    }

    
    addObjectsToMap(array) {
        try {
            array.forEach(obj => this.addToMap(obj));
        } catch (err) {
            console.error('Error drawing objects:', err);
        }
    }

    
    addToMap(obj) {
        if (obj.otherDirection) this.flipImage(obj);
        obj.draw(this.ctx);
        if (obj.otherDirection) this.flipImageBack(obj);
    }

    
    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x = obj.x * -1;
    }

    
    flipImageBack(obj) {
        obj.x = obj.x * -1;
        this.ctx.restore();
    }

    
    stopGameLoop() {
        this.stopped = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

    
    showGameOverScreen() {
        if (this.gameOverShown) return;
        this.gameOverShown = true;
        if (window.showGameOverScreen) {
            window.showGameOverScreen();
            return;
        }
        this.stopGameLoop();
        document.getElementById('gameOverScreen').classList.remove('d-none');
    }

    
    checkIfEndbossDead() {
        const endboss = this.activeLevel.enemies.find(e => e instanceof Endboss);
        if (!endboss || endboss.health > 0 || endboss.deathTriggered) return;
        endboss.deathTriggered = true;
        setTimeout(() => { if (window.showWinScreen) window.showWinScreen(); }, 1500);
    }

    
    playSound(name) {
        if (!this.sounds || !this.sounds[name]) return;
        const sound = this.sounds[name];
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    
    updateWalkingSound() {
        if (!this.sounds || !this.sounds.walking) return;
        const walking = this.sounds.walking;
        const isWalking = !this.character.isDead()
            && !this.character.isAboveGround()
            && (this.keyboard.RIGHT_ARROW || this.keyboard.LEFT_ARROW);

        if (isWalking && walking.paused) {
            walking.play().catch(() => {});
        } else if (!isWalking && !walking.paused) {
            walking.pause();
            walking.currentTime = 0;
        }
    }
}

