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
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { IoOpenOutline } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";

import {
  useCreateVendorStand,
  useDeleteVendorStand,
  useGetAllVendorStands,
} from "@/src/hooks/vendorstand.hooks";
import { useUser } from "@/src/context/user.provider";

interface VendorStand {
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

const VendorStands = () => {
  const { user, isLoading: userLoading } = useUser();
  const profileId = user?.id;
  const { data: vendorStandsData, isLoading } = useGetAllVendorStands(
    profileId!,
  );

  const vendorStands = vendorStandsData?.data;

  console.log(vendorStands);

  const {
    mutate: handleCreateVendorStandApi,
    isPending: createVendorStandPending,
    isSuccess: createVendorStandSuccess,
  } = useCreateVendorStand();

  const {
    mutate: handleDeleteVendorStandApi,
    isPending: deleteVendorStandPending,
    isSuccess: deleteVendorStandSuccess,
  } = useDeleteVendorStand();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const [newVendorStand, setNewVendorStand] = useState<{
    name: string;
    description: string;
    logo?: string;
    vendorSale: boolean;
    flashSale: boolean;
    vendorDiscount: number;
  }>({
    name: "",
    description: "",
    vendorSale: false,
    flashSale: false,
    vendorDiscount: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setNewVendorStand({ ...newVendorStand, [name]: value });
  };

  const handleSubmit = async () => {
    // Ensure `newVendorStand` contains the correct values
    console.log("New Vendor Stand State:", newVendorStand);

    const formDataToSend = new FormData();

    // Check for missing or empty fields
    if (!newVendorStand.name || !newVendorStand.description) {
      alert("Name and description are required!");

      return;
    }

    // Add JSON stringified data to FormData
    formDataToSend.append(
      "data",
      JSON.stringify({
        name: newVendorStand.name || "",
        description: newVendorStand.description || "",
        vendorSale: newVendorStand.vendorSale,
        flashSale: newVendorStand.flashSale,
        vendorDiscount: newVendorStand.vendorDiscount || 0,
        ownerId: profileId,
      }),
    );

    // Log to verify the content
    console.log("New Vendor Stand FormData:", formDataToSend.get("data"));

    try {
      await handleCreateVendorStandApi(formDataToSend); // Trigger the API call
      console.log("Vendor stand created successfully!");
      onOpenChange(); // Close the modal
    } catch (error) {
      console.error("Error creating vendor stand:", error);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor stand?")) {
      handleDeleteVendorStandApi(id, {
        onSuccess: () => {
          console.log(`Vendor Stand ${id} deleted successfully!`);
          // Optionally refetch the list after deletion or remove the item locally
        },
        onError: (error) => {
          console.error(`Error deleting Vendor Stand ${id}:`, error);
          alert("Failed to delete the vendor stand. Please try again.");
        },
      });
    }
  };

  if (userLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading Vendor Stands...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vendor Stands</h1>
        <Button
          onPress={() => {
            console.log("Modal Open Clicked");
            onOpen(); // Use the hook's onOpen function
          }}
        >
          Create Vendor Stand
        </Button>
      </div>

      {vendorStands?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {vendorStands.map((stand: VendorStand) => (
            <div
              key={stand.id}
              className="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition"
            >
              <img
                alt={stand.name}
                className="w-full h-32 object-cover rounded-md mb-4"
                src={
                  stand.logo ||
                  "https://i.ibb.co.com/xmQDSkJ/Pngtree-stall-vendor-rooftop-vegetable-market-7670485.png"
                }
              />
              <h2 className="text-lg font-semibold mb-2">{stand.name}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {stand.description || "No description available."}
              </p>
              {/* <p className="text-sm text-gray-800 font-semibold">
                Discount: {stand.vendorDiscount}%
              </p> */}
              {stand.vendorSale && (
                <p className="text-green-600 text-sm">Vendor Sale Active</p>
              )}
              {stand.flashSale && (
                <p className="text-red-600 text-sm">Flash Sale!</p>
              )}

              <div className="flex justify-end items-center gap-4">
                <Button
                  className="bg-blue-500 text-white rounded-lg mx-0"
                  onClick={() => router.push(`/vendor-stand/${stand.id}`)}
                >
                  <IoOpenOutline className="w-6 h-6" />
                </Button>
                <Button
                  className="bg-red-500 text-white rounded-lg mx-0"
                  onClick={() => handleDelete(stand.id)}
                >
                  <MdOutlineDeleteForever className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <p>No Vendor Stand. Create one.</p>
        </div>
      )}

      {/* Modal for Creating Vendor Stands */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Vendor Stand
              </ModalHeader>
              <ModalBody>
                <Input
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  placeholder="Vendor Stand Name"
                  value={newVendorStand.name}
                  onChange={handleInputChange}
                />
                <Textarea
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  placeholder="Vendor Stand Description"
                  value={newVendorStand.description}
                  onChange={handleInputChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSubmit}>
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

export default VendorStands;
