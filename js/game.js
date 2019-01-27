// Fetches game data from local storage 
const gameData = fetchGameData()

// Make every round a Hanmgman constructor - hangman methods lost in stringifid conversions
const game = makeRoundsHangmanObject(gameData) 

// game.rounds[game.activeRoundNum] - This is an active round
let activeRound = game.rounds[game.activeRoundNum]

// Render game DOM
renderGameDOM(activeRound, game)

document.querySelector('#reset').addEventListener('click', () => {
    resetGame()
    location.assign('index.html')
})

window.addEventListener('keypress', (e) => {
    const guess = String.fromCharCode(e.charCode)
    // Prevent a user from entering a non-alphabetical character
    const regex = /^[a-zA-Z]*$/
    if (regex.test(guess)) {
        activeRound.makeGuess(guess)
        saveGame(game)
        renderGameDOM(activeRound, game)  
    }
})

document.querySelector('#next-round').addEventListener('click', () => {
    game.activeRoundNum += 1
    activeRound = game.rounds[game.activeRoundNum]
    renderGameDOM(activeRound, game)
})

// Set page styling(in the css) based on game difficulty
document.querySelector('body').className = game.difficulty