import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Input, Form } from 'antd';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const UpdateMatchResult = ({ matchData }) => {
  const { matchId } = useParams();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Mock data structure, replace with actual data from matchData or API
  const matchInfo = matchData || {
    homeTeam: { name: 'Man City', logo: '/assets/logos/man-city.png' },
    awayTeam: { name: 'Arsenal', logo: '/assets/logos/arsenal.png' },
  };

  // useEffect(() => {
  //   // Mock data structure, replace with actual data

  //   const selectedMatch = selectedTournament?.rounds?.matches.find(
  //     (match) => match.id === matchId
  //   );
  // }, [selectedTournament]);

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // Add functionality to handle form submission
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h1 className='text-xl font-bold mb-6'>Cập nhật kết quả trận đấu</h1>
      <div className='flex flex-col items-center p-6'>
        <div className='flex justify-center items-center gap-12 mb-6'>
          <div className='text-center'>
            <img
              src={matchInfo.homeTeam.logo}
              alt={`${matchInfo.homeTeam.name} logo`}
              className='w-20 h-20 mb-2'
            />
            <h2 className='text-lg font-semibold'>{matchInfo.homeTeam.name}</h2>
            <p className='text-gray-500'>Home</p>
          </div>

          <div className='flex justify-center items-center gap-4'>
            <div></div>
            <div className='text-2xl font-bold'>-</div>
            <div></div>
          </div>

          <div className='text-center'>
            <img
              src={matchInfo.awayTeam.logo}
              alt={`${matchInfo.awayTeam.name} logo`}
              className='w-20 h-20 mb-2'
            />
            <h2 className='text-lg font-semibold'>{matchInfo.awayTeam.name}</h2>
            <p className='text-gray-500'>Away</p>
          </div>
        </div>

        <div className='flex flex-col items-center gap-4'>
          <Button
            onClick={() => showModal('goal')}
            className='bg-purple-600 text-white w-40 rounded-lg'
          >
            Thêm bàn thắng
          </Button>
          <Button
            onClick={() => showModal('card')}
            className='bg-purple-600 text-white w-40 rounded-lg'
          >
            Thêm thẻ
          </Button>
        </div>
      </div>

      <Modal
        title={modalType === 'goal' ? 'Thêm bàn thắng' : 'Thêm thẻ'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key='back'
            onClick={handleCancel}
          >
            Hủy
          </Button>,
          <Button
            key='submit'
            type='primary'
            onClick={handleOk}
          >
            Thêm
          </Button>,
        ]}
      >
        <Form layout='vertical'>
          {modalType === 'goal' && (
            <>
              <Form.Item label='Đội'>
                <Select>
                  <Option value='home'>{matchInfo.homeTeam.name}</Option>
                  <Option value='away'>{matchInfo.awayTeam.name}</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Cầu thủ'>
                <Select placeholder='Chọn cầu thủ'>
                  {/* Replace with actual player names */}
                  <Option value='player1'>Player 1</Option>
                  <Option value='player2'>Player 2</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Loại bàn thắng'>
                <Select placeholder='Chọn loại bàn thắng'>
                  <Option value='normal'>Bình thường</Option>
                  <Option value='penalty'>Phạt đền (penalty)</Option>
                  <Option value='penalty'>Phản lưới nhà</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Thời điểm ghi bàn'>
                <Input placeholder='Phút ghi bàn' />
              </Form.Item>
            </>
          )}

          {modalType === 'card' && (
            <>
              <Form.Item label='Đội'>
                <Select>
                  <Option value='home'>{matchInfo.homeTeam.name}</Option>
                  <Option value='away'>{matchInfo.awayTeam.name}</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Cầu thủ'>
                <Select placeholder='Chọn cầu thủ'>
                  {/* Replace with actual player names */}
                  <Option value='player1'>Player 1</Option>
                  <Option value='player2'>Player 2</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Loại thẻ'>
                <Select placeholder='Chọn loại thẻ'>
                  <Option value='yellow'>Thẻ vàng</Option>
                  <Option value='red'>Thẻ đỏ</Option>
                </Select>
              </Form.Item>
              <Form.Item label='Thời điểm nhận thẻ'>
                <Input placeholder='Phút nhận thẻ' />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateMatchResult;
