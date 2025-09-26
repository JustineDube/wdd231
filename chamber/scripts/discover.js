document.addEventListener("DOMContentLoaded", () => {
    displayVisitMessage();
    loadDiscoverCards();
});

// Display visit message using localStorage
function displayVisitMessage() {
    const messageArea = document.querySelector("#visit-message");
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();

    if (!lastVisit) {
        messageArea.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const diffTime = now - Number(lastVisit);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 1) {
            messageArea.textContent = "Back so soon! Awesome!";
        } else {
            messageArea.textContent = `You last visited ${diffDays} day${diffDays === 1 ? "" : "s"} ago.`;
        }
    }

    localStorage.setItem("lastVisit", now);
}

// Load JSON data and display 8 discover cards
async function loadDiscoverCards() {
    const url = "data/places.json";
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();
        displayCards(data);
    } catch (error) {
        console.error("Error loading discover data:", error);
    }
}

function displayCards(places) {
    const cardsContainer = document.querySelector("#cards");

    places.forEach((place, index) => {
        const card = document.createElement("section");
        card.classList.add("card");

        const title = document.createElement("h2");
        title.textContent = place.name;

        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = `images/${place.image}`;
        img.alt = `${place.name} photo`;
        img.loading = "lazy";
        img.width = 300;
        img.height = 200;
        figure.appendChild(img);

        const address = document.createElement("address");
        address.textContent = place.address;

        const desc = document.createElement("p");
        desc.textContent = place.description;

        const button = document.createElement("button");
        button.textContent = "Learn More";

        card.append(title, figure, address, desc, button);
        cardsContainer.appendChild(card);
    });
}