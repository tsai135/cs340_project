// delete_equipment_type.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    The 'delete_equipment_type.js' script is adapted from the 'delete_person.js' file provided in the course materials. This adaptation has been customized for the functionality of deleting equipment types in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The AJAX request setup and delete confirmation logic from 'delete_person.js' have been adapted for handling equipment types instead of person records.
    - Modifications include changes in data structure and targeting to align with equipment type data, such as equipmentTypeID and equipmentTypeName.
    - Additional UI handling for showing and hiding specific elements during the delete operation has been implemented to enhance user experience.

    Original Elements:
    - The logic for dynamically removing rows from the equipment types table after deletion and refreshing the page for immediate update is an original contribution, showcasing practical DOM manipulation skills.
    - Customization of the confirmation prompt to provide clearer information specific to equipment types.

    Citation Scope: Entire 'delete_equipment_type.js' file
    Date: 12/01/23
    Originality: Adapted from 'delete_person.js' (CS 340 course materials) with significant modifications for equipment type management.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js

    ---------------------------------
    END OF CITATIONS
*/

function deleteEquipmentType(equipmentTypeID, equipmentTypeName) {
    let link = '/delete-equipment-type-ajax/';
    let data = {
      id: equipmentTypeID
    };

    // Populate the delete confirmation form
    $('#deleteequipmentTypeID').text(equipmentTypeID);
    $('#deleteEquipmentTypeName').text(equipmentTypeName); 

    // Show the delete confirmation form
    $('#browse').hide();
    $('#delete').show();
    

    // Handle form submission for deletion
    $('#deleteEquipmentType').submit(function(event) {
        event.preventDefault(); // Prevent the default form submission

        let link = '/delete-equipment-type-ajax/';
        let data = {
            id: equipmentTypeID
        };
    

  
        $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(equipmentTypeID);
            // Hide the delete confirmation form
            $('#delete').hide();
            $('#browse').show();
            location.reload(); // refresh page to update view
        }
        });
    });
  }
  
  function deleteRow(equipmentTypeID){
      let table = document.getElementById("equipment-types-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == equipmentTypeID) {
              table.deleteRow(i);
              break;
         }
      }
  }