import Game from "./Game";
import "./styles.scss";

// Create a game object
const game = new Game();

// Debug stuff
window.unlockGameObject = () => {window.Game = game}

// Start the game loop.
game.start();