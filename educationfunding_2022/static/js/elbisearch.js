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

                    let linkAddress = page.link ? page.link : page.permalink;
                    let isExternal  = !!page.link;

                    let mainBtnText = page.section === 'posts' ? 'Read Post' : 'Go to Resource ↗';
                    let mainBtnHTML = '<a class="link-btn link-btn-primary"' +
                        (isExternal ? ' target="_blank" rel="noopener"' : '') +
                        ' href="' + linkAddress + '">' + mainBtnText + '</a>';

                    let detailsBtnHTML = page.section === 'resources'
                        ? '<a class="link-btn" href="' + page.permalink + '">More Details</a>'
                        : '';

                    let sectionPill = '<span class="elbi-section-pill elbi-section-pill-' + page.section + '">' +
                        page.section + '</span>';

                    let tagsHTML = '';
                    page.tags.forEach(function(tag){
                        tagsHTML += '<a href="/tags/' + tag.replace(/ /g, '-') + '" class="tag">' + tag + '</a>';
                    });

                    let resultHTML = '<li class="elbi-results-item">' +
                        sectionPill +
                        '<h2>' + page.title + '</h2>' +
                        '<p>' + page.description + '</p>' +
                        '<div class="elbi-result-actions">' + mainBtnHTML + detailsBtnHTML + '</div>' +
                        (tagsHTML ? '<div class="tag-list" style="margin-top:var(--sp-3);">' + tagsHTML + '</div>' : '') +
                        '</li>';
                    results.insertAdjacentHTML("beforeend",resultHTML);

                    if (display_score == true) {
                        results.insertAdjacentHTML("beforeend","<p>Result score: " + page.score + "</p>")
                    };

                }); // end of page for loop

            }; // end of IF
            
        }); // end of event listener
    });