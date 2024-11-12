import React, { useState } from 'react';

const RegisterTournamentModal = ({
  isOpen,
  onClose,
  onRegister,
  teams,
  tournamentName,
}) => {
  // State để lưu danh sách các đội được chọn
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(false); // Để hiển thị trạng thái đang tải
  const [error, setError] = useState(''); // Để hiển thị lỗi nếu có

  // Hàm xử lý sự kiện khi người dùng chọn hoặc bỏ chọn đội
  const handleSelectionChange = (e) => {
    const value = e.target.value;
    setSelectedTeams((prevSelectedTeams) => {
      if (prevSelectedTeams.includes(value)) {
        return prevSelectedTeams.filter((team) => team !== value);
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
      const response = await fetch('/api/register-tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentName,
          selectedTeams,
        }),
      });

      if (!response.ok) {
        throw new Error('Đăng ký giải đấu không thành công');
      }

      const data = await response.json();
      if (data.success) {
        alert('Đăng ký tham gia giải đấu thành công!');
        onRegister(selectedTeams); // Thực hiện đăng ký thành công, có thể xử lý thêm
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
          Đăng ký tham gia giải đấu {tournamentName || ''}
        </h3>
        <h4 className='text-lg mb-2'>Danh sách đội bóng của bạn:</h4>

        {/* Danh sách checkbox để chọn các đội bóng */}
        <div className='space-y-2 mb-4'>
          {teams.map((team, index) => (
            <label
              key={index}
              className='block'
            >
              <input
                type='checkbox'
                value={team}
                checked={selectedTeams.includes(team)}
                onChange={handleSelectionChange}
                className='mr-2'
              />
              {team}
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
