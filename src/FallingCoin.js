class FallingCoin {
    x = 0;
    y = -200;
    // 0.95 to 1.25
    // 0.95 + 0.3 * R
    s = 0.95 + Math.random() * 0.3
    rotation = Math.random() * 2 * Math.PI;
    canvas;
    ctx;
    ci;

    constructor (canvas, coinImage) {
        this.x = Math.random();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ci = coinImage
    }

    draw () {
        const alpha = 0.95;
        this.ctx.globalAlpha = alpha;
        const xs = 55;
        const ys = 60;
        let xOffset = this.x * this.canvas.width + (xs/2) * this.s;
        let yOffset = this.y + (ys/2) * this.s;
        this.ctx.save()
        this.ctx.translate(xOffset, yOffset)
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-xOffset, -yOffset)
        this.ctx.drawImage(this.ci, this.x * this.canvas.width, this.y, xs * this.s, ys * this.s);
        this.ctx.rotate(-this.rotation);
        this.ctx.restore();

        this.ctx.globalAlpha = 1;
    }

    fall (delta) {
        this.y += delta / 7;
        this.rotation += delta / 100;
    }
}

export default FallingCoin;