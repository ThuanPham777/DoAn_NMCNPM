CREATE PROCEDURE login
    @Email VARCHAR(100)
AS
BEGIN
    BEGIN TRY
        -- Truy vấn người dùng theo email
        SELECT
        UserID,
        UserName,
        Email,
        Password,
        Role
    FROM [User]
    WHERE Email = @Email;
    END TRY
    BEGIN CATCH
        -- Xử lý lỗi
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;
