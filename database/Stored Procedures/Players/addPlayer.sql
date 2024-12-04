CREATE PROCEDURE addPlayer
    @TeamID INT,
    @DateOfBirth DATE,
    @PlayerName NVARCHAR(100),
    @JerseyNumber INT,
    @HomeTown NVARCHAR(100),
    @ProfileImg VARCHAR(100),
    @PlayerType NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO Player
        (TeamID, DateOfBirth, PlayerName, JerseyNumber, HomeTown, ProfileImg, PlayerType)
    VALUES
        (@TeamID, @DateOfBirth, @PlayerName, @JerseyNumber, @HomeTown, @ProfileImg, @PlayerType);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Handle error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
