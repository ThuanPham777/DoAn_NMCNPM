CREATE PROCEDURE updateTournament
    @TournamentID INT,
    @TournamentName NVARCHAR(50),
    @StartDate DATE,
    @EndDate DATE,
    @TournamentLogo VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        -- Update the tournament data
        UPDATE Tournament
        SET
            TournamentName = @TournamentName,
            StartDate = @StartDate,
            EndDate = @EndDate,
            TournamentLogo = @TournamentLogo
        WHERE
            TournamentID = @TournamentID;

        -- Check if the update affected any rows
        IF @@ROWCOUNT = 0
        BEGIN
        -- Rollback transaction if no rows were affected
        ROLLBACK TRANSACTION;
        THROW 50000, 'Tournament not found or no changes made.', 1;
    END

        -- Commit transaction if successful
        COMMIT TRANSACTION;

        -- Return success message
        SELECT 'Tournament updated successfully' AS Message;
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of error
        ROLLBACK TRANSACTION;

        -- Output error message
        SELECT
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_STATE() AS ErrorState;

        -- Re-throw the error for debugging (optional)
        THROW;
    END CATCH
END;
