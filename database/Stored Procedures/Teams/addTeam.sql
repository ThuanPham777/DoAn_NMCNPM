CREATE PROCEDURE addTeam
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
        -- Thêm đội vào bảng Team
        INSERT INTO Team
            (TeamName, Stadium, Coach, TeamLogo, UserID)
        VALUES
            (@TeamName, @Stadium, @Coach, @TeamLogo, @UserID);

        -- Trả về ID của đội vừa được thêm
        SELECT SCOPE_IDENTITY() AS NewTeamID;
    END
        ELSE
        BEGIN
        -- Trả về thông báo lỗi nếu không phải Manager
        RAISERROR ('User does not have permission to add a team. Only Managers can perform this action.', 16, 1);
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

