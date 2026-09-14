/**
 * Base class for drawable game objects with image and hitbox support.
 */
export default class DrawableObject {
    x = 120;
    y = 250;
    height = 150;
    width = 100;
    img;
    currentImage = 0;
    imgStore = {}

    
    hitboxX = 0;
    hitboxY = 0;
    hitboxW = null;
    hitboxH = null;

    
    /** @returns {number} Left edge of the hitbox. */
    get hbLeft() { return this.x + this.hitboxX; }

    /** @returns {number} Top edge of the hitbox. */
    get hbTop() { return this.y + this.hitboxY; }

    /** @returns {number} Width of the hitbox. */
    get hbWidth() { return this.hitboxW ?? (this.width - this.hitboxX); }

    /** @returns {number} Height of the hitbox. */
    get hbHeight() { return this.hitboxH ?? (this.height - this.hitboxY); }

    /**
     * Draws the current image on the game canvas.
     * @param {CanvasRenderingContext2D} ctx Canvas context to draw on.
     * @returns {void}
     */
    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads one image as the current object image.
     * @param {string} path Image file path.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads image paths into the object's image cache.
     * @param {string[]} pathsArray Image file paths to load.
     * @returns {void}
     */
    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgStore[path] = img;
        });
    }

    /**
     * Displays the next image from an animation sequence.
     * @param {string[]} images Image paths forming the animation.
     * @returns {void}
     */
    playAnimation(images) {
        if (!images || images.length === 0) return;
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgStore[path];
        this.currentImage++;
    }
}

