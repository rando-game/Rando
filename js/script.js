let gameInterval; // Global variable to store the interval
let totalWins = 0; // Global variable to store total wins

function resetGame() {
    // Reset game state variables
    totalWins = 0;
    document.getElementById('playerSelections').textContent = 0;
    document.getElementById('lastPlayerChoice').textContent = '-';
    document.getElementById('matches').textContent = 0;
    document.getElementById('consecutiveMatches').textContent = 0;
    document.getElementById('totalWins').textContent = 0;

    // Clear any previous game grid
    document.getElementById('game').innerHTML = '';

    // Stop any ongoing game cycle
    clearInterval(gameInterval);

    // Pause and reset audio
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

function startGame() {
    console.log('Start Game button clicked'); // Debugging line

    // Hide welcome page and show game page
    showPage('gamePage');

    const gameContainer = document.getElementById('game');
    const rows = parseInt(document.getElementById('gridRows').value);
    const cols = parseInt(document.getElementById('gridCols').value);
    const delay = parseInt(document.getElementById('cycleDuration').value) * 1000; // Convert seconds to milliseconds

    let playerChoice = null;
    let gameNumber = null;
    let playerSelections = 0;
    let matches = 0;
    let consecutiveMatches = 0;
    let previousMatch = false;

    const backgroundMusic = document.getElementById('backgroundMusic');
    const selectSound = document.getElementById('selectSound');
    const matchSound = document.getElementById('matchSound');
    const generateSound = document.getElementById('generateSound');
    const winSound = document.getElementById('winSound'); // Get win sound element

    if (backgroundMusic) {
        backgroundMusic.play(); // Play background music
    } else {
        console.error('Background music element not found');
        return;
    }

    gameContainer.innerHTML = ''; // Clear game field
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 60px)`; // Set grid columns

    // Create the game grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const btn = document.createElement('button');
            btn.textContent = i * cols + j + 1;
            btn.addEventListener('click', () => {
                if (playerChoice === null) {
                    playerChoice = parseInt(btn.textContent);
                    btn.style.backgroundColor = '#333'; // Darken selected button
                    btn.style.color = '#fff';
                    playerSelections++;
                    selectSound.play(); // Play select sound
                    updateStats();
                }
            });
            gameContainer.appendChild(btn);
        }
    }

    function gameCycle() {
        const maxNumber = rows * cols;
        gameNumber = Math.floor(Math.random() * maxNumber) + 1;
        const buttons = gameContainer.querySelectorAll('button');

        // Reset previous selection
        buttons.forEach(button => {
            button.style.backgroundColor = '#fff';
            button.style.color = '#333';
        });

        // Find the button with the game's chosen number
        const gameButton = Array.from(buttons).find(button => parseInt(button.textContent) === gameNumber);
        if (gameButton) {
            gameButton.style.backgroundColor = getRandomColor();
            generateSound.play(); // Play generate sound
        }

        // Check if player choice matches game number
        if (playerChoice !== null) {
            if (playerChoice === gameNumber) {
                matches++;
                consecutiveMatches = previousMatch ? consecutiveMatches + 1 : 1;
                previousMatch = true;
                matchSound.play(); // Play match sound
                totalWins++; // Increment total wins

                // Play win sound
                if (winSound) {
                    winSound.play(); // Play win sound
                } else {
                    console.error('Win sound element not found');
                }

                showMessage('Congrats! You won!');
            } else {
                consecutiveMatches = 0;
                previousMatch = false;
            }
            updateStats();
            playerChoice = null; // Reset player choice for the next round
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updateStats() {
        document.getElementById('playerSelections').textContent = playerSelections;
        document.getElementById('lastPlayerChoice').textContent = playerChoice !== null ? playerChoice : '-';
        document.getElementById('matches').textContent = matches;
        document.getElementById('consecutiveMatches').textContent = consecutiveMatches;
        document.getElementById('totalWins').textContent = totalWins;
    }

    function showMessage(message) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = message;
        setTimeout(() => {
            messageEl.textContent = '';
        }, 2000); // Hide message after 2 seconds
    }

    gameInterval = setInterval(gameCycle, delay);
}

function stopGame() {
    clearInterval(gameInterval); // Stop the game cycle
    document.getElementById('backgroundMusic').pause(); // Stop the background music

    // Update final stats on results page
    document.getElementById('finalPlayerSelections').textContent = document.getElementById('playerSelections').textContent;
    document.getElementById('finalLastPlayerChoice').textContent = document.getElementById('lastPlayerChoice').textContent;
    document.getElementById('finalMatches').textContent = document.getElementById('matches').textContent;
    document.getElementById('finalConsecutiveMatches').textContent = document.getElementById('consecutiveMatches').textContent;
    document.getElementById('finalTotalWins').textContent = totalWins;

    showPage('resultsPage'); // Show results page
}

// Show specific page and hide the others
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none'; // Hide all pages
    });

    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
        activePage.style.display = 'block'; // Show the requested page
    }
}

// Event listeners
document.getElementById('startGameBtn').addEventListener('click', startGame);
document.getElementById('stopGameBtn').addEventListener('click', stopGame);

// Add event listener for the 'Back to Menu' button
document.getElementById('menuButton').addEventListener('click', () => {
    resetGame(); // Reset the game when going back to the menu
    showPage('welcomePage');
    console.log('Back to Menu button clicked'); // Debugging line
});

// Add event listener for the 'Start Over' button
document.getElementById('restartGameBtn').addEventListener('click', () => {
    resetGame(); // Reset the game on "Start Over"
    showPage('welcomePage');
});

// Ensure only welcome page is visible on load
document.addEventListener('DOMContentLoaded', () => {
    resetGame(); // Reset the game on initial load
    showPage('welcomePage');
    console.log('Script loaded');
});
