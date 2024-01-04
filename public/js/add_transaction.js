// add_transaction.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'add_transaction.js', draws structural inspiration from the 'add_person.js' script provided in the course materials. It has been adapted and customized for handling transactions in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The form submission handling and AJAX request setup are conceptually adapted from 'add_person.js'.
    - Specific modifications include changes in form fields to cater to transaction data such as equipment ID, status ID, and transaction date.
    - The script employs the Fetch API for making AJAX requests, demonstrating a modern approach compared to the XMLHttpRequest method used in 'add_person.js'.
    - Error handling and user feedback mechanisms have been tailored to the specific needs of transaction management.

    Original Elements:
    - This file includes new functionalities such as dynamically refreshing the page upon successful transaction addition and specific error handling relevant to transaction data.
    - The implementation of updating the transaction list after adding a new transaction demonstrates original development work.

    Citation Scope: Entire 'add_transaction.js' file
    Date: 12/05/23
    Originality: Adapted from 'add_person.js' (CS 340 course materials) with substantial modifications for transaction management.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

    ---------------------------------
    END OF CITATIONS
*/

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-transaction-form-ajax').addEventListener('submit', function(e) {
        e.preventDefault();

        // Gather form data
        let equipmentID = document.getElementById('input-equipmentID-add').value;
        let statusID = document.getElementById('input-statusID-add').value;
        let transactionDate = document.getElementById('input-transactionDate-add').value;

        // AJAX request to server
        fetch('/add-transaction-ajax', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ equipmentID, statusID, transactionDate })
        })
        .then(response => {
            if(response.ok) {
                // If response is ok, then reload the page
                window.location.reload();
            } else {
                // If server responded with an error, handle it here
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to add transaction');
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(error.message);
        });
    });
});
