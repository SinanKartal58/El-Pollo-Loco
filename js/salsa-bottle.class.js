import ThrowableObject from "./throwable-object.class.js";

export default class SalsaBottle extends ThrowableObject {
    /**
     * Creates a salsa bottle ready to be thrown.
     * @param {number} [startX=100] Initial horizontal position.
     * @param {number} [startY=350] Initial vertical position.
     * @param {boolean} [throwToRight=false] Direction of the throw.
     */
    constructor(startX = 100, startY = 350, throwToRight = false) {
        super(startX, startY, throwToRight);
    }
}

