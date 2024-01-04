// delete_status_transition.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    The 'delete_status_transition.js' script is adapted from the 'delete_person.js' script provided in the CS 340 course materials. This adaptation has been customized for deleting status transitions in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been modified to handle the deletion of status transitions rather than person records.
    - Adjustments include targeting different data attributes (status transition IDs) and modifying the user confirmation logic specific to status transitions.
    - The AJAX request for deletion and the dynamic page update mechanisms have been repurposed to suit the needs of status transition management.

    Original Elements:
    - The implementation of user interaction for confirmation before deletion and the specific error handling mechanisms are tailored to the context of status transitions.
    - The script showcases original enhancements in user experience design, such as specific error messages and auto-refresh upon successful deletion.

    Citation Scope: Entire 'delete_status_transition.js' file
    Date: 12/03/23
    Originality: Adapted from 'delete_person.js' (CS 340 course materials) with significant modifications for status transition management.
    Source: [Insert Source URL or Reference]

    ---------------------------------
    END OF CITATIONS
*/


document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners to all delete buttons
    const deleteButtons = document.querySelectorAll('.delete-transition-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Confirm before deletion
            if (!confirm('Are you sure you want to delete this status transition?')) {
                return;
            }

            // Get the transition ID from the button's data attribute
            const transitionID = this.getAttribute('data-transition-id');

            // Send the delete request to the server
            fetch(`/delete-transition-status-ajax/${transitionID}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    // Auto-refresh the page on successful deletion
                    location.reload();
                } else {
                    // If there was an error, show an error message
                    alert('An error occurred while deleting the status transition');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred while deleting the status transition');
            });
        });
    });
});
