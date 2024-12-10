CREATE PROCEDURE createRound
    @TournamentID INT,
    @Rounds NVARCHAR(MAX)
AS
BEGIN
    DECLARE @RoundID INT;

    -- Parse the JSON array and loop through each round
    DECLARE @RoundsTable TABLE (RoundID INT);
    INSERT INTO @RoundsTable
    SELECT JSON_VALUE(value, '$.RoundID') AS RoundID
    FROM OPENJSON(@Rounds);

    -- Insert into Round table
    DECLARE RoundCursor CURSOR FOR
    SELECT RoundID
    FROM @RoundsTable;

    OPEN RoundCursor;
    FETCH NEXT FROM RoundCursor INTO @RoundID;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Check if the combination of RoundID and TournamentID already exists
        IF NOT EXISTS (SELECT 1
        FROM Round
        WHERE RoundID = @RoundID AND TournamentID = @TournamentID)
        BEGIN
            -- Insert into Round table if not exists
            INSERT INTO Round
                (RoundID, TournamentID)
            VALUES
                (@RoundID, @TournamentID);
        END

        FETCH NEXT FROM RoundCursor INTO @RoundID;
    END

    CLOSE RoundCursor;
    DEALLOCATE RoundCursor;
END
