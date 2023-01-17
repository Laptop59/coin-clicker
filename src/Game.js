import COIN_SRC from "./images/big_coin.png";
import BIG_COIN_SRC from "./images/coin_button.png";

class Game {
    coins = 0
    cpc = 1

    ready = 0;
    canvas = null;
    coinSize = 1.5

    images = {};

    constructor(save) {
        this.canvas = document.getElementsByClassName("canvas")[0];
        this.canvas.addEventListener("click", this.canvasClick.bind(this));
        this.loadImages();
        if (++this.ready > 1) this.doStart();
    }

    loadImages() {
        this.images.big_coin = new Image();
        this.images.big_coin.src = BIG_COIN_SRC;
    }

    start() {
        if (++this.ready > 1) this.doStart();
    }

    doStart() {
        // Start our tick functions.
        requestAnimationFrame(() => this.tick(this));
    }

    tick(t) {
        t.resizeCanvas();
        t.animateCoin();

        // Again
        requestAnimationFrame(() => this.tick(t));
    }

    resizeCanvas() {
        let canvas = this.canvas;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    animateCoin() {
        this.coinSize += (1.5 - this.coinSize) / 4;

        const ctx = this.canvas.getContext("2d");
        const {width, height} = this.canvas;
        const {width: W, height: H} = this.images.big_coin;
        const WW = W * this.coinSize;
        const HH = H * this.coinSize;
        
        ctx.drawImage(this.images.big_coin, (width - WW) / 2, (height - HH) / 2, WW, HH);
    }

    canvasClick(e) {
        if (this.ready < 2) return;
        const {clientX: x, clientY: y} = e;
        // It already lines up.
        // Calculate our offsets.
        const X = x - (this.canvas.width / 2);
        const Y = y - (this.canvas.height / 2);

        const A = this.images.big_coin.width / 2 * this.coinSize;
        const B = this.images.big_coin.height / 2 * this.coinSize;
        
        if (X*X/(B*B) + Y*Y/(A*A) <= 1) {
            this.coinClick();
        }
    }

    coinClick() {
        this.coinSize = 0.75 * 1.5;
        this.coins += this.cpc;
        document.getElementsByTagName("h1")[0].textContent = this.coins;
    }
}

export default Game;