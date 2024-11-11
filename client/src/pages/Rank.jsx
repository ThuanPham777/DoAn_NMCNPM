import React from 'react';

const Rank = () => {
  const teams = [
    {
      rank: 1,
      logo: '/assets/img/teams/picture01.png',
      team: 'Liverpool',
      played: 11,
      wins: 9,
      draws: 1,
      losses: 1,
      goalsFor: 21,
      goalsAgainst: 6,
      goalDifference: 15,
      points: 28,
    },
    {
      rank: 2,
      logo: './',
      team: 'Man City',
      played: 11,
      wins: 7,
      draws: 2,
      losses: 2,
      goalsFor: 22,
      goalsAgainst: 13,
      goalDifference: 9,
      points: 23,
    },
    {
      rank: 3,
      logo: './',
      team: 'Chelsea',
      played: 11,
      wins: 5,
      draws: 4,
      losses: 2,
      goalsFor: 21,
      goalsAgainst: 8,
      goalDifference: 13,
      points: 19,
    },
    {
      rank: 4,
      logo: './',
      team: 'Arsenal',
      played: 11,
      wins: 5,
      draws: 4,
      losses: 2,
      goalsFor: 18,
      goalsAgainst: 12,
      goalDifference: 6,
      points: 19,
    },
    {
      rank: 5,
      logo: './',
      team: 'Nottm Forest',
      played: 11,
      wins: 5,
      draws: 4,
      losses: 2,
      goalsFor: 15,
      goalsAgainst: 10,
      goalDifference: 5,
      points: 19,
    },
    {
      rank: 6,
      logo: './',
      team: 'Brighton',
      played: 11,
      wins: 5,
      draws: 4,
      losses: 2,
      goalsFor: 19,
      goalsAgainst: 15,
      goalDifference: 4,
      points: 19,
    },
    {
      rank: 7,
      logo: './',
      team: 'Fulham',
      played: 11,
      wins: 5,
      draws: 3,
      losses: 3,
      goalsFor: 16,
      goalsAgainst: 13,
      goalDifference: 3,
      points: 18,
    },
    {
      rank: 8,
      logo: './',
      team: 'Newcastle',
      played: 11,
      wins: 5,
      draws: 3,
      losses: 3,
      goalsFor: 13,
      goalsAgainst: 11,
      goalDifference: 2,
      points: 18,
    },
    {
      rank: 9,
      logo: './',
      team: 'Aston Villa',
      played: 11,
      wins: 4,
      draws: 3,
      losses: 4,
      goalsFor: 17,
      goalsAgainst: 10,
      goalDifference: 7,
      points: 16,
    },
    {
      rank: 10,
      logo: './',
      team: 'Tottenham',
      played: 11,
      wins: 5,
      draws: 1,
      losses: 5,
      goalsFor: 23,
      goalsAgainst: 13,
      goalDifference: 10,
      points: 16,
    },
  ];

  return (
    <>
      <h1 className='text-2xl font-bold mb-8'>Bảng xếp hạng</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse text-sm text-left text-gray-700'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border-b px-4 py-2 font-semibold'>Câu lạc bộ</th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                ĐĐ
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                Thắng
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                H
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                Thua
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                BT
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                SBT
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                HS
              </th>
              <th className='border-b px-4 py-2 font-semibold text-center'>
                Đ
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr
                key={index}
                className='hover:bg-gray-50'
              >
                <td className='border-b px-4 py-2 flex items-center gap-2'>
                  <span className='font-medium'>{team.rank}</span>
                  <span>
                    <img
                      src={team.logo}
                      alt=''
                      className='w-8 h-8 '
                    />
                  </span>
                  <span>{team.team}</span>
                </td>
                <td className='border-b px-4 py-2 text-center'>
                  {team.played}
                </td>
                <td className='border-b px-4 py-2 text-center'>{team.wins}</td>
                <td className='border-b px-4 py-2 text-center'>{team.draws}</td>
                <td className='border-b px-4 py-2 text-center'>
                  {team.losses}
                </td>
                <td className='border-b px-4 py-2 text-center'>
                  {team.goalsFor}
                </td>
                <td className='border-b px-4 py-2 text-center'>
                  {team.goalsAgainst}
                </td>
                <td className='border-b px-4 py-2 text-center'>
                  {team.goalDifference}
                </td>
                <td className='border-b px-4 py-2 text-center font-bold'>
                  {team.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Rank;
