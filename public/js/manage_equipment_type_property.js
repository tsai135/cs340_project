// manage_equipment_type_property.js

/*
    CITATIONS AND ACKNOWLEDGEMENTS
    ---------------------------------

    Citation Scope: Majority of 'manage_equipment_type_property.js' file
    Date: 12/7/23
    Originality: Based on the CS 340 starter code with the exception of the citations and adaptations below.
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app

    Citation for the following lines:
    - var dynamicFieldsContainer = $('#dynamic-fields-container');
    - dynamicFieldsContainer.empty();
    - $.each(data, function (index, property) {})
    
    Date: 12/7/23
    Adapted from "Dynamically Add Remove input fields using JQuery Ajax"
    Source URL: https://www.javatpoint.com/dynamically-add-remove-input-fields-using-jquery-ajax

    ---------------------------------
    END OF CITATIONS
*/

// Code for add, update, and delete operations combined into this singular js file

// Function that generates the main table and dropdown options in the manage type-specific properties page
function manageTypeSpecificPropertiesMain() {
    
    //currently selected equipment type
    var selectedEquipmentType = $('#input-equipmentType').val();

    if (selectedEquipmentType) {
        // Make an AJAX request to fetch properties based on the selected equipment type
        $.ajax({
            url: '/get-properties', // Route to retrieve properties
            method: 'GET',
            data: { equipmentTypeID: selectedEquipmentType },
            success: function (data) {
                // Update the table with properties based on the response
                var tableBody = $('#property-table-body');
                tableBody.empty();

                var tableHead = $('#property-table-head');
                tableHead.empty();
                tableHead.append(`
                    <tr>
                        <th>Properties Specific to This Equipment Type</th>
                        <th>Actions</th>
                    </tr>
                `);

                // Populate the table with properties and combined Edit/Delete buttons
                $.each(data, function (index, property) {
                    var tableRow = $('<tr>');

                    // Add property column
                    var propertyColumn = $('<td>').text(property.Property);
                    tableRow.append(propertyColumn);

                    // Add Actions column with Edit and Delete buttons
                    var actionsColumn = $('<td>');
                    var editButton = $('<button>').text('Edit');
                    var deleteButton = $('<button>').text('Delete');
                    var cancelButton = $('<button>').text('Cancel').hide();
                    
                    // Add click functionality to edit button
                    editButton.click(function () {
                        // Make an AJAX request to fetch available properties for editing
                        $.ajax({
                            url: '/get-available-properties', // Route to retrieve available properties
                            method: 'GET',
                            data: { equipmentTypeID: selectedEquipmentType },
                            success: function (editData) {
                                // Create a dropdown for editing with available properties
                                var editDropdown = $('<select>');
                                $.each(editData, function (index, editProperty) {
                                    editDropdown.append($('<option>', {
                                        value: editProperty.propertyID,
                                        text: editProperty.propertyName
                                    }));
                                });

                                // Replace the property text with the dropdown for editing
                                propertyColumn.empty().append(editDropdown);

                                // Add Update Property and Cancel buttons
                                var updateButton = $('<button>').text('Update Property');
                                var cancelButton = $('<button>').text('Cancel');
                                cancelButton.click(function () {
                                    // Reset the property column with original text
                                    handleCancelButtonClick();
                                });

                                updateButton.click(function () {
                                    // Retrieve the selected property ID
                                    var newPropertyID = editDropdown.val();

                                    // Check if newPropertyID is empty
                                    if (!newPropertyID) {
                                        newPropertyID = property.propertyID;
                                    }

                                    // Make an AJAX request to update the type-specific property
                                    $.ajax({
                                        url: `/update-type-specific-property-ajax/${property.propertyID}`, // Route to update property
                                        method: 'PUT',
                                        data: {
                                            equipmentTypeID: selectedEquipmentType,
                                            propertyID: newPropertyID,
                                            oldPropertyID: property.propertyID
                                        },
                                        success: function (response) {
                                            console.log('Property updated successfully');
                                            // update the table again here
                                            manageTypeSpecificPropertiesMain();
                                        },
                                        error: function (error) {
                                            console.error('Error updating property:', error);
                                        }
                                    });
                                });

                                actionsColumn.empty().append(updateButton).append(deleteButton).append(cancelButton);
                                cancelButton.show();
                            },
                            error: function (error) {
                                console.error('Error fetching available properties for editing:', error);
                            }
                        });
                    });
                    
                    // Add click functionality to delete button
                    deleteButton.click(function () {
                        // Ask for confirmation before deleting
                        var confirmation = confirm('Are you sure you want to delete this type-specific property?');

                        if (confirmation) {
                            var selectedEquipmentType = $('#input-equipmentType').val();

                            // Make an AJAX request to delete the type-specific property
                            $.ajax({
                                url: `/delete-type-specific-property-ajax/${property.propertyID}`, // Route to delete property
                                method: 'DELETE',
                                data: {
                                    equipmentTypeID: selectedEquipmentType,
                                    propertyID: property.propertyID
                                },
                                success: function (response) {
                                    console.log('Property deleted successfully');
                                    // update the table again
                                    manageTypeSpecificPropertiesMain();
                                },
                                error: function (error) {
                                    console.error('Error deleting property:', error);
                                }
                            });
                        } else {
                            // If the user cancels the deletion, do nothing
                            console.log('Deletion cancelled');
                        }
                    });

                    actionsColumn.append(editButton);
                    actionsColumn.append(deleteButton);

                    tableRow.append(actionsColumn);

                    // Add row to the table
                    tableBody.append(tableRow);
                });

                // Show the table after populating it with properties
                $('#property-table').show();
            },
            error: function (error) {
                console.error('Error fetching properties:', error);
            }
        });

        // Make an AJAX request to fetch AVAILABLE properties based on the selected equipment type
        $.ajax({
            url: '/get-available-properties', // Route to retrieve available properties
            method: 'GET',
            data: { equipmentTypeID: selectedEquipmentType },
            success: function (data) {
                // Update the dropdown options based on the response
                var propertyDropdown = $('#property-dropdown');
                propertyDropdown.empty();

                // Add an initial default option
                propertyDropdown.append($('<option>', {
                    value: '',
                    text: 'Select a Property'
                }));

                // Populate the dropdown with available properties
                $.each(data, function (index, property) {
                    propertyDropdown.append($('<option>', {
                        value: property.propertyID,
                        text: property.propertyName
                    }));
                });

                // Show the message and dropdown after populating it with properties
                $('#add-property-message').show();
                propertyDropdown.show();
            },
            error: function (error) {
                console.error('Error fetching available properties:', error);
            }
        });

    } else {
        // Hide the table, dropdown, and add-property-message if no equipment type is selected
        $('#add-property-message').hide();
        $('#property-table').hide();
        $('#property-dropdown').hide();
    }
}

function handleCancelButtonClick() {
    // // Make an AJAX request to fetch properties based on the selected equipment type
    console.log("cancel button clicked")
    var selectedEquipmentType = $('#input-equipmentType').val();

    $.ajax({
        url: '/get-properties', // Create a new route in the server to handle this request
        method: 'GET',
        data: { equipmentTypeID: selectedEquipmentType },
        success: function (data) {
            // Update the dynamic form fields based on the response
            var dynamicFieldsContainer = $('#dynamic-fields-container');
            dynamicFieldsContainer.empty();

            $.each(data, function (index, property) {
                //console.log(property.propertyID);
                dynamicFieldsContainer.append(`
                    <label for="input-${property.propertyID}">${property.Property}: </label>
                    <input type="text" name="input-${property.propertyID}" id="input-${property.Property}">
                    <br>
                    <br>
                `);
            });
        },
        error: function (error) {
            console.error('Error fetching properties:', error);
        }
    });
    manageTypeSpecificPropertiesMain();
}

$(document).ready(function () {
    // Existing code...

    // Cancel button click handler
    $('#cancel-button').click(function () {
        handleCancelButtonClick();
    });
});
