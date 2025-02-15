import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button, Table, Pagination, Modal, DatePicker } from 'antd';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [newMatchTime, setNewMatchTime] = useState(null);

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
        console.log(error);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo lịch thi đấu
  const createSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/schedule/${selectedTournament.TournamentID}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      if (data?.success) {
        toast.success('Lịch thi đấu đã được tạo thành công!');
        fetchSchedule(); // Lấy lại lịch thi đấu sau khi tạo
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (match) => {
    setCurrentMatch(match);
    console.log('match: ' + JSON.stringify(match, null, 2));
    setNewMatchTime(moment(match.date)); // Ensure it’s a moment object
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!newMatchTime) {
      toast.error('Please select a new time for the match');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/schedule/tournament/${selectedTournament.TournamentID}/round/${currentMatch.roundID}/match/${currentMatch.matchID}/update`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: newMatchTime }),
        }
      );

      if (response.ok) {
        toast.success('Match time updated successfully!');
        fetchSchedule(); // Refresh the schedule
        setIsModalVisible(false);
      } else {
        const error = await response.json();
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setNewMatchTime(null); // Reset the new match time
  };

  // Lấy lịch thi đấu khi component mount hoặc selectedTournament thay đổi
  useEffect(() => {
    if (selectedTournament) {
      fetchSchedule();
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
                  onClick={() => handleEditClick(record)}
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

      {/* Modal for editing match */}
      <Modal
        title='Chỉnh sửa thời gian trận đấu'
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
      >
        <DatePicker
          showTime
          value={newMatchTime}
          onChange={(date) => setNewMatchTime(date)}
          format='YYYY-MM-DD HH:mm:ss'
        />
      </Modal>
    </div>
  );
};

export default MatchSchedule;
