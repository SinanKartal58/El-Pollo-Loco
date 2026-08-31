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

    /**
     * Creates the game world with its canvas, input state, and level.
     * @param {HTMLCanvasElement} canvas Canvas used to render the game.
     * @param {Keyboard} keyboard Object containing the current input state.
     * @param {Level} level Level to display and update.
     */
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

    /**
     * Connects game objects to their containing world.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.activeLevel.enemies.forEach(enemy => { enemy.world = this; });
    }

    
    /**
     * Handles a collision between the character and an enemy.
     * @param {MovableObject} enemy Enemy involved in the collision.
     * @returns {void}
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead() || !this.isEnemyHittingCharacter(enemy)) return;
        if (this.character.isHurt() && !(enemy instanceof Endboss)) return;
        if (this.isStompingEnemy(enemy)) {
            this.handleStomp(enemy);
            return;
        }
        this.handleEnemyDamage();
    }

    /**
     * Removes an enemy after the character jumps on it.
     * @param {MovableObject} enemy Enemy defeated by the character.
     * @returns {void}
     */
    handleStomp(enemy) {
        enemy.kill();
        this.playSound('chickenHit');
        this.character.y = GROUND_Y - this.character.height - 20;
        this.character.jump();
        this.removeEnemy(enemy);
    }

    /**
     * Applies contact damage while the character is on the ground.
     * @returns {void}
     */
    handleEnemyDamage() {
        if (this.isCharacterInAir()) return;
        this.character.hit(20);
        this.statusBarHealth.setPercentage(this.character.health);
        this.playSound('hurt');
    }

    /**
     * Starts the recurring collision checks.
     * @returns {void}
     */
    checkCollisions() {
        setInterval(() => {
            this.isCharColliding(this.activeLevel.enemies, (enemy) => this.handleEnemyCollision(enemy));
            this.isCharColliding(this.activeLevel.coins, (coin, index) => this.updateCoins(index, 20));
            this.isCharColliding(this.activeLevel.bottles, (bottle, index) => this.updateBottles(index));
            this.checkThrowableBottleCollisions();
            this.checkIfEndbossDead();
        }, 1000 / 60);
    }
    /**
     * Handles one flying bottle touching the ground or an enemy.
     * @param {ThrowableObject} bottle Flying bottle to check.
     * @returns {void}
     */
    checkBottleImpact(bottle) {
        if (bottle.isBroken) return;
        if (this.isBottleHittingGround(bottle)) {
            bottle.break();
            return;
        }
        const hitEnemy = this.getBottleHitEnemy(bottle);
        if (hitEnemy) this.applyBottleHit(hitEnemy, bottle);
    }

    /**
     * Removes finished bottles and checks active bottles for impacts.
     * @returns {void}
     */
    checkThrowableBottleCollisions() {
        for (let i = this.activeLevel.throwableBottles.length - 1; i >= 0; i--) {
            if (this.activeLevel.throwableBottles[i].markedForRemoval) {
                this.activeLevel.throwableBottles.splice(i, 1);
            }
        }
        this.activeLevel.throwableBottles.forEach(bottle => this.checkBottleImpact(bottle));
    }

    /**
     * Finds the first living enemy hit by a bottle.
     * @param {ThrowableObject} bottle Bottle to test.
     * @returns {MovableObject|undefined} Hit enemy, if present.
     */
    getBottleHitEnemy(bottle) {
        return this.activeLevel.enemies.find(
            enemy => !enemy.isDead() && bottle.isColliding(enemy)
        );
    }

    /**
     * Applies the result of a bottle hit to an enemy.
     * @param {MovableObject} enemy Enemy struck by the bottle.
     * @param {ThrowableObject} bottle Bottle that caused the hit.
     * @returns {void}
     */
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

    /**
     * Checks whether a bottle has reached the ground while descending.
     * @param {ThrowableObject} bottle Bottle to test.
     * @returns {boolean} Whether the bottle touched the ground.
     */
    isBottleHittingGround(bottle) {
        return bottle.speedY <= 0 && bottle.y >= bottle.GROUND_Y;
    }

    /**
     * Removes a collected coin and updates its status bar.
     * @param {number} index Index of the collected coin.
     * @param {number} amount Percentage gained from the coin.
     * @returns {void}
     */
    updateCoins(index, amount) {
        this.activeLevel.coins.splice(index, 1);
        this.coinPercentage = Math.min(this.coinPercentage + amount, 100);
        this.statusBarCoins.setPercentage(this.coinPercentage);
        this.playSound('coin');
    }

    /**
     * Collects a bottle when the maximum capacity has not been reached.
     * @param {number} index Index of the collected bottle.
     * @returns {void}
     */
    updateBottles(index) {
        if (this.character.bottleCount >= this.MAX_BOTTLES) return;
        this.activeLevel.bottles.splice(index, 1);
        this.character.bottleCount = Math.min(this.character.bottleCount + 1, this.MAX_BOTTLES);
        this.statusBarBottles.setPercentage(this.character.bottleCount * this.BOTTLE_PERCENT_STEP);
        this.playSound('bottle');
    }

    /**
     * Checks whether the character is airborne.
     * @returns {boolean} Whether the character is in the air.
     */
    isCharacterInAir() {
        return this.character.isAboveGround() || this.character.speedY > 0;
    }

    /**
     * Checks whether the character horizontally overlaps an enemy.
     * @param {MovableObject} enemy Enemy to test.
     * @returns {boolean} Whether the hitboxes overlap.
     */
    isEnemyHittingCharacter(enemy) {
        const charLeft  = this.character.hbLeft;
        const charRight = charLeft + this.character.hbWidth;
        const enemyLeft  = enemy.hbLeft;
        const enemyRight = enemyLeft + enemy.hbWidth;
        return charRight > enemyLeft && charLeft < enemyRight;
    }

    /**
     * Checks whether the character is descending onto an enemy.
     * @param {MovableObject} enemy Enemy to test.
     * @returns {boolean} Whether the character stomps the enemy.
     */
    isStompingEnemy(enemy) {
        const characterBottom = this.character.hbTop + this.character.hbHeight;
        const enemyTopHitZone = enemy.hbTop + enemy.hbHeight * 0.4;
        return this.character.speedY < 0 &&
            this.isEnemyHittingCharacter(enemy) &&
            characterBottom >= enemy.hbTop &&
            characterBottom <= enemyTopHitZone;
    }

    /**
     * Delays removal of a defeated enemy for its death animation.
     * @param {MovableObject} enemy Enemy to remove.
     * @returns {void}
     */
    removeEnemy(enemy) {
        setTimeout(() => {
            const idx = this.activeLevel.enemies.indexOf(enemy);
            if (idx > -1) this.activeLevel.enemies.splice(idx, 1);
        }, 2000);
    }

    /**
     * Runs a callback for every object colliding with the character.
     * @param {MovableObject[]} array Objects to check.
     * @param {Function} callback Function called for a collision.
     * @returns {void}
     */
    isCharColliding(array, callback) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (this.character.isColliding(array[i])) callback(array[i], i);
        }
    }

    /**
     * Draws all game objects in their world layer order.
     * @returns {void}
     */
    drawWorldObjects() {
        this.addObjectsToMap(this.activeLevel.backgroundObjects);
        this.addObjectsToMap(this.activeLevel.enemies);
        this.addObjectsToMap(this.activeLevel.clouds);
        this.addObjectsToMap(this.activeLevel.coins);
        this.addObjectsToMap(this.activeLevel.bottles);
        this.addObjectsToMap(this.activeLevel.throwableBottles);
        this.addToMap(this.character);
    }

    /**
     * Draws the player status bars and the boss bar when active.
     * @returns {void}
     */
    drawHUD() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusBarBottles);
        const endboss = this.activeLevel.enemies.find(e => e instanceof Endboss);
        const isEndbossHealthVisible = Boolean(endboss && endboss.hasBeenTriggered);
        document.body.classList.toggle('endboss-health-visible', isEndbossHealthVisible);
        if (endboss && endboss.hasBeenTriggered) {
            this.addToMap(this.statusBarEndboss);
        }
    }

    /**
     * Renders one animation frame and schedules the next frame.
     * @returns {void}
     */
    draw() {
        if (this.stopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawWorldObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.drawHUD();
        this.animationFrameId = requestAnimationFrame(this.draw.bind(this));
    }

    /**
     * Draws every object of a game-object collection.
     * @param {DrawableObject[]} array Objects to draw.
     * @returns {void}
     */
    addObjectsToMap(array) {
        try {
            array.forEach(obj => this.addToMap(obj));
        } catch (err) {
            console.error('Error drawing objects:', err);
        }
    }

    /**
     * Draws one object, mirroring it when it faces left.
     * @param {DrawableObject} obj Object to draw.
     * @returns {void}
     */
    addToMap(obj) {
        if (obj.otherDirection) this.flipImage(obj);
        obj.draw(this.ctx);
        if (obj.otherDirection) this.flipImageBack(obj);
    }

    /**
     * Mirrors the canvas before drawing a left-facing object.
     * @param {DrawableObject} obj Object being mirrored.
     * @returns {void}
     */
    flipImage(obj) {
        this.ctx.save();
        this.ctx.translate(obj.width, 0);
        this.ctx.scale(-1, 1);
        obj.x = obj.x * -1;
    }

    /**
     * Restores the canvas after drawing a left-facing object.
     * @param {DrawableObject} obj Object that was mirrored.
     * @returns {void}
     */
    flipImageBack(obj) {
        obj.x = obj.x * -1;
        this.ctx.restore();
    }

    /**
     * Stops the render frame and all active gameplay intervals.
     * @returns {void}
     */
    stopGameLoop() {
        this.stopped = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        for (let i = 1; i < 9999; i++) window.clearInterval(i);
    }

    /**
     * Displays the game-over screen once.
     * @returns {void}
     */
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

    /**
     * Schedules the victory screen once the end boss has died.
     * @returns {void}
     */
    checkIfEndbossDead() {
        const endboss = this.activeLevel.enemies.find(e => e instanceof Endboss);
        if (!endboss || endboss.health > 0 || endboss.deathTriggered) return;
        endboss.deathTriggered = true;
        setTimeout(() => { if (window.showWinScreen) window.showWinScreen(); }, 1500);
    }

    /**
     * Plays a configured game sound by name.
     * @param {string} name Name of the sound to play.
     * @returns {void}
     */
    playSound(name) {
        if (!this.sounds || !this.sounds[name]) return;
        const sound = this.sounds[name];
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /**
     * Starts or stops the walking sound based on character movement.
     * @returns {void}
     */
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

