"use client";

import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    title: "Welcome to Martplex",
    description: "Explore a world of amazing products at unbeatable prices!",
    buttonText: "Visit Martplex",
    link: "/products?martplex=origin",
    bgColor: "bg-gradient-to-b from-[#A1C4FD] to-[#C2E9FB]",
    image: "/MartPlex-Logo.png",
    orientation: "image-left",
  },
  {
    id: 2,
    title: "Discover Our Products",
    description: "Find everything you need, from electronics to fashion.",
    buttonText: "Explore Products",
    link: "/products",
    bgColor: "bg-gradient-to-tr from-[#fdd8a1] to-[#C2E9FB]",
    image: "/products2.png",
    orientation: "image-left",
  },
  {
    id: 3,
    title: "Shop from the Best",
    description: "Check out shops near you for quick and convenient shopping.",
    buttonText: "Find Shops",
    link: "/shops",
    bgColor: "bg-gradient-to-tl from-[#fdc9a1] to-[#C2E9FB]",
    image: "/shops.png",
    orientation: "image-left",
  },
];

const HomeSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const current = slides[currentSlide];

  return (
    <div className="relative h-[55vh] w-[100vw] flex items-center justify-center overflow-hidden rounded-lg shadow-xl">
      <div
        className={`absolute inset-0 ${current.bgColor} transition-all duration-700`}
      />

      <div className="relative z-10 w-full flex flex-row items-center justify-between px-2">
        {current.orientation === "image-left" && (
          <div className="w-1/2 flex justify-center items-center">
            <img
              alt={current.title}
              className="h-72 w-auto object-contain transition-transform duration-500 hover:scale-110"
              src={current.image}
            />
          </div>
        )}

        <div className="w-1/2 text-gray-800 text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-sm">
            {current.title}
          </h1>
          <p className="text-lg mb-6">{current.description}</p>
          <Button
            className="bg-gradient-to-r from-[#A1C4FD] to-[#C2E9FB] text-gray-900 font-bold py-2 px-6 rounded-lg hover:scale-105 hover:from-[#e7f3f8] hover:to-[#98c1dc] transition-transform duration-300 shadow-md"
            onPress={() => router.push(current.link)}
          >
            {current.buttonText}
          </Button>
        </div>
      </div>

      {/* <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <button
          className="bg-[#ffffff66] p-3 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
          onClick={handlePrevSlide}
        >
          <svg
            className="w-6 h-6 text-sky-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>
      </div> */}
      {/* <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <button
          className="bg-[#ffffff66] p-3 rounded-full shadow-md hover:bg-gray-300 transition duration-300"
          onClick={handleNextSlide}
        >
          <svg
            className="w-6 h-6 text-sky-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
        </button>
      </div> */}

      <div className="absolute bottom-2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              index === currentSlide ? "bg-gray-900" : "bg-gray-400"
            } transition duration-300`}
            role="button"
            tabIndex={0}
            onClick={() => handleDotClick(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleDotClick(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSlide;
