CREATE PROCEDURE updatePlayer
    @PlayerID INT,
    @PlayerName NVARCHAR(100),
    @DateOfBirth DATE,
    @JerseyNumber INT,
    @HomeTown NVARCHAR(100),
    @PlayerType NVARCHAR(100),
    @ProfileImg NVARCHAR(100) = NULL,
    -- Nếu không muốn cập nhật ảnh, có thể để giá trị NULL
    @TeamID INT
AS
BEGIN
    -- Kiểm tra loại cầu thủ hợp lệ
    IF @PlayerType NOT IN ('Trong nước', 'Ngoài nước')
    BEGIN
        RAISERROR('Invalid PlayerType. Allowed values are: Trong nước, Ngoài nước', 16, 1);
        RETURN;
    END

    -- Cập nhật thông tin cầu thủ trong bảng Player
    UPDATE Player
    SET
        PlayerName = @PlayerName,
        DateOfBirth = @DateOfBirth,
        JerseyNumber = @JerseyNumber,
        HomeTown = @HomeTown,
        PlayerType = @PlayerType,
        ProfileImg = @ProfileImg
    WHERE PlayerID = @PlayerID and TeamID = @TeamID;

    -- Kiểm tra nếu không có cầu thủ nào được cập nhật (PlayerID không tồn tại)
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('Player not found with the provided PlayerID', 16, 1);
        RETURN;
    END
END;
