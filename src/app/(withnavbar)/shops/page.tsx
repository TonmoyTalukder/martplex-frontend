'use client';

import { useGetVendorStands } from '@/src/hooks/vendorstand.hooks';
import { Button } from '@nextui-org/react';
import { IoOpenOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  ownerId: string;
  vendorSale: boolean;
  flashSale: boolean;
  vendorDiscount: number;
  isDeleted: boolean;
  status: string;
}

const ShopPage = () => {
  const {
    data: shopsData,
    isLoading: loadingShops,
    isError,
    error,
  } = useGetVendorStands();

  const shops = shopsData?.data;

  console.log(shops);

  const router = useRouter();

  return (
    <div className="p-6 bg-gray-50 min-h-[85vh]">
      {loadingShops ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-blue-500 text-lg font-semibold">
            Loading Vendor Stands...
          </p>
        </div>
      ) : shops?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((stand: Shop) => (
            <div
              key={stand.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative w-full h-40">
                <Image
                  alt={stand.name}
                  className="object-cover"
                  src={
                    stand.logo && stand.logo.trim() !== ''
                      ? stand.logo
                      : 'https://i.ibb.co/xmQDSkJ/Pngtree-stall-vendor-rooftop-vegetable-market-7670485.png'
                  }
                  layout="fill"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 truncate mb-2">
                  {stand.name}
                </h2>
                <p className="text-sm text-gray-600 mb-4 truncate">
                  {stand.description || 'No description available.'}
                </p>

                {stand.vendorSale && (
                  <p className="text-green-500 text-sm font-semibold">
                    Vendor Sale Active
                  </p>
                )}
                {stand.flashSale && (
                  <p className="text-red-500 text-sm font-semibold">
                    Flash Sale!
                  </p>
                )}

                <div className="flex justify-between items-center mt-4">
                  <Button
                    className=" rounded-lg px-4 py-2"
                    onClick={() => router.push(`/vendor-stand/${stand.id}`)}
                    style={{
                      backgroundImage:
                        'linear-gradient(314deg, #336B92, #8DC2EF)',
                      backgroundAttachment: 'fixed',
                      color: 'white',
                    }}
                  >
                    <IoOpenOutline className="w-5 h-5 mr-2" />
                    Open
                  </Button>

                  {stand.vendorDiscount > 0 && (
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-lg">
                      {stand.vendorDiscount}% OFF
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-gray-500 text-lg font-medium">
            No Vendor Stand Found.
          </p>
          <p className="text-gray-400 text-sm">Please check back later!</p>
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 mt-6">
          <p>Failed to load vendor stands: {error?.message}</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
