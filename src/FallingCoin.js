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
    id = "yellow";
    destroy = 0;
    game;

    special;

    constructor (canvas, imager, game) {
        this.x = Math.random();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.game = game;

        this.setSpecial();
        this.ci = imager.getImage(this.id)
    }

    setSpecial() {
        // 0000 - 9999
        const num = Math.random() * 100;
        if (num < 20.5) this.id = "orange";
    }

    draw() {
        this.ctx.globalAlpha = this.alpha;
        const xs = 55;
        const ys = 60;
        let xOffset = this.realX + (xs/2) * this.s;
        let yOffset = this.y + (ys/2) * this.s;
        this.ctx.save()
        this.ctx.translate(xOffset, yOffset)
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-xOffset, -yOffset)
        this.ctx.drawImage(this.ci, this.realX, this.y, xs * this.is, ys * this.is);
        this.ctx.rotate(-this.rotation);
        this.ctx.restore();
        if (this.destroy !== 1) this.destroy -= 1;
    }

    fall(delta) {
        this.y += delta / 7;
        this.rotation += delta / 100;
    }
    
    isTouching(x, y) {
        if (this.destroy > 0) return;
        const X = x - this.realX;
        const Y = y - this.y;

        const YS = 60 * this.s;

        return X*X + Y*Y < YS*YS;
    }

    click() {
        this.destroy = 10;

        switch (this.id) {
            case "orange":
                if (Math.random() < 0.05) {
                    this.game.addEffect("superFrenzy")
                } else {
                    this.game.addEffect("frenzy")
                }
                break;
        }
    }

    get realX() {
        return this.x * this.canvas.width;
    }

    get is() {
        if (this.destroy <= 0) return this.s;
        return this.s * ((10 - this.destroy) / 10 + 1)
    }

    get alpha() {
        if (this.destroy <= 0) return 1;
        return (this.destroy - 1) / 10;
    }
}

export default FallingCoin;