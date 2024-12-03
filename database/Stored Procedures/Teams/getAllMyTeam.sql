CREATE PROCEDURE getAllMyTeams
    @UserID INT
AS
BEGIN
    SELECT *
    FROM Team
    WHERE UserID = @UserID;
END;