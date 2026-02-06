import { Entity } from './entity.js';
export class Enemy extends Entity {
    width = 8 * 8;
    height = 8 * 8;
    speed = 80;
    alive = true;
    life = 5;
    // ===== SPRITE =====
    image = new Image();
    frameWidth = 8;
    frameHeight = 8;
    frameIndex = 0;
    frameCount = 4;
    frameTime = 0;
    frameSpeed = 0.30;
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.image.src = './public/sprites/enemyGhost.png';
    }
    update(dt) {
        // movimento simples (vai pra esquerda)
        this.x -= this.speed * dt;
        // animação
        this.frameTime += dt;
        if (this.frameTime >= this.frameSpeed) {
            this.frameTime = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.frameCount) {
                this.frameIndex = 0;
            }
        }
        // morreu ao sair da tela
        if (this.x + this.width < 0) {
            this.alive = false;
        }
    }
    draw(ctx) {
        const sx = this.frameIndex * this.frameWidth;
        ctx.drawImage(this.image, sx, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
    }
}
