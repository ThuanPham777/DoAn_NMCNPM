import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MatchResultDetail = () => {
  const location = useLocation();
  const { match, RoundID } = location.state || {};
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [matchScoreInfo, setMatchScoreInfo] = useState(null);
  const [playerScoreInfo, setPlayersScoreInfo] = useState([]);

  const matchInfo = {
    homeTeam: {
      name: match.team1Name,
      logo: `http://localhost:3000/uploads/teams/${match.team1Logo}`,
    },
    awayTeam: {
      name: match.team2Name,
      logo: `http://localhost:3000/uploads/teams/${match.team2Logo}`,
    },
  };

  const matchStartTime = new Date(match.date);
  const currentTime = new Date();

  const matchStatus =
    currentTime < matchStartTime ? 'Chưa diễn ra' : 'Đã diễn ra';

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/match/${match.matchID}/round/${RoundID}/tournament/${selectedTournament.TournamentID}/details`
      );
      if (response.ok) {
        const result = await response.json();
        setMatchScoreInfo(result.data.matchInfo);
        console.log(result.data.matchInfo);
        setPlayersScoreInfo(result.data.playerDetails);
        console.log(result.data.playerDetails);
      } else {
        throw new Error('Failed to fetch match details.');
      }
    } catch (error) {
      console.error('Error fetching match details:', error);
    }
  };

  useEffect(() => {
    fetchMatchDetails();
  }, []);

  return (
    <>
      <h1 className='text-xl font-bold mb-6'>Kết quả trận đấu</h1>
      <div className='flex flex-col items-center p-6 '>
        <div className='flex justify-center items-center gap-20 mb-6'>
          <div>
            <div className='text-center'>
              <img
                src={matchInfo.homeTeam.logo}
                alt={`${matchInfo.homeTeam.name} logo`}
                className='w-20 h-20 mb-2'
              />
              <h2 className='text-lg font-semibold'>
                {matchInfo.homeTeam.name}
              </h2>
              <p className='text-gray-500'>Home</p>
            </div>
          </div>

          {matchStatus === 'Chưa diễn ra' ? (
            <div className='text-2xl font-bold text-red-600'>{matchStatus}</div>
          ) : (
            matchScoreInfo && (
              <div className='flex justify-center items-center gap-4 text-xl font-bold'>
                <div>{matchScoreInfo.HomeScore}</div>
                <div className='text-2xl'>-</div>
                <div>{matchScoreInfo.AwayScore}</div>
              </div>
            )
          )}

          <div>
            <div className='text-center'>
              <img
                src={matchInfo.awayTeam.logo}
                alt={`${matchInfo.awayTeam.name} logo`}
                className='w-20 h-20 mb-2'
              />
              <h2 className='text-lg font-semibold'>
                {matchInfo.awayTeam.name}
              </h2>
              <p className='text-gray-500'>Away</p>
            </div>
          </div>
        </div>

        {/*  */}
        <div className='flex justify-center items-center gap-20'>
          {/* Danh sách các cầu thủ ghi bàn của đội nhà */}
          <div className=''>
            {playerScoreInfo
              .filter((player) => player.Team === matchInfo.homeTeam.name)
              .reduce((acc, player) => {
                // Tìm cầu thủ đã có trong acc
                const existingPlayer = acc.find(
                  (p) => p.PlayerName === player.PlayerName
                );

                if (existingPlayer) {
                  // Nếu cầu thủ đã có trong acc, thêm phút ghi bàn vào mảng phút của cầu thủ đó
                  existingPlayer.Minutes.push({
                    minute: player.Minute,
                    scoreType: player.ScoreType, // Giả sử có trường ScoreType
                  });
                } else {
                  // Nếu cầu thủ chưa có, tạo mới một đối tượng cho cầu thủ đó
                  acc.push({
                    PlayerName: player.PlayerName,
                    Minutes: [
                      {
                        minute: player.Minute,
                        scoreType: player.ScoreType, // Giả sử có trường ScoreType
                      },
                    ],
                  });
                }

                return acc;
              }, []) // Khởi tạo mảng trống cho reduce
              .map((player, index) => (
                <div
                  key={index}
                  onClick={() => showEditModal(player)}
                  className='flex items-center gap-4 bg-gray-100 p-2 rounded-md'
                >
                  <div>
                    <p className='font-medium'>{player.PlayerName}</p>
                    <p className='text-sm text-gray-500'>
                      {/* Hiển thị loại bàn thắng nếu cần */}
                    </p>
                  </div>
                  <div className='text-purple-600 font-bold'>
                    {player.Minutes.map((minute, i) => {
                      // Kiểm tra loại bàn thắng và hiển thị đúng kiểu
                      const minuteDisplay =
                        minute.scoreType === 'Phạt đền'
                          ? `${minute.minute}'(P)`
                          : minute.scoreType === 'Phản lưới'
                          ? `${minute.minute}'(OG)`
                          : `${minute.minute}'`; // Nếu không phải Phạt đền hoặc Phản lưới, chỉ hiển thị phút
                      return (
                        <span key={i}>
                          {minuteDisplay}
                          {i < player.Minutes.length - 1 && ', '}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {playerScoreInfo && playerScoreInfo.length > 0 && (
            <div>
              <img
                className='w-6 h-6'
                src='/assets/img/soccer-ball-variant.png'
                alt='ball'
              />
            </div>
          )}
          {/* Danh sách cầu thủ ghi bàn của đội khách */}
          <div>
            {playerScoreInfo
              .filter((player) => player.Team === matchInfo.awayTeam.name)
              .reduce((acc, player) => {
                // Tìm cầu thủ đã có trong acc
                const existingPlayer = acc.find(
                  (p) => p.PlayerName === player.PlayerName
                );

                if (existingPlayer) {
                  // Nếu cầu thủ đã có trong acc, thêm phút ghi bàn vào mảng phút của cầu thủ đó
                  existingPlayer.Minutes.push({
                    minute: player.Minute,
                    scoreType: player.ScoreType, // Giả sử có trường ScoreType
                  });
                } else {
                  // Nếu cầu thủ chưa có, tạo mới một đối tượng cho cầu thủ đó
                  acc.push({
                    PlayerName: player.PlayerName,
                    Minutes: [
                      {
                        minute: player.Minute,
                        scoreType: player.ScoreType, // Giả sử có trường ScoreType
                      },
                    ],
                  });
                }

                return acc;
              }, []) // Khởi tạo mảng trống cho reduce
              .map((player, index) => (
                <div
                  key={index}
                  onClick={() => showEditModal(player)}
                  className='flex items-center gap-4 bg-gray-100 p-2 rounded-md'
                >
                  <div>
                    <p className='font-medium'>{player.PlayerName}</p>
                    <p className='text-sm text-gray-500'>
                      {/* Hiển thị loại bàn thắng nếu cần */}
                    </p>
                  </div>
                  <div className='text-purple-600 font-bold'>
                    {player.Minutes.map((minute, i) => {
                      // Kiểm tra loại bàn thắng và hiển thị đúng kiểu
                      const minuteDisplay =
                        minute.scoreType === 'Phạt đền'
                          ? `${minute.minute}'(P)`
                          : minute.scoreType === 'Phản lưới'
                          ? `${minute.minute}'(OG)`
                          : `${minute.minute}'`; // Nếu không phải Phạt đền hoặc Phản lưới, chỉ hiển thị phút
                      return (
                        <span key={i}>
                          {minuteDisplay}
                          {i < player.Minutes.length - 1 && ', '}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchResultDetail;
