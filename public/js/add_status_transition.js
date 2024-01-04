// add status_transition.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'add_status_transition.js', is adapted and extended from the starter 'add_person.js' script provided in the course materials, as well as stackoverflow.com. The adaptation has been customized for the functionality of adding status transitions in the Golden Beach Electronics Inventory Management System.

    Adaptations and Customizations:
    - While the basic structure for handling form submissions and AJAX requests is inspired by 'add_person.js', significant modifications have been made to cater to status transition functionality specific to this project, including additional functionality that includes dynamic population of status transition data and handling of different form inputs specific to the requirements of status transition management in this project.
    
    Original Elements:
    - The method of dynamically fetching and displaying status transition data using the 'fetch' API and populating it on the webpage is an original contribution, demonstrating a more modern approach to AJAX and DOM manipulation compared to the XMLHttpRequest used in the starter code.
    - Error handling and user feedback mechanisms have been tailored to the specific needs and data structure of the status transition functionality.

    Date: 12/03/23
    Source: Stack Overflow - https://stackoverflow.com/questions/73400941/unable-to-display-data-dynamically-using-fetch-api

    ---------------------------------
    END OF CITATIONS
*/


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-status-transition-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission

            // Gather the form data
            const preStatusID = document.getElementById('input-preStatusID').value;
            const postStatusID = document.getElementById('input-postStatusID').value;
            const validStatusTransitionName = document.getElementById('input-validStatusTransitionName').value;
            const validStatusTransitionDescription = document.getElementById('input-validStatusTransitionDescription').value;

            // Construct the data object to send
            const data = {
                preStatusID: preStatusID,
                postStatusID: postStatusID,
                validStatusTransitionName: validStatusTransitionName,
                validStatusTransitionDescription: validStatusTransitionDescription
            };

            // Send the data using AJAX to the server
            fetch('/add-transition-status-ajax', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Auto-refresh the page on successful addition
                location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while adding the status transition');
            });
        });
    }
});


function populateTransitions() {
    fetch('/get-status-transitions') // Endpoint to get status transitions data
        .then(response => response.json())
        .then(data => {
            let table = document.getElementById('transitions-table-body');
            table.innerHTML = '';
            data.forEach(transition => {
                let row = `<tr id="transition-row-${transition.validStatusTransitionID}">
                              <td>${transition.validStatusTransitionID}</td>
                              <td>${transition.validStatusTransitionName}</td>
                              <td>${transition.validStatusTransitionDescription}</td>
                              <td>${transition.preStatusID}</td>
                              <td>${transition.postStatusID}</td>
                              <td>
                                  <button onclick="updateTransition(${transition.validStatusTransitionID})">Update</button>
                                  <button class="delete-transition-button" data-transition-id="${transition.validStatusTransitionID}">Delete</button>
                              </td>
                           </tr>`;
                table.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error fetching transitions:', error);
        });
}
