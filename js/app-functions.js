// Generate Random Number between two bounds
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min)) + 1

// Return fetched game data
const fetchGameData = () => JSON.parse(localStorage.getItem('game'))

// Saves the gameData in local Storage
const saveGame = (game) => {
    const gameData = JSON.stringify(game)
    localStorage.setItem('game', gameData)
}

// Wipes the gamedata in local storage
const resetGame = () => {
    localStorage.removeItem('game')
}

const showModal = () => {
    const modal = document.querySelector('#myModal');
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    const closeModal = document.querySelectorAll(".closeModal");

    // When the user clicks on <span> (x), close the modal
    closeModal.forEach((button) => {
        button.addEventListener('click', () => {
            modal.style.display = "none";
        })
    })
}
