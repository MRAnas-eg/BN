
// Fixed navigation script for Block Network SPA

// Section switching logic
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

function showSection(id) {
  sections.forEach(sec => {
    if (sec.id === id) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });
}

// Attach click handlers
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('href')?.replace('#', '');
    if (target) showSection(target);
  });
});

// Show home by default
showSection('home');
