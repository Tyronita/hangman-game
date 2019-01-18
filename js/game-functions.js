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
const activateRounds = () => {
    const savedGameData = JSON.parse(localStorage.getItem('game'))
    const needsReactivating = savedGameData.rounds.every((round) => typeof round.word !== 'string')
    if (savedGameData !== undefined) {

        if (needsReactivating) {
            
            savedGameData.rounds = savedGameData.rounds.map((round) => {
                const word = round.word
                const activatedRound = new Hangman(word, round.remainingGuesses)
                return activatedRound
            })
        } else {
            // Making every round a hangman object
            savedGameData.rounds = savedGameData.rounds.map((round) => {
                const word = round.word.toLowerCase().split('')
                const activatedRound = new Hangman(word, round.guessCount)
                return activatedRound
            })
        }

        saveGame(savedGameData)
        // Return game with activated hangman objects
        return savedGameData
    } else {
        // If no JSON data found send back to menu
        location.assign('index.html')
    }

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
        // Easy
        if (game.difficulty === 'easy') {
            for (let i = 0; i < 5; i++) {
                await createRound(1, 10).then((round) => {
                    game.rounds.push(round)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else if (game.difficulty === 'medium') {
            for (let i = 0; i < 10; i++) {
                await createRound(2, 8).then((round) => {
                    game.rounds.push(round)
                }).catch((err) => {
                    console.log(err)
                })
            }
        } else if (game.difficulty === 'hard') {
            for (let i = 0; i < 20; i++) {
                await createRound(3, 4).then((round) => {
                    game.rounds.push(round)
                }).catch((err) => {
                    console.log(err)
                })
            }
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