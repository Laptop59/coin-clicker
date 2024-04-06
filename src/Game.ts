import BIG_COIN_SRC from "./images/coin_button.png";
import BLANK_SRC from "./images/blank_icon.png";
import buildings, { Building } from "./Buildings";
import upgrades, { Upgrade } from "./Upgrades";
import categorizedAchievements, { achievements, Achievement } from "./Achievements";
import FallingCoin from "./FallingCoin";
import SaveManager from "./SaveManager";
import CoinImager from "./CoinImager";
import Effect, { EffectType } from "./Effect";
import Translator from "./Translator";
import { assert, selector, selectorAll } from "./Selector";
import audioClick from "./sounds/coin.wav";

/**
 * Describes the medium in which the save is saved or load.
 */
enum SaveMedium {
    TEXT = 0,
    FILE = 1
}

/**
 * Describes a tab type.
 */
enum Tab {
    STATS = 0,
    OPTIONS = 1
}

/**
 * Represents a buy mode.
 */
type BuyMode = 1 | 10 | 100;

/**
 * This class represents an instance of Coin Clicker.
 */
class Game {
    /**
     * The amount of coins owned by the player.
     */
    coins = 0

    /**
     * The total amount of coins made by the player.
     */
    totalCoins = 0

    /**
     * The amount of coins made by the player per click.
     */
    coinsPerClick = 1

    /**
     * The amount of coins made by the player per second.
     */
    coinsPerSec = 0

    /**
     * The previous date in which delta was calculated.
     */
    oldTime = +new Date()

    /**
     * Tells if music is currently playing.
     */
    playingMusic = true;

    /**
     * The start date of the player.
     */
    startDate = new Date();

    /**
     * The amount of coins destroyed by the player (the coins falling down).
     */
    coinsDestroyed = 0;

    /**
     * The state of readiness of the game.
     */
    ready = 0;

    /**
     * The canvas instance owned by the game.
     */
    canvas: HTMLCanvasElement;

    /**
     * The 2D context of the canvas.
     */
    ctx: CanvasRenderingContext2D;

    /**
     * Size of the coin.
     */
    coinSize = 1.5

    /**
     * Size of the icon.
     */
    iconSize = 18;

    /**
     * Images of the game.
     */
    images: { [key: string]: HTMLImageElement } = {};

    /**
     * Buildings owned by the player.
     */
    buildings: { [key: string]: number } = {};

    /**
     * The upgrades bought by the player.
     */
    bought: string[] = [];

    /**
     * Number of ticks done by the game.
     */
    ticks = 0;

    /**
     * Indicates the buying power of buildings chosen by the user.
     */
    buyMode: BuyMode = 1;

    /**
     * The selected building which is displayed in its tooltip.
     */
    selectedBuilding: string | null = null;

    /**
     * The selected upgrade which is displayed in its tooltip.
     */
    selectedUpgrade: string | null = null;;

    /**
     * The selected achievement which is displayed in its tooltip.
     */
    selectedAchievement: string | null = null;

    /**
     * The selected effect which is displayed in its tooltip.
     */
    selectedEffect: EffectType | null = null;

    /**
     * The current x-position of the mouse.
     */
    mouseX = 0;

    /**
     * The current y-position of the mouse.
     */
    mouseY = 0;

    /**
     * Multiplier caused by achievements.
     */
    achieveMultiplier = 1;

    /**
     * Translator owned by the game.
     */
    translator: Translator;

    /**
     * Describes the color of buy modes (powers).
     */
    buyModeColours: { [key in BuyMode]: string } = {
        1: "white",
        10: "#4c4",
        100: "#4cc"
    };

    /**
     * The rates of the buildings, but values are in the format\
     * `[(number of coins made per click), (number of coins made per sec)]`.
     */
    rates: { [key: string]: [number, number] } = {};

    /**
     * The total coins made by the buildings, but values are in the format\
     * `[(number of total coins made per click), (number of total coins made per sec)]`.
     */
    total: { [key: string]: number } = {};

    /**
     * The array of falling coins.
     */
    fallingCoins: FallingCoin[] = [];

    /**
     * The stats which can be displayed.
     */
    stat: { [key: string]: () => number | string } = {};
    clicks = 0

    /**
     * The current effects.
     */
    effects: Effect[] = [];

    /**
     * All the achievements achieved by the player.
     */
    achievements: string[] = [];

    /**
     * The index of the selected tab:\
     * |Tab            |Index|Selected Tab|
     * |:--------------|:----|:-----------|
     * |   Tab.STATS   |  0  |   Stats    |
     * |  Tab.OPTIONS  |  1  |   Options  |
     */
    selectedTab: Tab = Tab.STATS;

    /**
     * Current multiplier of coin production.
     */
    multiplier = 1;

    /**
     * Unboosted multiplier of coin production, i.e. *the multiplier without accounting effects*.
     */
    unboostedMultiplier = 1;

    /**
     * Boosting multiplier of coin production, i.e. *the multiplier caused by effects*.
     */
    boostMultiplier = 1;

    /**
     * The amount of time since a falling coin spawned.
     */
    timeSinceCoinSpawn = 0;

    /**
     * The interval of falling coins spawning.
     */
    coinSpawnInterval = 1000;

    /**
     * The instance of the `SaveManager` of the game.
     */
    saveManager: SaveManager;

    /**
     * The instance of the `CoinImager` of the game.
     */
    coinImager: CoinImager;

    /**
     * The interval of autosave in ticks.\
     * *Usually*, **60 ticks** = **1 second**
     */
    static get AUTOSAVE_INTERVAL() {
        return 720;
    }

    /**
     * Play sounds or not?
     */
    playSounds: boolean = true;

    /**
     * Creates a new `Game` object. This is used to represent Coin Clicker, as a game object.
     * @param translator A translator instance.
     */
    constructor(translator: Translator) {
        this.translator = translator;
        // Get a reference to a canvas.
        this.canvas = <HTMLCanvasElement>document.getElementsByClassName("canvas")[0];
        this.canvas.addEventListener("click", this.canvasClick.bind(this));

        this.ctx = assert(this.canvas.getContext("2d"));

        // Add an event for mousemove so that we can track the mouse's position.
        document.addEventListener("mousemove", this.setMouse.bind(this))
        document.addEventListener("click", this.playMusic.bind(this));

        // Create the managers.
        this.saveManager = new SaveManager(this);
        this.coinImager = new CoinImager();

        // Setup some data.
        this.loadImages();
        this.setupData();
        this.registerStats();

        // Add click events to the button in the `Options` tab.
        selector(".saveGame").addEventListener("click", this.saveToStorage.bind(this));
        selector(".wipeGame").addEventListener("click", this.wipeSave.bind(this))

        selector(".saveGameText").addEventListener("click", this.saveGame.bind(this, SaveMedium.TEXT))
        selector(".saveGameFile").addEventListener("click", this.saveGame.bind(this, SaveMedium.FILE))

        selector(".loadGameText").addEventListener("click", this.loadGame.bind(this, SaveMedium.TEXT))
        selector(".loadGameFile").addEventListener("click", this.loadGame.bind(this, SaveMedium.FILE))

        selector(".changeLanguage").addEventListener("click", this.changeLanguage.bind(this));

        selector(".loopMusic").addEventListener("change", () => {
            this.setPlayingMusic((<HTMLInputElement>selector(".loopMusic")).checked, true);
        });

        selector(".playSounds").addEventListener("change", () => {
            this.setPlayingSound((<HTMLInputElement>selector(".playSounds")).checked, true);
        });

        // If the player uses the save key combination (CTRL + S), we want it to save.
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();

                this.saveToStorage();
            }
        });

        // If the page is reloaded or closed, we want to save the game.
        window.addEventListener("beforeunload", this.saveToStorage.bind(this));

        // Load the save from local storage if it exists.
        this.saveManager.loadFromStorage();

        // Finally, increase the ready state by 1, and maybe start the game.
        if (++this.ready > 1) this.doStart();
    }

    /**
     * Setups some data.
     */
    setupData() {
        // Add some icons, and elements.
        document.getElementsByClassName("coins-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 32));
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
        document.getElementsByClassName("cps-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
        selector(".upgrade-tooltip .cost").appendChild(this.makeIcon(0, 0, 20));
        selector(".upgrade-tooltip .cost").appendChild(document.createElement("span"));

        // Add click events to the tabs.
        selector('.tab-wrapper button[type="stats"]').addEventListener("click", this.setSelectedTab.bind(this, 0));
        selector('.tab-wrapper button[type="options"]').addEventListener("click", this.setSelectedTab.bind(this, 1));

        // Generate some elements from upgrades.
        for (let u of upgrades.sort((a, b) => a.cost - b.cost)) {
            const elem = this.generateUpgrade(u);
            document.getElementsByClassName("upgrades")[0].appendChild(elem);
            elem.addEventListener("click", this.clickUpgrade.bind(this, u.id));
            elem.addEventListener("mouseout", () => this.selectedUpgrade = null)
            elem.addEventListener("mouseover", () => this.selectedUpgrade = u.id);
        }

        // Generate some elements from buildings.
        for (let b of buildings) {
            // Create an element.
            const elem = this.buildingElement(b);
            elem.getElementsByTagName("div")[0].className = "building-" + b.id;
            document.getElementsByClassName("buildings")[0].appendChild(elem);
            elem.addEventListener("click", this.clickBuilding.bind(this, b.id))
            elem.addEventListener("mouseleave", () => this.selectedBuilding = null)
            elem.addEventListener("mouseenter", () => this.selectedBuilding = b.id);
        }

        // Generate some elements based on categories of achievements.
        for (let [cn, cv] of Object.entries(categorizedAchievements)) {
            const category = document.createElement("div");
            category.className = "category category-" + cn;
            category.innerHTML = this.translator.formatAchievementCategory(cn);
            selector("achievements").appendChild(category);
            for (let a of cv) {
                const imgdiv = document.createElement("div");
                imgdiv.className = "imgdiv achievement-" + a.id;
                imgdiv.appendChild(this.makeIcon(0, 4, 64));

                imgdiv.addEventListener("mouseleave", () => this.selectedAchievement = null);
                imgdiv.addEventListener("mouseenter", () => this.selectedAchievement = a.id);

                selector(".work-wrapper").addEventListener("mouseover", () => this.selectedAchievement = null);

                selector("achievements").appendChild(imgdiv);
            }
        }

        // Add click event listeners to buy-mode buttons.
        selectorAll(".buy-bar button").forEach(button => {
            button.addEventListener("click", this.changeBuyMode.bind(this, +assert(button.getAttribute("value"))))
        })

        // Easy to use elements
        // <coin></coin> = coin icon
        // <icon x="X" y="Y"></icon> = other icon
        selectorAll("coin").forEach(coin => {
            coin.appendChild(this.makeIcon(0, 0, this.iconSize))
        });

        selectorAll("icon").forEach(icon => {
            icon.appendChild(this.makeIcon(+assert(icon.getAttribute("x")), +assert(icon.getAttribute("y")), this.iconSize))
        });

        // By default, buy mode is 1.
        this.changeBuyMode(1);
    }

    /**
     * Register all necessary **stat**istic**s**.
     */
    registerStats() {
        this.registerStat("ownedCoins", () => this.coins);
        this.registerStat("totalCoins", () => this.totalCoins);
        this.registerStat("rawCoinsPerClick", () => this.rawCoinsPerClick);
        this.registerStat("rawCoinsPerSec", () => this.rawCoinsPerSec);
        this.registerStat("clicks", () => this.clicks);
        this.registerStat("multiplier", () => Math.round(this.multiplier * 100))
        this.registerStat("achievementMultiplier", () => Math.round(this.achieveMultiplier * 100))
        this.registerStat("unlockedAchievements", () => this.achievements.length);
        this.registerStat("totalAchievements", () => achievements.length);
        this.registerStat("buildings", () => this.buildingsNumber);
        this.registerStat("startDate", () => this.formatDate(this.startDate));
        this.registerStat("coinsDestroyed", () => this.coinsDestroyed)
    }

    /**
     * Opens a dialog, asking the player to confirm if they want to wipe their save (i.e. *deleting* their save).
     */
    wipeSave() {
        const elem = document.createElement("div");
        const yes = this.translator.format("dialogs.wipe.yes");
        const no = this.translator.format("dialogs.wipe.no");
        this.addToElement(elem, "p", this.translator.format("dialogs.wipe.warning_1"))
        this.showDialog(this.translator.format("dialogs.wipe.wipe_save"), elem, [yes, no])
            .then(opt => {
                if (!opt) {
                    // Yes
                    this.addToElement(elem, "p", this.translator.format("dialogs.wipe.warning_2"))
                    this.showDialog("Wipe Save", elem, [yes, no]).then(opt => {
                        if (!opt) {
                            this.saveManager.wipe();
                            this.saveManager.wipe();
                        }
                    })
                }
            });
    }

    /**
     * Saves the save.
     * @param medium The medium to which the save is saved.
     */
    saveGame(medium: SaveMedium) {
        const code = this.saveManager.generateText();

        switch (medium) {
            case SaveMedium.FILE:
                this.saveManager.saveToFile(code);
                break;
            case SaveMedium.TEXT:
                const saveDiv = document.createElement("div");
                this.addToElement(saveDiv, "p", this.translator.format("dialogs.save.info"));

                const textarea = this.addToElement(saveDiv, "textarea");
                textarea.setAttribute("readonly", "true");
                textarea.setAttribute("unresizable", "true");

                textarea.value = code;

                this.addToElement(saveDiv, "br")
                this.showDialog(this.translator.format("dialogs.save.title"), saveDiv);
                break;
        }
    }

    /**
     * Loads a save.
     * @param medium The medium from which the save is loaded from.
     */
    async loadGame(medium: SaveMedium) {
        switch (medium) {
            case SaveMedium.FILE:
                this.saveManager.loadFromFile();
                break;
            case SaveMedium.TEXT:
                const loadDiv = document.createElement("div");
                this.addToElement(loadDiv, "p", this.translator.format("dialogs.load.info"));

                const textarea = this.addToElement(loadDiv, "textarea");
                textarea.setAttribute("unresizable", "true");

                this.addToElement(loadDiv, "br")

                const error = this.addToElement(loadDiv, "span");
                error.setAttribute("color", "red");

                while (true) {
                    const index = await this.showDialog( this.translator.format("dialogs.load.title"), loadDiv, [ this.translator.format("dialogs.load.load"),  this.translator.format("dialogs.load.cancel")], i => i === 1)
                    if (index === 0) {
                        // Load
                        const result = this.saveManager.loadText(textarea.value);
                        if (result) {
                            (<HTMLElement>selector(".dialog")).style.visibility = "hidden";
                            break;
                        } else {
                            selector(".dialog span[color=\"red\"]").innerHTML =
                                (result === null ? this.translator.format("dialogs.load.haha_nice_try") : this.translator.format("dialogs.load.invalid_save_code"));
                        }
                    } else break;
                }
                break;
        }
    }

    /**
     * Creates an element with some `innerHTML`, if necessary, and then it is appended to another element.
     * @param div The element.
     * @param tagName The tag name of the newly created element.
     * @param innerHTML The inner HTML of the newly created element.
     * @returns The newly created element.
     */
    addToElement<K extends keyof HTMLElementTagNameMap>(div: HTMLElement, tagName: K, innerHTML = "") {
        const element = document.createElement(tagName);
        if (innerHTML) element.innerHTML = innerHTML;
        div.appendChild(element);
        return element;
    }

    /**
     * Shows a dialog to the player.
     * @param title The title of the dialog.
     * @param element The element to put the dialog in.
     * @param buttons The buttons to put in the dialog.
     * @param stay Should the dialog close with a particular index?\
     * **Default Behaviour**: the dialog always closes.
     * @returns A promise which resolves with the index of the button the player clicked, when the player check a button.
     */
    showDialog(title: string, element: HTMLElement, buttons = [this.translator.format("dialogs.ok")], stay?: (index: number) => boolean) {
        return new Promise(resolve => {
            selectorAll(".dialogButton").forEach(oldButton => {
                assert(oldButton.parentElement).removeChild(oldButton);
            });
            for (let index = 0; index < buttons.length; index++) {
                const text = buttons[index];
                const button = document.createElement("button");
                button.textContent = text;
                button.className = "dialogButton"
                button.onclick = () => {
                    if (!stay || stay(index)) {
                        (<HTMLElement>selector(".dialog")).style.visibility = "hidden";
                    }
                    resolve(index)
                };
                element.append(button);
            }

            selector(".dialog .box").innerHTML = "";

            const titleDiv = this.addToElement(<HTMLElement>selector(".dialog .box"), "div");

            titleDiv.className = "title";
            titleDiv.textContent = title;

            element.className = "content";

            selector(".dialog .box").appendChild(titleDiv);
            selector(".dialog .box").appendChild(element);
            (<HTMLElement>selector(".dialog")).style.visibility = "visible";
        });
    }

    /**
     * Get the current coin production multiplier.
     * This method updates certain variables.
     * @returns the multiplier
     */
    getCurrentMultiplier() {
        this.achieveMultiplier = Math.pow(1.15, this.achievements.length);
        const m = [
            1,
            this.achieveMultiplier
        ];
        this.unboostedMultiplier = m.reduce((a, b) => a * b);

        this.boostMultiplier = this.getBoost();
        this.multiplier = this.unboostedMultiplier * this.boostMultiplier;
        return this.multiplier;
    }

    /**
     * Get the current coin production multiplier due to effects.
     * @returns the multiplier
     */
    getBoost() {
        let boost = 1;
        for (const effect of this.effects) {
            boost *= effect.getEffect();
        }
        return boost;
    }

    /**
     * Updates the `mouseX` & `mouseY` to the mouse's current position from the `mousemove` event.
     * @param e The event
     */
    setMouse(e: MouseEvent) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    /**
     * Load certain images.
     */
    loadImages() {
        this.images.big_coin = new Image();
        this.images.big_coin.src = BIG_COIN_SRC;
    }

    /**
     * Attempt to play looping music.
     */
    playMusic() {
        const audioElement = <HTMLAudioElement>selector('.music');

        if (this.playingMusic) {
            audioElement.play()
                        .catch(console.error)
        } else {
            audioElement.pause();
        }
    }
    
    /**
     * Set play music mode.
     * @param play Whether or not play music.
     * @param isEventListener Did this call occur due to a change event?
     */
    setPlayingMusic(play: boolean, isEventListener?: boolean) {
        this.playingMusic = play;
        if (!isEventListener) (<HTMLInputElement>selector(".loopMusic")).checked = play;
        this.playMusic();
    }

    /**
     * Set play sound mode.
     * @param play Whether or not play sounds.
     * @param isEventListener Did this call occur due to a change event?
     */
    setPlayingSound(play: boolean, isEventListener?: boolean) {
        this.playSounds = play;
        if (!isEventListener) (<HTMLInputElement>selector(".playSounds")).checked = play;
    }

    /**
     * Increases `ready` state by 1, and may start the game.
     */
    start() {
        if (++this.ready > 1) this.doStart();
    }

    /**
     * Actually starts the game loop.
     */
    private doStart() {
        // Start our tick functions.
        requestAnimationFrame(this.tickWithTryCatch.bind(this, +new Date()));
    }

    /**
     * Progress the game by a tick (usually in frequency of 60 Hz), with try/catch.
     * @param time The current date.
     */
    tickWithTryCatch(time: number) {
        try {
            this.tick(time);
            requestAnimationFrame(this.tickWithTryCatch.bind(this, +new Date()));
        } catch(e) {
            const elem = document.createElement("div");
            this.addToElement(elem, "p", this.translator.format("dialogs.error.info"));
            this.showDialog(this.translator.format("dialogs.error.fatal_error"), elem, [this.translator.format("dialogs.error.reload")], (_) => false).then(
                (_) => window.location.reload()
            );
            console.error("Unhandled error: ", e);
        }
        // requestAnimationFrame(this.tickWithTryCatch.bind(this, +new Date()));
    }

    /**
     * Progress the game by a tick (usually in frequency of 60 Hz).
     * @param time The current date.
     */
    tick(time: number) {
        this.ticks++
        // Find delta time.
        const delta = time - this.oldTime;
        this.timeSinceCoinSpawn += delta;
        this.oldTime = time;

        // Update some variables and text.
        this.updateVariables(delta / 1000);
        this.updateText();

        if (this.ticks % 3 === 0) {
            this.checkForNewAchievements();
            this.updateUpgrades();
        }

        // Autosave feature is handled here.
        if ((<HTMLInputElement>selector(".autosave")).checked && this.ticks % Game.AUTOSAVE_INTERVAL === 0) {
            this.saveToStorage();
        }

        this.resizeCanvas();
        this.animateCoin(delta);

        this.coinSpawnInterval = Math.max(100, 1000 / Math.log10(this.coins))
        if (this.coins <= 0) this.coinSpawnInterval = Infinity;

        if (this.timeSinceCoinSpawn > this.coinSpawnInterval) {
            // Spawn a coin.
            this.fallingCoins.push(new FallingCoin(this.canvas, this.coinImager, this))
            // set coins spawn to 0 instead of reducing it
            this.timeSinceCoinSpawn = 0;
        }

        if (this.ticks <= 1) {
            setTimeout((() =>
                selector(".loadScreen").className = "loadScreen loaded")
                , 1000);
        }
    }

    /**
     * Save the current state of the game into local storage.
     */
    saveToStorage() {
        if (this.saveManager.saveToStorage()) {
            document.body.setAttribute("saved", "1");
            setTimeout(() => document.body.setAttribute("saved", "0"), 750)
        }
    }

    /**
     * Checks if new achievements can be achieved with the current conditions.
     */
    checkForNewAchievements() {
        for (const a of achievements) {
            if (this.achievements.indexOf(a.id) >= 0) {
                const div = selector(".achievement-" + a.id);
                div.removeChild(div.children[0]);
                div.appendChild(this.makeIcon(...a.icon, 64))
            } else if (a.goal(this)) {
                this.achievements.push(a.id);
                this.achievementPopUp(a);
            } else {
                const div = selector(".achievement-" + a.id);
                div.removeChild(div.children[0]);
                div.appendChild(this.makeIcon(0, 4, 64))
            }
        }
        for (const [ck, cv] of Object.entries(categorizedAchievements)) {
            let unlocked = 0;
            for (const a of cv) {
                if (this.achievements.indexOf(a.id) >= 0) unlocked++;
            }

            let category = selector(".category-" + ck);
            category.setAttribute("unlocked", unlocked.toString());
            if (unlocked) {
                category.innerHTML = this.translator.formatAchievementCategory(ck) + "<span><p>" + this.translator.formatAchievementCategoryCount(unlocked.toString(), cv.length.toString()) + "</p>";
            } else {
                category.innerHTML = "???";
            }
        }
    }

    /**
     * Formats a date into this format:\
     * **Month** **DD**, **YYYY**
     * @param date Date to format.
     * @returns The formatted date as a string.
     */
    formatDate(date: Date) {
        // Note: English language code here has be moved to the languages/en_us.ts file.
        return this.translator.formatDate(date);
    }

    /**
     * Update text.
     */
    updateText() {
        const coinsHeader = document.getElementsByClassName("coins-header")[0];
        const textCoins = this.commify(this.coins, true);
        const big = (textCoins.length > 12 ? 1 : 0).toString();
        coinsHeader.setAttribute("big", big);
        coinsHeader.getElementsByTagName("span")[0].innerHTML = "" + textCoins;
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("span")[0].innerHTML = this.translator.format("coins.per_click", this.commify(this.mulCoinsPerClick));
        document.getElementsByClassName("cps-header")[0].getElementsByTagName("span")[0].innerHTML = this.coinsPerSec ? this.translator.format("coins.per_second", this.commify(this.mulCoinsPerSec)) : "";
        (<HTMLElement>document.getElementsByClassName("cps-header")[0]).style.visibility = this.coinsPerSec ? "" : "hidden";

        for (let building of buildings) {
            const elem = document.getElementsByClassName("building-" + building.id)[0];
            elem.getElementsByTagName("div")[0].getElementsByTagName("span")[0].textContent = this.commify(this.nextBuildingsCost(building.id, this.buyMode));
            elem.getElementsByTagName("div")[0].getElementsByTagName("span")[0].style.color = this.buyModeColours[this.buyMode]

            if (this.totalCoins >= building.cost || this.coins >= building.cost) {
                elem.getElementsByTagName("h2")[0].textContent = this.translator.formatBuilding(building.id);
                elem.getElementsByClassName("big")[0].className = "icon big unlock";
            } else {
                elem.getElementsByTagName("h2")[0].textContent = "???";
                elem.getElementsByClassName("big")[0].className = "icon big";
            }

            if (this.buildings[building.id])
                elem.getElementsByTagName("h1")[0].textContent = this.buildings[building.id].toString();
            else
                elem.getElementsByTagName("h1")[0].textContent = "";

            elem.setAttribute("afford", (this.coins >= this.nextBuildingsCost(building.id, this.buyMode)).toString())
        }

        if (this.selectedBuilding) {
            const id = buildings.findIndex(b => b.id === this.selectedBuilding);
            const unlock = this.totalCoins >= buildings[id].cost;

            const elem = <HTMLElement>document.getElementsByClassName("building-tooltip")[0];
            elem.style.visibility = "visible";

            const tid = buildings[id].id;
            const icon = unlock ? buildings[id].icon : [0, 4];
            const amount = this.buildings[tid];

            // Set the text
            elem.getElementsByTagName("div")[0].innerHTML = "";
            elem.getElementsByTagName("div")[0].appendChild(this.makeIcon(icon[0], icon[1], 48))
            elem.getElementsByTagName("h2")[0].textContent = (unlock ? this.translator.formatBuilding(tid) : "???");
            elem.style.top = (this.mouseY - 75 / 2) + "px";

            // Set desc
            elem.getElementsByTagName("p")[0].innerHTML = unlock ? this.translator.formatBuildingDescription(tid, amount, <[number, number]>this.rates[tid]?.map(x => x * this.multiplier), this.total[tid]) : "???";
        } else {
            (<HTMLElement>document.getElementsByClassName("building-tooltip")[0]).style.visibility = "hidden";
        }

        const achievementTooltip = <HTMLElement>selector(".achievement-tooltip");
        if (this.selectedAchievement) {
            const a = assert(achievements.find(a => a.id === this.selectedAchievement));

            if (achievementTooltip.getAttribute("selected") !== this.selectedAchievement) {
                const elem = this.achievementPopUp(a, true, this.achievements.indexOf(a.id) < 0);
                achievementTooltip.removeChild(achievementTooltip.children[0])
                achievementTooltip.appendChild(elem);
            }

            achievementTooltip.style.left = (this.mouseX) + "px";

            achievementTooltip.style.visibility = "visible";
            achievementTooltip.style.top = (this.mouseY - 25 - achievementTooltip.clientHeight) + "px";

            achievementTooltip.setAttribute("selected", this.selectedAchievement);
        } else {
            achievementTooltip.style.visibility = "hidden";
        }

        const effectTooltip = <HTMLElement>selector(".effect-tooltip");
        if (this.selectedEffect) {
            const e = this.effects.find(e => e.type === this.selectedEffect);

            if (e) {
                effectTooltip.style.left = (this.mouseX + 25) + "px";

                effectTooltip.style.visibility = "visible";
                effectTooltip.style.top = (this.mouseY - 25 - effectTooltip.clientHeight) + "px";

                const meta = e.getMeta();
                selector("h2", effectTooltip).textContent = this.translator.format(meta[0]);
                selector("p", effectTooltip).innerHTML = this.translator.format(meta[1]);
            } else
                effectTooltip.style.visibility = "hidden";
        } else {
            effectTooltip.style.visibility = "hidden";
        }

        if (this.selectedUpgrade) {
            const id = upgrades.findIndex(b => b.id === this.selectedUpgrade);
            const afford = this.coins >= upgrades[id].cost;

            const elem = <HTMLElement>document.getElementsByClassName("upgrade-tooltip")[0]
            elem.style.visibility = "visible";

            const icon = upgrades[id].icon;

            // Set the text
            elem.getElementsByTagName("div")[0].innerHTML = "";
            elem.getElementsByTagName("div")[0].appendChild(this.makeIcon(icon[0], icon[1], 48))
            elem.getElementsByTagName("h2")[0].textContent = this.translator.format(`upgrades.name.${this.selectedUpgrade}`);
            elem.style.top = (this.mouseY + 25) + "px";
            elem.style.left = (this.mouseX - 25 - 245) + "px";

            // Set desc
            elem.getElementsByTagName("p")[0].innerHTML =
                this.translator.format(`upgrades.description.${this.selectedUpgrade}`);
            elem.getElementsByTagName("p")[1].innerHTML =
            this.translator.format(`upgrades.use.${this.selectedUpgrade}`);
            elem.getElementsByTagName("span")[0].textContent =
                this.commify(upgrades[id].cost, false, true)
            elem.getElementsByTagName("span")[0].className = afford ? "afford" : "noafford"
        } else {
            (<HTMLElement>document.getElementsByClassName("upgrade-tooltip")[0]).style.visibility = "hidden";
        }

        if (this.selectedTab) {
            selector('.tab-wrapper button[type="stats"]').className = "";
            selector('.tab-wrapper button[type="options"]').className = "selected";

            (<HTMLElement>selector('.stats-wrapper')).style.visibility = "hidden";
            (<HTMLElement>selector('.options-wrapper')).style.visibility = "visible";
        } else {
            selector('.tab-wrapper button[type="stats"]').className = "selected";
            selector('.tab-wrapper button[type="options"]').className = "";

            (<HTMLElement>selector('.stats-wrapper')).style.visibility = "visible";
            (<HTMLElement>selector('.options-wrapper')).style.visibility = "hidden";
        }
    }

    /**
     * Resize the canvas according to the current screen size.
     */
    resizeCanvas() {
        let canvas = this.canvas;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    /**
     * Animate the coin button based on the delta-time given.
     * @param delta Delta time.
     */
    animateCoin(delta: number) {
        this.coinSize += (1.5 - this.coinSize) / 4;

        const { width, height } = this.canvas;
        const { width: W, height: H } = this.images.big_coin;
        const WW = W * this.coinSize;
        const HH = H * this.coinSize;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.animateFallingCoins(delta);
        this.ctx.drawImage(this.images.big_coin, (width - WW) / 2, (height - HH) / 2, WW, HH);

        if (this.boostMultiplier > 1) {
            this.canvas.setAttribute("bg", "1");
        } else if (this.boostMultiplier < 1) {
            this.canvas.setAttribute("bg", "-1");
        } else {
            this.canvas.setAttribute("bg", "0");
        }
    }

    /**
     * Show the user a popup to change the language.
     */
    changeLanguage() {
        const elem = document.createElement("div");
        this.addToElement(elem, "p", this.translator.format("dialogs.change_language.info"));
        for (let language of Object.values(this.translator.languages)) {
            if (!language.is_fallback) {
                const button = this.addToElement(elem, "button", `<p>${language.name}</p>`);
                button.className = language === this.translator.getCurrent() ? "languageOption disabled" : "languageOption";
                button.addEventListener("click", this.setLanguageAndReload.bind(this, language.id));
                this.addToElement(elem, "br");
            }
        }
        this.showDialog(this.translator.format("options.change_language"), elem, [this.translator.format("dialogs.load.cancel")]);
    }

    /**
     * Changes language and reloads.
     */
    setLanguageAndReload(language: string) {
        this.translator.setLanguageToLocalStorage(language);
        this.saveToStorage();
        window.location.reload();
    }

    /**
     * Animate the falling coins based on the delta-time given.
     * @param delta Delta time.
     */
    animateFallingCoins(delta: number) {
        for (let coinIndex = 0; coinIndex < this.fallingCoins.length; coinIndex++) {
            let coin = this.fallingCoins[coinIndex]
            if (coin.destroy === 1) {
                // Remove
                this.fallingCoins.splice(coinIndex, 1);
            } else {
                coin.draw();
                coin.fall(delta);
                // If too far down, delete the coin.
                if (coin.y > this.canvas.height + 200) {
                    this.fallingCoins.splice(coinIndex, 1);
                }
            }
        }
    }

    /**
     * The event handler of click on a canvas.
     * @param e The event.
     */
    canvasClick(e: MouseEvent) {
        if (this.ready < 2) return;

        const { clientX: x, clientY: y } = e;
        // It already lines up.
        // Calculate our offsets.
        const X = x - (this.canvas.width / 2);
        const Y = y - (this.canvas.height / 2);

        const A = this.images.big_coin.width / 2 * this.coinSize;
        const B = this.images.big_coin.height / 2 * this.coinSize;

        if (X * X / (B * B) + Y * Y / (A * A) <= 1) {
            return this.coinClick();
        }

        for (let i = this.fallingCoins.length - 1; i >= 0; i--) {
            const coin = this.fallingCoins[i]
            if (coin.isTouching(x, y)) {
                this.coinsDestroyed++;
                coin.click();
                return;
            }
        }
    }

    /**
     * Adds an amount of coins to the balance.
     * @param coins The amount to add.
     */
    add(coins: number) {
        this.coins += coins;
        this.totalCoins += coins;
    }

    /**
     * This function is called when the coin button is pressed.
     */
    coinClick() {
        this.coinSize = 0.75 * 1.5;
        this.add(this.coinsPerClick * this.multiplier);
        this.playAudio(audioClick);

        this.clicks++;

        for (let building of buildings) {
            const { id } = building;
            if (this.rates[id])
                this.addToTotal(id, this.multiplier * this.rates[id][0])
        }
    }

    /**
     * Play audio.
     */
    playAudio(audio: string) {
        this.playSounds && new Audio(audio).play();
    }

    /**
     * Create an icon based on the `./images/icons.png` image spreadsheet.
     * @param x Its x-index. It starts at 0 from left to right.
     * @param y Its y-index. It starts at 0 from up to down.
     * @param size The size of the icon. By default, it is `128`, which means `128x128`.
     * @returns the icon image.
     */
    makeIcon(x: number, y: number, size = 128): HTMLImageElement {
        // Each icon is 128x128.
        const img = new Image();
        img.src = BLANK_SRC;
        img.className = "icon";
        img.setAttribute("style", `background-position: ${-x * size}px ${-y * size}px; width: ${size}px; height: ${size}px; background-size: ${size / 128 * 2048}px`);
        return img;
    }

    /**
     * Adds commas to a number and returns it, If the number is too big, it will instead add a suffix to the decimal number.\
     * For example: `1.234e12` -----> `1.234 trillion`.
     * @param number The number to format.
     * @param br Whether or not the number is rounded down.
     * @param nodot If `true`, there will be no dot which is added when the number is
     * - less than `10`
     * - is a decimal
     * @returns the formatted number
     */
    commify(number: number, br = false, nodot = false): string {
        // Note: the language definition handles the commifying.
        return this.translator.commify(number, br, nodot);
    }

    /**
     * Creates a building element and returns it.
     * @param obj The building information.
     * @returns The element
     */
    buildingElement(obj: Building) {
        const div = document.createElement("div");
        const title = document.createElement("h2");
        title.textContent = "???";
        div.appendChild(title);
        const cost = document.createElement("div");
        cost.appendChild(this.makeIcon(0, 0, 22))
        const costText = document.createElement("span");
        costText.textContent = this.commify(obj.cost);
        cost.appendChild(costText);
        div.appendChild(cost);

        const amountText = document.createElement("h1");
        div.appendChild(amountText);
        const img = this.makeIcon(obj.icon[0], obj.icon[1], 64);
        img.className = "icon big"
        div.appendChild(img);

        const button = document.createElement("button");
        button.appendChild(div);

        return button;
    }

    /**
     * Get the amount of a building owned by the player.
     * @param type The type of the building.
     * @returns The amount of the building owned.
     */
    getBuildings(type: string) {
        return this.buildings[type] || 0;
    }

    /**
     * Get the object of a building.
     * @param type The type of the building.
     * @returns The object of the building.
     */
    getBuildingObject(type: string) {
        return buildings.find(build => build.id === type);
    }

    /**
     * The cost of buying the next of a building.
     * @param type The type of the building.
     * @param amount The amount of buildings to be bought.
     * @returns The total cost of buying the buildings.
     */
    nextBuildingsCost(type: string, amount = 1) {
        let cost = 0;
        const { cost: baseCost, increase: multiplier } = assert(this.getBuildingObject(type));
        for (let i = 0; i < amount; i++) {
            const total = this.getBuildings(type) + i;
            cost += baseCost * Math.pow(multiplier, total);
        }
        return cost;
    }

    /**
     * Add a particular amount of a building.
     * @param type The type of the building.
     * @param amount The amount to add.
     */
    addBuildings(type: string, amount = 1) {
        if (this.buildings[type])
            this.buildings[type] += amount;
        else
            this.buildings[type] = amount;
    }

    /**
     * This method is called when a building box is clicked on.
     * @param type The type of the building
     */
    clickBuilding(type: string) {
        if (this.coins >= this.nextBuildingsCost(type, this.buyMode)) {
            this.coins -= this.nextBuildingsCost(type, this.buyMode);
            this.addBuildings(type, this.buyMode);
        }
    }

    /**
     * Finds an `Upgrade` object from its ID.
     * @param id The ID of the upgrade.
     * @returns The object.
     */
    getUpgrade(id: string) {
        return upgrades.find(u => u.id === id);
    }

    /**
     * This method is called when the upgrade is click on.
     * @param id The ID of the upgrade.
     */
    clickUpgrade(id: string) {
        if (this.coins >= this.eval(assert(this.getUpgrade(id)).cost)) {
            this.coins -= this.eval(assert(this.getUpgrade(id)).cost);
            this.bought.push(id);
        }
    }

    /**
     * Draws all the active effects.
     * @param delta Delta time.
     */
    setBoost(delta: number) {
        let index = 0;
        for (const effect of this.effects) {
            if (effect.expired) {
                this.effects.splice(index, 1);

                let elem;
                while (elem = document.querySelector(".effect-" + effect.type))
                    selector(".effects >div").removeChild(elem)
            } else {
                effect.tick(delta);
                const div = selector(".effect-" + effect.type);
                this.ctx.clearRect(0, 0, 48, 48);
                this.ctx.fillStyle = "rgba(75, 75, 0, 0.4)";
                this.ctx.beginPath();
                this.ctx.moveTo(24, 24);
                this.ctx.arc(24, 24, 24 * 1.5, Math.PI * -0.5, (-2 * effect.percentageDuration - 0.5) * Math.PI, true)
                this.ctx.lineTo(24, 24);
                this.ctx.closePath();
                this.ctx.fill();
            }
            index++;
        }
    }

    /**
     * Check whether or not the player has the effect.
     * @param id ID of the effect.
     * @returns whether or not the player has it.
     */
    hasEffect(id: EffectType) {
        return this.effects.some(effect => effect.type == id);
    }

    /**
     * Adds an effect to be active. If already active, the duration is reset.
     * @param id The ID of the effect.
     * @param duration The duration of the effect.
     * @returns 
     */
    addEffect(id: EffectType, duration: null | number = null) {
        const newEffect = new Effect(id, duration, this);

        for (let i = 0; i < this.effects.length; i++) {
            let effect = this.effects[i];
            if (effect.type === id) {
                effect.duration = newEffect.duration;
                return;
            }
        }

        this.effects.push(newEffect);
        const effectDiv = document.createElement("div");
        effectDiv.appendChild(this.makeIcon(...newEffect.getIcon(), 48))

        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 48;
        effectDiv.appendChild(canvas);
        effectDiv.setAttribute("buff", Math.sign(newEffect.getEffect() - 1).toString())
        effectDiv.addEventListener("mouseenter", () => this.selectedEffect = newEffect.type);
        effectDiv.addEventListener("mouseleave", () => this.selectedEffect = null);
        effectDiv.className = "effect-" + id;
        selector(".effects >div").appendChild(effectDiv);
    }

    /**
     * Updates variables based on delta time.
     * @param delta Delta time.
     */
    updateVariables(delta: number) {
        this.coinsPerClick = 1;
        this.coinsPerSec = 0;
        this.getCurrentMultiplier();
        this.setBoost(delta);
        // Look through every building.
        for (let building of buildings) {
            const amount = this.buildings[building.id] || 0;
            if (amount) {
                let cpc = building.benefits[0] * amount;
                let cps = building.benefits[1] * amount;

                for (const upgrade of upgrades.filter(u => this.bought.includes(u.id))) {
                    for (const benefit in upgrade.benefits) {
                        if (benefit === building.id) {
                            const func = upgrade.benefits[benefit];
                            cpc = func(cpc, false, this);
                            cps = func(cps, true, this);
                        }
                    }
                }

                this.rates[building.id] = [cpc, cps];

                this.coinsPerClick += cpc;
                this.coinsPerSec += cps;

                this.addToTotal(building.id, delta * cps * this.multiplier);
            }
        }
        // Increment coin count
        this.add(this.coinsPerSec * delta * this.multiplier);
        // Change stats
        for (let stat of Object.entries(this.stat)) {
            let val = stat[1]();
            let str;
            if (typeof val !== "string") {
                str = this.commify(val)
            } else {
                str = val;
            }
            if (typeof val === "number") {
                selectorAll("[stat=" + stat[0] + "]").forEach(s => s.textContent = this.commify(<number>val, false, true));
            } else {
                selectorAll("[stat=" + stat[0] + "]").forEach(s => s.textContent = <string>val);
            }
        }
    }

    /**
     * The current *raw* coins per click.
     */
    get rawCoinsPerClick() {
        const value = this.coinsPerClick * this.unboostedMultiplier;
        return isNaN(value) ? 0 : value;
    }

    /**
     * The current *raw* coins per second.
     */
    get rawCoinsPerSec() {
        const value = this.coinsPerSec * this.unboostedMultiplier;
        return isNaN(value) ? 0 : value;
    }

    /**
     * The current coins per click.
     */
    get mulCoinsPerClick() {
        const value = this.coinsPerClick * this.multiplier;
        return isNaN(value) ? 0 : value;
    }

    /**
     * The current coins per second.
     */
    get mulCoinsPerSec() {
        const value = this.coinsPerSec * this.multiplier
        return isNaN(value) ? 0 : value;
    }

    /**
     * Add the contribution of total coins by a building.
     * @param id The ID of the building.
     * @param amount The amount of coins contributed.
     */
    addToTotal(id: string, amount: number) {
        if (this.total[id] === undefined) {
            this.total[id] = 0;
        }
        this.total[id] += amount;
    }

    /**
     * Generate an element for an upgrade.
     * @param upgrade The upgrade object to generate it for.
     * @returns The newly generated element.
     */
    generateUpgrade(upgrade: Upgrade) {
        const icon = this.makeIcon(upgrade.icon[0], upgrade.icon[1], 48);
        const div = document.createElement("div");
        div.appendChild(icon);
        const button = document.createElement("button");
        button.className = "upgrade-" + upgrade.id;
        button.appendChild(div);
        return button;
    }

    /**
     * Upgrade the element of each upgrade.
     */
    updateUpgrades() {
        for (let upgrade of upgrades) {
            const elem = <HTMLElement>document.getElementsByClassName("upgrade-" + upgrade.id)[0];
            if (this.bought.indexOf(upgrade.id) >= 0 || this.isLocked(upgrade)) {
                elem.style.display = "none";
            } else {
                elem.style.display = "initial";
                elem.setAttribute("afford", (this.coins >= this.eval(upgrade.cost)).toString())
            }
        }
    }

    /**
     * Whether the upgrade is locked.
     * @param upgrade The upgrade object
     * @returns Whether or not the upgrade is locked.
     */
    isLocked(upgrade: Upgrade) {
        for (const type of Object.keys(upgrade.requirements)) {
            const value = upgrade.requirements[type];
            switch (type) {
                default:
                    if (!(this.buildings[type] && this.buildings[type] >= value)) {
                        return true;
                    }
            }
        }
        return false;
    }

    /**
     * Returns the same value given, but for one exception:
     * - If a function is provided, it will instead call it and return its result.
     * @param num The value to evaluate.
     * @returns The value described above.
     */
    eval(num: number | (() => number)) {
        // If it is a function, execute it.
        if (typeof num === "function") {
            return num();
        }
        return num;
    }

    /**
     * Converts a tuple of `CPC` and `CPS` respectively to a formatted string.
     * @param cpccps The tuple.
     * @param extra Extra info to add at the end, if necessary.
     * @returns The formatted string.
     */
    convertToEnglish(cpccps: [number, number], extra = "") {
        if (!cpccps) return "coins";
        const [cpc, cps] = cpccps;
        const parts = []
        if (cpc > 0) {
            parts.push(this.commify(cpc, false, true) + " " + (cpc === 1 ? "coin" : "coins") + " per click")
        }
        if (cps > 0) {
            parts.push(this.commify(cps, false, true) + " " + (cps === 1 ? "coin" : "coins") + " per second")
        }
        return "<b>" + parts.join(" and ") + extra + "</b>";
    }

    /**
     * The total number of buildings owned by the player.
     */
    get buildingsNumber() {
        return this.getTotalBuildings();
    }

    /**
     * Get the total number of buildings.
     * @param excludeCursors If this is true, cursors are excluded from the final value.
     * @returns The total number of buildings.
     */
    getTotalBuildings(excludeCursors = false) {
        var number = 0;
        for (let id of Object.keys(this.buildings)) {
            if (!(excludeCursors && id === "cursor")) number += this.buildings[id] || 0;
        }
        return number;
    }

    /**
     * Changes the buy mode.
     * @param mode The buy mode.
     */
    changeBuyMode(mode: BuyMode) {
        this.buyMode = mode;
        selectorAll(".buy-bar button").forEach(button => {
            button.className = mode === +assert(button.getAttribute("value")) ? "selected" : "";
        });
    }

    /**
     * Set the selected tab.
     * @param tab The tab to select.
     */
    setSelectedTab(tab: Tab) {
        this.selectedTab = tab;
    }

    /**
     * Register a **stat**istic.
     * @param id The ID of the statistic.
     * @param number The number of the statistic.
     */
    registerStat(id: string, number: () => (number | string)) {
        this.stat[id] = number;
    }

    /**
     * Returns the number of a building owned by the player.
     * @param id The ID of the building.
     * @returns The number of buildings owned by the player.
     */
    getNumberOfBuildings(id: string) {
        return this.buildings[id] || 0;
    }

    /**
     * Make an achievement pop up. 
     * @param achievement The achievement object to pop up.
     * @param isTooltip Whether or not it is a tooltip.
     * @param locked Whether or not the achievement is locked.
     * @returns The newly created element from it.
     */
    achievementPopUp(achievement: Achievement, isTooltip = false, locked = false) {
        const elem = document.createElement("div");

        const imgdiv = document.createElement("div");
        imgdiv.className = "imgdiv";
        const indices = locked ? [0, 4] : achievement.icon;
        imgdiv.appendChild(this.makeIcon(indices[0], indices[1], 32));
        elem.appendChild(imgdiv);

        const titlediv = document.createElement("div");
        titlediv.className = "titlediv";

        const title = document.createElement("h1");
        title.textContent = locked ? "???" : this.translator.format("achievements.name." + achievement.id);
        titlediv.appendChild(title);
        elem.append(titlediv);

        const A = selector(".achievement").innerHTML;
        const adiv = document.createElement("div");
        adiv.className = "adiv";
        adiv.innerHTML = A;
        selector(".description", adiv).innerHTML = locked ? "" : this.translator.format("achievements.description." + achievement.id);
        selector(".how", adiv).innerHTML = locked ? "" : this.translator.format("achievements.how." + achievement.id);
        elem.append(adiv);

        if (!isTooltip) {
            const close = document.createElement("button");
            close.textContent = "\u00d7";
            close.addEventListener("click", () => {
                assert(elem.parentElement).removeChild(elem)
                let i = 0;
                let elems = selectorAll(".achievements >div >div");
                Array.from(elems).sort((a, b) => {
                    const nA = +assert(a.getAttribute("recent"));
                    const nB = +assert(b.getAttribute("recent"));
                    return nA - nB;
                }).forEach(other => {
                    other.setAttribute("recent", (i++).toString());
                });
            });

            elem.append(close);
            elem.setAttribute("recent", "0")
            selectorAll(".achievements >div >div").forEach(other => {
                let recent = +assert(other.getAttribute("recent")) + 1;
                if (recent >= 3) {
                    assert(other.parentElement).removeChild(other);
                } else {
                    other.setAttribute("recent", recent.toString());
                }
            });
            selector(".achievements >div").appendChild(elem);
            close.setAttribute("style", "--up: " + elem.clientHeight + ";");

            return elem;
        } else {
            return elem;
        }
    }
}

export default Game;