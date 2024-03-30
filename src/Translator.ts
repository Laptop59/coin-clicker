/**
 * Represents information of a language.
 */
interface Language {
    name: string,
    author: string,
    translations: {
        [key: string]: string
    }
}

/**
 * A class that translates ID strings into language strings.
 */
class Translator {
    /**
     * The language dictionary stored by the game.
     */
    languages: {[key: string]: Language} = {};

    /**
     * The selected language.
     */
    selected = "en-us";

    /**
     * The fallback language chosen. This is used, for example, if a translation for another language doesn't exist.
     */
    fallback = "en-us";

    /**
     * Warnings about the chosen language.
     */
    warns: string[] = [];

    /**
     * Creates a new `Translator`. It also scans for languages,
     */
    constructor() {
        // Load all the languages in /languages
        this.load(require.context('./languages/', false, /\.json/));
    }

    /**
     * Loads a list of languages. This is used in the constructor, and **SHOULD NOT BE USED OUTSIDE**!
     * @param languages Languages to load.
     */
    private load(languages: __WebpackModuleApi.RequireContext) {
        for (let lang of languages.keys()) {
            const paths = lang.split("/");
            const id = paths[paths.length - 1];
            let data = languages(lang);
            this.languages[id.split(".json")[0]] = data;
        }
        this.logLanguages();
    }

    /**
     * Logs all the languages in the translator.
     */
    logLanguages() {
        console.log("[LANGUAGES] Loaded languages:\n" + Object.entries(this.languages).map(([id, data]) => "+ " + data.name + " (" + id + ")\n"))
    }

    /**
     * Gets the current language object.
     * @returns The current language
     */
    getCurrent() {
        return this.languages[this.selected];
    }

    /**
     * Gets the fallback language object.
     * @returns The fallback language
     */
    getFallback() {
        return this.languages?.[this.fallback];
    }

    /**
     * Gets the translated string of a string ID.
     * @param str The ID of the translated string to translate.
     * @returns The translated string.
     */
    format(str: string) {
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

    /**
     * Formats a building from ID into a display string.
     * @param id ID of the building.
     * @param isPlural Whether it wants the plural version or not.
     * @returns The translated string of the building.
     */
    formatBuilding(id: string, isPlural: boolean = false) {
        return this.format("building." + id + (isPlural ? ".plural" : ".singular"));
    }

    /**
     * Formats a building's description from ID into a display string.
     * @param id ID of the building.
     * @returns The translated string of the building's description.
     */
    formatBuildingDescription(id: string) {
        return this.format("building." + id + ".description");
    }

    /**
     * Formats an achievement category.
     * @param id ID of the category.
     * @returns The translated string of the category.
     */
    formatAchievementCategory(id: string) {
        return this.format("achievements.category." + id);
    }

    /**
     * Formats an achievement progress in text.
     * @param count The number of achievements owned by the player in the category (`%1`).
     * @param max The number of achievements in the category (`%2`).
     * @returns The translated string of the progress.
     */
    formatAchievementCategoryCount(count: string, max: string) {
        return this.format("achievements.categories.count").replace("%1", count).replace("%2", max);
    }
}

export default Translator;