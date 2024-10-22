let questions = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "Berlin", "Madrid"],
        correctAnswer: 0
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter"],
        correctAnswer: 1
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen"],
        correctAnswer: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean"],
        correctAnswer: 2
    },
    {
        question: "How many continents are there?",
        options: ["5", "6", "7"],
        correctAnswer: 2
    },
    {
        question: "What is the speed of light in vacuum (m/s)?",
        options: ["3x10^8", "2.5x10^8", "1x10^8"],
        correctAnswer: 0
    }
];

let currentQuestionIndex = 0;
let hearts = 3;
let level = 1;
let selectedCharacter = null;
let skipUsed = false;

function chooseCharacter(character) {
    selectedCharacter = character;
    document.getElementById("character-selection").classList.add("hidden");
    document.getElementById("question-container").classList.remove("hidden");

    if (selectedCharacter === "levelBoost") {
        level = 3;
        document.getElementById("level-counter").textContent = level;
    }
    loadQuestion();
    updateHeartsDisplay();
}

function loadQuestion() {
    let questionElement = document.getElementById("question");
    let optionsElements = document.getElementsByClassName("option");
    
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    for (let i = 0; i < optionsElements.length; i++) {
        optionsElements[i].textContent = currentQuestion.options[i];
    }

    if (selectedCharacter === "skip" && !skipUsed) {
        document.getElementById("skip-button").classList.remove("hidden");
    } else {
        document.getElementById("skip-button").classList.add("hidden");
    }
}

function handleAnswer(selectedIndex) {
    let currentQuestion = questions[currentQuestionIndex];
    if (selectedIndex === currentQuestion.correctAnswer) {
        level++;
        document.getElementById("level-counter").textContent = level;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else if (selectedCharacter === "extraQuestion" && hearts === 3 && level === 5) {
            alert("You have unlocked the extra question!");
            loadExtraQuestion();
        } else {
            alert("Congratulations! You've completed the quiz!");
            restartGame();
        }
    } else {
        hearts--;
        updateHeartsDisplay();
        if (hearts === 0) {
            gameOver();
        }
    }
}

function skipQuestion() {
    skipUsed = true;
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        alert("Congratulations! You've completed the quiz!");
        restartGame();
    }
}

function loadExtraQuestion() {
    currentQuestionIndex = 5;
    loadQuestion();
}

function updateHeartsDisplay() {
    let heartsElement = document.getElementById("hearts");
    heartsElement.textContent = "❤️".repeat(hearts);
}

function gameOver() {
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("game-over").classList.remove("hidden");
}

function restartGame() {
    currentQuestionIndex = 0;
    hearts = 3;
    level = 1;
    skipUsed = false;
    selectedCharacter = null;
    document.getElementById("level-counter").textContent = level;
    updateHeartsDisplay();
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("character-selection").classList.remove("hidden");
}

window.onload = function () {
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("game-over").classList.add("hidden");
};