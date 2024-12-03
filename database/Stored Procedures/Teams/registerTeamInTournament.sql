CREATE PROCEDURE registerTeamsInTournament
    @TeamIDs TeamIDTableType READONLY,
    @TournamentID INT,
    @UserID INT
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra quyền người dùng
        IF EXISTS (
            SELECT 1
    FROM [User]
    WHERE UserID = @UserID AND Role IN ('Manager')
        )
        BEGIN
        -- Kiểm tra giải đấu có tồn tại không
        IF EXISTS (SELECT 1
        FROM Tournament
        WHERE TournamentID = @TournamentID)
            BEGIN
            -- Chèn tất cả các đội bóng vào giải đấu
            INSERT INTO TeamAttendTournament
                (TeamID, TournamentID)
            SELECT TeamID, @TournamentID
            FROM @TeamIDs
            WHERE TeamID IN (SELECT TeamID
            FROM Team);
            -- Đảm bảo TeamID hợp lệ

            -- Thông báo thành công
            SELECT 'All teams registered successfully.' AS Message;
        END
            ELSE
            BEGIN
            RAISERROR ('TournamentID does not exist.', 16, 1);
        END
    END
        ELSE
        BEGIN
        RAISERROR ('User does not have permission to register teams. Only Managers or Admins can perform this action.', 16, 1);
    END
    END TRY
    BEGIN CATCH
        SELECT
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_STATE() AS ErrorState;
        THROW;
    END CATCH
END;


