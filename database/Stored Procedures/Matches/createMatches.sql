CREATE PROCEDURE createMatch
    @RoundID INT,
    @TournamentID INT,
    @Matches NVARCHAR(MAX)
AS
BEGIN
    DECLARE @MatchID INT;
    DECLARE @Team1ID INT;
    DECLARE @Team2ID INT;
    DECLARE @MatchDate DATETIME;

    -- Parse the JSON array and loop through each match
    DECLARE @MatchesTable TABLE (
        MatchID INT,
        Team1ID INT,
        Team2ID INT,
        MatchDate DATETIME
    );

    -- Insert parsed JSON into @MatchesTable
    INSERT INTO @MatchesTable
    SELECT
        JSON_VALUE(value, '$.MatchID') AS MatchID,
        JSON_VALUE(value, '$.Team1ID') AS Team1ID,
        JSON_VALUE(value, '$.Team2ID') AS Team2ID,
        JSON_VALUE(value, '$.MatchDate') AS MatchDate
    FROM OPENJSON(@Matches);

    -- Declare cursor for inserting matches into the Match table
    DECLARE MatchCursor CURSOR FOR
    SELECT MatchID, Team1ID, Team2ID, MatchDate
    FROM @MatchesTable;

    OPEN MatchCursor;
    FETCH NEXT FROM MatchCursor INTO @MatchID, @Team1ID, @Team2ID, @MatchDate;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Check if the match combination already exists
        IF NOT EXISTS (
            SELECT 1
        FROM Match
        WHERE MatchID = @MatchID
            AND RoundID = @RoundID
            AND TournamentID = @TournamentID
            AND Team1ID = @Team1ID
            AND Team2ID = @Team2ID
        )
        BEGIN
            -- Insert match if it doesn't exist
            INSERT INTO Match
                (MatchID, RoundID, TournamentID, Team1ID, Team2ID, MatchDate)
            VALUES
                (@MatchID, @RoundID, @TournamentID, @Team1ID, @Team2ID, @MatchDate);
        END

        FETCH NEXT FROM MatchCursor INTO @MatchID, @Team1ID, @Team2ID, @MatchDate;
    END

    CLOSE MatchCursor;
    DEALLOCATE MatchCursor;
END
