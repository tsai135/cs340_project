# Golden Beach Electronics Inventory Management System

This project extends the functionality of the CS 340 starter code, which is available on [GitHub](https://github.com/osu-cs340-ecampus/nodejs-starter-app).

## Code Citations

### JavaScript Files

#### `manage_equipment_type_property.js`

This JavaScript file primarily relies on the CS 340 starter code but includes specific citations and adaptations:

- **Date:** 12/7/23
- **Source:** [GitHub - CS 340 Starter Code](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

**Citation for the following lines:**

- `var dynamicFieldsContainer = $('#dynamic-fields-container');`
- `dynamicFieldsContainer.empty();`
- `$.each(data, function (index, property) {})`

- **Date:** 12/7/23
- **Adapted from:** ["Dynamically Add Remove input fields using JQuery Ajax"](https://www.javatpoint.com/dynamically-add-remove-input-fields-using-jquery-ajax)

#### `App.js`

All the code in this project is derived from the CS 340 starter code, available on [GitHub](https://github.com/osu-cs340-ecampus/nodejs-starter-app).

#### `add_equipment.js`

This JavaScript file, 'add_equipment.js', contains both adapted and original code for managing equipment addition in the Golden Beach Electronics Inventory Management System.

**Adapted Code:**

- The function for converting the current date and time to an ISO string format (in "YYYY-MM-DDTHH:MM" format) is adapted from a Stack Overflow discussion.
  - **Date:** 12/11/23
  - **Source:** ["How to convert an ISO date to the date format yyyy-mm-dd?"](https://stackoverflow.com/questions/25159330/how-to-convert-an-iso-date-to-the-date-format-yyyy-mm-dd) on StackOverflow
  - **Adaptation:** Modified to fit the specific requirements for setting default values in equipment type timestamp fields.

**Original Work:**

- The rest of the 'add_equipment.js' script, including form handling, dynamic field processing, AJAX request setup for equipment addition, and DOM manipulation for updating the view post-submission, is original work developed specifically for the Golden Beach Electronics project.

#### `add_status_transition.js`

This JavaScript file, 'add_status_transition.js', is adapted and extended from the starter 'add_person.js' script provided in the course materials, as well as Stack Overflow. The adaptation has been customized for the functionality of adding status transitions in the Golden Beach Electronics Inventory Management System.

**Adaptations and Customizations:**

- While the basic structure for handling form submissions and AJAX requests is inspired by 'add_person.js', significant modifications have been made to accommodate status transition functionality specific to this project. This includes additional functionality for dynamic population of status transition data and handling of different form inputs that are specific to the requirements of status transition management in this project.
- The method of dynamically fetching and displaying status transition data using the 'fetch' API and populating it on the webpage is an original contribution, showcasing a more modern approach to AJAX and DOM manipulation compared to the XMLHttpRequest used in the starter code.
- Error handling and user feedback mechanisms have been tailored to the specific needs and data structure of the status transition functionality.

  - **Date:** 12/03/23
  - **Source:** Stack Overflow - ["Unable to display data dynamically using fetch API"](https://stackoverflow.com/questions/73400941/unable-to-display-data-dynamically-using-fetch-api)

#### `manage-equipment-properties.hbs`

This HTML template file is based on the CS 340 starter code.

- **Date:** 12/05/23
- **Source:** [GitHub - CS 340 Starter Code](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

**Citation for the following lines:**

- `confirmation = confirm()`
- `if (confirmation){}`

- **Date:** 12/5/23
- **Adapted from:** Window `confirm()` on [W3Schools](https://www.w3schools.com/jsref/met_win_confirm.asp)

#### `manage-equipment-transactions.hbs`

In this HTML template file, the 'formatDateTimeForInput' function is utilized to format a date and time string for input fields.

**Original Functionality:**

- This function transforms a date and time string into the 'YYYY-MM-DDTHH:MM' format.

**Date Parsing Technique:**

- The method for parsing date strings draws inspiration from Stack Overflow:
  [Stack Overflow Source](https://stackoverflow.com/questions/76682404/creating-a-date-object-from-a-date-string-is-one-day-older)

**Citation Scope: 'formatDateTimeForInput' function**

**Originality:** While the core function logic is original, the date parsing method is adapted from the provided source on Stack Overflow.

- **Source:** Stack Overflow
- **Date:** 12/09/23

#### `manage-equipment-type-properties.hbs`

This HTML template file is based on the CS 340 starter code, with the exception of the citations below.

- **Date:** 11/20/23
- **Source:** [GitHub - CS 340 Starter Code](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

**Citation for the following functions:**

- `$('#property-dropdown').change(function () {})`
- `$('#submit-property').click(function () {})`

- **Date:** 12/7/23
- **Adapted from:** ["Make submit button active when value on chosen dropdown option is more than 0" on StackOverflow](https://stackoverflow.com/questions/54114149/make-submit-button-active-when-value-on-chosen-dropdown-option-is-more-than-0)

#### `manage-equipment-types.hbs`

This HTML template file is based on the CS 340 starter code, with the exception of the citations below.

- **Date:** 11/20/23
- **Source:** [GitHub - CS 340 Starter Code](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

**Citation Scope: 'formatDateTimeForInput' function**

**Originality:** While the core function logic is original, the date parsing method is adapted from the provided source on Stack Overflow.

- **Source:** Stack Overflow
- **Date:** 12/09/23

#### `manage-equipments.hbs`

This HTML template file is based on the CS 340 starter code, with the exception of the citations below:

- **Date:** 11/20/23
- **Source:** [GitHub - CS 340 Starter Code](https://github.com/osu-cs340-ecampus/nodejs-starter-app)

**Citation for the following function:**

- **Function:** `$('#input-equipmentType').change(function() {}`
- **Date:** 11/20/23
- **Adapted from:** "Dynamically Add Remove input fields using JQuery Ajax" on [JavaTpoint](https://www.javatpoint.com/dynamically-add-remove-input-fields-using-jquery-ajax)

### jQuery Functions

Citation for the following function:

```javascript
$("#input-equipmentType").change(function () {});
```
