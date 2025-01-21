import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const AddTeamForm = () => {
  const location = useLocation();
  const { myTeam } = location.state || {}; // Get team data from location state
  const { TeamID } = useParams(); // Get TeamID from URL (used for Update)
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [logo, setLogo] = useState(null);

  // If myTeam exists (for update mode), set form values directly
  useEffect(() => {
    if (myTeam) {
      setValue('teamName', myTeam.TeamName);
      setValue('stadium', myTeam.Stadium);
      setValue('coach', myTeam.Coach);
      setLogo(myTeam.TeamLogo); // Set the logo if available
    }
  }, [myTeam, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('TeamName', data.teamName);
    formData.append('Stadium', data.stadium);
    formData.append('Coach', data.coach);

    // If a new logo is selected, append it to the formData
    if (logo && typeof logo !== 'string') {
      formData.append('TeamLogo', logo);
    }

    const token = localStorage.getItem('token');

    try {
      let response;

      if (TeamID) {
        // If TeamID exists, call API Update
        response = await fetch(
          `http://localhost:3000/api/team/${TeamID}/update`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: 'PUT',
            body: formData,
          }
        );
      } else {
        // If no TeamID, call API Add new team
        response = await fetch('http://localhost:3000/api/team/add', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'POST',
          body: formData,
        });
      }

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
      setLogo(file); // Update the logo with the new selected file
    }
  };

  return (
    <div className='max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <h2 className='text-center text-lg font-semibold mb-4'>
        {TeamID ? 'Cập nhật đội bóng' : 'Biểu mẫu đăng ký'}
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
          {logo && typeof logo === 'string' ? (
            <img
              src={logo}
              alt='Team Logo'
              className='mt-2 w-32 h-32 object-cover'
            />
          ) : logo && typeof logo !== 'string' ? (
            <img
              src={URL.createObjectURL(logo)}
              alt='New Team Logo'
              className='mt-2 w-32 h-32 object-cover'
            />
          ) : null}
        </div>

        <div className='flex justify-center mt-6'>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-200'
          >
            {TeamID ? 'Cập nhật' : 'ĐĂNG KÝ'}
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
