import Level from './level.class.js';
import BackgroundObject from './background.object.class.js';
import Cloud from './cloud.class.js';
import Chicken from './chicken.class.js';
import SmallChicken from './small-chicken.class.js';
import Endboss from './endboss.class.js';
import Coins from './coin.class.js';
import BottleGround from './bottle.class.js';

const TILE_WIDTH = 719;
const BACKGROUND_TILE_COUNT = 8;
const LEVEL_END_X = TILE_WIDTH * (BACKGROUND_TILE_COUNT - 1) + 40;
const SAFE_ENEMY_MAX_X = LEVEL_END_X - 1120;

/**
 * Creates the clouds used in the level background.
 * @returns {Cloud[]} Configured cloud objects.
 */
function createClouds() {
    const clouds = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT + 2; i++) {
        const cloudImage = i % 2 === 0
            ? "img_pollo_locco/img/5_background/layers/4_clouds/1.png"
            : "img_pollo_locco/img/5_background/layers/4_clouds/2.png";
        const cloud = new Cloud(cloudImage, i * 650);
        clouds.push(cloud);
    }
    return clouds;
}

/**
 * Creates all layered background tiles for the level.
 * @returns {BackgroundObject[]} Configured background objects.
 */
function createBackgrounds() {
    const backgroundObjects = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT; i++) {
        const variant = i % 2 === 0 ? "1" : "2";
        const tileX = TILE_WIDTH * i;
        backgroundObjects.push(new BackgroundObject("img_pollo_locco/img/5_background/layers/air.png", tileX));
        backgroundObjects.push(new BackgroundObject(`img_pollo_locco/img/5_background/layers/3_third_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img_pollo_locco/img/5_background/layers/2_second_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img_pollo_locco/img/5_background/layers/1_first_layer/${variant}.png`, tileX));
    }
    return backgroundObjects;
}

/**
 * Creates coins at their defined level positions.
 * @returns {Coins[]} Configured coin objects.
 */
function createCoins() {
    const coins = [];
    const positions = [600, 1000, 1400, 1900, 2300, 2700, 3100, 3500];
    for (let x of positions) {
        const coin = new Coins();
        coin.x = x;
        coin.y = 200;
        coins.push(coin);
    }
    return coins;
}

/**
 * Creates collectible bottles at their defined level positions.
 * @returns {BottleGround[]} Configured bottle objects.
 */
function createBottles() {
    const bottles = [];
    const positions = [400, 700, 1000, 1300, 1600, 1900, 2200, 2500, 2800, 3100, 3400, 3700, 4000, 4300, 4600];
    for (let x of positions) {
        const bottle = new BottleGround();
        bottle.x = x;
        bottle.y = 350;
        bottles.push(bottle);
    }
    return bottles;
}

/**
 * Creates enemy instances at the provided positions.
 * @param {Function} EnemyType Enemy class to instantiate.
 * @param {number[]} positions Horizontal spawn positions.
 * @returns {MovableObject[]} Configured enemy objects.
 */
function createEnemiesAtPositions(EnemyType, positions) {
    return positions.map((x) => {
        const enemy = new EnemyType();
        enemy.x = Math.min(x, SAFE_ENEMY_MAX_X);
        return enemy;
    });
}

/**
 * Creates all level enemies, including the end boss.
 * @returns {MovableObject[]} Configured enemy objects.
 */
function createEnemies() {
    const chickenPositions = [500, 900, 1500, 2200, 2850, 3450];
    const smallChickenPositions = [1200, 1850, 2500, 3150, 3720];
    const enemies = [
        ...createEnemiesAtPositions(Chicken, chickenPositions),
        ...createEnemiesAtPositions(SmallChicken, smallChickenPositions)
    ];
    const boss = new Endboss();
    boss.x = LEVEL_END_X + 100;
    enemies.push(boss);
    return enemies;
}

/**
 * Creates the first playable level.
 * @returns {Level} Configured level instance.
 */
export default function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackgrounds(),
        createCoins(),
        LEVEL_END_X,
        createBottles()
    );
}


