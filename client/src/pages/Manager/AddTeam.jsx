import React from 'react';
import AddTeamForm from '../../components/Form/AddTeamForm';

const AddTeam = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Tạo đội bóng</h1>
      <div>
        <AddTeamForm />
      </div>
    </div>
  );
};

export default AddTeam;
