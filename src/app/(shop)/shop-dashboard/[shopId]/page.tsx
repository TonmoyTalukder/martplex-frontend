'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { useTheme } from 'next-themes';

import {
  useGetSingleVendorStand,
  useUpdateVendorStand,
} from '@/src/hooks/vendorstand.hooks';
import { useShop } from '@/src/context/ShopContext';
import { FaRegEdit } from 'react-icons/fa';

interface IProps {
  params: {
    shopId: string;
  };
}

const ShopDashboard = ({ params: { shopId } }: IProps) => {
  const { theme } = useTheme();
  const { setShopId } = useShop();
  const { data: vendorStandsData, isLoading: vendorLoading } =
    useGetSingleVendorStand(shopId);
  const {
    mutate: handleUpdateVendorStandApi,
    isPending: updateVendorStandPending,
  } = useUpdateVendorStand();

  const vendorStand: any = vendorStandsData?.data?.vendorStandInfo;

  const [editableFields, setEditableFields] = useState<any>({});
  const [isEditingField, setIsEditingField] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState<File | null>(null);

  useEffect(() => {
    setShopId(shopId);
    if (vendorStand) {
      setEditableFields({
        name: vendorStand?.name || '',
        description: vendorStand?.description || '',
        logo: vendorStand?.logo,
        vendorDiscount: vendorStand?.vendorDiscount || '0',
        vendorSale: vendorStand?.vendorSale ? 'True' : 'False',
      });
    }
  }, [shopId, setShopId, vendorStand]);

  const fieldLabels: Record<string, string> = {
    name: 'Shop Name',
    description: 'Description',
    logo: 'Logo',
    vendorDiscount: 'Vendor Discount (%)',
    vendorSale: 'Vendor Sale',
  };

  const handleInputChange = (field: string, value: string) => {
    setEditableFields((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewLogo(e.target.files[0]);
    }
  };

  const saveField = (field: string) => {
    const formData = new FormData();

    if (field === 'logo' && newLogo) {
      formData.append('file', newLogo);
    }

    const dataToUpdate = {
      id: shopId,
      data: { [field]: editableFields[field] },
    };

    formData.append('data', JSON.stringify(dataToUpdate));

    handleUpdateVendorStandApi({ id: shopId, data: formData });

    setIsEditingField(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {vendorLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner animate-spin w-16 h-16 border-4 border-t-blue-700 border-gray-300 rounded-full"></div>
        </div>
      ) : (
        <div
          className={`p-8 rounded-lg shadow-md ${
            theme === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-800'
          }`}
        >
          <h1 className="text-3xl font-bold mb-8">Shop Settings</h1>

          {Object.entries(editableFields).map(([field, value]) => (
            <div
              key={field}
              className="mb-8 border-b border-gray-300 pb-6 flex flex-col"
            >
              <label
                htmlFor={field}
                className="text-lg font-semibold mb-2 text-gray-600"
              >
                {fieldLabels[field] || field}
              </label>

              <div className="flex justify-between items-center">
                {field === 'logo' ? (
                  <div className="flex items-center gap-6">
                    <Image
                      alt="Logo"
                      className="w-20 h-20 rounded-full"
                      src={typeof value === 'string' ? value : '/shops.png'}
                      width={80}
                      height={80}
                    />
                    {isEditingField === field && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    )}
                  </div>
                ) : isEditingField === field ? (
                  <input
                    id={field}
                    type="text"
                    value={value as string}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-md"
                  />
                ) : (
                  <span className="text-gray-600 text-lg">
                    {typeof value === 'string' ? value : 'N/A'}
                  </span>
                )}

                {isEditingField === field ? (
                  <div className="flex gap-4 px-4">
                    <button
                      onClick={() => saveField(field)}
                      className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <AiOutlineCheck />
                    </button>
                    <button
                      onClick={() => setIsEditingField(null)}
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <AiOutlineClose />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingField(field)}
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaRegEdit />
                  </button>
                )}
              </div>
            </div>
          ))}

          {updateVendorStandPending && (
            <div className="mt-6 text-center text-gray-500">
              <div className="spinner animate-spin w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full mx-auto"></div>
              Updating...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
