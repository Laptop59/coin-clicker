// Define all our buildings.

/**
 * Describes a building.
 */
interface Building {
    /**
     * The ID of the building.
     */
    id: string,

    /**
     * The benefits of having 1 of the building;
     * 
     * `[(number of coins earned per click), (number of coins earned per second)]`
     */
    benefits: [number, number],

    /**
     * The base cost of the building.
     */
    cost: number,

    /**
     * The multiplier of the cost based on how many building owned. It is multiplied for each building owned to the base cost to find the final cost.
     */
    increase: number,

    /**
     * The icon array of the building.
     */
    icon: [number, number]
}

/**
 * Defined buildings of the game.
 */
const buildings: Building[] = [
    {
        "id": "cursor",
        "benefits": [1, 0], // first for click, second for /second.
        "cost": 15,
        "increase": 1.2,
        "icon": [0, 1]
    },
    {
        "id": "family",
        "benefits": [0, 25],
        "cost": 200,
        "increase": 1.21,
        "icon": [0, 2]
    },
    {
        "id": "shop",
        "benefits": [0, 450],
        "cost": 12000,
        "increase": 1.22,
        "icon": [0, 3]
    },
    {
        "id": "bank",
        "benefits": [750, 0],
        "cost": 95000,
        "increase": 1.23,
        "icon": [0, 5]
    },
    {
        "id": "carnival",
        "benefits": [0, 5500],
        "increase": 1.24,
        "cost": 1350000,
        "icon": [0, 6]
    },
    {
        "id": "power_plant",
        "benefits": [0, 65000],
        "increase": 1.25,
        "cost": 11000000,
        "icon": [0, 7]
    },
    {
        "id": "industry",
        "benefits": [0, 475000],
        "increase": 1.26,
        "cost": 175000000,
        "icon": [0, 8]
    },
    {
        "id": "lab",
        "benefits": [100000, 3000000],
        "increase": 1.27,
        "cost": 7250000000,
        "icon": [0, 9]
    }
]

export {
    buildings as default,
    Building
}