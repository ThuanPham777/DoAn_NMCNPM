import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';

const RoundResult = () => {
  const [data, setData] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);

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
      title: 'Tỷ số',
      dataIndex: 'score',
      key: 'score',
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
      <h1 className='text-2xl font-semibold mb-8'>Vòng {currentRound}</h1>
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

export default RoundResult;
