import YELLOW_SRC from "./images/big_coin.png";
import ORANGE_SRC from "./images/orange_coin.png";

/**
 * A dictionary of coin images defined.
 */
interface CoinImages {
    [key: string]: HTMLImageElement
}

/**
 * A class that is a storehouse of coin images.
 */
class CoinImager {
    /**
     * The images owned by the coin imager.
     */
    private images: CoinImages = {};

    /**
     * Creates a new `CoinImager`.
     */
    constructor() {
        // Register our images.
        this.createImage("yellow", YELLOW_SRC);
        this.createImage("orange", ORANGE_SRC);
    }

    /**
     * Defines a new coin image in the imager.
    */
    private createImage(id: string, src: string) {
        this.images[id] = new Image();
        this.images[id].src = src;
    }

    /**
     * Obtains a coin image from the imager.
     * @param id The ID of the image
     * @returns {HTMLImageElement | null} The image found, or `null` if it doesn't exit.
     */
    getImage(id: string): HTMLImageElement | null {
        return this.images[id] || null;
    }
}

export default CoinImager;