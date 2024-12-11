import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Input, Form } from 'antd';
import { useLocation } from 'react-router-dom';

const { Option } = Select;

const UpdateMatchResult = () => {
  const location = useLocation();
  const { match } = location.state || {};
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

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

  useEffect(() => {
    // Fetch cầu thủ của đội 1
    const fetchTeam1Players = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/player/team/${match.team1ID}`
        );
        if (response.ok) {
          const result = await response.json();
          setTeam1(result.data);
        }
      } catch (error) {
        console.error('Error fetching team1 players:', error);
      }
    };

    fetchTeam1Players();

    // Fetch cầu thủ của đội 2
    const fetchTeam2Players = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/player/team/${match.team2ID}`
        );
        if (response.ok) {
          const result = await response.json();
          setTeam2(result.data);
        }
      } catch (error) {
        console.error('Error fetching team2 players:', error);
      }
    };

    fetchTeam2Players();
  }, [match.team1ID, match.team2ID]);

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleTeamChange = (value) => {
    setSelectedTeam(value);
    if (value === 'home') {
      setPlayers(team1); // Hiển thị cầu thủ đội nhà
    } else if (value === 'away') {
      setPlayers(team2); // Hiển thị cầu thủ đội khách
    }
  };

  return (
    <>
      <h1 className='text-xl font-bold mb-6'>Cập nhật kết quả trận đấu</h1>
      <div className='flex flex-col items-center p-6'>
        <div className='flex justify-center items-center gap-12 mb-6'>
          <div className='text-center'>
            <img
              src={matchInfo.homeTeam.logo}
              alt={`${matchInfo.homeTeam.name} logo`}
              className='w-20 h-20 mb-2'
            />
            <h2 className='text-lg font-semibold'>{matchInfo.homeTeam.name}</h2>
            <p className='text-gray-500'>Home</p>
          </div>

          <div className='flex justify-center items-center gap-4'>
            <div></div>
            <div className='text-2xl font-bold'>-</div>
            <div></div>
          </div>

          <div className='text-center'>
            <img
              src={matchInfo.awayTeam.logo}
              alt={`${matchInfo.awayTeam.name} logo`}
              className='w-20 h-20 mb-2'
            />
            <h2 className='text-lg font-semibold'>{matchInfo.awayTeam.name}</h2>
            <p className='text-gray-500'>Away</p>
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
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
      </div>

      <Modal
        title={modalType === 'goal' ? 'Thêm bàn thắng' : 'Thêm thẻ'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key='back'
            onClick={handleCancel}
          >
            Hủy
          </Button>,
          <Button
            key='submit'
            type='primary'
            onClick={handleOk}
          >
            Thêm
          </Button>,
        ]}
      >
        <Form layout='vertical'>
          <Form.Item label='Đội'>
            <Select onChange={handleTeamChange}>
              <Option value='home'>{matchInfo.homeTeam.name}</Option>
              <Option value='away'>{matchInfo.awayTeam.name}</Option>
            </Select>
          </Form.Item>
          <Form.Item label='Cầu thủ'>
            <Select placeholder='Chọn cầu thủ'>
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
                <Select placeholder='Chọn loại bàn thắng'>
                  <Option value='normal'>Bình thường</Option>
                  <Option value='penalty'>Phạt đền (penalty)</Option>
                  <Option value='own'>Phản lưới nhà</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Thời điểm ghi bàn'>
                <Select placeholder='Chọn phút ghi bàn'>
                  {Array.from({ length: 97 }, (_, i) => (
                    <Option
                      key={i}
                      value={i}
                    >
                      Phút {i}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          {modalType === 'card' && (
            <>
              <Form.Item label='Loại thẻ'>
                <Select placeholder='Chọn loại thẻ'>
                  <Option value='yellow'>Thẻ vàng</Option>
                  <Option value='red'>Thẻ đỏ</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Thời điểm nhận thẻ'>
                <Select placeholder='Chọn phút nhận thẻ'>
                  {Array.from({ length: 97 }, (_, i) => (
                    <Option
                      key={i}
                      value={i}
                    >
                      Phút {i}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateMatchResult;
