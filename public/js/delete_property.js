// delete_property.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    The 'delete_property.js' script is an adaptation of the 'delete_person.js' script, which was provided as part of the CS 340 course materials. This adaptation has been tailored specifically for deleting property records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The AJAX-based deletion logic and user interaction flow from 'delete_person.js' have been customized for property management.
    - Adaptations include changing the target data structure to focus on property IDs and names.
    - Enhanced user interface interactions are implemented, such as custom confirmation prompts specific to property deletion.

    Original Elements:
    - The script features original logic for dynamically updating the properties table upon successful deletion, reflecting the specific requirements of the property management system.
    - Additional user feedback mechanisms, including page reloading and dynamic table updates, are tailored to the specific context of property management.

    Citation Scope: Entire 'delete_property.js' file
    Date: 12/03/23
    Originality: Adapted from 'delete_person.js' (CS 340 course materials) with significant modifications for property deletion functionality.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

    ---------------------------------
    END OF CITATIONS
*/

function deleteProperty(propertyID, propertyName) {
    let link = '/delete-property-ajax/';
    let data = {
      id: propertyID
    };

    // Populate the delete confirmation form
    $('#deletePropertyID').text(propertyID);
    $('#deletePropertyName').text(propertyName); 

    // Show the delete confirmation form
    $('#browse').hide();
    $('#delete').show();
    

    // Handle form submission for deletion
    $('#deleteProperty').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        let link = '/delete-property-ajax/';
        let data = {
            id: propertyID
        };
    

  
        $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(propertyID);
            // Hide the delete confirmation form
            $('#delete').hide();
            $('#browse').show();
            location.reload(); // refresh page to update view
        }
        });
    });
  }
  
  function deleteRow(propertyID){
      let table = document.getElementById("properties-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == propertyID) {
              table.deleteRow(i);
              break;
         }
      }
  }