// TeamCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  return (
    <div
      className='w-56 h-80 bg-gray-200 p-4 rounded-md shadow-md flex flex-col items-center cursor-pointer'
      onClick={() => navigate(`/team-detail/${team.id}`)}
    >
      <img
        src={team.logo}
        alt={team.name}
        className='w-full h-54 mb-2'
      />
      <div className='flex flex-col gap-2 justify-center items-center'>
        <p className='text-center font-medium'>{team.name}</p>
        <p className='text-sm text-gray-700 mt-2'>
          Sân vận động: {team.stadium}
        </p>
        <p className='text-sm text-gray-700'>HLV: {team.coach}</p>
      </div>
    </div>
  );
};

export default TeamCard;
