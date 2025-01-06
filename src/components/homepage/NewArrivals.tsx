"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProductCard from "../products/ProductCard";

import { useGetAllProducts } from "@/src/hooks/product.hooks";

const NewArrivals = () => {
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const router = useRouter();
  const [clientProducts, setClientProducts] = useState<any[]>([]);

  useEffect(() => {
    if (products?.data) {
      setClientProducts(products.data);
    }
  }, [products]);

  const handleShowAll = () => {
    router.push("/products");
  };

  return (
    <div className="py-10 px-5 mt-5 bg-sky-100 rounded-t-lg w-[90vw]">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        New Arrivals
      </h1>

      {loadingProducts && (
        <div className="text-center text-gray-600">Loading products...</div>
      )}

      {!loadingProducts && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientProducts.slice(0, 3).map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <div className="flex items-center justify-center">
            <Button
              className="text-white hover:bg-blue-600"
              style={{
                backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
                color: "white",
              }}
              onClick={handleShowAll}
            >
              Show All <span className="ml-2">→</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
