import React, { useState, useEffect } from 'react';
import { Button, Table, Pagination, message } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const MatchSchedule = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [teams, setTeams] = useState([]);
  const [rules, setRules] = useState();

  useEffect(() => {
    try {
      const fetchRule = async () => {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch rule');
        }
        const result = await response.json();
        console.log('rules: ', result.data);
        setRules(result.data);
      };

      fetchRule();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/team/tournament/${selectedTournament.TournamentID}/teams-attend-tournament`,
        {
          method: 'GET',
        }
      );
      const result = await response.json();
      console.log('Danh sách các đội bóng', result.data);
      setTeams(result.data); // Lưu danh sách đội bóng vào state
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  // Hàm lấy lịch thi đấu từ backend
  const fetchSchedule = async () => {
    if (!selectedTournament) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/schedule/${selectedTournament.TournamentID}`
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Lịch thi đấu đã được cập nhật', result.data);
        setSchedule(result.data);
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to fetch schedule.');
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      message.error('An error occurred while fetching the schedule.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo lịch thi đấu
  const createSchedule = async () => {
    // check rule

    if (rules && teams.length < rules.MinTeam) {
      message.error(
        'Số đội bóng phải ít nhất' + rules.MinTeam + 'để tạo lịch thi đấu.'
      );
      return;
    }

    if (!selectedTournament || !teams.length) return;

    // Tính số vòng đấu cần thiết từ số đội tham gia
    const newRound = teams.length - 1;
    // Kiểm tra xem lịch thi đấu đã đủ vòng đấu chưa
    if (newRound <= schedule.length) {
      message.warning('Lịch thi đấu đã được tạo trước đó!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/schedule/${selectedTournament.TournamentID}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        message.success('Lịch thi đấu đã được tạo thành công!');
        fetchSchedule(); // Lấy lại lịch thi đấu sau khi tạo
      } else {
        const error = await response.json();
        message.error(error.message || 'Failed to create schedule.');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      message.error('An error occurred while creating the schedule.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy lịch thi đấu khi component mount hoặc selectedTournament thay đổi
  useEffect(() => {
    if (selectedTournament) {
      fetchSchedule();
      fetchTeams(); // Fetch teams whenever the selectedTournament changes
    }
  }, [selectedTournament]);

  // Lấy trận đấu của vòng hiện tại
  const currentMatches =
    schedule.find((round) => round.id === currentRound)?.matches || [];

  const columns = [
    { title: 'Đội 1', dataIndex: 'team1Name', key: 'team1Name' },
    { title: 'Đội 2', dataIndex: 'team2Name', key: 'team2Name' },
    { title: 'Sân đấu', dataIndex: 'stadium', key: 'stadium' },
    { title: 'Thời gian', dataIndex: 'date', key: 'date' },
    ...(user?.Role === 'Admin'
      ? [
          {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  onClick={() =>
                    navigate(`/update-match-result/${record.matchID}`, {
                      state: { match: record, RoundID: record.roundID },
                    })
                  }
                >
                  Cập nhật kết quả
                </Button>
                <Button
                  onClick={() => navigate(`/edit-match/${record.matchID}`)}
                  type='primary'
                >
                  Chỉnh sửa
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  if (!selectedTournament) {
    toast.warning('Please select a tournament');
    return;
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>Lịch thi đấu</h1>
        {user?.Role === 'Admin' && (
          <Button
            className='text-white border px-4 py-2 rounded-full bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={createSchedule}
            loading={loading}
          >
            Tạo lịch thi đấu
          </Button>
        )}
      </div>

      <h1 className='text-xl font-semibold'>Vòng {currentRound}</h1>
      <IoFlagOutline
        size={48}
        className='mx-auto mb-8'
      />

      <Table
        columns={columns}
        dataSource={currentMatches}
        rowKey={(record) => record.id} // Dùng MatchID làm key
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'Không có trận đấu nào trong vòng này.' }}
      />

      {schedule.length > 0 && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
        >
          <Pagination
            current={currentRound}
            total={schedule.length}
            onChange={(page) => setCurrentRound(page)}
            pageSize={1} // Chỉ cho phép chuyển qua lại giữa các vòng đấu
          />
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;
