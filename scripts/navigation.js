const menubutton = document.querySelector('.hamburger');
const menuitems = document.querySelector('nav ul');

menubutton.addEventListener('click', () => {
  menuitems.classList.toggle('open');
});
