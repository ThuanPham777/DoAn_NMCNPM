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
  const [teamAttendTournament, setTeamAttendTournament] = useState([]);
  const [loading, setLoading] = useState(true); // State để quản lý loading
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { tournament } = location.state || null;
  const [rules, setRules] = useState();

  useEffect(() => {
    try {
      const fetchRule = async () => {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch rule');
        }
        const result = await response.json();
        console.log('rules: ', result.data);
        setRules(result.data);
      };

      fetchRule();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

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

  const fetchTeamsAttendTournament = async (TournamentID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/team/tournament/${TournamentID}/teams-attend-tournament`
      );
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách đội bóng tham gia.');
      }
      const result = await response.json();
      setTeamAttendTournament(result.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy đội bóng tham gia giải đấu:', error);
    }
  };

  // Tính toán các đội bóng chưa tham gia giải đấu.
  useEffect(() => {
    if (teams.length > 0 && teamAttendTournament.length > 0) {
      const teamAttendIDs = teamAttendTournament.map((team) => team.TeamID);
      const filtered = teams.filter(
        (team) => !teamAttendIDs.includes(team.TeamID)
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams); // Nếu chưa có đội tham gia thì hiển thị tất cả đội
    }
  }, [teams, teamAttendTournament]);

  //Lấy dữ liệu đội bóng và đội tham gia giải đấu khi `selectedTournament` thay đổi để liệt kế đội nào chưa tham gia.
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await fetchMyTeams();
        if (selectedTournament?.TournamentID) {
          await fetchTeamsAttendTournament(selectedTournament.TournamentID);
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
    if (teamAttendTournament.length === rules.MaxTeam) {
      toast.error(
        `Số đội tối đa đăng ký tham gia giải đấu là ${rules.MaxTeam}`
      );
      return;
    }
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
      />
    </div>
  );
};

export default TournamentDetails;
