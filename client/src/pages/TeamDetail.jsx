import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Input, Spin } from 'antd';
import useSelection from 'antd/es/table/hooks/useSelection';
import { useSelector } from 'react-redux';

const { Search } = Input;

const TeamDetail = () => {
  const { teamId } = useParams();
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        // const response = await fetch(
        //   `/api/tournaments/${selectedTournament.id}/teams/${teamId}`
        // );
        // const data = await response.json();
        if (!selectedTournament) {
          console.error('No tournament selected');
          return;
        }

        // Find the team in the selected tournament
        const foundTeam = selectedTournament.teams.find(
          (team) => team.id === teamId
        );

        if (foundTeam) {
          setTeam(foundTeam);
          setPlayers(foundTeam.soccers); // Update players when team is found
        } else {
          console.error('Team not found');
        }
      } catch (error) {
        console.error('Error fetching team details:', error);
      }
    };

    fetchTeamData();
  }, [teamId, selectedTournament]); // Ensure selectedTournament is updated

  if (!team)
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );

  // Define columns for the table based on player data structure
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
  ];

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-4'>Đội: {team.name}</h2>
      <p className='text-lg mb-2'>Sân Nhà: {team.stadium}</p>
      <p className='text-lg mb-6'>HLV: {team.coach}</p>

      <h3 className='text-xl font-semibold mt-6 mb-4'>Danh sách cầu thủ</h3>

      {/* Search bar */}
      <div className='mb-4'>
        <Search
          placeholder='Tìm kiếm cầu thủ...'
          style={{ width: 300 }}
          onSearch={(value) => {
            const filteredPlayers = team.soccers.filter((player) =>
              player.fullName.toLowerCase().includes(value.toLowerCase())
            );
            setPlayers(filteredPlayers);
          }}
          allowClear
        />
      </div>

      {/* Table for players */}
      <Table
        columns={columns}
        dataSource={players.map((player, index) => ({
          key: index,
          jerseyNumber: player.jerseyNumber,
          fullName: player.fullName,
          dateOfBirth: player.dateOfBirth,
          playerType: player.playerType,
          hometown: player.hometown,
        }))}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
};

export default TeamDetail;
