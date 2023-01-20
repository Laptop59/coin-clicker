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
        "icon": [0, 1],
        "sort": 1000
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
        "icon": [0, 2],
        "sort": 1000
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
        "icon": [1, 1],
        "sort": 2000
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
        "icon": [2, 1],
        "sort": 3000
    },
    {
        "id": "cursor_4",
        "name": "Butterfly cursors",
        "description": "A cursor with uses butterfly clicking to create more coins.",
        "use": "Every 1 non-cursor building grants <b>+1% more</b> the production of cursors.",
        "cost": 4000000,
        "benefits": {
            cursor: (x, _, game) => x * (1 + game.getTotalBuildings(true) / 100)
        },
        "requirements": {
            cursor: 50
        },
        "icon": [3, 1],
        "sort": 4000
    }
];

export default upgrades;