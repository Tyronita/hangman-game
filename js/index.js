const previousData = fetchGameData()

// If there is a game already saved in localStorage
if (previousData) {
    showModal() // Shows model content with prompt to start new game
}

const newGame = {
    rounds: [],
    difficulty: null,
    playerName: null,
    activeRoundNum: 0,
}

const createGameForm = document.querySelector('#createGame')
const formInputs = createGameForm.elements

// Form for game setup submit handler
formInputs.startGame.addEventListener('click', (e) => {
    e.preventDefault()
    newGame.difficulty = formInputs.difficulty.value
    newGame.playerName = formInputs.playerName.value

    // Configure the game before redirection and save
    createGame(newGame)
})