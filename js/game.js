// Make every round a Hanmgman constructor - methods lost in stringifid conversions
const game = activateRounds()

// game.rounds[game.activeRoundNum] - This is an active round
let activeRound = game.rounds[game.activeRoundNum]

activeRound.renderRoundDOM()
console.log(activateRounds.gussesRemaining)

window.addEventListener('keypress', (e) => {
    const guess = String.fromCharCode(e.charCode)
    // Prevent a user from entering a non-alphabetical character
    const regex = /^[a-zA-Z]*$/
    if (regex.test(guess)) {
        activeRound.makeGuess(guess)
        activeRound.renderRoundDOM()
        saveGame(game)
    }
})

document.querySelector('#reset').addEventListener('click', () => {
    resetGame()
    location.assign('index.html')
})