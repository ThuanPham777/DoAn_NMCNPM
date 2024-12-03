// MyTeam.js
import React, { useEffect, useState } from 'react';
import MyTeamCard from '../../components/Team/MyTeamCard';

const MyTeam = () => {
  const [myTeams, setMyTeams] = useState([]);
  // Gọi API lấy dữ liệu danh sách đội bóng
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchMyTeams = async () => {
      try {
        // Fetching data using fetch API
        const response = await fetch(
          'http://localhost:3000/api/team/my-teams',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const result = await response.json();
        setMyTeams(result.data); // Lưu dữ liệu vào state myTeams
        console.log('myTeams: ' + result.data);
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
            key={myTeam.UserID}
            myTeam={myTeam}
          />
        ))}
      </div>
    </div>
  );
};

export default MyTeam;
