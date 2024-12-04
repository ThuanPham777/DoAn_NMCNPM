CREATE PROCEDURE getAllPlayersOfTeam
    @TeamID INT
AS
BEGIN
    BEGIN TRY
        -- Lấy tất cả cầu thủ thuộc đội bóng với TeamID
        SELECT
        PlayerID,
        TeamID,
        DateOfBirth,
        PlayerName,
        JerseyNumber,
        HomeTown,
        ProfileImg,
        PlayerType
    FROM
        Player
    WHERE
            TeamID = @TeamID;
    END TRY
    BEGIN CATCH
        -- Xử lý lỗi
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR (@ErrorMessage, 16, 1);
    END CATCH
END;

