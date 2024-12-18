import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TeamCard from '../components/Team/TeamCard';
import { Spin } from 'antd';
import { toast } from 'react-toastify';

const Team = () => {
  const [teams, setTeams] = useState([]); // team attend tournament

  // get tournament from localStorage
  const { selectedTournament } = useSelector((state) => state.tournament);
  console.log('selectedTournament', selectedTournament);

  // Gọi API để lấy dữ liệu danh sách đội bóng thuộc mùa giải đã chọn
  useEffect(() => {
    if (!selectedTournament) {
      toast.warning('Please select a tournament');
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/team/tournament/${selectedTournament.TournamentID}/teams-attend-tournament`,
          {
            method: 'GET',
          }
        );
        const result = await response.json();
        console.log('danh sách các đội bóng', result.data); // Log dữ liệu lấy từ API
        setTeams(result.data); // Lưu danh sách đội bóng vào state
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [selectedTournament]); // Khi selectedTournament thay đổi thì gọi lại API

  if (!teams.length) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>
        Danh sách các đội bóng tham gia giải
        <span className='text-blue-600 ml-1 text-xl font-semibold'>
          {selectedTournament.TournamentName}
        </span>
      </h2>
      <div className='flex gap-8 flex-wrap'>
        {teams.map((team) => (
          <TeamCard
            key={team.TeamID}
            team={team}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;
