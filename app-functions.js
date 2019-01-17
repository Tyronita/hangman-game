const renderDOM = (game) => {
    const puzzles = document.querySelector('#puzzles')
    const guesses = document.querySelector('#guesses')
    const guessedLetters = document.querySelector('#guessed-letters')
    const guessedLettersList = guessedLetters.children[1]
    puzzles.textContent = game.puzzle
    guesses.textContent = game.statusMessage
    
    guessedLettersList.innerHTML = ''

    game.guessedLetters.forEach((letter) => {
        const listEl = document.createElement('li')
        listEl.textContent = letter
        guessedLettersList.appendChild(listEl)
    })
}