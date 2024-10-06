let questions = [];
let currentQuestionIndex = 0;
let hearts = 3;
let level = 1;
let selectedCharacter = null;
let skipUsed = false;

async function fetchQuestions() {
    try {
        let response = await fetch('https://opentdb.com/api.php?amount=10&category=17&type=multiple');
        let data = await response.json();
        
        questions = data.results.map(item => {
            return {
                question: item.question,
                options: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
                correctAnswer: item.correct_answer
            };
        });
        
        loadQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function chooseCharacter(character) {
    selectedCharacter = character;
    document.getElementById("character-selection").classList.add("hidden");
    document.getElementById("question-container").classList.remove("hidden");

    if (selectedCharacter === "levelBoost") {
        level = 3;
        document.getElementById("level-counter").textContent = level;
    }
    fetchQuestions();
    updateHeartsDisplay();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert("Congratulations! You've completed the quiz!");
        window.location.href = 'nextm/mission2.html';
        return;
    }

    let questionElement = document.getElementById("question");
    let optionsElements = document.getElementsByClassName("option");
    
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question; // Use innerHTML to handle special characters
    for (let i = 0; i < optionsElements.length; i++) {
        if (i < currentQuestion.options.length) {
            optionsElements[i].classList.remove("hidden");
            optionsElements[i].textContent = currentQuestion.options[i];
        } else {
            optionsElements[i].classList.add("hidden");
        }
    }

    if (selectedCharacter === "skip" && !skipUsed) {
        document.getElementById("skip-button").classList.remove("hidden");
    } else {
        document.getElementById("skip-button").classList.add("hidden");
    }
}

function handleAnswer(selectedIndex) {
    let currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.options[selectedIndex] === currentQuestion.correctAnswer) {
        level++;
        document.getElementById("level-counter").textContent = level;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            alert("Congratulations! You've completed the quiz!");
            window.location.href = 'nextm/mission2.html';
        }
    } else {
        hearts--;
        updateHeartsDisplay();
        showFeedback(currentQuestion);
        if (hearts === 0) {
            gameOver();
        }
    }
}

function showFeedback(currentQuestion) {
    document.getElementById("feedback-container").classList.remove("hidden");
    document.getElementById("feedback-message").textContent = `The correct answer was "${currentQuestion.correctAnswer}".`;
}

function closeFeedback() {
    document.getElementById("feedback-container").classList.add("hidden");
    if (hearts > 0 && currentQuestionIndex < questions.length) {
        loadQuestion();
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
    document.getElementById("special-congrats").classList.add("hidden");
    document.getElementById("character-selection").classList.remove("hidden");
}

function toggleDescription() {
    const descriptionElement = document.getElementById("game-description");
    if (descriptionElement.classList.contains("hidden")) {
        descriptionElement.classList.remove("hidden");
    } else {
        descriptionElement.classList.add("hidden");
    }
}

window.onload = function () {
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("game-over").classList.add("hidden");
    document.getElementById("special-congrats").classList.add("hidden");
    document.getElementById("game-description").classList.add("hidden");
};