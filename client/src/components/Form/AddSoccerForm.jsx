import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddSoccerForm = ({ player, TeamID }) => {
  const [rules, setRules] = useState();
  const { selectedTournament } = useSelector((state) => state.tournament);
  const [players, setPlayers] = useState();
  const [theNumberOfForeignPlayers, setTheNumberOfForeignPlayers] = useState(0); // Track foreign players

  console.log('players', players);

  useEffect(() => {
    const fetchAllPlayersOfTeam = async () => {
      try {
        // Fetching data using fetch API
        const response = await fetch(
          `http://localhost:3000/api/player/team/${TeamID}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        const result = await response.json();
        setPlayers(result.data); // Lưu dữ liệu vào state myTeams
        console.log('myTeams: ' + result.data);
      } catch (error) {
        console.error('Error fetching MyTeams:', error);
      }
    };

    fetchAllPlayersOfTeam();
  }, []);

  console.log('theNumberOfForeignPlayers', theNumberOfForeignPlayers);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/rule/tournament/${selectedTournament.TournamentID}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch rule');
        }
        const result = await response.json();
        console.log('rules: ', result?.data);
        setRules(result?.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchRule();
  }, [selectedTournament]);

  const navigate = useNavigate();

  useEffect(() => {
    if (players && Array.isArray(players)) {
      const countForeignPlayers = players.reduce((total, player) => {
        return player.PlayerType === 'Ngoài nước' ? total + 1 : total;
      }, 0);
      setTheNumberOfForeignPlayers(countForeignPlayers);
    }
  }, [players]);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();
  const [image, setImage] = useState(null);

  // Populate form fields if editing an existing player
  useEffect(() => {
    if (player) {
      setValue('PlayerName', player.PlayerName);
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setValue('DateOfBirth', formatDate(player.DateOfBirth));
      setValue('JerseyNumber', player.JerseyNumber);
      setValue('HomeTown', player.HomeTown);
      setValue('PlayerType', player.PlayerType);
      if (player.ProfileImg) {
        setImage(player.ProfileImg);
      }
    }
  }, [player, setValue]);

  // Handle form submission
  const handleFormSubmit = async (data) => {
    if (
      data.PlayerType === 'Ngoài nước' &&
      theNumberOfForeignPlayers >= (rules?.MaxForeignPlayer || 0)
    ) {
      toast.error(
        `Số lượng cầu thủ ngoài nước không được vượt quá ${rules?.MaxForeignPlayer}`
      );
      return;
    }
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
        ? `http://localhost:3000/api/player/team/${TeamID}/edit/${player.PlayerID}`
        : `http://localhost:3000/api/player/team/${TeamID}/add`;

      const method = player ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        // Nếu có thông báo lỗi từ server (trigger hoặc lỗi khác)
        if (responseData.message) {
          alert(responseData.message); // Hiển thị thông báo lỗi từ backend lên UI
        } else {
          navigate('/'); // Navigate after successful form submission
        }
        navigate('/'); // Navigate after successful form submission
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

  // Validate DateOfBirth for age range
  const validateAge = (value) => {
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (rules) {
      if (age < rules.MinAgePlayer) {
        setError('DateOfBirth', {
          type: 'manual',
          message: `Tuổi không được nhỏ hơn ${rules.MinAgePlayer}`,
        });
        toast.error(`Tuổi không được nhỏ hơn ${rules.MinAgePlayer}`); // Toast lỗi tuổi
        return false;
      }
      if (age > rules.MaxAgePlayer) {
        setError('DateOfBirth', {
          type: 'manual',
          message: `Tuổi không được lớn hơn ${rules.MaxAgePlayer}`,
        });
        toast.error(`Tuổi không được lớn hơn ${rules.MaxAgePlayer}`); // Toast lỗi tuổi
        return false;
      }
    }
    return true;
  };

  return (
    <div className='flex justify-center items-start mt-10'>
      <div className='max-w-lg mx-auto p-6 shadow-lg rounded-lg bg-white'>
        <h2 className='text-lg font-semibold mb-4'>
          {player ? 'Chỉnh sửa cầu thủ' : 'Thông tin cầu thủ'}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Player Name */}
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

          {/* Date of Birth */}
          <div className='mb-4'>
            <label className='block'>Ngày sinh</label>
            <Controller
              name='DateOfBirth'
              control={control}
              rules={{
                required: 'Ngày sinh là bắt buộc',
                validate: validateAge, // Validate age here
              }}
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

          {/* Jersey Number */}
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

          {/* HomeTown */}
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

          {/* Player Type */}
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

          {/* Profile Image */}
          <div className='mb-4'>
            <label className='block'>Ảnh đại diện</label>
            <input
              type='file'
              onChange={handleImageChange}
              className='border p-2 w-full rounded-md'
            />
            {image && (
              <img
                src={
                  typeof image === 'string'
                    ? `http://localhost:3000/uploads/players/${image}`
                    : URL.createObjectURL(image)
                }
                alt='Player'
                className='mt-2 w-32 h-32 object-cover'
              />
            )}
          </div>

          {/* Submit and Cancel buttons */}
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
