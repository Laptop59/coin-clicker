/**
 * NOTES:
 * 
 * - This is the translation file for the fallback.
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
    "is_fallback": true,
    "id": "_fb",
    "name": "Fallback",
    "author": "Laptop59",
    "commify": function(number: number, br = false, nodot = false): string {
        if (br) number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + TRANSLATION.commify(-number);
        if (!br && !nodot && number < 10) return number.toFixed(1);

        number = Math.floor(number);
        return number.toString();
    },
    "format_building_description": function (
        description: string,
        amount: number,
        rates: [number, number],
        total: number,
        buildings: number
    ) {
        return "";
    },
    "format_date": function(date: Date): string {
        const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    },
    "translations": {}
};

export default TRANSLATION;