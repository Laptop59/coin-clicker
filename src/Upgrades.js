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
    }
];

export default upgrades;