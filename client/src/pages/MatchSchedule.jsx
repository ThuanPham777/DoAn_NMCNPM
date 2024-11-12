import React, { useState, useEffect } from 'react';
import { Button, Table, Spin } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MatchSchedule = () => {
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [data, setData] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTournament && selectedTournament.rounds) {
      setData(selectedTournament.rounds);
    }
  }, [selectedTournament]); // Chạy lại khi selectedTournament thay đổi

  // Show a loading spinner if selectedTournament is not yet available
  if (!selectedTournament) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  // Filter matches for the current round
  const currentMatches =
    data.find((round) => parseInt(round.id) === currentRound)?.matches || [];

  // Table columns for match data, adding time column
  const columns = [
    {
      title: 'Đội 1',
      dataIndex: 'team1',
      key: 'team1',
    },
    {
      title: 'Đội 2',
      dataIndex: 'team2',
      key: 'team2',
    },
    {
      title: 'Sân đấu',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Thời gian', // Cột thời gian mới
      key: 'time',
      render: (_, record) => {
        const date = record.date; // Giả sử ngày là thuộc tính 'date'
        const time = record.time; // Giả sử giờ là thuộc tính 'time'
        // Format ngày và giờ thành chuỗi 'DD/MM/YYYY HHhMM'
        const formattedDateTime = `${date} ${time}`;
        return formattedDateTime;
      },
    },
  ];

  // Add action column if user is logged in
  const user = 'admin'; // Add actual user logic here
  if (user) {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => navigate(`/update-match-result/${record.id}`)}
          className='text-blue-500 hover:underline'
        >
          View
        </Button>
      ),
    });
  }

  // Handle pagination
  const handleNext = () => {
    if (currentRound < data.length) setCurrentRound(currentRound + 1);
  };

  const handlePrevious = () => {
    if (currentRound > 1) setCurrentRound(currentRound - 1);
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold mb-8'>Lịch thi đấu</h1>
        {user && (
          <button
            className='text-white border px-4 py-2 rounded-full outline-none bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={() => navigate('/add-match-schedule')}
          >
            Thêm lịch thi đấu
          </button>
        )}
      </div>

      <h1 className='text-xl font-semibold mb-8'>Vòng {currentRound}</h1>
      <IoFlagOutline
        size={48}
        className='mx-auto mb-8'
      />

      <Table
        columns={columns}
        dataSource={currentMatches}
        rowKey='id'
        pagination={false}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Button
          onClick={handlePrevious}
          disabled={currentRound === 1}
        >
          Trang trước
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentRound === data.length}
          style={{ marginLeft: 8 }}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default MatchSchedule;
