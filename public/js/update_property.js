// update_property.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This script, 'update_property.js', is adapted from 'update_person.js', originally part of the CS 340 course materials. The adaptation has been carried out to cater specifically to the functionality required for updating property records in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been customized to handle property records, including managing fields such as 'propertyName'.
    - Enhanced functionality for populating form fields with existing property data and managing read-only states for certain fields.
    - The form submission event listener is modified to accommodate specific fields related to property management, with necessary data validation steps.

    Retained Elements:
    - The fundamental structure of handling AJAX requests, including the setup of XMLHttpRequests and assigning event listeners, is maintained from 'update_person.js'.
    - The method of preventing default form submission behavior and dynamically updating table content based on AJAX responses remains consistent with the original script.

    Citation Scope: Entire 'update_property.js' file
    Date: 12/03/23
    Originality: Adapted from 'update_person.js' (CS 340 course materials) with modifications to suit property update functionalities.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    ---------------------------------
    END OF CITATIONS
*/

// Get the objects we need to modify
let updatePropertyForm = document.getElementById('update-property-form-ajax');


// Function to populate form fields with selected entry data
function populateFormFields(propertyData) {
    document.getElementById("input-propertyID-update").value = propertyData.propertyID;
    document.getElementById("input-propertyID-update").readOnly = true; // Make it read-only
    document.getElementById("input-propertyName-update").value = propertyData.propertyName;

    // Show the update section after populating the form fields
    showform('update');
}


// Modify the objects we need
updatePropertyForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPropertyID = document.getElementById("input-propertyID-update");
    let inputPropertyName = document.getElementById("input-propertyName-update");

    // Get the values from the form fields
    let PropertyIDValue = inputPropertyID.value;
    let PropertyNameValue = inputPropertyName.value;

    
    // currently the database table for Equipment Types does not allow updating values to NULL
    // so we must abort if being passed NULL for EquipmentTypeName
    if (!PropertyNameValue || PropertyNameValue.trim() === '') {
        console.log("Name of Item Property cannot be null or empty.");
        return;
    }
    


    // Put our data we want to send in a javascript object
    let data = {
        propertyID: PropertyIDValue,
        propertyName: PropertyNameValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-property-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, PropertyIDValue);
            console.log(xhttp.response);
            // Go back to browse item properties after successful update
            browseProperties();
            location.reload(); // refresh page to update view

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, propertyID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("properties-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == propertyID) {

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
function handleEditClick(propertyID) {
    // Perform an AJAX request to fetch data of the selected property
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `/get-property/${propertyID}`, true); // Replace with the appropriate route to fetch property data
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