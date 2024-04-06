/**
 * NOTES:
 * 
 * - This is the translation file for French.
 * - It must return an object:
 * id: ISSO name of the language, for example en-us,
 * name: name of the language in that language, for example English
 * author: translator contributor(s) of the language, for example Laptop59,
 * commify: a function that commifies a number (or shortens it)
 * format_building_description: a function that formats descriptions.
 * format_date: a function that formats a date (but not time!!!)
 * translations:
 *      where the KEYS are the translation IDs
 *      and the VALUES are the actual translation for THAT language.
 */

const TRANSLATION = {
    "id": "fr-fr",
    "name": "Français",
    "author": "Laptop59 and AI",
    "commify": function (number: number, br = false, nodot = false): string {
        if (br) number = Math.floor(number);

        if (!isFinite(number)) return number + "";
        if (number < 0) return "-" + TRANSLATION.commify(-number);
        if (!br && !nodot && number < 10) return number.toFixed(1).replace(".", ",");

        number = Math.floor(number);
        if (number < 1000000000) return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");

        const illion = Math.floor(Math.log10(number) / 3);
        const starting = Math.pow(10, illion * 3);

        const float = Math.max(Math.floor(number / starting * 1000) / 1000, 1);

        function illionSuffix(illion: number) {
            if (illion < 19) {
                return ["million", "milliard", "billion", "billiard", "trillion", "trilliard", "quadrillion", "quadrilliard", "quintillion", "quintilliard", "sextillion", "sextilliard", "septillion", "septilliard", "octillion", "octilliard", "nonillion", "nonilliard"][illion - 1];
            }
            const num = Math.floor((illion + 1) / 2)
            let unit = ["", "un", "duo", "tre", "quattuor", "quin", "sex", "septen", "octo", "novem"][num % 10];
            let ten = ["", "dec", "vigint", "trigint", "quadragint", "quinquagint", "sexagint", "septuagint", "octogint", "nonagint"][Math.floor(num/10) % 10];
            return unit + ten + ((illion % 2 == 1) ? "illion" : "illard");
        }

        return float.toFixed(3).replace(".", ",") + (br ? "&nbsp;<span>" : " ") + illionSuffix(illion - 1) + (br ? "</span>" : "");
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
        function convertToFr(cpccps: [number, number], extra = "") {
            if (!cpccps) return "pièces";
            const [cpc, cps] = cpccps;
            const parts = []
            if (cpc > 0) {
                parts.push(TRANSLATION.commify(cpc, false, true) + " " + (cpc === 1 ? "pièce" : "pièces") + " par clic")
            }
            if (cps > 0) {
                parts.push(TRANSLATION.commify(cps, false, true) + " " + (cps === 1 ? "pièce" : "pièces") + " par seconde")
            }
            return "<b>" + parts.join(" et ") + extra + "</b>";
        }

        let each = "", so_far = "";
        if (amount > 1) {
            each = ", qui faisent chacune " + convertToFr(<[number, number]>rates.map(x => x / amount));
        };
        if (amount) {
            so_far = "<b>&nbsp;" + this.commify(total) + " pièces faites jusqu'à présent.</b>";
        }

        return description.replace(
            "%1",
            convertToFr(rates) + each
        ) + so_far;
    },
    "format_date": function (date: Date) {
        const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
    },
    "translations": {
        // Loading
        "loading_screen.loading_coin_clicker": "Chargement de Coin Clicker...",
        "cost": "Coût : ",

        ////////////
        // PIÈCES //
        ////////////

        "coins.per_click": "%1/clic",
        "coins.per_second": "%1/seconde",
        "coins.saved": "SAUVÉ",


        ////////////
        // EFFETS //
        ////////////
        // Nom
        "effects.name.frenzy": "Furie",
        "effects.name.super_frenzy": "Super Furie",

        // Description
        "effects.description.frenzy": "Augmente votre production de <b>700 %</b>",
        "effects.description.super_frenzy": "Augmente votre production de <b>8 700 %</b>",

        ///////////////
        // BÂTIMENTS //
        ///////////////
        "building.buildings": "Bâtiments",

        "building.cursor.singular": "Curseur",
        "building.cursors.plural": "Curseurs",
        "building.cursor.description": "Clics pour créer %1.",

        "building.family.singular": "Entreprise familiale",
        "building.family.plural": "Entreprises familiales",
        "building.family.description": "Travaille avec des familles pour produire %1.",

        "building.shop.singular": "Magasin",
        "building.shop.plural": "Magasins",
        "building.shop.description": "Vend des articles de base pour produire %1.",

        "building.bank.singular": "Banque",
        "building.bank.plural": "Banques",
        "building.bank.description": "Utilise l'intérêt pour générer %1.",

        "building.carnival.singular": "Carnaval",
        "building.carnival.plural": "Carnavals",
        "building.carnival.description": "Vend des billets et des souvenirs pour encaisser %1.",

        "building.power_plant.singular": "Centrale électrique",
        "building.power_plant.plural": "Centrales électriques",
        "building.power_plant.description": "Génère de l'énergie de pièces à convertir en pièces, produisant %1 d'énergie.",

        "building.industry.singular": "Industrie",
        "building.industry.plural": "Industries",
        "building.industry.description": "Produit des pièces et de la fumée, qui est convertie en pièces plus brillantes, produisant %1.",

        "building.lab.singular": "Laboratoire technologique",
        "building.lab.plural": "Laboratoires technologiques",
        "building.lab.description": "Trouve et crée de nouvelles technologies, qui ensemble codent technologiquement en %1.",

        ///////////
        // STATS //
        ///////////
        "stats.general_title": "Général",
        "stats.owned_coins": "Pièces actuellement possédées : %1%2",
        "stats.total_coins": "Total des pièces fabriquées : %1%2",
        "stats.raw_coins_per_click": "Pièces brutes par clic : %1%2",
        "stats.raw_coins_per_second": "Pièces brutes par seconde : %1%2",
        "stats.clicks_done": "Clics effectués : %1%2",
        "stats.start_date": "Date de début le : %1",
        "stats.coins_destroyed": "Pièces détruites : %1%2",
        "stats.buildings": "Bâtiments : %1",
        "stats.multiplier": "Pourcentage de multiplicateur actuel : %1 %",
        "stats.achievements_title": "Succès",
        "stats.unlocked_achievements": "Succès déverrouillés : %1/%2",
        "stats.achievement_multiplier": "Pourcentage de multiplicateur de succès : %1 % (chaque succès donne + 15 %)",

        /////////////
        // OPTIONS //
        /////////////
        "options.basic_title": "Basique",
        "options.game_data_title": "Données du jeu",
        "options.save_to_browser": "Enregistrer dans le navigateur (CTRL+S)",
        "options.change_language": "Changer de langue",
        "options.autosave": "Sauvegarde automatique",
        "options.loop_music": "Boucle musicale",
        "options.play_sounds": "Jouer les sons",

        "options.save_game_data.main": "Enregistrez vos données de jeu %1 ou %2.",
        "options.save_game_data.1": "en texte",
        "options.save_game_data.2": "dans un fichier",

        "options.load_game_data.main": "Chargez vos données de jeu %1 ou %2.",
        "options.load_game_data.1": "à partir du texte",
        "options.load_game_data.2": "à partir d'un fichier",

        "options.unsafe_title": "Non sécurisé",
        "options.wipe_save": "Effacer la sauvegarde",


        ///////////////
        // DIALOGUES //
        ///////////////

        "dialogs.ok": "OK",

        "dialogs.wipe.wipe_save": "Effacer la sauvegarde",
        "dialogs.wipe.warning_1": "Êtes-vous sûr de vouloir <b style=\"color: red;\">EFFACER CETTE SAUVEGARDE</b> ?<br>Si vous appuyez sur OUI, tout votre progrès, y compris vos pièces, réalisations et bâtiments, disparaîtra !",
        "dialogs.wipe.yes": "OUI !",
        "dialogs.wipe.no": "Non, annulez ce dialogue.",
        "dialogs.wipe.warning_2": "Cette action ne peut pas être annulée. Êtes-vous vraiment sûr à 100% ?<br><b>N'oubliez pas que cela est irréversible !</b><br>Vous voudrez peut-être réfléchir attentivement avant de cliquer sur OUI.",

        "dialogs.save.info": "Votre code de sauvegarde pour <b>Coin Clicker</b> :",
        "dialogs.save.title": "Code de sauvegarde",

        "dialogs.load.info": "Entrez votre code de sauvegarde pour <b>Coin Clicker</b> :",
        "dialogs.load.title": "Charger le code",
        "dialogs.load.load": "Charger",
        "dialogs.load.cancel": "Annuler",

        "dialogs.load.haha_nice_try": "Haha. Essaye bien.",
        "dialogs.load.invalid_save_code": "Le code de sauvegarde est invalide.",

        "dialogs.error.fatal_error": "Erreur fatale",
        "dialogs.error.info": "Nous sommes vraiment désolés pour le désagrément que cela a causé, mais le jeu a rencontré une erreur fatale.<br><br>Veuillez recharger votre page.",
        "dialogs.error.reload": "Recharger",

        "dialogs.change_language.info": "Sélectionnez la langue que vous souhaitez changer :<br><sub>Note : Changer la langue sauvegardera et rechargera votre jeu.</sub>",


        ///////////////////
        // AMÉLIORATIONS //
        ///////////////////
        // NOM
        "upgrades.name.cursor_1": "Curseurs de calcium",
        "upgrades.name.family_1": "Familles conjointes",
        "upgrades.name.shop_1": "Magasins publicitaires",
        "upgrades.name.bank_1": "Pièces de couleurs différentes",
        "upgrades.name.carnival_1": "Numéros encore plus fous",
        "upgrades.name.power_plant_1": "Maisons à énergie de pièces",
        "upgrades.name.cursor_2": "Curseurs en argent",
        "upgrades.name.family_2": "Familles de commerçants",
        "upgrades.name.shop_2": "Mégas magasins",
        "upgrades.name.bank_2": "Coffres-forts faits de métal liquide de pièces",
        "upgrades.name.carnival_2": "Jeux d'arcade extrêmement détestables",
        "upgrades.name.power_plant_2": "Générateurs énergétiques de pièces",
        "upgrades.name.cursor_3": "Curseurs en cristal clair",
        "upgrades.name.cursor_4": "Curseurs papillons",
        "upgrades.name.cursor_5": "Curseurs autoclick",
        "upgrades.name.cursor_6": "Curseurs à l'intérieur de curseurs",

        // DESCRIPTION
        "upgrades.description.cursor_1": "Un curseur plus fort pour cliquer plus de pièces pour vous.",
        "upgrades.description.family_1": "Une plus grande famille pour travailler avec vous et fabriquer plus de pièces pour vous.",
        "upgrades.description.shop_1": "Utilise des publicités pour vendre plus d'articles.",
        "upgrades.description.bank_1": "Utilise différents types de pièces pour générer plus d'intérêts.",
        "upgrades.description.carnival_1": "Utilise plus de types de tours pour encaisser plus de pièces.",
        "upgrades.description.power_plant_1": "Fournit de l'énergie de pièces aux maisons qui l'utilisent, générant plus de frais pour les pièces.",
        "upgrades.description.cursor_2": "Un curseur brillant qui utilise son éclat pour cliquer plus de pièces.",
        "upgrades.description.family_2": "Les magasins augmentent la production de <b>+1 %</b> pour chaque entreprise familiale.<br><b>Multiplie</b> la production des entreprises familiales <b>par 10</b>.",
        "upgrades.description.shop_2": "Multiplie la production des magasins par <b>5</b>.",
        "upgrades.description.bank_2": "Multiplie la production des banques par <b>7</b>.",
        "upgrades.description.carnival_2": "Triple la production des carnavals.",
        "upgrades.description.power_plant_2": "Triple la production des centrales électriques.",
        "upgrades.description.cursor_3": "Un curseur en diamant très dur qui utilise sa force pour cliquer plus de pièces.",
        "upgrades.description.cursor_4": "Un curseur qui utilise le clic de papillon pour créer plus de pièces.",
        "upgrades.description.cursor_5": "Un curseur qui utilise un programme autoclick pour créer plus de pièces.",
        "upgrades.description.cursor_6": "Un curseur qui utilise un paradoxe pour créer plus de pièces.",

        // UTILISATION
        "upgrades.upgrades": "Améliorations",
        "upgrades.use.cursor_1": "<b>Double</b> la production des curseurs.",
        "upgrades.use.family_1": "<b>Triple</b> la production des entreprises familiales.",
        "upgrades.use.shop_1": "<b>Triple</b> la production des magasins.",
        "upgrades.use.bank_1": "<b>Double</b> la production des banques.",
        "upgrades.use.carnival_1": "<b>Double</b> la production des carnavals.",
        "upgrades.use.power_plant_1": "<b>Double</b> la production des centrales électriques.",
        "upgrades.use.cursor_2": "<b>Triple</b> la production des curseurs.",
        "upgrades.use.family_2": "Les magasins augmentent la production de <b>+1 %</b> pour chaque entreprise familiale.<br><b>Multiplie</b> la production des entreprises familiales <b>par 10</b>.",
        "upgrades.use.shop_2": "Multiplie la production des magasins <b>par 5</b>.",
        "upgrades.use.bank_2": "Multiplie la production des banques <b>par 7</b>.",
        "upgrades.use.carnival_2": "<b>Triple</b> la production des carnavals.",
        "upgrades.use.power_plant_2": "<b>Triple</b> la production des centrales électriques.",
        "upgrades.use.cursor_3": "Multiplie la production des curseurs <b>par 8</b>.",
        "upgrades.use.cursor_4": "Chaque bâtiment autre que des curseurs accorde <b>+1 %</b> de plus à la production des curseurs.",
        "upgrades.use.cursor_5": "Chaque bâtiment autre que des curseurs accorde <b>+2 %</b> de plus à la production des curseurs, pour un total de <b>+3,02 %</b>.",
        "upgrades.use.cursor_6": "Chaque bâtiment autre que des curseurs accorde <b>+3 %</b> de plus à la production des curseurs, pour un total de <b>+6,11 %</b>.",

        //////////////////
        // RÉALISATIONS //
        //////////////////
        // CATÉGORIE (EN GÉNÉRAL)
        "achievements.categories.count": "Succès déverrouillés : %1/%2",

        // TITRES DE CATÉGORIE
        "achievements.category.total_coins": "Total de pièces",
        "achievements.category.cps": "Pièces par seconde",
        "achievements.category.building_milestones": "Étapes de construction",
        "achievements.category.clicks": "Clics",
        "achievements.category.destruction": "Destruction",

        // NOM
        "achievements.name.total_coins_1": "Ovales jaunes brillants",
        "achievements.name.total_coins_2": "Une banque quelconque",
        "achievements.name.total_coins_3": "Peut-être quelques-uns de plus",
        "achievements.name.total_coins_4": "Besoin de plus de tirelires",
        "achievements.name.total_coins_5": "Essentiellement un trillicoinaire",
        "achievements.name.total_coins_6": "Je me demande si je peux les déposer",
        "achievements.name.total_coins_7": "Même la vie marine a besoin d'argent, tu sais",
        "achievements.name.total_coins_8": "La pièce en or",
        "achievements.name.total_coins_9": "Quand les pièces s'empilent jusqu'à la lune",
        "achievements.name.total_coins_10": "Souhaitant avoir plus de pièces",
        "achievements.name.total_coins_11": "Le monde est un soleil de poche",
        "achievements.name.cps_1": "Quelques banques sérieuses",
        "achievements.name.cps_2": "Empilez comme des jetons",
        "achievements.name.cps_3": "Le plus grand jeu de dames",
        "achievements.name.cps_4": "Se vend comme des petits pains, pas des gâteaux",
        "achievements.name.cps_5": "L'or est vieux",
        "achievements.name.cps_6": "Qui se soucie de l'argent liquide",
        "achievements.name.cps_7": "Faire la lessive ? Veuillez insérer 1 million de pièces pour continuer",
        "achievements.name.cps_8": "Il pleut <b>PIÈCES</b>",
        "achievements.name.cps_9": "Le soleil est une gigantesque pièce d'hydrogène enflammée",
        "achievements.name.cps_10": "Les atomes se font battre",
        "achievements.name.cps_11": "Qu'est-ce que c'est que la vie maintenant ?",
        "achievements.name.clicks_1": "Clic gauche",
        "achievements.name.clicks_2": "Clic clic clic",
        "achievements.name.clicks_3": "N'osez pas utiliser les touches pour cliquer",
        "achievements.name.clicks_4": "Les autoclickers ont un mauvais côté",
        "achievements.name.clicks_5": "Mets les pièces dans le sac",
        "achievements.name.buildings_1": "Construction de pièces",
        "achievements.name.buildings_2": "Construire avec des pièces",
        "achievements.name.buildings_3": "Ces constructions vont-elles tomber et être démolies ?",
        "achievements.name.buildings_4": "Une ville entière de pièces",
        "achievements.name.buildings_5": "100% de pièces pures",
        "achievements.name.buildings_6": "Construire est mon passe-temps",
        "achievements.name.destroy_1": "Qu'est-ce qui est tombé ?",
        "achievements.name.destroy_2": "Arrête juste!",
        "achievements.name.destroy_3": "Destructeur en série",
        "achievements.name.destroy_orange": "Pas possible... ? Est-ce de la magie ?",
        "achievements.name.destroy_orange_super": "WAAOOOOOOOOOOOOOO",

        // DESCRIPTION
        "achievements.description.total_coins_1": "Quelques ovales brillants... peut-être que je devrais en collecter plus!",
        "achievements.description.total_coins_2": "Ceux-ci coûtent des centimes",
        "achievements.description.total_coins_3": "J'EN AI BESOIN DE PLUS",
        "achievements.description.total_coins_4": "<i>Allô, c'est le service Tirelire ? Oui, j'ai besoin de 10 000 tirelires de plus ! Comment ça, elles sont en rupture de stock ?</i>",
        "achievements.description.total_coins_5": "<b>INFO :</b> Des centaines de curseurs commencent à apparaître de nulle part!",
        "achievements.description.total_coins_6": "Essayer de chercher une banque qui gardera votre stupide montant de pièces ? Eh bien, ne cherchez pas plus loin--AÏE! Ça fait mal!",
        "achievements.description.total_coins_7": "<b>INFO :</b> Une personne jette des millions de pièces dans l'océan pour une raison quelconque. Je pense que la personne déménage là-bas ou quelque chose comme ça.",
        "achievements.description.total_coins_8": "Cette pièce est la pièce la plus louée au monde, surnommée la <b>PIÈCE D'OR</b>!",
        "achievements.description.total_coins_9": "Qui a besoin de fusées quand on a des pièces ?",
        "achievements.description.total_coins_10": "<b>INFO :</b> Les gens utilisent les océans comme puits de désir pour des trucs cool, comme les Leprechauns!",
        "achievements.description.total_coins_11": "Selon l'<i>Organisation d'Astronomie de la Pièce</i>, même le Soleil ne peut pas rivaliser avec la brillance de la Terre!",
        "achievements.description.cps_1": "Par banque sérieuse, je veux dire des BANQUES réelles!",
        "achievements.description.cps_2": "Ne les utilisez pas dans les casinos!",
        "achievements.description.cps_3": "Combien de temps un jeu comme celui-ci prendrait-il pour finir, et pour se construire ? Sans parler de peindre la moitié d'entre eux!",
        "achievements.description.cps_4": "Ce n'est pas une boulangerie, d'accord ? C'est une monnaie...",
        "achievements.description.cps_5": "Ne pensez même pas à les faire fondre et à démarrer une fonderie!",
        "achievements.description.cps_6": "L'argent liquide est mauvais, car ça rime!",
        "achievements.description.cps_7": "Vous pensez que c'est mauvais ? Une machine distributrice demande exactement 1 milliard 234 millions 567 mille 890 pièces! Ne me lancez même pas sur un jeu d'arcade...",
        "achievements.description.cps_8": "Un gars a payé les nuages pour qu'ils fassent tomber des millions de pièces du ciel, et je ne plaisante même pas!",
        "achievements.description.cps_9": "Mais les bouteilles d'eau sont moins chères... oh, attendez, est-ce que j'ai oublié de mentionner que nous vivons dans un MONDE FANTASTIQUE ?",
        "achievements.description.cps_10": "La monnaie étrangère est mieux utilisée pour les affaires. Les autres pièces ? Pas tellement.",
        "achievements.description.cps_11": "Vivre dans un monde de pièces peut être amusant, mais les problèmes se posent toujours...",
        "achievements.description.clicks_1": "Clic clic clic clic!",
        "achievements.description.clicks_2": "Vous avez entendu parler des bons vieux clics de souris ? Eh bien, je pense que vous avez des clics.",
        "achievements.description.clicks_3": "Tapez comme des machines à écrire!",
        "achievements.description.clicks_4": "C'est pour les tricheurs! Ceux qui ne veulent pas cliquer...",
        "achievements.description.clicks_5": "Mettons les pièces dans le sac! Dans le sac avec eux!",
        "achievements.description.buildings_1": "Les pièces prennent vie et deviennent des bâtiments.",
        "achievements.description.buildings_2": "Qu'est-ce que tu vas construire avec ? Vous savez, des pièces.",
        "achievements.description.buildings_3": "Les bâtiments qui tombent et se démolissent coûtent très cher à réparer!",
        "achievements.description.buildings_4": "Une ville en pièces. Des gratte-ciel, des gens, des voitures... tout est fait de pièces.",
        "achievements.description.buildings_5": "Tout est devenu plus facile lorsque les scientifiques ont découvert la formule du matériau parfait: des pièces.",
        "achievements.description.buildings_6": "Quand il n'y a rien à faire, construire des bâtiments est un excellent moyen de passer le temps.",
        "achievements.description.destroy_1": "Oups, une petite chute...",
        "achievements.description.destroy_2": "Est-ce que c'est ça qu'on appelle des actes de destruction ? Les avocats n'aiment pas ça!",
        "achievements.description.destroy_3": "Destruction, destruction... ÇA SUFFIT!",
        "achievements.description.destroy_orange": "C'est une réussite cachée pour quelque chose de plus grand, je pense ?",
        "achievements.description.destroy_orange_super": "Quoi de plus grand que la destruction d'un lot de 100 bâtiments ? Certainement pas ça!",

        // HOW

        "achievements.how.total_coins_1": "Faites un total de <b>100 pièces</b>.",
        "achievements.how.total_coins_2": "Faites un total de <b>10 000 pièces</b>.",
        "achievements.how.total_coins_3": "Faites un total de <b>1 000 000 pièces</b>.",
        "achievements.how.total_coins_4": "Faites un total de <b>1 milliard de pièces</b>.",
        "achievements.how.total_coins_5": "Faites un total de <b>1 billion de pièces</b>.",
        "achievements.how.total_coins_6": "Faites un total de <b>1 billiard de pièces</b>.",
        "achievements.how.total_coins_7": "Faites un total de <b>1 trillion de pièces</b>.",
        "achievements.how.total_coins_8": "Faites un total de <b>1 trilliard de pièces</b>.",
        "achievements.how.total_coins_9": "Faites un total de <b>1 quadrillion de pièces</b>.",
        "achievements.how.total_coins_10": "Faites un total de <b>1 quadrilliard de pièces</b>.",
        "achievements.how.total_coins_11": "Faites un total de <b>1 quintillion de pièces</b>.",
        "achievements.how.cps_1": "Faites <b>500 pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_2": "Faites <b>50 000 pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_3": "Faites <b>5 000 000 pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_4": "Faites <b>500 000 000 pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_5": "Faites <b>50 milliards de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_6": "Faites <b>5 billions de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_7": "Faites <b>5 billiards de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_8": "Faites <b>5 trillions de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_9": "Faites <b>5 trilliards de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_10": "Faites <b>5 quadrillions de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.cps_11": "Faites <b>5 quadrilliards de pièces</b> par seconde <i>(brutes)</i>.",
        "achievements.how.clicks_1": "Cliquez sur la grosse pièce <b>100 fois</b>.",
        "achievements.how.clicks_2": "Cliquez sur la grosse pièce <b>500 fois</b>.",
        "achievements.how.clicks_3": "Cliquez sur la grosse pièce <b>1 000 fois</b>.",
        "achievements.how.clicks_4": "Cliquez sur la grosse pièce <b>2 500 fois</b>.",
        "achievements.how.clicks_5": "Cliquez sur la grosse pièce <b>5 000 fois</b>.",
        "achievements.how.buildings_1": "Avoir un total de <b>50</b> bâtiments.",
        "achievements.how.buildings_2": "Avoir un total de <b>100</b> bâtiments.",
        "achievements.how.buildings_3": "Avoir un total de <b>200</b> bâtiments.",
        "achievements.how.buildings_4": "Avoir un total de <b>300</b> bâtiments.",
        "achievements.how.buildings_5": "Avoir un total de <b>400</b> bâtiments.",
        "achievements.how.buildings_6": "Avoir un total de <b>500</b> bâtiments.",
        "achievements.how.destroy_1": "Détruisez <b>une pièce tombante</b>.",
        "achievements.how.destroy_2": "Détruisez <b>15 pièces tombantes</b>.",
        "achievements.how.destroy_3": "Détruisez <b>75 pièces tombantes</b>.",
        "achievements.how.destroy_orange": "Détruisez une <b>pièce orange</b>.",
        "achievements.how.destroy_orange_super": "Détruisez une <b>pièce orange</b> et obtenez l'effet <b>super frénésie</b>."
    }
};

export default TRANSLATION;