import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoundResult = () => {
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [data, setData] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTournament && selectedTournament.rounds) {
      setData(selectedTournament.rounds);
    }
  }, [selectedTournament]); // Chạy lại khi selectedTournament thay đổi

  // Filter matches for the current round
  const currentMatches =
    data.find((round) => parseInt(round.id) === currentRound)?.matches || [];

  console.log('data: ', currentMatches);

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

  // Row click handler to navigate to MatchResult
  const onRowClick = (record) => {
    navigate(`/match-result-detail/${record.id}`);
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
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
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
