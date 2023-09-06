let dangers = {};
let isDataLoaded = false;
let selectedPosition = null;
let selectedAction = null;

window.onload = function() {
    fetch('dangers.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch dangers data.");
        }
        return response.json();
    })
    .then(data => {
        dangers = data;
        isDataLoaded = true;
    })
    .catch(error => {
        console.error('Error fetching the dangers data:', error);
        document.getElementById("dangerOutput").innerHTML = "Failed to load dangers data. Please try again later.";
    });
};

function selectValue(cardElement) {
    const type = cardElement.getAttribute("data-type");
    const value = cardElement.getAttribute("data-value");

    if (type === "position") {
        selectedPosition = value;
    } else {
        selectedAction = value;
    }

    // Unselect other cards of the same type and select the current one
    const cards = document.querySelectorAll(`.card[data-type="${type}"]`);
    cards.forEach(card => card.classList.remove("selected"));
    cardElement.classList.add("selected");
}

function generateDanger() {
    if (!isDataLoaded) {
        document.getElementById("dangerOutput").innerHTML = "Loading dangers data, please wait...";
        return;
    }

    if (!selectedPosition || !selectedAction) {
        document.getElementById("dangerOutput").innerHTML = "Please select both a position and an action first.";
        return;
    }

    const key = `${selectedPosition}_${selectedAction}`;
    const selectedDangers = dangers[key];

    if (!selectedDangers || selectedDangers.length === 0) {
        document.getElementById("dangerOutput").innerHTML = "No dangers available for this combination.";
        return;
    }

    let outputHTML = '';
    let pickedDangers = []; // Array to store already picked dangers

    // Loop 3 times to generate 3 cards
    for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(Math.random() * selectedDangers.length);

        // Ensure the danger is not already picked
        while (pickedDangers.includes(randomIndex)) {
            randomIndex = Math.floor(Math.random() * selectedDangers.length);
        }

        pickedDangers.push(randomIndex);
        const randomDanger = selectedDangers[randomIndex];

        // Here, each iteration creates a new "card" div
        outputHTML += `
        <div class="generated-card">
            <h4 class="danger-heading">${randomDanger.name}</h4>
            <p class="danger-description">${randomDanger.description}</p>
        </div>
    `;
}

document.getElementById("dangerOutput").innerHTML = outputHTML;
const outputElement = document.getElementById("dangerOutput");
outputElement.style.display = "flex"; // Adjusted to use flex for layout
setTimeout(() => { outputElement.style.opacity = "1"; }, 10);
}

