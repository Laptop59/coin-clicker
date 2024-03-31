/**
 * Represents information of a language.
 */
interface Language {
    /**
     * The ID of the language.
     */
    id: string

    /**
     * The name of the language.
     */
    name: string,
    
    /**
     * The translator of the language.
     */
    author: string,

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
    commify: (number: number, br?: boolean, nodot?: boolean) => string,

    /**
     * Formats a date into this format:\
     * **Month** **DD**, **YYYY**
     * @param date Date to format.
     * @returns The formatted date as a string.
     */
    format_date: (date: Date) => string,

    /**
     * Formats a building description.
     * @param description The formatted string. (it should be already formatted, but the parameters NOT filled.)
     * @param amount Number of buildings owned.
     * @param rates The total rates of the type of the building.
     * @param total Number of coins made by the building type.
     * @returns A formatted description.
     */
    format_building_description: (description: string, amount: number, rates: [number, number], total: number) => string

    /**
     * The translations.
     */
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
    fallback = "_fb";

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
            if (!languageInfo.commify) {
                throwLangError(lang, "`commify` was not found in the language declaration. It must be a commifier function, e.g. (number: number) => number.");
                continue;
            }
            if (!languageInfo.format_building_description) {
                throwLangError(lang, "`format_building_description` was not found in the language declaration. It must be a building-description formatter, e.g. (description: string, amount: number, rates: [number, number], total: number, buildings: number) => ... .");
            }
            if (!languageInfo.format_date) {
                throwLangError(lang, "`format_date` was not found in the language declaration. It must be a date formatter, e.g. (date: Date) => date.toString().");
                continue;
            }
            if (!languageInfo.translations) {
                throwLangError(lang, "`translations` was not found in the language declaration. It must be the translations, e.g. {\"building.cursor.singular\": \"Cursor\"}");
                continue;
            }
            this.languages[languageInfo.id] = languageInfo;
        }

        // At least one function must be available.

        this.logLanguages();

        function throwLangError(lang: string, error: string) {
            console.error(`Language error while parsing ${lang}: `, new SyntaxError(error));
        }
    }

    /**
     * Logs all the languages in the translator.
     */
    logLanguages() {
        console.log("[LANGUAGES] Loaded languages:\n" + Object.entries(this.languages).map(([id, data]) => "+ " + data.name + " (" + id + ")\n").join(""))
    }

    /**
     * Gets the current language object.
     * @returns The current language
     */
    getCurrent() {
        if (Object.keys(this.languages).length < 1) throw new Error("No languages are available.");
        return this.languages[this.selected];
    }

    /**
     * Gets the fallback language object.
     * @returns The fallback language
     */
    getFallback() {
        if (Object.keys(this.languages).length < 1) throw new Error("No languages are available.");
        return this.languages?.[this.fallback];
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
    commify (number: number, br?: boolean, nodot?: boolean): string {
        return (this.getCurrent() ?? this.getFallback())?.commify(number, br, nodot) ?? number;
    }

    /**
     * Formats a date into this format:\
     * **Month** **DD**, **YYYY**
     * @param date Date to format.
     * @returns The formatted date as a string.
     */
    formatDate(date: Date) {
        return (this.getCurrent() ?? this.getFallback())?.format_date(date);
    }

    /**
     * Gets the translated string of a string ID.
     * @param str The ID of the translated string to translate.
     * @returns The translated string.
     */
    format(str: string, ...args: string[]) {
        return this.formatAsTuple(str, ...args)[0];
    }

    /**
     * Gets the translated string of a string ID, as a tuple.
     * @param str The ID of the translated string to translate.
     * @returns The translated string, along with the unused args tuple.
     */
    formatAsTuple(str: string, ...args: string[]): [string, string[]] {
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
                return [str, args];
            } else {
                console.warn("[TRANSLATION] Missing translation for key " + str);
                return this.fillArgs(fallbackResult, args);
            }
        }

        return this.fillArgs(result ?? str, args);
    }

    /**
     * Fills arguments (`%n`) with values.
     * @param str String to fill.
     * @param args Arguments.
     * @returns The tuple of the filled string, and the unused strings.
     */
    fillArgs(str: string, args: string[]): [string, string[]] {
        var str = str;
        var unused: string[] = [];
        args.forEach(a => unused.push(a));
        for (let i = 0; i < args.length; i++) {
            if (str.includes("%" + (i+1))) unused[i] = "";
            str = str.replace("%" + (i+1), args[i]);
        }
        return [str, unused.filter(arg => !!arg)];
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
    formatBuildingDescription(id: string, amount: number, rates: [number, number], total: number) {
        const description = this.format("building." + id + ".description");
        return (this.getCurrent() ?? this.getFallback())?.format_building_description(description, amount, rates, total);
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