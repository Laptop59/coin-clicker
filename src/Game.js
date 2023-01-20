import COIN_SRC from "./images/big_coin.png";
import BIG_COIN_SRC from "./images/coin_button.png";
import BLANK_SRC from "./images/blank_icon.png";
import buildings from "./Buildings";
import upgrades from "./Upgrades";

class Game {
    coins = 0 && Number.MAX_VALUE
    totalCoins = 0
    coinsPerClick = 1
    coinsPerSec = 0
    oldTime = +new Date()

    ready = 0;
    canvas = null;
    coinSize = 1.5

    iconSize = 18;

    images = {};
    buildings = {};
    bought = [];

    ticks = 0;

    buyMode = 1;
    
    selectedBuilding = null;
    selectedUpgrade = null;

    mouseX = 0;
    mouseY = 0;

    buyModeColours = {
        1:   "black",
        10:  "#040",
        100: "#044"
    }

    rates = {}
    total = {}

    stat = {}
    clicks = 0

    selectedTab = 0;

    multiplier = 1;

    constructor(save) {
        this.canvas = document.getElementsByClassName("canvas")[0];
        this.canvas.addEventListener("click", this.canvasClick.bind(this));
        document.addEventListener("mousemove", this.setMouse.bind(this))
        this.loadImages();
        if (++this.ready > 1) this.doStart();
    }

    setMouse(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    loadImages() {
        this.images.big_coin = new Image();
        this.images.big_coin.src = BIG_COIN_SRC;

        document.getElementsByClassName("coins-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 32));
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
        document.getElementsByClassName("cps-header")[0].getElementsByTagName("div")[0].appendChild(this.makeIcon(0, 0, 24));
        document.querySelector(".upgrade-tooltip .cost").appendChild(this.makeIcon(0, 0, 20));
        document.querySelector(".upgrade-tooltip .cost").appendChild(document.createElement("span"));

        document.querySelector('.tab-wrapper button[type="stats"]').addEventListener("click", this.setSelectedTab.bind(this, 0));
        document.querySelector('.tab-wrapper button[type="options"]').addEventListener("click", this.setSelectedTab.bind(this, 1));

        for (let u of upgrades) {
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

        document.querySelector('.music').play();

        this.registerStat("ownedCoins", () => this.coins);
        this.registerStat("totalCoins", () => this.totalCoins)
        this.registerStat("clicks", () => this.clicks)
    }

    start() {
        if (++this.ready > 1) this.doStart();
    }

    doStart() {
        // Start our tick functions.
        requestAnimationFrame(() => this.tick(this, +new Date()));
    }

    tick(t, time) {
        this.ticks++
        const delta = time - t.oldTime;
        t.oldTime = time;

        t.updateVariables(delta / 1000);
        t.updateText();

        if (this.ticks % 3 === 0) t.updateUpgrades();

        t.resizeCanvas();
        t.animateCoin();

        // Again
        requestAnimationFrame(() => this.tick(t, +new Date()));
    }

    updateText() {
        document.getElementsByClassName("coins-header")[0].getElementsByTagName("span")[0].innerHTML = "" + this.commify(this.coins, true);
        document.getElementsByClassName("cpc-header")[0].getElementsByTagName("span")[0].innerHTML = this.commify(this.coinsPerClick) + "/click";
        document.getElementsByClassName("cps-header")[0].getElementsByTagName("span")[0].innerHTML = this.coinsPerSec ? (this.commify(this.coinsPerSec) + "/second") : "";
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
                (buildings[id].description.replace("%1", this.convertToEnglish(this.rates[buildings[id].id]) +
                    (amount > 1 ? (", each making " + this.convertToEnglish(this.rates[buildings[id].id]?.map(x => x / this.buildings[buildings[id].id]))) : "")) +
                    (amount ? ("<br><b>" + this.commify(this.total[buildings[id].id]) + " coins made so far.</b>") : ""))
                : "???";
        } else {
            document.getElementsByClassName("building-tooltip")[0].style.visibility = "hidden";
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

    animateCoin() {
        this.coinSize += (1.5 - this.coinSize) / 4;

        const ctx = this.canvas.getContext("2d");
        const {width, height} = this.canvas;
        const {width: W, height: H} = this.images.big_coin;
        const WW = W * this.coinSize;
        const HH = H * this.coinSize;
        
        ctx.drawImage(this.images.big_coin, (width - WW) / 2, (height - HH) / 2, WW, HH);
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
        this.coinSize = 0.75 * 1.5;
        this.add(this.coinsPerClick);
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
        
        const float = number / starting;

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
        // Create multipliers... here todo
        this.multiplier = 1;
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
        this.add(this.coinsPerSec * delta);
        // Change stats
        for (let stat of Object.entries(this.stat)) {
            document.querySelector("[stat=" + stat[0] + "]").textContent = this.commify(stat[1](), null, true);
        }
    }

    addToTotal(id, amount) {
        if (this.total[id] === undefined) {
            this.total[id] = 0;
        }
        this.total[id] += amount;
    }

    generateUpgrade(upgrade) {
        const icon = this.makeIcon(upgrade.icon[0], upgrade.icon[1], 48);
        const button = document.createElement("button");
        button.className = "upgrade-" + upgrade.id;
        button.appendChild(icon);
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
}

export default Game;