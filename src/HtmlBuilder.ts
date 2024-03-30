import Translator from "./Translator";
import music from "./sounds/music.wav";

/**
 * This class builds the HTML for the game.
 */
class HtmlBuilder {
    /**
     * Populates the body node.
     * @param translator A translator instance.
     */
    static populate(translator: Translator) {
        document.body.append(...this.generate(translator));
        console.log("Populated <body>.");
    }

    /**
     * Generates a list of nodes which must be inserted into the body tag.
     * @param translator A translator instance.
     * @returns {HTMLDivElement[]}
     */
    static generate(translator: Translator): HTMLDivElement[] {
        return [
            this.loadingDiv(),
            this.audioWrapper(
                this.loopingMusic()
            ),
            this.canvasWrapper(),
            this.middleWrapper(translator),
            this.buildingsWrapper(translator),
            this.buildingTooltip(),
            this.achievementTooltip(),
            this.upgradeTooltip(),
            this.effectTooltip(),
            this.achievement(),
            this.dialog()
        ];
    }

    /**
     * Generates the loading div element.
     * <div style="z-index: 1000000" class="loadScreen">
     *     <h1>Loading Coin Clicker...</h1>
     *  </div>
     * @returns {HTMLDivElement}
     */
    static loadingDiv(): HTMLDivElement {
        let div = document.createElement("div");
        div.style.zIndex = "1000000";
        div.className = "loadScreen";

        let header = document.createElement("h1");
        header.textContent = "Loading Coin Clicker...";

        div.appendChild(header);
        
        return div;
    }

    /**
     * Generate an audio node that loops music.
     * <audio class="music" controls loop>
     *     <source src="./sounds/music.wav" type="audio/wav">
     * </audio>
     * @returns {HTMLAudioElement}
     */
    static loopingMusic(): HTMLAudioElement {
        var node = document.createElement("audio");
        node.className = "music";
        node.controls = true;
        node.loop = true;
    
        var source = document.createElement("source");
        source.src = music;
        source.type = "audio/wav";
    
        node.appendChild(source);
    
        return node;
    }

    /**
     * Generate an audio wrapper.
     * @param {HTMLAudioElement} audioElement The audio element to be wrapped.
     * @returns {HTMLDivElement}
     * <div style="visibility: hidden" class="audioWrapper">
     *     <!-- audio node is inserted here -->
     * </div>
     */
    static audioWrapper(audioElement: HTMLAudioElement): HTMLDivElement {
        let div = document.createElement("div");
        div.style.visibility = "hidden";
        div.className = "audioWrapper";

        div.appendChild(audioElement);
        
        return div;
    }

    /**
     * Generates a canvas sub-header.
     * @param {String} className The class name.
     * @param {String} name Element name
     * @returns {HTMLHeadingElement}
     * <h1 class="...">
     *    <div></div>
     *    <span></span>
     * </h1>
     */
    static canvasSubHeader(className: string, name: "h1" | "h3"): HTMLHeadingElement {
        let header = document.createElement(name);
        header.className = className;
        header.append(document.createElement("div"));
        header.append(document.createElement("span"));

        return header;
    }

    /**
     * Generates a canvas header which contains its sub-headers.
     * @param {HTMLHeadingElement[]} subheaders Its sub-headers.
     * @returns {HTMLDivElement}
     */
    static canvasHeader(subheaders: HTMLHeadingElement[]): HTMLDivElement {
        let div = document.createElement("div");
        for (let subheader of subheaders) {
            div.appendChild(subheader);
        }

        return div;
    }

    /**
     * Generates a canvas wrapper.
     * @returns {HTMLDivElement}
     * <div class="canvas-wrapper">
            <div class="header">
                <h1 class="coins-header">
                    <div></div>
                    <span></span>
                </h1>
                <h3 class="cpc-header">
                    <div></div>
                    <span></span>
                </h3>
                <h3 class="cps-header">
                    <div></div>
                    <span></span>
                </h3>
            </div>
            <canvas class="canvas"></canvas>
            <span class="savetext"><span>SAVED</span></span>
            <div class="effects"><div></div></div>
        </div>
     */
    static canvasWrapper(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "canvas-wrapper";

        let canvasHeader = this.canvasHeader([
            this.canvasSubHeader("coins-header", "h1"),
            this.canvasSubHeader("cpc-header", "h3"),
            this.canvasSubHeader("cps-header", "h3"),
        ]);
        canvasHeader.className = "header";

        let canvas = document.createElement("canvas");
        canvas.className = "canvas";

        let span = document.createElement("span");
        span.className = "savetext";
        let innerSpan = document.createElement("span");
        innerSpan.textContent = "SAVED";
        span.appendChild(innerSpan);

        let effects = document.createElement("div");
        effects.className = "effects";
        let innerEffects = document.createElement("div");
        effects.appendChild(innerEffects);        

        div.append(
            canvasHeader,
            canvas,
            span,
            effects
        );

        return div;
    }

    /**
     * Generates a middle wrapper.
     * @param translator A translator instance.
     * @returns {HTMLDivElement}
     * <div class="middle-wrapper">
            <div class="tab-wrapper">
                <div>
                    <button type="stats">Stats</button>
                    <button type="options">Options</button>
                </div>
            </div>
            <div class="work-wrapper">
                <div class="stats-wrapper">
                    <p>Coins currently owned: <coin></coin><span stat="ownedCoins">...</span></p>
                    <p>Total coins made: <coin></coin><span stat="totalCoins">...</span></p>
                    <p>Raw coins per click: <icon x="1" y="0"></icon><span stat="rawCoinsPerClick">...</span></p>
                    <p>Raw coins per second: <icon x="1" y="0"></icon><span stat="rawCoinsPerSec">...</span></p>
                    <p>Clicks done: <icon x="0" y="1"></icon><span stat="clicks">...</span></p>
                    <p>Start Date: <span stat="startDate">...</span></p>
                    <p>Coins Destroyed: <icon x="2" y="0"></icon><span stat="coinsDestroyed">...</span></p>
                    <br>
                    <p>Buildings: <span stat="buildings">...</span></p>
                    <p>Current multiplier percentage: <span stat="multiplier">...</span>%</p>
                    <h2>Achievements</h2>
                    <p>Achievements unlocked: <span stat="unlockedAchievements">...</span>/<span stat="totalAchievements">...</span></p>
                    <p>Achievement multiplier percentage: <span stat="achievementMultiplier">...</span>% (each achievement gives +15%)</p>
                    <achievements></achievements>
                </div>
                <div class="options-wrapper">
                    <h2>Basic</h2>
                    <button class="saveGame">Save to browser (CTRL+S)</button>
                    <br><br><input class="autosave" type="checkbox" checked>Autosave</input><br><br>
                    <h2>Game Data</h2>
                    <p>Save your game data <button class="saveGameText">into text</button><button class="saveGameFile">into a file</button>.</p>
                    <p>Load your game data <button class="loadGameText">from text</button><button class="loadGameFile">from a file</button>.</p>
                    <h2 style="color: red;">Unsafe</h2>
                    <button class="wipeGame">Wipe save</button>
                </div>
                <div class="achievements"><div class="cover"></div></div>
            </div>
        </div>
     */
    static middleWrapper(translator: Translator): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "middle-wrapper";

        let tabDiv = document.createElement("div");
        tabDiv.append(
            this.typedButton("stats", "Stats"),
            this.typedButton("options", "Options")
        );

        let tabWrapper = document.createElement("div");
        tabWrapper.className = "tab-wrapper";
        tabWrapper.appendChild(tabDiv);

        let workWrapper = document.createElement("div");
        workWrapper.className = "work-wrapper";

        let statsWrapper = document.createElement("div");
        statsWrapper.className = "stats-wrapper";
        statsWrapper.innerHTML = [
            this.h2Stat(translator, 'stats.general_title'),
            this.pStat(translator, 'stats.owned_coins', '<coin></coin>', '<span stat="ownedCoins">...</span>'),
            this.pStat(translator, 'stats.total_coins', '<coin></coin>', '<span stat="totalCoins">...</span>'),
            this.pStat(translator, 'stats.raw_coins_per_click', '<icon x="1" y="0"></icon>', '<span stat="rawCoinsPerClick">...</span>'),
            this.pStat(translator, 'stats.raw_coins_per_second', '<icon x="1" y="0"></icon>', '<span stat="rawCoinsPerSec">...</span>'),
            this.pStat(translator, 'stats.clicks_done', '<icon x="0" y="1"></icon>', '<span stat="clicks">...</span>'),
            this.pStat(translator, 'stats.start_date', '<span stat="startDate">...</span>'),
            this.pStat(translator, 'stats.coins_destroyed', '<icon x="2" y="0"></icon>', '<span stat="coinsDestroyed">...</span>'),

            '<br>',

            this.pStat(translator, 'stats.buildings', '<span stat="buildings">...</span>'),
            this.pStat(translator, 'stats.multiplier','<span stat="multiplier">...</span>'),
            this.h2Stat(translator, 'stats.achievements_title'),
            this.pStat(translator, 'stats.unlocked_achievements', '<span stat="unlockedAchievements">...</span>', '<span stat="totalAchievements">...</span>'),
            this.pStat(translator, 'stats.achievement_multiplier', '<span stat="achievementMultiplier">...</span>'),

            '<achievements></achievements>'
        ].join("");

        let optionsWrapper = document.createElement("div");
        optionsWrapper.className = "options-wrapper";
        optionsWrapper.innerHTML = [
            this.h2Stat(translator, 'options.basic_title'),
            `<button class="saveGame">${translator.format("options.save_to_browser")}</button>`,
            `<br><br><input class="autosave" type="checkbox" checked>${translator.format("options.autosave")}</input><br><br>`,
            this.h2Stat(translator, 'options.game_data_title'),

            this.pStatWithImportance(translator,
                "options.save_game_data.main",
                `<button class="saveGameText">${translator.format("options.save_game_data.1")}</button>`,
                `<button class="saveGameFile">${translator.format("options.save_game_data.2")}</button>`
            ),
            this.pStatWithImportance(translator,
                "options.load_game_data.main",
                `<button class="loadGameText">${translator.format("options.load_game_data.1")}</button>`,
                `<button class="loadGameFile">${translator.format("options.load_game_data.2")}</button>`
            ),

            `<h2 style="color: red;">${translator.format("options.unsafe_title")}</h2>`,
            `<button class="wipeGame">${translator.format("options.wipe_save")}</button>`
        ].join("");

        let achievements = document.createElement("div");
        achievements.className = "achievements";
        achievements.innerHTML = '<div class="cover"></div></div>';

        workWrapper.append(
            statsWrapper,
            optionsWrapper,
            achievements
        );

        div.append(
            tabWrapper,
            workWrapper
        );

        return div;
    };

    /**
     * Translates a stat. <p>
     * @param translator The translator instance.
     * @param translationId The ID in `camel_case`.
     * @param impArgs Important arguments.
     * @param args The extra arguments of the translation.
     * @returns The newly created innerHTML. 
     */
    static pStat(translator: Translator, translationId: string, ...args: string[]) {
        return `<p>${translator.format(translationId, ...args)}</p>`;
    }

    /**
     * Translates a stat, with importance. <p>
     * @param translator The translator instance.
     * @param translationId The ID in `camel_case`.
     * @param impArgs Important arguments.
     * @param args The extra arguments of the translation.
     * @returns The newly created innerHTML. 
     */
    static pStatWithImportance(translator: Translator, translationId: string, ...args: string[]) {
        const p = document.createElement("p");
        const tuple = translator.formatAsTuple(translationId, ...args);

        console.log(tuple)
        p.innerHTML = tuple[0];
        tuple[1].forEach(element => {
            p.innerHTML += element;
        });
        return p.outerHTML;
    }

    /**
     * Translates a stat. <h2>
     * @param translator The translator instance.
     * @param translationId The stat ID in `camel_case`.
     * @param args The extra arguments of the translation.
     * @returns The newly created innerHTML. 
     */
    static h2Stat(translator: Translator, translationId: string, ...args: string[]) {
        return `<h2>${translator.format(translationId, ...args)}</h2>`;
    }

    /**
     * Creates a typed button.
     * @param {string} type Type of the button.
     * @param {string} content Content of the button.
     */
    static typedButton(type: string, content: string) {
        let button = document.createElement("button");
        // We need this, otherwise TypeScript will throw this error:
        // TS2322: Type 'string' is not assignable to type '"button" | "submit" | "reset"'.
        // @ts-expect-error
        button.type = type;
        button.textContent = content;
        return button;
    }

    /**
     * Creates a buildings-wrapper.
     * @returns {HTMLDivElement}
     * <div class="buildings-wrapper">
            <span>Upgrades</span>
            <div class="upgrades"></div>
            <br>
            <span>Buildings</span>
            <div class="buy-bar">
                <button value="1">1</button>
                <button value="10">10</button>
                <button value="100">100</button>
            </div>
            <div class="buildings"></div>
            <div style="height: 250px"></div>
        </div>
     */
    static buildingsWrapper(translator: Translator): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "buildings-wrapper";
        div.innerHTML = [
            `<span>${translator.format("upgrades.upgrades")}</span>`,
            '<div class="upgrades"></div>',
            '<br>',
            `<span>${translator.format("building.buildings")}</span>`,
            '<div class="buy-bar">',
                '<button value="1">1</button>',
                '<button value="10">10</button>',
                '<button value="100">100</button>',
            '</div>',
            '<div class="buildings"></div>',
            '<div style="height: 250px"></div>'
        ].join("");
        return div;
    }

    /**
     * Creates a div which represents a building-tooltip.
     * @returns {HTMLDivElement}
     * <div class="building-tooltip" style="visibility: hidden;">
            <div></div>
            <h2>BUILDING</h2>
            <br>
            <br>
            <p>...</p>
        </div>
     */
    static buildingTooltip(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "building-tooltip";
        div.style.visibility = "hidden";
        div.innerHTML = [
            '<div></div>',
            '<h2>BUILDING</h2>',
            '<br>',
            '<br>',
            '<p>...</p>'
        ].join("");
        return div;
    }

    /**
     * Creates a div which represents an achievement-tooltip.
     * @returns {HTMLDivElement}
     *  <div class="achievement-tooltip" style="visibility: hidden;"><div></div></div>
     */
    static achievementTooltip(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "achievement-tooltip";
        div.style.visibility = "hidden";
        div.appendChild(document.createElement("div"));
        return div;
    }

    /**
     * Creates a div which represents an update-tooltip.
     * @returns {HTMLDivElement}
     *  <div class="upgrade-tooltip" style="visibility: hidden;">
            <div></div>
            <div className="nameIn"><h2>UPGRADE</h2></div>
            <br>
            <br>
            <p>...</p>
            <s>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</s>
            <p>...</p>
            <p class="cost">Cost: </p>
        </div>
     */
    static upgradeTooltip(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "upgrade-tooltip";
        div.style.visibility = "hidden";
        div.innerHTML = [
            '<div></div>',
            '<div className="nameIn"><h2>UPGRADE</h2></div>',
            '<br>',
            '<br>',
            '<p>...</p>',
            '<s>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</s>',
            '<p>...</p>',
            '<p class="cost">Cost: </p>',
        ].join("");
        return div;
    }

    /**
     * Creates a div which represents an effect-tooltip.
     * @returns {HTMLDivElement}
     * <div class="effect-tooltip" style="visibility: hidden;">
            <h2>EFFECT</h2>
            <p>Increase production by +0%! :)</p>
        </div>
     */
    static effectTooltip(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "effect-tooltip";
        div.style.visibility = "hidden";
        div.innerHTML = [
            '<h2>EFFECT</h2>',
            '<p>Increase production by +0%! :)</p>'
        ].join("");
        return div;
    }

    /**
     * Creates a div which represents an achievement.
     * @returns {HTMLDivElement}
     * <div class="achievement" style="visibility: hidden;">
            <p class="description">...</p>
            <div class="space"></div>
            <p class="how">...</p>
        </div>
     */
    static achievement(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "achievement";
        div.style.visibility = "hidden";
        div.innerHTML = [
            '<p class="description">...</p>',
            '<div class="space"></div>',
            '<p class="how">...</p>'
        ].join("");
        return div;
    }

    /**
     * Creates a div which represents a dialog.
     * @returns {HTMLDivElement}
     * <div class="dialog" style="visibility: hidden;">
            <div class="black">
                <div class="box"></div>
            </div>
        </div>
     */
    static dialog(): HTMLDivElement {
        let div = document.createElement("div");
        div.className = "dialog";
        div.style.visibility = "hidden";
        div.innerHTML = `
            <div class="black">
                <div class="box"></div>
            </div>
        `;
        return div;
    }
}

export default HtmlBuilder;