// AddSoccerForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

const AddSoccerForm = ({ player, TeamID }) => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [image, setImage] = useState(null);

  // Populate form fields if editing an existing player
  useEffect(() => {
    if (player) {
      setValue('PlayerName', player.PlayerName);
      setValue(
        'DateOfBirth',
        player.DateOfBirth ? formatDate(player.DateOfBirth) : ''
      );
      setValue('JerseyNumber', player.JerseyNumber);
      setValue('HomeTown', player.HomeTown);
      setValue('PlayerType', player.PlayerType);
    }
  }, [player, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('PlayerName', data.PlayerName);
    formData.append('DateOfBirth', data.DateOfBirth);
    formData.append('JerseyNumber', data.JerseyNumber);
    formData.append('HomeTown', data.HomeTown);
    formData.append('PlayerType', data.PlayerType);

    if (image) {
      formData.append('ProfileImg', image);
    }

    try {
      const url = player
        ? `http://localhost:3000/api/player/team/${TeamID}/edit/${player.PlayerID}` // Edit endpoint
        : `http://localhost:3000/api/player/team/${TeamID}/add`; // Add endpoint

      console.log('url', url);

      const method = player ? 'PUT' : 'POST'; // Use PUT for editing, POST for adding

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        navigate('/');
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className='flex justify-center items-start mt-10'>
      <div className='max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white'>
        <h2 className='text-lg font-semibold mb-4'>
          {player ? 'Chỉnh sửa cầu thủ' : 'Thông tin cầu thủ'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className='mb-4'>
            <label className='block'>Họ và tên</label>
            <Controller
              name='PlayerName'
              control={control}
              rules={{ required: 'Họ và tên là bắt buộc' }}
              render={({ field }) => (
                <input
                  {...field}
                  className='border p-2 w-full rounded-md'
                />
              )}
            />
            {errors.PlayerName && (
              <p className='text-red-500'>{errors.PlayerName.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Ngày sinh</label>
            <Controller
              name='DateOfBirth'
              control={control}
              rules={{ required: 'Ngày sinh là bắt buộc' }}
              render={({ field }) => (
                <input
                  type='date'
                  {...field}
                  className='border p-2 w-full rounded-md'
                />
              )}
            />
            {errors.DateOfBirth && (
              <p className='text-red-500'>{errors.DateOfBirth.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Số áo</label>
            <Controller
              name='JerseyNumber'
              control={control}
              rules={{ required: 'Số áo là bắt buộc' }}
              render={({ field }) => (
                <input
                  type='number'
                  {...field}
                  className='border p-2 w-full rounded-md'
                />
              )}
            />
            {errors.JerseyNumber && (
              <p className='text-red-500'>{errors.JerseyNumber.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Quê quán</label>
            <Controller
              name='HomeTown'
              control={control}
              rules={{ required: 'Quê quán là bắt buộc' }}
              render={({ field }) => (
                <input
                  {...field}
                  className='border p-2 w-full rounded-md'
                />
              )}
            />
            {errors.HomeTown && (
              <p className='text-red-500'>{errors.HomeTown.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Loại cầu thủ</label>
            <Controller
              name='PlayerType'
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className='border p-2 w-full rounded-md'
                >
                  <option value=''>Chọn loại cầu thủ</option>
                  <option>Ngoài nước</option>
                  <option>Trong nước</option>
                </select>
              )}
            />
          </div>

          <div className='mb-4'>
            <label className='block'>Ảnh đại diện</label>
            <input
              type='file'
              onChange={handleImageChange}
              className='border p-2 w-full rounded-md'
            />
          </div>

          <div className='flex justify-center mt-6'>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-200'
            >
              {player ? 'Cập nhật' : 'Đăng ký'}
            </button>
            <button
              type='button'
              className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200'
              onClick={() => navigate(-1)}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSoccerForm;
