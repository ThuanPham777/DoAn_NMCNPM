import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Table, Input, Button, Spin, Alert } from 'antd';

const { Search } = Input;

const MyTeamDetail = () => {
  const { TeamID } = useParams();

  //console.log('TeamID', TeamID);
  const [players, setPlayers] = useState([]);
  const location = useLocation();
  const { myTeam } = location.state || {}; // Lấy dữ liệu `team`
  //console.log('myTeam', myTeam);
  const navigate = useNavigate();

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
      title: 'Số áo',
      dataIndex: 'JerseyNumber',
      key: 'JerseyNumber',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'PlayerName',
      key: 'PlayerName',
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
        <Button
          type='primary'
          className='bg-[#56FF61] hover:bg-[#3eeb4a]'
          onClick={() => navigate(`/my-team-detail/${TeamID}/add-soccer`)}
        >
          Thêm cầu thủ
        </Button>
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
