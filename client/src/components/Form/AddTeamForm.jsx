// AddTeamForm.jsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const AddTeamForm = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [logo, setLogo] = useState(null);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('TeamName', data.teamName);
    formData.append('Stadium', data.stadium);
    formData.append('Coach', data.coach);

    if (logo) {
      formData.append('TeamLogo', logo);
    }

    const token = localStorage.getItem('token');
    //console.log('token', token);

    try {
      const response = await fetch('http://localhost:3000/api/team/add', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'POST',
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

  // Handle logo change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <h2 className='text-center text-lg font-semibold mb-4'>
        Biểu mẫu đăng ký
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className='mb-4'>
          <label className='block'>Tên đội bóng</label>
          <Controller
            name='teamName'
            control={control}
            rules={{ required: 'Tên đội bóng là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.teamName && (
            <p className='text-red-500'>{errors.teamName.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block'>Sân vận động</label>
          <Controller
            name='stadium'
            control={control}
            rules={{ required: 'Sân vận động là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.stadium && (
            <p className='text-red-500'>{errors.stadium.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block'>Huấn luyện viên</label>
          <Controller
            name='coach'
            control={control}
            rules={{ required: 'Huấn luyện viên là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.coach && (
            <p className='text-red-500'>{errors.coach.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block'>Logo</label>
          <input
            type='file'
            onChange={handleLogoChange}
            className='border p-2 w-full rounded-md'
          />
        </div>

        <div className='flex justify-center mt-6'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-200'
          >
            ĐĂNG KÝ
          </button>
          <button
            type='button'
            className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200'
            onClick={() => navigate(-1)}
          >
            HỦY
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTeamForm;
