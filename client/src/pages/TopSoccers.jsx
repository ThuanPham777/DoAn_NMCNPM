import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Rank = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const { selectedTournament } = useSelector((state) => state.tournament);
  //console.log('selectedTournament', selectedTournament.TournamentID);

  useEffect(() => {
    if (!selectedTournament) {
      toast.warning('Please select a tournament');
      return;
    }
    const fetchTopScorePlayers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reports/tournament/${selectedTournament.TournamentID}/topScorePlayers`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('data:', data);
        setTopPlayers(data); // Assuming API directly returns an array of players
      } catch (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        );
      }
    };

    fetchTopScorePlayers();
  }, [selectedTournament]);

  return (
    <>
      <h1 className='text-2xl font-bold mb-8'>Top cầu thủ ghi bàn</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse text-sm text-left text-gray-700'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border-b px-4 py-2 font-semibold'>Cầu thủ</th>
              <th className='border-b px-4 py-2 font-semibold'>Số áo</th>
              <th className='border-b px-4 py-2 font-semibold'>Quê quán</th>
              <th className='border-b px-4 py-2 font-semibold'>Loại cầu thủ</th>
              <th className='border-b px-4 py-2 font-semibold'>Đội bóng</th>
              <th className='border-b px-4 py-2 font-semibold'>Số bàn thắng</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player) => (
              <tr
                key={player.PlayerID}
                className='hover:bg-gray-50'
              >
                <td className='border-b px-4 py-2 flex items-center gap-2'>
                  <img
                    src={`http://localhost:3000/uploads/players/${player.ProfileImg}`}
                    alt={player.PlayerName}
                    className='w-8 h-8 rounded-full'
                  />
                  <span>{player.PlayerName}</span>
                </td>
                <td className='border-b px-4 py-2'>{player.JerseyNumber}</td>
                <td className='border-b px-4 py-2'>{player.HomeTown}</td>
                <td className='border-b px-4 py-2'>{player.PlayerType}</td>
                <td className='border-b px-4 py-2'>{player.TeamName}</td>
                <td className='border-b px-4 py-2'>{player.TotalGoals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Rank;
