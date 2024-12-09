import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TournamentForm = ({ mode = 'create', initialData = null }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue, // Để thiết lập giá trị mặc định khi chỉnh sửa
  } = useForm();

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setValue('tournamentName', initialData.TournamentName);

      // Chuyển đổi ngày tháng về định dạng YYYY-MM-DD
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      setValue('startDate', formatDate(initialData.StartDate));
      setValue('endDate', formatDate(initialData.EndDate));

      if (initialData.TournamentLogo) {
        setImage(
          `http://localhost:3000/uploads/tournaments/${initialData.TournamentLogo}`
        );
      }
    }
  }, [mode, initialData, setValue]);

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append('TournamentName', data.tournamentName);
    formData.append('StartDate', data.startDate);
    formData.append('EndDate', data.endDate);

    if (image) {
      formData.append('TournamentLogo', image);
    }

    try {
      const url =
        mode === 'create'
          ? 'http://localhost:3000/api/tournament/add'
          : `http://localhost:3000/api/tournament/udpate/${initialData?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        //console.log('API Response:', responseData);

        navigate('/'); // Chuyển hướng sau khi thành công
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const isEdit = user?.Role === 'Admin';

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
                disabled={!isEdit}
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
                disabled={!isEdit}
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
                disabled={!isEdit}
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
            disabled={!isEdit}
          />
          {image && (
            <img
              src={
                typeof image === 'string'
                  ? image // Hiển thị URL từ server nếu image là chuỗi
                  : URL.createObjectURL(image) // Hiển thị ảnh tạm thời nếu image là file
              }
              alt='Tournament Logo'
              className='mt-2 w-32 h-32 object-cover'
            />
          )}
        </div>

        {isEdit && (
          <button
            type='submit'
            className='bg-blue-500 text-white p-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200'
          >
            {mode === 'create' ? 'Đăng ký' : 'Cập nhật'}
          </button>
        )}
      </form>
    </div>
  );
};

export default TournamentForm;
