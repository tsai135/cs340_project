// delete_transaction.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    The script 'delete_transaction.js' is an adaptation of the 'delete_person.js' script, originally provided in the CS 340 course materials. This adaptation is specifically tailored for the transaction deletion functionality in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been restructured to cater to the transaction deletion process, diverging from the original context of deleting person records.
    - Modifications include handling different data fields, such as transaction IDs, and adapting user confirmations and fetch API requests for the transaction context.
    - Additional error handling and user feedback mechanisms have been integrated to enhance the reliability and user experience of the transaction deletion process.

    Original Elements:
    - The foundational AJAX deletion pattern from 'delete_person.js' has been retained but is significantly modified to align with the transaction management requirements of the system.
    - The approach to prevent default form submission and confirm deletion operations has been preserved, ensuring a consistent user interaction model.

    Citation Scope: Entire 'delete_transaction.js' file
    Date: 12/05/23
    Originality: Adapted from 'delete_person.js' (CS 340 course materials) with substantial modifications for transaction record management.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

    ---------------------------------
    END OF CITATIONS
*/


document.getElementById('delete-transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Confirming before deletion
    if (!confirm("Are you sure you want to delete this transaction?")) {
        return; // Stop the function if not confirmed
    }

    const equipmentTransactionID = document.getElementById('deleteTransactionID').textContent;

    fetch(`/delete-transaction-ajax/${equipmentTransactionID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            // Auto-refresh the page on successful deletion
            window.location.reload();
        } else {
            // Handle error (e.g., display error message)
            console.error('Deletion failed');
            alert('Error occurred while deleting the transaction.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while attempting to delete the transaction.');
    });
});
