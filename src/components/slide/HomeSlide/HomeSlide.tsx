'use client';

import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 1,
    title: 'Welcome to Martplex',
    description: 'Explore a world of amazing products at unbeatable prices!',
    buttonText: 'Visit Martplex',
    link: '/products?martplex=origin',
    bgColor: 'bg-gradient-to-b from-[#A1C4FD] to-[#C2E9FB]', // Light gradient
    image: '/MartPlex-Logo.png',
    orientation: 'image-left',
  },
  {
    id: 2,
    title: 'Discover Our Products',
    description: 'Find everything you need, from electronics to fashion.',
    buttonText: 'Explore Products',
    link: '/products',
    bgColor: 'bg-gradient-to-tr from-[#fdd8a1] to-[#C2E9FB]', 
    image: '/products2.png',
    orientation: 'image-left',
  },
  {
    id: 3,
    title: 'Shop from the Best',
    description: 'Check out shops near you for quick and convenient shopping.',
    buttonText: 'Find Shops',
    link: '/shops',
    bgColor: 'bg-gradient-to-tl from-[#fdc9a1] to-[#C2E9FB]',
    image: '/shops.png',
    orientation: 'image-left',
  },
];

const HomeSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const current = slides[currentSlide];

  return (
    <div className="relative h-[55vh] w-[95vw] flex items-center justify-center overflow-hidden rounded-lg shadow-xl">
      {/* Background */}
      <div
        className={`absolute inset-0 ${current.bgColor} transition-all duration-700`}
      />

      {/* Slide Content */}
      <div className="relative z-10 w-full flex flex-row items-center justify-between px-2">
        {current.orientation === 'image-left' && (
          <div className="w-1/2 flex justify-center items-center">
            <img
              src={current.image}
              alt={current.title}
              className="h-72 w-auto object-contain transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}

        <div className="w-1/2 text-gray-800 text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-sm">{current.title}</h1>
          <p className="text-lg mb-6">{current.description}</p>
          <Button
            className="bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB] text-gray-900 font-bold py-2 px-6 rounded-lg hover:scale-105 hover:from-[#96E6A1] hover:to-[#D4FC79] transition-transform duration-300 shadow-md"
            onPress={() => router.push(current.link)}
          >
            {current.buttonText}
          </Button>
        </div>

        {current.orientation === 'image-right' && (
          <div className="w-1/2 flex justify-center items-center">
            <img
              src={current.image}
              alt={current.title}
              className="h-72 w-auto object-contain transition-transform duration-500 hover:scale-110"
            />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-7 flex space-x-4 z-20">
        <button
          className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
          onClick={handlePrevSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="bg-gray-100 p-3 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
          onClick={handleNextSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full ${
              index === currentSlide ? 'bg-gray-900' : 'bg-gray-400'
            } transition duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlide;
