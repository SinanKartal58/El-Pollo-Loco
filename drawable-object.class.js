
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

    
    get hbLeft()   { return this.x + this.hitboxX; }
    
    get hbTop()    { return this.y + this.hitboxY; }
    
    get hbWidth()  { return this.hitboxW ?? (this.width  - this.hitboxX); }
    
    get hbHeight() { return this.hitboxH ?? (this.height - this.hitboxY); }

    
    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    
    loadImages(pathsArray) {
        pathsArray.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgStore[path] = img;
        });
    }

    
    playAnimation(images) {
        if (!images || images.length === 0) return;
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgStore[path];
        this.currentImage++;
    }
}

