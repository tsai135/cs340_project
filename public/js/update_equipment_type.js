// update_equipment_type.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This script, 'update_equipment_type.js', has been adapted from 'update_person.js', originally part of the CS 340 course materials. The adaptation specifically caters to the functionality required for updating equipment types in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script is tailored to handle the updating of equipment type records, including handling of unique fields such as 'equipmentTypeName', 'equipmentTypeDescription', and date fields.
    - Functionality for populating form fields with existing equipment type data and managing read-only states for certain fields is integrated.
    - The form submission event listener has been adjusted to work with the specific fields related to equipment types, and data validation is tailored to the context of equipment types.

    Retained Elements:
    - The overall structure of AJAX request handling, including the setup of XMLHttpRequests and event listener assignment, remains consistent with 'update_person.js'.
    - The approach of preventing default form submission behavior and dynamically updating table content based on AJAX response is preserved.

    Citation Scope: Entire 'update_equipment_type.js' file
    Date: 12/05/23
    Originality: Adapted from 'update_person.js' (CS 340 course materials) with modifications to suit equipment type update functionalities.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    ---------------------------------
    END OF CITATIONS
*/

// Get the objects we need to modify
let updateEquipmentTypeForm = document.getElementById('update-equipment-type-form-ajax');


// Function to populate form fields with selected entry data
function populateFormFields(equipmentTypeData) {
    document.getElementById("input-equipmentTypeID-update").value = equipmentTypeData.equipmentTypeID;
    document.getElementById("input-equipmentTypeID-update").readOnly = true; // Make it read-only
    document.getElementById("input-equipmentTypeName-update").value = equipmentTypeData.equipmentTypeName;
    document.getElementById("input-equipmentTypeDescription-update").value = equipmentTypeData.equipmentTypeDescription;

    const formattedFirstSupportDate = new Date(equipmentTypeData.firstSupportDate).toISOString().slice(0, 10);
    document.getElementById("input-firstSupportDate-update").value = formattedFirstSupportDate;

    // Handle NULL value for discontinuedSupportDate
    if (equipmentTypeData.discontinuedSupportDate) {
        const formattedDiscontinuedSupportDate = new Date(equipmentTypeData.discontinuedSupportDate).toISOString().slice(0, 10);
        document.getElementById("input-discontinuedSupportDate-update").value = formattedDiscontinuedSupportDate;
    } else {
        document.getElementById("input-discontinuedSupportDate-update").value = ''; // Set an empty value for NULL
    }

    // Show the update section after populating the form fields
    showform('update');
}


// Modify the objects we need
updateEquipmentTypeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEquipmentTypeID = document.getElementById("input-equipmentTypeID-update");
    let inputEquipmentTypeName = document.getElementById("input-equipmentTypeName-update");
    let inputEquipmentTypeDescription = document.getElementById("input-equipmentTypeDescription-update");
    let inputFirstSupportDate = document.getElementById("input-firstSupportDate-update")
    let inputDiscontinuedSupportDate = document.getElementById("input-discontinuedSupportDate-update")

    // Get the values from the form fields
    let EquipmentTypeIDValue = inputEquipmentTypeID.value;
    let EquipmentTypeNameValue = inputEquipmentTypeName.value;
    let EquipmentTypeDescriptionValue = inputEquipmentTypeDescription.value;
    let FirstSupportDateValue = inputFirstSupportDate.value;
    let DiscontinuedSupportDateValue = inputDiscontinuedSupportDate.value;

    
    // currently the database table for Equipment Types does not allow updating values to NULL
    // so we must abort if being passed NULL for EquipmentTypeName
    if (!EquipmentTypeNameValue || EquipmentTypeNameValue.trim() === '') {
        console.log("Name of Equipment Type cannot be null or empty.");
        return;
    }
    


    // Put our data we want to send in a javascript object
    let data = {
        equipmentTypeID: EquipmentTypeIDValue,
        equipmentTypeName: EquipmentTypeNameValue,
        equipmentTypeDescription: EquipmentTypeDescriptionValue,
        firstSupportDate: FirstSupportDateValue,
        discontinuedSupportDate: DiscontinuedSupportDateValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-equipment-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, EquipmentTypeIDValue);
            console.log(xhttp.response);
            // Go back to browse equipment types after successful update
            browseEquipmentTypes();
            location.reload(); // refresh page to update view

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, equipmentTypeID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("equipment-types-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == equipmentTypeID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}

// Function to handle the action when a user clicks 'Edit' button
function handleEditClick(equipmentTypeID) {
    // Perform an AJAX request to fetch data of the selected equipment
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/get-equipment-type/${equipmentTypeID}`, true); // route to fetch equipment data
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Call populateFormFields() with the received data
            console.log(xhttp.responseText);
            populateFormFields(JSON.parse(xhttp.responseText));
        }
    };

    xhttp.send();
}