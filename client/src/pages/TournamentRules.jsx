import React from 'react';
import TournamentRuleForm from '../components/Form/TournamentRuleForm';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TournamentRules = () => {
  const { selectedTournament } = useSelector((state) => state.tournament);

  if (!selectedTournament) {
    toast.warning('Please select a tournament');
    return;
  }
  return (
    <div>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Điều lệ giải</h1>
      </div>
      <div>
        <TournamentRuleForm />
      </div>
    </div>
  );
};

export default TournamentRules;
