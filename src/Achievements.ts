import Game from "./Game";

/**
 * Describes an achievement.
 */
interface Achievement {
    /**
     * The ID of the achievement.
     */
    id: string,

    /**
     * The name of the achievement.
     */
    name: string,

    /**
     * The description of the achievement.
     */
    description: string,

    /**
     * Text that tells how the achievement can be achieved.
     */
    how: string,

    /**
     * A function that returns if its achievement should be achieved.
     * @param game Game object.
     * @returns Whether the achievement should be achieved.
     */
    goal: (game: Game) => boolean,

    /**
     * Icon array of the achievement.
     */
    icon: [number, number]
};

/**
 * Describles a category of achievement(s).
 */
interface CategorizedAchievements {
    [key: string]: Achievement[]
};

/**
 * All existing categorised achievements ingame.
 */
const categorizedAchievements: CategorizedAchievements = {
    // Total Coins
    total_coins: [
        {
            id: "total_coins_1",
            name: "Shiny yellow ovals",
            description: "Some shiny ovals... maybe I should collect more!",
            how: "Make a total of <b>100 coins</b>.",
            goal: game => game.totalCoins >= 100,
            icon: [0, 0]
        },
        {
            id: "total_coins_2",
            name: "Some bank",
            description: "These cost pennies",
            how: "Make a total of <b>10,000 coins</b>.",
            goal: game => game.totalCoins >= 10000,
            icon: [1, 0]
        },
        {
            id: "total_coins_3",
            name: "Maybe a few more",
            description: "I NEED MORE",
            how: "Make a total of <b>1,000,000 coins</b>.",
            goal: game => game.totalCoins >= 1000000,
            icon: [2, 0]
        },
        {
            id: "total_coins_4",
            name: "Need more piggy banks",
            description: "<i>Hello, is this Piggy Service? Yes, I need 10,000 more piggy banks! What do you mean they are sold out?</i>",
            how: "Make a total of <b>1 billion coins</b>.",
            goal: game => game.totalCoins >= 1e9,
            icon: [3, 0]
        },
        {
            id: "total_coins_5",
            name: "Basically a trillicoinaire",
            description: "<b>NEWS:</b> Hundreds of cursors start appearing out of thin air!",
            how: "Make a total of <b>1 trillion coins</b>.",
            goal: game => game.totalCoins >= 1e12,
            icon: [4, 0]
        },
        {
            id: "total_coins_6",
            name: "I wonder if I can deposit them",
            description: "Trying to search for a bank that will keep your stupid amount of coins? Well, don't look furthe--OW! That hurt!",
            how: "Make a total of <b>1 quadrillion coins</b>.",
            goal: game => game.totalCoins >= 1e15,
            icon: [5, 0]
        },
        {
            id: "total_coins_7",
            name: "Even the marine life need money, y'know",
            description: "<b>NEWS:</b> Some person is dumping millions of coins into the ocean for some reason. I think the person is moving there or something.",
            how: "Make a total of <b>1 quintillion coins</b>.",
            goal: game => game.totalCoins >= 1e18,
            icon: [6, 0]
        },
        {
            id: "total_coins_8",
            name: "The golden coin",
            description: "This coin is the most praised coin in the world, dubbed the <b>GOLDEN COIN</b>!",
            how: "Make a total of <b>1 sextillion coins</b>.",
            goal: game => game.totalCoins >= 1e21,
            icon: [7, 0]
        },
        {
            id: "total_coins_9",
            name: "When the coins stack to the moon",
            description: "Who needs rockets when you have coins?",
            how: "Make a total of <b>1 septillion coins</b>.",
            goal: game => game.totalCoins >= 1e24,
            icon: [8, 0]
        },
        {
            id: "total_coins_10",
            name: "Wishing for more coins",
            description: "<b>NEWS:</b> People are using oceans as wishing wells for cool stuff, like leprechauns!",
            how: "Make a total of <b>1 octillion coins</b>.",
            goal: game => game.totalCoins >= 1e27,
            icon: [9, 0]
        },
        {
            id: "total_coins_11",
            name: "The world is a pocket-sized sun",
            description: "According to the <i>Coin Astronomy Organization</i>, even the Sun can't outlast the Earth's shininess!",
            how: "Make a total of <b>1 nonillion coins</b>.",
            goal: game => game.totalCoins >= 1e30,
            icon: [10, 0]
        },
    ],
    // Coins per second
    cps: [
        {
            id: "cps_1",
            name: "Some serious bank(s)",
            description: "By serious bank, I mean actual BANKS!",
            how: "Make a <i>raw</i> <b>500 coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 500,
            icon: [0, 0]
        },
        {
            id: "cps_2",
            name: "Stack like chips",
            description: "Don't use them in casinos!",
            how: "Make a <i>raw</i> <b>50,000 coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 50000,
            icon: [1, 0]
        },
        {
            id: "cps_3",
            name: "The biggest game of checkers",
            description: "How long would a game like this take to end, and build? Not to mention painting half of them!",
            how: "Make a <i>raw</i> <b>5,000,000 coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e6,
            icon: [2, 0]
        },
        {
            id: "cps_4",
            name: "Sells like hot coins, not cakes",
            description: "This is not a bakery, ok? This is a mint...",
            how: "Make a <i>raw</i> <b>500,000,000 coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e8,
            icon: [3, 0]
        },
        {
            id: "cps_5",
            name: "Gold is old",
            description: "Don't even think about melting these and starting a foundry!",
            how: "Make a <i>raw</i> <b>50 billion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e10,
            icon: [4, 0]
        },
        {
            id: "cps_6",
            name: "Who cares about cash",
            description: "Cash is trash, because it rhymes!",
            how: "Make a <i>raw</i> <b>5 trillion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e12,
            icon: [5, 0]
        },
        {
            id: "cps_7",
            name: "Doing laundry? Please insert 1 million coins to continue",
            description: "You think that's bad? A vending machine asks for exactly 1 billion 234 million 567 thousand 890 coins! Don't even get me started on an arcade game...",
            how: "Make a <i>raw</i> <b>5 quadrillion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e15,
            icon: [6, 0]
        },
        {
            id: "cps_8",
            name: "It's raining <b>COINS</b>",
            description: "Some guy paid the clouds to drop millions of coins from the sky, and I don't know why, but maybe he just wanted to do a giveaway!",
            how: "Make a <i>raw</i> <b>5 quintillion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e18,
            icon: [7, 0]
        },
        {
            id: "cps_9",
            name: "The sun is a giant hydrogen flaming coin",
            description: "Is this mythology?",
            how: "Make a <i>raw</i> <b>5 sextillion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e21,
            icon: [8, 0]
        },
        {
            id: "cps_10",
            name: "The atoms are getting beaten",
            description: "<b>NEWS:</b> Everything in the observable universe is turning to <i>COIN MATTER-IAL</i>!",
            how: "Make a <i>raw</i> <b>5 septillion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e24,
            icon: [9, 0]
        },
        {
            id: "cps_11",
            name: "What even is life anymore?",
            description: "All I can think about are coins, coins, and more coins... Was this a bad idea?",
            how: "Make a <i>raw</i> <b>5 octillion coins</b> per second.",
            goal: game => game.rawCoinsPerSec >= 5e27,
            icon: [10, 0]
        },
    ],
    // Clicks
    clicks: [
        {
            id: "clicks_1",
            name: "Left click",
            description: "Oh, casually clicking the big coin, huh?",
            how: "Click the big coin <b>100</b> times.",
            goal: game => game.clicks >= 100,
            icon: [0, 1]
        },
        {
            id: "clicks_2",
            name: "Click click click",
            description: "The big coin doesn't like your thinking...",
            how: "Click the big coin <b>500</b> times.",
            goal: game => game.clicks >= 500,
            icon: [1, 1]
        },
        {
            id: "clicks_3",
            name: "Don't you dare use keys for clicking",
            description: "Used <b>Click</b>! It's not very effective... Dealt <sub><sub>0.000000001</sub>% of damage!</sub>",
            how: "Click the big coin <b>1,000</b> times.",
            goal: game => game.clicks >= 1000,
            icon: [2, 1]
        },
        {
            id: "clicks_4",
            name: "Autoclickers have a bad side",
            description: "The big coin is constantly getting troubled.",
            how: "Click the big coin <b>2,500</b> times.",
            goal: game => game.clicks >= 2500,
            icon: [3, 1]
        },
        {
            id: "clicks_5",
            name: "Put the coins in the bag",
            description: "Hi, big coin! This is a robbery! <b>NOW GIVE ME YOUR COINS <b>OR ELSE</b></b>",
            how: "Click the big coin <b>5,000</b> times.",
            goal: game => game.clicks >= 5000,
            icon: [4, 1]
        },
    ],
    // Buildings
    building_milestones: [
        {
            id: "buildings_1",
            name: "Coinstruction",
            description: "Wait. How do family businesses get constructed?",
            how: "Have a total of <b>50</b> buildings.",
            goal: game => game.buildingsNumber >= 50,
            icon: [1, 4]
        },
        {
            id: "buildings_2",
            name: "Building with coins",
            description: "WE ARE LITERALLY BUILDING WITH COINS!",
            how: "Have a total of <b>100</b> buildings.",
            goal: game => game.buildingsNumber >= 100,
            icon: [2, 4]
        },
        {
            id: "buildings_3",
            name: "Will these fall and get demolished?",
            description: "Who knows...",
            how: "Have a total of <b>200</b> buildings.",
            goal: game => game.buildingsNumber >= 200,
            icon: [3, 4]
        },
        {
            id: "buildings_4",
            name: "An entire coin city",
            description: "It is 5,000 miles away from my location... FAAAA-",
            how: "Have a total of <b>300</b> buildings.",
            goal: game => game.buildingsNumber >= 300,
            icon: [4, 4]
        },
        {
            id: "buildings_5",
            name: "100% pure coins",
            description: "Hey guys! I recently found this new country, called <i>Coinice</i>! You should check it out!",
            how: "Have a total of <b>400</b> buildings.",
            goal: game => game.buildingsNumber >= 400,
            icon: [5, 4]
        },
        {
            id: "buildings_6",
            name: "Building is my hobby",
            description: "The buildings are building the buildings which are building buildings which are also building buildings which are themselves also building buildings which are also themselves building buildings which are also themselves building buildings which are also themselves building buildings which are also themselves building buildings which are also building buildings, that are building building builders!",
            how: "Have a total of <b>500</b> buildings.",
            goal: game => game.buildingsNumber >= 500,
            icon: [6, 4]
        },
    ],
    // Destruction
    destruction: [
        {
            id: "destroy_1",
            name: "What the fell?",
            description: "What happened to that coin???",
            how: "Destroy <b>a falling coin</b>.",
            goal: game => game.coinsDestroyed >= 1,
            icon: [0, 0]
        },
        {
            id: "destroy_2",
            name: "Just stop!",
            description: "You're being a menace to these coins.<br><b>NEWS:</b> 15 coins missing without a trace!",
            how: "Destroy <b>15 falling coins</b>.",
            goal: game => game.coinsDestroyed >= 15,
            icon: [2, 0]
        },
        {
            id: "destroy_3",
            name: "Serial destroyer",
            description: "Oh well, you probably produce more coins than what you destroy.",
            how: "Destroy <b>75 falling coins</b>.",
            goal: game => game.coinsDestroyed >= 75,
            icon: [4, 0]
        },
    ],
}

let achievements: Achievement[] = [];

for (let c of Object.values(categorizedAchievements)) {
    achievements = achievements.concat(c);
}

export {
    categorizedAchievements,
    achievements
};