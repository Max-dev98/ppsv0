import { Player } from '../entities/player.js';
import { Bullet } from '../entities/bullet.js';
import { MouseInput } from './mouseInput.js';
import { Input } from './inputSytem.js';
import { Enemy } from '../entities/enemy.js';
export class Game {
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.lastTime = 0;
        this.player = new Player();
        this.entities = [];
        this.isGameOver = false;
        this.candy = 0;
        this.currentWave = 1;
        this.enemiesPerWave = 3;
        this.enemiesSpawned = 0;
        this.enemyBaseLife = 5;
        this.spawnTimer = 0;
        this.spawnDelay = 0.6;
        this.maxAmmo = 12;
        this.ammo = this.maxAmmo;
        this.isReloading = false;
        this.reloadTimer = 0;
        this.reloadTime = 1.5;
        this.ctx.imageSmoothingEnabled = false;
        Input.init();
        MouseInput.init(canvas);
        this.entities.push(this.player);
    }
    start() {
        requestAnimationFrame(this.loop);
    }
    loop = (time) => {
        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;
        this.update(dt);
        this.render();
        requestAnimationFrame(this.loop);
    };
    update(dt) {
        if (this.isGameOver) {
            if (Input.jump)
                this.reset();
            return;
        }
        this.player.applyInput(Input, dt);
        // ===== TIRO =====
        if (MouseInput.justPressed && this.ammo > 0 && !this.isReloading) {
            const px = this.player.x + this.player.width / 2;
            const py = this.player.y + this.player.height / 2;
            const dx = MouseInput.x - px;
            const dy = MouseInput.y - py;
            this.entities.push(new Bullet(px, py, dx, dy));
            this.ammo--; // consome bala
            MouseInput.justPressed = false;
        }
        // ===== RELOAD MANUAL COM R =====
        if (Input.reload && this.ammo < this.maxAmmo && !this.isReloading) {
            this.isReloading = true;
            this.reloadTimer = this.reloadTime;
        }
        // ===== TIMER DO RELOAD =====
        if (this.isReloading) {
            this.reloadTimer -= dt;
            if (this.reloadTimer <= 0) {
                this.isReloading = false;
                this.ammo = this.maxAmmo;
            }
        }
        // ===== UPDATE + LIMPEZA =====
        this.entities = this.entities.filter(e => {
            e.update(dt);
            if (e instanceof Bullet || e instanceof Enemy) {
                return e.alive;
            }
            return true;
        });
        // ===== COLISÃO BALA x INIMIGO =====
        this.entities.forEach(a => {
            if (a instanceof Bullet) {
                this.entities.forEach(b => {
                    if (b instanceof Enemy) {
                        if (a.x < b.x + b.width &&
                            a.x + a.size > b.x &&
                            a.y < b.y + b.height &&
                            a.y + a.size > b.y) {
                            a.alive = false;
                            b.life--;
                            if (b.life <= 0) {
                                b.alive = false;
                                this.candy++;
                            }
                        }
                    }
                });
            }
        });
        // ===== COLISÃO PLAYER x INIMIGO =====
        this.entities.forEach(e => {
            if (e instanceof Enemy && this.player.alive) {
                if (this.player.x < e.x + e.width &&
                    this.player.x + this.player.width > e.x &&
                    this.player.y < e.y + e.height &&
                    this.player.y + this.player.height > e.y) {
                    e.alive = false;
                    this.player.life--;
                    if (this.player.life <= 0) {
                        this.player.alive = false;
                        this.isGameOver = true;
                    }
                }
            }
        });
        // ===== SPAWN CONTROLADO =====
        this.spawnTimer += dt;
        if (this.enemiesSpawned < this.enemiesPerWave &&
            this.spawnTimer >= this.spawnDelay) {
            this.spawnTimer = 0;
            const spacing = 40; // espaço entre inimigos
            const enemyX = 800 + this.enemiesSpawned * spacing;
            const enemy = new Enemy(enemyX, 0);
            enemy.y = 360 - enemy.height;
            enemy.life = this.enemyBaseLife;
            this.entities.push(enemy);
            this.enemiesSpawned++;
        }
        // ===== SISTEMA DE WAVES =====
        const enemiesAlive = this.entities.filter(e => e instanceof Enemy).length;
        if (enemiesAlive === 0 && this.enemiesSpawned >= this.enemiesPerWave) {
            this.currentWave++;
            this.enemiesPerWave++;
            // a cada 5 waves inimigo fica mais forte
            if (this.currentWave % 5 === 0) {
                this.enemyBaseLife += Math.ceil(this.enemyBaseLife * 0.5);
            }
            this.enemiesSpawned = 0;
        }
    }
    render() {
        this.ctx.clearRect(0, 0, 800, 400);
        this.ctx.fillStyle = '#1d1814';
        this.ctx.fillRect(0, 360, 800, 40);
        this.entities.forEach(e => e.draw(this.ctx));
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px monospace';
        this.ctx.fillText(`Candy: ${this.candy}`, 10, 20);
        this.ctx.fillText(`Life: ${this.player.life}`, 10, 40);
        this.ctx.fillText(`Wave: ${this.currentWave}`, 10, 60);
        // HUD da munição
        this.ctx.fillText(`Ammo: ${this.ammo}/${this.maxAmmo}`, 10, 80);
        // ===== BARRA DE RELOAD =====
        if (this.isReloading) {
            const barWidth = 100;
            const barHeight = 8;
            const x = 10;
            const y = 100;
            const progress = 1 - this.reloadTimer / this.reloadTime;
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(x, y, barWidth, barHeight);
            this.ctx.fillStyle = 'lime';
            this.ctx.fillRect(x, y, barWidth * progress, barHeight);
        }
        if (this.isGameOver) {
            this.ctx.fillStyle = 'red';
            this.ctx.font = '32px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('GAME OVER', 400, 180);
            this.ctx.fillText('Press SPACE to restart', 400, 220);
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'alphabetic';
        }
    }
    // ===== RESET =====
    reset() {
        this.entities = [];
        this.player = new Player();
        this.entities.push(this.player);
        this.candy = 0;
        this.isGameOver = false;
        this.currentWave = 1;
        this.enemiesSpawned = 0;
        this.spawnTimer = 0;
        this.enemyBaseLife = 1;
        // reseta arma
        this.ammo = this.maxAmmo;
        this.isReloading = false;
    }
}
