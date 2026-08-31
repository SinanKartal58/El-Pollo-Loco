import MovableObject from "./moveble-object.class.js";

export default class BackgroundObject extends MovableObject {
    x = 0
    y = 0
    width = 720;
    height = 480;

    /**
     * Creates a background tile at the supplied horizontal position.
     * @param {string} imagePath Background image path.
     * @param {number} x Horizontal position in the level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}

