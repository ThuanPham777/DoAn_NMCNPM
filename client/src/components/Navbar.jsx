import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const user = '';

  return (
    <div className='flex justify-between items-center px-4 py-6 border-b shadow-md'>
      <h1 className='text-2xl font-bold'>GIẢI BÓNG ĐÁ VÔ ĐỊCH QUỐC GIA</h1>
      <Link
        to={user ? '/' : '/login'}
        className='flex items-center gap-1 text-gray-600 hover:text-gray-900'
      >
        {user ? <FiLogOut /> : <FiLogIn />}
        <span>{user ? 'Đăng xuất' : 'Đăng nhập'}</span>
      </Link>
    </div>
  );
};

export default Navbar;
