import React from 'react';
import TournamentRuleForm from '../components/Form/TournamentRuleForm';

const TournamentRules = () => {
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
