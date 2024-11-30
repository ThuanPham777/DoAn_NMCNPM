CREATE PROCEDURE insertUser
    @UserName VARCHAR(50),
    @Email VARCHAR(50),
    @Password VARCHAR(50),
    @Role NVARCHAR(50)
AS
BEGIN
    BEGIN TRY
        -- Begin transaction
        BEGIN TRANSACTION;

        -- Insert new user
        INSERT INTO [User]
        (UserName, Email, Password, Role)
    VALUES
        (@UserName, @Email, @Password, @Role);

        -- Commit transaction
        COMMIT TRANSACTION;

        -- Return success message
        SELECT 'User inserted successfully.' AS Message;
    END TRY
    BEGIN CATCH
        -- Rollback transaction in case of error
        ROLLBACK TRANSACTION;

        -- Output error message
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;
