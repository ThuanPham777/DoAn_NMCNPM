import React from 'react';

const TournamentCard = ({ tournament }) => {
  return (
    <div
      key={tournament.id}
      className='w-56 h-85 bg-gray-200 p-4 rounded-md shadow-md flex flex-col items-center'
    >
      <img
        src={tournament.logo}
        alt={tournament.name}
        className='w-54 h-54 mb-2'
      />

      <p className='text-center font-medium'>{tournament.name}</p>
      <p className='text-center font-medium'>{tournament.time}</p>
    </div>
  );
};

export default TournamentCard;
