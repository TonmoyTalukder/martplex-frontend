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
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  useCreateVendorStand,
  useDeleteVendorStand,
  useGetAllVendorStands,
} from "@/src/hooks/vendorstand.hooks";
import { useUser } from "@/src/context/user.provider";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vendorStands.map((stand: VendorStand) => {
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
