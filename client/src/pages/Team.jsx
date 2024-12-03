// src/components/Team.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeamCard from '../components/Team/TeamCard';
import { Spin } from 'antd';

const Team = () => {
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [teams, setTeams] = useState([]); // team attend tournament

  // Gọi API để lấy dữ liệu danh sách đội bóng thuộc mùa giải đã chọn
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedTournament) return; // Nếu không có mùa giải đã chọn, không làm gì cả

      try {
        const response = await fetch(
          `/api/tournaments/${selectedTournament.id}/teams`
        );
        const data = await response.json();
        setTeams(data.teams); // Lưu danh sách đội bóng vào state
        setTeams(selectedTournament.teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [selectedTournament]); // Khi selectedTournament thay đổi thì gọi lại API

  if (!teams) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>Danh sách các đội bóng</h2>
      <div className='flex gap-8 flex-wrap'>
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;
