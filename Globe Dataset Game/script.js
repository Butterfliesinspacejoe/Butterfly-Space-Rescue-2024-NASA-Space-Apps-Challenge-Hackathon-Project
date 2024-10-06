// JavaScript for Game Mechanics
let selectedCharacter = "";
const apiKey = 'YgjzKlKIgAM5kU2EBxIFjeZJx6ShfDk4eBSXyXbQ';

// Character attributes for success chances
const characterAttributes = {
    "Crystal Moth": { baseSuccessChance: 0.5, skillLevel: 1 },
    "Moon Explorer": { baseSuccessChance: 0.5, skillLevel: 1.2 },
    "Quantum Butterfly": { baseSuccessChance: 0.5, skillLevel: 1.1 }
};

function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById('character-selection').style.display = 'none';
    document.getElementById('mission-container').style.display = 'block';
    console.log(`Character selected: ${character}`);

    // Highlight selected character button
    const buttons = document.querySelectorAll('#character-selection button');
    buttons.forEach(button => button.classList.remove('selected'));
    document.querySelector(`#character-selection button[data-character='${character}']`).classList.add('selected');
}

function startMission() {
    const character = characterAttributes[selectedCharacter];
    let successChance = character.baseSuccessChance * character.skillLevel;

    const success = Math.random() < successChance;
    const outcomeElement = document.getElementById('mission-outcome');
    outcomeElement.style.display = 'block';
    outcomeElement.textContent = success ? "Mission Success! You have helped protect Earth's environment." : "Mission Failed. Try again to save the environment!";

    // Add success or failure classes for animations
    outcomeElement.classList.remove('success', 'failure');
    if (success) {
        outcomeElement.classList.add('success');
        document.getElementById('mission-choices').style.display = 'block';
        // Load GLOBE data when the mission is successful
        document.getElementById('globe-data-container').style.display = 'block';
        loadAirTempData();
    } else {
        outcomeElement.classList.add('failure');
    }
}

function startWaterQualityMission() {
    document.getElementById('mission-container').style.display = 'none';
    document.getElementById('new-mission-container').style.display = 'none';
    document.getElementById('mission-outcome').style.display = 'none';
    document.getElementById('mission-description').textContent = "Analyze the water quality of the Great River to help restore aquatic life.";
    document.getElementById('mission-container').style.display = 'block';
}

function makeChoice(choice) {
    document.getElementById('mission-choices').style.display = 'none';
    const outcomeElement = document.getElementById('mission-outcome');
    let branchingOutcome = "";

    switch (choice) {
        case 'Use Crystal Moth’s bioluminescence to find hidden paths':
            branchingOutcome = Math.random() < 0.7 ? "You successfully discovered a hidden path, revealing a new species of pollinator!" : "The bioluminescence revealed no paths, and time was lost.";
            break;
        case 'Analyze moon rocks to create a natural fertilizer':
            branchingOutcome = Math.random() < 0.6 ? "The moon rocks provided essential nutrients, helping pollinators thrive!" : "The analysis failed, and the rocks turned out to be ineffective.";
            break;
        case 'Use Quantum Butterfly’s quantum abilities to fast-track data':
            branchingOutcome = Math.random() < 0.8 ? "Quantum analysis revealed critical data that helped save the forest!" : "The data was inconclusive, leading to a setback.";
            break;
        default:
            branchingOutcome = "An unexpected event occurred.";
    }

    outcomeElement.textContent = `You chose to ${choice}. ${branchingOutcome}`;
    document.getElementById('new-mission-container').style.display = 'block';

    // Log the player's choice for additional interactivity
    console.log(`Player choice: ${choice}`);
}

// Tooltip functionality
function addTooltip(element, text) {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltiptext';
    tooltip.textContent = text;
    element.classList.add('tooltip');
    element.appendChild(tooltip);
}

document.addEventListener('DOMContentLoaded', () => {
    // Add tooltips to character buttons
    const characterButtons = document.querySelectorAll('#character-selection button');
    characterButtons.forEach(button => {
        button.addEventListener('click', () => selectCharacter(button.dataset.character));
    });

    addTooltip(document.querySelector("button[data-character='Crystal Moth']"), "Master navigator with bioluminescence skills.");
    addTooltip(document.querySelector("button[data-character='Moon Explorer']"), "Analyzes moon minerals to support Earth's ecosystems.");
    addTooltip(document.querySelector("button[data-character='Quantum Butterfly']"), "Manipulates quantum states for instant data synthesis.");

    // Load NASA Photo of the Day
    loadNasaPhotoOfTheDay();

    // Animate the game title
    animateGameTitle();
});

// Function to load NASA Photo of the Day
async function loadNasaPhotoOfTheDay() {
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`An error has occurred: ${response.status}`);
        }
        const data = await response.json();
        displayNasaPhoto(data);
    } catch (error) {
        console.error('Error fetching NASA Photo of the Day:', error);
    }
}

// Function to display NASA Photo of the Day
function displayNasaPhoto(data) {
    const nasaContainer = document.createElement('div');
    nasaContainer.id = 'nasa-photo-container';
    nasaContainer.innerHTML = `
        <h3>NASA Photo of the Day</h3>
        <img src="${data.url}" alt="NASA Photo of the Day" style="width: 100%; max-width: 300px; border-radius: 10px;" />
        <p><strong>${data.title}</strong></p>
        <p>${data.explanation}</p>
    `;
    document.body.insertBefore(nasaContainer, document.body.firstChild);
}

// Function to animate the game title
function animateGameTitle() {
    const gameTitle = document.getElementById('game-title');
    gameTitle.style.animation = "float 3s ease-in-out infinite";
}

// Function to load air temperature data from GLOBE API
async function loadAirTempData() {
    let retries = 3;
    const apiUrl = 'https://api.globe.gov/search/v1/measurement/protocol/measureddate/?protocols=air_temps&startdate=2010-01-01&enddate=2023-01-01&geojson=TRUE&sample=FALSE';

    while (retries > 0) {
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                if (response.status >= 500 && response.status < 600 && retries > 1) {
                    retries--;
                    console.warn(`Server error (${response.status}). Retrying... (${retries} attempts left)`);
                    continue;
                }
                throw new Error(`An error has occurred: ${response.status}`);
            }
            
            const data = await response.json();
            displayAirTempData(data);
            displayGlobeChart(data);
            break;
        } catch (error) {
            console.error('Error fetching data from GLOBE API:', error);
            retries--;
            if (retries === 0) {
                alert('Failed to load air temperature data after multiple attempts. Please try again later.');
            }
        }
    }
}

// Function to display air temperature data
function displayAirTempData(data) {
    const globeDataContainer = document.getElementById('globe-data');
    globeDataContainer.innerHTML = '';

    if (data.features && data.features.length > 0) {
        data.features.slice(0, 5).forEach(entry => {
            const properties = entry.properties;
            const dataEntry = document.createElement('div');
            dataEntry.className = 'globe-data-entry';
            dataEntry.innerHTML = `
                <p><strong>Site Name:</strong> ${properties.siteName || 'N/A'}</p>
                <p><strong>Latitude:</strong> ${properties.latitude}</p>
                <p><strong>Longitude:</strong> ${properties.longitude}</p>
                <p><strong>Measurement:</strong> ${properties.measurement ? JSON.stringify(properties.measurement) : 'No measurement available'}</p>
                <hr/>
            `;
            globeDataContainer.appendChild(dataEntry);
        });
    } else {
        globeDataContainer.innerHTML = '<p>No air temperature data available.</p>';
    }
}

// Function to display GLOBE data chart
function displayGlobeChart(data) {
    const ctx = document.getElementById('globeDataChart').getContext('2d');
    const labels = data.features.slice(0, 5).map(entry => entry.properties.siteName);
    const values = data.features.slice(0, 5).map(entry => entry.properties.measurement && entry.properties.measurement.value ? entry.properties.measurement.value : 0); // Example of measurement value with validation

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Measurement Data',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}