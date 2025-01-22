CREATE TABLE Listscore
(
    MatchID INT,
    RoundID INT,
    TournamentID INT,
    PlayerID INT,
    ScoreTime INT NOT NULL,
    ScoreType NVARCHAR(100) NOT NULL CHECK (ScoreType IN (N'Bình thường', N'Phản lưới', N'Phạt đền')),
    PRIMARY KEY (MatchID, RoundID, TournamentID, PlayerID, ScoreTime),
);