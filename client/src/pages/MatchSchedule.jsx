import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const MatchSchedule = () => {
  const user = 'admin';
  const [data, setData] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const navigate = useNavigate();

  // Load data from rounds.json
  useEffect(() => {
    fetch('/assets/data/rounds.json')
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  // Filter matches for the current round
  const currentMatches =
    data.find((round) => round.round === currentRound)?.matches || [];

  // Table columns for match data
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
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) =>
        user && (
          <Button
            onClick={() => navigate(`/update-match-result/${record.id}`)}
            className='text-blue-500 hover:underline'
          >
            View
          </Button>
        ),
    },
  ];

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
            className='border px-4 py-2 rounded-full outline-none bg-[#56FF61]'
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
