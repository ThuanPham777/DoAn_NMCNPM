// MyTeam.js
import React, { useEffect, useState } from 'react';
import MyTeamCard from '../../components/Team/MyTeamCard';

const MyTeam = () => {
  const [myTeams, setMyTeams] = useState([]);

  // Gọi API lấy dữ liệu danh sách đội bóng
  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        // Fetching data using fetch API
        const response = await fetch('/assets/data/users.json');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const data = await response.json();
        // find user is manager
        const user = data.find(
          (user) =>
            user.role === 'manager' && user.email === 'alice.smith@example.com'
        );

        //console.log('user: ', user);

        setMyTeams(user.teams);
      } catch (error) {
        console.error('Error fetching MyTeams:', error);
      }
    };

    fetchMyTeams();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>Danh sách các đội bóng</h2>
      <div className='flex gap-8 flex-wrap'>
        {myTeams.map((myTeam) => (
          <MyTeamCard
            key={myTeam.id}
            myTeam={myTeam}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
