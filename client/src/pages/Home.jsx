import React, { useEffect, useState } from 'react';
import TournamentCard from '../components/Tournament/TournamentCard';

const Home = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tournament');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setTournaments(result.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>Danh sách các giải đấu</h2>
      </div>

      <div className='flex gap-8 flex-wrap'>
        {tournaments.length > 0 &&
          tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.TournamentID}
              tournament={tournament}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
