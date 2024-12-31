"use client";

import React, { useState } from "react";

import { useCreateProduct } from "@/src/hooks/product.hooks";

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    vendorStandId: "",
    categoryId: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const { mutate: createProductMutation, isPending: isCreatingProduct } =
    useCreateProduct();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please upload at least one image.");

      return;
    }

    const productData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      productData.append(key, value as string);
    });
    files.forEach((file) => {
      productData.append("files", file);
    });

    createProductMutation(productData);
  };

  return (
    <form className="create-product-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Product Name</label>
        <input
          required
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          maxLength={500}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          required
          id="price"
          name="price"
          step="0.01"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="stock">Stock</label>
        <input
          required
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="vendorStandId">Vendor Stand ID</label>
        <input
          required
          id="vendorStandId"
          name="vendorStandId"
          type="text"
          value={formData.vendorStandId}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="categoryId">Category ID</label>
        <input
          required
          id="categoryId"
          name="categoryId"
          type="text"
          value={formData.categoryId}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="files">Upload Images</label>
        <input
          multiple
          accept="image/*"
          id="files"
          type="file"
          onChange={handleFileChange}
        />
      </div>
      <button disabled={isCreatingProduct} type="submit">
        {isCreatingProduct ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
};

export default CreateProductForm;
