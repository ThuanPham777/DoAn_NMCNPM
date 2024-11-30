CREATE PROCEDURE login
    @Email VARCHAR(50),
    @Password VARCHAR(50)
AS
BEGIN
    BEGIN TRY
        -- Check if the user exists with the provided email and password
        IF EXISTS (
            SELECT 1
    FROM [User]
    WHERE Email = @Email AND Password = @Password
        )
        BEGIN
        -- Return user details if login is successful
        SELECT
            UserID,
            UserName,
            Email,
            Role
        FROM [User]
        WHERE Email = @Email AND Password = @Password;
    END
        ELSE
        BEGIN
        -- Return error message if login fails
        SELECT 'Invalid email or password.' AS ErrorMessage;
    END
    END TRY
    BEGIN CATCH
        -- Output error message in case of exceptions
        SELECT ERROR_MESSAGE() AS ErrorMessage;
    END CATCH
END;

