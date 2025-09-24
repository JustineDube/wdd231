const courses = [
    { code: "WDD130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "WDD131", name: "Dynamic Web Fundamentals", credits: 3, completed: true },
    { code: "WDD231", name: "Frontend Web Development I", credits: 3, completed: false },
    { code: "CSE110", name: "Introduction to Programming", credits: 2, completed: true },
    { code: "CSE111", name: "Programming with Functions", credits: 3, completed: true },
    { code: "CSE210", name: "Programming with Classes", credits: 3, completed: true },
];

const courseCards = document.getElementById("courseCards");
const totalCredits = document.getElementById("totalCredits");

function displayCourses(filtered) {
    courseCards.innerHTML = "";
    let credits = 0;

    filtered.forEach(course => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        if (course.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `
        <h3>${course.code}</h3>
        <p>${course.name}</p>
        <p>Credits: ${course.credits}</p>
        <p>Status: ${course.completed ? "Completed" : "In Progress"}</p>
      `;

        credits += course.credits;
        courseCards.appendChild(card);
    });

    totalCredits.textContent = credits;
}

document.getElementById("allBtn").addEventListener("click", () => {
    displayCourses(courses);
});

document.getElementById("wddBtn").addEventListener("click", () => {
    const filtered = courses.filter(course => course.code.startsWith("WDD"));
    displayCourses(filtered);
});

document.getElementById("cseBtn").addEventListener("click", () => {
    const filtered = courses.filter(course => course.code.startsWith("CSE"));
    displayCourses(filtered);
});

// Initial load
displayCourses(courses);