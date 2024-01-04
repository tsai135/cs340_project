// add_property.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    This JavaScript file, 'add_property.js', incorporates structures and methodologies adapted from the 'add_person.js' script provided in the course materials. The adaptation has been customized to fit the specific requirements of property management in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The general structure for handling AJAX-based form submissions is inspired by 'add_person.js'.
    - Modifications have been made to accommodate property-specific fields and processing logic.
    - The function for adding new rows to the table has been adapted to handle property data instead of person data.
    - Original adjustments include changes to the DOM manipulation logic and the specific data being handled in AJAX requests.

    Citation Scope: Majority of 'add_property.js' file
    Date: 12/02/23
    Originality: Adapted from 'add_person.js' (CS 340 course materials) with significant modifications for property management functionality.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js

    Original Work:
    - While the AJAX request setup and form handling logic follow patterns established in 'add_person.js', the implementation details, such as form field processing and response handling, are tailored to the property data of this project.
    - The script demonstrates the application of standard AJAX techniques in a new context, specifically for the management of properties in an inventory system.

    ---------------------------------
    END OF CITATIONS
*/


// Get the objects we need to modify
let addPropertyForm = document.getElementById('add-property-form-ajax');

// Modify the objects we need
addPropertyForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPropertyName = document.getElementById("input-propertyName");
    // let inputPropertyDescription = document.getElementById("input-propertyDescription");

    // Get the values from the form fields
    let propertyNameValue = inputPropertyName.value;
    // let propertyDescriptionValue = inputPropertyDescription.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        propertyName: propertyNameValue,
        // propertyDescription: propertyDescriptionValue,
    };

    
    // Setup our AJAX request for adding equipment
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-property-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Parse the response JSON to get the equipmentID
            const response = JSON.parse(xhttp.responseText);
            const propertyID = response.propertyID;

            // Clear the input fields for another transaction
            inputPropertyName.value = '';
            // inputPropertyDescription.value = '';
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
    let propertyNameCell = document.createElement("TD");
    // let propertyDescriptionCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.equipmentID;
    propertyNameCell.innerText = newRow.propertyName;
    // propertyDescriptionCell.innerText = newRow.propertyDescription;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(propertyNameCell);
    // row.appendChild(propertyDescriptionCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);
    
};
