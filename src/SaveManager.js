class SaveManager {
    game
    SUGGESTED = "Coin Clicker Save.txt";

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

    loadText(code) {
        if (code === "coinclick") return null;
        try {
            const string = this.decrypt(code);

            const data = this.convertToObject(string);

            const loadIn = [
                "coins",
                "totalCoins",
                "buildings",
                "bought",
                "achievements",
                "total",
                "clicks"
            ]

            const noKey = loadIn.filter(key => {
                const obj = data[key];
                return (typeof obj === "number" && isNaN(obj)) || obj === null || obj === undefined
            });
            if (noKey.length) {
                throw new Error("Not every key was found. \n" + noKey.join(", "))
            }

            for (const key of loadIn) {
                this.game[key] = data[key];
            }

            return true;
        } catch(e) {
            console.error("Game data couldn't be loaded: ", e)
            return false;
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

    textToArray(str) {
        if (!str) return [];
        return str.split(";")
    }

    textToKeypairs(str) {
        if (str === "") return {};
        // Always {...key: number,...}
        const fragments = str.split(";");
        const obj = {};
        for (let i = 0; i < fragments.length; i += 2) {
            const [key, value] = [fragments[i], fragments[i + 1]];
            obj[key] = parseFloat(value);
        }
        return obj;
    }

    assert(bool) {
        if (!bool) throw new Error("Assertion failed.");
    }

    convertToObject(str) {
        const fragments = str.split(":");
        const obj = {};
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
                case "":
                    break;
                default:
                    // Invalid ID found.
                    throw new Error("Invalid ID " + key + " found.")
            }
        }
        return obj;
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
}

export default SaveManager;