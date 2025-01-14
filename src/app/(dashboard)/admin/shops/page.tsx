'use client';

import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { IoOpenOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useDeleteVendorStand,
  useGetVendorStands,
} from '@/src/hooks/vendorstand.hooks';
import { useUser } from '@/src/context/user.provider';
import { custom_date } from '@/src/utils/customDate';
import { MdDeleteForever } from 'react-icons/md';

interface Category {
  id: string;
  name: string;
}
interface Owner {
  id: string;
  name: string;
}
interface Product {
  id: string;
  name: string;
  category: Category;
}
interface VendorStand {
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
  owner: Owner;
}

const AdminShopPage = () => {
  const { data: vendorStandsData, isLoading } = useGetVendorStands();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const vendorStands = vendorStandsData?.data;

  const {
    mutate: handleDeleteVendorStandApi,
    isPending: deleteVendorStandPending,
    isSuccess: deleteVendorStandSuccess,
  } = useDeleteVendorStand();

  const router = useRouter();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vendor stand?')) {
      handleDeleteVendorStandApi(id, {
        onSuccess: () => {
          console.log(`Vendor Stand ${id} deleted successfully!`);
        },
        onError: (error) => {
          console.error(`Error deleting Vendor Stand ${id}:`, error);
          alert('Failed to delete the vendor stand. Please try again.');
        },
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredVendorStands = vendorStands?.filter(
    (stand: VendorStand) =>
      stand.name.toLowerCase().includes(searchQuery) ||
      stand.description?.toLowerCase().includes(searchQuery) ||
      stand.owner.name.toLowerCase().includes(searchQuery),
  );

  // Pagination logic
  const totalItems = filteredVendorStands?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedVendorStands = filteredVendorStands?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading Vendor Stands...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-4">
        <h1 className="text-2xl font-bold">
          <span
            className="font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
            }}
          >
            Vendor Stands
          </span>
        </h1>
      </div>
      <div className="flex justify-start items-center my-4 max-w-md">
        <input
          type="text"
          placeholder="Search Vendor Stands"
          className="px-4 py-2 mb-6 border-b-2 focus:outline-none w-full"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {paginatedVendorStands?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedVendorStands.map((stand: VendorStand) => {
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
                      stand.logo && stand.logo.trim() !== ''
                        ? stand.logo
                        : 'https://i.ibb.co/xmQDSkJ/Pngtree-stall-vendor-rooftop-vegetable-market-7670485.png'
                    }
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

                  <p className="text-gray-700 font-medium">
                    Shop by:{' '}
                    <span className="font-bold">{stand.owner.name}</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    Total Products:{' '}
                    <span className="font-bold">{stand.products.length}</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    Categories:{' '}
                    <span className="font-bold">{uniqueCategories.size}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Joined at: {custom_date(stand.createdAt)}
                  </p>

                  {stand.vendorDiscount > 0 && (
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-lg text-left">
                      {stand.vendorDiscount}% OFF
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <Button
                      className="rounded-lg px-4 py-2"
                      style={{
                        backgroundImage:
                          'linear-gradient(314deg, #336B92, #8DC2EF)',
                        backgroundAttachment: 'fixed',
                        color: 'white',
                      }}
                      onClick={() => router.push(`/vendor-stand/${stand.id}`)}
                    >
                      <IoOpenOutline className="w-5 h-5 mr-2" />
                      Open
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      onClick={() => handleDelete(stand.id)}
                    >
                      <MdDeleteForever size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>No Vendor Stand. Create one.</p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 mx-1 rounded ${
                page === currentPage
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default AdminShopPage;
