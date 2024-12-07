CREATE PROCEDURE updateTeam
    @TeamID INT,
    @TeamName NVARCHAR(50),
    @Stadium NVARCHAR(50),
    @Coach NVARCHAR(50),
    @TeamLogo VARCHAR(50),
    @UserID INT
-- ID của người dùng thực hiện thao tác
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra vai trò của người dùng
        IF EXISTS (
            SELECT 1
    FROM [User]
    WHERE UserID = @UserID AND Role = 'Manager'
        )
        BEGIN
        -- Kiểm tra xem đội có tồn tại và thuộc quyền quản lý của User không
        IF EXISTS (
                SELECT 1
        FROM Team
        WHERE TeamID = @TeamID AND UserID = @UserID
            )
            BEGIN
            -- Cập nhật thông tin đội bóng
            UPDATE Team
                SET
                    TeamName = @TeamName,
                    Stadium = @Stadium,
                    Coach = @Coach,
                    TeamLogo = @TeamLogo
                WHERE TeamID = @TeamID;

            -- Trả về thông báo thành công
            SELECT 'Team updated successfully' AS Message;
        END
            ELSE
            BEGIN
            -- Trả về lỗi nếu đội không tồn tại hoặc không thuộc quyền quản lý
            RAISERROR ('Team does not exist or you do not have permission to update this team.', 16, 1);
        END
    END
        ELSE
        BEGIN
        -- Trả về lỗi nếu người dùng không phải Manager
        RAISERROR ('User does not have permission to update a team. Only Managers can perform this action.', 16, 1);
    END
    END TRY
    BEGIN CATCH
        -- Bắt lỗi và trả về thông tin lỗi
        SELECT
        ERROR_MESSAGE() AS ErrorMessage,
        ERROR_NUMBER() AS ErrorNumber,
        ERROR_SEVERITY() AS ErrorSeverity,
        ERROR_STATE() AS ErrorState;

        -- Tái ném lỗi (nếu cần)
        THROW;
    END CATCH
END;
