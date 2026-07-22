export default class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    coins = [];
    bottles = [];
    throwableBottles = [];
    level_end_x = 700;

    
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

