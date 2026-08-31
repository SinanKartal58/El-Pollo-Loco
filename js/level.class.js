export default class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    coins = [];
    bottles = [];
    throwableBottles = [];
    level_end_x = 700;

    /**
     * Creates a level from its game-object collections.
     * @param {MovableObject[]} enemies Level enemies.
     * @param {Cloud[]} clouds Background clouds.
     * @param {BackgroundObject[]} backgroundObjects Background layers.
     * @param {Coins[]} coins Collectible coins.
     * @param {number} level_end_x Horizontal level boundary.
     * @param {BottleGround[]} [bottles=[]] Collectible bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, level_end_x, bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.throwableBottles = [];
        this.level_end_x = level_end_x;
    }
}

