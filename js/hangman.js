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
        const guessedLettersDOM = document.querySelector('#guessed-letters')

        puzzles.innerHTML = ''
        // rendering the puzzle letter by letter
        this.puzzle.split('').forEach((letter) => {
            const letterEl = document.createElement('span')
            letterEl.className = 'puzzle-letter'

            letterEl.textContent = letter
            // If char is space then make it clear with styling
            if (letter === ' ') {
                letterEl.style.paddingRight = '10px'
            }

            puzzles.appendChild(letterEl)
        })

        guesses.textContent = this.statusMessage

        // Generating the list of guessed letters
        guessedLettersDOM.innerHTML = ''

        this.guessedLetters.forEach((letter) => {
            const letterEl = document.createElement('span')
            letterEl.textContent = letter
            guessedLettersDOM.appendChild(letterEl)
        })

    }
}