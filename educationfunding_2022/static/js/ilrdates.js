// ILR Returns — populates the homepage returns list with upcoming ILR return dates.
// Targets: #ilr-returns-list and #ilr-academic-year (both in layouts/index.html)

const ilrReturnsList   = document.getElementById("ilr-returns-list");
const ilrAcademicYear  = document.getElementById("ilr-academic-year");

const ilr_request = new Request("/data/ilrdates.json");
const today = new Date();
const today_number = Number(
  `${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}${('0' + today.getDate()).slice(-2)}`
);

function getNumberOfDays(start, end) {
  const [day, month, year] = end.trim().split('/').map(Number);
  const date1 = new Date(start);
  const date2 = new Date(year, month - 1, day);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor((date2 - date1) / oneDay);
}

function countdownClass(days) {
  if (days <= 14) return 'countdown-urgent';
  if (days <= 45) return 'countdown-soon';
  return 'countdown-ok';
}

function countdownLabel(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return days + ' days';
}

function formatDate(dateStr) {
  // Convert DD/MM/YYYY to "1 January 2026"
  const parts = dateStr.trim().split('/').map(Number);
  const day = parts[0], month = parts[1], year = parts[2];
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  return day + ' ' + months[month - 1] + ' ' + year;
}

fetch(ilr_request)
  .then(function(response) { return response.json(); })
  .then(function(data) {
    var returns = data.sort(function(a, b) { return a.return_date_number - b.return_date_number; });
    var upcoming = returns.filter(function(r) { return r.return_date_number >= today_number; });

    if (!upcoming.length || !ilrReturnsList) return;

    // Show the academic year of the nearest upcoming return
    if (ilrAcademicYear) {
      ilrAcademicYear.textContent = '🗓 ' + upcoming[0].academic_year + ' Academic Year';
      ilrAcademicYear.style.display = '';
    }

    // Show up to 5 upcoming returns as styled rows
    var toShow = upcoming.slice(0, 5);
    toShow.forEach(function(r) {
      var days  = getNumberOfDays(today, r.return_date);
      var cls   = countdownClass(days);
      var label = countdownLabel(days);
      var note  = r.reference_date
        ? 'Covers period to ' + formatDate(r.reference_date)
        : 'Due: ' + formatDate(r.return_date);

      var row = document.createElement('div');
      row.className = 'return-row';
      row.innerHTML =
        '<div>' +
          '<div class="return-name">' + r.return_name + ' (' + r.academic_year + ')</div>' +
          '<div class="return-sub">' + note + '</div>' +
        '</div>' +
        '<span class="countdown ' + cls + '">' + label + '</span>';
      ilrReturnsList.appendChild(row);
    });
  })
  .catch(function(err) {
    if (ilrReturnsList) ilrReturnsList.textContent = 'Error loading ILR dates.';
    console.error(err);
  });
