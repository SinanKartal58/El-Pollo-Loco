import ThrowableObject from "./throwable-object.class.js";

export default class SalsaBottle extends ThrowableObject {
    
    constructor(startX = 100, startY = 350, throwToRight = false) {
        super(startX, startY, throwToRight);
    }
}

