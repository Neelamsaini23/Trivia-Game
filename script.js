let player1, player2;
let category;
let questions = [];
let currentQuestionIndex = 0;
let scores = { player1: 0, player2: 0 };

document.getElementById('startGame').addEventListener('click', () => {
    player1 = document.getElementById('player1').value;
    player2 = document.getElementById('player2').value;

    if (player1 && player2) {
        document.getElementById('setup').style.display = 'none';
        document.getElementById('categorySelection').style.display = 'block';
        fetchCategories();
    }
});

async function fetchCategories() {
    const response = await fetch('https://the-trivia-api.com/api/categories');
    const categories = await response.json();
    const categorySelect = document.getElementById('categorySelect');

    for (const cat in categories) {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    }
}

document.getElementById('fetchQuestions').addEventListener('click', async () => {
    category = document.getElementById('categorySelect').value;
    questions = await fetchQuestions(category);
    document.getElementById('categorySelection').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    currentQuestionIndex = 0;
    displayQuestion();
});

async function fetchQuestions(category) {
    const difficulties = ['easy', 'medium', 'hard'];
    const questions = [];

    for (const difficulty of difficulties) {
        const response = await fetch(`https://the-trivia-api.com/api/questions?categories=${category}&difficulty=${difficulty}&limit=2`);
        const data = await response.json();
        questions.push(...data);
    }
    return questions;
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const questionData = questions[currentQuestionIndex];
        document.getElementById('question').textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;

        // Randomize and display options
        const options = [...questionData.incorrectAnswers, questionData.correctAnswer];
        shuffleArray(options);
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = ''; // Clear previous options
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('optionButton');
            button.addEventListener('click', () => checkAnswer(option));
            optionsContainer.appendChild(button);
        });
    } else {
        endGame();
    }
}

function checkAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (selectedOption === correctAnswer) {
        const points = getPoints(questions[currentQuestionIndex].difficulty);
        if (currentQuestionIndex % 2 === 0) {
            scores.player1 += points;
        } else {
            scores.player2 += points;
        }
    }

    currentQuestionIndex++;
    displayQuestion();
    updateScoreboard();
}

function getPoints(difficulty) {
    switch (difficulty) {
        case 'easy': return 10;
        case 'medium': return 15;
        case 'hard': return 20;
        default: return 0;
    }
}

function updateScoreboard() {
    document.getElementById('scoreboard').textContent = `${player1}: ${scores.player1} - ${player2}: ${scores.player2}`;
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    const winner = scores.player1 > scores.player2 ? player1 : player2;
    document.getElementById('winner').textContent = `${winner} wins! Final Score: ${scores.player1} - ${scores.player2}`;
}

document.getElementById('restart').addEventListener('click', () => {
    location.reload();
});

// Helper function to shuffle options
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

