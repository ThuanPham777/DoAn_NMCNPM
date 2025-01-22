CREATE TABLE Tournament
(
    TournamentID INT IDENTITY(1,1) PRIMARY KEY,
    TournamentName NVARCHAR(100) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    TournamentLogo VARCHAR(200)
);