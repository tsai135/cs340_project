// add_equipment_type.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'add_equipment_type.js', is adapted and extended from the starter 'add_person.js' 
    provided in the CS 340 course materials. Modifications and customizations have been made to suit the specific 
    requirements of the Golden Beach Electronics Inventory Management System.

    Original 'add_person.js' Functionality:
    - Handles form submission to add new person records using AJAX.
    - Dynamically updates the table with the new data without page reload.

    Customizations in 'add_equipment_type.js':
    - Altered to handle the addition of new equipment types rather than persons.
    - Adapted form fields and AJAX request to suit equipment type data structure.
    - Added functionality to handle date inputs and set default values.
    - Custom code for handling response and updating the equipment types table.
    - Page reload implemented for view update post data addition.

    Citation Scope: Entire 'add_equipment_type.js' file
    Date: 12/01/23
    Originality: Adapted from 'add_person.js' (CS 340 course materials) with significant modifications and enhancements for equipment type management functionality.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

    ---------------------------------
    END OF CITATIONS
*/

document.addEventListener("DOMContentLoaded", function () {
    // Set the value of the input field to the current date and time when the page loads
    const dateInput = document.getElementById("input-firstSupportDate");
    const now = new Date();
    const isoString = now.toISOString().slice(0, 10); // Get ISO string in "YYYY-MM-DD" format
    dateInput.value = isoString;
});

// Get the objects we need to modify
let addEquipmentTypeForm = document.getElementById('add-equipment-type-form-ajax');

// Modify the objects we need
addEquipmentTypeForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEquipmentTypeName = document.getElementById("input-equipmentTypeName");
    let inputEquipmentTypeDescription = document.getElementById("input-equipmentTypeDescription");
    let inputFirstSupportDate = document.getElementById("input-firstSupportDate");
    let inputDiscontinuedSupportDate = document.getElementById("input-discontinuedSupportDate");

    // Get the values from the form fields
    let equipmentTypeNameValue = inputEquipmentTypeName.value;
    let equipmentTypeDescriptionValue = inputEquipmentTypeDescription.value;
    let firstSupportDateValue = inputFirstSupportDate.value;
    let discontinuedSupportDateValue = inputDiscontinuedSupportDate.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        equipmentTypeName: equipmentTypeNameValue,
        equipmentTypeDescription: equipmentTypeDescriptionValue,
        firstSupportDate: firstSupportDateValue,
        discontinuedSupportDate: discontinuedSupportDateValue
    };


    
    // Setup our AJAX request for adding equipment
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-equipment-type-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse the response JSON to get the equipmentID
            const response = JSON.parse(xhttp.responseText);
            const equipmentTypeID = response.equipmentTypeID;

            // Clear the input fields for another transaction
            inputEquipmentTypeName.value = '';
            inputEquipmentTypeDescription.value = '';
            inputFirstSupportDate.value = '';
            inputDiscontinuedSupportDate.value = '';
            location.reload(); // refresh page to update view

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});


// Function to handle adding a new row to the table
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("equipment-types-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let equipmentTypeNameCell = document.createElement("TD");
    let equipmentTypeDescriptionCell = document.createElement("TD");
    let firstSupportDateCell = document.createElement("TD");
    let discontinuedSupportDateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.equipmentID;
    equipmentTypeNameCell.innerText = newRow.equipmentTypeName;
    equipmentTypeDescriptionCell.innerText = newRow.equipmentTypeDescription;
    firstSupportDateCell.innerText = newRow.firstSupportDateCell;
    discontinuedSupportDateCell.innerText = newRow.discontinuedSupportDateCell;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(equipmentTypeNameCell);
    row.appendChild(equipmentTypeDescriptionCell);
    row.appendChild(firstSupportDateCell);
    row.appendChild(discontinuedSupportDateCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

};
