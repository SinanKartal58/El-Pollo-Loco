import MovableObject from "./moveble-object.class.js";

export default class BackgroundObject extends MovableObject {
    x = 0
    y = 0
    width = 720;
    height = 480;

    
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}

