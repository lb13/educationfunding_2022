// ============================================================
// Hamburger menu
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  var burger     = document.getElementById('nav-burger');
  var mobileMenu = document.getElementById('nav-mobile-menu');

  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close when any link inside the menu is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });

  // Close when clicking anywhere outside nav + menu
  document.addEventListener('click', function (e) {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  });
});

// ============================================================
// Report broken link modal — CSS-based (display:flex/none)
// ============================================================
function launchreport() {
  var modal = document.getElementById('reportmodal');
  if (modal) modal.style.display = 'flex';
}

function closereport() {
  var modal = document.getElementById('reportmodal');
  if (modal) modal.style.display = 'none';
}

// ============================================================
// Generic modal — Bulma is-active class (legacy pages)
// ============================================================
function launchmodal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.add('is-active');
}

function closemodal(id) {
  var modal = document.getElementById(id);
  if (modal) modal.classList.remove('is-active');
}
