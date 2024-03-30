import Game from "./Game";
import "./styles.scss";
import HtmlBuilder from "./HtmlBuilder";
import Translator from "./Translator";

init();

/**
 * Start the game initially.
 */
function init() {
    // Create a new translator.
    const translator = new Translator();

    // Populate the body tag.
    HtmlBuilder.populate(translator);

    // Create a game object.
    const game = new Game(translator);

    // Add a way to access the game, for now.
    // @ts-ignore
    window.Game = game;

    // Start the game loop.
    game.start();
}