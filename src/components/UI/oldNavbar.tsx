'use client';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Badge,
  Avatar,
} from '@nextui-org/react';
import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { SlMenu } from 'react-icons/sl';
import { IoIosArrowDown } from 'react-icons/io';
import NextLink from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useUser } from '@/src/context/user.provider';
import { useFetchCart } from '@/src/hooks/cart.hooks';

export const Navbar = () => {
  const [cartLength, setCartLength] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { user } = useUser();

  const avatarUrl =
    user?.profilePhoto || 'https://i.ibb.co/wcv1QBQ/5951752.png';
  const profileId = user?.id;

  const { data: cartData } = useFetchCart(profileId || '');
  const cart = cartData?.data?.cartInfo;

  useEffect(() => {
    if (cart) {
      setCartLength(cart.items.length);
    }
  }, [cart]);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleCategoryClick = (category: any) => {
    window.location.href = `/product?category=${encodeURIComponent(category)}`;
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/product?searchTerm=${encodeURIComponent(
        searchTerm
      )}`;
    }
  };

  const handleSearchKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch();
    }
  };

  const megaMenu = (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="font-bold"
          size="sm"
          style={{
            fontSize: '1rem',
          }}
          variant="flat"
        >
          <SlMenu /> All Categories <IoIosArrowDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Categories">
        <DropdownItem
          key="electronics"
          onClick={() => handleCategoryClick('electronics')}
        >
          Electronics
        </DropdownItem>
        <DropdownItem
          key="fashion"
          onClick={() => handleCategoryClick('fashion')}
        >
          Fashion
        </DropdownItem>
        <DropdownItem
          key="home"
          onClick={() => handleCategoryClick('home appliances')}
        >
          Home Appliances
        </DropdownItem>
        <DropdownItem
          key="beauty"
          onClick={() => handleCategoryClick('beauty products')}
        >
          Beauty Products
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const searchBar = (
    <div
      className="flex items-center rounded-md w-lg lg:w-[40vw] px-3 py-1 shadow-sm"
      style={{
        border: '1px solid #336B92',
      }}
    >
      <input
        className="flex-1 outline-none text-gray-700"
        placeholder="Search for products..."
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleSearchKeyPress}
      />
      <Button
        size="sm"
        style={{
          backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
          backgroundAttachment: 'fixed',
          color: 'white',
        }}
        variant="flat"
        onClick={handleSearch}
      >
        Search
      </Button>
    </div>
  );

  return (
    <nav className="bg-transparent shadow-md">
      <div
        className="w-full h-[5vh]"
        style={{
          backgroundImage: `url('/top-nav.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* <TopBar /> */}
      </div>

      {/* Top Row */}
      <div
        className="flex items-center justify-between px-4 py-6 bg-white"
        style={{
          paddingLeft: '5%',
          paddingRight: '5%',
        }}
      >
        <NextLink href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              alt="MartPlex Logo"
              height={45}
              src="/MartPlex-Logo.png"
              width={45}
            />
            <p className="hidden sm:block">
              <span
                className="font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
                  fontSize: '2rem', // Custom font size
                }}
              >
                Mart
              </span>
              <span
                className="font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(0deg, #2B709E, #000000)',
                  fontSize: '2rem', // Custom font size
                }}
              >
                Plex
              </span>
            </p>
          </div>
        </NextLink>

        <div className="hidden lg:flex justify-center">{searchBar}</div>

        <div className="flex items-center gap-1">
          <div className="lg:hidden flex items-center gap-1">
            <FaSearch
              className="text-gray-700 cursor-pointer hover:text-blue-500"
              onClick={() => setShowSearch(!showSearch)}
            />
          </div>
          {user ? (
            <NextLink href={`/profile/${profileId}`}>
              <Avatar size="sm" src={avatarUrl} />
            </NextLink>
          ) : (
            <Button
              className="bg-transparent text-sky-800 font-semibold p-0"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
          <NextLink href={user ? '/cart' : '/login'}>
            <Badge
              className="hover:scale-110 transition-transform"
              color="danger"
              content={user ? cartLength : 0}
            >
              <FaShoppingCart className="w-6 h-6 text-sky-800 cursor-pointer hover:text-sky-600" />
            </Badge>
          </NextLink>
        </div>
      </div>

      {showSearch && <div className="lg:hidden px-4 py-2">{searchBar}</div>}

      {/* Bottom Row */}
      <div
        className="flex items-center justify-between px-4 py-4 sticky top-0 z-10 bg-blue-700"
        style={{
          backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
          paddingLeft: '5%',
          paddingRight: '5%',
        }}
      >
        <div>{megaMenu}</div>
        <div className="hidden lg:flex gap-4">
          <NextLink
            key="home"
            className="text-zinc-200 hover:text-blue-200 text-sm font-bold"
            href={`/`}
          >
            Home
          </NextLink>

          <NextLink
            key="martolex-origin"
            className="text-zinc-200 hover:text-blue-200 text-sm font-bold"
            href={`/products?martplex=origin`}
          >
            MartPlex Origin
          </NextLink>
          <NextLink
            key="products"
            className="text-zinc-200 hover:text-blue-200 text-sm font-bold"
            href={`/products`}
          >
            Products
          </NextLink>
          <NextLink
            key="sale"
            className="text-zinc-200 hover:text-blue-200 text-sm font-bold"
            href={`/products?sale=true`}
          >
            Sale
          </NextLink>
          {['Shops', 'Compare'].map((menu) => (
            <NextLink
              key={menu}
              className="text-zinc-200 hover:text-blue-200 text-sm font-bold"
              href={`/${menu.toLowerCase()}`}
            >
              {menu}
            </NextLink>
          ))}
        </div>

        <div className="lg:hidden">
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="text-white font-bold"
                size="sm"
                style={{
                  fontSize: '1.5rem',
                }}
                variant="light"
              >
                <SlMenu />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Other Menus">
              {[
                { label: 'Home', url: '/' },
                { label: 'MartPlex Origin', url: '/products?martplex=origin' },
                { label: 'Products', url: '/products' },
                { label: 'Sale', url: '/products?sale=true' },
                { label: 'Shops', url: '/shops' },
                { label: 'Compare', url: '/compare' },
              ].map((menu) => (
                <DropdownItem
                  key={menu.label}
                  onClick={() => (window.location.href = menu.url)}
                >
                  {menu.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};
