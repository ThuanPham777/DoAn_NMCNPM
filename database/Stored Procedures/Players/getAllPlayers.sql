
CREATE PROCEDURE getAllPlayers
AS
BEGIN
    BEGIN TRY
        SELECT
        *
    FROM
        Player;
    END TRY
    BEGIN CATCH
        -- Handle error
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;
