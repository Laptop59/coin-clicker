import Effect, { EffectType } from "./Effect";
import Game from "./Game";

/**
 * An object that represents all the necessary information of a save.
 */
interface SaveObject {
    /**
     * The number of coins owned at the time of save.
     */
    coins: number,

    /**
     * The total number of coins made at the time of save.
     */
    totalCoins: number,

    /**
     * The amount of each building owned by the player at the time of save.
     */
    buildings: {[key: string]: number},

    /**
     * The bought upgrades at the time of save.
     */
    bought: string[],

    /**
     * The achievements achieved by the player at the time of save.
     */
    achievements: string[],

    /**
     * The total number of coins made from each building.
     */
    total: {[key: string]: number},

    /**
     * The number of clicks done by the player at the time of save.
     */
    clicks: number,

    /**
     * The time at which the player created their save.
     */
    startDate: Date,

    /**
     * The number of falling coins destroyed by the player via clicking at the time of save.
     */
    coinsDestroyed: number,

    /**
     * The effects that the player was undergoing at the time of save.
     */
    effects: SimplifiedEffects[]
}

/**
 * A interface that represents only the data of an effect.
 */
interface SimplifiedEffects {
    id: string,
    duration: number
}

/**
 * This class manages saves.
 */
class SaveManager {
    /**
     * A reference to the current game.
     */
    game: Game;

    /**
     * The suggested name of the file (for save).
     */
    SUGGESTED = "Coin Clicker Save.txt";

    /**
     * Whether the save code should be encrypted (with a non-standard algorithm).
     */
    encryptedMode = false;

    /**
     * Creates a new `SaveManager`.
     * @param game A reference to the current game.
     */
    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Generates save text based on the game instance.
     * @returns The save text.
     */
    generateText() {
        const obj = this.generateObject(this.game);
        const unText = this.convertToSections(obj);
        const text = this.encrypt(unText);

        return text;
    }

    /**
     * Generates an intermediate-save object basen on the game instance.
     * @param g A reference to the current game.
     * @returns the intermediate-save object.
     */
    generateObject(g: Game): SaveObject {
        return {
            coins: g.coins,
            totalCoins: g.totalCoins,
            buildings: <SaveObject["buildings"]>g.buildings,
            bought: g.bought,
            achievements: g.achievements,
            total: <SaveObject["total"]>g.total,
            clicks: g.clicks,
            startDate: g.startDate,
            coinsDestroyed: g.coinsDestroyed,
            effects: this.simplifyEffects(g.effects)
        }
    }

    /**
     * Simplifies an array of effects.
     * @param effects Effects to simplify.
     * @returns An array of simplified effects.
     */
    simplifyEffects(effects: Effect[]): SimplifiedEffects[] {
        return effects.map(e => ({id: e.type, duration: e.duration}));
    }

    /**
     * Desimplifies an array of simplified effects.
     * @param effects Effects to desimplify.
     * @returns An array of desimplified effects.
     */
    desimplifyEffects(effects: SimplifiedEffects[]): Effect[] {
        return effects.map(e => new Effect(e.id as Effect["type"], e.duration, this.game))
    }

    /**
     * Creates a new save object and returns it.
     * @returns The clean-slate object.
     */
    generateFreshObject(): SaveObject {
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

    /**
     * Loads save text into the game instance.
     * @param code 
     * @returns There are three possible return values:\
     * |Returned|Description|
     * |:-------------|:--------------------------------------------------|
     * |`null`| It was rejected and already known to not work at all. It was not done by accident.|
     * |`false`| It was rejected but had to be checked before.|
     * |`true`| It was accepted and is loaded into the game.|
     */
    loadText(code: string) {
        if (code === "coinclick") return null;
        try {
            const string = this.decrypt(code);

            if (string === null) {
                throw new TypeError("Decryption of the save failed.");
            }

            const data = this.convertToObject(string);
            this.loadObject(data);

            return true;
        } catch(e) {
            console.error("Game data couldn't be loaded: ", e)
            return false;
        }
    }

    /**
     * Loads a save-object into the game instance.
     * @param data The save-object.
     */
    loadObject(data: SaveObject) {
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
            // We need this, otherwise TypeScript will throw this error:
            // T7053:
            // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'SaveObject'.
            // No index signature with a parameter of type 'string' was found on type 'SaveObject'.
            // @ts-expect-error
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
                        this.game.addEffect(<EffectType>e.id, e.duration);
                    }
                    break;
                default:
                    // @ts-expect-error
                    this.game[key] = data[key];
            }
        }
    }

    /**
     * Converts a save-object into sections.
     * @param obj Save-object to convert.
     * @returns Sections of the object.
     */
    convertToSections(obj: SaveObject) {
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

    /**
     * Splits text into sections.
     * @param str Section text to convert to array.
     * @returns Array of sections
     */
    textToArray(str: string) {
        if (!str) return [];
        return str.split(";");
    }

    /**
     * Converts simplified effects into text.
     * @param effects Effects to convert.
     * @returns Resulting text.
     */
    effectsToText(effects: SimplifiedEffects[]) {
        return effects.map(({id, duration}) => id + ";" + duration).join(";");
    }

    /**
     * Converts text into key-pairs.
     * @param str Text to convert.
     * @returns Keypairs of the text.
     */
    textToKeypairs(str: string) {
        if (str === "") return {};
        // Always {...key: number,...}
        const fragments = str.split(";");
        const obj: {[key: string]: number} = {};
        for (let i = 0; i < fragments.length; i += 2) {
            const [key, value] = [fragments[i], fragments[i + 1]];
            if (!key) continue;
            obj[key] = parseFloat(value);
        }
        return obj;
    }

    /**
     * Asserts a certain boolean expression. If it evaluates to a `falsy` value, an assertion error is thrown.
     * @param bool The expression
     */
    assert(bool: boolean) {
        if (!bool) throw new Error("Assertion failed.");
    }

    /**
     * Converts decrypted save text into a save-object
     * @param str Save text to convert.
     * @returns A save-object.
     */
    convertToObject(str: string) {
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
                    this.assert(!!obj.buildings);
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
                    this.assert(!!obj.total);
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

    /**
     * Converts text into simplified effects
     * @param str Text to convert.
     * @returns The resulting simplified effects.
     */
    textToEffects(str: string) {
        const fragments = str.split(";");
        let effects = [];

        for (let i = 0; i < fragments.length; i += 2) {
            const [id, duration] = [fragments[i], fragments[i + 1]];
            if (!id) continue;
            effects.push({id, duration: parseFloat(duration)});
        }

        return effects;
    }

    /**
     * Converts an array of sections into text.
     */
    arrayToText(arr: string[]) {
        return arr.join(";");
    }

    /**
     * Converts key-pairs into text.
     * @param obj Key-pairs to convert.
     * @returns The resulting object.
     */
    keypairsToText(obj: {[key: string]: number}) {
        return Object.entries(obj).map(([k, v]) => k + ";" + v).join(";");
    }

    /**
     * Encrypts decrypted save text. Does nothing if `encryptedMode` is `false`.
     * @param text Save text to encrypt.
     * @returns Encrypted save text.
     */
    encrypt(text: string) {
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

    /**
     * Decrypts encrypted save text. Does nothing if `encryptedMode` is `false`.
     * @param text Save text to decrypt.
     * @returns Decrypted save text.
     */
    decrypt(text: string) {
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

    /**
     * Loads a save from a file. A file picker will open.
     */
    loadFromFile() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".txt");
        input.addEventListener('change', async () => {
            const {files} = input;

            if (files && files.length) {
                const file = files[0];

                const text = await file.text();
                
                // We can attempt to load it.
                this.loadText(text);
            }
        });

        input.click();
    }

    /**
     * Saves the code into a file.
     * @param code The code to save.
     */
    async saveToFile(code: string) {
        // We can use the File System API if available.
        // @ts-ignore
        // We need @ts-ignore to not throw an error; this API does not exist in Firefox and exists in Chrome.
        if (window.showSaveFilePicker) {
            try {
                // @ts-ignore
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

    /**
     * Downloads a file of code.
     * @param code The code to download.
     */
    saveToDownloads(code: string) {
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

    /**
     * Saves save text into local storage.
     * @returns If saving to local storage was successful.
     */
    saveToStorage() {
        const code = this.generateText();
        try {
            window.localStorage.setItem("coin-clicker.save", code);
        } catch(e) {
            return false;
        }
        return true;
    }

    /**
     * Loads save text from local storage.
     */
    loadFromStorage() {
        const data = window.localStorage.getItem("coin-clicker.save");
        if (data) this.loadText(data);
    }

    /**
     * Wipe all game data, and start fresh.
     */
    wipe() {
        const obj = this.generateFreshObject();
        this.loadObject(obj);
        this.saveToStorage();
    }
}

export default SaveManager;