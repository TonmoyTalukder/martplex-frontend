"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  useCreateRecentProduct,
  useGetAllRecentProducts,
} from "@/src/hooks/product.hooks";

interface RecentProductsProps {
  userId: string;
  productId: string;
}

const RecentProducts = ({ userId, productId }: RecentProductsProps) => {
  const { data: recentProducts, isLoading: loadingRecentProducts } =
    useGetAllRecentProducts();
  const { mutate: createRecentProductMutation } = useCreateRecentProduct();
  const router = useRouter();

  const [clientProducts, setClientProducts] = useState<any[]>([]);

  useEffect(() => {
    if (recentProducts?.data && Array.isArray(recentProducts.data)) {
      const filteredProducts = recentProducts.data
        .filter((product: any) => product.productId !== productId)
        .map((clientProduct: any) => clientProduct.product); // Extract only the product objects

      setClientProducts(filteredProducts || []); // Ensure it is always an array
    } else {
      setClientProducts([]);
    }
  }, [recentProducts, productId]);

  useEffect(() => {
    if (userId) {
      const payload = {
        userId,
        productId,
        viewedAt: new Date().toISOString(),
      };

      createRecentProductMutation(payload);
    }
  }, [productId, userId]);

  const handleViewDetails = (id: string) => {
    router.push(`/product/${id}`);
  };

  if (loadingRecentProducts) {
    return <div className="text-center text-gray-600">Loading products...</div>;
  }

  if (!Array.isArray(clientProducts) || clientProducts.length === 0) {
    // Check if clientProducts is an array and has elements
    return null; // Avoid rendering when there are no products
  }

  console.log("Client Products: ", clientProducts);

  const isCentered = clientProducts.length <= 2;

  return (
    <div className="py-10 px-5 rounded-b-lg bg-amber-100 w-[90vw]">
      <h1 className="text-3xl font-bold text-left mb-10 text-gray-800">
        Recently Viewed Products
      </h1>
      <div className="flex justify-center">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 ${
            isCentered ? "justify-center" : ""
          }`}
        >
          {clientProducts.slice(0, 4).map((product: any) => (
            <div
              key={product.id}
              className="bg-transparent rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 p-5 max-w-[400px]"
            >
              <img
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
                src={product.images[0]}
              />
              <h2 className="text-lg font-semibold text-gray-700">
                {product.name.split(" ").slice(0, 3).join(" ")}
                {product.name.split(" ").length > 3 ? "..." : ""}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {product.description.split(" ").slice(0, 10).join(" ")}
                {product.description.split(" ").length > 10 ? "..." : ""}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800 flex flex-col">
                  ৳ {product.price.toFixed(2)}
                </span>
                <Button
                  className="text-white"
                  color="secondary"
                  style={{
                    backgroundImage:
                      "linear-gradient(314deg, #336B92, #8DC2EF)",
                    backgroundAttachment: "fixed",
                  }}
                  onClick={() => {
                    handleViewDetails(product.id);
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentProducts;
