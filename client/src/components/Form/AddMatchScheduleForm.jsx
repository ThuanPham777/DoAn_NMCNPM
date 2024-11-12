// AddMatchScheduleForm.js
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const AddMatchScheduleForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    reset(); // Clear the form after submission
  };

  const onCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className='max-w-md mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-4'>
          <label className='block font-semibold'>Vòng</label>
          <Controller
            name='round'
            control={control}
            rules={{ required: 'Vòng là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.round && (
            <p className='text-red-500'>{errors.round.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block font-semibold'>Đội nhà</label>
          <Controller
            name='homeTeam'
            control={control}
            rules={{ required: 'Đội nhà là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.homeTeam && (
            <p className='text-red-500'>{errors.homeTeam.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block font-semibold'>Đội khách</label>
          <Controller
            name='awayTeam'
            control={control}
            rules={{ required: 'Đội khách là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.awayTeam && (
            <p className='text-red-500'>{errors.awayTeam.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block font-semibold'>Địa điểm</label>
          <Controller
            name='location'
            control={control}
            rules={{ required: 'Địa điểm là bắt buộc' }}
            render={({ field }) => (
              <input
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.location && (
            <p className='text-red-500'>{errors.location.message}</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block font-semibold'>Thời gian</label>
          <Controller
            name='date'
            control={control}
            rules={{ required: 'Thời gian là bắt buộc' }}
            render={({ field }) => (
              <input
                type='date'
                {...field}
                className='border p-2 w-full rounded-md'
              />
            )}
          />
          {errors.date && <p className='text-red-500'>{errors.date.message}</p>}
        </div>

        <div className='flex justify-center mt-6'>
          <button
            type='submit'
            className='bg-blue-500 text-white rounded-md p-2 mr-2 hover:bg-blue-600 transition duration-200'
          >
            Thêm đội
          </button>
          <button
            type='button' // Set type to 'button' to avoid form submission
            onClick={onCancel}
            className='bg-[#FF7856] text-white rounded-md p-2 hover:bg-red-600 transition duration-200'
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMatchScheduleForm;
