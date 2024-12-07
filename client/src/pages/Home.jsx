import React, { useEffect, useState } from 'react';
import TournamentCard from '../components/Tournament/TournamentCard';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import RegisterTournamentModal from '../components/Form/RegisterTournamentModal';

const Home = () => {
  // const user = useSelector((state) => state.user.user);
  // const [selectedTournament, setSelectedTournament] = useState(null); // Không có giải đấu nào được chọn ban đầu
  const [tournaments, setTournaments] = useState([]);
  // const [teams, setTeams] = useState([]);
  // const [teamAttendTournament, setTeamAttendTournament] = useState([]);
  // const [filteredTeams, setFilteredTeams] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const fetchTeamsAttendTournament = async (tournamentID) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/team/tournament/${tournamentID}/teams-attend-tournament`
  //     );
  //     const result = await response.json();
  //     setTeamAttendTournament(result.data);
  //   } catch (error) {
  //     console.error('Error fetching teams:', error);
  //   }
  // };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/tournament');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setTournaments(result.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    // const fetchMyTeams = async () => {
    //   const token = localStorage.getItem('token');
    //   try {
    //     const response = await fetch(
    //       'http://localhost:3000/api/team/my-teams',
    //       {
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     );
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     const result = await response.json();
    //     setTeams(result.data);
    //   } catch (error) {
    //     console.error('Error fetching MyTeams:', error);
    //   }
    // };

    fetchTournaments();
    //fetchMyTeams();
  }, []);

  // useEffect(() => {
  //   if (!selectedTournament) return;

  //   // Fetch teams attending the tournament khi có giải đấu được chọn
  //   fetchTeamsAttendTournament(selectedTournament.TournamentID);
  // }, [selectedTournament]);

  // useEffect(() => {
  //   if (
  //     !selectedTournament ||
  //     teams.length === 0 ||
  //     teamAttendTournament.length === 0
  //   )
  //     return;

  //   const teamAttendIDs = teamAttendTournament.map((team) => team.TeamID);
  //   const filtered = teams.filter(
  //     (team) => !teamAttendIDs.includes(team.TeamID)
  //   );
  //   setFilteredTeams(filtered);
  // }, [selectedTournament, teams, teamAttendTournament]);

  // const handleRegisterClick = () => {
  //   if (!selectedTournament) {
  //     toast.error('Vui lòng chọn giải đấu trước khi đăng ký!');
  //     return;
  //   }
  //   setIsModalOpen(true);
  // };

  // const handleCancelModal = () => {
  //   setIsModalOpen(false);
  // };

  // const handleConfirmRegistration = () => {
  //   toast.success(
  //     `Đăng ký tham gia giải đấu ${selectedTournament.TournamentName} thành công!`
  //   );
  //   setIsModalOpen(false);
  // };

  // const handleTournamentSelect = (tournament) => {
  //   setSelectedTournament(tournament); // Cập nhật giải đấu được chọn
  // };

  return (
    <div className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>Danh sách các giải đấu</h2>
        {/* {user?.Role === 'Manager' && (
          <button
            className='text-white border px-4 py-2 rounded-full outline-none bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={handleRegisterClick}
          >
            Đăng ký tham gia
          </button>
        )} */}
      </div>

      {/* <RegisterTournamentModal
        isOpen={isModalOpen}
        onClose={handleCancelModal}
        onRegister={handleConfirmRegistration}
        teams={filteredTeams}
        selectedTournament={selectedTournament}
      /> */}

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
