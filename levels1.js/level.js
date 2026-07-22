import BackgroundObject from "../classes/background-object.class.js";
import Cloud from "../classes/cloud.class.js";
import Chicken from "../classes/chicken.class.js";
import SmallChicken from "../classes/small-chicken.class.js";
import Endboss from "../classes/endboss.class.js";
import Coins from "../classes/coins.class.js";
import BottleGround from "../classes/bottle-ground.class.js";

const TILE_WIDTH = 719;
const BACKGROUND_TILE_COUNT = 8;
const LEVEL_END_X = TILE_WIDTH * (BACKGROUND_TILE_COUNT - 1) + 40;
const BOSS_SECTION_START_X = LEVEL_END_X - 900;
const SAFE_ENEMY_MAX_X = BOSS_SECTION_START_X - 120;
const BOSS_SPAWN_X = LEVEL_END_X + 400;
const BOTTLE_GROUND_Y = 350;


function createEnemyAt(EnemyType, x) {
    const enemy = new EnemyType();
    enemy.x = Math.min(x, SAFE_ENEMY_MAX_X);
    return enemy;
}


function createCoinAt(x, y = 350) {
    const coin = new Coins();
    coin.x = x;
    coin.y = y;
    return coin;
}


function createBoss() {
    const boss = new Endboss();
    boss.x = BOSS_SPAWN_X;
    return boss;
}


function createEnemies() {
    return [
        createEnemyAt(Chicken, 500),
        createEnemyAt(Chicken, 900),
        createEnemyAt(SmallChicken, 1200),
        createEnemyAt(Chicken, 1500),
        createEnemyAt(SmallChicken, 1850),
        createEnemyAt(Chicken, 2200),
        createEnemyAt(SmallChicken, 2500),
        createEnemyAt(Chicken, 2850),
        createEnemyAt(SmallChicken, 3150),
        createEnemyAt(Chicken, 3450),
        createEnemyAt(SmallChicken, 3720),
        createBoss(),
    ];
}


function createClouds() {
    const clouds = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT + 2; i++) {
        const cloudImage = i % 2 === 0
            ? "img/5_background/layers/4_clouds/1.png"
            : "img/5_background/layers/4_clouds/2.png";
        clouds.push(new Cloud(cloudImage, i * 650));
    }
    return clouds;
}


function createBackgrounds() {
    const backgroundObjects = [];
    for (let i = 0; i < BACKGROUND_TILE_COUNT; i++) {
        const variant = i % 2 === 0 ? "1" : "2";
        const tileX = TILE_WIDTH * i;
        backgroundObjects.push(new BackgroundObject("img/5_background/layers/air.png", tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${variant}.png`, tileX));
        backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${variant}.png`, tileX));
    }
    return backgroundObjects;
}


function createCoins() {
    return [
        createCoinAt(260, 280),
        createCoinAt(620, 230),
        createCoinAt(980, 260),
        createCoinAt(1380, 200),
        createCoinAt(1780, 250),
        createCoinAt(2180, 190),
        createCoinAt(2580, 240),
        createCoinAt(2980, 180),
        createCoinAt(3380, 230),
        createCoinAt(3780, 200),
    ];
}


function createBottles() {
    return [
        new BottleGround(400, BOTTLE_GROUND_Y),
        new BottleGround(800, BOTTLE_GROUND_Y),
        new BottleGround(1200, BOTTLE_GROUND_Y),
        new BottleGround(1600, BOTTLE_GROUND_Y),
        new BottleGround(2000, BOTTLE_GROUND_Y),
        new BottleGround(2400, BOTTLE_GROUND_Y),
        new BottleGround(2800, BOTTLE_GROUND_Y),
        new BottleGround(3200, BOTTLE_GROUND_Y),
        new BottleGround(3600, BOTTLE_GROUND_Y),
    ];
}


export default function createLevel1Objects() {
    return {
        enemies: createEnemies(),
        clouds: createClouds(),
        backgroundObjects: createBackgrounds(),
        coins: createCoins(),
        bottles: createBottles(),
        levelEndX: LEVEL_END_X
    };
}


