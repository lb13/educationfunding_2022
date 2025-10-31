const upcoming_returns_div = document.getElementById("ilr-dates");
const next_return_div = document.getElementById("next-return");

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

fetch(ilr_request)
  .then(response => response.json())
  .then(data => {
    const returns = data.sort((a, b) => a.return_date_number - b.return_date_number);
    const upcoming_returns = returns.filter(r => r.return_date_number >= today_number);

    const next_return = upcoming_returns[0];
    if (!next_return) return;

    const days_remaining = getNumberOfDays(today, next_return.return_date);
    let days_remaining_desc =
      days_remaining === 0
        ? "today"
        : days_remaining === 1
        ? "tomorrow"
        : `in ${days_remaining} days`;

    const reference_date_desc = next_return.reference_date || "n/a";

    next_return_div.innerHTML = `
      <p><em>Next ILR (${days_remaining_desc})</em></p>
      <p class="title">${next_return.return_name} (${next_return.academic_year})</p>
      <p>Due date: <strong>${next_return.return_date}</strong><br>
      Reference date: <strong>${reference_date_desc}</strong></p>
    `;

    let displayHTML = upcoming_returns
      .slice(1)
      .map(r => `<li><strong>${r.academic_year}</strong> - ${r.return_name} (due on ${r.return_date})</li>`)
      .join("");

    upcoming_returns_div.innerHTML = `<div class="content"><ul>${displayHTML}</ul></div>`;
  })
  .catch(err => {
    next_return_div.textContent = "Error loading ILR dates.";
    console.error(err);
  });

function toggleUpcomingReturns() {
  const x = document.getElementById("ilr-dates");
  x.style.display = x.style.display === "none" ? "block" : "none";
}
