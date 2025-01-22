import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterTournamentModal = ({
  isOpen,
  onClose,
  onRegister,
  teams,
  selectedTournament,
  teamsAttendTournaments,
}) => {
  const user = useSelector((state) => state.user.user);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(false); // Để hiển thị trạng thái đang tải
  const [error, setError] = useState(''); // Để hiển thị lỗi nếu có
  const navigate = useNavigate();

  // Hàm xử lý sự kiện khi người dùng chọn hoặc bỏ chọn đội
  const handleSelectionChange = (e) => {
    const value = parseInt(e.target.value); // Chuyển giá trị về số
    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams.includes(value)) {
        return prevSelectedTeams.filter((teamID) => teamID !== value);
      } else {
        return [...prevSelectedTeams, value];
      }
    });
  };

  // Hàm gửi yêu cầu đăng ký
  const handleRegisterClick = async () => {
    if (selectedTeams.length === 0) {
      setError('Vui lòng chọn ít nhất một đội bóng.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Gọi API gửi dữ liệu đến server
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://localhost:3000/api/team/add-teams-tournament',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            TournamentID: selectedTournament.TournamentID,
            TeamIDs: selectedTeams,
          }),
        }
      );

      const data = await response.json();
      if (data?.message) {
        toast.error(data.message); // Display the violation message from the backend
        return;
      }
      if (data.success) {
        toast.success('Đăng ký đôi bóng thành công');
        onRegister(selectedTeams); // Thực hiện đăng ký thành công, có thể xử lý thêm
        navigate('/team');
        onClose();
      } else {
        setError(data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      setError(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // Nếu modal không mở thì trả về null (không render gì cả)

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h3 className='text-xl font-bold text-center mb-4'>
          Đăng ký tham gia giải đấu {selectedTournament.TournamentName || ''}
        </h3>

        {/* Danh sách các đội đã tham gia giải đấu này và các giải đấu khác */}
        {teamsAttendTournaments && teamsAttendTournaments.length > 0 && (
          <div>
            <h4 className='text-lg mb-4'>Danh sách đội bóng đã đăng ký:</h4>
            <div className='max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2'>
              {teamsAttendTournaments.length > 0 ? (
                teamsAttendTournaments
                  .filter((team) => team.UserID === user.UserID)
                  .map((team) => (
                    <div
                      key={team.TeamID}
                      className='border-b border-gray-200 px-4 py-2'
                    >
                      {team.TeamName}
                    </div>
                  ))
              ) : (
                <p className='text-gray-500'>
                  Không có đội bóng nào đã đăng ký.
                </p>
              )}
            </div>
          </div>
        )}
        {/* Danh sách checkbox để chọn các đội bóng chưa tham gia giải đấu (lưu ý 1 đội chỉ được tham gia một giải đấu duy nhất) */}
        <div className='space-y-2 mb-4'>
          <h4 className='text-lg mb-2'>Danh sách đội bóng chưa đăng ký:</h4>
          {teams.length > 0 &&
            teams.map((team, index) => (
              <label
                key={team.TeamID}
                className='block'
              >
                <input
                  type='checkbox'
                  value={team.TeamID} // Chỉ truyền ID làm value
                  checked={selectedTeams.includes(team.TeamID)} // Kiểm tra dựa trên ID
                  onChange={handleSelectionChange}
                  className='mr-2'
                />
                {team.TeamName} {/* Hiển thị tên đội */}
              </label>
            ))}
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

        <div className='flex justify-between'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
          >
            Đóng
          </button>
          <button
            onClick={handleRegisterClick}
            className={`px-4 py-2 ${
              loading ? 'bg-gray-400' : 'bg-[#56FF61]'
            } text-white rounded-lg hover:bg-[#3eeb4a]`}
            disabled={loading} // Disable nút khi đang gửi yêu cầu
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTournamentModal;
