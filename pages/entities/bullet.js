import { Entity } from './entity';
export class Bullet extends Entity {
    speed = 400;
    vx;
    vy;
    size = 4;
    alive = true;
    constructor(x, y, dx, dy) {
        super();
        this.x = x;
        this.y = y;
        const length = Math.hypot(dx, dy);
        this.vx = dx / length;
        this.vy = dy / length;
    }
    update(dt) {
        this.x += this.vx * this.speed * dt;
        this.y += this.vy * this.speed * dt;
        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 400) {
            this.alive = false;
        }
    }
    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}
