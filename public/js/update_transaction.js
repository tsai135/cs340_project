// update_transaction.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This script, 'update_transaction.js', is adapted from the original script 'update_person.js', used in the CS 340 course. The modifications are tailored to meet the requirements for updating transaction records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been customized for handling updates to transaction records, which includes fields such as 'equipmentID', 'statusID', and 'transactionDate'.
    - The AJAX request setup has been altered to send PUT requests specifically for updating transaction records in line with the application's API endpoints.
    - Introduction of logic to handle and display server responses and errors specific to transaction updates.

    Retained Elements:
    - The fundamental structure for AJAX request handling, including XMLHttpRequest setup and managing form submissions, remains consistent with the original script.
    - The approach to dynamically updating the webpage upon successful completion of the AJAX request has been retained.

    Original script: 'update_person.js' (CS 340 course materials)
    Adaptation for 'update_transaction.js' customized for transaction record management.

    Date: 12/05/2023
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    ---------------------------------
    END OF CITATIONS
*/


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('update-transaction-form-ajax').addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect updated data from form
        let transactionID = document.getElementById('input-transactionID-update').value;
        let equipmentID = document.getElementById('input-equipmentID-update').value;
        let statusID = document.getElementById('input-statusID-update').value;
        let transactionDate = document.getElementById('input-transactionDate-update').value;

        // Send PUT request to server
        fetch('/update-transaction-ajax/' + transactionID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ equipmentID, statusID, transactionDate })
        })
        .then(response => {
            if (response.ok) {
                // Auto-refresh the page on successful update
                window.location.reload();
            } else {
                // If server responded with an error, handle it here
                return response.json().then(data => {
                    throw new Error(data.message || 'Update failed');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'An error occurred while updating the transaction.');
        });
    });
});
