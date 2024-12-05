CREATE PROCEDURE getAllTeamsAttendTournament
    @TournamentID INT
AS
BEGIN
    BEGIN TRY
        -- Truy vấn tất cả các đội tham gia giải đấu cụ thể kèm thông tin chi tiết của đội
        SELECT
        tat.TeamID,
        tat.TournamentID,
        t.TeamName,
        t.Stadium,
        t.Coach,
        t.TeamLogo,
        t.UserID,
        tm.TournamentName
    FROM
        TeamAttendTournament tat
        INNER JOIN Team t ON tat.TeamID = t.TeamID
        INNER JOIN Tournament tm ON tat.TournamentID = tm.TournamentID
    WHERE
            tat.TournamentID = @TournamentID; -- Lọc theo TournamentID
    END TRY
    BEGIN CATCH
        -- Bắt lỗi nếu có vấn đề
        SELECT
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_STATE() AS ErrorState;
        THROW;
    END CATCH
END;
