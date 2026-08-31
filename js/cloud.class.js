import MovableObject from "./moveble-object.class.js";

export default class Cloud extends MovableObject {
    y = 20;
    height = 380;
    width = 650;
    speed = 0.2;

    /**
     * Creates a moving cloud at the supplied horizontal position.
     * @param {string} imagePath Cloud image path.
     * @param {number} x Horizontal position in the level.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.animate();
    }

    /**
     * Starts the cloud movement timer.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 25);
    }
}

