"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetAllProducts } from "@/src/hooks/product.hooks";
import ProductCard from "@/src/components/products/ProductCard";

interface RelatedProductsProps {
  categoryId: string;
}

const RelatedProducts = ({ categoryId }: RelatedProductsProps) => {
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const router = useRouter();
  const [clientProducts, setClientProducts] = useState<any[]>([]);

  console.log(products?.data);

  useEffect(() => {
    if (products?.data) {
      const filteredProducts = products.data.filter(
        (product: any) => product.categoryId === categoryId,
      );

      setClientProducts(filteredProducts);
    }
  }, [products]);

  const handleShowAll = () => {
    router.push(
      `product?category=${encodeURIComponent(clientProducts[0].category.name)}`,
    );
  };

  if (!loadingProducts && clientProducts.length === 0) {
    // Don't show the section if no products are on sale
    return null;
  }

  // // Determine grid layout and alignment
  // const isCentered = clientProducts.length <= 2;

  return (
    <div className="py-10 px-5 mt-4 bg-sky-100 w-[90vw]">
      <h1 className="text-3xl font-bold text-left mb-10 text-gray-800">
        Related Products
      </h1>
      <div className="flex justify-center">
        {loadingProducts && (
          <div className="text-center text-gray-600">Loading products...</div>
        )}

        {!loadingProducts && (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-center`}
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

export default RelatedProducts;
