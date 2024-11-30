CREATE PROCEDURE insertUser
    @UserName VARCHAR(100),
    @Email VARCHAR(100),
    @Password VARCHAR(100),
    @Role NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        INSERT INTO [User]
        (UserName, Email, Password, Role)
    VALUES
        (@UserName, @Email, @Password, @Role);

        -- Commit transaction
        COMMIT TRANSACTION;

        -- Return success message and User details
        SELECT
        UserID, UserName, Email, Role
    FROM [User]
    WHERE Email = @Email;

    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of error
        ROLLBACK TRANSACTION;

        -- Output error message
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;
