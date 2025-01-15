'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ProductCard from '../products/ProductCard';

import { useGetAllProducts } from '@/src/hooks/product.hooks';

const OnSale = () => {
  const { data: products, isLoading: loadingProducts } = useGetAllProducts();
  const router = useRouter();
  const [clientProducts, setClientProducts] = useState<any[]>([]);

  useEffect(() => {
    if (products?.data) {
      const saleProducts = products.data.filter(
        (product: any) => product?.onSale === true,
      );

      setClientProducts(saleProducts);
    }
  }, [products]);

  const handleShowAll = () => {
    router.push('/products?sale=true');
  };

  if (!loadingProducts && clientProducts.length === 0) {
    // Don't show the section if no products are on sale
    return null;
  }

  // Determine grid layout and alignment
  const isCentered = clientProducts.length <= 2;
  const gridCols =
    clientProducts.length === 1
      ? 'grid-cols-1 w-fit'
      : clientProducts.length === 2
        ? 'grid-cols-1 sm:grid-cols-2 w-fit'
        : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="py-10 px-5 mt-0 bg-transparent w-[90vw]">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-3xl font-bold text-left mb-10 text-gray-800">
          On Sale
        </h1>
        {clientProducts.length > 4 && (
          <div className="flex items-center justify-center">
            <Button
              className="text-white hover:bg-blue-600"
              style={{
                backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
                color: 'white',
              }}
              onClick={handleShowAll}
            >
              Show All <span className="ml-2">→</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {loadingProducts && (
          <div className="text-center text-gray-600">Loading products...</div>
        )}

        {!loadingProducts && (
          <div
            className={`grid max-w-md ${gridCols} gap-6 ${
              isCentered ? 'justify-center' : ''
            }`}
          >
            {clientProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnSale;
