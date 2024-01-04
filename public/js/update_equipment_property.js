// update_equipment_property.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    The 'update_equipment_property.js' script is adapted from the 'update_person.js' script, originally part of the CS 340 course materials. This adaptation specifically addresses the functional requirements of updating equipment properties in the Golden Beach Electronics Inventory Management System.

    Key Adaptations:
    - The script has been restructured to handle equipment properties, which includes fetching properties dynamically based on the equipment type and updating them as needed.
    - Functionality for dynamically generating form fields based on equipment-specific properties and handling updates via AJAX requests has been integrated.
    - Error handling and user feedback have been enhanced to cater to the context of equipment property management.

    Citation Scope: Majority of 'update_equipment_property.js' file
    Date: 12/02/23
    Originality: Adapted from 'update_person.js' (CS 340 course materials) with significant modifications for equipment property management.
    Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js

    Citation for the following lines:
        confirmation = confirm()
        if (confirmation){}
    Date: 12/5/23
    Adapted from Window confirm() on W3Schools
    Source URL: https://www.w3schools.com/jsref/met_win_confirm.asp

    Citation for the following function:
        properties.forEach((property, index) => {}
    Date: 12/5/23
    Adapted from "Dynamically Add Remove input fields using JQuery Ajax"
    Source URL: https://www.javatpoint.com/dynamically-add-remove-input-fields-using-jquery-ajax

    Original Elements:
    - The foundational structure of AJAX requests (using XMLHttpRequest) and form submission event handling has been retained from 'update_person.js'.
    - The approach to prevent default form submission and update page content dynamically based on AJAX responses remains consistent with the original script.

    ---------------------------------
    END OF CITATIONS
*/

// Get the objects we need to modify
let searchBarcodeForm = document.getElementById('search-by-barcode-form-ajax');

searchBarcodeForm.addEventListener("submit", function (e) {
    // prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputBarcode = document.getElementById("input-barcode");

    // Get the values from the form fields
    let barcodeValue = inputBarcode.value;

    // Put our data we want to send in a JavaScript object
    let data = {
        barcode: barcodeValue
    };

    // Setup our AJAX request for searching equipment by its barcode
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/search-by-barcode-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            const response = JSON.parse(xhttp.responseText);
            if (response.length > 0) {
                const equipmentID = response[0].equipmentID;
                const equipmentTypeName = response[0].equipmentTypeName;
                const equipmentTypeID = response[0].equipmentTypeID;
    
                // ... rest of your code
    
                // After successfully searching up an equipment, show its available-to-edit properties
                showEquipmentProperties(equipmentID, equipmentTypeName, equipmentTypeID);
            } else {
                console.log("Equipment not found for the given barcode.");
            }
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    // console.log(data)
    xhttp.send(JSON.stringify(data));
})


function showEquipmentProperties(equipmentID, equipmentTypeName, equipmentTypeID) {
    fetch(`/get-properties?equipmentTypeID=${equipmentTypeID}`)
        .then(response => response.json())
        .then(data => {
            // data contains properties fetched from the server
            const properties = data;

            // Generate form fields dynamically based on the properties
            const formContainer = document.getElementById('form-container'); // form container element in HTML
            formContainer.innerHTML = ''; // Clear previous content

            properties.forEach((property, index) => {
                const label = document.createElement('label');
                label.textContent = property.Property; // 'Property' is the key for property names

                // Create an input field for each property
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `property_${property.propertyID}`; // Set a unique name/id for each input field
                input.value = ''; // Initialize the input value (it will be updated with the current value)

                
                fetch(`/get-equipment-property-values?equipmentID=${equipmentID}&propertyID=${property.propertyID}`)
                    .then(response => response.json())
                    .then(propertyValueData => {
                        if (propertyValueData && propertyValueData.length > 0) {
                            // If value exists, set the input field value
                            input.value = propertyValueData[0].value; // Assuming the value is in the 'value' field
                        }
                    })
                    .catch(error => console.error('Error fetching property value:', error));

                // Create an Update button for each property
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.addEventListener('click', function () {
                    // Get the updated value from the input field
                    const updatedValue = input.value;
                
                    // Perform an AJAX request to update the property value
                    fetch(`/update-property-value?equipmentID=${equipmentID}&propertyID=${property.propertyID}&value=${encodeURIComponent(updatedValue)}`, {
                        method: 'PUT', // Specify the method as PUT
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(() => {
                        // Optionally, update UI or show a success message
                        alert('Property value updated successfully');
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        alert('Error updating property value');
                    });
                });

                // Create a Delete button for each property
                // Delete, in this case, is just replacing the value with empty, since each property is linked to equipment type
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () {
                    const updateValue = '';
                
                    // Confirmation alert with options to proceed or cancel
                    const confirmation = confirm('Are you sure you wish to make this value empty? Properties are linked to equipment type and thus cannot be deleted.');
                
                    if (confirmation) {
                        // Perform an AJAX request to update the property value
                        fetch(`/update-property-value?equipmentID=${equipmentID}&propertyID=${property.propertyID}&value=${encodeURIComponent(updateValue)}`, {
                            method: 'PUT', // Specify the method as PUT
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(() => {
                            // Optionally, update UI or show a success message
                            alert('Property value made empty successfully');
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            alert('Error updating property value');
                        });
                
                        // Update page to reflect change by looking up properties by the barcode again
                        fetch(`/get-equipment-property-values?equipmentID=${equipmentID}&propertyID=${property.propertyID}`)
                        .then(response => response.json())
                        .then(propertyValueData => {
                            if (propertyValueData && propertyValueData.length > 0) {
                                // If value exists, set the input field value
                                input.value = propertyValueData[0].value; // value in the 'value' field
                            }
                        })
                        .catch(error => console.error('Error fetching property value:', error));
                    } else {
                        // Abort the action
                        alert('Action aborted. Property value remains unchanged.');
                    }
                });
                

                formContainer.appendChild(document.createElement('br'));
                formContainer.appendChild(document.createElement('br'));

                // Append the label, separator, input fields, and update button to the form container
                formContainer.appendChild(label);
                formContainer.appendChild(document.createTextNode(': '));
                formContainer.appendChild(input);
                formContainer.appendChild(document.createTextNode(' '));
                formContainer.appendChild(updateButton);
                formContainer.appendChild(document.createTextNode(' '));
                formContainer.appendChild(deleteButton);

                if (index !== properties.length - 1) {
                    // Add a line break between each field except the last one
                    formContainer.appendChild(document.createElement('br'));
                    formContainer.appendChild(document.createElement('br'));
                }
            });
        })
        .catch(error => console.error('Error fetching properties:', error));
}