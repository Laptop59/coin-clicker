class SaveManager {
    game

    constructor(game) {
        this.game = game;
    }

    generateText() {
        const obj = this.generateObject(this.game);
        const unText = this.convertToSections(obj);
        const text = this.encrypt(unText);
        const lol = this.decrypt(text);

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

    loadText() {
        
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

    encrypt(text) {
        const base64 = btoa(text);

        // Spec:
        // 1234abcd5678efgh9012ijkl

        let encrypted = "coin";
        for (let i = 0; i < base64.length; i++) {
            if (i % 6 < 2) {
                encrypted += base64.charCodeAt(i).toString(16);
            } else {
                encrypted += base64.charAt(i);
            }
        }
        encrypted += "click"

        return encrypted;
    }

    decrypt(text) {
        if (text.startsWith("coin") && text.endsWith("click")) {
            const start = text.slice(4, -5);
            let decrypted = "";
            for (let i = 0; i < start.length; i += 2) {
                const chars = (start[i] || "") + (start[i + 1] || "");
                if (i % 8 < 4) {
                    decrypted += String.fromCharCode(parseInt(chars, 16));
                } else {
                    decrypted += chars;
                }
            }

            return atob(decrypted);
        }
    }
}

export default SaveManager;