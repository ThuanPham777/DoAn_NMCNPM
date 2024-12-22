import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Input, Form } from 'antd';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { Option } = Select;

const UpdateMatchResult = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const { match, RoundID } = location.state || {};
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayerID, setSelectedPlayerID] = useState(null);
  const [scoreType, setScoreType] = useState(null);
  const [scoreTime, setScoreTime] = useState(null);
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [matchScoreInfo, setMatchScoreInfo] = useState(null);
  const [playerScoreInfo, setPlayersScoreInfo] = useState([]);
  const [playerCardInfo, setPlayersCardInfo] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEditAndDelete, setIsModalVisibleEditAndDelete] =
    useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState();
  const [modalType, setModalType] = useState(null);
  const [rules, setRules] = useState();

  useEffect(() => {
    try {
      const fetchRule = async () => {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch rule');
        }
        const result = await response.json();
        console.log('rules: ', result.data);
        setRules(result.data);
      };

      fetchRule();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

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

  //console.log('matchInfo', match);
  // Calculate if the match has started or not
  const matchStartTime = new Date(match.date); // Assuming match.startTime is available as a string (e.g., '2024-12-20T15:00:00Z')
  const currentTime = new Date();

  const matchStatus =
    currentTime < matchStartTime ? 'Chưa diễn ra' : 'Đã diễn ra';
  //console.log('matchStatus: ' + matchStatus);

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
        setPlayersCardInfo(result.data.cardPlayerDetails);
        console.log(result.data.cardPlayerDetails);
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

  useEffect(() => {
    const fetchTeamPlayers = async (teamID, setTeam) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/player/team/${teamID}`
        );
        if (response.ok) {
          const result = await response.json();
          setTeam(result.data);
        }
      } catch (error) {
        console.error('Error fetching team players:', error);
      }
    };

    fetchTeamPlayers(match.team1ID, setTeam1);
    fetchTeamPlayers(match.team2ID, setTeam2);
  }, [match.team1ID, match.team2ID]);

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsModalVisibleEditAndDelete(false);
  };

  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    setPlayers(value === 'home' ? team1 : team2);
  };

  const handlePlayerChange = (value) => {
    setSelectedPlayerID(value);
  };

  const handleScoreTypeChange = (value) => {
    setScoreType(value);
  };

  const handleScoreTimeChange = (value) => {
    setScoreTime(value);
  };

  const addScore = async () => {
    if (!selectedPlayerID || !scoreType || scoreTime === null) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/match/${match.matchID}/round/${RoundID}/tournament/${selectedTournament.TournamentID}/add-goal/player/${selectedPlayerID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ScoreTime: scoreTime,
            ScoreType: scoreType,
          }),
        }
      );

      if (response.ok) {
        toast.success('Thêm bàn thắng thành công!');
        fetchMatchDetails();
        setIsModalVisible(false);
      } else {
        throw new Error('Failed to add score.');
      }
    } catch (error) {
      console.error('Error adding score:', error);
      toast.error('Có lỗi xảy ra khi thêm bàn thắng!');
    }
  };

  const addCard = async () => {
    if (!selectedPlayerID || !scoreType || scoreTime === null) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/match/${match.matchID}/round/${RoundID}/tournament/${selectedTournament.TournamentID}/add-card/player/${selectedPlayerID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            CardType: scoreType, // Thẻ vàng hoặc thẻ đỏ
            CardTime: scoreTime, // Phút nhận thẻ
          }),
        }
      );

      if (response.ok) {
        toast.success('Thêm thẻ thành công!');
        setIsModalVisible(false);
      } else {
        throw new Error('Failed to add card.');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      toast.error('Có lỗi xảy ra khi thêm thẻ!');
    }
  };

  const [selectedMinute, setSelectedMinute] = useState(null);

  const showEditModal = (player) => {
    setSelectedPlayer(player); // Lưu cầu thủ được chọn
    setSelectedMinute(null); // Reset phút khi mở modal
    setIsModalVisibleEditAndDelete(true); // Hiển thị modal
  };

  const deleteGoal = (minute) => {
    if (selectedPlayer && minute) {
      // Logic xóa bàn thắng tại phút cụ thể của cầu thủ
      try {
        const fetchDeleteGoal = async () => {
          const response = await fetch(
            `http://localhost:3000/api/match/${match.matchID}/round/${RoundID}/tournament/${selectedTournament.TournamentID}/delete-goal/player/${selectedPlayer.PlayerID}/minute/${minute}`,
            {
              method: 'DELETE',
            }
          );
          if (response.ok) {
            toast.success('Xóa bàn thắng thành công!');
            fetchMatchDetails(); // Cập nhật lại dữ liệu
          } else {
            throw new Error('Failed to delete goal.');
          }
        };
        fetchDeleteGoal();
      } catch (error) {
        console.error('Error deleting goal:', error);
        toast.error('Có lỗi xảy ra khi xóa bàn thắng!');
      }
      // Cập nhật lại dữ liệu (có thể thông qua API hoặc thay đổi trạng thái)
      setIsModalVisibleEditAndDelete(false); // Đóng modal sau khi xóa
    }
  };

  return (
    <>
      <h1 className='text-xl font-bold mb-6'>Cập nhật kết quả trận đấu</h1>
      <div className='flex flex-col items-center p-6 '>
        <div className='flex justify-between items-center gap-20 mb-6'>
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
            {' '}
            {/* Đặt width cố định để đồng nhất layout */}
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

        {/* Danh sách cầu thủ ghi bàn của cả 2 đội */}
        <div className='flex justify-between items-center gap-20 mb-6'>
          {/* Danh sách các cầu thủ ghi bàn của đội nhà */}
          <div>
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
                    PlayerID: player.PlayerID,
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

        {/* Danh sách thẻ đỏ ở hai đội */}
        <div className='flex justify-between items-center gap-20 mb-6'>
          {/* Danh sách cầu thủ nhận thẻ đỏ của đội nhà */}
          <div>
            {playerCardInfo
              .filter(
                (player) =>
                  player.Team === matchInfo.homeTeam.name &&
                  player.CardType === 'Thẻ đỏ' // Lọc thẻ đỏ
              )
              .reduce((acc, player) => {
                // Tìm cầu thủ đã có trong acc
                const existingPlayer = acc.find(
                  (p) => p.PlayerName === player.PlayerName
                );

                if (existingPlayer) {
                  // Nếu cầu thủ đã có trong acc, thêm phút nhận thẻ vào mảng phút của cầu thủ đó
                  existingPlayer.CardMinutes.push(player.Minute);
                } else {
                  // Nếu cầu thủ chưa có, tạo mới một đối tượng cho cầu thủ đó
                  acc.push({
                    PlayerID: player.PlayerID,
                    PlayerName: player.PlayerName,
                    CardMinutes: [player.Minute],
                  });
                }

                return acc;
              }, []) // Khởi tạo mảng trống cho reduce
              .map((player, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 bg-gray-100 p-2 rounded-md'
                >
                  <div>
                    <p className='font-medium'>{player.PlayerName}</p>
                  </div>
                  <div className='text-red-600 font-bold'>
                    {player.CardMinutes.map((minute, i) => (
                      <span key={i}>
                        {minute}'{i < player.CardMinutes.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Icon bóng đá nếu có cầu thủ nhận thẻ */}
          {playerCardInfo &&
            playerCardInfo.some((player) => player.CardType === 'Thẻ đỏ') && (
              <div>
                <img
                  className='w-6 h-6'
                  src='/assets/img/red-card.png'
                  alt='red-card'
                />
              </div>
            )}

          {/* Danh sách cầu thủ nhận thẻ đỏ của đội khách */}
          <div>
            {playerCardInfo
              .filter(
                (player) =>
                  player.Team === matchInfo.awayTeam.name &&
                  player.CardType === 'Thẻ đỏ' // Lọc thẻ đỏ
              )
              .reduce((acc, player) => {
                // Tìm cầu thủ đã có trong acc
                const existingPlayer = acc.find(
                  (p) => p.PlayerName === player.PlayerName
                );

                if (existingPlayer) {
                  // Nếu cầu thủ đã có trong acc, thêm phút nhận thẻ vào mảng phút của cầu thủ đó
                  existingPlayer.CardMinutes.push(player.Minute);
                } else {
                  // Nếu cầu thủ chưa có, tạo mới một đối tượng cho cầu thủ đó
                  acc.push({
                    PlayerID: player.PlayerID,
                    PlayerName: player.PlayerName,
                    CardMinutes: [player.Minute],
                  });
                }

                return acc;
              }, []) // Khởi tạo mảng trống cho reduce
              .map((player, index) => (
                <div
                  key={index}
                  className='flex items-center gap-4 bg-gray-100 p-2 rounded-md'
                >
                  <div>
                    <p className='font-medium'>{player.PlayerName}</p>
                  </div>
                  <div className='text-red-600 font-bold'>
                    {player.CardMinutes.map((minute, i) => (
                      <span key={i}>
                        {minute}'{i < player.CardMinutes.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {matchStatus === 'Đã diễn ra' && user?.Role === 'Admin' && (
          <div className='flex flex-col items-center gap-4 mt-8'>
            <Button
              onClick={() => showModal('goal')}
              className='bg-purple-600 text-white w-40 rounded-lg'
            >
              Thêm bàn thắng
            </Button>
            <Button
              onClick={() => showModal('card')}
              className='bg-purple-600 text-white w-40 rounded-lg'
            >
              Thêm thẻ
            </Button>
          </div>
        )}
      </div>

      {/* ------------------- Thêm bàn thắng----------- */}
      <Modal
        title={modalType === 'goal' ? 'Thêm bàn thắng' : 'Thêm thẻ'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          modalType === 'goal' ? (
            <Button
              type='primary'
              onClick={addScore}
            >
              Thêm
            </Button>
          ) : (
            <Button
              type='primary'
              onClick={addCard}
            >
              Thêm
            </Button>
          )
        }
      >
        <Form layout='vertical'>
          <Form.Item label='Đội'>
            <Select onChange={handleTeamChange}>
              <Option value='home'>{matchInfo.homeTeam.name}</Option>
              <Option value='away'>{matchInfo.awayTeam.name}</Option>
            </Select>
          </Form.Item>
          <Form.Item label='Cầu thủ'>
            <Select
              placeholder='Chọn cầu thủ'
              onChange={handlePlayerChange}
            >
              {players.map((player) => (
                <Option
                  key={player.PlayerID}
                  value={player.PlayerID}
                >
                  {player.PlayerName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {modalType === 'goal' && (
            <>
              <Form.Item label='Loại bàn thắng'>
                <Select
                  placeholder='Chọn loại bàn thắng'
                  onChange={handleScoreTypeChange}
                >
                  <Option value='Bình thường'>Bình thường</Option>
                  <Option value='Phạt đền'>Phạt đền</Option>
                  <Option value='Phản lưới'>Phản lưới</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Thời điểm ghi bàn'>
                <Select
                  placeholder='Chọn phút ghi bàn'
                  onChange={handleScoreTimeChange}
                >
                  {Array.from(
                    { length: rules && rules.MaxTimeScore + 1 },
                    (_, i) => (
                      <Option
                        key={i}
                        value={i}
                      >
                        Phút {i}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </>
          )}

          {modalType === 'card' && (
            <>
              <Form.Item label='Loại thẻ'>
                <Select
                  placeholder='Chọn loại thẻ'
                  onChange={handleScoreTypeChange}
                >
                  <Option value='Thẻ vàng'>Thẻ vàng</Option>
                  <Option value='Thẻ đỏ'>Thẻ đỏ</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Thời điểm nhận thẻ'>
                <Select
                  placeholder='Chọn phút nhận thẻ'
                  onChange={handleScoreTimeChange}
                >
                  {Array.from(
                    { length: rules && rules.MaxTimeScore },
                    (_, i) => (
                      <Option
                        key={i}
                        value={i}
                      >
                        Phút {i}
                      </Option>
                    )
                  )}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      <Modal
        title='Xóa bàn thắng'
        visible={isModalVisibleEditAndDelete}
        onCancel={handleCancel}
        footer={
          <div className='flex justify-end'>
            <Button
              type='danger'
              onClick={() => deleteGoal(selectedMinute)}
              disabled={!selectedMinute} // Không cho phép xóa khi chưa chọn phút
            >
              Xóa
            </Button>
          </div>
        }
      >
        <Form layout='vertical'>
          <Form.Item label='Phút ghi bàn'>
            <Select
              placeholder='Chọn phút ghi bàn để xóa'
              value={selectedMinute}
              onChange={setSelectedMinute} // Cập nhật phút được chọn
            >
              {selectedPlayer?.Minutes.map((minuteObj) => (
                <Select.Option
                  key={minuteObj.minute}
                  value={minuteObj.minute}
                >
                  Phút {minuteObj.minute}'
                  {minuteObj.scoreType === 'Phạt đền' && ' (P)'}
                  {minuteObj.scoreType === 'Phản lưới' && ' (OG)'}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateMatchResult;
