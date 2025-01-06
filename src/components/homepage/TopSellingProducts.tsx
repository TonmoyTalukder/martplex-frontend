"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "../products/ProductCard";

import { useGetAllProducts } from "@/src/hooks/product.hooks";

const TopSellingProducts = () => {
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const router = useRouter();
  const [clientProducts, setClientProducts] = useState<any[]>([]);

  useEffect(() => {
    if (products?.data) {
      const topSellingProducts = products.data.sort(
        (a: any, b: any) =>
          (b.orderItems?.length || 0) - (a.orderItems?.length || 0),
      );

      setClientProducts(topSellingProducts);
    }
  }, [products]);

  const handleShowAll = () => {
    router.push("/products");
  };

  if (!loadingProducts && clientProducts.length === 0) {
    // Don't show the section if no products are on sale
    return null;
  }

  // Determine grid layout and alignment
  const isCentered = clientProducts.length <= 2;
  const gridCols =
    clientProducts.length === 1
      ? "grid-cols-1 w-fit"
      : clientProducts.length === 2
        ? "grid-cols-1 sm:grid-cols-2 w-fit"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className="py-10 px-5 mt-0 bg-sky-100 w-[90vw]">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Buy Our Top Selling Products
      </h1>
      <div className="flex justify-center">
        {loadingProducts && (
          <div className="text-center text-gray-600">Loading products...</div>
        )}

        {!loadingProducts && (
          <div
            className={`grid ${gridCols} gap-6 ${
              isCentered ? "justify-center" : ""
            }`}
          >
            {clientProducts.slice(0, 3).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {clientProducts.length > 3 && (
              <div className="flex items-center justify-center">
                <Button
                  className="text-white hover:bg-blue-600"
                  style={{
                    backgroundImage:
                      "linear-gradient(314deg, #336B92, #8DC2EF)",
                    color: "white",
                  }}
                  onClick={handleShowAll}
                >
                  Show All <span className="ml-2">→</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSellingProducts;
