class Hangman {
    constructor(word, remainingGuesses) {
        this.word = word
        this.remainingGuesses = remainingGuesses
        this.guessedLetters = []
        this.status = 'playing'
    }
    getStatus() {
        const isFinished = this.word.every((letter) => this.guessedLetters.includes(letter) || letter === ' ')

        this.remainingGuesses > 0 ? this.status = 'playing' : this.status = 'failed'

        if (isFinished) {
            this.status = 'finished'
            game.activeRoundNum += 1
            activeRound = game.rounds[game.activeRoundNum]
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
        saveGame(game)

        const nextStage = document.querySelector('#next-stage')
        nextStage.innerHTML = ''

        const roundNumberEl = document.querySelector('#round-number')
        const puzzles = document.querySelector('#puzzles')
        const guesses = document.querySelector('#guesses')
        const guessedLetters = document.querySelector('#guessed-letters')
        const guessedLettersList = guessedLetters.children[1]

        // Rendering the round number out of total rounds
        roundNumberEl.textContent = getRoundNumberMessage(game)
        // rendering the puzzle
        puzzles.textContent = this.puzzle
        guesses.textContent = this.statusMessage

        // Generating the list of guessed letters
        guessedLettersList.innerHTML = ''

        this.guessedLetters.forEach((letter) => {
            const listEl = document.createElement('li')
            listEl.textContent = letter
            guessedLettersList.appendChild(listEl)
        })

        // If round is finished(won) or failed
        const nextActionButton = document.createElement('button')
        if (this.status === 'finished' || this.status === 'failed') {

            if (this.status === 'finished') {
                nextActionButton.textContent = 'Next Round'
                // CHanges button id for event listener on game.js
                nextActionButton.addEventListener('click', (e) => {

                })
            } else if (this.status === 'failed') {
                nextActionButton.textContent = 'Restart Game?'
                nextActionButton.addEventListener('click', (e) => {
                    location.assign('index.html')
                })
            }
            nextStage.appendChild(nextActionButton)

        }

    }
}