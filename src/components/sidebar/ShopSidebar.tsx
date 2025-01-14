'use client';

import { useTheme } from 'next-themes';
import { Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { RiMenu2Line, RiMenu3Line } from 'react-icons/ri';
import Link from 'next/link';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { RiCoupon3Fill } from 'react-icons/ri';
import { FaShop } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import { AiFillProduct } from 'react-icons/ai';
import { IoSettings } from 'react-icons/io5';
import { MdOutlineQueryStats } from 'react-icons/md';

import useScreenWidth from '../hooks/useScreenWidth';

import { useShop } from '@/src/context/ShopContext';

const ShopSidebar = () => {
  const { theme } = useTheme();
  const { shopId } = useShop();
  const [collapsed, setCollapsed] = useState(false);
  const [smScreen, setSmScreen] = useState(false);
  const screenWidth = useScreenWidth();

  useEffect(() => {
    if (screenWidth! < 801) {
      setCollapsed(true);
      setSmScreen(true);
    } else {
      setCollapsed(false);
      setSmScreen(false);
    }
  }, [screenWidth]);

  if (screenWidth === null) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    {
      icon: <FaHome className="w-6 h-6" />,
      label: 'Home',
      path: `/`,
    },
    {
      icon: <FaShop className="w-6 h-6" />,
      label: 'Shop',
      path: `/vendor-stand/${shopId}`,
    },
    {
      icon: <MdOutlineQueryStats className="w-6 h-6" />,
      label: 'Overview',
      path: `/shop-dashboard/overview`,
    },
    {
      icon: <IoSettings className="w-6 h-6" />,
      label: 'Shop Settings',
      path: `/shop-dashboard/${shopId}`,
    },
    {
      icon: <AiFillProduct className="w-6 h-6" />,
      label: 'Products',
      path: `/shop-dashboard/products`,
    },
    {
      icon: <RiCoupon3Fill className="w-6 h-6" />,
      label: 'Coupons',
      path: `/shop-dashboard/coupon`,
    },
    {
      icon: <BiSolidShoppingBag className="w-6 h-6" />,
      label: 'Order',
      path: '/order',
    },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } sticky top-0 h-screen transition-all duration-300 py-4 rounded-tr-lg shadow-lg`}
      style={{
        backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
        // fontSize: '2rem', // Custom font size
      }}
    >
      {/* Header */}
      {!smScreen && (
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h1 className="text-xl font-bold">MartPlex</h1>}
          <button
            className={`p-2 rounded-md ${theme === 'dark' ? 'text-white' : 'text-black'} hover:bg-zinc-600`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <RiMenu3Line /> : <RiMenu2Line />}
          </button>
        </div>
      )}

      {/* Menu */}
      <div className="mt-4">
        {menuItems.map((item, index) =>
          collapsed ? (
            <Tooltip
              key={index}
              className="w-full"
              content={item.label}
              placement="right"
            >
              <Link href={item.path}>
                <div
                  className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-400'
                  } rounded-md`}
                >
                  {item.icon}
                </div>
              </Link>
            </Tooltip>
          ) : (
            <Link key={index} href={item.path}>
              <div
                className={`flex flex-row items-center gap-4 p-4 cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-400'
                } rounded-md`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ),
        )}

        {/* {collapsed ? (
          <Tooltip
            key="theme"
            className="w-full"
            content="Theme"
            placement="right"
          >
            <button
              className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
              } rounded-md`}
            >
              <ThemeSwitch />
            </button>
          </Tooltip>
        ) : (
          <div
            key="theme"
            className={`flex flex-row items-center gap-4 p-4 rounded-md w-full`}
          >
            <ThemeSwitch />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ShopSidebar;
