// update_status.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This script, 'update_status.js', is adapted from the original script 'update_person.js', which was part of the CS 340 course materials. The modifications are tailored to meet the requirements for updating status records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been customized for handling updates to status records, which involves fields such as 'statusName', 'statusDescription', and 'statusDate'.
    - The AJAX request setup has been modified to send PUT requests specifically for updating status records, in line with the application's API design.
    - Introduction of logic to automatically set the 'statusDate' to the current date, reflecting the time of status update.

    Retained Elements:
    - The basic structure for AJAX request handling, including setting up XMLHttpRequest and managing form submissions, remains consistent with the original script.
    - The approach to dynamically updating the webpage upon successful completion of the AJAX request has been maintained.

    Original script: 'update_person.js' (CS 340 course materials)
    Adaptation for 'update_status.js' customized for status record management.

    Date: 12/02/2023
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    ---------------------------------
    END OF CITATIONS
*/


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('update-status-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const statusID = document.getElementById('input-statusID-update').value;
        const statusName = document.getElementById('input-statusName-update').value;
        const statusDescription = document.getElementById('input-statusDescription-update').value;
        
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        const data = {
            statusName: statusName,
            statusDescription: statusDescription,
            statusDate: currentDate // Use the current date
        };

        fetch(`/update-status-ajax/${statusID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Auto-refresh the page to show the updated data
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error updating status');
        });
    });
});
