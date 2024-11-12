// AddSoccerForm.jsx
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils';

const AddSoccerForm = ({ player }) => {
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
      setValue('fullName', player.fullName);
      setValue(
        'dateOfBirth',
        player.dateOfBirth ? formatDate(player.dateOfBirth) : ''
      );
      setValue('jerseyNumber', player.jerseyNumber);
      setValue('hometown', player.hometown);
      setValue('playerType', player.playerType);
    }
  }, [player, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('jerseyNumber', data.jerseyNumber);
    formData.append('hometown', data.hometown);
    formData.append('playerType', data.playerType);

    if (image) {
      formData.append('image', image);
    }

    try {
      const url = player
        ? `https://your-backend-api-url.com/soccer/${player.id}` // Edit endpoint
        : 'https://your-backend-api-url.com/soccer'; // Add endpoint

      const method = player ? 'PUT' : 'POST'; // Use PUT for editing, POST for adding

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        navigate('/home');
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
              name='fullName'
              control={control}
              rules={{ required: 'Họ và tên là bắt buộc' }}
              render={({ field }) => (
                <input
                  {...field}
                  className='border p-2 w-full rounded-md'
                />
              )}
            />
            {errors.fullName && (
              <p className='text-red-500'>{errors.fullName.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Ngày sinh</label>
            <Controller
              name='dateOfBirth'
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
            {errors.dateOfBirth && (
              <p className='text-red-500'>{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Số áo</label>
            <Controller
              name='jerseyNumber'
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
            {errors.jerseyNumber && (
              <p className='text-red-500'>{errors.jerseyNumber.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Quê quán</label>
            <Controller
              name='hometown'
              control={control}
              rules={{ required: 'Quê quán là bắt buộc' }}
              render={({ field }) => (
                <input
                  {...field}
                  className='border p-2 w-full rounded-md'
                />
              )}
            />
            {errors.hometown && (
              <p className='text-red-500'>{errors.hometown.message}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block'>Loại cầu thủ</label>
            <Controller
              name='playerType'
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
