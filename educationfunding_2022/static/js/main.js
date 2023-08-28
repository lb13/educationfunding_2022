document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });
  
  });

function launchreport() {
  var modal = document.getElementById("reportmodal");

  modal.classList.add("is-active");
};

function closereport() {
  var modal = document.getElementById("reportmodal");

  modal.classList.remove("is-active");
};

function launchmodal(e) {
  var modal = document.getElementById(e);

  modal.classList.add("is-active");
};

function closemodal(e) {
  var modal = document.getElementById(e);

  modal.classList.remove("is-active");
};