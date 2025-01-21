import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TournamentForm from '../components/Form/TournamentForm';
import { useSelector } from 'react-redux';
import RegisterTournamentModal from '../components/Form/RegisterTournamentModal';
import { Spin } from 'antd';
import { toast } from 'react-toastify';

const TournamentDetails = () => {
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [teams, setTeams] = useState([]);
  const [teamsAttendTournaments, setTeamsAttendTournaments] = useState([]);
  const [loading, setLoading] = useState(true); // State để quản lý loading
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { tournament } = location.state || null;

  const fetchMyTeams = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/team/my-teams', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách đội bóng.');
      }
      const result = await response.json();
      setTeams(result.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đội bóng:', error);
    }
  };

  useEffect(() => {
    // Lấy danh sách các đội bóng tham gia các giải đấu
    const fetchTeamsAttendTournaments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/team/teams-attend-tournaments`
        );
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách đ��i bóng tham gia.');
        }
        const result = await response.json();
        console.log('result data', result.data);
        setTeamsAttendTournaments(result.data);
      } catch (error) {
        console.error(
          'L��i khi lấy danh sách đ��i bóng tham gia giải đấu:',
          error
        );
      }
    };
    fetchTeamsAttendTournaments();
  }, []);

  // Tính toán các đội bóng chưa tham gia giải đấu.
  useEffect(() => {
    if (teams.length > 0 && teamsAttendTournaments.length > 0) {
      const teamAttendIDs = teamsAttendTournaments.map((entry) => entry.TeamID); // Lấy tất cả TeamID đã tham gia giải nào đó
      const filtered = teams.filter(
        (team) => !teamAttendIDs.includes(team.TeamID) // Loại bỏ các đội đã tham gia bất kỳ giải đấu nào
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams); // Nếu chưa có đội tham gia, hiển thị tất cả đội
    }
  }, [teams, teamsAttendTournaments]);

  //Lấy dữ liệu đội bóng và đội tham gia giải đấu khi `selectedTournament` thay đổi để liệt kế đội nào chưa tham gia.
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await fetchMyTeams();
        if (selectedTournament?.TournamentID) {
          await fetchTeamAttendTournament(selectedTournament.TournamentID);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedTournament]);

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmRegistration = () => {
    toast.success(
      `Đăng ký tham gia giải đấu ${selectedTournament?.TournamentName} thành công!`
    );
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>Chi tiết giải đấu</h1>
        {user?.Role === 'Manager' && (
          <button
            className='text-white border px-4 py-2 rounded-full outline-none bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={handleRegisterClick}
          >
            Đăng ký các đội tham gia giải
          </button>
        )}
      </div>
      <TournamentForm
        mode='edit'
        initialData={tournament}
      />
      <RegisterTournamentModal
        isOpen={isModalOpen}
        onClose={handleCancelModal}
        onRegister={handleConfirmRegistration}
        teams={filteredTeams}
        selectedTournament={selectedTournament}
        teamsAttendTournaments={teamsAttendTournaments}
      />
    </div>
  );
};

export default TournamentDetails;
