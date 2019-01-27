// If there is a game in progress
const previousData = fetchGameData()
if (previousData) {
    
}

resetGame() // Reset previously saved information

let newGame = {
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