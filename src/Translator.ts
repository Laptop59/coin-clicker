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
        this.load(require.context('./languages/', false, /\.ts/));
    }

    /**
     * Loads a list of languages. This is used in the constructor, and **SHOULD NOT BE USED OUTSIDE**!
     * @param languages Languages to load.
     */
    private load(languages: __WebpackModuleApi.RequireContext) {
        for (let lang of languages.keys()) {
            const exports = languages(lang);
            if (!exports) {
                throwLangError(lang, "No export found.");
                continue;
            }
            const languageInfo = exports.default;
            if (!languageInfo) {
                throwLangError(lang, "No default export found.");
                continue;
            }
            if (typeof languageInfo !== "object" || Array.isArray(languageInfo)) {
                throwLangError(lang, "Language info must be a dictionary.");
                continue;
            }
            if (!languageInfo.id) {
                throwLangError(lang, "`id` was not found in the language declaration. It must be the language code, e.g. \"en-us\"");
                continue;
            }
            if (!languageInfo.name) {
                throwLangError(lang, "`name` was not found in the language declaration. It must be the language's name, e.g. \"English\"");
                continue;
            }
            if (!languageInfo.author) {
                throwLangError(lang, "`author` was not found in the language declaration. It must be the translator, e.g. \"Laptop59\"");
                continue;
            }
            if (!languageInfo.translations) {
                throwLangError(lang, "`translations` was not found in the language declaration. It must be the translations, e.g. {\"building.cursor.singular\": \"Cursor\"}");
                continue;
            }
            this.languages[languageInfo.id] = languageInfo;
        }
        this.logLanguages();

        function throwLangError(lang: string, error: string) {
            console.error(`Language error while parsing ${lang}: `, new SyntaxError(error));
        }
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

        return result ?? str;
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