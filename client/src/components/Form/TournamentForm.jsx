import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TournamentForm = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [image, setImage] = useState(null);

  // Hàm xử lý submit form
  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('TournamentName', data.tournamentName);
    formData.append('StartDate', data.startDate);
    formData.append('EndDate', data.endDate);

    // Nếu có ảnh, thêm vào FormData
    if (image) {
      formData.append('TournamentLogo', image);
    }

    try {
      // Gửi request POST tới API
      const response = await fetch('http://localhost:3000/api/tournament/add', {
        method: 'POST',
        body: formData, // Gửi dữ liệu dưới dạng FormData
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);

        // Sau khi thêm thành công, điều hướng tới trang khác
        navigate('/'); // Hoặc trang bạn muốn chuyển hướng đến
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Hàm xử lý thay đổi ảnh bìa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className='mb-4'>
          <label className='block'>Tên giải đấu</label>
          <Controller
            name='tournamentName'
            control={control}
            rules={{ required: 'Tên giải đấu là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
                disabled={!user} // Nếu không có user thì disabled
              />
            )}
          />
          {errors.tournamentName && (
            <p className='text-red-500'>{errors.tournamentName.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block'>Ngày bắt đầu</label>
          <Controller
            name='startDate'
            control={control}
            rules={{ required: 'Ngày bắt đầu là bắt buộc' }}
            render={({ field }) => (
              <input
                type='date'
                {...field}
                className='border p-2 w-full rounded-md'
                disabled={!user} // Nếu không có user thì disabled
              />
            )}
          />
          {errors.startDate && (
            <p className='text-red-500'>{errors.startDate.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block'>Ngày kết thúc</label>
          <Controller
            name='endDate'
            control={control}
            rules={{ required: 'Ngày kết thúc là bắt buộc' }}
            render={({ field }) => (
              <input
                type='date'
                {...field}
                className='border p-2 w-full rounded-md'
                disabled={!user} // Nếu không có user thì disabled
              />
            )}
          />
          {errors.endDate && (
            <p className='text-red-500'>{errors.endDate.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block'>Ảnh bìa</label>
          <input
            type='file'
            onChange={handleImageChange}
            className='border p-2 w-full rounded-md'
            disabled={!user} // Nếu không có user thì disabled
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt='Tournament'
              className='mt-2 w-32 h-32 object-cover'
            />
          )}
        </div>

        {user && (
          <button
            type='submit'
            className='bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200'
          >
            Cập nhật
          </button>
        )}
      </form>
    </div>
  );
};

export default TournamentForm;
