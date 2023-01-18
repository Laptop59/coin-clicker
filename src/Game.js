import COIN_SRC from "./images/big_coin.png";
import BIG_COIN_SRC from "./images/coin_button.png";
import BLANK_SRC from "./images/blank_icon.png";
import buildings from "./Buildings";
import upgrades from "./Upgrades";

class Game {
    coins = 0
    totalCoins = 0
    coinsPerClick = 1
    coinsPerSec = 0
    oldTime = +new Date()

    ready = 0;
    canvas = null;
    coinSize = 1.5

    images = {};
    buildings = {};
    bought = [];

    ticks = 0;

    buyMode = 1;
    
    selectedBuilding = null;

    mouseX = 0;
    mouseY = 0;

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

        for (let u of upgrades) {
            const elem = this.generateUpgrade(u);
            document.getElementsByClassName("upgrades")[0].appendChild(elem);
            elem.addEventListener("click", this.clickUpgrade.bind(this, u.id));
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
            elem.getElementsByTagName("div")[0].getElementsByTagName("span")[0].textContent = this.commify(this.nextBuildingsCost(building.id, 1));

            if (this.totalCoins >= building.cost) {
                elem.getElementsByTagName("h2")[0].textContent = building.names[0];
            } else {
                elem.getElementsByTagName("h2")[0].textContent = "???";
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
            
            // Set the text
            elem.getElementsByTagName("div")[0].innerHTML = "";
            elem.getElementsByTagName("div")[0].appendChild(this.makeIcon(icon[0], icon[1], 48)) 
            elem.getElementsByTagName("h2")[0].textContent = unlock ? buildings[id].names[0] : "???"
            elem.style.top = (this.mouseY - 75/2) + "px";

            // Set desc
            elem.getElementsByTagName("p")[0].innerHTML = unlock ? buildings[id].description.replace("%1", "*insert rate*") : "???";
        } else {
            document.getElementsByClassName("building-tooltip")[0].style.visibility = "hidden";
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
    }

    makeIcon(x, y, size = 128) {
        // Each icon is 128x128.
        const img = new Image();
        img.src = BLANK_SRC;
        img.className = "icon";
        img.style = `background-position: ${-x * size}px ${-y * size}px; width: ${size}px; height: ${size}px; background-size: ${size/128 * 2048}px`;
        return img;
    }

    commify(number, br) {
        if (br) number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + this.commify(-number);
        if (!br && number < 10) return number.toFixed(1);

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
                            cpc = func(cpc, false);
                            cps = func(cps, true);
                        }
                    }
                }

                this.coinsPerClick += cpc;
                this.coinsPerSec += cps;
            }
        }
        // Increment coin count
        this.add(this.coinsPerSec * delta);
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
}

export default Game;