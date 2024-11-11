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
    const filtered = data.filter((entry) =>
      entry.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-6'>Tra cứu cầu thủ</h1>

      <Search
        placeholder='Search by name'
        enterButton='Search'
        onSearch={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default SearchSoccers;
