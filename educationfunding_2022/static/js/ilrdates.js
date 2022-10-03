const upcoming_returns_div = document.getElementById("ilr-dates");
const next_return_div = document.getElementById("next-return");

const ilr_request = new Request("/data/ilrdates.json");
const today = new Date();
const today_year = today.getFullYear().toString();
const today_month = ('0' + (today.getMonth()+1)).slice(-2);
const today_day = ('0' + today.getDate()).slice(-2);
const today_numberstring = today_year.concat(today_month,today_day);
const today_number = Number(today_numberstring);


fetch(ilr_request)
    .then(response => response.json())
    .then(data => {
        let returns = data;

        let upcoming_returns = returns.filter(function(r) {
            return r.return_date_number >= today_number;
        });

        let next_return = upcoming_returns.slice(0,1);

        next_return.forEach(function(r){
            let displayHTML = "Next ILR return is " + r.return_name + " (" + r.academic_year + "), due on " + r.return_date + ".";
            next_return_div.insertAdjacentHTML("beforeend",displayHTML);
        })

        let upcoming_returns_afternext = upcoming_returns.slice(1,99);

        upcoming_returns_afternext.forEach(function(r){
            let displayHTML = "<strong>" + r.academic_year + "</strong> - " + r.return_name + " (due on " + r.return_date + ")<br>";
            upcoming_returns_div.insertAdjacentHTML("beforeend",displayHTML);
        })

    });

function toggleUpcomingReturns() {
    var x = document.getElementById("ilr-dates");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    }