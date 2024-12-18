import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TournamentRuleForm = () => {
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [formData, setFormData] = useState({
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
  });

  const [isEditable, setIsEditable] = useState(true); // Trạng thái chỉnh sửa

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

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
        );
        if (response.ok) {
          const result = await response.json();
          if (result.data.length > 0) {
            setFormData(result.data);
          } else {
            console.log('Không có dữ liệu từ API, sử dụng giá trị mặc định');
          }
        }
      } catch (error) {
        console.error('Error fetching rule:', error);
      }
    };

    if (selectedTournament?.TournamentID) {
      fetchRule();
    }
  }, [selectedTournament]);

  useEffect(() => {
    if (selectedTournament?.StartDate) {
      const currentDate = new Date();
      const startDate = new Date(selectedTournament.StartDate);
      if (currentDate >= startDate) {
        setIsEditable(false); // Form không thể chỉnh sửa
      }
    }
  }, [selectedTournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = {
      ...formData,
    };

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
      }
    } catch (error) {
      console.error('Error updating rule:', error);
    }
  };

  const handleReset = () => {
    setFormData({
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
    });
  };

  const isAdmin = user?.Role === 'Admin';

  return (
    <div className='max-w-4xl mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit}>
        <h3 className='text-xl font-semibold mb-4 text-center'>Điều lệ giải</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label>{labelMapping[key] || key}</label>
              <input
                type={key === 'RankPriorityOrder' ? 'text' : 'number'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                disabled={!isEditable || !isAdmin} // Disable nếu không được chỉnh sửa hoặc không phải Admin
                className='border p-2 w-full rounded-md'
              />
            </div>
          ))}
        </div>

        {isEditable && isAdmin && (
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
