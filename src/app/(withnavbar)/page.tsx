'use client';

import { useState, useEffect } from 'react';

import NewArrivals from '@/src/components/homepage/NewArrivals';
import SelectedCategories from '@/src/components/homepage/SelectedCategories';
import HomeSlide from '@/src/components/slide/HomeSlide/HomeSlide';
import OnSale from '@/src/components/homepage/OnSale';
import MartPlexOriginal from '@/src/components/homepage/MartPlexOriginal';
import TopSellingProducts from '@/src/components/homepage/TopSellingProducts';
import CustomerSupport from '@/src/components/homepage/CustomerSupport';
import FlashSales from '@/src/components/homepage/FlashSales';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500 border-solid" />
      </div>
    );
  }

  return (
    <section className="w-[100vw] flex flex-col items-center justify-center gap-0 bg-[#f7f8f4]">
      <HomeSlide />
      <FlashSales />
      <SelectedCategories />
      <NewArrivals />
      <CustomerSupport />
      <OnSale />
      <TopSellingProducts />
      <MartPlexOriginal />
    </section>
  );
}
