document.addEventListener('DOMContentLoaded', function() {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var header = document.querySelector('.header');
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('mainNav');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      nav.classList.toggle('mobile-open');
    });

    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('mobile-open');
      });
    });
  }
});
