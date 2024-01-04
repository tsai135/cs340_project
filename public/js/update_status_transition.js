// update_status_transition.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This script, 'update_status_transition.js', has been adapted from 'update_person.js', which was originally part of the CS 340 course materials. The modifications have been specifically tailored to the functionality required for updating status transition records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been customized to handle status transition records, which involves managing fields such as 'preStatusID', 'postStatusID', 'transitionName', and 'transitionDescription'.
    - The form submission event listener has been altered to accommodate the unique fields related to status transitions, along with the necessary data validation steps.
    - Enhanced functionality for sending PUT requests to update status transition records, reflecting changes specific to this application.

    Retained Elements:
    - The basic structure of AJAX requests, including the setup of Fetch API requests and event listener assignments, is maintained from 'update_person.js'.
    - The general approach of preventing default form submission behavior and updating the web page dynamically based on the AJAX response remains consistent with the original script.

    Date: 12/03/2023
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    ---------------------------------
    END OF CITATIONS
*/

document.addEventListener('DOMContentLoaded', function() {
    const updateForm = document.getElementById('update-status-transition-form');

    if (updateForm) {
        updateForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const transitionID = document.getElementById('input-validStatusTransitionID-update').value;
            const preStatusID = document.getElementById('input-preStatusID-update').value;
            const postStatusID = document.getElementById('input-postStatusID-update').value;
            const transitionName = document.getElementById('input-validStatusTransitionName-update').value;
            const transitionDescription = document.getElementById('input-validStatusTransitionDescription-update').value;

            // Create a data object to send to the server
            const data = {
                preStatusID: preStatusID,
                postStatusID: postStatusID,
                validStatusTransitionName: transitionName,
                validStatusTransitionDescription: transitionDescription,
            };

            // Send the PUT request to the server
            fetch(`/update-transition-status-ajax/${transitionID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    // If there was an error, throw to catch block
                    throw new Error(`HTTP error! status: ${response.status}`);
                } else {
                    return response.text();
                }
            })
            .then(responseText => {
                // Reload the page to reflect the changes
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while updating the status transition');
            });
        });
    }
});
