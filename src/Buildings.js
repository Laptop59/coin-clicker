// Define all our buildings.

const buildings = [
    {
        "id": "cursor",
        "names": ["Cursor", "Cursors"],
        "description": "Clicks to create %1.",
        "benefits": [1, 0], // first for click, second for /second.
        "cost": 15,
        "increase": 1.4,
        "icon": [0, 1]
    },
    {
        "id": "family",
        "names": ["Family Business", "Family Businesses"],
        "description": "Works with families to make %1.",
        "benefits": [0, 25],
        "cost": 200,
        "increase": 1.41,
        "icon": [0, 2]
    },
    {
        "id": "shop",
        "names": ["Shop", "Shops"],
        "description": "Sells basic items making %1.",
        "benefits": [0, 450],
        "cost": 12000,
        "increase": 1.42,
        "icon": [0, 3]
    },
    {
        "id": "bank",
        "names": ["Bank", "Banks"],
        "description": "Uses interest to generate %1.",
        "benefits": [750, 0],
        "cost": 95000,
        "increase": 1.43,
        "icon": [0, 5]
    }
]

export default buildings;