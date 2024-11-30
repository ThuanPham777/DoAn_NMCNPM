CREATE PROCEDURE registerTeamInTournament
    @TeamID INT,
    @TournamentID INT,
    @UserID INT
-- ID của người dùng thực hiện thao tác
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra xem UserID có quyền thực hiện thao tác không
        IF EXISTS (
            SELECT 1
    FROM [User]
    WHERE UserID = @UserID AND Role IN ('Manager')
        )
        BEGIN
        -- Kiểm tra xem TeamID và TournamentID có tồn tại không
        IF EXISTS (SELECT 1
            FROM Team
            WHERE TeamID = @TeamID)
            AND EXISTS (SELECT 1
            FROM Tournaments
            WHERE TournamentID = @TournamentID)
            BEGIN
            -- Đăng ký đội vào giải đấu
            INSERT INTO TeamAttendTournament
                (TeamID, TournamentID)
            VALUES
                (@TeamID, @TournamentID);

            -- Trả về thông báo thành công
            SELECT 'Team registered successfully in the tournament.' AS Message;
        END
            ELSE
            BEGIN
            -- Trả về lỗi nếu TeamID hoặc TournamentID không tồn tại
            RAISERROR ('Either the TeamID or TournamentID does not exist.', 16, 1);
        END
    END
        ELSE
        BEGIN
        -- Trả về lỗi nếu User không có quyền
        RAISERROR ('User does not have permission to register a team. Only Managers or Admins can perform this action.', 16, 1);
    END
    END TRY
    BEGIN CATCH
        -- Trả về thông tin lỗi
        SELECT
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_STATE() AS ErrorState;

        -- Tái ném lỗi (nếu cần)
        THROW;
    END CATCH
END;

EXECUTE registerTeamInTournament
    @TeamID = 1,
    @TournamentID = 1,
    @UserID = 1;
