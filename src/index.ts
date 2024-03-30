import Game from "./Game";
import "./styles.scss";
import HtmlBuilder from "./HtmlBuilder";

init();

/**
 * Start the game initially.
 */
function init() {
    // Populate the body tag.
    HtmlBuilder.populate();

    // Create a game object.
    const game = new Game();

    // Start the game loop.
    game.start();
}