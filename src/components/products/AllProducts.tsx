"use client";

import { useState, useMemo, useEffect } from "react";
import { Spinner, Checkbox, Slider, Button } from "@nextui-org/react";

import ProductCard from "./ProductCard";

import { useGetAllProducts } from "@/src/hooks/product.hooks";

interface AllProductsProps {
  searchTerm: string;
  category: string;
  sale: string;
  martplex: string;
}

const AllProducts = ({
  searchTerm,
  category,
  sale,
  martplex,
}: AllProductsProps) => {
  const {
    data: products,
    isLoading: loadingProducts,
    isError,
    error,
  } = useGetAllProducts();

  console.log("Product => ", products?.data);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onSale, setOnSale] = useState<boolean>(false);
  const [inStock, setInStock] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    if (sale === "true") {
      setOnSale(true);
    }
  }, [sale]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6; // Products per page

  const categories: string[] = useMemo(() => {
    const allCategories = products?.data?.map(
      (product: any) => product.category?.name || "Unknown",
    );

    return ["All", ...Array.from(new Set<string>(allCategories))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm?.toLowerCase();

    return products?.data
      ?.filter(
        (product: any) =>
          selectedCategory === "All" ||
          product?.category?.name === selectedCategory,
      )
      .filter(
        (product: any) =>
          product?.price >= priceRange[0] && product?.price <= priceRange[1],
      )
      .filter((product: any) => (onSale ? product?.onSale : true))
      .filter((product: any) => (inStock ? product?.stock > 0 : true))
      .filter(
        (product: any) =>
          !searchTerm ||
          product?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          product?.description?.toLowerCase()?.includes(lowerCaseSearchTerm),
      )
      .filter(
        (product: any) =>
          !category ||
          product?.category?.name?.toLowerCase() === category.toLowerCase(),
      )
      .filter(
        (product: any) =>
          !category ||
          product?.category?.name
            ?.toLowerCase()
            .startsWith(category.toLowerCase()),
      )
      .filter(
        (product: any) =>
          !martplex ||
          product?.vendorStand?.name?.toLowerCase() === "martplex origin",
      );
  }, [
    selectedCategory,
    priceRange,
    onSale,
    inStock,
    products,
    searchTerm,
    category,
    martplex,
  ]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return filteredProducts?.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // console.log(paginatedProducts);

  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

  if (isError) {
    console.error("Product Fetching Error: ", error);
  }

  return (
    <div
      className="min-h-[80vh] pb-8 mt-8"
      style={{ backgroundAttachment: "fixed" }}
    >
      {/* Mobile Filter Toggle */}
      <div
        className="md:hidden sticky top-1 z-40 shadow p-4 mb-5"
        style={{
          backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
          color: "white",
        }}
      >
        <Button
          className="w-full"
          style={{
            backgroundImage: "linear-gradient(30deg, #2B709E, #032740)",
            color: "white",
          }}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar Filter */}
        {(showFilters || !loadingProducts) && (
          <div
            className={`${
              showFilters ? "block" : "hidden md:block"
            } w-full md:w-1/4 p-4 shadow-lg rounded-lg max-h-[80vh] sticky top-2 z-30`}
            style={{
              backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
            }}
          >
            <h3 className="text-xl font-semibold mb-6">Filters</h3>
            <div className="mb-4">
              <label className="font-medium" htmlFor="category">
                Category
              </label>
              <select
                className="w-full mt-2 p-2 border rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="font-medium" htmlFor="slider">
                Price Range
              </label>
              <div className="mt-2">
                <Slider
                  classNames={{
                    filler: "bg-gradient-to-r from-sky-600 to-sky-800",
                  }}
                  color="foreground"
                  defaultValue={[0, 1000]}
                  id="slider"
                  maxValue={5000}
                  minValue={0}
                  step={10}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <Checkbox
                isSelected={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
              >
                On Sale
              </Checkbox>
            </div>
            <div className="mb-4">
              <Checkbox
                isSelected={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              >
                In Stock
              </Checkbox>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => {
                setSelectedCategory("All");
                setPriceRange([0, 1000]);
                setOnSale(false);
                setInStock(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Products Grid */}
        <div className="w-full md:w-3/4">
          {loadingProducts ? (
            <div className="flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts?.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <span className="mx-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
