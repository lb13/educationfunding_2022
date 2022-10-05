const ruleInput = document.getElementById("rule-input");
const ruleResults = document.getElementById("rule-results");
const ruleRequest = new Request("/data/ilr_rules_2223_v3.json");

fetch(ruleRequest)
    .then(response => response.json())
    .then(data => {
        let rules = data;

        ruleInput.addEventListener("input",function(){
            let filteredRules = rules;
            ruleResults.innerHTML = "";

            // If there is something in the search field
            if (ruleInput.value != ""){

                // Reset the page score to zero
                filteredRules.forEach(function(rule) {
                    rule.score = 0;
                });

                // Create array of search terms, split by space character
                // Normalize and replace diacritics
                let searchterms = ruleInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(" ");

                // Apply a filter to the array of pages for each search term
                searchterms.forEach(function(term) {
                    if (term != "") {
                        filteredRules = filteredRules.filter(function(rule) {
                            // The description is the full object, includes title, tags, categories, and summary text
                            // You could make this more specific by doing something like:
                            // let description = page.title;
                            // or you could combine fields, for example page title and tags:
                            // let description = page.title + ' ' + JSON.stringify(page.tags)
                            let description = rule["Rule Name"];
                            return description.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().indexOf(term) !== -1;
                        });
                    }
                }); // end of filter for loop

                // Apply weighting to the results
                searchterms.forEach(function(term) {
                    if (term != "") {
                        // Loop through each page in the array
                        filteredRules.forEach(function(rule) {

                            // Assign 3 points for search term in title
                            if (rule["Rule Name"].normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(term)) {
                                rule.score += 3
                            };

                        })
                    };                                      
                });

                // Filter out any pages that don't have a score of at least 1
                filteredRules = filteredRules.filter(function(rule){
                    return rule.score > 0;
                })

                // sort filtered results by title
                // borrowed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                filteredRules.sort(function(a, b) {
                    const titleA = a["Rule Name"].toUpperCase(); // ignore upper and lowercase
                    const titleB = b["Rule Name"].toUpperCase(); // ignore upper and lowercase
                    if (titleA < titleB) {
                        return -1;
                    }
                    if (titleA > titleB) {
                        return 1;
                    }
                    // titles must be equal
                    return 0;
                });
                
                // then sort by page score
                filteredRules.sort(function(a, b) {
                    return b.score - a.score;
                });

                // Limit to top 3 matching results
                filteredRules = filteredRules.slice(0,3);

                // For each of the pages in the final filtered list, insert into the results list
                filteredRules.forEach(function(rule) {
                    let errorWarningTag;

                    if ( rule["Error or Warning"] == "Error" ) {
                        errorWarningTag = "&nbsp;<span class=\"tag has-background-danger has-text-white\">" + rule["Error or Warning"] + "</span>"
                    } else {
                        errorWarningTag = "&nbsp;<span class=\"tag has-background-warning has-text-black\">" + rule["Error or Warning"] + "</span>"
                    }

                    let resultHTML = "<div class=\"card my-2\"><div class=\"card-content\"><p class=\"title\">" + rule["Rule Name"] + errorWarningTag + "</p><p class=\"subtitle\">" + rule["Error Message"] + "<p class=\"is-family-monospace\">Version: <strong>" + rule["Version"] + "</strong><br>Status: <strong>" + rule["Status"] + "</strong><br>Details: <strong>" + rule["Rule Description"].replaceAll("\n","<br>") + "</strong></p></div></div>";
                    ruleResults.insertAdjacentHTML("beforeend",resultHTML);

                }); // end of page for loop

            }; // end of IF
            
        }); // end of event listener
    });