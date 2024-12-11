CREATE PROCEDURE addMatchScore
    @MatchID INT,
    @RoundID INT,
    @TournamentID INT,
    @TeamID INT,
    @PlayerID INT,
    @ScoreTime INT,
    @ScoreType NVARCHAR(100)
AS
BEGIN
    BEGIN TRY
        -- Kiểm tra giá trị của ScoreType
        IF NOT EXISTS (
            SELECT 1
    WHERE @ScoreType IN (N'Bình thường', N'Phản lưới', N'Phạt đền')
        )
        BEGIN
        RAISERROR (N'Loại bàn thắng không hợp lệ. Chỉ chấp nhận: Bình thường, Phản lưới, Phạt đền.', 16, 1);
        RETURN;
    END;

        -- Chèn dữ liệu vào bảng Listscore
        INSERT INTO Listscore
        (MatchID, RoundID, TournamentID, PlayerID, ScoreTime, ScoreType)
    VALUES
        (@MatchID, @RoundID, @TournamentID, @PlayerID, @ScoreTime, @ScoreType);

        -- Trả về thông báo thành công
        SELECT 'Match score added successfully' AS Message;
    END TRY
    BEGIN CATCH
        -- Xử lý lỗi
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT
        @ErrorMessage = ERROR_MESSAGE(),
        @ErrorSeverity = ERROR_SEVERITY(),
        @ErrorState = ERROR_STATE();

        -- Trả về lỗi
        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
