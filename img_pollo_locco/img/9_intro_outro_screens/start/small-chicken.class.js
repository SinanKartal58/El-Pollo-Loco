import Chicken from "./chicken.class.js";
import { GROUND_Y } from "./movable-object.class.js";

export default class SmallChicken extends Chicken {
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
    }

    
    animate() {
        this.startAnimationLoop();
        this.startMovementLoop();
    }

    startAnimationLoop() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.DEAD_IMAGE);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    startMovementLoop() {
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);
    }
}

