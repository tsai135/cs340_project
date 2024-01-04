// delete_equipment.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'delete_equipment.js', is adapted from the 'delete_person.js' script provided in the course materials. The adaptation has been customized for the functionality of deleting equipment records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - Adapted the AJAX-based deletion logic from 'delete_person.js' to handle equipment deletion.
    - Modifications include changes in the data structure (equipment ID and barcode) and targeting to align with equipment data.
    - Customization of user interface elements, such as confirmation prompts and form handling, specific to equipment deletion.

    Original Elements:
    - The logic for dynamically removing rows from the equipment table post-deletion and refreshing the page for immediate feedback is original to this script.
    - The adaptation demonstrates effective application of AJAX and jQuery methods in a new context, tailored to the specific needs of equipment management.

    Citation Scope: Entire 'delete_equipment.js' file
    Date: 11/20/23
    Originality: Adapted from 'delete_person.js' (CS 340 course materials) with significant modifications for equipment deletion functionality.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

    ---------------------------------
    END OF CITATIONS
*/

function deleteEquipment(equipmentID, barcode) {
    let link = '/delete-equipment-ajax/';
    let data = {
      id: equipmentID
    };

    // Populate the delete confirmation form
    $('#deleteequipmentID').text(equipmentID);
    $('#deleteBarcode').text(barcode); 

    // Show the delete confirmation form
    $('#browse').hide();
    $('#delete').show();
    

    // Handle form submission for deletion
    $('#deleteEquipment').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        let link = '/delete-equipment-ajax/';
        let data = {
            id: equipmentID
        };
    

  
        $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(equipmentID);
            // Hide the delete confirmation form
            $('#delete').hide();
            $('#browse').show();
            location.reload(); // refresh the page to update view
        }
        });
    });
  }
  
  function deleteRow(equipmentID){
      let table = document.getElementById("equipments-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == equipmentID) {
              table.deleteRow(i);
              break;
         }
      }
  }