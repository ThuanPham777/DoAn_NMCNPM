import React from 'react';

const Rank = () => {
  const players = [
    {
      rank: 1,
      name: 'Cristiano Ronaldo',
      team: 'Al-Nasr',
      type: 'Ngoại nước',
      goals: 10,
      avatar: '/assets/img/players/ronaldo.png',
    },
    {
      rank: 2,
      name: 'Neymar',
      team: 'Al-Hilal',
      type: 'Ngoại nước',
      goals: 9,
      avatar: '/assets/img/players/neymar.png',
    },
    {
      rank: 3,
      name: 'Messi',
      team: 'Inter Miami',
      type: 'Ngoại nước',
      goals: 7,
      avatar: '/assets/img/players/messi.png',
    },
    {
      rank: 4,
      name: 'Kevin',
      team: 'MC',
      type: 'Ngoại nước',
      goals: 6,
      avatar: '/assets/img/players/kevin.png',
    },
    {
      rank: 5,
      name: 'Mappe',
      team: 'Real Madrid',
      type: 'Ngoại nước',
      goals: 5,
      avatar: '/assets/img/players/mappe.png',
    },
    {
      rank: 6,
      name: 'Nguyễn Công Phượng',
      team: 'HAGL',
      type: 'Trong nước',
      goals: 5,
      avatar: '/assets/img/players/congphuong.png',
    },
    {
      rank: 7,
      name: 'Đoàn Văn Hậu',
      team: 'HN FC',
      type: 'Trong nước',
      goals: 5,
      avatar: '/assets/img/players/vanhau.png',
    },
    {
      rank: 8,
      name: 'Nguyễn Quang Hải',
      team: 'CAND',
      type: 'Trong nước',
      goals: 5,
      avatar: '/assets/img/players/quanghai.png',
    },
    {
      rank: 9,
      name: 'Đỗ Duy Mạnh',
      team: 'HN FC',
      type: 'Trong nước',
      goals: 5,
      avatar: '/assets/img/players/duymanh.png',
    },
    {
      rank: 10,
      name: 'Bùi Tấn Trường',
      team: 'Hà Tĩnh',
      type: 'Trong nước',
      goals: 5,
      avatar: '/assets/img/players/tantruong.png',
    },
    {
      rank: 11,
      name: 'Lê Công Vinh',
      team: 'Thể Công',
      type: 'Trong nước',
      goals: 5,
      avatar: '/assets/img/players/congvinh.png',
    },
  ];

  return (
    <>
      <h1 className='text-2xl font-bold mb-8'>Top cầu thủ ghi bàn</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse text-sm text-left text-gray-700'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border-b px-4 py-2 font-semibold'>Cầu thủ</th>
              <th className='border-b px-4 py-2 font-semibold'>Đội</th>
              <th className='border-b px-4 py-2 font-semibold'>Loại cầu thủ</th>
              <th className='border-b px-4 py-2 font-semibold'>Số bàn thắng</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.rank}
                className='hover:bg-gray-50'
              >
                <td className='border-b px-4 py-2 flex items-center gap-2'>
                  <span className='font-medium'>{player.rank}</span>
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className='w-8 h-8 rounded-full'
                  />
                  <span>{player.name}</span>
                </td>
                <td className='border-b px-4 py-2'>{player.team}</td>
                <td className='border-b px-4 py-2'>{player.type}</td>
                <td className='border-b px-4 py-2'>{player.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Rank;
