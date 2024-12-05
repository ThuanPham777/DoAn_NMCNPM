import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const TournamentRuleForm = () => {
  const user = useSelector((state) => state.user.user);
  const { selectedTournament } = useSelector((state) => state.tournament);

  const [ruleData, setRuleData] = useState(null); // State để lưu dữ liệu quy định từ API

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      MaxTeam: 20,
      MinTeam: 15,
      MaxPlayer: 22,
      MinPlayer: 15,
      MaxForeignPlayer: 3,
      MinAgePlayer: 16,
      MaxAgePlayer: 40,
      WinScore: 3,
      LoseScore: 0,
      DrawScore: 1,
      MaxTimeScore: 96,
      NumberOfTypeScore: 3,
      RankPriorityOrder: 'Điểm - Hiệu số - Tổng bàn thắng - Đối kháng',
    },
  });

  useEffect(() => {
    if (selectedTournament) {
      const fetchRule = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
          );
          if (response.ok) {
            const result = await response.json();
            setRuleData(result.data); // Lưu dữ liệu vào state
          }
        } catch (error) {
          console.error('Error fetching rule:', error);
        }
      };
      fetchRule();
    }
  }, [selectedTournament]);

  // Cập nhật dữ liệu vào form nếu có dữ liệu từ API
  useEffect(() => {
    if (ruleData) {
      reset(ruleData); // Nếu có dữ liệu từ API, cập nhật form với dữ liệu đó
    }
  }, [ruleData, reset]);

  const handleFormSubmit = (data) => {
    const fetchUpdateRule = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}/update`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );
        if (response.ok) {
          console.log('Dữ liệu đã được cập nhật');
        }
      } catch (error) {
        console.error('Error updating rule:', error);
      }
    };
    fetchUpdateRule();
    console.log('Submitted data:', data);
  };

  const handleReset = () => {
    reset();
  };

  const isEditable = user && user.Role === 'Admin';

  return (
    <div className='max-w-4xl mx-auto p-6 shadow-lg rounded-lg bg-white'>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <h3 className='text-xl font-semibold mb-4 text-center'>Điều lệ giải</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
          <div>
            <label>Số đội tối đa</label>
            <input
              type='number'
              {...register('MaxTeam')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MaxTeam && (
              <p className='text-red-500'>{errors.MaxTeam.message}</p>
            )}
          </div>

          <div>
            <label>Số cầu thủ tối thiểu</label>
            <input
              type='number'
              {...register('MinPlayer')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MinPlayer && (
              <p className='text-red-500'>{errors.MinPlayer.message}</p>
            )}
          </div>
          <div>
            <label>Số cầu thủ tối đa</label>
            <input
              type='number'
              {...register('MaxPlayer')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MaxPlayer && (
              <p className='text-red-500'>{errors.MaxPlayer.message}</p>
            )}
          </div>

          <div>
            <label>Số cầu thủ nước ngoài tối đa</label>
            <input
              type='number'
              {...register('MaxForeignPlayer')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MaxForeignPlayer && (
              <p className='text-red-500'>{errors.MaxForeignPlayer.message}</p>
            )}
          </div>

          <div>
            <label>Độ tuổi cầu thủ tối đa</label>
            <input
              type='number'
              {...register('MaxAgePlayer')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MaxAgePlayer && (
              <p className='text-red-500'>{errors.MaxAgePlayer.message}</p>
            )}
          </div>

          <div>
            <label>Độ tuổi cầu thủ tối thiểu</label>
            <input
              type='number'
              {...register('MinAgePlayer')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MinAgePlayer && (
              <p className='text-red-500'>{errors.MinAgePlayer.message}</p>
            )}
          </div>

          <div>
            <label>Điểm số thắng</label>
            <input
              type='number'
              {...register('WinScore')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.WinScore && (
              <p className='text-red-500'>{errors.WinScore.message}</p>
            )}
          </div>

          <div>
            <label>Điểm số thua</label>
            <input
              type='number'
              {...register('LoseScore')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.LoseScore && (
              <p className='text-red-500'>{errors.LoseScore.message}</p>
            )}
          </div>

          <div>
            <label>Điểm số hòa</label>
            <input
              type='number'
              {...register('DrawScore')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.DrawScore && (
              <p className='text-red-500'>{errors.DrawScore.message}</p>
            )}
          </div>

          <div>
            <label>Thời gian ghi bàn tối đa</label>
            <input
              type='number'
              {...register('MaxTimeScore')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.MaxTimeScore && (
              <p className='text-red-500'>{errors.MaxTimeScore.message}</p>
            )}
          </div>

          <div>
            <label>Số lượng loại bàn thắng</label>
            <input
              type='number'
              {...register('NumberOfTypeScore')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.NumberOfTypeScore && (
              <p className='text-red-500'>{errors.NumberOfTypeScore.message}</p>
            )}
          </div>

          <div>
            <label>Thứ tự ưu tiên</label>
            <input
              type='text'
              {...register('RankPriorityOrder')}
              className='border p-2 w-full rounded-md'
              disabled={!isEditable}
            />
            {errors.RankPriorityOrder && (
              <p className='text-red-500'>{errors.RankPriorityOrder.message}</p>
            )}
          </div>
        </div>

        {isEditable && (
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
