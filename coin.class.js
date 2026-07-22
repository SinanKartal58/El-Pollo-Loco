import MovableObject from "./moveble-object.class.js";

export default class Coins extends MovableObject {
    y = 350
    height = 100
    width = 100
    hitboxX = 20;
    hitboxY = 20;
    hitboxW = 60;
    hitboxH = 60;

    constructor() {
        super();
        this.loadImage("img_pollo_locco/img/8_coin/coin_2.png");
        this.x = 200 + Math.random() * 2000;
    }
}

