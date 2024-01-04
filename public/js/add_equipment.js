// add_equipment.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'add_equipment.js', includes both adapted and original code for managing equipment addition in the Golden Beach Electronics Inventory Management System.

    Adapted Code:
    - The function for converting the current date and time to an ISO string format (in "YYYY-MM-DDTHH:MM" format) is adapted from a Stack Overflow discussion.
      Date: 12/11/23
      Original Source: "How to convert an ISO date to the date format yyyy-mm-dd?" on StackOverflow
      Source URL: https://stackoverflow.com/questions/25159330/how-to-convert-an-iso-date-to-the-date-format-yyyy-mm-dd
      Adaptation: Modified to fit the specific requirements for setting default values in equipment type timestamp fields.

    Citation Scope: Majority 'add_equipment_type.js' file
    Date: 12/02/23
    Originality: Adapted from 'add_person.js' (CS 340 course materials) with significant modifications and enhancements for equipment management functionality.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

    Original Work:
    - The rest of the 'add_equipment.js' script, including form handling, dynamic field processing, AJAX request setup for equipment property addition, and DOM manipulation for updating the view post-submission, is original work specifically developed for the Golden Beach Electronics project.

    ---------------------------------
    END OF CITATIONS
*/

document.addEventListener("DOMContentLoaded", function () {
    // Set the value of the input field to the current date and time when the page loads
    const timestampInput = document.getElementById("input-serializationTimestamp");
    const now = new Date();
    const isoString = now.toISOString().slice(0, 16); // Get ISO string in "YYYY-MM-DDTHH:MM" format
    timestampInput.value = isoString;
});

// Get the objects we need to modify
let addEquipmentForm = document.getElementById('add-equipment-form-ajax');

// Modify the objects we need
addEquipmentForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBarcode = document.getElementById("input-barcode");
    let inputTimestamp = document.getElementById("input-serializationTimestamp");
    let inputEquipmentTypeID = document.getElementById("input-equipmentType");

    // Get dynamic form fields for equipment type-specific properties
    let dynamicFieldsContainer = document.getElementById("dynamic-fields-container");
    let dynamicFormFields = dynamicFieldsContainer.querySelectorAll('input');

    // Get the values from the form fields
    let barcodeValue = inputBarcode.value;
    let timestampValue = inputTimestamp.value;
    let equipmentTypeIDValue = inputEquipmentTypeID.value;

    // Get the values from dynamic form fields
    let dynamicFieldValues = {};
    dynamicFormFields.forEach(field => {
        dynamicFieldValues[field.name.replace('input-', '')] = field.value;
    });

    // Put our data we want to send in a JavaScript object
    let data = {
        barcode: barcodeValue,
        serializationTimestamp: timestampValue,
        equipmentTypeID: equipmentTypeIDValue,
        typeSpecificProperties: dynamicFieldValues
    };


    
    // Setup our AJAX request for adding equipment
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-equipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse the response JSON to get the equipmentID
            const response = JSON.parse(xhttp.responseText);
            const equipmentID = response.equipmentID;

            // Clear the input fields for another transaction
            inputBarcode.value = '';
            inputTimestamp.value = '';
            inputEquipmentTypeID.value = '';

            // Clear dynamic form fields
            dynamicFormFields.forEach(field => {
                field.value = '';
            });

            // After successfully adding equipment, add properties
            addEquipmentProperties(equipmentID, dynamicFieldValues);
            //alert('Equipment added successfully');
            location.reload(); // Optionally, refresh the status list


        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

// Function to handle adding properties after adding equipment
function addEquipmentProperties(equipmentID, properties) {
    // Setup our AJAX request for adding properties
    var addPropertiesXhttp = new XMLHttpRequest();
    addPropertiesXhttp.open("POST", "/add-equipment-properties-ajax", true);
    addPropertiesXhttp.setRequestHeader("Content-type", "application/json");

    // Prepare data for adding properties
    let propertiesData = {
        equipmentID: equipmentID,
        typeSpecificProperties: properties
    };

    // Tell our AJAX request how to resolve
    addPropertiesXhttp.onreadystatechange = () => {
        if (addPropertiesXhttp.readyState == 4 && addPropertiesXhttp.status == 200) {
            // Handle successful addition of properties if needed
        } else if (addPropertiesXhttp.readyState == 4 && addPropertiesXhttp.status != 200) {
            console.log("There was an error with adding properties.");
        }
    };

    // Send the request to add properties and wait for the response
    addPropertiesXhttp.send(JSON.stringify(propertiesData));
}

// Function to handle adding a new row to the table
addRowToTable = (data) => {
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("equipments-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let barcodeCell = document.createElement("TD");
    let timestampCell = document.createElement("TD");
    let equipmentTypeIDCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.equipmentID;
    barcodeCell.innerText = newRow.barcode;
    timestampCell.innerText = newRow.serializationTimestamp;
    equipmentTypeIDCell.innerText = newRow.equipmentTypeID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(barcodeCell);
    row.appendChild(timestampCell);
    row.appendChild(equipmentTypeIDCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
};
