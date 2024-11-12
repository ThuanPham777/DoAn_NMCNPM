import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';

const { Search } = Input;

const columns = [
  { title: 'Số áo', dataIndex: 'jerseyNumber', key: 'jerseyNumber' },
  { title: 'Họ và tên', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Ngày sinh', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
  { title: 'Loại cầu thủ', dataIndex: 'playerType', key: 'playerType' },
  { title: 'Quê quán', dataIndex: 'hometown', key: 'hometown' },
];

const SearchSoccers = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch('/assets/data/soccers.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setFilteredData(jsonData); // Initially show all data
      })
      .catch((error) => console.error('Error loading data:', error));
  }, []);

  const handleSearch = (value) => {
    const filtered = data.filter((player) =>
      player.fullName.toLowerCase().includes(value.toLowerCase())
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
          jerseyNumber: player.jerseyNumber,
          fullName: player.fullName,
          dateOfBirth: player.dateOfBirth,
          playerType: player.playerType,
          hometown: player.hometown,
        }))}
        pagination={{ pageSize: 5, showSizeChanger: true }}
      />
    </div>
  );
};

export default SearchSoccers;
