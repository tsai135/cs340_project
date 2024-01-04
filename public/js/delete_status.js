// delete_status.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    The script 'delete_status.js' is adapted from the foundational structure provided in 'delete_person.js', a part of the CS 340 course materials. This adaptation focuses on the unique requirements of managing status records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script's functionality has been shifted from handling person records to dealing with status records, reflecting the specific needs of the system's status management.
    - The user interaction for confirmation and the fetch API usage for sending deletion requests have been tailored to the context of status records.
    - The dynamic updating of the status list on the webpage, post-deletion, has been custom-implemented to enhance user experience and system efficiency.

    Original Elements:
    - While the core AJAX patterns are retained from 'delete_person.js', the specific implementation of fetch requests, error handling, and DOM manipulation are custom-developed for status management.
    - The interactive elements, such as the confirmation dialog and the error handling mechanisms, are crafted to suit the specific user interface and user experience requirements of the Golden Beach Electronics Inventory Management System.

    Citation Scope: Entire 'delete_status.js' file
    Date: 12/02/23
    Originality: Adapted from 'delete_person.js' (CS 340 course materials) with significant modifications and enhancements for status record management.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

    ---------------------------------
    END OF CITATIONS
*/

function deleteStatus(statusID) {
    const confirmation = confirm("Are you sure you want to delete this status?");
    if (confirmation) {
        fetch('/delete-status-ajax/' + statusID, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    // Auto-refresh the page to update the list
                    location.reload();
                } else {
                    // Handle the error if the response is not okay
                    console.error('Error in deleting status');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}


function refreshStatusList() {
    fetch('/get-statuses-ajax') 
        .then(response => response.json())
        .then(statuses => {
            let statusListHtml = '';
            statuses.forEach(status => {
                statusListHtml += `<tr>
                    <td>${status.statusID}</td>
                    <td>${status.statusName}</td>
                    <td>${status.statusDescription}</td>
                    <td>${status.statusDate}</td>
                    <td>
                        <button onclick="updateStatus(${status.statusID})">Edit</button>
                        <button onclick="deleteStatus(${status.statusID})">Delete</button>
                    </td>
                </tr>`;
            });
            document.querySelector('#view tbody').innerHTML = statusListHtml;
        })
        .catch(error => console.error('Error:', error));
}
