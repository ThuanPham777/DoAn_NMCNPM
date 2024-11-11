import React from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';

const UpdateMatchResult = ({ matchData }) => {
  const { matchId } = useParams();

  // Mock data structure, replace with actual data from matchData or API
  const matchInfo = matchData || {
    homeTeam: { name: 'Man City', logo: '/assets/logos/man-city.png' },
    awayTeam: { name: 'Arsenal', logo: '/assets/logos/arsenal.png' },
  };

  const handleAddGoal = (team) => {
    console.log(`Add goal for ${team}`);
    // Add functionality to update goals for the team
  };

  const handleAddCard = (team) => {
    console.log(`Add card for ${team}`);
    // Add functionality to update cards for the team
  };

  return (
    <>
      <h1 className='text-xl font-bold mb-6'>Cập nhật kết quả trận đấu</h1>
      <div className='flex flex-col items-center p-6'>
        <div className='flex justify-center items-center gap-12 mb-6'>
          <div className='text-center'>
            <img
              src={matchInfo.homeTeam.logo}
              alt={`${matchInfo.homeTeam.name} logo`}
              className='w-20 h-20 mb-2'
            />
            <h2 className='text-lg font-semibold'>{matchInfo.homeTeam.name}</h2>
            <p className='text-gray-500'>Home</p>
          </div>

          <div className='text-2xl font-bold'>-</div>

          <div className='text-center'>
            <img
              src={matchInfo.awayTeam.logo}
              alt={`${matchInfo.awayTeam.name} logo`}
              className='w-20 h-20 mb-2'
            />
            <h2 className='text-lg font-semibold'>{matchInfo.awayTeam.name}</h2>
            <p className='text-gray-500'>Away</p>
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          <Button
            onClick={() => handleAddGoal('home')}
            className='bg-purple-600 text-white w-40 rounded-lg'
          >
            Thêm bàn thắng
          </Button>
          <Button
            onClick={() => handleAddCard('home')}
            className='bg-purple-600 text-white w-40 rounded-lg'
          >
            Thêm thẻ
          </Button>
        </div>
      </div>
    </>
  );
};

export default UpdateMatchResult;
