const courses = [
  { code: "WDD130", title: "Web Fundamentals", category: "WDD", credits: 2, completed: true },
  { code: "WDD131", title: "Web Development Basics", category: "WDD", credits: 3, completed: true },
  { code: "WDD231", title: "Intermediate Web Dev", category: "WDD", credits: 3, completed: false },
  { code: "CSE110", title: "Intro to Programming", category: "CSE", credits: 2, completed: true },
  { code: "CSE111", title: "Programming with Functions", category: "CSE", credits: 3, completed: false },
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("coursesContainer");
  const creditsTotal = document.getElementById("creditsTotal");
  const buttons = document.querySelectorAll(".controls button");

  function render(list) {
    container.innerHTML = "";
    let total = 0;
    list.forEach(course => {
      total += course.credits;
      const card = document.createElement("div");
      card.className = "course-card";
      if (course.completed) card.classList.add("completed");
      card.innerHTML = `
        <h3>${course.code} - ${course.title}</h3>
        <p>Category: ${course.category} | Credits: ${course.credits}</p>
      `;
      container.appendChild(card);
    });
    creditsTotal.textContent = total;
  }

  render(courses);

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      let filter = btn.dataset.filter;
      if (filter === "all") render(courses);
      else render(courses.filter(c => c.category === filter));
    });
  });
});
