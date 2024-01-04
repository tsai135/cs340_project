-- Data Manipulation Queries
-- Project Group 104: Tsung-Hsi (Lawrence) Tsai, Matthew Alviar
------------------------------
------------------------------
-- EQUIPMENTS TABLE QUERIES
------------------------------
-- SELECT equipment barcode and type based on user input
SELECT
    e.barcode,
    et.equipmentTypeName AS 'Equipment Type'
FROM
    Equipments e
    JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
WHERE
    e.barcode = '[User input barcode]';

-- DISPLAY the history of status transitions for a specific equipment
SELECT
    et.transactionDate AS Time,
    s.statusName AS CurrentStatus
FROM
    EquipmentTransactions et
    JOIN Statuses s ON et.statusID = s.statusID
    JOIN Equipments e ON et.equipmentID = e.equipmentID
WHERE
    e.barcode = '[Barcode]'
ORDER BY
    et.transactionDate;

-- Base Query for All Equipment Items
-- This query retrieves all equipment items with their type and the most recent status.
SELECT
    e.barcode,
    e.serializationTimestamp AS 'Serialized Date',
    et.equipmentTypeName AS 'Equipment Type',
    s.statusName AS 'Current Status'
FROM
    Equipments e
    JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
    JOIN (
        SELECT
            equipmentID,
            statusID,
            MAX(transactionDate) as LatestTransactionDate
        FROM
            EquipmentTransactions
        GROUP BY
            equipmentID
    ) etx ON e.equipmentID = etx.equipmentID
    JOIN Statuses s ON etx.statusID = s.statusID;

-- Filtered Query Based on Equipment Type
-- This query filters equipment items by a selected type.
SELECT
    e.barcode,
    e.serializationTimestamp AS 'Serialized Date',
    et.equipmentTypeName AS 'Equipment Type',
    s.statusName AS 'Current Status'
FROM
    Equipments e
    JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
    JOIN (
        SELECT
            equipmentID,
            statusID,
            MAX(transactionDate) as LatestTransactionDate
        FROM
            EquipmentTransactions
        GROUP BY
            equipmentID
    ) etx ON e.equipmentID = etx.equipmentID
    JOIN Statuses s ON etx.statusID = s.statusID
WHERE
    et.equipmentTypeName = 'SelectedType';

-- 'SelectedType' should be the actual equipment type name
-- Query with Sorting Options
-- This query adds sorting functionality to the Shop Inventory page.
SELECT
    e.barcode,
    e.serializationTimestamp AS 'Serialized Date',
    et.equipmentTypeName AS 'Equipment Type',
    s.statusName AS 'Current Status'
FROM
    Equipments e
    JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
    JOIN (
        SELECT
            equipmentID,
            statusID,
            MAX(transactionDate) as LatestTransactionDate
        FROM
            EquipmentTransactions
        GROUP BY
            equipmentID
    ) etx ON e.equipmentID = etx.equipmentID
    JOIN Statuses s ON etx.statusID = s.statusID
ORDER BY
    e.serializationTimestamp DESC;

-- INSERT a new equipment item into the database
INSERT INTO
    Equipments (barcode, serializationTimestamp, equipmentTypeID)
VALUES
    (
        '[Barcode]',
        '[Serialized Timestamp]',
        '[Equipment Type ID]'
    );

-- Get the last inserted ID after an INSERT operation to be used in a subsequent INSERT operation in add_equipment.js, add_equipmentType.js, etc.
SELECT
    LAST_INSERT_ID() AS equipmentID;

-- SELECT all equipment items for viewing with equipmentTypeName in place of equipmentTypeID
SELECT
    equipmentID,
    barcode,
    serializationTimestamp,
    equipmentTypeName
FROM
    Equipments
    JOIN EquipmentTypes ON Equipments.equipmentTypeID = EquipmentTypes.equipmentTypeID;

-- SELECT all equipment items with matching equipmentID for viewing
SELECT
    *
FROM
    Equipments
WHERE
    equipmentID = '[Existing equipmentID]';

-- UPDATE an existing equipment item
-- Assuming the need to update the barcode and serialization timestamp
UPDATE
    Equipments
SET
    barcode = '[New Barcode]',
    serializationTimestamp = '[New Serialization Timestamp]',
    equipmentTypeID = '[New Equipment Type ID]'
WHERE
    equipmentID = '[Existing equipmentID]';

-- DELETE an existing equipment item by its ID
DELETE FROM
    Equipments
WHERE
    equipmentID = '[Existing equipmentID]';

-- CASCADE operations after deleting existing equipment item
DELETE FROM
    EquipmentProperties
WHERE
    equipmentID = '[Existing equipmentID]';

DELETE FROM
    EquipmentTransactions
WHERE
    equipmentID = '[Existing equipmentID]';

----------------------------------
-- EQUIPMENT TYPES TABLE QUERIES
----------------------------------
-- INSERT a new Equipment Type
INSERT INTO
    EquipmentTypes (
        equipmentTypeName,
        equipmentTypeDescription,
        firstSupportDate,
        discontinuedSupportDate
    )
VALUES
    (
        '[Name]',
        '[Description]',
        '[Start Date]',
        -- Ensure this is a valid DATE format or NULL
        '[End Date]' -- Ensure this is a valid DATE format or NULL
    );

-- SELECT all equipment types for viewing
SELECT
    *
FROM
    EquipmentTypes;

-- SELECT equipment types with matching ID
SELECT
    *
FROM
    EquipmentTypes
WHERE
    equipmentTypeID = '[Existing EquipmentTypeID]';

-- UPDATE an existing equipment type
UPDATE
    EquipmentTypes
SET
    equipmentTypeName = '[New Name]',
    equipmentTypeDescription = '[New Description]',
    firstSupportDate = '[New Start Date]',
    -- Ensure this is a valid DATE format or NULL
    discontinuedSupportDate = '[New End Date]' -- Ensure this is a valid DATE format or NULL
WHERE
    equipmentTypeID = [Equipment Type ID];

-- DELETE an existing equipment type
DELETE FROM
    EquipmentTypes
WHERE
    equipmentTypeID = [Equipment Type ID];

-- CASCADE operations after deleting an EquipmentType
DELETE FROM
    EquipmentTypeHasDefaultProperties
WHERE
    equipmentTypeID = [EquipmentTypeID];

DELETE FROM
    Equipments
WHERE
    equipmentTypeID = [EquipmentTypeID];

DELETE FROM
    EquipmentProperties
WHERE
    equipmentID = (
        SELECT
            equipmentID
        FROM
            Equipments ep
            JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
        WHERE
            et.equipmentID = [EquipmentTypeID]
    );

DELETE FROM
    EquipmentTransactions
WHERE
    equipmentID = (
        SELECT
            equipmentID
        FROM
            Equipments e
            JOIN EquipmentTypes et ON e.equipmentTypeID = et.equipmentTypeID
        WHERE
            et.equipmentTypeID = [EquipmentTypeID]
    );

----------------------------------------
-- EQUIPMENT PROPERTIES TABLE QUERIES
----------------------------------------
-- Display Equipment property and property values without unit for a specific equipment
SELECT
    p.propertyName AS,
    ep.value
FROM
    Equipments e
    INNER JOIN EquipmentProperties ep ON e.equipmentID = ep.equipmentID
    INNER JOIN Properties p ON ep.propertyID = p.propertyID
WHERE
    e.barcode = '[User input barcode]';

-- SELECT propertyName and propertyID using equipmentTypeID
SELECT
    p.propertyName AS 'Property',
    p.propertyID AS 'propertyID'
FROM
    Properties p
    JOIN EquipmentTypeHasDefaultProperties edp ON p.propertyID = edp.propertyID
WHERE
    equipmentTypeID = [EquipmentTypeID];

-- Insert property values for the new equipment
INSERT INTO
    EquipmentProperties (equipmentID, propertyID, value)
VALUES
    (
        [Equipment ID],
        [Property ID],
        '[Value]'
    );

-- RETRIEVE current property values for an equipment item based on its equipmentID
SELECT
    propertyID,
    value
FROM
    EquipmentProperties
WHERE
    equipmentID = [Equipment ID]
    AND propertyID = [Property ID];

-- UPDATE an existing property value for an equipment item
UPDATE
    EquipmentProperties
SET
    value = '[New Value]'
WHERE
    equipmentID = [Equipment ID]
    AND propertyID = [Property ID];

-- Decision was made to NOT include DELETE operation for an existing property value for an equipment item
-- since Properties are linked to specific equipment types
-----------------------------------------
-- EQUIPMENT TRANSACTIONS TABLE QUERIES
-----------------------------------------
-- INSERT a new record into 'EquipmentTransactions' when a repair action is taken
INSERT INTO
    EquipmentTransactions (equipmentID, statusID, transactionDate)
VALUES
    (
        (
            SELECT
                equipmentID
            FROM
                Equipments
            WHERE
                barcode = '[Barcode]'
        ),
        3,
        NOW()
    );

------------------------------
-- PROPERTIES TABLE QUERIES
------------------------------
-- INSERT a new property
INSERT INTO
    Properties (propertyName)
VALUES
    ('[Name]');

-- SELECT all properties for viewing
SELECT
    *
FROM
    Properties;

-- SELECT properties with matching propertyID
SELECT
    *
FROM
    Properties
WHERE
    propertyID = [Existing propertyID];

-- UPDATE an existing property
-- Assuming that propertyID is provided for identifying which property to update
UPDATE
    Properties
SET
    propertyName = '[New Name]'
WHERE
    propertyID = [Property ID];

-- DELETE an existing property
-- Assuming that propertyID is provided for identifying which property to delete
DELETE FROM
    Properties
WHERE
    propertyID = [Property ID];

-- CASCADE operations after deleting a property
DELETE FROM
    EquipmentTypeHasDefaultProperties
WHERE
    propertyID = [Property ID];

DELETE FROM
    EquipmentProperties
WHERE
    propertyID = [Property ID];

-----------------------------------------------------
-- EQUIPMENTTYPEHASDEFAULTPROPERTIES TABLE QUERIES
-----------------------------------------------------
-- INSERT a new Equipment Type to Property relationship
-- (Assuming we have the Equipment Type ID and Property ID)
INSERT INTO
    EquipmentTypeHasDefaultProperties (equipmentTypeID, propertyID)
VALUES
    ([Equipment Type ID], [Property ID]);

-- SELECT Properties for a specific Equipment Type
-- (This would populate the table on the page)
SELECT
    p.propertyID,
    p.propertyName,
    -- Corrected to propertyName
    p.propertyDescription -- Corrected to propertyDescription
FROM
    Properties p
    JOIN EquipmentTypeHasDefaultProperties etdp ON p.propertyID = etdp.propertyID
WHERE
    etdp.equipmentTypeID = [Equipment Type ID];

-- SELECT Properties that are not yet linked to a specific equipment type since they will be the remaining available properties
SELECT
    P.propertyID,
    P.propertyName
FROM
    Properties P
    LEFT JOIN EquipmentTypeHasDefaultProperties E ON P.propertyID = E.propertyID
    AND E.equipmentTypeID = [equipmentTypeID];

-- UPDATE a specific Property from an Equipment Type
UPDATE
    EquipmentTypeHasDefaultProperties
SET
    propertyID = [New Property ID]
WHERE
    equipmentTypeID = [Equipment Type ID]
    AND propertyID = [Original Property ID];

-- DELETE a specific Property from an Equipment Type
-- (Assuming we have the Equipment Type ID and Property ID)
DELETE FROM
    EquipmentTypeHasDefaultProperties
WHERE
    equipmentTypeID = [Equipment Type ID]
    AND propertyID = [Property ID];

-- CASCADE operations after deleting a type-specific property
DELETE FROM
    EquipmentProperties
WHERE
    equipmentID IN (
        SELECT
            equipmentID
        FROM
            Equipments
        WHERE
            equipmentTypeID = [Equipment Type ID]
    )
    AND propertyID = [Property ID];

----------------------------
-- STATUSES TABLE QUERIES
----------------------------
-- INSERT a new status and SELECT all statuses for viewing
INSERT INTO
    Statuses (statusName, statusDescription)
VALUES
    ('[Status Name]', '[Description]');

-- SELECT all statuses for viewing
SELECT
    statusID,
    statusName,
    statusDescription
FROM
    Statuses;

-- UPDATE a status
-- (Note: It is safer to use statusID as the identifier for updates)
UPDATE
    Statuses
SET
    statusName = '[New Status Name]',
    statusDescription = '[New Description]'
WHERE
    statusID = [Status ID];

-- Dynamic dropdown functionality for choosing Status
SELECT
    statusID,
    statusName
FROM
    Statuses;

-- DELETE an existing status
DELETE FROM
    Statuses
WHERE
    statusID = [Status ID];

-------------------------------------------
-- VALIDSTATUSTRANSITIONS TABLE QUERIES
-------------------------------------------
-- INSERT a new transition status
INSERT INTO
    ValidStatusTransitions (
        transitionName,
        transitionDescription,
        preStatusID,
        postStatusID
    )
VALUES
    (
        '[Name]',
        '[Description]',
        (
            SELECT
                statusID
            FROM
                Statuses
            WHERE
                statusName = '[Pre-Status]'
        ),
        (
            SELECT
                statusID
            FROM
                Statuses
            WHERE
                statusName = '[Post-Status]'
        )
    );

-- SELECT all transition statuses for viewing
SELECT
    vst.validStatusTransitionID,
    vst.transitionName,
    vst.transitionDescription,
    S1.statusName AS PreStatusName,
    S2.statusName AS PostStatusName
FROM
    ValidStatusTransitions vst
    JOIN Statuses S1 ON vst.preStatusID = S1.statusID
    JOIN Statuses S2 ON vst.postStatusID = S2.statusID;

-- UPDATE an existing transition status
-- (Assuming we have the Valid Status Transition ID)
UPDATE
    ValidStatusTransitions
SET
    transitionName = '[New Name]',
    transitionDescription = '[New Description]',
    preStatusID = (
        SELECT
            statusID
        FROM
            Statuses
        WHERE
            statusName = '[New Pre-Status]'
    ),
    postStatusID = (
        SELECT
            statusID
        FROM
            Statuses
        WHERE
            statusName = '[New Post-Status]'
    )
WHERE
    validStatusTransitionID = [Valid Status Transition ID];

-- DELETE a transition status
-- (Assuming we have the Valid Status Transition ID)
DELETE FROM
    ValidStatusTransitions
WHERE
    validStatusTransitionID = [Valid Status Transition ID];