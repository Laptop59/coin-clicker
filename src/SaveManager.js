class SaveManager {
    game

    constructor(game) {
        this.game = game;
    }

    generateText() {
        const obj = this.generateObject(this.game);
        const text = this.convertToSections(obj);
        return text;
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

    convertToSections(obj) {
        let text = "";

        text += "c:" + obj.coins + ":";
        text += "tc:" + obj.totalCoins + ":";
        text += "bu:" + this.keypairsToText(obj.buildings) + ":";
        text += "bo:" + obj.bought.join(";") + ":";
        text += "a:" + obj.achievements.join(";") + ":";
        text += "t:" + this.keypairsToText(obj.total) + ":";
        text += "cl:" + obj.clicks + ":";
        
        return text;
    }

    keypairsToText(obj) {
        return Object.entries(obj).map(([k, v]) => k + ";" + v + ";").join("");
    }
}

export default SaveManager;