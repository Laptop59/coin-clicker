class SaveManager {
    game

    constructor(game) {
        this.game = game;
    }

    generateText() {
        const obj = this.generateObject(this.game);
        return JSON.stringify(obj);
    }

    generateObject() {
        const g = this.game;
        return {
            coins: g.coins,
            totalCoins: g.totalCoins,
            buildings: g.buildings,
            bought: g.bought,
            achievements: g.achievements,
            total: g.total,
            clicks: g.clicks
        }
    }
}

export default SaveManager;