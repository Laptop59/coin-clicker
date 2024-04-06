/**
 * NOTES:
 * 
 * - This is the translation file for English.
 * - It must return an object:
 * id: ISSO name of the language, for example en-us,
 * name: name of the language in that language, for example English,
 * author: translator contributor(s) of the language, for example Laptop59,
 * commify: a function that commifies a number (or shortens it)
 * format_building_description: a function that formats descriptions.
 * format_date: a function that formats a date (but not time!!!)
 * translations:
 *      where the KEYS are the translation IDs
 *      and the VALUES are the actual translation for THAT language.
 */

const TRANSLATION = {
    "id": "en-us",
    "name": "English",
    "author": "Laptop59 and AI",
    "commify": function (number: number, br = false, nodot = false): string {
        if (br) number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + TRANSLATION.commify(-number);
        if (!br && !nodot && number < 10) return number.toFixed(1);

        number = Math.floor(number);
        if (number < 1000000000) return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

        const illion = Math.floor(Math.log10(number) / 3);
        const starting = Math.pow(10, illion * 3);

        const float = Math.max(Math.floor(number / starting * 1000) / 1000, 1);

        function illionSuffix(illion: number) {
            if (illion == 100) return "centillion";
            if (illion == 101) return "uncentillion";
            if (illion < 10) {
                return ["million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"][illion - 1];
            }
            let unit = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"][illion % 10];
            let ten = ["", "dec", "vigint", "trigint", "quadragint", "quinquagint", "sexagint", "septuagint", "octogint", "nonagint"][Math.floor(illion / 10) % 10];
            return unit + ten + "illion";
        }

        return float.toFixed(3) + (br ? "&nbsp;<span>" : " ") + illionSuffix(illion - 1) + (br ? "</span>" : "");
    },
    "format_building_description": function (
        description: string,
        amount: number,
        rates: [number, number],
        total: number
    ) {
        /**
         * Converts a tuple of `CPC` and `CPS` respectively to a formatted string.
         * @param cpccps The tuple.
         * @param extra Extra info to add at the end, if necessary.
         * @returns The formatted string.
         */
        function convertToEnglish(cpccps: [number, number], extra = "") {
            if (!cpccps) return "coins";
            const [cpc, cps] = cpccps;
            const parts = []
            if (cpc > 0) {
                parts.push(TRANSLATION.commify(cpc, false, true) + " " + (cpc === 1 ? "coin" : "coins") + " per click")
            }
            if (cps > 0) {
                parts.push(TRANSLATION.commify(cps, false, true) + " " + (cps === 1 ? "coin" : "coins") + " per second")
            }
            return "<b>" + parts.join(" and ") + extra + "</b>";
        }

        let each = "", so_far = "";
        if (amount > 1) {
            each = ", each making " + convertToEnglish(<[number, number]>rates.map(x => x / amount));
        };
        if (amount) {
            so_far = "<b>&nbsp;" + this.commify(total) + " coins made so far.</b>";
        }

        return description.replace(
            "%1",
            convertToEnglish(rates) + each
        ) + so_far;
    },
    "format_date": function (date: Date) {
        const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    },
    "translations": {
        // Loading
        "loading_screen.loading_coin_clicker": "Loading Coin Clicker...",
        "cost": "Cost: ",

        ///////////
        // COINS //
        ///////////


        "coins.per_click": "%1/click",
        "coins.per_second": "%1/second",
        "coins.saved": "SAVED",


        /////////////
        // EFFECTS //
        /////////////
        // Name
        "effects.name.frenzy": "Frenzy",
        "effects.name.super_frenzy": "Super Frenzy",

        // Description
        "effects.description.frenzy": "Increases your production by <b>700%</b>",
        "effects.description.super_frenzy": "Increases your production by <b>8,700%</b>",
        ///////////////
        // BUILDINGS //
        ///////////////
        "building.buildings": "Buildings",

        "building.cursor.singular": "Cursor",
        "building.cursors.plural": "Cursors",
        "building.cursor.description": "Clicks to create %1.",

        "building.family.singular": "Family Business",
        "building.family.plural": "Family Businesses",
        "building.family.description": "Works with families to make %1.",

        "building.shop.singular": "Shop",
        "building.shop.plural": "Shops",
        "building.shop.description": "Sells basic items making %1.",

        "building.bank.singular": "Bank",
        "building.bank.plural": "Banks",
        "building.bank.description": "Uses interest to generate %1.",

        "building.carnival.singular": "Carnival",
        "building.carnival.plural": "Carnivals",
        "building.carnival.description": "Sells tickets and souvenirs cashing out %1.",

        "building.power_plant.singular": "Power Plant",
        "building.power_plant.plural": "Power Plants",
        "building.power_plant.description": "Generates coin energy to be converted to coins, generating %1 of energy.",

        "building.industry.singular": "Industry",
        "building.industry.plural": "Industries",
        "building.industry.description": "Produces coins and smoke, which is converted into more shiny coins, producing %1.",

        "building.lab.singular": "Technological Lab",
        "building.lab.plural": "Technological Labs",
        "building.lab.description": "Finds and creates new technology, which all together technologically code in %1.",

        ///////////
        // STATS //
        ///////////
        "stats.general_title": "General",
        "stats.owned_coins": "Coins currently owned: %1%2",
        "stats.total_coins": "Total coins made: %1%2",
        "stats.raw_coins_per_click": "Raw coins per click: %1%2",
        "stats.raw_coins_per_second": "Raw coins per second: %1%2",
        "stats.clicks_done": "Clicks done: %1%2",
        "stats.start_date": "Start Date: %1",
        "stats.coins_destroyed": "Coins Destroyed: %1%2",
        "stats.buildings": "Buildings: %1",
        "stats.multiplier": "Current multiplier percentage: %1%",
        "stats.achievements_title": "Achievements",
        "stats.unlocked_achievements": "Achievements unlocked: %1/%2",
        "stats.achievement_multiplier": "Achievement multiplier percentage: %1% (each achievement gives +15%)",

        /////////////
        // OPTIONS //
        /////////////
        "options.basic_title": "Basic",
        "options.game_data_title": "Game Data",
        "options.save_to_browser": "Save to browser (CTRL+S)",
        "options.change_language": "Change language",
        "options.autosave": "Autosave",
        "options.loop_music": "Loop music",
        "options.play_sounds": "Play sounds",

        "options.save_game_data.main": "Save your game data %1 or %2.",
        "options.save_game_data.1": "into text",
        "options.save_game_data.2": "into a file",

        "options.load_game_data.main": "Load your game data %1 or %2.",
        "options.load_game_data.1": "from text",
        "options.load_game_data.2": "from a file",

        "options.unsafe_title": "Unsafe",
        "options.wipe_save": "Wipe save",


        /////////////
        // DIALOGS //
        ////////////


        "dialogs.ok": "OK",

        "dialogs.wipe.wipe_save": "Wipe Save",
        "dialogs.wipe.warning_1": "Are you sure you want to <b style=\"color: red;\">WIPE THIS SAVE</b>?<br>If you press YES, all your progress, including your coins, achievements and buildings will disappear!",
        "dialogs.wipe.yes": "YES!",
        "dialogs.wipe.no": "No, cancel this dialog.",
        "dialogs.wipe.warning_2": "This action cannot be undone. Are you actually 100% sure?<br><b>Don't forget that this is irreversible!</b><br>You might want to think carefully before clicking YES.",

        "dialogs.save.info": "Your save code for <b>Coin Clicker</b>:",
        "dialogs.save.title": "Save Code",

        "dialogs.load.info": "Input your save code for <b>Coin Clicker</b>:",
        "dialogs.load.title": "Load Code",
        "dialogs.load.load": "Load",
        "dialogs.load.cancel": "Cancel",

        "dialogs.load.haha_nice_try": "Haha. Nice try.",
        "dialogs.load.invalid_save_code": "Save code is invalid.",

        "dialogs.error.fatal_error": "Fatal Error",
        "dialogs.error.info": "We're really sorry for the inconvience this has caused, but the game has experienced a fatal error.<br><br>Please reload your page.",
        "dialogs.error.reload": "Reload",

        "dialogs.change_language.info": "Select the language that you want to change to:<br><sub>Note: Changing the language will save and reload your game.</sub>",


        //////////////
        // UPGRADES //
        //////////////
        // NAME
        "upgrades.name.cursor_1": "Calcium cursors",
        "upgrades.name.family_1": "Joint families",
        "upgrades.name.shop_1": "Advertised shops",
        "upgrades.name.bank_1": "Different coloured-coins",
        "upgrades.name.carnival_1": "Crazier stunts",
        "upgrades.name.power_plant_1": "Coin energy homes",
        "upgrades.name.cursor_2": "Silver cursors",
        "upgrades.name.family_2": "Shopkeeper families",
        "upgrades.name.shop_2": "Megashops",
        "upgrades.name.bank_2": "Coin liquid-made vaults",
        "upgrades.name.carnival_2": "Extreme-scummy arcade games",
        "upgrades.name.power_plant_2": "Coin energized generators",
        "upgrades.name.cursor_3": "Crystal clear cursors",
        "upgrades.name.cursor_4": "Butterfly cursors",
        "upgrades.name.cursor_5": "Autoclick cursors",
        "upgrades.name.cursor_6": "Cursors inside cursors",

        // DESCRIPTION
        "upgrades.description.cursor_1": "A stronger cursor to click more coins for you.",
        "upgrades.description.family_1": "A bigger family to work with you and make more coins for you.",
        "upgrades.description.shop_1": "Uses advertisements to sell more items.",
        "upgrades.description.bank_1": "Uses different kinds of coins to make more interest.",
        "upgrades.description.carnival_1": "Uses more kinds of stunts to cash out more coins.",
        "upgrades.description.power_plant_1": "Gives out coin energy to homes using it, generating more fees for coins.",
        "upgrades.description.cursor_2": "A shiny cursor which uses its shininess to click more coins.",
        "upgrades.description.family_2": "Families to sell more kinds of items for you.",
        "upgrades.description.shop_2": "Uses supermarkets without perception of time to sell more items.",
        "upgrades.description.bank_2": "Uses liquid coin metal in vaults to generate more coins.",
        "upgrades.description.carnival_2": "Cashes out more coins by bankrupting players.",
        "upgrades.description.power_plant_2": "Generates more coin energy, used for more generators for the same.",
        "upgrades.description.cursor_3": "A very hard diamond cursor which uses its strength to click more coins.",
        "upgrades.description.cursor_4": "A cursor which uses butterfly clicking to create more coins.",
        "upgrades.description.cursor_5": "A cursor with uses an auto-clicking program to create more coins.",
        "upgrades.description.cursor_6": "A cursor which uses a paradox to create more coins.",

        // USE
        "upgrades.upgrades": "Upgrades",
        "upgrades.use.cursor_1": "<b>Doubles</b> the production of cursors.",
        "upgrades.use.family_1": "<b>Triples</b> the production of family businesses.",
        "upgrades.use.shop_1": "<b>Triples</b> the production of shops.",
        "upgrades.use.bank_1": "<b>Doubles</b> the production of banks.",
        "upgrades.use.carnival_1": "<b>Doubles</b> the production of carnivals.",
        "upgrades.use.power_plant_1": "<b>Doubles</b> the production of power plants.",
        "upgrades.use.cursor_2": "<b>Triples</b> the production of cursors.",
        "upgrades.use.family_2": "Shops increase production by <b>+1%</b> for every family business.<br><b>Multiplies</b> the production of family businesses <b>by 10</b>.",
        "upgrades.use.shop_2": "<b>Multiplies</b> the production of shops <b>by 5</b>.",
        "upgrades.use.bank_2": "<b>Multiplies</b> the production of banks <b>by 7</b>.",
        "upgrades.use.carnival_2": "<b>Triples</b> the production of carnivals.",
        "upgrades.use.power_plant_2": "<b>Triples</b> the production of power plants.",
        "upgrades.use.cursor_3": "<b>Multiplies</b> the production of cursors <b>by 8</b>.",
        "upgrades.use.cursor_4": "Every non-cursor building grants <b>+1% more</b> the production of cursors.",
        "upgrades.use.cursor_5": "Every non-cursor building grants <b>+2% more</b> the production of cursors, for a total of <b>+3.02%</b>.",
        "upgrades.use.cursor_6": "Every non-cursor building grants <b>+3% more</b> the production of cursors, for a total of <b>+6.11%</b>.",

        //////////////////
        // ACHIEVEMENTS //
        //////////////////
        // CATEGORY (IN GENERAL)
        "achievements.categories.count": "Achievements Unlocked: %1/%2",

        // CATEGORY TITLES
        "achievements.category.total_coins": "Total coins",
        "achievements.category.cps": "Coins per second",
        "achievements.category.building_milestones": "Building milestones",
        "achievements.category.clicks": "Click",
        "achievements.category.destruction": "Destruction",

        // NAME
        "achievements.name.total_coins_1": "Shiny yellow ovals",
        "achievements.name.total_coins_2": "Some bank",
        "achievements.name.total_coins_3": "Maybe a few more",
        "achievements.name.total_coins_4": "Need more piggy banks",
        "achievements.name.total_coins_5": "Basically a trillicoinaire",
        "achievements.name.total_coins_6": "I wonder if I can deposit them",
        "achievements.name.total_coins_7": "Even the marine life need money, y'know",
        "achievements.name.total_coins_8": "The golden coin",
        "achievements.name.total_coins_9": "When the coins stack to the moon",
        "achievements.name.total_coins_10": "Wishing for more coins",
        "achievements.name.total_coins_11": "The world is a pocket-sized sun",
        "achievements.name.cps_1": "Some serious bank(s)",
        "achievements.name.cps_2": "Stack like chips",
        "achievements.name.cps_3": "The biggest game of checkers",
        "achievements.name.cps_4": "Sells like hot coins, not cakes",
        "achievements.name.cps_5": "Gold is old",
        "achievements.name.cps_6": "Who cares about cash",
        "achievements.name.cps_7": "Doing laundry? Please insert 1 million coins to continue",
        "achievements.name.cps_8": "It's raining <b>COINS</b>",
        "achievements.name.cps_9": "The sun is a giant hydrogen flaming coin",
        "achievements.name.cps_10": "The atoms are getting beaten",
        "achievements.name.cps_11": "What even is life anymore?",
        "achievements.name.clicks_1": "Left click",
        "achievements.name.clicks_2": "Click click click",
        "achievements.name.clicks_3": "Don't you dare use keys for clicking",
        "achievements.name.clicks_4": "Autoclickers have a bad side",
        "achievements.name.clicks_5": "Put the coins in the bag",
        "achievements.name.buildings_1": "Coinstruction",
        "achievements.name.buildings_2": "Building with coins",
        "achievements.name.buildings_3": "Will these fall and get demolished?",
        "achievements.name.buildings_4": "An entire coin city",
        "achievements.name.buildings_5": "100% pure coins",
        "achievements.name.buildings_6": "Building is my hobby",
        "achievements.name.destroy_1": "What the fell?",
        "achievements.name.destroy_2": "Just stop!",
        "achievements.name.destroy_3": "Serial destroyer",
        "achievements.name.destroy_orange": "No way..? Is it magic??",
        "achievements.name.destroy_orange_super": "WAAOOOOOOOOOOOOOO",

        // DESCRIPTION
        "achievements.description.total_coins_1": "Some shiny ovals... maybe I should collect more!",
        "achievements.description.total_coins_2": "These cost pennies",
        "achievements.description.total_coins_3": "I NEED MORE",
        "achievements.description.total_coins_4": "<i>Hello, is this Piggy Service? Yes, I need 10,000 more piggy banks! What do you mean they are sold out?</i>",
        "achievements.description.total_coins_5": "<b>NEWS:</b> Hundreds of cursors start appearing out of thin air!",
        "achievements.description.total_coins_6": "Trying to search for a bank that will keep your stupid amount of coins? Well, don't look furthe--OW! That hurt!",
        "achievements.description.total_coins_7": "<b>NEWS:</b> Some person is dumping millions of coins into the ocean for some reason. I think the person is moving there or something.",
        "achievements.description.total_coins_8": "This coin is the most praised coin in the world, dubbed the <b>GOLDEN COIN</b>!",
        "achievements.description.total_coins_9": "Who needs rockets when you have coins?",
        "achievements.description.total_coins_10": "<b>NEWS:</b> People are using oceans as wishing wells for cool stuff, like leprechauns!",
        "achievements.description.total_coins_11": "According to the <i>Coin Astronomy Organization</i>, even the Sun can't outlast the Earth's shininess!",
        "achievements.description.cps_1": "By serious bank, I mean actual BANKS!",
        "achievements.description.cps_2": "Don't use them in casinos!",
        "achievements.description.cps_3": "How long would a game like this take to end, and build? Not to mention painting half of them!",
        "achievements.description.cps_4": "This is not a bakery, ok? This is a mint...",
        "achievements.description.cps_5": "Don't even think about melting these and starting a foundry!",
        "achievements.description.cps_6": "Cash is trash, because it rhymes!",
        "achievements.description.cps_7": "You think that's bad? A vending machine asks for exactly 1 billion 234 million 567 thousand 890 coins! Don't even get me started on an arcade game...",
        "achievements.description.cps_8": "Some guy paid the clouds to drop millions of coins from the sky, and I don't know why, but maybe he just wanted to do a giveaway!",
        "achievements.description.cps_9": "Is this mythology?",
        "achievements.description.cps_10": "<b>NEWS:</b> Everything in the observable universe is turning to <i>COIN MATTER-IAL</i>!",
        "achievements.description.cps_11": "All I can think about are coins, coins, and more coins... Was this a bad idea?",
        "achievements.description.clicks_1": "Oh, casually clicking the big coin, huh?",
        "achievements.description.clicks_2": "The big coin doesn't like your thinking...",
        "achievements.description.clicks_3": "Used <b>Click</b>! It's not very effective... Dealt <sub><sub>0.000000001</sub>% of damage!</sub>",
        "achievements.description.clicks_4": "The big coin is constantly getting troubled.",
        "achievements.description.clicks_5": "Hi, big coin! This is a robbery! <b>NOW GIVE ME YOUR COINS <b>OR ELSE</b></b>",
        "achievements.description.buildings_1": "Wait. How do family businesses get constructed?",
        "achievements.description.buildings_2": "WE ARE LITERALLY BUILDING WITH COINS!",
        "achievements.description.buildings_3": "Who knows...",
        "achievements.description.buildings_4": "It is 5,000 miles away from my location... FAAAA-",
        "achievements.description.buildings_5": "Hey guys! I recently found this new country, called <i>Coinice</i>! You should check it out!",
        "achievements.description.buildings_6": "The buildings are building the buildings which are building buildings which are also building buildings which are themselves also building buildings which are also themselves building buildings which are also themselves building buildings which are also themselves building buildings which are also themselves building buildings which are also building buildings, that are building building builders!",
        "achievements.description.destroy_1": "What happened to that coin???",
        "achievements.description.destroy_2": "You're being a menace to these coins.<br><b>NEWS:</b> 15 coins missing without a trace!",
        "achievements.description.destroy_3": "Oh well, you probably produce more coins than what you destroy.",
        "achievements.description.destroy_orange": "Did the coin gods take the sacifice to reward...us?",
        "achievements.description.destroy_orange_super": "Are we worthy?",

        // HOW
        "achievements.how.total_coins_1": "Make a total of <b>100 coins</b>.",
        "achievements.how.total_coins_2": "Make a total of <b>10,000 coins</b>.",
        "achievements.how.total_coins_3": "Make a total of <b>1,000,000 coins</b>.",
        "achievements.how.total_coins_4": "Make a total of <b>1 billion coins</b>.",
        "achievements.how.total_coins_5": "Make a total of <b>1 trillion coins</b>.",
        "achievements.how.total_coins_6": "Make a total of <b>1 quadrillion coins</b>.",
        "achievements.how.total_coins_7": "Make a total of <b>1 quintillion coins</b>.",
        "achievements.how.total_coins_8": "Make a total of <b>1 sextillion coins</b>.",
        "achievements.how.total_coins_9": "Make a total of <b>1 septillion coins</b>.",
        "achievements.how.total_coins_10": "Make a total of <b>1 octillion coins</b>.",
        "achievements.how.total_coins_11": "Make a total of <b>1 nonillion coins</b>.",
        "achievements.how.cps_1": "Make a <i>raw</i> <b>500 coins</b> per second.",
        "achievements.how.cps_2": "Make a <i>raw</i> <b>50,000 coins</b> per second.",
        "achievements.how.cps_3": "Make a <i>raw</i> <b>5,000,000 coins</b> per second.",
        "achievements.how.cps_4": "Make a <i>raw</i> <b>500,000,000 coins</b> per second.",
        "achievements.how.cps_5": "Make a <i>raw</i> <b>50 billion coins</b> per second.",
        "achievements.how.cps_6": "Make a <i>raw</i> <b>5 trillion coins</b> per second.",
        "achievements.how.cps_7": "Make a <i>raw</i> <b>5 quadrillion coins</b> per second.",
        "achievements.how.cps_8": "Make a <i>raw</i> <b>5 quintillion coins</b> per second.",
        "achievements.how.cps_9": "Make a <i>raw</i> <b>5 sextillion coins</b> per second.",
        "achievements.how.cps_10": "Make a <i>raw</i> <b>5 septillion coins</b> per second.",
        "achievements.how.cps_11": "Make a <i>raw</i> <b>5 octillion coins</b> per second.",
        "achievements.how.clicks_1": "Click the big coin <b>100</b> times.",
        "achievements.how.clicks_2": "Click the big coin <b>500</b> times.",
        "achievements.how.clicks_3": "Click the big coin <b>1,000</b> times.",
        "achievements.how.clicks_4": "Click the big coin <b>2,500</b> times.",
        "achievements.how.clicks_5": "Click the big coin <b>5,000</b> times.",
        "achievements.how.buildings_1": "Have a total of <b>50</b> buildings.",
        "achievements.how.buildings_2": "Have a total of <b>100</b> buildings.",
        "achievements.how.buildings_3": "Have a total of <b>200</b> buildings.",
        "achievements.how.buildings_4": "Have a total of <b>300</b> buildings.",
        "achievements.how.buildings_5": "Have a total of <b>400</b> buildings.",
        "achievements.how.buildings_6": "Have a total of <b>500</b> buildings.",
        "achievements.how.destroy_1": "Destroy <b>a falling coin</b>.",
        "achievements.how.destroy_2": "Destroy <b>15 falling coins</b>.",
        "achievements.how.destroy_3": "Destroy <b>75 falling coins</b>.",
        "achievements.how.destroy_orange": "Destroy an <b>orange coin</b>.",
        "achievements.how.destroy_orange_super": "Destroy an <b>orange coin</b> and get the <b>super frenzy</b> effect."
    }
};

export default TRANSLATION;