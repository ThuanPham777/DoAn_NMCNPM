// src/components/TournamentCard.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setSelectedTournament } from '../../redux/slices/tournamentSlice';

const TournamentCard = ({ tournament }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Gọi API để lấy chi tiết mùa giải
  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        // const response = await fetch(`/api/tournaments/${tournament.id}`);
        // const data = await response.json();
        // xử lý dữ liệu nếu cần
      } catch (error) {
        console.error('Error fetching tournament details:', error);
      }
    };

    fetchTournamentDetails();
  }, [tournament.id]);

  // Hàm xử lý khi nhấn vào thẻ mùa giải
  const handleClick = () => {
    dispatch(setSelectedTournament(tournament)); // Lưu thông tin mùa giải hiện tại vào Redux
    navigate(`/tournament-detail/${tournament.id}`);
    toast.success('Đã chọn mùa giải thành công!');
  };

  return (
    <div
      key={tournament.id}
      className='w-56 h-85 bg-gray-200 p-4 rounded-md shadow-md flex flex-col items-center'
      onClick={handleClick}
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
