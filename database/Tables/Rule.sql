CREATE TABLE [Rule]
(
    TournamentID INT PRIMARY KEY,
    MaxTeam INT NOT NULL,
    MinTeam INT NOT NULL,
    MaxPlayer INT NOT NULL,
    MinPlayer INT NOT NULL,
    MaxForeignPlayer INT,
    MinAgePlayer INT,
    MaxAgePlayer INT,
    WinScore INT,
    LoseScore INT,
    DrawScore INT,
    MaxTimeScore INT,
    NumberOfTypeScore INT,
    RankPriorityOrder NVARCHAR(100),
);