import COIN_SRC from "./images/big_coin.png";
import BIG_COIN_SRC from "./images/coin_button.png";
import BLANK_SRC from "./images/blank_icon.png";

class Game {
    coins = 0
    coinsPerClick = 1
    coinsPerSec = 0

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

        document.getElementsByClassName("coins-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 32));
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
    }

    start() {
        if (++this.ready > 1) this.doStart();
    }

    doStart() {
        // Start our tick functions.
        requestAnimationFrame(() => this.tick(this));
    }

    tick(t) {
        t.updateText();
        t.resizeCanvas();
        t.animateCoin();

        // Again
        requestAnimationFrame(() => this.tick(t));
    }

    updateText() {
        document.getElementsByClassName("coins-header")[0].getElementsByTagName("span")[0].innerHTML = "" + this.commify(this.coins, true);
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("span")[0].innerHTML = this.coinsPerSec ? (this.commify(this.coinsPerSec) + "/second") : (this.commify(this.coinsPerClick) + "/click");
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
        this.coins += this.coinsPerClick * this.coins + 1;
    }

    makeIcon(x, y, size = 128) {
        // Each icon is 128x128.
        const img = new Image();
        img.src = BLANK_SRC;
        img.className = "icon";
        img.style = `background-position: ${-x}px ${-y}px; width: ${size}px; height: ${size}px; background-size: ${size/128 * 2048}px`;
        return img;
    }

    commify(number, br) {
        number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + this.this.commify(-number);
        if (number < 1000000000) return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

        const illion = Math.floor(Math.log10(number) / 3);
        const starting = Math.pow(10, illion * 3);
        
        const float = number / starting;

        return float.toFixed(3) + (br ? "<br><span>" : " ") + this.illionSuffix(illion - 1) + (br ? "</span>" : "");
    }

    illionSuffix(illion) {
        if (illion == 100) return "centillion";
        if (illion == 101) return "uncentillion";
        if (illion < 10) {
            return ["million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"][illion - 1];
        }
        let unit = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"][illion % 10];
        let ten = ["", "dec", "vigint", "trigint", "quadragint", "quinquagint", "sexagint", "septuagint", "octoginta", "nonaginta"][Math.floor(illion / 10) % 10];
        return unit + ten + "illion";
    }
}

export default Game;