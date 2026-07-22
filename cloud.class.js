import MovableObject from "./moveble-object.class.js";

export default class Cloud extends MovableObject {
    y = 20;
    height = 380;
    width = 650;
    speed = 0.2;

    
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 25);
    }
}

