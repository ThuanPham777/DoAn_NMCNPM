import React, { useState, useEffect, useMemo } from 'react';
import { Button, Table } from 'antd';
import { IoFlagOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const MatchSchedule = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [teams, setTeams] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedTournament) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/team/tournament/${selectedTournament.TournamentID}/teams-attend-tournament`
        );
        const result = await response.json();
        const teamMap = result.data.reduce((acc, team) => {
          acc[team.TeamID] = {
            name: team.TeamName,
            stadium: team.Stadium,
          };
          return acc;
        }, {});
        setTeams(teamMap);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedTournament]);

  // Generate schedule
  const schedule = useMemo(() => {
    if (Object.keys(teams).length === 0) return [];

    const teamIds = [...Object.keys(teams)];
    if (teamIds.length % 2 !== 0) teamIds.push(null); // Bye round

    const numRounds = teamIds.length - 1;
    const rounds = [];

    for (let round = 0; round < numRounds; round++) {
      const matches = [];
      const roundDate = dayjs().add(round, 'days').format('YYYY-MM-DD');

      for (let i = 0; i < teamIds.length / 2; i++) {
        const team1 = teamIds[i];
        const team2 = teamIds[teamIds.length - 1 - i];

        if (team1 && team2) {
          matches.push({
            team1: teams[team1]?.name || 'Chưa xác định',
            team2: teams[team2]?.name || 'Chưa xác định',
            location: teams[team1]?.stadium || 'Chưa xác định',
            time: `${roundDate} ${14 + i}:00`,
          });
        }
      }

      rounds.push({ id: round + 1, date: roundDate, matches });
      teamIds.splice(1, 0, teamIds.pop());
    }

    // Generate return matches
    const returnRounds = rounds.map((round, index) => ({
      id: numRounds + index + 1,
      date: dayjs(round.date).add(numRounds, 'days').format('YYYY-MM-DD'),
      matches: round.matches.map((match) => ({
        team1: match.team2,
        team2: match.team1,
        location:
          teams[
            Object.keys(teams).find((key) => teams[key].name === match.team2)
          ]?.stadium || 'Chưa xác định',
        time: `${dayjs(round.date)
          .add(numRounds, 'days')
          .format('YYYY-MM-DD')} ${match.time.split(' ')[1]}`,
      })),
    }));

    return [...rounds, ...returnRounds];
  }, [teams]);

  // Save round schedule to database
  const createRoundSchedule = async (rounds) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/round/${selectedTournament.TournamentID}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            TournamentID: selectedTournament.TournamentID,
            Rounds: rounds.map((round) => ({
              RoundID: round.id,
              TournamentID: selectedTournament.TournamentID,
            })),
          }),
        }
      );
      const result = await response.json();
      console.log('Round creation result:', result);
    } catch (error) {
      console.error('Error creating rounds:', error);
    }
  };

  // Save match data to database
  const createMatchInRound = async (round) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/match/${selectedTournament.TournamentID}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            RoundID: round.id,
            TournamentID: selectedTournament.TournamentID,
            Matches: round.matches.map((match, index) => ({
              MatchID: index + 1,
              Team1ID: Object.keys(teams).find(
                (key) => teams[key].name === match.team1
              ),
              Team2ID: Object.keys(teams).find(
                (key) => teams[key].name === match.team2
              ),
              MatchDate: dayjs(match.time).format('YYYY-MM-DD HH:mm:ss'),
            })),
          }),
        }
      );
      const text = await response.text(); // Get the raw text
      console.log('Raw response:', text); // Log the raw response

      const result = JSON.parse(text); // Try to parse the text as JSON
      console.log('Match creation result:', result);
    } catch (error) {
      console.error('Error creating matches:', error);
    }
  };

  useEffect(() => {
    if (schedule.length > 0 && selectedTournament) {
      const createSchedule = async () => {
        try {
          await createRoundSchedule(schedule);
          await Promise.all(schedule.map((round) => createMatchInRound(round)));
          console.log('Schedule created successfully!');
        } catch (error) {
          console.error('Error creating schedule:', error);
        }
      };

      createSchedule();
    }
  }, [schedule, selectedTournament]);

  const currentMatches =
    schedule.find((round) => round.id === currentRound)?.matches || [];

  const columns = [
    { title: 'Đội 1', dataIndex: 'team1', key: 'team1' },
    { title: 'Đội 2', dataIndex: 'team2', key: 'team2' },
    { title: 'Sân đấu', dataIndex: 'location', key: 'location' },
    { title: 'Thời gian', dataIndex: 'time', key: 'time' },
    ...(user?.Role === 'Admin'
      ? [
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
              <Button
                onClick={() => navigate(`/update-match-result/${record.id}`)}
              >
                View
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold'>Lịch thi đấu</h1>
        {user && (
          <button
            className='text-white border px-4 py-2 rounded-full bg-[#56FF61] hover:bg-[#3eeb4a]'
            onClick={() => navigate('/add-match-schedule')}
          >
            Thêm lịch thi đấu
          </button>
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
        rowKey={(record) => `${record.team1}-${record.team2}`}
        pagination={false}
      />

      {schedule.length > 0 && (
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
        >
          <Button
            onClick={() => setCurrentRound((prev) => Math.max(prev - 1, 1))}
            disabled={currentRound === 1}
          >
            Trang trước
          </Button>
          <Button
            onClick={() =>
              setCurrentRound((prev) => Math.min(prev + 1, schedule.length))
            }
            disabled={currentRound === schedule.length}
            style={{ marginLeft: 8 }}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
};

export default MatchSchedule;
