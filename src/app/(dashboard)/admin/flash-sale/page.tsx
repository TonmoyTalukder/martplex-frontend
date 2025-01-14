'use client';

import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
} from '@nextui-org/react';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { toast } from 'sonner';
import { MdDeleteForever } from 'react-icons/md';
import { HiPlayPause } from 'react-icons/hi2';
import {
  useCreateFlashSale,
  useDeleteFlashSale,
  useGetAllFlashSales,
  useUpdateFlashSale,
} from '@/src/hooks/flashsale.hooks';
import { useGetAllProducts } from '@/src/hooks/product.hooks';

interface FlashSale {
  id: string;
  name: string;
  description: string;
  discount: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  productIds: string[];
}

const FlashSalePage = () => {
  const { data: productData, isLoading: loadingProducts } = useGetAllProducts();
  const { data: flashSales, isLoading } = useGetAllFlashSales();
  const createFlashSaleMutation = useCreateFlashSale();
  const updateFlashSaleMutation = useUpdateFlashSale();
  const deleteFlashSaleMutation = useDeleteFlashSale();

  const products = productData?.data;
  console.log('Products Data: ', products);

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateChange,
  } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState('');
  const [newFlashSale, setNewFlashSale] = useState({
    name: '',
    description: '',
    discount: '',
    startsAt: '',
    endsAt: '',
    productIds: [] as string[],
  });
  const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale | null>(
    null,
  );

  const filteredFlashSales = flashSales?.filter((sale: FlashSale) =>
    sale.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateFlashSale = async () => {
    try {
      await createFlashSaleMutation.mutateAsync({
        ...newFlashSale,
        discount: Number(newFlashSale.discount),
        startsAt: new Date(newFlashSale.startsAt).toISOString(),
        endsAt: new Date(newFlashSale.endsAt).toISOString(),
      });
      onCreateChange();
      setNewFlashSale({
        name: '',
        description: '',
        discount: '',
        startsAt: '',
        endsAt: '',
        productIds: [],
      });
      toast.success('Flash Sale created successfully!');
    } catch (error) {
      toast.error('Failed to create flash sale.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFlashSaleMutation.mutateAsync({ id });
      toast.success('Flash Sale deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete flash sale.');
    }
  };

  const handleToggleFlashSale = async (sale: FlashSale) => {
    console.log('Hi');
    const updatedSale = {
      ...sale,
      isActive: !sale.isActive, // Toggle the active status
    };

    console.log(updatedSale);
    // try {
    //   const updatedSale = {
    //     ...sale,
    //     isActive: !sale.isActive, // Toggle the active status
    //   };

    //   console.log(updatedSale);

    //   // await updateFlashSaleMutation.mutateAsync(updatedSale); // Call API to update
    //   toast.success(
    //     updatedSale.isActive
    //       ? 'Flash Sale activated successfully!'
    //       : 'Flash Sale deactivated successfully!',
    //   );
    // } catch (error) {
    //   toast.error('Failed to update flash sale.');
    // }
  };

  const handleToggle = async (sale: FlashSale) => {
    console.log('Hi');
    const updatedSale = {
      ...sale,
      isActive: !sale.isActive, // Toggle the active status
    };

    const payload = {
      flashSaleId: updatedSale.id,
      name: updatedSale.name,
      description: updatedSale.description,
      startsAt: new Date(updatedSale.startsAt).toISOString(),
      endsAt: new Date(updatedSale.endsAt).toISOString(),
      discount: Number(updatedSale.discount),
      isActive: updatedSale.isActive,
    };

    console.log(payload);
    try {
      await updateFlashSaleMutation.mutateAsync(payload);
      toast.success(
        payload.isActive
          ? 'Flash Sale deactivated successfully!'
          : 'Flash Sale activated successfully!',
      );
    } catch (error) {
      toast.error('Failed to update flash sale.');
    }
  };

  if (isLoading || loadingProducts) {
    return <div className="text-center py-10">Loading Flash Sales...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Input
          className="w-full max-w-md"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white"
          onPress={onCreateOpen}
        >
          Create Flash Sale
        </Button>
      </div>

      <Table
        aria-label="Flash Sales Table"
        color="primary"
        selectionMode="none"
      >
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>DISCOUNT</TableColumn>
          <TableColumn>STARTS AT</TableColumn>
          <TableColumn>ENDS AT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={filteredFlashSales || []}>
          {(sale: FlashSale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.name}</TableCell>
              <TableCell>{sale.discount}%</TableCell>
              <TableCell>{new Date(sale.startsAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(sale.endsAt).toLocaleString()}</TableCell>
              <TableCell>
                <Chip
                  color={sale.isActive ? 'success' : 'danger'}
                  variant="flat"
                >
                  {sale.isActive ? 'Active' : 'Inactive'}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Tooltip content="Delete Flash Sale">
                    <Button
                      isIconOnly
                      color="danger"
                      onPress={() => handleDelete(sale.id)}
                    >
                      <MdDeleteForever size={20} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content={
                      sale.isActive
                        ? 'Deactivate Flash Sale'
                        : 'Activate Flash Sale'
                    }
                  >
                    <Button
                      isIconOnly
                      color="primary"
                      onPress={() => handleToggle(sale)}
                    >
                      <HiPlayPause />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isCreateOpen} onOpenChange={onCreateChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Flash Sale</ModalHeader>
              <ModalBody>
                <Input
                  required
                  label="Name"
                  value={newFlashSale.name}
                  onChange={(e) =>
                    setNewFlashSale({ ...newFlashSale, name: e.target.value })
                  }
                />
                <Input
                  required
                  label="Description"
                  value={newFlashSale.description}
                  onChange={(e) =>
                    setNewFlashSale({
                      ...newFlashSale,
                      description: e.target.value,
                    })
                  }
                />
                <Input
                  required
                  label="Discount (%)"
                  type="number"
                  value={newFlashSale.discount}
                  onChange={(e) =>
                    setNewFlashSale({
                      ...newFlashSale,
                      discount: e.target.value,
                    })
                  }
                />
                <Input
                  required
                  label="Starts At"
                  type="datetime-local"
                  value={newFlashSale.startsAt}
                  onChange={(e) =>
                    setNewFlashSale({
                      ...newFlashSale,
                      startsAt: e.target.value,
                    })
                  }
                />
                <Input
                  required
                  label="Ends At"
                  type="datetime-local"
                  value={newFlashSale.endsAt}
                  onChange={(e) =>
                    setNewFlashSale({ ...newFlashSale, endsAt: e.target.value })
                  }
                />
                <div className="mt-4">
                  <p className="block text-sm font-medium">Products</p>
                  <Input
                    label="Search Products"
                    placeholder="Type to search products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Listbox
                    aria-label="Select products"
                    selectionMode="multiple"
                    selectedKeys={new Set(newFlashSale.productIds)}
                    onSelectionChange={(keys) =>
                      setNewFlashSale({
                        ...newFlashSale,
                        productIds: Array.from(keys, (key) => String(key)),
                      })
                    }
                  >
                    {newFlashSale.productIds.map((productId) => {
                      const product = products.find(
                        (p: any) => p.id === productId,
                      );
                      return product ? (
                        <ListboxItem key={product.id}>
                          {product.name}
                        </ListboxItem>
                      ) : null;
                    })}

                    {searchTerm.length > 0 &&
                      products
                        .filter(
                          (product: any) =>
                            !newFlashSale.productIds.includes(product.id) &&
                            product.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()),
                        )
                        .map((product: any) => (
                          <ListboxItem key={product.id}>
                            {product.name}
                          </ListboxItem>
                        ))}
                  </Listbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-500 text-white"
                  onPress={handleCreateFlashSale}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FlashSalePage;
