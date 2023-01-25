import YELLOW_SRC from "./images/big_coin.png";
import ORANGE_SRC from "./images/orange_coin.png";

class CoinImager {
    images = []
    constructor() {
        // Register our images
        this.createImage("yellow", YELLOW_SRC);
        this.createImage("orange", ORANGE_SRC);
    }

    createImage(id, src) {
        this.images[id] = new Image();
        this.images[id].src = src;
    }

    getImage(id) {
        return this.images[id] || null;
    }
}

export default CoinImager;