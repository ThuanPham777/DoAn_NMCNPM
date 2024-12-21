import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Table, Input, Button, Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const { Search } = Input;

const MyTeamDetail = () => {
  const { TeamID } = useParams();
  const { selectedTournament } = useSelector((state) => state.tournament);

  //console.log('TeamID', TeamID);
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const { myTeam } = location.state || {}; // Lấy dữ liệu `team`
  //console.log('myTeam', myTeam);
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchPlayersOfTeam = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/player/team/${TeamID}`
        );
        if (!response.ok) throw new Error('Error fetching players');
        const result = await response.json();
        //console.log('Players of teams: ', result.data);
        setPlayers(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlayersOfTeam();
  }, [TeamID]);

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'ProfileImg',
      key: 'ProfileImg',
      render: (text) => (
        <img
          src={`http://localhost:3000/uploads/players/${text}`}
          alt='Profile'
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '50%',
          }}
        />
      ),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'PlayerName',
      key: 'PlayerName',
    },
    {
      title: 'Số áo',
      dataIndex: 'JerseyNumber',
      key: 'JerseyNumber',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'DateOfBirth',
      key: 'DateOfBirth',
      render: (text) => {
        // Format the DateOfBirth
        const date = new Date(text); // Convert ISO string to Date object
        return date.toLocaleDateString('vi-VN'); // Format to Vietnamese date
      },
    },
    {
      title: 'Loại cầu thủ',
      dataIndex: 'PlayerType',
      key: 'PlayerType',
    },
    {
      title: 'Quê quán',
      dataIndex: 'HomeTown',
      key: 'HomeTown',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button
          type='link'
          onClick={() =>
            navigate(`/my-team-detail/${TeamID}/edit-soccer/${record.key}`)
          }
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold'>Đội: {myTeam.TeamName}</h2>
          <p className='text-lg'>Sân Nhà: {myTeam.Stadium}</p>
          <p className='text-lg'>HLV: {myTeam.Coach}</p>
        </div>
        <div className='flex flex-col space-y-2'>
          <Button
            type='primary'
            className='bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={() => {
              if (rules && players.length === rules.MaxPlayer) {
                toast.warning(`Số cầu thủ tối đa là ${rules.MaxPlayer}`);
                return;
              }
              navigate(`/my-team-detail/${TeamID}/add-soccer`);
            }}
          >
            Thêm cầu thủ
          </Button>
          <Button
            type='primary'
            className='bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={() =>
              navigate(`/my-team-detail/${TeamID}/update`, {
                state: { myTeam: myTeam },
              })
            }
          >
            Chỉnh sửa đội bóng
          </Button>
        </div>
      </div>

      <h3 className='text-xl font-semibold mb-4'>Danh sách cầu thủ</h3>

      <div className='mb-4'>
        <Search
          placeholder='Tìm kiếm cầu thủ...'
          style={{ width: 300 }}
          onSearch={(value) => {
            if (value) {
              const filteredPlayers = players.filter((player) =>
                player.PlayerName.toLowerCase().includes(value.toLowerCase())
              );
              setPlayers(filteredPlayers);
            } else {
              setPlayers(players); // Hoặc fetch lại nếu cần.
            }
          }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={players.map((player) => ({
          key: player.PlayerID,
          ...player,
        }))}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </div>
  );
};

export default MyTeamDetail;
