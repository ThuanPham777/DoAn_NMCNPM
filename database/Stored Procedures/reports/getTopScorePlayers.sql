CREATE PROCEDURE getTopScorePlayers
    @TournamentID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.PlayerID,
        P.PlayerName,
        P.JerseyNumber,
        P.HomeTown,
        P.PlayerType,
        P.ProfileImg,
        T.TeamName,
        COUNT(L.ScoreTime) AS TotalGoals
    FROM
        Listscore L
        INNER JOIN
        Player P ON L.PlayerID = P.PlayerID
        INNER JOIN
        Team T on T.TeamID = P.TeamID
    WHERE
        L.TournamentID = @TournamentID
    GROUP BY
        P.PlayerID, P.PlayerName, P.JerseyNumber, P.HomeTown, P.PlayerType, P.ProfileImg, T.TeamName
    ORDER BY
        TotalGoals DESC;
END;