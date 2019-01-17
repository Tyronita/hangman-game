let game1

window.addEventListener('keypress', (e) => {
    const guess = String.fromCharCode(e.charCode)
    // Prevent a user from entering a non-alphabetical character
    const regex = /^[a-zA-Z]*$/
    if (regex.test(guess)) {
        game1.makeGuess(guess)
        renderDOM(game1, true)
    }
})

const startGame = async () => {
    const puzzle = await getPuzzle('1')
    game1 = new Hangman(puzzle, 115)
}

document.querySelector('#reset').addEventListener('click', () => {
    startGame().then(() => {
        renderDOM(game1)
    })
})

startGame().then(() => {
    renderDOM(game1)
})
