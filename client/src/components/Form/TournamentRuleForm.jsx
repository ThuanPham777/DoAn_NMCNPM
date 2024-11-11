import React from 'react';
import { useForm } from 'react-hook-form';

const TournamentRuleForm = () => {
  const user = ''; // Xác định user nếu có

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maxTeams: 20,
      minPlayers: 15,
      maxPlayers: 22,
      maxForeignPlayers: 3,
      maxPlayerAge: 40,
      minPlayerAge: 16,
      pointsPerWin: 3,
      pointsPerLoss: 0,
      pointsPerDraw: 1,
      maxMatchDuration: 96,
      goalTypes: 3,
      priorityOrder: 'Điểm - Hiệu số - Tổng bàn thắng - Đối kháng',
    },
  });

  const handleFormSubmit = (data) => {
    console.log('Submitted data:', data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className='max-w-4xl mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h3 className='text-xl font-semibold mb-4 text-center'>Điều lệ giải</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          <div>
            <label>Số đội tối đa</label>
            <input
              type='number'
              {...register('maxTeams')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.maxTeams && (
              <p className='text-red-500'>{errors.maxTeams.message}</p>
            )}
          </div>

          <div>
            <label>Số cầu thủ tối thiểu</label>
            <input
              type='number'
              {...register('minPlayers')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.minPlayers && (
              <p className='text-red-500'>{errors.minPlayers.message}</p>
            )}
          </div>

          <div>
            <label>Số cầu thủ tối đa</label>
            <input
              type='number'
              {...register('maxPlayers')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.maxPlayers && (
              <p className='text-red-500'>{errors.maxPlayers.message}</p>
            )}
          </div>

          <div>
            <label>Số cầu thủ nước ngoài tối đa</label>
            <input
              type='number'
              {...register('maxForeignPlayers')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.maxForeignPlayers && (
              <p className='text-red-500'>{errors.maxForeignPlayers.message}</p>
            )}
          </div>

          <div>
            <label>Độ tuổi cầu thủ tối đa</label>
            <input
              type='number'
              {...register('maxPlayerAge')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.maxPlayerAge && (
              <p className='text-red-500'>{errors.maxPlayerAge.message}</p>
            )}
          </div>

          <div>
            <label>Độ tuổi cầu thủ tối thiểu</label>
            <input
              type='number'
              {...register('minPlayerAge')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.minPlayerAge && (
              <p className='text-red-500'>{errors.minPlayerAge.message}</p>
            )}
          </div>

          <div>
            <label>Điểm số thắng</label>
            <input
              type='number'
              {...register('pointsPerWin')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.pointsPerWin && (
              <p className='text-red-500'>{errors.pointsPerWin.message}</p>
            )}
          </div>

          <div>
            <label>Điểm số thua</label>
            <input
              type='number'
              {...register('pointsPerLoss')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.pointsPerLoss && (
              <p className='text-red-500'>{errors.pointsPerLoss.message}</p>
            )}
          </div>

          <div>
            <label>Điểm số hòa</label>
            <input
              type='number'
              {...register('pointsPerDraw')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.pointsPerDraw && (
              <p className='text-red-500'>{errors.pointsPerDraw.message}</p>
            )}
          </div>

          <div>
            <label>Thời gian ghi bàn tối đa</label>
            <input
              type='number'
              {...register('maxMatchDuration')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.maxMatchDuration && (
              <p className='text-red-500'>{errors.maxMatchDuration.message}</p>
            )}
          </div>

          <div>
            <label>Số lượng loại bàn thắng</label>
            <input
              type='number'
              {...register('goalTypes')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.goalTypes && (
              <p className='text-red-500'>{errors.goalTypes.message}</p>
            )}
          </div>

          <div>
            <label>Thứ tự ưu tiên</label>
            <input
              type='text'
              {...register('priorityOrder')}
              className='border p-2 w-full rounded-md'
              disabled={!user}
            />
            {errors.priorityOrder && (
              <p className='text-red-500'>{errors.priorityOrder.message}</p>
            )}
          </div>
        </div>

        {user && (
          <div className='flex gap-4 justify-center'>
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200'
            >
              Cập nhật
            </button>
            <button
              type='button'
              onClick={handleReset}
              className='bg-gray-400 text-white p-2 mt-4 rounded-md hover:bg-gray-500 transition duration-200'
            >
              Mặc định
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TournamentRuleForm;
