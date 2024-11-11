import React, { useEffect, useState } from 'react';
import TournamentCard from '../components/Tournament/TournamentCard';

const Home = () => {
  const [tournaments, setTournaments] = useState([]);

  // Gọi API lấy dữ liệu danh sách giải đấu
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        // Fetching data using fetch API
        const response = await fetch('/assets/data/tournaments.json');

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const data = await response.json();

        // Set the fetched data to state
        setTournaments(data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>Danh sách các giải đấu</h2>
      <div className='flex gap-8 flex-wrap'>
        {tournaments.map((tournament) => {
          return (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;
