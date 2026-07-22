import MovableObject, { GROUND_Y } from "./moveble-object.class.js";

export default class SmallChicken extends MovableObject {
    height = 50
    y = GROUND_Y - this.height
    width = 50
    IMAGES_WALKING = [
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ]

    DEAD_IMAGE = [
        "img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png"
    ]

    constructor() {
        super().loadImage("img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.initialize();
        this.speed = this.speed + Math.random() * 0.25;
    }

    initialize() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.DEAD_IMAGE);

        this.x = 300 + Math.random() * 2500;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGE);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);
    }

    kill() {
        this.health = 0;
        this.speed = 0;
    }
}
