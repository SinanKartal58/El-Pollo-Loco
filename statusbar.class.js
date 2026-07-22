import DrawableObject from "./drawable-object.class.js";


export default class StatusBar extends DrawableObject {
    IMAGES_COINS = [
        "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
    ];

    IMAGES_HEALTH = [
        "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png"
    ];

    IMAGES_BOTTLES = [
        "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ];

    IMAGES_ENDBOSS = [
        "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img_pollo_locco/img/7_statusbars/2_statusbar_endboss/blue/blue100.png"
    ];

    percentage = 100;

    
    constructor(type) {
        super();
        this.width = 200;
        this.height = 60;
        this.x = 20;

        this.loadImages(this.IMAGES_HEALTH);
        this.loadImages(this.IMAGES_COINS);
        this.loadImages(this.IMAGES_BOTTLES);
        this.loadImages(this.IMAGES_ENDBOSS);

        this.initialize(type);
        this.setPercentage(0);
    }

    initialize(type) {
        const config = {
            health:  { y: 0,   images: this.IMAGES_HEALTH },
            coins:   { y: 50,  images: this.IMAGES_COINS },
            bottles: { y: 100, images: this.IMAGES_BOTTLES },
            endboss: { y: 0,   images: this.IMAGES_ENDBOSS, x: 500 },
        };
        const { x, y, images } = config[type];
        if (type === "endboss") this.x = x;
        this.y = y;
        this.IMAGES = images;
    }

    
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imgStore[path];
    }

    
    resolveImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}

