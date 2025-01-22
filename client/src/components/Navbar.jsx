import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogout, fetchUserInfo } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await dispatch(fetchLogout()).unwrap();
      navigate('/login'); // Redirect to login after successful logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <div className='flex justify-between items-center px-4 py-6 border-b shadow-md'>
      <h1 className='text-2xl font-bold'>GIẢI BÓNG ĐÁ VÔ ĐỊCH QUỐC GIA</h1>
      <Link
        to={user ? '/' : '/login'}
        className='flex items-center gap-1 text-gray-600 hover:text-gray-900'
        onClick={user ? handleLogout : null} // Gọi handleLogout khi người dùng bấm vào "Đăng xuất"
      >
        {user ? <FiLogOut /> : <FiLogIn />}
        <span>{user ? 'Đăng xuất' : 'Đăng nhập'}</span>
      </Link>
    </div>
  );
};

export default Navbar;
