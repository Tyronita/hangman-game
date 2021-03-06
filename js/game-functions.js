const createGame = (game) => {
    const generatePuzzles = async () => {
        // Set up the amount of guesses for each round and the word count for each round 
        let wordCount, roundCount
        switch (game.difficulty) {
            case 'easy':
                roundCount = 3, wordCount = 1
                break;
            case 'medium':
                roundCount = 5, wordCount = 2
                break;
            case 'hard':
                roundCount = 10, wordCount = 3
                break;
            default:
                break;
        }

        // Generate the rounds based on the stat diificulty reassignments above
        for (let i = 0; i < roundCount; i++) {
            await getPuzzle(wordCount).then(puzzleWord => {
                game.rounds.push(puzzleWord)
            }).catch((err) => {
                console.log(err.message)
            })
        }
    }
    generatePuzzles().then(() => {
        saveGame(game)
        location.assign('game.html')
    })
}

const configureRounds = (rounds, difficulty) => {
    let hangmanRounds
    // If Hangman rounds have been previously configured to the hangman object
    if (rounds.every(round => Array.isArray(round.word))) { // Check if every round.word is an array
        hangmanRounds = rounds.map(round => {
            const hangmanRound = new Hangman(round.word)
            hangmanRound.remainingGuesses = round.remainingGuesses
            hangmanRound.status = round.status
            hangmanRound.guessedLetters = round.guessedLetters
            return hangmanRound
        })
    }
    // If on redirect from index.html(create game page) // new game
    else {
        hangmanRounds = rounds.map(puzzleWord => {
            const hangmanRound = new Hangman(puzzleWord)
            let guessCount
            switch (difficulty) {
                case 'easy':
                    guessCount = puzzleWord.length
                    break;
                case 'medium':
                    guessCount = Math.ceil(puzzleWord.length / 2)
                    break;
                case 'hard':
                    guessCount = Math.floor(puzzleWord.length / 3)
                    break;
                default:
                    break;
            }
            // Generate a rounds remainingGuesses property based on its length, difficulty and a random interval of 2
            hangmanRound.remainingGuesses = randomInt(guessCount - 2, guessCount + 2)
            return hangmanRound
        })
    }
    return hangmanRounds
}


const getRoundNumberMessage = (game) => {
    const totalRoundsNum = game.rounds.length
    const activeRoundNum = game.activeRoundNum + 1
    return `Round: ${activeRoundNum}/${totalRoundsNum}`
}

const getRoundWinRate = (rounds) => {

    // Checking the percentage of won rounds
    let totalRounds = rounds.length, roundsWon = 0
    rounds.forEach((round) => {
        if (round.status === 'finished') {
            roundsWon++
        }
    })

    return ((roundsWon / totalRounds) * 100).toFixed(1)
}

const getLetterGuessRate = (rounds) => {
    // Checking the percentage of letters guessed correcly
    let totalLetters = 0, correctGuessedLetters = 0
    rounds.forEach((round) => {
        totalLetters += round.word.length
        round.word.forEach((letter) => {
            if (round.guessedLetters.includes(letter)) {
                correctGuessedLetters += 1
            }
        })

    })
    return ((correctGuessedLetters / totalLetters) * 100).toFixed(1)
}

const renderGameDOM = (currentRound, game) => {
    const nextRoundBtn = document.querySelector('#next-round')
    nextRoundBtn.style.display = "none"
    nextRoundBtn.className = 'next-round-btn'

    const roundNumberEl = document.querySelector('#round-number')
    const difficultyEl = document.querySelector('#game-difficulty')

    roundNumberEl.textContent = getRoundNumberMessage(game)
    difficultyEl.textContent = `Difficulty: ${game.difficulty}`
    difficultyEl.className = game.difficulty

    // Render the individual round's puzzle
    currentRound.renderRoundDOM()

    // Boolean to check if the current round is the last round
    const currentRoundOver = currentRound.status === 'finished' || currentRound.status === 'failed'
    const gameOver = game.rounds.length <= game.rounds.indexOf(currentRound) + 1 && currentRoundOver

    if (gameOver) {

        game.letterGuessRate = getLetterGuessRate(game.rounds)
        game.roundWinRate = getRoundWinRate(game.rounds)
        saveGame(game)

        showModal()
        const gameOverMsg = document.querySelector('#final-message')
        const nextActionBtn = document.querySelector('#next-action')
        game.LetterGuessRate = getLetterGuessRate(game.rounds)
        gameOverMsg.textContent = `${game.playerName} guessed ${game.roundWinRate}% of the words and ${game.letterGuessRate}% of letters!`
        nextActionBtn.onclick = () => {
            const leaderboard = JSON.parse(localStorage.getItem('leaderboard'))
            // if there is not leaderboard in localstorage 
            if (!leaderboard) {
                const newLeaderboard = [game]
                // Set the leaderboard to localStorage
                localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard))
                // Current game is over and saved on the leaderboard
                resetGame()
                location.assign('/leaderboard.html')
            } else {
                // Add game to leaderboard and save
                leaderboard.push(game)
                localStorage.setItem('leaderboard' ,JSON.stringify(leaderboard))
                // Current game is over and saved on the leaderboard
                resetGame()
                location.assign('/leaderboard.html')
            }
        }

    } else if (currentRoundOver) {
        nextRoundBtn.style.display = "block"
    }  
}