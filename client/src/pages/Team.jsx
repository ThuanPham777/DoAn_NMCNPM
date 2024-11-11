// Team.js
import React, { useEffect, useState } from 'react';
import TeamCard from '../components/Team/TeamCard';

const Team = () => {
  const [teams, setTeams] = useState([]);

  // Gọi API lấy dữ liệu danh sách đội bóng
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Fetching data using fetch API
        const response = await fetch('/assets/data/teams.json');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const data = await response.json();

        // Set the fetched data to state
        setTeams(data);
      } catch (error) {
        console.error('Error fetching Teams:', error);
      }
    };

    fetchTeams();
  }, []);

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
