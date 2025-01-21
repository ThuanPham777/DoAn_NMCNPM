import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Rank = () => {
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [rankings, setRankings] = useState();

  useEffect(() => {
    if (!selectedTournament) {
      toast.warning('Please select a tournament');
      return;
    }
    const fetchTournamentRank = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/reports/tournament/${selectedTournament.TournamentID}/rank`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch tournament rank');
        }

        const result = await response.json();
        console.log('tournament rank: ', result.data);
        setRankings(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTournamentRank();
  }, []);

  return (
    <div className='p-4 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold mb-8 text-center text-gray-800'>
        Bảng xếp hạng
      </h1>
      <div className='overflow-x-auto shadow-md rounded-lg'>
        <table className='table-auto w-full text-sm text-left text-gray-700'>
          <thead className='text-xs uppercase bg-gray-800 text-white'>
            <tr>
              <th className='px-6 py-3'>Câu lạc bộ</th>
              <th className='px-6 py-3'>ĐĐ</th>
              <th className='px-6 py-3'>Thắng</th>
              <th className='px-6 py-3'>H</th>
              <th className='px-6 py-3'>Thua</th>
              <th className='px-6 py-3'>BT</th>
              <th className='px-6 py-3'>SBT</th>
              <th className='px-6 py-3'>HS</th>
              <th className='px-6 py-3'>Đ</th>
            </tr>
          </thead>
          <tbody>
            {rankings &&
              rankings.map((team, index) => (
                <tr
                  key={team.teamID}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  } hover:bg-gray-200`}
                >
                  <td className='px-6 py-3 flex items-center gap-2'>
                    {index + 1}
                    <img
                      src={team.teamLogo}
                      alt={team.name}
                      className='w-8 h-8 rounded-full'
                    />
                    {team.name}
                  </td>
                  <td className='px-6 py-3'>{team.played}</td>
                  <td className='px-6 py-3'>{team.wins}</td>
                  <td className='px-6 py-3'>{team.draws}</td>
                  <td className='px-6 py-3'>{team.losses}</td>
                  <td className='px-6 py-3'>{team.goalsFor}</td>
                  <td className='px-6 py-3'>{team.goalsAgainst}</td>
                  <td className='px-6 py-3'>{team.goalDifference}</td>
                  <td className='px-6 py-3 font-semibold'>{team.points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rank;
