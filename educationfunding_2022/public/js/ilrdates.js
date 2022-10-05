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

        // sort by submission date
        returns = returns.sort(function(a, b) {
            return a.return_date_number - b.return_date_number;
        });

        let upcoming_returns = returns.filter(function(r) {
            return r.return_date_number >= today_number;
        });

        let next_return = upcoming_returns.slice(0,1);

        next_return.forEach(function(r){
            let days_remaining = r.return_date_number - today_number;
            let days_remaining_desc;

            if( days_remaining == 1 ) {
                days_remaining_desc = "tomorrow"
            } else if (days_remaining == 0 ) {
                days_remaining_desc = "today"
            } else {
                days_remaining_desc = "in " + days_remaining + " days"
            };

            let reference_date_desc = "";

            if ( r.reference_date == "" ) {
                reference_date_desc = "n/a"
            } else { reference_date_desc = r.reference_date };

            let displayHTML = "<p><em>Next ILR (" + days_remaining_desc + ")</em></p><p class=\"title\">" + r.return_name + " (" + r.academic_year + ")</p><p>Due date: <strong>" + r.return_date + "</strong><br>Reference date: <strong>" + reference_date_desc + "</strong></p>"
            next_return_div.insertAdjacentHTML("beforeend",displayHTML);
        })

        let upcoming_returns_afternext = upcoming_returns.slice(1,99);

        let displayHTML = "";

        upcoming_returns_afternext.forEach(function(r){
            displayHTML += "<li><strong>" + r.academic_year + "</strong> - " + r.return_name + " (due on " + r.return_date + ")</li>";
        })

        upcoming_returns_div.insertAdjacentHTML("beforeend","<div class=\"content\"><ul>" + displayHTML + "</ul></div>");

    });

function toggleUpcomingReturns() {
    var x = document.getElementById("ilr-dates");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    }