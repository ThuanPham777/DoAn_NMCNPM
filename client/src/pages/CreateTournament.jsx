import React from 'react';
import TournamentForm from '../components/Form/TournamentForm';

const CreateTournament = () => {
  return (
    <div>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Hồ sơ giải đấu</h1>
      </div>
      <div>
        <TournamentForm />
      </div>
    </div>
  );
};

export default CreateTournament;
