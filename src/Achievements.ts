import { EffectType } from "./Effect";
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
            goal: game => game.totalCoins >= 100,
            icon: [0, 0]
        },
        {
            id: "total_coins_2",
            goal: game => game.totalCoins >= 10000,
            icon: [1, 0]
        },
        {
            id: "total_coins_3",
            goal: game => game.totalCoins >= 1000000,
            icon: [2, 0]
        },
        {
            id: "total_coins_4",
            goal: game => game.totalCoins >= 1e9,
            icon: [3, 0]
        },
        {
            id: "total_coins_5",
            goal: game => game.totalCoins >= 1e12,
            icon: [4, 0]
        },
        {
            id: "total_coins_6",
            goal: game => game.totalCoins >= 1e15,
            icon: [5, 0]
        },
        {
            id: "total_coins_7",
            goal: game => game.totalCoins >= 1e18,
            icon: [6, 0]
        },
        {
            id: "total_coins_8",
            goal: game => game.totalCoins >= 1e21,
            icon: [7, 0]
        },
        {
            id: "total_coins_9",
            goal: game => game.totalCoins >= 1e24,
            icon: [8, 0]
        },
        {
            id: "total_coins_10",
            goal: game => game.totalCoins >= 1e27,
            icon: [9, 0]
        },
        {
            id: "total_coins_11",
            goal: game => game.totalCoins >= 1e30,
            icon: [10, 0]
        },
    ],
    // Coins per second
    cps: [
        {
            id: "cps_1",
            goal: game => game.rawCoinsPerSec >= 500,
            icon: [0, 0]
        },
        {
            id: "cps_2",
            goal: game => game.rawCoinsPerSec >= 50000,
            icon: [1, 0]
        },
        {
            id: "cps_3",
            goal: game => game.rawCoinsPerSec >= 5e6,
            icon: [2, 0]
        },
        {
            id: "cps_4",
            goal: game => game.rawCoinsPerSec >= 5e8,
            icon: [3, 0]
        },
        {
            id: "cps_5",
            goal: game => game.rawCoinsPerSec >= 5e10,
            icon: [4, 0]
        },
        {
            id: "cps_6",
            goal: game => game.rawCoinsPerSec >= 5e12,
            icon: [5, 0]
        },
        {
            id: "cps_7",
            goal: game => game.rawCoinsPerSec >= 5e15,
            icon: [6, 0]
        },
        {
            id: "cps_8",
            goal: game => game.rawCoinsPerSec >= 5e18,
            icon: [7, 0]
        },
        {
            id: "cps_9",
            goal: game => game.rawCoinsPerSec >= 5e21,
            icon: [8, 0]
        },
        {
            id: "cps_10",
            goal: game => game.rawCoinsPerSec >= 5e24,
            icon: [9, 0]
        },
        {
            id: "cps_11",
            goal: game => game.rawCoinsPerSec >= 5e27,
            icon: [10, 0]
        },
    ],
    // Clicks
    clicks: [
        {
            id: "clicks_1",
            goal: game => game.clicks >= 100,
            icon: [0, 1]
        },
        {
            id: "clicks_2",
            goal: game => game.clicks >= 500,
            icon: [1, 1]
        },
        {
            id: "clicks_3",
            goal: game => game.clicks >= 1000,
            icon: [2, 1]
        },
        {
            id: "clicks_4",
            goal: game => game.clicks >= 2500,
            icon: [3, 1]
        },
        {
            id: "clicks_5",
            goal: game => game.clicks >= 5000,
            icon: [4, 1]
        },
    ],
    // Buildings
    building_milestones: [
        {
            id: "buildings_1",
            goal: game => game.buildingsNumber >= 50,
            icon: [1, 4]
        },
        {
            id: "buildings_2",
            goal: game => game.buildingsNumber >= 100,
            icon: [2, 4]
        },
        {
            id: "buildings_3",
            goal: game => game.buildingsNumber >= 200,
            icon: [3, 4]
        },
        {
            id: "buildings_4",
            goal: game => game.buildingsNumber >= 300,
            icon: [4, 4]
        },
        {
            id: "buildings_5",
            goal: game => game.buildingsNumber >= 400,
            icon: [5, 4]
        },
        {
            id: "buildings_6",
            goal: game => game.buildingsNumber >= 500,
            icon: [6, 4]
        },
    ],
    // Destruction
    destruction: [
        {
            id: "destroy_1",
            goal: game => game.coinsDestroyed >= 1,
            icon: [0, 0]
        },
        {
            id: "destroy_2",
            goal: game => game.coinsDestroyed >= 15,
            icon: [2, 0]
        },
        {
            id: "destroy_3",
            goal: game => game.coinsDestroyed >= 75,
            icon: [4, 0]
        },
        {
            id: 'destroy_orange',
            goal: game => game.hasEffect(EffectType.FRENZY) || game.hasEffect(EffectType.SUPER_FRENZY),
            icon: [1, 0]
        },
        {
            id: 'destroy_orange_super',
            goal: game => game.hasEffect(EffectType.SUPER_FRENZY),
            icon: [2, 0]
        }
    ],
}

let achievements: Achievement[] = [];

for (let c of Object.values(categorizedAchievements)) {
    achievements = achievements.concat(c);
}

export {
    categorizedAchievements as default,
    achievements,
    Achievement
};