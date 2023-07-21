// JavaScript code to fetch the data from data.json
fetch('../data.json')
    .then(response => response.json())
    .then(data => {
        const accordionExp = document.getElementById('accordion_exp');

        // Iterate through the scraped data and create accordion items
        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';

            // Create the button element for accordion header
            const accordionButton = document.createElement('button');
            accordionButton.className = 'accordion-button collapsed';
            accordionButton.type = 'button';
            accordionButton.setAttribute('data-bs-toggle', 'collapse');
            accordionButton.setAttribute('data-bs-target', `#collapse${i}`);
            accordionButton.setAttribute('aria-expanded', 'false');
            accordionButton.setAttribute('aria-controls', `collapse${i}`);

            // Create the h6 element for accordion header
            const accordionHeader = document.createElement('h6');
            accordionHeader.className = 'accordion-header';
            accordionHeader.textContent = `${item.position} @ ${item.company}`;

            // Create the div element for experience description
            const experienceDesc = document.createElement('div');
            experienceDesc.className = 'experience_desc';

            // Create the div elements for the date and location
            const dateDiv = document.createElement('div');
            dateDiv.className = 'flex-child';
            dateDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                ${item.duration}
            `;

            const locationDiv = document.createElement('div');
            locationDiv.className = 'flex-child';
            locationDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                </svg>
                ${item.location}
            `;

            // Append date and location divs to the experience description
            experienceDesc.appendChild(dateDiv);
            experienceDesc.appendChild(locationDiv);

            // Append the accordion header and experience description to the button
            accordionButton.appendChild(accordionHeader);
            accordionButton.appendChild(experienceDesc);

            // Create the div element for accordion collapse
            const accordionCollapse = document.createElement('div');
            accordionCollapse.id = `collapse${i}`;
            accordionCollapse.className = 'accordion-collapse collapse';
            accordionCollapse.setAttribute('data-bs-parent', '#accordion_exp');

            // Create the div element for accordion body
            const accordionBody = document.createElement('div');
            accordionBody.className = 'accordion-body';

            // Create the unordered list for the experience description
            const ul = document.createElement('ul');

            // Populate the unordered list with the description list items
            const desc = item.description;
            for (let j = 0; j < desc.length; j++) {
                const li = document.createElement('li');
                li.textContent = desc[j];
                ul.appendChild(li);
            }

            // Append the unordered list to the accordion body
            accordionBody.appendChild(ul);

            // Append the accordion body to the accordion collapse
            accordionCollapse.appendChild(accordionBody);

            // Append the button and accordion collapse to the accordion item
            accordionItem.appendChild(accordionButton);
            accordionItem.appendChild(accordionCollapse);

            // Append the accordion item to the accordion_exp div
            accordionExp.appendChild(accordionItem);
        }
    })
    .catch(error => console.error('Error fetching data:', error));

