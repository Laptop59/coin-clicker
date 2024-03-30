/**
 * NOTES:
 * 
 * - This is the translation file as a baseless fallback.
 * - It must return an object:
 *      where the KEYS are the translation IDs
 *      and the VALUES are the actual translation for THAT language.
 */

const TRANSLATION = {
    "id": "_fb",
    "name": "Fallback",
    "author": "Laptop59",
    "commify": function(number: number, br = false, nodot = false): string {
        if (br) number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + TRANSLATION.commify(-number);
        if (!br && !nodot && number < 10) return number.toFixed(1);

        number = Math.floor(number);
        return "" + number;
    },
    
    "format_date": function(date: Date): string {
        const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    },


    "translations": {
        /////////////
        // OPTIONS //
        /////////////
        "options.save_game_data.main": "s%1%2",
        "options.save_game_data.1": "x",
        "options.save_game_data.2": "f",

        "options.load_game_data.main": "l%1%2",
        "options.load_game_data.1": "x",
        "options.load_game_data.2": "f",
    }
};

export default TRANSLATION;