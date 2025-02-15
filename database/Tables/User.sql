CREATE TABLE [User] (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    Role NVARCHAR(100) NOT NULL CHECK (Role IN ('Admin', 'Manager', 'Guest'))
);