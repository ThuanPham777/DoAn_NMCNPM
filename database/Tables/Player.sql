CREATE TABLE Player
(
    PlayerID INT IDENTITY(1,1) PRIMARY KEY,
    TeamID INT,
    DateOfBirth DATE NOT NULL,
    PlayerName NVARCHAR(100) NOT NULL,
    JerseyNumber INT,
    HomeTown NVARCHAR(100),
    ProfileImg VARCHAR(200),
    PlayerType NVARCHAR(100) NOT NULL CHECK (PlayerType IN (N'Trong nước', N'Ngoài nước')),
);