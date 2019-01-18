const saveGame = (game) => {
    const gameData = JSON.stringify(game)
    localStorage.setItem('game', gameData)
}

const fetchGame = () => {
    const JSONData = JSON.parse(localStorage.getItem('game'))
    return JSONData ? JSONData : {
        rounds: [], 
        difficulty: null,
        playerName: null,
        activeRoundNum: 0,
    }
}

const resetGame = () => {
    localStorage.removeItem('game')
}