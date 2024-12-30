"use client";

import { useState, useMemo } from "react";
import { Spinner, Select, SelectItem } from "@nextui-org/react";

import ProductCard from "./ProductCard";

import { useGetAllProducts } from "@/src/hooks/product.hooks";

const AllProducts = () => {
  const {
    data: products,
    isLoading: loadingProducts,
    isError,
    error,
  } = useGetAllProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories
  const categories: string[] = useMemo(() => {
    const allCategories = products?.data?.map(
      (product: any) => product.category?.name || "Unknown",
    );

    return ["All", ...Array.from(new Set<string>(allCategories))];
  }, [products]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products?.data;

    return products?.data?.filter(
      (product: any) => product.category?.name === selectedCategory,
    );
  }, [selectedCategory, products]);

  if (isError) {
    console.log("Product Fetching Error: ", error);
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto flex flex-col md:flex-row">
        {/* Sidebar Filter */}
        {!loadingProducts && (
          <div className="w-full md:w-1/4 mb-8 md:mb-0 md:pr-4">
            <div className="p-4 shadow-lg rounded-lg sticky top-4">
              <h3 className="text-lg font-bold mb-4">Category</h3>
              <Select
                className="w-full"
                label="Category"
                placeholder="Select a category"
                selectedKeys={[selectedCategory]}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {loadingProducts ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
