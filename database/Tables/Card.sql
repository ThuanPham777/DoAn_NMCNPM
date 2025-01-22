CREATE TABLE Card
(
    MatchID INT,
    PlayerID INT,
    RoundID INT,
    TournamentID INT,
    CardTime INT NOT NULL,
    CardType NVARCHAR(100) NOT NULL CHECK (CardType IN (N'Thẻ vàng', N'Thẻ đỏ')),
    PRIMARY KEY (MatchID, RoundID, TournamentID, PlayerID, CardTime),
);