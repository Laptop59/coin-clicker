class Translator {
    languages = {};
    selected = "en-us";
    fallback = "en-us";
    warns = [];

    constructor() {
        // Load all the languages in /languages
        this.load(require.context('./languages/', false, /\.json/));
    }

    load(languages) {
        for (let lang of languages.keys()) {
            const paths = lang.split("/");
            const id = paths[paths.length - 1];
            let data = languages(lang);
            this.languages[id.split(".json")[0]] = data;
        }
        this.logLanguages();
    }

    logLanguages() {
        console.log("[LANGUAGES] Loaded languages:\n" + Object.entries(this.languages).map(([id, data]) => "+ " + data.name + " (" + id + ")\n"))
    }

    getCurrent() {
        return this.languages[this.selected];
    }

    getFallback() {
        return this.languages?.[this.fallback];
    }

    format(str) {
        const result = this.getCurrent()?.translations[str];
        if (!this.warns.includes(str) && !result) {
            let level = 1;
            this.warns.push(str);

            const fallbackResult = this.getFallback()?.translations?.[str];
            if (!fallbackResult) {
                level = 2;
            }

            if (level > 1) {
                console.error("[TRANSLATION] Unknown key ", str);
                return str;
            } else {
                console.warn("[TRANSLATION] Missing translation for key " + str);
                return fallbackResult;
            }
        }

        return result;
    }

    formatBuilding(id, isPlural) {
        return this.format("building." + id + (isPlural ? ".plural" : ".singular"));
    }

    formatBuildingDescription(id) {
        return this.format("building." + id + ".description");
    }

    formatAchievementCategory(id) {
        return this.format("achievements.category." + id);
    }

    formatAchievementCategoryCount(count, max) {
        return this.format("achievements.categories.count").replace("%1", count).replace("%2", max);
    }
}

export default Translator;