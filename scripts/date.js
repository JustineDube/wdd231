// Current year
const yearSpan = document.getElementById("currentyear");
const now = new Date();
yearSpan.textContent = now.getFullYear();

// Last modified date
const lastMod = document.getElementById("lastModified");
lastMod.textContent = `Last Modified: ${document.lastModified}`;