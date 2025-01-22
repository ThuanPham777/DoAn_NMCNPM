CREATE TABLE Match
(
    MatchID INT,
    RoundID INT,
    TournamentID INT,
    Team1ID INT,
    Team2ID INT,
    Stadium NVARCHAR(100) NOT NULL,
    MatchDate DATETIME NOT NULL,
    PRIMARY KEY (MatchID, RoundID, TournamentID),
);