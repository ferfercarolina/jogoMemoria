let icons = ['fa-heart', 'fa-star', 'fa-moon', 'fa-cloud', 'fa-umbrella', 'fa-bolt', 'fa-sun', 'fa-snowflake'];
let cards = [];
let selectedCards = [];
let errorCount = 0;
let startTime, timerInterval;
let isPlayerOneTurn = true;
let playerOneScore = 0, playerTwoScore = 0;
let playerOneErrors = 0, playerTwoErrors = 0;
let isDuoMode = false;

const soloBtn = document.getElementById('solo');
const duoBtn = document.getElementById('duo');
const gameSettings = document.getElementById('game-settings');
const gameBoard = document.getElementById('game-board');
const errorCounter = document.getElementById('error-counter');
const playerOneErrorCounter = document.getElementById('player-one-errors');
const playerTwoErrorCounter = document.getElementById('player-two-errors');
const timerDisplay = document.getElementById('timer');
const victoryMessage = document.getElementById('victory-message');
const finalTime = document.getElementById('final-time');
const finalErrors = document.getElementById('final-errors');
const backToMenu = document.getElementById('back-to-menu');
const historyBody = document.getElementById('history-body');

// Menu de seleção de modo
soloBtn.addEventListener('click', () => {
    document.getElementById('menu').classList.add('hidden');
    gameSettings.classList.remove('hidden');
});

duoBtn.addEventListener('click', () => {
    document.getElementById('menu').classList.add('hidden');
    gameSettings.classList.remove('hidden');
    isDuoMode = true;
});

document.getElementById('start-game').addEventListener('click', startGame);
backToMenu.addEventListener('click', resetGame);

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    setupBoard(difficulty);
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
    gameSettings.classList.add('hidden');
    document.getElementById('game-board-container').classList.remove('hidden');
}

function setupBoard(difficulty) {
    let numPairs = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    cards = generateCards(numPairs);
    shuffle(cards);
    renderBoard(cards);
}

function generateCards(numPairs) {
    let cardArray = [];
    for (let i = 0; i < numPairs; i++) {
        cardArray.push(icons[i], icons[i]); // Dois pares de cada ícone
    }
    return cardArray;
}

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function renderBoard(cards) {
    gameBoard.innerHTML = '';
    cards.forEach(icon => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.icon = icon;
        cardElement.addEventListener('click', selectCard);
        gameBoard.appendChild(cardElement);
    });
}

function selectCard(e) {
    const selectedCard = e.target;
    if (selectedCards.length < 2 && !selectedCard.classList.contains('matched')) {
        selectedCard.innerHTML = `<i class="fas ${selectedCard.dataset.icon}"></i>`;
        selectedCards.push(selectedCard);

        if (selectedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.icon === card2.dataset.icon) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        updateScore();
        selectedCards = [];
        checkVictory();
    } else {
        if (isDuoMode) {
            if (isPlayerOneTurn) {
                playerOneErrors++;
                playerOneErrorCounter.textContent = playerOneErrors;
            } else {
                playerTwoErrors++;
                playerTwoErrorCounter.textContent = playerTwoErrors;
            }
        } else {
            errorCount++;
            errorCounter.textContent = errorCount;
        }
        setTimeout(() => {
            card1.innerHTML = '';
            card2.innerHTML = '';
            selectedCards = [];
        }, 1000);
    }
}

function updateScore() {
    if (isDuoMode) {
        if (isPlayerOneTurn) {
            playerOneScore++;
        } else {
            playerTwoScore++;
        }
        isPlayerOneTurn = !isPlayerOneTurn;
    }
}

function checkVictory() {
    const matchedCards = document.querySelectorAll('.matched');
    if (matchedCards.length === cards.length) {
        clearInterval(timerInterval);
        const totalTime = calculateTimeElapsed();
        finalTime.textContent = totalTime;
        finalErrors.textContent = isDuoMode 
            ? `Jogador 1: ${playerOneErrors} erros, Jogador 2: ${playerTwoErrors} erros`
            : `Erros: ${errorCount}`;
        document.getElementById('game-board-container').classList.add('hidden');
        victoryMessage.classList.remove('hidden');
        saveToHistory(totalTime, playerOneErrors, playerTwoErrors);
    }
}

function calculateTimeElapsed() {
    const now = new Date();
    const timeElapsed = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function saveToHistory(totalTime, p1Errors, p2Errors) {
    const newRow = document.createElement('tr');
    const dateCell = document.createElement('td');
    const timeCell = document.createElement('td');
    const p1ErrorCell = document.createElement('td');
    const p2ErrorCell = document.createElement('td');
    
    dateCell.textContent = new Date().toLocaleDateString();
    timeCell.textContent = totalTime;
    p1ErrorCell.textContent = p1Errors;
    p2ErrorCell.textContent = p2Errors;

    newRow.append(dateCell, timeCell, p1ErrorCell, p2ErrorCell);
    historyBody.appendChild(newRow);
}

function updateTimer() {
    const now = new Date();
    const timeElapsed = Math.floor((now - startTime) / 1000);
    timerDisplay.textContent = timeElapsed;
}

function resetGame() {
    clearInterval(timerInterval);
    errorCount = 0;
    playerOneErrors = 0;
    playerTwoErrors = 0;
    playerOneErrorCounter.textContent = 0;
    playerTwoErrorCounter.textContent = 0;
    errorCounter.textContent = 0;
    timerDisplay.textContent = 0;
    selectedCards = [];
    document.getElementById('menu').classList.remove('hidden');
    victoryMessage.classList.add('hidden');
}
