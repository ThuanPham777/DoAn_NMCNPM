CREATE PROCEDURE getRule
    @TournamentID INT
AS
BEGIN
    SELECT *
    FROM [Rule]
    WHERE TournamentID = @TournamentID;
END;