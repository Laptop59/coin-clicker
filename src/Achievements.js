const achievements = [
    {
        id: "total_coins_1",
        name: "Coin Fointain",
        description: "That's a very cool fountain",
        how: "Make a total of <b>69,420 coins</b>.",
        goal: game => game.totalCoins >= 69420,
        icon: [4, 0]
    },
    {
        id: "coins_click_1",
        name: "Coin Fointain",
        description: "That's a very cool fountain",
        how: "Make <b>40,000 coins</b> per click.",
        goal: game => game.rawCoinsPerClick >= 40000,
        icon: [5, 0]
    },
    {
        id: "coins_second_1",
        name: "BRUH",
        description: "Some with the same descriptions!",
        how: "Make <b>10 coins</b> per second.",
        goal: game => game.rawCoinsPerSecond >= 10,
        icon: [6, 0]
    }
]

export default achievements;