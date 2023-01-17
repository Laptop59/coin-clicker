class Game {
    coins = 0
    ready = false;
    canvas = null;
    coinSize = 50

    images = [];

    constructor(save) {
        this.canvas = document.getElementsByClassName("canvas")[0];
        loadImages();
        this.ready = true;
    }

    start() {
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
        const ctx = this.canvas.getContext("2d");
        

    }
}

export default Game;