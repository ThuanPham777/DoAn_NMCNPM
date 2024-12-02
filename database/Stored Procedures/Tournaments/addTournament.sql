CREATE PROCEDURE addTournament
    @TournamentName NVARCHAR(50),
    @StartDate DATE,
    @EndDate DATE,
    @TournamentLogo VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        -- Insert tournament data into the tournaments table
        INSERT INTO Tournament
        (TournamentName, StartDate, EndDate, TournamentLogo)
    VALUES
        (@TournamentName, @StartDate, @EndDate, @TournamentLogo);

        -- Retrieve the ID of the newly inserted tournament
        DECLARE @NewTournamentID INT = SCOPE_IDENTITY();

        -- Commit transaction if successful
        COMMIT TRANSACTION;

        -- Return the new tournament ID
        SELECT @NewTournamentID AS NewTournamentID;
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