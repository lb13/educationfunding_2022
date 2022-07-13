const input = document.getElementById("elbi-input");
const results = document.getElementById("elbi-results");
const request = new Request("/index.json");
const display_score = false; // Set to true if you want to see the score in the results

fetch(request)
    .then(response => response.json())
    .then(data => {
        let pages = data;

        input.addEventListener("input",function(){
            let filteredPages = pages;
            results.innerHTML = "";

            // If there is something in the search field
            if (input.value != ""){

                // Reset the page score to zero
                filteredPages.forEach(function(page) {
                    page.score = 0;
                });

                // Create array of search terms, split by space character
                // Normalize and replace diacritics
                let searchterms = input.value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().split(" ");

                // Apply a filter to the array of pages for each search term
                searchterms.forEach(function(term) {
                    if (term != "") {
                        filteredPages = filteredPages.filter(function(page) {
                            // The description is the full object, includes title, tags, categories, and summary text
                            // You could make this more specific by doing something like:
                            // let description = page.title;
                            // or you could combine fields, for example page title and tags:
                            // let description = page.title + ' ' + JSON.stringify(page.tags)
                            let description = JSON.stringify(page);
                            return description.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().indexOf(term) !== -1;
                        });
                    }
                }); // end of filter for loop

                // Apply weighting to the results
                searchterms.forEach(function(term) {
                    if (term != "") {
                        // Loop through each page in the array
                        filteredPages.forEach(function(page) {

                            // Assign 3 points for search term in title
                            if (page.title.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(term)) {
                                page.score += 3
                            };

                            // Assign 2 points for search term in tags
                            if (JSON.stringify(page.tags).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(term)) {
                                page.score += 2
                            };

                            // Assign 1 point for search term in summary
                            if (page.description.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(term)) {
                                page.score += 1
                            };

                            // Assign 1 point for search term in the page categories
                            if (JSON.stringify(page.categories).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(term)) {
                                page.score += 1
                            };
                        })
                    };                                      
                });

                // Filter out any pages that don't have a score of at least 1
                filteredPages = filteredPages.filter(function(page){
                    return page.score > 0;
                })

                // sort filtered results by title
                // borrowed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                filteredPages.sort(function(a, b) {
                    const titleA = a.title.toUpperCase(); // ignore upper and lowercase
                    const titleB = b.title.toUpperCase(); // ignore upper and lowercase
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
                filteredPages.sort(function(a, b) {
                    return b.score - a.score;
                });

                // For each of the pages in the final filtered list, insert into the results list
                filteredPages.forEach(function(page) {
                    
                    let tagsHTML = '';
                    page.tags.forEach(function(tag){
                        tagsHTML += "<a href=\"/tags/" + tag.replace(/ /g,'-') + "\" class=\"tag mr-2\">" + tag + "</a>";
                    })

                    let linkAddress = '';
                    if ( page.link == null ) { linkAddress = page.permalink } else { linkAddress = page.link };

                    let flagColour = '';
                    let flagBgColour = '';
                    if ( page.section == 'resources') {
                        flagBgColour = '#FFC300'; flagColour = '#403100'
                    } else if ( page.section == 'posts' ) {
                        flagBgColour = '#0A7E8C'; flagColour = '#FFFFFF'
                    };

                    let moreDetailsButtonHTML = '';
                    if ( page.section == 'resources' ) {
                        moreDetailsButtonHTML = "<a class=\"button is-dark my-2\" href=\"" + page.permalink + "\">More Details</a>"
                    }
                    
                    // Capitalise first letter of section name, depluralise
                    let buttonText = "Go to " + page.section.charAt(0).toUpperCase() + page.section.slice(1,page.section.length - 1);

                    let resultHTML = "<li class='elbi-results-item'><span style=\"display: inline-block; background-color: " + flagBgColour + "; color: " + flagColour + "; padding: 10px; margin-top: 5px; margin-bottom: 10px;\"><a style=\"color: inherit\" href=\"/" + page.section + "\">" + page.section + "</a></span><h2 style='font-size: 1.5rem; font-weight: 800;'>" + page.title + "</h2><p>" + page.description + "</p><a class=\"button my-2 mr-2\" href='" + linkAddress + "'>" + buttonText + "</a>" + moreDetailsButtonHTML + "<p style='margin-top: 5px'>" + tagsHTML + "</p></li>";
                    results.insertAdjacentHTML("beforeend",resultHTML);

                    if (display_score == true) {
                        results.insertAdjacentHTML("beforeend","<p>Result score: " + page.score + "</p>")
                    };

                }); // end of page for loop

            }; // end of IF
            
        }); // end of event listener
    });