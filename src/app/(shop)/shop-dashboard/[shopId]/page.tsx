// ShopDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Spinner,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import Image from 'next/image';
import { AiFillEdit, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

import {
  useGetSingleVendorStand,
  useUpdateVendorStand,
} from '@/src/hooks/vendorstand.hooks';
import { useShop } from '@/src/context/ShopContext';
import { useTheme } from 'next-themes';

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

  console.log(vendorStand);

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

    // Append the file if updating the logo
    if (field === 'logo' && newLogo) {
      formData.append('file', newLogo);
    }

    // Append the rest of the data
    const dataToUpdate = {
      id: shopId,
      data: { [field]: editableFields[field] },
    };

    formData.append('data', JSON.stringify(dataToUpdate));

    handleUpdateVendorStandApi({ id: shopId, data: formData });

    setIsEditingField(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {vendorLoading ? (
        <div className="flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div
          className={`p-6 ${theme === 'dark' ? 'text-zinc-900' : 'text-zinc-300'}`}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>

          {Object.entries(editableFields).map(([field, value]) => (
            <Card key={field} className="mb-6">
              <CardHeader className="flex items-center justify-between">
                <h2 className="capitalize text-lg font-medium text-gray-700">
                  {field.replace(/([A-Z])/g, ' $1')}
                </h2>
                {!isEditingField && (
                  <Tooltip content="Edit" placement="top">
                    <Button
                      isIconOnly
                      color="primary"
                      variant="light"
                      onPress={() => setIsEditingField(field)}
                    >
                      <AiFillEdit />
                    </Button>
                  </Tooltip>
                )}
              </CardHeader>
              <CardBody>
                {field === 'logo' ? (
                  <div className="flex items-center gap-4">
                    <Image
                      alt="Logo"
                      className="w-16 h-16 rounded-full"
                      height={64}
                      src={
                        typeof value === 'string'
                          ? value
                          : 'https://via.placeholder.com/150'
                      }
                      width={64}
                    />
                    {isEditingField === field && (
                      <Input
                        accept="image/*"
                        type="file"
                        onChange={handleLogoUpload}
                      />
                    )}
                  </div>
                ) : field === 'vendorSale' && isEditingField === field ? (
                  <Select
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  >
                    <SelectItem value="True">True</SelectItem>
                    <SelectItem value="False">False</SelectItem>
                  </Select>
                ) : isEditingField === field ? (
                  <Input
                    fullWidth
                    isClearable
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700">
                    {typeof value === 'string' ? value : 'N/A'}
                  </p>
                )}

                {isEditingField === field && (
                  <div className="flex gap-4 mt-4">
                    <Button
                      isIconOnly
                      color="success"
                      onPress={() => saveField(field)}
                    >
                      <AiOutlineCheck />
                    </Button>
                    <Button
                      isIconOnly
                      color="danger"
                      onPress={() => setIsEditingField(null)}
                    >
                      <AiOutlineClose />
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}

          {updateVendorStandPending && (
            <div className="mt-4 flex justify-center">
              <Spinner size="md" />
              <p className="ml-2 text-gray-600">Updating...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopDashboard;
