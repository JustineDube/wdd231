const courses = [
  { name: "Intro to Web Development", credits: 3, subject: "WDD", completed: true },
  { name: "CSE 111", credits: 3, subject: "CSE", completed: false },
  { name: "HTML & CSS", credits: 4, subject: "WDD", completed: true },
  { name: "JavaScript Basics", credits: 4, subject: "WDD", completed: false },
];

const courseList = document.getElementById('course-list');
const totalCredits = document.getElementById('total-credits');
const filterButtons = document.querySelectorAll('.filter-buttons button');

function displayCourses(filter = 'all') {
  let filtered = courses;
  if (filter !== 'all') {
    filtered = courses.filter(course => course.subject === filter);
  }

  courseList.innerHTML = '';
  const credits = filtered.reduce((sum, course) => {
    const div = document.createElement('div');
    div.classList.add('course-card');
    if (course.completed) div.classList.add('completed');
    div.innerHTML = `<h3>${course.name}</h3><p>Credits: ${course.credits}</p>`;
    courseList.appendChild(div);
    return sum + course.credits;
  }, 0);

  totalCredits.textContent = credits;
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => displayCourses(button.dataset.filter));
});

// Initial display
displayCourses();
