// Generate Random Number between two bounds
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min)) + 1

// Saves the gameData in local Storage
const saveGame = (game) => {
    const gameData = JSON.stringify(game)
    localStorage.setItem('game', gameData)
}

// Wipes the gamedata in local storage
const resetGame = () => {
    localStorage.removeItem('game')
}

const fetchGameData = () => {
    const gameData = JSON.parse(localStorage.getItem('game'))
    if (!gameData) {
        location.assign('index.html')
    }
    return gameData
}

const configureRounds = (rounds) => {
    let hangmanRounds
    // If Hangman rounds have been previously configured
    if (rounds.every(round => typeof round === 'array')) {
        hangmanRounds = rounds.map(round => {
            const hangmanRound = new Hangman(round.word)
            hangmanRound.remainingGuesses = round.remainingGuesses
            hangmanRound.status = round.status
            hangmanRound.guessedLetters = round.guessedLetters
            return hangmanRound
        })
    } 
    // If on redirect from index.html(create game page)
    else {
        hangmanRounds = rounds.map(puzzleWord => {
            const hangmanRound = new Hangman(puzzleWord)
            hangmanRound.remainingGuesses = randomInt(puzzleWord.length-2, puzzleWord.length + 1)
            return hangmanRound
        })
    }
    return hangmanRounds
}

// const createRound = async (wordCount) => {
//     const puzzle = await getPuzzle(wordCount)
//     return await puzzle
// }

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

const getRoundNumberMessage = (game) => {
    const totalRoundsNum = game.rounds.length
    const activeRoundNum = game.activeRoundNum + 1
    return `Round: ${activeRoundNum}/${totalRoundsNum}`
}

const getRoundWinRate = (rounds) => {

    // Checking the percentage of won rounds
    let totalRounds = game.rounds.length, roundsWon = 0
    game.rounds.forEach((round) => {
        if (round.status === 'finished') {
            roundsWon++
        }
    })

    return ((roundsWon / totalRounds) * 100).toFixed(2)
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

        return (correctGuessedLetters / totalLetters) * 100
    })
}

const renderGameDOM = (currentRound, game) => {
    const nextRoundBtn = document.querySelector('#next-round')
    nextRoundBtn.style.display = "none"

    const roundNumberEl = document.querySelector('#round-number')
    const difficultyEl = document.querySelector('#game-difficulty')

    roundNumberEl.textContent = getRoundNumberMessage(game)
    difficultyEl.textContent = `Difficulty: ${game.difficulty}`

    // Render the individual round
    currentRound.renderRoundDOM()

    // Boolean to check if the current round is the last round
    const currentRoundOver = currentRound.status === 'finished' || currentRound.status === 'failed'
    const gameOver = game.rounds.length <= game.rounds.indexOf(currentRound) + 1 && currentRoundOver

    if (gameOver) {

        const modal = document.querySelector('#myModal');
        modal.style.display = "block";

        // Get the <span> element that closes the modal
        const closeModal = document.querySelector(".close");

        // When the user clicks on <span> (x), close the modal
        closeModal.onclick = function () {
            modal.style.display = "none";
        }

        const finalMessage = document.querySelector('#final-message')
        finalMessage.textContent = getRoundWinRate(game)

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    } else if (currentRoundOver) {
        nextRoundBtn.style.display = "block"
    }  
}