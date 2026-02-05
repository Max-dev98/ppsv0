export class Sprite {
    image;
    constructor(src) {
        this.image = new Image();
        // debug: confirma carregamento
        this.image.onload = () => {
            console.log('Sprite carregado:', src);
        };
        this.image.onerror = () => {
            console.error('Erro ao carregar sprite:', src);
        };
        this.image.src = src;
    }
    draw(ctx, x, y, width, height) {
        ctx.drawImage(this.image, x, y, width, height);
    }
}
