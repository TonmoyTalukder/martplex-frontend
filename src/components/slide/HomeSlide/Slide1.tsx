'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

const Slide1 = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/product?category=electronics');
  };
  return (
    <div
      className="h-[65vh]"
      style={{
        backgroundImage: `url('/slide1.png')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%', // Full width
      }}
    >
      <div className="w-full h-full border-2 flex items-end justify-end">
        <Button
          size="lg"
          className="bg-amber-500 text-white font-bold text-2xl relative flex items-center justify-center space-x-2"
          style={{
            bottom: '15vh',
            right: '15vw',
          }}
          onClick={handleClick}
        >
          <span>Explore</span>
          <FaArrowRightLong className="transform transition-transform duration-300 group-hover:translate-x-2" />
        </Button>
      </div>
    </div>
  );
};

export default Slide1;
