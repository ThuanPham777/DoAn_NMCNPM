CREATE PROCEDURE getAllTeamsAttendTournament
AS
BEGIN
    BEGIN TRY
        -- Truy vấn tất cả các đội tham gia các giải đấu
        SELECT
        tat.TeamID,
        tat.TournamentID,
        t.TeamName,
        tm.TournamentName
    FROM
        TeamAttendTournament tat
        INNER JOIN
        Teams t ON tat.TeamID = t.TeamID
        INNER JOIN
        Tournaments tm ON tat.TournamentID = tm.TournamentID;
    END TRY
    BEGIN CATCH
        -- Bắt lỗi nếu có vấn đề
        THROW;
    END CATCH
END;

EXEC getAllTeamsAttendTournament;