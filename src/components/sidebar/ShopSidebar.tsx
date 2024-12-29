'use client';

import { useTheme } from 'next-themes';
import { Tooltip } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { RiMenu2Line, RiMenu3Line } from 'react-icons/ri';
import Link from 'next/link';
import { BiSolidShoppingBag } from 'react-icons/bi';
import { FaShop } from 'react-icons/fa6';
import { AiFillProduct } from 'react-icons/ai';
import { IoSettings } from 'react-icons/io5';

import useScreenWidth from '../hooks/useScreenWidth';

import { useShop } from '@/src/context/ShopContext';
import { ThemeSwitch } from '../UI/theme-switch';

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
      icon: <FaShop className="w-6 h-6" />,
      label: 'Shop',
      path: `/vendor-stand/${shopId}`,
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
      icon: <BiSolidShoppingBag className="w-6 h-6" />,
      label: 'Order',
      path: '/order',
    },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } h-full transition-all duration-300 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-zinc-300'} py-4 rounded-tr-lg shadow-lg`}
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

        {collapsed ? (
          <Tooltip
            key="theme"
            className="w-full"
            content="Theme"
            placement="right"
          >
            <button
              className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-400'
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
        )}
      </div>
    </div>
  );
};

export default ShopSidebar;
