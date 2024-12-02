CREATE PROCEDURE getTournamentById
    @TournamentId INT
AS
BEGIN
    SELECT *
    FROM Tournament
    WHERE TournamentId = @TournamentId;
END;
