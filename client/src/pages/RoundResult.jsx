import React, { useState, useEffect } from 'react';
import { Button, Table, Pagination, message } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const RoundResult = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [rounds, setRounds] = useState([]); // Danh sách các vòng đấu
  const [loading, setLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(1); // Vòng hiện tại

  // Fetch kết quả các vòng từ backend
  const fetchRoundResults = async () => {
    if (!selectedTournament) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/round/${selectedTournament.TournamentID}/result`
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Kết quả các vòng đấu:', result.data);
        setRounds(result.data || []);
      } else {
        const error = await response.json();
        message.error(error.message || 'Không thể tải kết quả các vòng.');
      }
    } catch (error) {
      console.error('Lỗi khi tải kết quả các vòng:', error);
      message.error('Đã xảy ra lỗi khi tải kết quả.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy kết quả các vòng khi component mount hoặc selectedTournament thay đổi
  useEffect(() => {
    if (selectedTournament) {
      fetchRoundResults();
    }
  }, [selectedTournament]);

  // Lấy danh sách trận đấu thuộc vòng hiện tại
  const currentMatches =
    rounds.find((round) => round.id === currentRound)?.matches || [];

  // Cột dữ liệu trong bảng
  const columns = [
    {
      title: 'Đội 1',
      dataIndex: 'team1Name',
      key: 'team1Name',
    },
    {
      title: 'Đội 2',
      dataIndex: 'team2Name',
      key: 'team2Name',
    },
    {
      title: 'Sân đấu',
      dataIndex: 'stadium',
      key: 'stadium',
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
      render: (_, record) => {
        // Get the current time and match time
        const currentTime = new Date();
        const matchTime = new Date(record.date);

        // If the match is in the future, show ?-?
        if (matchTime > currentTime) {
          return `?-?`;
        }

        // Otherwise, show the actual score
        return `${record.homeScore ?? '-'} - ${record.awayScore ?? '-'}`;
      },
    },
  ];

  // Sự kiện khi nhấn vào một hàng trong bảng
  const onRowClick = (record) => {
    if (!record.matchID) return;
    navigate(`/update-match-result/${record.matchID}`, {
      state: { match: record, RoundID: record.roundID },
    });
  };

  // Sự kiện chuyển vòng đấu
  const handleRoundChange = (page) => {
    setCurrentRound(page);
  };

  if (!selectedTournament) {
    toast.warning('Please select a tournament');
    return;
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-8'>Kết quả các vòng đấu</h1>
      <IoFlagOutline
        size={48}
        className='mx-auto mb-8'
      />
      <h2 className='text-xl font-bold mb-4'>Vòng {currentRound}</h2>
      <Table
        columns={columns}
        dataSource={currentMatches}
        rowKey={(record) => record.matchID} // Sử dụng matchID làm key
        pagination={false}
        loading={loading}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
        locale={{ emptyText: 'Không có trận đấu nào trong vòng này.' }}
      />
      {rounds.length > 0 && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
        >
          <Pagination
            current={currentRound}
            total={rounds.length}
            pageSize={1} // Mỗi trang tương ứng với một vòng đấu
            onChange={handleRoundChange}
          />
        </div>
      )}
    </div>
  );
};

export default RoundResult;
