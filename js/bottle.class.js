import DrawableObject from "./drawable-object.class.js";

export default class BottleGround extends DrawableObject {
    x;
    y;
    width = 50;
    height = 80;
    hitboxX = 10;
    hitboxY = 18;
    hitboxW = 28;
    hitboxH = 52;

    /**
     * Creates a collectible salsa bottle.
     * @param {number} [x=100] Horizontal position in the level.
     * @param {number} [y=350] Vertical position in the level.
     */
    constructor(x = 100, y = 350) {
        super();
        this.loadImage("img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
        this.x = x;
        this.y = y;
    }
}

