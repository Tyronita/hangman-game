class Hangman {
    constructor(word) {
        this.word = word
        this.guessedLetters = []
        this.status = 'playing'
    }
    getStatus() {
        const isFinished = this.word.every((letter) => this.guessedLetters.includes(letter) || letter === ' ')

        this.remainingGuesses > 0 ? this.status = 'playing' : this.status = 'failed'

        if (isFinished) {
            this.status = 'finished'
        }
        saveGame(game)
    }
    get statusMessage() {
        if (this.status === 'playing') {
            return `Guesses left: ${this.remainingGuesses}`
        } else if (this.status === 'failed') {
            return `Nice try! The word was "${this.word.join('')}".`
        } else {
            return 'Great work! You guessed the work.'
        }
    }
    get puzzle() {
        let puzzle = ''

        this.word.forEach((letter) => {
            this.guessedLetters.includes(letter) || letter === ' ' ? puzzle += letter : puzzle += '*'
        })

        return puzzle
    }
    makeGuess(guess) {
        if (this.remainingGuesses > 0) {
            guess = guess.toLowerCase()
            const isUnique = !this.guessedLetters.includes(guess)
            const isBadGuess = !this.word.includes(guess)

            if (isUnique) {
                this.guessedLetters.push(guess)
            }

            if (isUnique && isBadGuess) {
                this.remainingGuesses--
            }

            this.getStatus()   
        }
    }
    renderRoundDOM(){
        this.getStatus()

        const puzzles = document.querySelector('#puzzles')
        const guesses = document.querySelector('#guesses')
        const guessedLetters = document.querySelector('#guessed-letters')
        const guessedLettersList = guessedLetters.children[1]

        // rendering the puzzle
        puzzles.textContent = this.puzzle
        guesses.textContent = this.statusMessage

        // Generating the list of guessed letters
        guessedLettersList.innerHTML = ''

        this.guessedLetters.forEach((letter) => {
            const listEl = document.createElement('span')
            listEl.textContent = letter
            guessedLettersList.appendChild(listEl)
        })

    }
}