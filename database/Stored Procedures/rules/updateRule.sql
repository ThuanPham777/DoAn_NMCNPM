CREATE PROCEDURE updateRule
    @TournamentID INT,
    @MaxTeam INT,
    @MinTeam INT,
    @MaxPlayer INT,
    @MinPlayer INT,
    @MaxForeignPlayer INT,
    @MinAgePlayer INT,
    @MaxAgePlayer INT,
    @WinScore INT,
    @LoseScore INT,
    @DrawScore INT,
    @MaxTimeScore INT,
    @NumberOfTypeScore INT,
    @RankPriorityOrder NVARCHAR(100)
AS
BEGIN
    IF EXISTS (SELECT 1
    FROM [Rule]
    WHERE TournamentID = @TournamentID)
    BEGIN
        -- Nếu có bản ghi, thực hiện UPDATE
        UPDATE [Rule]
        SET
            MaxTeam = @MaxTeam,
            MinTeam = @MinTeam,
            MaxPlayer = @MaxPlayer,
            MinPlayer = @MinPlayer,
            MaxForeignPlayer = @MaxForeignPlayer,
            MinAgePlayer = @MinAgePlayer,
            MaxAgePlayer = @MaxAgePlayer,
            WinScore = @WinScore,
            LoseScore = @LoseScore,
            DrawScore = @DrawScore,
            MaxTimeScore = @MaxTimeScore,
            NumberOfTypeScore = @NumberOfTypeScore,
            RankPriorityOrder = @RankPriorityOrder
        WHERE TournamentID = @TournamentID;
    END
    ELSE
    BEGIN
        -- Nếu không có bản ghi, thực hiện INSERT
        INSERT INTO [Rule]
            (TournamentID, MaxTeam, MinTeam, MaxPlayer, MinPlayer, MaxForeignPlayer, MinAgePlayer, MaxAgePlayer, WinScore, LoseScore, DrawScore, MaxTimeScore, NumberOfTypeScore, RankPriorityOrder)
        VALUES
            (@TournamentID, @MaxTeam, @MinTeam, @MaxPlayer, @MinPlayer, @MaxForeignPlayer, @MinAgePlayer, @MaxAgePlayer, @WinScore, @LoseScore, @DrawScore, @MaxTimeScore, @NumberOfTypeScore, @RankPriorityOrder);
    END
END;
