// Define all our buildings.

const buildings = [
    {
        "id": "cursor",
        "names": ["Cursor", "Cursors"],
        "description": "Clicks to create %1.",
        "benefits": [1, 0], // first for click, second for /second.
        "cost": 15,
        "increase": 1.2,
        "icon": [0, 1]
    },
    {
        "id": "family",
        "names": ["Family Business", "Family Businesses"],
        "description": "Works with families to make %1.",
        "benefits": [0, 25],
        "cost": 200,
        "increase": 1.21,
        "icon": [0, 2]
    },
    {
        "id": "shop",
        "names": ["Shop", "Shops"],
        "description": "Sells basic items making %1.",
        "benefits": [0, 450],
        "cost": 12000,
        "increase": 1.22,
        "icon": [0, 3]
    },
    {
        "id": "bank",
        "names": ["Bank", "Banks"],
        "description": "Uses interest to generate %1.",
        "benefits": [750, 0],
        "cost": 95000,
        "increase": 1.23,
        "icon": [0, 5]
    },
    {
        "id": "carnival",
        "names": ["Carnival", "Carnivals"],
        "description": "Sells tickets and souvenirs cashing out %1.",
        "benefits": [0, 5500],
        "increase": 1.24,
        "cost": 1350000,
        "icon": [0, 6]
    },
    {
        "id": "power_plant",
        "names": ["Power Plant", "Power Plants"],
        "description": "Generates coin energy to be converted to coins, generating %1 of energy.",
        "benefits": [0, 65000],
        "increase": 1.25,
        "cost": 11000000,
        "icon": [0, 7]
    },
    {
        "id": "industry",
        "names": ["Industry", "Industries"],
        "description": "Produces coins and smoke, which is converted into more shiny coins, producing %1.",
        "benefits": [0, 475000],
        "increase": 1.26,
        "cost": 175000000,
        "icon": [0, 8]
    },
    {
        "id": "lab",
        "names": ["Technological Lab", "Technological Labs"],
        "description": "Finds and creates new technology, which all together technologically code in %1.",
        "benefits": [100000, 3000000],
        "increase": 1.27,
        "cost": 7250000000,
        "icon": [0, 9]
    }
]

export default buildings;