import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Input, Button } from 'antd';

const { Search } = Input;

const MyTeamDetail = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/assets/data/users.json');
        const data = await response.json();

        const user = data.find(
          (user) =>
            user.role === 'manager' && user.email === 'alice.smith@example.com'
        );

        const selectedTeam = user?.teams.find(
          (team) => team.id === parseInt(id)
        );

        if (selectedTeam) {
          setTeam(selectedTeam);
          setPlayers(selectedTeam.soccers);
        }
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    fetchTeamData();
  }, [id]);

  if (!team) return <div>Loading...</div>;

  const columns = [
    {
      title: 'Số áo',
      dataIndex: 'jerseyNumber',
      key: 'jerseyNumber',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
    {
      title: 'Loại cầu thủ',
      dataIndex: 'playerType',
      key: 'playerType',
    },
    {
      title: 'Quê quán',
      dataIndex: 'hometown',
      key: 'hometown',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (text, record) => (
        <Button
          type='link'
          onClick={() => navigate(`/edit-soccer/${record.key}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold mb-4'>Đội: {team.name}</h2>
          <p className='text-lg mb-2'>Sân Nhà: {team.stadium}</p>
          <p className='text-lg mb-6'>HLV: {team.coach}</p>
        </div>
        <button
          className='text-white border px-4 py-2 rounded-full outline-none bg-[#56FF61] hover:bg-[#3eeb4a]'
          onClick={() => navigate('/add-soccer')}
        >
          Thêm cầu thủ
        </button>
      </div>

      <h3 className='text-xl font-semibold mt-6 mb-4'>Danh sách cầu thủ</h3>

      <div className='mb-4'>
        <Search
          placeholder='Tìm kiếm cầu thủ...'
          style={{ width: 300 }}
          onSearch={(value) => {
            if (value) {
              const filteredPlayers = team.soccers.filter((player) =>
                player.fullName.toLowerCase().includes(value.toLowerCase())
              );
              setPlayers(filteredPlayers);
            } else {
              setPlayers(team.soccers);
            }
          }}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={players.map((player, index) => ({
          key: player.id, // Assuming each player has a unique `id`
          ...player,
        }))}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
};

export default MyTeamDetail;
