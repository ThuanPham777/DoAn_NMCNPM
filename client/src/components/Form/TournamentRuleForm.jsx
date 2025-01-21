import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TournamentRuleForm = () => {
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  // Dữ liệu mặc định của điều lệ giải
  const defaultRules = {
    MaxTeam: 20,
    MinTeam: 15,
    MaxPlayer: 22,
    MinPlayer: 15,
    MaxForeignPlayer: 3,
    MinAgePlayer: 16,
    MaxAgePlayer: 40,
    WinScore: 3,
    LoseScore: 0,
    DrawScore: 1,
    MaxTimeScore: 96,
    NumberOfTypeScore: 3,
    RankPriorityOrder: 'Điểm - Hiệu số - Tổng bàn thắng - Đối kháng',
  };

  // Khởi tạo dữ liệu form với defaultRules
  const [formData, setFormData] = useState(defaultRules);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  // Lịch sử các label tương ứng với các trường trong form
  const labelMapping = {
    MaxTeam: 'Số đội tối đa',
    MinTeam: 'Số đội tối thiểu',
    MaxPlayer: 'Số cầu thủ tối đa',
    MinPlayer: 'Số cầu thủ tối thiểu',
    MaxForeignPlayer: 'Số cầu thủ nước ngoài tối đa',
    MinAgePlayer: 'Tuổi cầu thủ tối thiểu',
    MaxAgePlayer: 'Tuổi cầu thủ tối đa',
    WinScore: 'Điểm thắng',
    LoseScore: 'Điểm thua',
    DrawScore: 'Điểm hòa',
    MaxTimeScore: 'Thời gian ghi bàn tối đa',
    NumberOfTypeScore: 'Số loại bàn thắng',
    RankPriorityOrder: 'Thứ tự ưu tiên xếp hạng',
  };

  // Lấy dữ liệu từ API khi TournamentID thay đổi
  useEffect(() => {
    const fetchRule = async () => {
      setLoading(true); // Bắt đầu tải dữ liệu
      try {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
        );

        if (response.ok) {
          const result = await response.json();
          if (result?.data) {
            setFormData(result.data);
          } else {
            setFormData(defaultRules); // Nếu không có dữ liệu, dùng defaultRules
          }
        } else {
          console.error('Failed to fetch rule:', response.status);
          setFormData(defaultRules); // Lỗi khi gọi API, sử dụng defaultRules
        }
      } catch (error) {
        console.error('Error fetching rule:', error);
        setFormData(defaultRules); // Lỗi khi kết nối API, sử dụng defaultRules
      } finally {
        setLoading(false); // Kết thúc quá trình tải dữ liệu
      }
    };

    if (selectedTournament?.TournamentID) {
      fetchRule();
    }
  }, [selectedTournament]);

  // Xử lý thay đổi dữ liệu từ input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý khi người dùng gửi form để cập nhật dữ liệu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = { ...formData };

    try {
      const response = await fetch(
        `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}/update`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formToSend),
        }
      );

      if (response.ok) {
        console.log('Dữ liệu đã được cập nhật thành công');
        alert('Dữ liệu đã được cập nhật');
      } else {
        console.error('Lỗi khi cập nhật dữ liệu');
        alert('Lỗi khi cập nhật dữ liệu');
      }
    } catch (error) {
      console.error('Error updating rule:', error);
      alert('Lỗi khi cập nhật dữ liệu');
    }
  };

  // Xử lý khi người dùng muốn reset dữ liệu về mặc định
  const handleReset = () => {
    setFormData(defaultRules); // Đặt lại dữ liệu về mặc định
  };

  // Kiểm tra quyền admin của người dùng
  const isAdmin = user?.Role === 'Admin';

  // Hiển thị giao diện khi dữ liệu đang được tải
  if (loading) {
    return <div className='text-center'>Đang tải dữ liệu...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit}>
        <h3 className='text-xl font-semibold mb-4 text-center'>Điều lệ giải</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          {formData &&
            Object.keys(formData).map((key) => (
              <div key={key}>
                <label>{labelMapping[key] || key}</label>
                <input
                  type={key === 'RankPriorityOrder' ? 'text' : 'number'}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  disabled={!isAdmin} // Không cho phép chỉnh sửa nếu không phải admin hoặc giải đã bắt đầu
                  className='border p-2 w-full rounded-md'
                />
              </div>
            ))}
        </div>

        {isAdmin && (
          <div className='flex gap-4 justify-center'>
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200'
            >
              Cập nhật
            </button>
            <button
              type='button'
              onClick={handleReset}
              className='bg-gray-400 text-white p-2 mt-4 rounded-md hover:bg-gray-500 transition duration-200'
            >
              Mặc định
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TournamentRuleForm;
