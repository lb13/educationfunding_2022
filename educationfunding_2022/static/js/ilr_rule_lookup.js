// ILR Rule Lookup — searches validation rules for the current ILR specification.
// Targets: #ilr-rule-input (search input) and #ilr-rule-results (results container)

const ruleInput   = document.getElementById("ilr-rule-input");
const ruleResults = document.getElementById("ilr-rule-results");
const ruleRequest = new Request("/data/ilr_rules_2526_v3.json");

fetch(ruleRequest)
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var rules = data;

        if (!ruleInput) return;

        ruleInput.addEventListener("input", function() {
            var filteredRules = rules.slice(); // copy
            ruleResults.innerHTML = "";

            if (ruleInput.value === "") return;

            // Reset scores
            filteredRules.forEach(function(rule) { rule.score = 0; });

            // Parse search terms (supports quoted phrases)
            var myRegexp = /[^\s"]+|"([^"]*)"/gi;
            var myString = ruleInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            var searchterms = [];
            var match;
            while ((match = myRegexp.exec(myString)) !== null) {
                searchterms.push(match[1] ? match[1] : match[0]);
            }

            // Filter: rule must match every search term
            searchterms.forEach(function(term) {
                if (term === "") return;
                filteredRules = filteredRules.filter(function(rule) {
                    var description = rule["Rule Name"] + ' ' + rule["Rule Description"];
                    return description.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().indexOf(term) !== -1;
                });
            });

            // Weight: rule name hits score higher
            searchterms.forEach(function(term) {
                if (term === "") return;
                filteredRules.forEach(function(rule) {
                    if (rule["Rule Name"].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(term)) {
                        rule.score += 3;
                    }
                    if (rule["Rule Description"].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(term)) {
                        rule.score += 1;
                    }
                });
            });

            filteredRules = filteredRules.filter(function(rule) { return rule.score > 0; });

            // Sort: alphabetical then by score
            filteredRules.sort(function(a, b) {
                var nameA = a["Rule Name"].toUpperCase();
                var nameB = b["Rule Name"].toUpperCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            filteredRules.sort(function(a, b) { return b.score - a.score; });

            // Limit to top 10
            filteredRules = filteredRules.slice(0, 10);

            filteredRules.forEach(function(rule) {
                var badgeClass = rule["Error or Warning"] === "Error"
                    ? "ilr-badge ilr-badge-error"
                    : "ilr-badge ilr-badge-warning";

                var resultEl = document.createElement('div');
                resultEl.className = 'ilr-rule-result';
                resultEl.innerHTML =
                    '<div class="ilr-rule-result-name">' +
                        rule["Rule Name"] +
                        '<span class="' + badgeClass + '">' + rule["Error or Warning"] + '</span>' +
                    '</div>' +
                    '<div class="ilr-rule-result-msg">' + rule["Error Message"] + '</div>' +
                    '<div class="ilr-rule-result-detail">' +
                        'Version: <strong>' + rule["Version"] + '</strong> &nbsp;·&nbsp; ' +
                        'Status: <strong>' + rule["Status"] + '</strong><br>' +
                        rule["Rule Description"].replaceAll("\n", "<br>") +
                    '</div>';

                ruleResults.appendChild(resultEl);
            });
        });
    });
