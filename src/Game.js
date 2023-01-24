import COIN_SRC from "./images/big_coin.png";
import BIG_COIN_SRC from "./images/coin_button.png";
import BLANK_SRC from "./images/blank_icon.png";
import buildings from "./Buildings";
import upgrades from "./Upgrades";
import achievements from "./Achievements";
import FallingCoin from "./FallingCoin";
import SaveManager from "./SaveManager";

class Game {
    coins = 1e15
    totalCoins = 0
    coinsPerClick = 1
    coinsPerSec = 0
    oldTime = +new Date()
    playingMusic = false;

    ready = 0;
    canvas = null;
    coinSize = 1.5

    iconSize = 18;

    images = {};
    buildings = {};
    bought = [];
    achievements = [];

    ticks = 0;

    buyMode = 1;
    
    selectedBuilding = null;
    selectedUpgrade = null;
    selectedAchievement = null;

    mouseX = 0;
    mouseY = 0;

    achieveMultiplier = 1;

    buyModeColours = {
        1:   "black",
        10:  "#040",
        100: "#044"
    }

    rates = {}
    total = {}

    fallingCoins = [];

    stat = {}
    clicks = 0

    selectedTab = 0;

    multiplier = 1;
    unboostedMultiplier = 1;
    boostMultiplier = 1;

    timeSinceCoinSpawn = 0;
    coinSpawnInterval = 1000;

    saveManager

    constructor(save) {
        this.canvas = document.getElementsByClassName("canvas")[0];
        this.canvas.addEventListener("click", this.canvasClick.bind(this));
        document.addEventListener("mousemove", this.setMouse.bind(this))

        this.saveManager = new SaveManager(this);
        this.loadImages();

        document.querySelector(".saveGameText").addEventListener("click", this.saveGame.bind(this, false))
        document.querySelector(".saveGameFile").addEventListener("click", this.saveGame.bind(this, true))

        document.querySelector(".loadGameText").addEventListener("click", this.loadGame.bind(this, false))
        document.querySelector(".loadGameFile").addEventListener("click", this.loadGame.bind(this, true))

        if (++this.ready > 1) this.doStart();
    }

    saveGame(file) {
        const code = this.saveManager.generateText();
        
        const saveDiv = document.createElement("div");
        this.addToElement(saveDiv, "p", "Your save code for Coin Clicker:<br>");

        const textarea = this.addToElement(saveDiv, "textarea");
        textarea.setAttribute("readonly", "true");
        textarea.setAttribute("unresizable", "true");

        textarea.textContent = code;

        this.addToElement(saveDiv, "br")
        this.showDialog("Save Code", saveDiv);
    }

    addToElement(div, tagName, innerHTML = "") {
        const element = document.createElement(tagName);
        if (innerHTML) element.innerHTML = innerHTML;
        div.appendChild(element);
        return element;
    }

    showDialog(title, element, buttons = ["OK"]) {
        return new Promise(resolve => {
            for (let index = 0; index < buttons.length; index++) {
                const text = buttons[index];
                const button = document.createElement("button");
                button.textContent = text;
                button.addEventListener("click", () => {
                    document.querySelector(".dialog").style.visibility = "hidden";
                    resolve(index)
                })
                element.append(button);
            }

            document.querySelector(".dialog .box").innerHTML = "";

            const titleDiv = this.addToElement(document.querySelector(".dialog .box"), "div");
            
            titleDiv.className = "title";
            titleDiv.textContent = title;

            element.className = "content";

            document.querySelector(".dialog .box").appendChild(titleDiv);
            document.querySelector(".dialog .box").appendChild(element);
            document.querySelector(".dialog").style.visibility = "visible";
        });
    }

    loadGame(file) {

    }

    getCurrentMultiplier() {
        this.achieveMultiplier = Math.pow(1.15, this.achievements.length);
        const m = [
            1,
            this.achieveMultiplier
        ];
        this.unboostedMultiplier = m.reduce((a, b) => a * b);
        const bm = [
            1
        ];
        this.boostMultiplier = bm.reduce((a, b) => a * b);
        this.multiplier = this.unboostedMultiplier * this.boostMultiplier;
        return this.multiplier;
    }

    setMouse(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    loadImages() {
        this.images.big_coin = new Image();
        this.images.big_coin.src = BIG_COIN_SRC;

        this.images.coin = new Image();
        this.images.coin.src = COIN_SRC;

        document.getElementsByClassName("coins-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 32));
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
        document.getElementsByClassName("cps-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
        document.querySelector(".upgrade-tooltip .cost").appendChild(this.makeIcon(0, 0, 20));
        document.querySelector(".upgrade-tooltip .cost").appendChild(document.createElement("span"));

        document.querySelector('.tab-wrapper button[type="stats"]').addEventListener("click", this.setSelectedTab.bind(this, 0));
        document.querySelector('.tab-wrapper button[type="options"]').addEventListener("click", this.setSelectedTab.bind(this, 1));

        for (let u of upgrades.sort((a, b) => a.cost - b.cost)) {
            const elem = this.generateUpgrade(u);
            document.getElementsByClassName("upgrades")[0].appendChild(elem);
            elem.addEventListener("click", this.clickUpgrade.bind(this, u.id));
            elem.addEventListener("mouseout", () => this.selectedUpgrade = null)
            elem.addEventListener("mouseover", () => this.selectedUpgrade = u.id);
        }

        for (let b of buildings) {
            // Create an element.
            const elem = this.buildingElement(b);
            elem.getElementsByTagName("div")[0].className = "building-" + b.id;
            document.getElementsByClassName("buildings")[0].appendChild(elem);
            elem.addEventListener("click", this.clickBuilding.bind(this, b.id))
            elem.addEventListener("mouseout", () => this.selectedBuilding = null)
            elem.addEventListener("mouseover", () => this.selectedBuilding = b.id);
        }

        for (let a of achievements) {
            const imgdiv = document.createElement("div");
            imgdiv.className = "imgdiv achievement-" + a.id;
            imgdiv.appendChild(this.makeIcon(0, 4, 64));

            imgdiv.addEventListener("mouseout", () => this.selectedAchievement = null);
            imgdiv.addEventListener("mouseover", () => this.selectedAchievement = a.id);

            document.querySelector("achievements").appendChild(imgdiv);
        }

        for (let button of document.querySelectorAll(".buy-bar button")) {
            button.addEventListener("click", this.changeBuyMode.bind(this, +button.getAttribute("value")))
        }

        // Easy to use elements
        // <coin></coin> = coin icon
        // <icon x="X" y="Y"></icon> = other icon
        for (let coin of document.querySelectorAll("coin")) {
            coin.appendChild(this.makeIcon(0, 0, this.iconSize))
        }

        for (let icon of document.querySelectorAll("icon")) {
            icon.appendChild(this.makeIcon(+icon.getAttribute("x"), +icon.getAttribute("y"), this.iconSize))
        }

        this.changeBuyMode(1);

        try {
            this.playMusic()
        } catch {
            console.warn("Will attempt to play music after coin click.")
        }

        this.registerStat("ownedCoins", () => this.coins);
        this.registerStat("totalCoins", () => this.totalCoins);
        this.registerStat("rawCoinsPerClick", () => this.rawCoinsPerClick);
        this.registerStat("rawCoinsPerSec", () => this.rawCoinsPerSec);
        this.registerStat("clicks", () => this.clicks);
        this.registerStat("multiplier", () => Math.round(this.multiplier * 100))
        this.registerStat("unlockedAchievements", () => this.achievements.length);
        this.registerStat("totalAchievements", () => achievements.length);
        this.registerStat("buildings", () => this.buildingsNumber)
        this.registerStat("achievementMultiplier", () => Math.round(this.achieveMultiplier * 100))
    }

    playMusic() {
        if (!this.playingMusic) {
            this.playingMusic = true;
            document.querySelector('.music').play()
        }
    }

    start() {
        if (++this.ready > 1) this.doStart();
    }

    doStart() {
        // Start our tick functions.
        requestAnimationFrame(this.tick.bind(this, +new Date()));
    }

    tick(time) {
        this.ticks++
        const delta = time - this.oldTime;
        this.timeSinceCoinSpawn += delta;
        this.oldTime = time;

        this.updateVariables(delta / 1000);
        this.updateText();

        if (this.ticks % 3 === 0) this.updateUpgrades();

        this.resizeCanvas();
        this.animateCoin(delta);

        this.coinSpawnInterval = Math.max(100, 1000 / Math.log10(this.coins))
        if (this.coins <= 0) this.coinSpawnInterval = Infinity;

        if (this.timeSinceCoinSpawn > this.coinSpawnInterval) {
            // Spawn a coin.
            this.fallingCoins.push(new FallingCoin(this.canvas, this.images.coin))
            // set coins spawn to 0 instead of reducing it
            this.timeSinceCoinSpawn = 0;
        }

        this.checkForNewAchievements();

        // Again
        requestAnimationFrame(this.tick.bind(this, new Date()));
    }

    checkForNewAchievements() {
        for (const a of achievements.filter(a => this.achievements.indexOf(a.id) < 0)) {
            if (a.goal(this)) {
                this.achievements.push(a.id);
                this.achievementPopUp(a);
            }
            if (this.achievements.indexOf(a.id) >= 0) {
                const div = document.querySelector(".achievement-" + a.id);
                div.removeChild(div.children[0]);
                div.appendChild(this.makeIcon(...a.icon, 64))
            }
        }
    }

    updateText() {
        document.getElementsByClassName("coins-header")[0].getElementsByTagName("span")[0].innerHTML = "" + this.commify(this.coins, true);
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("span")[0].innerHTML = this.commify(this.mulCoinsPerClick) + "/click";
        document.getElementsByClassName("cps-header")[0].getElementsByTagName("span")[0].innerHTML = this.coinsPerSec ? (this.commify(this.mulCoinsPerSec) + "/second") : "";
        document.getElementsByClassName("cps-header")[0].style.visibility = this.coinsPerSec ? "" : "hidden";

        for (let building of buildings) {
            const elem = document.getElementsByClassName("building-" + building.id)[0];
            elem.getElementsByTagName("div")[0].getElementsByTagName("span")[0].textContent = this.commify(this.nextBuildingsCost(building.id, this.buyMode));
            elem.getElementsByTagName("div")[0].getElementsByTagName("span")[0].style.color = this.buyModeColours[this.buyMode]

            if (this.totalCoins >= building.cost) {
                elem.getElementsByTagName("h2")[0].textContent = building.names[0];
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

            const elem = document.getElementsByClassName("building-tooltip")[0]
            elem.style.visibility = "visible";

            const icon = unlock ? buildings[id].icon : [0, 4];
            const amount = this.buildings[buildings[id].id];
            
            // Set the text
            elem.getElementsByTagName("div")[0].innerHTML = "";
            elem.getElementsByTagName("div")[0].appendChild(this.makeIcon(icon[0], icon[1], 48)) 
            elem.getElementsByTagName("h2")[0].textContent = unlock ? buildings[id].names[0] : "???"
            elem.style.top = (this.mouseY - 75/2) + "px";

            // Set desc
            elem.getElementsByTagName("p")[0].innerHTML = unlock ?
                (buildings[id].description.replace("%1", this.convertToEnglish(this.rates[buildings[id].id]?.map(x => x * this.multiplier)) +
                    (amount > 1 ? (", each making " + this.convertToEnglish(this.rates[buildings[id].id]?.map(x => x * this.multiplier / this.buildings[buildings[id].id]))) : "")) +
                    (amount ? ("<br><b>" + this.commify(this.total[buildings[id].id]) + " coins made so far.</b>") : ""))
                : "???";
        } else {
            document.getElementsByClassName("building-tooltip")[0].style.visibility = "hidden";
        }

        const achievementTooltip = document.querySelector(".achievement-tooltip")
        if (this.selectedAchievement) {
            const a = achievements.find(a => a.id === this.selectedAchievement);

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

        if (this.selectedUpgrade) {
            const id = upgrades.findIndex(b => b.id === this.selectedUpgrade);
            const afford = this.coins >= upgrades[id].cost;

            const elem = document.getElementsByClassName("upgrade-tooltip")[0]
            elem.style.visibility = "visible";

            const icon = upgrades[id].icon;
            
            // Set the text
            elem.getElementsByTagName("div")[0].innerHTML = "";
            elem.getElementsByTagName("div")[0].appendChild(this.makeIcon(icon[0], icon[1], 48)) 
            elem.getElementsByTagName("h2")[0].textContent = upgrades[id].name;
            elem.style.top = (this.mouseY + 25) + "px";
            elem.style.left = (this.mouseX - 25 - 245) + "px";

            // Set desc
            elem.getElementsByTagName("p")[0].innerHTML =
                upgrades[id].description
            elem.getElementsByTagName("p")[1].innerHTML =
                upgrades[id].use
            elem.getElementsByTagName("span")[0].textContent =
                this.commify(upgrades[id].cost, null, true)
                elem.getElementsByTagName("span")[0].className = afford ? "afford" : "noafford"
        } else {
            document.getElementsByClassName("upgrade-tooltip")[0].style.visibility = "hidden";
        }

        if (this.selectedTab) {
            document.querySelector('.tab-wrapper button[type="stats"]').className = "";
            document.querySelector('.tab-wrapper button[type="options"]').className = "selected";

            document.querySelector('.stats-wrapper').style.visibility = "hidden";
            document.querySelector('.options-wrapper').style.visibility = "visible";
        } else {
            document.querySelector('.tab-wrapper button[type="stats"]').className = "selected";
            document.querySelector('.tab-wrapper button[type="options"]').className = "";

            document.querySelector('.stats-wrapper').style.visibility = "visible";
            document.querySelector('.options-wrapper').style.visibility = "hidden";
        }
    }

    resizeCanvas() {
        let canvas = this.canvas;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    animateCoin(delta) {
        this.coinSize += (1.5 - this.coinSize) / 4;

        const ctx = this.canvas.getContext("2d");
        const {width, height} = this.canvas;
        const {width: W, height: H} = this.images.big_coin;
        const WW = W * this.coinSize;
        const HH = H * this.coinSize;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.animateFallingCoins(delta);
        ctx.drawImage(this.images.big_coin, (width - WW) / 2, (height - HH) / 2, WW, HH);
    }

    animateFallingCoins(delta) {
        for (let coinIndex in this.fallingCoins) {
            let coin = this.fallingCoins[coinIndex]
            coin.draw();
            coin.fall(delta);
            // If too far down, delete the coin.
            if (coin.y > this.canvas.height + 200) this.fallingCoins.splice(coinIndex, 1);
        }
    }

    canvasClick(e) {
        if (this.ready < 2) return;
        const {clientX: x, clientY: y} = e;
        // It already lines up.
        // Calculate our offsets.
        const X = x - (this.canvas.width / 2);
        const Y = y - (this.canvas.height / 2);

        const A = this.images.big_coin.width / 2 * this.coinSize;
        const B = this.images.big_coin.height / 2 * this.coinSize;
        
        if (X*X/(B*B) + Y*Y/(A*A) <= 1) {
            this.coinClick();
        }
    }

    add(coins) {
        this.coins += coins;
        this.totalCoins += coins;
    }

    coinClick() {
        this.playMusic();

        this.coinSize = 0.75 * 1.5;
        this.add(this.coinsPerClick * this.multiplier);
        this.clicks++;
        
        for (let building of buildings) {
            const {id} = building;
            if (this.rates[id])
                this.addToTotal(id, this.multiplier * this.rates[id][0])
        }
    }

    makeIcon(x, y, size = 128) {
        // Each icon is 128x128.
        const img = new Image();
        img.src = BLANK_SRC;
        img.className = "icon";
        img.style = `background-position: ${-x * size}px ${-y * size}px; width: ${size}px; height: ${size}px; background-size: ${size/128 * 2048}px`;
        return img;
    }

    commify(number, br, nodot) {
        if (br) number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + this.commify(-number);
        if (!br && !nodot && number < 10) return number.toFixed(1);

        number = Math.floor(number);
        if (number < 1000000000) return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

        const illion = Math.floor(Math.log10(number) / 3);
        const starting = Math.pow(10, illion * 3);
        
        const float = Math.floor(number / starting * 1000) / 1000;

        return float.toFixed(3) + (br ? "<br><span>" : " ") + this.illionSuffix(illion - 1) + (br ? "</span>" : "");
    }

    illionSuffix(illion) {
        if (illion == 100) return "centillion";
        if (illion == 101) return "uncentillion";
        if (illion < 10) {
            return ["million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"][illion - 1];
        }
        let unit = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"][illion % 10];
        let ten = ["", "dec", "vigint", "trigint", "quadragint", "quinquagint", "sexagint", "septuagint", "octoginta", "nonaginta"][Math.floor(illion / 10) % 10];
        return unit + ten + "illion";
    }

    buildingElement(obj) {
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

    getBuildings(type) {
        return this.buildings[type] || 0;
    }

    getBuildingObject(type) {
        return buildings.find(build => build.id === type);
    }

    nextBuildingsCost(type, amount = 1) {
        let cost = 0;
        const {cost: baseCost, increase: multiplier} = this.getBuildingObject(type);
        for (let i = 0; i < amount; i++) {
            const total = this.getBuildings(type) + i;
            cost += baseCost * Math.pow(multiplier, total);
        }
        return cost;
    }
    
    addBuildings(type, amount = 1) {
        if (this.buildings[type])
            this.buildings[type] += amount;
        else
            this.buildings[type] = amount;
    }

    clickBuilding(type) {
        if (this.coins >= this.nextBuildingsCost(type, this.buyMode)) {
            this.coins -= this.nextBuildingsCost(type, this.buyMode);
            this.addBuildings(type, this.buyMode);
        }
    }

    getUpgrade(id) {
        return upgrades.find(u => u.id === id);
    }

    clickUpgrade(id) {
        if (this.coins >= this.eval(this.getUpgrade(id).cost)) {
            this.coins -= this.eval(this.getUpgrade(id).cost);
            this.bought.push(id);
        }
    }

    updateVariables(delta) {
        this.coinsPerClick = 1;
        this.coinsPerSec = 0;
        this.getCurrentMultiplier();
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
            document.querySelector("[stat=" + stat[0] + "]").textContent = this.commify(stat[1](), null, true);
        }
    }

    get rawCoinsPerClick() {
        const value = this.coinsPerClick * this.unboostedMultiplier;
        return isNaN(value) ? 0 : value;
    }

    get rawCoinsPerSec() {
        const value = this.coinsPerSec * this.unboostedMultiplier;
        return isNaN(value) ? 0 : value;
    }
    
    get mulCoinsPerClick() {
        const value = this.coinsPerClick * this.multiplier;
        return isNaN(value) ? 0 : value;
    }

    get mulCoinsPerSec() {
        const value = this.coinsPerSec * this.multiplier
        return isNaN(value) ? 0 : value;
    }

    addToTotal(id, amount) {
        if (this.total[id] === undefined) {
            this.total[id] = 0;
        }
        this.total[id] += amount;
    }

    generateUpgrade(upgrade) {
        const icon = this.makeIcon(upgrade.icon[0], upgrade.icon[1], 48);
        const div = document.createElement("div");
        div.appendChild(icon);
        const button = document.createElement("button");
        button.className = "upgrade-" + upgrade.id;
        button.appendChild(div);
        return button;
    }

    updateUpgrades() {
        for (let upgrade of upgrades) {
            const elem = document.getElementsByClassName("upgrade-" + upgrade.id)[0];
            if (this.bought.indexOf(upgrade.id) >= 0 || this.isLocked(upgrade)) {
                elem.style.display = "none";
            } else {
                elem.style.display = "initial";
                elem.setAttribute("afford", (this.coins >= this.eval(upgrade.cost)).toString())
            }
        }
    }

    isLocked(upgrade) {
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

    eval(num) {
        // If it is a function, execute it.
        if (typeof num === "function") {
            return num();
        }
        return num;
    }

    convertToEnglish(cpccps, extra = "") {
        if (!cpccps) return "coins";
        const [cpc, cps] = cpccps;
        const parts = []
        if (cpc > 0) {
            parts.push(this.commify(cpc, null, true) + " " + (cpc === 1 ? "coin" : "coins") + " per click")
        }
        if (cps > 0) {
            parts.push(this.commify(cps, null, true) + " " + (cps === 1 ? "coin" : "coins") + " per second")
        }
        return "<b>" + parts.join(" and ") + extra + "</b>";
    }

    get buildingsNumber() {
        return this.getTotalBuildings();
    }

    getTotalBuildings(excludeCursors) {
        var number = 0;
        for (let id of Object.keys(this.buildings)) {
            if (!(excludeCursors && id === "cursor")) number += this.buildings[id] || 0;
        }
        return number;
    }

    changeBuyMode(mode) {
        this.buyMode = mode;
        for (let button of document.querySelectorAll(".buy-bar button")) {
            button.className = mode === +button.getAttribute("value") ? "selected" : "";
        }
    }

    setSelectedTab(tab) {
        this.selectedTab = tab;
    }

    registerStat(id, number) {
        this.stat[id] = number;
    }

    getNumberOfBuildings(id) {
        return this.buildings[id] || 0;
    }

    achievementPopUp(achievement, isTooltip = false, locked = null) {
        const elem = document.createElement("div");

        const imgdiv = document.createElement("div");
        imgdiv.className = "imgdiv";
        imgdiv.appendChild(this.makeIcon(...(locked ? [0, 4] : achievement.icon), 32));
        elem.appendChild(imgdiv);

        const titlediv = document.createElement("div");
        titlediv.className = "titlediv";

        const title = document.createElement("h1");
        title.textContent = locked ? "???" : achievement.name;
        titlediv.appendChild(title);
        elem.append(titlediv);

        const A = document.querySelector(".achievement").innerHTML;
        const adiv = document.createElement("div");
        adiv.className = "adiv";
        adiv.innerHTML = A;
        adiv.querySelector(".description").innerHTML = locked ? "" : achievement.description;
        adiv.querySelector(".how").innerHTML = locked ? "" : achievement.how;
        elem.append(adiv);

        if (!isTooltip) {
            const close = document.createElement("button");
            close.textContent = "\u00d7";
            close.addEventListener("click", () => {
                elem.parentElement.removeChild(elem)
                let i = 0;
                let elems = document.querySelectorAll(".achievements >div >div");
                for (let other of [...elems].sort((a, b) => a.getAttribute("recent") - b.getAttribute("recent"))) {
                    other.setAttribute("recent", (i++).toString());
                }
            });
        
            elem.append(close);
            elem.setAttribute("recent", "0")
            for (let other of document.querySelectorAll(".achievements >div >div")) {
                let recent = +other.getAttribute("recent") + 1;
                if (recent >= 3) {
                    other.parentElement.removeChild(other);
                } else {
                    other.setAttribute("recent", recent.toString());
                }
            }
            document.querySelector(".achievements >div").appendChild(elem);
            close.setAttribute("style", "--up: " + elem.clientHeight + ";");
        } else {
            return elem;
        }
    }
}

export default Game;