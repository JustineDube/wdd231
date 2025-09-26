 async function getMembers() {
    const response = await fetch('data/members.json');
    const data = await response.json();
    displayMembers(data);
}

function displayMembers(members) {
    const container = document.querySelector("#directory");
    container.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement("section");
        card.classList.add("member");

        card.innerHTML = `
        <img src="images/${member.image}" alt="${member.name} logo">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank">Visit Website</a>
      `;

        container.appendChild(card);
    });
}

getMembers();

// Layout toggle
document.querySelector("#gridView").addEventListener("click", () => {
    document.querySelector("#directory").classList.add("grid");
    document.querySelector("#directory").classList.remove("list");
});

document.querySelector("#listView").addEventListener("click", () => {
    document.querySelector("#directory").classList.add("list");
    document.querySelector("#directory").classList.remove("grid");
});

// Dates
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;