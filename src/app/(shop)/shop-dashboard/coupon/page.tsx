"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
} from "@nextui-org/react";
import { toast } from "sonner";
import { MdDeleteForever } from "react-icons/md";
import { HiPlayPause } from "react-icons/hi2";

import {
  useCreateCoupon,
  useDeleteCoupon,
  useGetAllCoupons,
  useUpdateCoupon,
} from "@/src/hooks/coupon.hooks";
import { useUser } from "@/src/context/user.provider";
import { useGetAllVendorStands } from "@/src/hooks/vendorstand.hooks";

// Define the Coupon interface
interface Coupon {
  id: string;
  code: string;
  discount: string;
  expiresAt: string;
  isActive: boolean;
}

const CouponsPage = () => {
  const { data: coupons, isLoading } = useGetAllCoupons();
  const deleteCouponMutation = useDeleteCoupon();
  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const { user } = useUser();
  const profileId = user?.id;
  const { data: vendorStandsData } = useGetAllVendorStands(profileId!);

  const vendorStands = vendorStandsData?.data;

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateChange,
  } = useDisclosure();

  const {
    isOpen: isDeactivateOpen,
    onOpen: onDeactivateOpen,
    onOpenChange: onDeactivateChange,
  } = useDisclosure();

  const [searchTerm, setSearchTerm] = useState("");
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiresAt: "",
    vendorStandId: "",
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const filteredCoupons = coupons?.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteCouponMutation.mutateAsync({ id });
      toast.success("Coupon deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete coupon.");
    }
  };

  const handleCreateCoupon = async () => {
    try {
      if (!newCoupon.vendorStandId) {
        toast.error("Please select a Vendor Stand.");

        return;
      }

      await createCouponMutation.mutateAsync(newCoupon);
      onCreateChange();
      setNewCoupon({
        code: "",
        discount: "",
        expiresAt: "",
        vendorStandId: "",
      });
      toast.success("Coupon created successfully!");
    } catch (error) {
      toast.error("Failed to create coupon.");
    }
  };

  const handleDeactivateCoupon = async (valid: boolean) => {
    try {
      if (!selectedCoupon) return;

      const payload = {
        couponId: selectedCoupon.id,
        code: selectedCoupon.code,
        discount: selectedCoupon.discount,
        expiresAt: selectedCoupon.expiresAt,
        isActive: valid ? false : true,
      };

      await updateCouponMutation.mutateAsync(payload);
      onDeactivateChange();
      setSelectedCoupon(null);
      valid
        ? toast.success("Coupon deactivated successfully!")
        : toast.success("Coupon Activated successfully!");
    } catch (error) {
      toast.error("Failed to deactivate coupon.");
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading Coupons...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Input
          className="w-full max-w-md"
          placeholder="Search by code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onPress={onCreateOpen}
        >
          Create Coupon
        </Button>
      </div>

      <Table aria-label="Coupons Table" color="primary" selectionMode="none">
        <TableHeader>
          <TableColumn>CODE</TableColumn>
          <TableColumn>DISCOUNT</TableColumn>
          <TableColumn>EXPIRES AT</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={filteredCoupons || []}>
          {(coupon: Coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.discount}%</TableCell>
              <TableCell>
                {new Date(coupon.expiresAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Chip
                  color={coupon.isActive ? "success" : "danger"}
                  variant="flat"
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Tooltip content="Delete Coupon">
                    <Button
                      isIconOnly
                      color="danger"
                      onPress={() => handleDelete(coupon.id)}
                    >
                      <MdDeleteForever size={20} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content={
                      coupon.isActive ? "Deactivate Coupon" : "Activate Coupon"
                    }
                  >
                    <Button
                      isIconOnly
                      color="primary"
                      onPress={() => {
                        setSelectedCoupon(coupon);
                        onDeactivateOpen();
                      }}
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

      {/* Create Coupon Modal */}
      <Modal isOpen={isCreateOpen} onOpenChange={onCreateChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create New Coupon</ModalHeader>
              <ModalBody>
                <Input
                  required
                  label="Code"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, code: e.target.value })
                  }
                />
                <Input
                  required
                  label="Discount (%)"
                  type="number"
                  value={newCoupon.discount}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, discount: e.target.value })
                  }
                />
                <Input
                  required
                  label="Expires At"
                  labelPlacement="outside"
                  type="datetime-local"
                  value={newCoupon.expiresAt}
                  onChange={(e) =>
                    setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
                  }
                />
                {/* <label className="block text-sm font-medium text-gray-700">
                  Vendor Stand
                </label> */}
                <Select
                  placeholder="Select Vendor Stand"
                  selectedKeys={new Set([newCoupon.vendorStandId])}
                  onSelectionChange={(selected) =>
                    setNewCoupon({
                      ...newCoupon,
                      vendorStandId: Array.from(selected).join(""),
                    })
                  }
                >
                  {vendorStands?.map((vendor: any) => (
                    <SelectItem key={vendor.id}>{vendor.name}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 text-white"
                  onPress={handleCreateCoupon}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Deactivate Coupon Modal */}
      <Modal isOpen={isDeactivateOpen} onOpenChange={onDeactivateChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Deactivate Coupon</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to deactivate this coupon?</p>
                <p>
                  <strong>{selectedCoupon?.code}</strong>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className="bg-yellow-500 text-white"
                  onPress={() =>
                    handleDeactivateCoupon(
                      selectedCoupon?.isActive ? true : false,
                    )
                  }
                >
                  {selectedCoupon?.isActive ? (
                    <span>Deactivate</span>
                  ) : (
                    <span>Activate</span>
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CouponsPage;
