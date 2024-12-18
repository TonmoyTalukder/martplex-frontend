"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { toast } from "sonner";

import {
  useCreateProduct,
  useDeleteProduct,
  useGetAllProducts,
  useUpdateProduct,
} from "@/src/hooks/product.hooks";
import {
  useCreateCategory,
  useGetAllCategories,
} from "@/src/hooks/category.hooks";

const ProductPage = () => {
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategories();
  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct();
  const { mutate: createCategory, isPending: isCreatingCategory } =
    useCreateCategory();
  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: closeModal,
  } = useDisclosure();

  const {
    isOpen: isCategoryModalOpen,
    onOpen: openCategoryModal,
    onOpenChange: closeCategoryModal,
  } = useDisclosure();

  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategoryData, setNewCategoryData] = useState({
    name: "",
    description: "",
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);

  const { register, handleSubmit, reset, setValue } = useForm();

  // Handle form submission
  const onSubmit = async (formData: any) => {
    if (!formData.categoryId) {
      toast.error("Please select a category.");

      return;
    }

    const formDataToSend = new FormData();

    const cleanPayload = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      description: formData.description || "",
      categoryId: formData.categoryId,
    };

    formDataToSend.append("data", JSON.stringify(cleanPayload));

    // Append new images
    imagesToUpload.forEach((file) => {
      formDataToSend.append("files", file);
    });

    // Append remaining existing images
    formDataToSend.append("existingImages", JSON.stringify(imagePreviews));

    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          formData: formDataToSend,
        });
        toast.success("Product updated successfully!");
      } else {
        await createProduct(formDataToSend);
        toast.success("Product created successfully!");
      }

      closeModal();
      reset();
      setEditingProduct(null);
      setImagePreviews([]);
      setImagesToUpload([]);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    }
  };

  const handleOpenCreateModal = () => {
    reset();
    setImagePreviews([]);
    setImagesToUpload([]);
    openModal();
  };

  const handleCreateCategorySubmit = () => {
    createCategory(newCategoryData, {
      onSuccess: () => {
        toast.success("Category created successfully!");
        closeCategoryModal();
      },
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("stock", product.stock);
    setValue("description", product.description);
    setValue("categoryId", product.categoryId);

    setImagePreviews(product.images || []); // Set existing images
    setImagesToUpload([]);
    openModal();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

      setImagesToUpload((prev) => [...prev, ...fileArray]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImagesToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = products?.data?.filter((product: any) =>
    // product.vendorStandId === shopId &&
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log(products?.data[0]);

  if (loadingCategories)
    return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <Input
        isClearable
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Product Table */}
      <Table
        aria-label="Product Table"
        style={{ height: "auto", minWidth: "100%" }}
      >
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Stock</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredProducts?.map((product: any) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.category?.name || "N/A"}</TableCell>
              <TableCell>
                <Button
                  color="warning"
                  onPress={() => handleEditProduct(product)}
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  onPress={() =>
                    deleteProduct(product.id, {
                      onSuccess: () =>
                        toast.success("Product deleted successfully!"),
                    })
                  }
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Create */}
      <Modal isOpen={isModalOpen} onOpenChange={closeModal}>
        <ModalContent>
          <ModalHeader>
            {editingProduct ? "Edit Product" : "Create Product"}
          </ModalHeader>
          <ModalBody>
            <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Name"
                {...register("name", { required: "Name is required" })}
              />
              <Input label="Price" type="number" {...register("price")} />
              <Input label="Stock" type="number" {...register("stock")} />
              <Input label="Description" {...register("description")} />

              <Select label="Category" {...register("categoryId")} required>
                {categories?.data?.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>

              <label htmlFor="images">Images</label>
              <Input
                multiple
                accept="image/*"
                id="images"
                type="file"
                onChange={handleImageUpload}
              />
              <div className="flex flex-wrap">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative m-2">
                    <img
                      alt="Preview"
                      className="w-24 h-24 rounded object-cover top-1"
                      src={src}
                    />
                    <Button
                      className="absolute bottom-20 left-20" // Position at the bottom-right corner
                      color="danger"
                      size="sm"
                      style={{
                        borderRadius: "50%",
                        padding: "0.5rem",
                        minWidth: "24px",
                        minHeight: "24px",
                        backgroundColor: "transparent",
                        color: "red",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </form>
            <Button color="primary" variant="ghost" onPress={openCategoryModal}>
              Create New Category
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={closeModal}>
              Cancel
            </Button>
            <Button color="primary" form="product-form" type="submit">
              {editingProduct ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for Create Category */}
      <Modal isOpen={isCategoryModalOpen} onOpenChange={closeCategoryModal}>
        <ModalContent>
          <ModalHeader>Create New Category</ModalHeader>
          <ModalBody>
            <Input
              required
              label="Category Name"
              value={newCategoryData.name}
              onChange={(e) =>
                setNewCategoryData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Input
              label="Description"
              value={newCategoryData.description}
              onChange={(e) =>
                setNewCategoryData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onPress={closeCategoryModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={isCreatingCategory}
              onPress={handleCreateCategorySubmit}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductPage;
