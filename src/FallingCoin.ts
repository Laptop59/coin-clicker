import CoinImager from "./CoinImager";
import { EffectType } from "./Effect";
import Game from "./Game";

enum FallingCoinType {
    YELLOW = "yellow",
    ORANGE = "orange",
}

/**
 * This class describes a falling coin in the canvas.
 */
class FallingCoin {
    /**
     * The x-position of the coin.
     */
    x: number = 0;

    /**
     * The y-position of the coin.
     */
    y: number = -200;

    // 0.95 to 1.25
    // 0.95 + 0.3 * R

    /**
     * The size of the coin, in the interval [0.95,1.25)
     */
    s: number = 0.95 + Math.random() * 0.3

    /**
     * The rotation of the coin in radians.
     */
    rotation: number = Math.random() * 2 * Math.PI;

    /**
     * A reference to the canvas.
     */
    canvas: HTMLCanvasElement;

    /**
     * A reference to the context of the canvas.
     */
    ctx: CanvasRenderingContext2D;

    /**
     * A reference image of the coin.
     */
    ci: HTMLImageElement;

    /**
     * The type of the coin.
     */
    id: FallingCoinType = FallingCoinType.YELLOW;

    /**
     * The destruction-state of the coin (usually in the range [0, 10]).
     */
    destroy: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 = 0;

    /**
     * A reference to the current game.
     */
    game: Game;

    /**
     * Creates a new `FallingCoin`.
     * @param canvas A reference to the canvas it will be drawn in.
     * @param imager A reference to a `CoinImager`, a storehouse of coin images.
     * @param game A reference to the current game.
     */
    constructor (canvas: HTMLCanvasElement, imager: CoinImager, game: Game) {
        this.x = Math.random();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.game = game;

        this.setSpecial();
        this.ci = imager.getImage(this.id)
    }

    /**
     * Sets the specialty of the coin based on RNG.
     */
    setSpecial() {
        const num = Math.random() * 100;
        if (num < 0.75) this.id = FallingCoinType.ORANGE;
    }

    /**
     * Draws the coin in the canvas. It also may increase `destroy` by 1.
     */
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

    /**
     * Make the coin fall and rotate.
     * @param delta Time passed since last time.
     */
    fall(delta: number) {
        this.y += delta / 7;
        this.rotation += delta / 100;
    }
    
    /**
     * Tells if the coin can be touched at a point.
     * @param x x-position of the point.
     * @param y y-position of the point.
     * @returns Whether they are touching.\
     * Note: *This will return `false` if it is getting destroyed.*
     */
    isTouching(x: number, y: number) {
        if (this.destroy > 0) return false;
        const X = x - this.realX;
        const Y = y - this.y;

        const YS = 60 * this.s;

        return X*X + Y*Y < YS*YS;
    }

    /**
     * Touches the coin.
     */
    click() {
        this.destroy = 10;

        switch (this.id) {
            case FallingCoinType.ORANGE:
                if (Math.random() < 0.05) {
                    this.game.addEffect(EffectType.SUPER_FRENZY)
                } else {
                    this.game.addEffect(EffectType.FRENZY)
                }
                break;
        }
    }

    /**
     * Gets the actual x-position of the coin, which is used to draw.
     */
    get realX() {
        return this.x * this.canvas.width;
    }

    /**
     * The animating size of the coin.
     */
    get is() {
        if (this.destroy <= 0) return this.s;
        return this.s * ((10 - this.destroy) / 10 + 1)
    }

    /**
     * Gets the alpha the coin needs to be drawn in.
     */
    get alpha() {
        if (this.destroy <= 0) return 1;
        return (this.destroy - 1) / 10;
    }
}

export default FallingCoin;