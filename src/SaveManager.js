import Effect from "./Effect";

class SaveManager {
    game
    SUGGESTED = "Coin Clicker Save.txt";
    encryptedMode = true
    constructor(game) {
        this.game = game;
    }

    generateText() {
        const obj = this.generateObject(this.game);
        const unText = this.convertToSections(obj);
        const text = this.encrypt(unText);

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
            clicks: g.clicks,
            startDate: g.startDate,
            coinsDestroyed: g.coinsDestroyed,
            effects: this.simplifyEffects(g.effects)
        }
    }

    simplifyEffects(effects) {
        return effects.map(e => ({id: e.type, duration: e.duration}));
    }

    desimplifyEffects(effects) {
        return effects.map(e => new Effect(e.id, e.duration, this.game))
    }

    generateFreshObject() {
        return {
            coins: 0,
            totalCoins: 0,
            buildings: {},
            bought: [],
            achievements: [],
            total: {},
            clicks: 0,
            startDate: new Date(),
            coinsDestroyed: 0,
            effects: []
        }
    }

    loadText(code) {
        if (code === "coinclick") return null;
        try {
            const string = this.decrypt(code);

            const data = this.convertToObject(string);
            this.loadObject(data);

            return true;
        } catch(e) {
            console.error("Game data couldn't be loaded: ", e)
            return false;
        }
    }

    loadObject(data) {
        const loadIn = [
            "coins",
            "totalCoins",
            "buildings",
            "bought",
            "achievements",
            "total",
            "clicks",
            "startDate"
        ]

        const noKey = loadIn.filter(key => {
            const obj = data[key];
            return (typeof obj === "number" && isNaN(obj)) || obj === null || obj === undefined
        });
        if (noKey.length) {
            throw new Error("Not every key was found. \n" + noKey.join(", "))
        }

        for (const key of Object.keys(data)) {
            switch (key) {
                case "effects":
                    this.game.effects = [];
                    for (const e of data.effects) {
                        this.game.addEffect(e.id, e.duration);
                    }
                    break;
                default:
                    this.game[key] = data[key];
            }
        }
    }

    convertToSections(obj) {
        let text = "";

        text += "c:" + obj.coins + ":";
        text += "tc:" + obj.totalCoins + ":";
        text += "bu:" + this.keypairsToText(obj.buildings) + ":";
        text += "bo:" + this.arrayToText(obj.bought) + ":";
        text += "a:" + this.arrayToText(obj.achievements) + ":";
        text += "t:" + this.keypairsToText(obj.total) + ":";
        text += "cl:" + obj.clicks + ":";
        text += "s:" + obj.startDate.getTime() + ":";
        text += "cd:" + obj.coinsDestroyed + ":";
        text += "e:" + this.effectsToText(obj.effects) + ":";
        
        return text;
    }

    textToArray(str) {
        if (!str) return [];
        return str.split(";");
    }

    effectsToText(effects) {
        return effects.map(({id, duration}) => id + ";" + duration).join(";");
    }

    textToKeypairs(str) {
        if (str === "") return {};
        // Always {...key: number,...}
        const fragments = str.split(";");
        const obj = {};
        for (let i = 0; i < fragments.length; i += 2) {
            const [key, value] = [fragments[i], fragments[i + 1]];
            if (!key) continue;
            obj[key] = parseFloat(value);
        }
        return obj;
    }

    assert(bool) {
        if (!bool) throw new Error("Assertion failed.");
    }

    convertToObject(str) {
        const fragments = str.split(":");
        const obj = this.generateFreshObject();
        for (let i = 0; i < fragments.length; i += 2) {
            const [key, value] = [fragments[i], fragments[i + 1]];
            switch (key) {
                case "c":
                    // Coin amount.
                    obj.coins = parseFloat(value);
                    this.assert(!isNaN(obj.coins));
                    break;
                case "tc":
                    // Total coins
                    obj.totalCoins = parseFloat(value);
                    this.assert(!isNaN(obj.totalCoins));
                    break;
                case "bu":
                    // Buildings
                    obj.buildings = this.textToKeypairs(value);
                    this.assert(obj.buildings);
                    break;
                case "bo":
                    // Bought upgrades
                    obj.bought = this.textToArray(value);
                    this.assert(Array.isArray(obj.bought));
                    break;
                case "a":
                    // Achievements
                    obj.achievements = this.textToArray(value);
                    this.assert(Array.isArray(obj.achievements));
                    break;
                case "t":
                    // Total coins (from buildings)
                    obj.total = this.textToKeypairs(value);
                    this.assert(obj.total);
                    break;
                case "cl":
                    // Clicks
                    obj.clicks = parseInt(value);
                    this.assert(!isNaN(obj.clicks));
                    break;
                case "s":
                    // Start Date
                    obj.startDate = new Date(parseInt(value));
                    break;
                case "cd":
                    // Coins destroyed
                    obj.coinsDestroyed = parseInt(value);
                    break;
                case "e":
                    // Effects
                    obj.effects = this.textToEffects(value);
                case "":
                    break;
                default:
                    // Invalid ID found.
                    throw new Error("Invalid ID " + key + " found.")
            }
        }
        return obj;
    }

    textToEffects(str) {
        const fragments = str.split(";");
        let effects = [];

        for (let i = 0; i < fragments.length; i += 2) {
            const [id, duration] = [fragments[i], fragments[i + 1]];
            if (!id) continue;
            effects.push({id, duration: parseFloat(duration)});
        }

        return effects;
    }

    arrayToText(arr) {
        return arr.join(";");
    }

    keypairsToText(obj) {
        return Object.entries(obj).map(([k, v]) => k + ";" + v).join(";");
    }

    encrypt(text) {
        if (!this.encryptedMode) return text;
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
        if (!this.encryptedMode) return text;
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
        } else {
            return null;
        }
    }

    loadFromFile() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".txt");
        input.addEventListener('change', async () => {
            const {files} = input;

            if (files.length) {
                const file = files[0];

                const text = await file.text();
                
                // We can attempt to load it.
                this.loadText(text);
            }
        });

        input.click();
    }

    async saveToFile(code) {
        // We can use the File System API if available.
        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: this.SUGGESTED,
                    types: [
                        {
                            description: "Coin Clicker Save",
                            accept: {
                                "text/plain": [".txt"]
                            }
                        }
                    ]
                })

                const writable = await handle.createWritable();
                writable.write(code);
                writable.close();
            } catch(e) {
                if (e instanceof DOMException && e.message.includes("request is not allowed")) {
                    this.saveToDownloads(code);
                }
                console.error("Could not save via File System API", e);
            }
        } else {
            this.saveToDownloads(code);
        }
    }

    saveToDownloads(code) {
        const blob = new Blob(code.split("\n"), {
            type: 'text/plain'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = this.SUGGESTED;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    saveToStorage() {
        const code = this.generateText();
        try {
            window.localStorage.setItem("coin-clicker.save", code);
        } catch(e) {
            return false;
        }
        return true;
    }

    loadFromStorage() {
        const data = window.localStorage.getItem("coin-clicker.save");
        if (data) this.loadText(data);
    }

    wipe() {
        const obj = this.generateFreshObject();
        this.loadObject(obj);
        this.saveToStorage();
    }
}

export default SaveManager;