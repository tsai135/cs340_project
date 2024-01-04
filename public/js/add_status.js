// add_status.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'add_status.js', has been adapted from the 'add_person.js' script provided in the course materials. The adaptation has been customized for the functionality of adding status records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - Adapted the AJAX-based form submission handling from 'add_person.js' to suit status management.
    - The form fields and data structure have been changed to accommodate status information (status name, description, and date).
    - Fetch API is used for sending AJAX requests, showcasing an updated approach compared to the XMLHttpRequest used in 'add_person.js'.
    
    Original Elements:
    - The implementation of dynamically updating the status list post-submission and error handling tailored to status management specifics.
    - The script incorporates new logic for processing status data and providing user feedback, demonstrating a deep understanding of JavaScript and AJAX in a different context.

    Citation Scope: Entire 'add_status.js' file
    Date: 12/02/23
    Originality: Adapted from 'add_person.js' (CS 340 course materials) with significant modifications and enhancements for status management functionality.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

    ---------------------------------
    END OF CITATIONS
*/

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-status-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const statusName = document.getElementById('input-statusName').value;
            const statusDescription = document.getElementById('input-statusDescription').value;
            const statusDate = document.getElementById('input-statusDate').value;

            const data = {
                statusName: statusName,
                statusDescription: statusDescription,
                statusDate: statusDate
            };

            fetch('/add-status-ajax', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json(); // This ensures the response is treated as JSON.
            })
            .then(data => {
                alert(data.message); // Assuming the server sends a JSON object with a 'message' key
                form.reset();
                fetchAndDisplayStatuses(); // Fetch and update the status list
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error adding status: ' + error.message);
            });
        });
    }
});

function fetchAndDisplayStatuses() {
    fetch('/get-statuses-ajax')
        .then(response => response.json())
        .then(statuses => {
            updateStatusTable(statuses);
        })
        .catch(error => console.error('Error fetching statuses:', error));
}

function updateStatusTable(statuses) {
    let tableBody = document.querySelector('#view tbody');
    tableBody.innerHTML = ''; // Clear existing rows
    statuses.forEach(status => {
        let row = `<tr>
            <td>${status.statusID}</td>
            <td>${status.statusName}</td>
            <td>${status.statusDescription}</td>
            <td>${status.statusDate}</td>
            <td>
                        <button onclick="updateStatus(${status.statusID})">Edit</button>
                        <button onclick="deleteStatus(${status.statusID})">Delete</button>
                    </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
