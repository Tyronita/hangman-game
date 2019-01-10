const game1 = new Hangman('New Mexico', 4)

renderDOM(game1, false)

window.addEventListener('keypress', function (e) {
    const guess = String.fromCharCode(e.charCode)

    // Prevent a user from entering a non-alphabetical character
    const regex = /^[a-zA-Z]*$/
    if (regex.test(guess)) {
        game1.makeGuess(guess)
        renderDOM(game1, true)
    }
})