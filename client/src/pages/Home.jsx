import React, { useEffect, useState } from 'react';
import TournamentCard from '../components/Tournament/TournamentCard';
import { toast } from 'react-toastify'; // Import toast từ react-toastify
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RegisterTournamentModal from '../components/Form/RegisterTournamentModal';

const Home = () => {
  const user = useSelector((state) => state.user.user);

  const { selectedTournament } = useSelector((state) => state.tournament);
  const [tournaments, setTournaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State để điều khiển Modal

  const navigate = useNavigate();

  // Gọi API lấy dữ liệu danh sách giải đấu
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tournament');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result.data);
        setTournaments(result.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchTournaments();
  }, []);

  const handleRegisterClick = () => {
    if (!selectedTournament) {
      toast.error('Vui lòng chọn giải đấu trước khi đăng ký!', {});
      return;
    }
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmRegistration = () => {
    toast.success(
      `Đăng ký tham gia giải đấu ${selectedTournament.name} thành công!`
    );
    setIsModalOpen(false);
  };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>Danh sách các giải đấu</h2>
        {/* Kiểm tra xem người dùng có role là 'manager' mới hiển thị nút đăng ký */}
        {user?.Role === 'Manager' && (
          <button
            className='text-white border px-4 py-2 rounded-full outline-none bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={handleRegisterClick}
          >
            Đăng ký tham gia
          </button>
        )}
      </div>

      {/* Modal hiển thị các đội bóng của người dùng */}
      <RegisterTournamentModal
        isOpen={isModalOpen}
        onClose={handleCancelModal}
        onRegister={handleConfirmRegistration}
        teams={user.teams}
        tournamentName={selectedTournament?.name}
      />

      <div className='flex gap-8 flex-wrap'>
        {tournaments.length > 0 &&
          tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.TournamentID}
              tournament={tournament}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
