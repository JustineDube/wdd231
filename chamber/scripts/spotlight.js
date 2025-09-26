const spotlightContainer = document.getElementById('spotlight-container');
const membersURL = 'data/members.json'; // Make sure this is the correct path

fetch(membersURL)
    .then(response => response.json())
    .then(data => {
        const goldAndSilver = data.members.filter(member =>
            member.membershipLevel === "Gold" || member.membershipLevel === "Silver"
        );

        const shuffled = goldAndSilver.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2); // Pick 2 or 3

        selected.forEach(member => {
            const card = document.createElement('section');
            card.classList.add('member');

            card.innerHTML = `
        <h3>${member.name}</h3>
        <img src="${member.logo}" alt="${member.name} logo">
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
        <p><strong>Membership:</strong> ${member.membershipLevel}</p>
      `;

            spotlightContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error loading spotlight members:', error);
        spotlightContainer.innerHTML = '<p>Unable to load spotlight members.</p>';
    });