// update_equipment.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This script, 'update_equipment.js', has been adapted from 'update_person.js', which was originally part of the CS 340 course materials. The adaptation is specifically designed for the functionality required for updating equipment records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script is tailored to manage the updating of equipment records, which includes handling fields such as 'barcode', 'serializationTimestamp', and 'equipmentType'.
    - Added functionality for populating form fields with existing equipment data and managing read-only states for certain fields.
    - The form submission event listener has been modified to work with the specific fields related to equipment, with appropriate data validation measures.

    Retained Elements:
    - The basic structure of AJAX request handling, including the setup of XMLHttpRequests and event listener assignment, is similar to that in 'update_person.js'.
    - The approach of preventing default form submission behavior and dynamically updating table content based on AJAX response is consistent with the original script.

    Citation Scope: Entire 'update_equipment.js' file
    Date: 11/25/23
    Originality: Adapted from 'update_person.js' (CS 340 course materials) with modifications to suit equipment update functionalities.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    ---------------------------------
    END OF CITATIONS
*/

// Get the objects we need to modify
let updateEquipmentForm = document.getElementById('update-equipment-form-ajax');


// Function to populate form fields with selected entry data
function populateFormFields(equipmentData) {
    document.getElementById("input-equipmentID-update").value = equipmentData.equipmentID;
    document.getElementById("input-equipmentID-update").readOnly = true; // Make it read-only
    document.getElementById("input-barcode-update").value = equipmentData.barcode;

    const formattedTimestamp = new Date(equipmentData.serializationTimestamp).toISOString().slice(0, 16);
    document.getElementById("input-serializationTimestamp-update").value = formattedTimestamp;

    let equipmentTypeSelect = document.getElementById("input-equipmentType-update");
    for (let i = 0; i < equipmentTypeSelect.options.length; i++) {
        if (equipmentTypeSelect.options[i].value == equipmentData.equipmentTypeID) {
            equipmentTypeSelect.selectedIndex = i;
            break;
        }
    }

    // Show the update section after populating the form fields
    showform('update');
}


// Modify the objects we need
updateEquipmentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputEquipmentID = document.getElementById("input-equipmentID-update");
    let inputBarcode = document.getElementById("input-barcode-update");
    let inputSerializationTimestamp = document.getElementById("input-serializationTimestamp-update");
    let inputEquipmentType = document.getElementById("input-equipmentType-update")

    // Get the values from the form fields
    let EquipmentIDValue = inputEquipmentID.value;
    let BarcodeValue = inputBarcode.value;
    let SerializationTimestampValue = inputSerializationTimestamp.value;
    let EquipmentTypeValue = inputEquipmentType.value;

    
    // currently the database table for Equipments does not allow updating values to NULL
    // so we must abort if being passed NULL for BarcodeValue
    if (!BarcodeValue || BarcodeValue.trim() === '') {
        console.log("Barcode cannot be null or empty.");
        return;
    }
    


    // Put our data we want to send in a javascript object
    let data = {
        equipmentID: EquipmentIDValue,
        barcode: BarcodeValue,
        serializationTimestamp: SerializationTimestampValue,
        equipmentType: EquipmentTypeValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-equipment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, EquipmentIDValue);
            console.log(xhttp.response);
            // Go back to browse equipments after successful update
            browseEquipments();
            location.reload(); // refresh the page to update view

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, equipmentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("equipments-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == equipmentID) {

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
function handleEditClick(equipmentID) {
    // Perform an AJAX request to fetch data of the selected equipment
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/get-equipment/${equipmentID}`, true); // Replace with the appropriate route to fetch equipment data
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