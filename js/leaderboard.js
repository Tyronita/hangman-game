const leaderboard = JSON.parse(localStorage.getItem('leaderboard'))
if (!leaderboard) {
    location.assign('/index.html')
}

const entriesTable = document.getElementsByTagName('tbody')
renderLeaderboardDOM(leaderboard, entriesTable)