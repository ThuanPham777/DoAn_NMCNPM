import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const { Search } = Input;

const columns = [
  { title: 'Số áo', dataIndex: 'JerseyNumber', key: 'JerseyNumber' },
  { title: 'Họ và tên', dataIndex: 'PlayerName', key: 'PlayerName' },
  {
    title: 'Ngày sinh',
    dataIndex: 'DateOfBirth',
    key: 'DateOfBirth',
    render: (text) => {
      // Format the DateOfBirth
      const date = new Date(text); // Convert ISO string to Date object
      return date.toLocaleDateString('vi-VN'); // Format to Vietnamese date
    },
  },
  { title: 'Loại cầu thủ', dataIndex: 'PlayerType', key: 'PlayerType' },
  { title: 'Quê quán', dataIndex: 'HomeTown', key: 'HomeTown' },
];

const SearchSoccers = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { selectedTournament } = useSelector((state) => state.tournament);

  // những cầu thủ tham gia giải đấu
  useEffect(() => {
    if (!selectedTournament) {
      toast.warning('Please select a tournament');
      return;
    }

    fetch(
      `http://localhost:3000/api/player/tournament/${selectedTournament.TournamentID}`
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
        setFilteredData(result.data); // Initially show all data
      })
      .catch((error) => console.error('Error loading data:', error));
  }, [selectedTournament]);

  const handleSearch = (value) => {
    const filtered = data.filter((player) =>
      player.PlayerName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-6'>Tra cứu cầu thủ</h1>

      {/* Search bar */}
      <Search
        placeholder='Tìm kiếm cầu thủ...'
        style={{ width: 300, marginBottom: 16 }}
        onSearch={handleSearch}
        allowClear
      />

      {/* Table for displaying players */}
      <Table
        columns={columns}
        dataSource={filteredData.map((player, index) => ({
          key: index,
          JerseyNumber: player.JerseyNumber,
          PlayerName: player.PlayerName,
          DateOfBirth: player.DateOfBirth,
          PlayerType: player.PlayerType,
          HomeTown: player.HomeTown,
        }))}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </div>
  );
};

export default SearchSoccers;
