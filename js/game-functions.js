// Saves the gameData in local Storage
const saveGame = (game) => {
    const gameData = JSON.stringify(game)
    localStorage.setItem('game', gameData)
}

// Wipes the gamedata in local storage
const resetGame = () => {
    localStorage.removeItem('game')
}

/* Activate Rounds is a comlicated function to understand -

    Firstly the game is setup and configured in index.js (The create game form page).
    The game is setup there because the configuration function(configureGame()) relies on
    an async function createRound which runs a lot and isn't quick.
    In that function I purposefully did not create round as a hangman object as when saved
    (stringified by JSON) it loses it's functions like makeGuess() which is essential for the
    game to work.

    I have just returned a default object with createRound() as it must be converted
    into a hangman object to receive it's features.
    
    This function works to keep the app from breaking every time  game.html is refreshed
    as it uses a map method to convert the rounds into hangman objects.

    Initially the problem with that was a Hangmans round word is an array of letters
    so this function is built firstly to check if the word had already been activated
    (turned into an array) otherwise toLowerCase() can't convert the letter as it is an array.
    
    But overall the purpose of the function is to make the round object a hangman object to
    receive all the essential features.

    Sorry if you don't understand this later Evan
*/

const fetchGameData = () => {
    const gameData = JSON.parse(localStorage.getItem('game'))
    if (!gameData) {
        location.assign('index.html')
    }
    return gameData
}

const makeRoundsHangmanObject = (gameData) => {
    // Check to see if word has already been activated - activated rounds have been split
    const needsReactivating = gameData.rounds.every((round) => typeof round.word !== 'string')

    if (needsReactivating) {
         // Making every round a hangman object again
        gameData.rounds = gameData.rounds.map((round) => {
            const word = round.word
            const remainingGuesses = round.remainingGuesses
            const activatedRound = new Hangman(word, remainingGuesses)
            // Save hangman created properties
            activatedRound.guessedLetters = round.guessedLetters

            return activatedRound
        })

    } else {
        // Making every round a hangman object
        gameData.rounds = gameData.rounds.map((round) => {
            const word = round.word.toLowerCase().split('')
            const activatedRound = new Hangman(word, round.guessCount)
            return activatedRound
        })
    }

    // Return game with activated hangman objects
    return gameData
}

const createRound = async (wordCount, guessCount) => {
    const puzzle = await getPuzzle(wordCount)
    return await {
        word: puzzle,
        guessCount: guessCount
    }
}

const createGame = (game) => {
    const configureGame = async () => {
        // Set up the amount of guesses for each round and the word count for each round 
        let wordCount, guessCount, roundCount
        // easy
        if (game.difficulty === 'easy') {
            roundCount = 3, wordCount = 1, guessCount = 10
        }
        // medium
        else if (game.difficulty === 'medium') {
            roundCount = 5, wordCount = 2, guessCount = 7
        }
        // Hard
        else if (game.difficulty === 'hard') {
            roundCount = 50, wordCount = 3, guessCount = 4
        }

        // Generate the rounds based on the stat diificulty reassignments above
        for (let i = 0; i < roundCount; i++) {
            await createRound(wordCount, guessCount).then((round) => {
                game.rounds.push(round)
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    configureGame().then(() => {
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