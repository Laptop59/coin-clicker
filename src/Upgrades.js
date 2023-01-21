// Tiers
// 1: 5   buildings
// 2: 15  buildings
// 3: 35  buildings
// 4: 50  buildings
// 5: 75  buildings
// 6: 100 buildings
// 7: 150 buildings
// 8: 200 buildings
// 9: 250 buildings
//10: 300 buildings

const upgrades = [
    {
        "id": "cursor_1",
        "name": "Calcium cursors",
        "description": "A stronger cursor to click more coins for you.",
        "use": "<b>Doubles</b> the production of cursors.",
        "cost": 100,
        "benefits": {
            cursor: x => x * 2
        },
        "requirements": {
            cursor: 5
        },
        "icon": [0, 1]
    },
    {
        "id": "family_1",
        "name": "Joint families",
        "description": "A bigger family to work with you and make more coins for you.",
        "use": "<b>Triples</b> the production of family businesses.",
        "cost": 1500,
        "benefits": {
            family: x => x * 3
        },
        "requirements": {
            family: 5
        },
        "icon": [0, 2]
    },
    {
        "id": "shop_1",
        "name": "Advertised shops",
        "description": "Uses advertisements to sell more items.",
        "use": "<b>Triples</b> the production of shops.",
        "cost": 15000,
        "benefits": {
            shop: x => x * 3
        },
        "requirements": {
            shop: 5
        },
        "icon": [0, 3]
    },
    {
        "id": "bank_1",
        "name": "Different coloured-coins",
        "description": "Uses different kinds of coins to make more interest.",
        "use": "<b>Doubles</b> the production of banks.",
        "cost": 850000,
        "benefits": {
            bank: x => x * 2
        },
        "requirements": {
            bank: 5
        },
        "icon": [0, 5]
    },
    {
        "id": "carnival_1",
        "name": "Crazier stunts",
        "description": "Uses more kinds of stunts to cash out more coins.",
        "use": "<b>Doubles</b> the production of carnivals.",
        "cost": 7500000,
        "benefits": {
            carnival: x => x * 2
        },
        "requirements": {
            carnival: 5
        },
        "icon": [0, 6]
    },
    {
        "id": "power_plant_1",
        "name": "Coin energy homes",
        "description": "Gives out coin energy to homes using it, generating more fees for coins.",
        "use": "<b>Doubles</b> the production of power plants.",
        "cost": 40000000,
        "benefits": {
            power_plant: x => x * 2
        },
        "requirements": {
            power_plant: 5
        },
        "icon": [0, 7]
    },
    {
        "id": "cursor_2",
        "name": "Silver cursors",
        "description": "A shiny cursor which uses its shininess to click more coins.",
        "use": "<b>Triples</b> the production of cursors.",
        "cost": 750,
        "benefits": {
            cursor: x => x * 3
        },
        "requirements": {
            cursor: 15
        },
        "icon": [1, 1]
    },
    {
        "id": "family_2",
        "name": "Shopkeeper families",
        "description": "Families to sell more kinds of items for you.",
        "use": "Shops increase production by <b>+1%</b> for every family business.<br><b>Multiplies</b> the production of family businesses <b>by 10</b>.",
        "cost": 350000,
        "benefits": {
            family: x => x * 10,
            shop: (x, _, game) => x * (1 + game.getNumberOfBuildings('family') / 100)
        },
        "requirements": {
            family: 15
        },
        "icon": [1, 2]
    },
    {
        "id": "shop_2",
        "name": "Megashops",
        "description": "Uses supermarkets without perception of time to sell more items.",
        "use": "<b>Multiplies</b> the production of shops <b>by 5</b>.",
        "cost": 400000,
        "benefits": {
            shop: x => x * 5
        },
        "requirements": {
            shop: 15
        },
        "icon": [1, 3]
    },
    {
        "id": "bank_2",
        "name": "Coin liquid-made vaults",
        "description": "Uses liquid coin metal in vaults to generate more coins.",
        "use": "<b>Multiplies</b> the production of banks <b>by 7</b>.",
        "cost": 7000000,
        "benefits": {
            bank: x => x * 7
        },
        "requirements": {
            bank: 15
        },
        "icon": [1, 5]
    },
    {
        "id": "carnival_2",
        "name": "Extreme-scummy arcade games",
        "description": "Cashes out more coins by bankrupting players.",
        "use": "<b>Triples</b> the production of carnivals.",
        "cost": 25000000,
        "benefits": {
            carnival: x => x * 3
        },
        "requirements": {
            carnival: 15
        },
        "icon": [1, 6]
    },
    {
        "id": "power_plant_2",
        "name": "Coin energized generators",
        "description": "Generates more coin energy, used for more generators for the same.",
        "use": "<b>Triples</b> the production of power plants.",
        "cost": 300000000,
        "benefits": {
            power_plant: x => x * 3
        },
        "requirements": {
            power_plant: 15
        },
        "icon": [1, 7]
    },
    {
        "id": "cursor_3",
        "name": "Crystal clear cursors",
        "description": "A very hard diamond cursor which uses its strength to click more coins.",
        "use": "<b>Multiplies</b> the production of cursors <b>by 8</b>.",
        "cost": 65000,
        "benefits": {
            cursor: x => x * 8
        },
        "requirements": {
            cursor: 35
        },
        "icon": [2, 1]
    },
    {
        "id": "cursor_4",
        "name": "Butterfly cursors",
        "description": "A cursor which uses butterfly clicking to create more coins.",
        "use": "Every non-cursor building grants <b>+1% more</b> the production of cursors.",
        "cost": 4000000,
        "benefits": {
            cursor: (x, _, game) => x * (1 + game.getTotalBuildings(true) / 100)
        },
        "requirements": {
            cursor: 50
        },
        "icon": [3, 1]
    },
    {
        "id": "cursor_5",
        "name": "Autoclick cursors",
        "description": "A cursor with uses an auto-clicking program to create more coins.",
        "use": "Every non-cursor building grants <b>+2% more</b> the production of cursors, for a total of <b>+3.02%</b>.",
        "cost": 35000000,
        "benefits": {
            cursor: (x, _, game) => x * (1 + game.getTotalBuildings(true) / 50)
        },
        "requirements": {
            cursor: 75
        },
        "icon": [4, 1]
    },
    {
        "id": "cursor_6",
        "name": "Cursors inside cursors",
        "description": "A cursor which uses a paradox to create more coins.",
        "use": "Every non-cursor building grants <b>+3% more</b> the production of cursors, for a total of <b>+6.11%</b>.",
        "cost": 200000000,
        "benefits": {
            cursor: (x, _, game) => x * (1 + game.getTotalBuildings(true) / 100 * 3)
        },
        "requirements": {
            cursor: 100
        },
        "icon": [5, 1]
    },
];

export default upgrades;