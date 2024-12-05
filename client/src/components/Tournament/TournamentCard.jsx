import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setSelectedTournament } from '../../redux/slices/tournamentSlice';

const TournamentCard = ({ tournament, onSelect }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    onSelect(tournament); // Gọi callback function để hiển thị thông tin giải đấu ở modal
    dispatch(setSelectedTournament(tournament)); // Lưu vào Redux và localStorage
    toast.success(`Đã chọn giải đấu ${tournament.TournamentName} thành công!`); // Hiển thị thông báo
    navigate(`/tournament-detail/${tournament.TournamentID}`); // Điều hướng
  };

  return (
    <div
      key={tournament.TournamentID}
      className='w-56 h-85 bg-gray-200 p-4 rounded-md shadow-md flex flex-col items-center cursor-pointer'
      onClick={handleClick}
    >
      <img
        src={`http://localhost:3000/uploads/tournaments/${tournament.TournamentLogo}`}
        alt={tournament.TournamentName}
        className='w-54 h-54 mb-2 object-cover'
      />
      <p className='text-center font-medium'>{tournament.TournamentName}</p>
      <p className='text-center font-medium'>
        {new Date(tournament.StartDate).toLocaleDateString()} -{' '}
        {new Date(tournament.EndDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default TournamentCard;
