-- DDL Script
-- Project Group 104: Tsung-Hsi (Lawrence) Tsai, Matthew Alviar
-- Disable foreign key checks and commits
SET
    FOREIGN_KEY_CHECKS = 0;

SET
    AUTOCOMMIT = 0;

-- Drop tables if they exist in reverse order of creation due to foreign key constraints
DROP TABLE IF EXISTS EquipmentTransactions;

DROP TABLE IF EXISTS EquipmentProperties;

DROP TABLE IF EXISTS EquipmentTypeHasDefaultProperties;

DROP TABLE IF EXISTS Equipments;

DROP TABLE IF EXISTS EquipmentTypes;

DROP TABLE IF EXISTS ValidStatusTransitions;

DROP TABLE IF EXISTS Statuses;

DROP TABLE IF EXISTS Properties;

-- Create Properties table
CREATE TABLE Properties (
    propertyID INT AUTO_INCREMENT PRIMARY KEY,
    propertyName VARCHAR(45) NOT NULL
);

-- Create EquipmentTypes table
CREATE TABLE EquipmentTypes (
    equipmentTypeID INT AUTO_INCREMENT PRIMARY KEY,
    equipmentTypeName VARCHAR(45) NOT NULL,
    equipmentTypeDescription VARCHAR(100),
    firstSupportDate DATE,
    discontinuedSupportDate DATE
);

-- Create Equipments table
CREATE TABLE Equipments (
    equipmentID INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(20) NOT NULL UNIQUE,
    serializationTimestamp DATETIME,
    equipmentTypeID INT NOT NULL,
    -- Made NOT NULL
    FOREIGN KEY (equipmentTypeID) REFERENCES EquipmentTypes(equipmentTypeID)
);

-- Create EquipmentProperties table
CREATE TABLE EquipmentProperties (
    equipmentID INT NOT NULL,
    -- Explicitly set as NOT NULL
    propertyID INT NOT NULL,
    -- Explicitly set as NOT NULL
    value VARCHAR(45),
    PRIMARY KEY (equipmentID, propertyID),
    FOREIGN KEY (propertyID) REFERENCES Properties(propertyID),
    FOREIGN KEY (equipmentID) REFERENCES Equipments(equipmentID)
);

-- Create EquipmentTypeHasDefaultProperties table
CREATE TABLE EquipmentTypeHasDefaultProperties (
    equipmentTypeID INT NOT NULL,
    -- Explicitly set as NOT NULL
    propertyID INT NOT NULL,
    -- Explicitly set as NOT NULL
    PRIMARY KEY (equipmentTypeID, propertyID),
    FOREIGN KEY (equipmentTypeID) REFERENCES EquipmentTypes(equipmentTypeID),
    FOREIGN KEY (propertyID) REFERENCES Properties(propertyID)
);

-- Create Statuses table with added 'statusDate' column
CREATE TABLE Statuses (
    statusID INT AUTO_INCREMENT PRIMARY KEY,
    statusName VARCHAR(45) NOT NULL,
    statusDescription VARCHAR(100),
    statusDate DATE
);

-- Create ValidStatusTransitions table
CREATE TABLE ValidStatusTransitions (
    validStatusTransitionID INT AUTO_INCREMENT PRIMARY KEY,
    validStatusTransitionName VARCHAR(45) NOT NULL,
    validStatusTransitionDescription VARCHAR(100),
    preStatusID INT NOT NULL,
    -- Updated to NOT NULL
    postStatusID INT NOT NULL,
    -- Updated to NOT NULL
    FOREIGN KEY (preStatusID) REFERENCES Statuses(statusID),
    FOREIGN KEY (postStatusID) REFERENCES Statuses(statusID)
);

-- Create EquipmentTransactions table
CREATE TABLE EquipmentTransactions (
    equipmentTransactionID INT AUTO_INCREMENT PRIMARY KEY,
    equipmentID INT NOT NULL,
    -- Add NOT NULL constraint
    statusID INT,
    -- ALLOW NULL
    transactionDate DATETIME,
    FOREIGN KEY (equipmentID) REFERENCES Equipments(equipmentID),
    FOREIGN KEY (statusID) REFERENCES Statuses(statusID)
);

-- **** INSERT STATEMENTS FOR THE UPDATED TABLES BELOW ****
-- Inserting values into Properties table
INSERT INTO
    Properties (propertyName)
VALUES
    ('Size (inches)'),
    ('Weight (pounds)'),
    ('Color');

-- Inserting values into EquipmentTypes table
INSERT INTO
    EquipmentTypes (
        equipmentTypeName,
        equipmentTypeDescription,
        firstSupportDate,
        discontinuedSupportDate
    )
VALUES
    (
        'Scanner',
        'A device that scans documents and converts them to digital data',
        '2023-01-01',
        NULL
    ),
    (
        'Printer',
        'A device that prints documents from a computer',
        '2023-01-01',
        NULL
    ),
    (
        'Laptop',
        'Portable personal comuter',
        '2023-01-01',
        NULL
    );

-- Inserting values into Equipments table
INSERT INTO
    Equipments (barcode, serializationTimestamp, equipmentTypeID)
VALUES
    ('SCN12345', '2023-05-01 10:00:00', 1),
    ('PRT54321', '2023-05-02 11:00:00', 2),
    ('LTP00001', '2023-05-03 12:00:00', 3);

-- Inserting values into EquipmentProperties table
INSERT INTO
    EquipmentProperties (equipmentID, propertyID, value)
VALUES
    (1, 1, '15'),
    (1, 2, '10'),
    (2, 1, '18'),
    (2, 3, 'Black'),
    (3, 2, '5'),
    (3, 3, 'Gray');

-- Inserting values into EquipmentTypeHasDefaultProperties table
INSERT INTO
    EquipmentTypeHasDefaultProperties (equipmentTypeID, propertyID)
VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (2, 3),
    (3, 2),
    (3, 3);

-- Inserting values into Statuses table
INSERT INTO
    Statuses (statusName, statusDescription, statusDate)
VALUES
    (
        'Available',
        'The equipment is available for use',
        '2023-01-01'
    ),
    (
        'In Use',
        'The equipment is currently in use',
        '2023-01-02'
    ),
    (
        'Maintenance',
        'The equipment is under maintenance',
        '2023-01-03'
    );

-- Inserting values into ValidStatusTransitions table
INSERT INTO
    ValidStatusTransitions (
        validStatusTransitionName,
        validStatusTransitionDescription,
        preStatusID,
        postStatusID
    )
VALUES
    (
        'Checkout',
        'Equipment is checked out for use',
        1,
        2
    ),
    (
        'Return',
        'Equipment is returned and available',
        2,
        1
    ),
    (
        'Send for Maintenance',
        'Equipment is sent for maintenance',
        1,
        3
    ),
    (
        'Maintenance Complete',
        'Equipment is back from maintenance',
        3,
        1
    );

-- Inserting values into EquipmentTransactions table
INSERT INTO
    EquipmentTransactions (equipmentID, statusID, transactionDate)
VALUES
    (1, 2, '2023-05-03 09:00:00'),
    (2, 1, '2023-05-04 10:00:00'),
    (3, 2, '2023-06-05 12:00:00');

-- Enable foreign key checks and commits
SET
    FOREIGN_KEY_CHECKS = 1;

COMMIT;