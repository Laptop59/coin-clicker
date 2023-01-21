class FallingCoin {

    x = 0;
    y = 0;
    rotation = Math.random() * 2 * Math.PI;
    canvas;
    ctx;

    constructor (canvas, coinImage) {
        this.x = Math.random();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ci = coinImage
    }

    draw () {
        this.ctx.drawImage(this.ci, x, y);
    }

    fall (delta) {
        this.y -= delta * 100
    }

    get canvasWidth() {
        return this.canvas.width;
    }

    get canvasHeight() {
        return this.canvas.height;
    }
}

export default FallingCoin;