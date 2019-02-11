// Fetches game data from local storage 
let game = JSON.parse(localStorage.getItem('game'))

if (!game) {
    location.assign('index.html')
}

// Make the word from every round into a hangman object
game.rounds = configureRounds(game.rounds, game.difficulty) 

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
        console.log(guess)
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

// Executes once local storage is changed, called in the other tabs 
window.addEventListener('storage', (e) => {
    // Update the changes from local storage
    if (e.key === 'game') {
        console.log('Storage change detected in another session')
        saveGame(JSON.parse(e.newValue))
        // Fetches game data from local storage 
        game = JSON.parse(localStorage.getItem('game'))

        if (!game) {
            location.assign('index.html')
        }

        // Make the word from every round into a hangman object
        game.rounds = configureRounds(game.rounds)
        // game.rounds[game.activeRoundNum] - This is an active round
        activeRound = game.rounds[game.activeRoundNum]
        // Render game DOM
        renderGameDOM(activeRound, game)
    }
})