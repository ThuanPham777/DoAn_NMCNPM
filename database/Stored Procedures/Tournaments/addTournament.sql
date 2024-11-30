CREATE PROCEDURE addTournament
    @TournamentName NVARCHAR(50),
    @StartDate DATE,
    @EndDate DATE,
    @TournamentLogo NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        -- Insert tournament data into the tournaments table
        INSERT INTO Tournaments
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

EXECUTE addTournament
    @TournamentName = 'Summer Cup',
    @StartDate = '2024-06-01',
    @EndDate = '2024-06-15',
    @TournamentLogo = 'summer_cup_logo.png';

