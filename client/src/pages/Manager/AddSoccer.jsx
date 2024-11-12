import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddSoccerForm from '../../components/Form/AddSoccerForm';

const AddSoccer = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch('/assets/data/users.json');
        const data = await response.json();

        const user = data.find(
          (user) =>
            user.role === 'manager' && user.email === 'alice.smith@example.com'
        );
        console.log('User: ' + user.teams);

        const selectedTeam = user?.teams
          .flatMap((team) => team.soccers)
          .find((soccer) => soccer.id === playerId);

        console.log('playerId: ' + playerId);
        console.log('selectedTeam: ', selectedTeam);

        if (selectedTeam) {
          setPlayer(selectedTeam);
        }
      } catch (error) {
        console.error('Error fetching player details:', error);
      }
    };

    if (playerId) {
      fetchPlayerData();
    }
  }, [playerId]);

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        {player ? 'Cập nhật thông tin cầu thủ' : 'Thêm cầu thủ'}
      </h1>
      <div>
        <AddSoccerForm player={player} />
      </div>
    </div>
  );
};

export default AddSoccer;
