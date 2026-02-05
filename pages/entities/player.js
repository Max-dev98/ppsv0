import { Entity } from './entity';
export const PlayerState = {
    Idle: 'idle',
    Run: 'run',
    Jump: 'jump'
};
export class Player extends Entity {
    state = PlayerState.Idle;
    lastState = PlayerState.Idle;
    width = 8 * 8;
    height = 8 * 8;
    velocityY = 0;
    velocityX = 0;
    speed = 200;
    jumpForce = 350;
    gravity = 900;
    isOnGround = false;
    life = 3;
    alive = true;
    sprites = {
        [PlayerState.Idle]: new Image(),
        [PlayerState.Run]: new Image(),
        [PlayerState.Jump]: new Image()
    };
    frameWidth = 8;
    frameHeight = 8;
    frameIndex = 0;
    frameCount = 4;
    frameTime = 0;
    frameSpeed = 0.30;
    constructor() {
        super();
        this.x = 100;
        this.y = 300;
        this.sprites[PlayerState.Idle].src = '/sprites/pumpkinoIdle.png';
        this.sprites[PlayerState.Run].src = '/sprites/pumpkinoRun.png';
        this.sprites[PlayerState.Jump].src = '/sprites/pumpkinoJump.png';
    }
    // 👇 INPUT VEM DE FORA AGORA
    applyInput(input, dt) {
        this.velocityX = 0;
        if (input.left)
            this.velocityX = -this.speed;
        if (input.right)
            this.velocityX = this.speed;
        this.x += this.velocityX * dt;
        if (input.jump && this.isOnGround) {
            this.velocityY = -this.jumpForce;
            this.isOnGround = false;
        }
    }
    update(dt) {
        // física vertical
        this.velocityY += this.gravity * dt;
        this.y += this.velocityY * dt;
        if (this.y + this.height >= 360) {
            this.y = 360 - this.height;
            this.velocityY = 0;
            this.isOnGround = true;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        // parede direita (800 = largura do canvas)
        if (this.x + this.width > 800) {
            this.x = 800 - this.width;
        }
        // ===== DETERMINA ESTADO =====
        if (!this.isOnGround) {
            this.state = PlayerState.Jump;
        }
        else if (this.velocityX !== 0) {
            this.state = PlayerState.Run;
        }
        else {
            this.state = PlayerState.Idle;
        }
        if (this.state !== this.lastState) {
            this.frameIndex = 0;
            this.frameTime = 0;
            this.lastState = this.state;
        }
        // ===== ANIMAÇÃO =====
        this.frameTime += dt;
        if (this.frameTime >= this.frameSpeed) {
            this.frameTime = 0;
            this.frameIndex++;
            if (this.frameIndex >= this.frameCount) {
                this.frameIndex = 0;
            }
        }
    }
    draw(ctx) {
        const sourceX = this.frameIndex * this.frameWidth;
        ctx.drawImage(this.sprites[this.state], sourceX, 0, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
    }
}
