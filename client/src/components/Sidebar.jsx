import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { RiCalendarScheduleLine } from 'react-icons/ri';
import { MdOutlinePendingActions } from 'react-icons/md';
import { TbFileReport } from 'react-icons/tb';
import { PiRankingLight } from 'react-icons/pi';
import { CiStar, CiSearch } from 'react-icons/ci';
import { MdOutlineRuleFolder } from 'react-icons/md';
import { IoMdAddCircleOutline } from 'react-icons/io';

const linkData = [
  {
    label: 'Đội bóng',
    link: '/team',
    icon: <HiOutlineUserGroup />,
  },
  {
    label: 'Lịch thi đấu',
    link: '/match-schedule',
    icon: <RiCalendarScheduleLine />,
  },
  {
    label: 'Kết quả vòng đấu',
    link: '/round-result',
    icon: <MdOutlinePendingActions />,
  },
  {
    label: 'Báo cáo giải',
    sublink: [
      {
        label: 'Bảng xếp hạng',
        link: '/rank',
        icon: <PiRankingLight />,
      },
      {
        label: 'Top cầu thủ',
        link: '/top-soccers',
        icon: <CiStar />,
      },
    ],
    icon: <TbFileReport />,
  },
  {
    label: 'Tra cứu cầu thủ',
    link: '/search-soccers',
    icon: <CiSearch />,
  },
  {
    label: 'Điều lệ giải',
    link: '/tournament-rule',
    icon: <MdOutlineRuleFolder />,
  },
];

const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSubLinks = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=' p-4'>
      <div className='w-full mt-16'>
        {/* Home Link */}
        <NavLink
          to='/'
          className='flex items-center gap-2 p-2 mb-4 hover:bg-gray-700 rounded'
          activeClassName='bg-gray-700'
        >
          <GoHome />
          <span>Trang chủ</span>
        </NavLink>

        {/* Link tạo giải đáu */}
        <NavLink
          to='/create-tournament'
          className='flex items-center gap-2 p-2 mb-4 hover:bg-gray-700 rounded'
          activeClassName='bg-gray-700'
        >
          <IoMdAddCircleOutline />
          <span>Tạo giải đấu</span>
        </NavLink>

        {/* Sidebar Categories */}
        <div className='w-full flex flex-col items-start'>
          <h2 className='text-xl font-semibold mb-4'>Hồ sơ mùa giải</h2>
          <ul className='w-full space-y-3'>
            {linkData.map((item, index) => (
              <li key={index}>
                {item.sublink ? (
                  <div>
                    <div
                      onClick={() => toggleSubLinks(index)}
                      className='flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer'
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {openIndex === index && (
                      <ul className='pl-6 mt-2 space-y-2'>
                        {item.sublink.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <NavLink
                              to={subItem.link}
                              className='flex items-center gap-2 p-2 hover:bg-gray-700 rounded'
                              style={({ isActive }) => ({
                                backgroundColor: isActive ? '#4a5568' : '',
                              })}
                            >
                              <span>{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.link}
                    className='flex items-center gap-2 p-2 hover:bg-gray-700 rounded'
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? '#4a5568' : '',
                    })}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
