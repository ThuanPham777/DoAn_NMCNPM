CREATE PROCEDURE getMatchDetails
    @MatchID INT,
    @RoundID INT,
    @TournamentID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Lấy tỷ số trận đấu (số lượng bàn thắng của mỗi đội)
    SELECT DISTINCT
        HT.TeamName AS HomeTeamName,
        AT.TeamName AS AwayTeamName,
        (
            SELECT COUNT(LS.ScoreTime)
        -- Đếm số bàn thắng của đội nhà
        FROM Listscore LS
        WHERE LS.MatchID = @MatchID
            AND LS.RoundID = @RoundID
            AND LS.TournamentID = @TournamentID
            AND LS.ScoreType != N'Phản lưới'
            AND LS.PlayerID IN (
                    SELECT PlayerID
            FROM Player
            WHERE TeamID = HT.TeamID
                )
        ) AS HomeScore,
        (
            SELECT COUNT(LS.ScoreTime)
        -- Đếm số bàn thắng của đội khách
        FROM Listscore LS
        WHERE LS.MatchID = @MatchID
            AND LS.RoundID = @RoundID
            AND LS.TournamentID = @TournamentID
            AND LS.ScoreType != N'Phản lưới'
            AND LS.PlayerID IN (
                    SELECT PlayerID
            FROM Player
            WHERE TeamID = AT.TeamID
                )
        ) AS AwayScore
    FROM Match M
        JOIN Team HT ON M.Team1ID = HT.TeamID -- Sử dụng Team1ID cho đội nhà
        JOIN Team AT ON M.Team2ID = AT.TeamID
    -- Sử dụng Team2ID cho đội khách
    WHERE M.MatchID = @MatchID
        AND M.RoundID = @RoundID
        AND M.TournamentID = @TournamentID;

    -- Lấy chi tiết cầu thủ ghi bàn
    SELECT
        LS.ScoreTime AS Minute,
        LS.ScoreType,
        P.PlayerName,
        T.TeamName AS Team
    FROM Listscore LS
        JOIN Player P ON LS.PlayerID = P.PlayerID
        JOIN Team T ON P.TeamID = T.TeamID
    WHERE LS.MatchID = @MatchID
        AND LS.RoundID = @RoundID
        AND LS.TournamentID = @TournamentID
    ORDER BY LS.ScoreTime;
-- Sắp xếp theo phút ghi bàn
END;
