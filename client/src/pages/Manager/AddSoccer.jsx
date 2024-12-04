import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AddSoccerForm from '../../components/Form/AddSoccerForm';

const AddSoccer = () => {
  const { TeamID } = useParams();
  console.log('TeamID in addSoccer: ', TeamID);
  const { PlayerID } = useParams(); // Lấy PlayerID từ URL params
  console.log('useparams: ', useParams());
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!PlayerID) return; // Nếu không có PlayerID, không cần gọi API
      try {
        const response = await fetch(
          `http://localhost:3000/api/player/${PlayerID}`
        );
        if (response.ok) {
          const result = await response.json();
          console.log('Player details:', result.data);
          setPlayer(result.data); // Cập nhật state player
        } else {
          console.error('Failed to fetch player details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching player details:', error);
      }
    };
    fetchPlayerData();
  }, [PlayerID]); // Chỉ chạy khi PlayerID thay đổi

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        {player ? 'Cập nhật thông tin cầu thủ' : 'Thêm cầu thủ'}
      </h1>
      <div>
        <AddSoccerForm
          player={player}
          TeamID={TeamID}
        />
      </div>
    </div>
  );
};

export default AddSoccer;
