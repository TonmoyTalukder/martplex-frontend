"use client";

import { Button } from "@nextui-org/react";
import { IoOpenOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useGetVendorStands } from "@/src/hooks/vendorstand.hooks";
import { custom_date } from "@/src/utils/customDate";

interface Category {
  id: string;
  name: string;
}
interface Product {
  id: string;
  name: string;
  category: Category;
}
interface Shop {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  ownerId: string;
  vendorSale: boolean;
  vendorDiscount: number;
  isDeleted: boolean;
  status: string;
  products: Product[];
  createdAt: string;
}

const ShopPage = () => {
  const {
    data: shopsData,
    isLoading: loadingShops,
    isError,
    error,
  } = useGetVendorStands();

  const shops = shopsData?.data;

  const router = useRouter();

  return (
    <div className="p-6 min-h-[85vh] bg-gray-100">
      {loadingShops ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-blue-500 text-lg font-semibold">
            Loading Vendor Stands...
          </p>
        </div>
      ) : shops?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((stand: Shop) => {
            const uniqueCategories = new Set(
              stand.products.map((product) => product.category.name),
            );

            return (
              <div
                key={stand.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative w-full h-40">
                  <Image
                    alt={stand.name}
                    className="object-cover"
                    layout="fill"
                    src={
                      stand.logo && stand.logo.trim() !== ""
                        ? stand.logo
                        : "https://i.ibb.co/xmQDSkJ/Pngtree-stall-vendor-rooftop-vegetable-market-7670485.png"
                    }
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 truncate mb-2">
                    {stand.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 truncate">
                    {stand.description || "No description available."}
                  </p>

                  {stand.vendorSale && (
                    <p className="text-green-500 text-sm font-semibold">
                      Vendor Sale Active
                    </p>
                  )}

                  <p className="text-gray-700 font-medium">
                    Total Products:{" "}
                    <span className="font-bold">{stand.products.length}</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    Categories:{" "}
                    <span className="font-bold">{uniqueCategories.size}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Joined at: {custom_date(stand.createdAt)}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      className="rounded-lg px-4 py-2"
                      style={{
                        backgroundImage:
                          "linear-gradient(314deg, #336B92, #8DC2EF)",
                        backgroundAttachment: "fixed",
                        color: "white",
                      }}
                      onClick={() => router.push(`/vendor-stand/${stand.id}`)}
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
            );
          })}
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
