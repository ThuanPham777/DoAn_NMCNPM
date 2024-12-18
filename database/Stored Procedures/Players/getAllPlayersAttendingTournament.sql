
CREATE PROCEDURE getAllPlayersAttendingTournament
    @TournamentID INT
AS
BEGIN
    BEGIN TRY
        SELECT
        *
    FROM
        Player p
        JOIN TeamAttendTournament tat on p.TeamID = tat.TeamID
    WHERE tat.TournamentID = @TournamentID;
    END TRY
    BEGIN CATCH
        -- Handle error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
