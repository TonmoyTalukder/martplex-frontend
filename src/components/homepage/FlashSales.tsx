'use client';

import {
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  Tooltip,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetAllFlashSales } from '@/src/hooks/flashsale.hooks';
import ProductCard from '../products/ProductCard';

const FlashSales = () => {
  const { data: flashsales, isLoading: loadingFlashSales } =
    useGetAllFlashSales();
  const router = useRouter();

  const [remainingTime, setRemainingTime] = useState<string>('');

  // Determine the latest flash sale
  const latestFlashSale = flashsales ? flashsales[0] : null;

  useEffect(() => {
    if (latestFlashSale) {
      const updateTimer = () => {
        const now = new Date();
        const end = new Date(latestFlashSale.endsAt);
        const diff = end.getTime() - now.getTime();

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setRemainingTime('Expired');
        }
      };

      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [latestFlashSale]);

  const handleShowAll = () => {
    router.push('/products');
  };

  return (
    <div className="py-10 px-5 mt-5 w-[90vw] mx-auto bg-transparent">
      <h1 className="text-4xl font-extrabold text-left mb-8">Flash Sale 🚀</h1>

      {loadingFlashSales && (
        <div className="text-center text-gray-600">Loading flash sales...</div>
      )}

      {latestFlashSale && (
        <div>
          <Card className="mb-8 bg-transparent">
            <CardBody>
              <div className="flex justify-between items-start w-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {latestFlashSale.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {latestFlashSale.description}
                  </p>
                  <p className="text-gray-600 mt-2 text-2xl">
                    Get {latestFlashSale.discount}% flash discount.
                  </p>
                  <p className="text-red-500 text-3xl font-semibold mt-3">
                    {`Ends In: ${remainingTime}`}
                  </p>
                </div>
                <div className="mt-8 text-center">
                  <Button
                    size="lg"
                    onPress={handleShowAll}
                    className="shadow-md"
                    style={{
                      backgroundImage:
                        'linear-gradient(314deg, #336B92, #8DC2EF)',
                      color: 'white',
                    }}
                  >
                    Shop All Products
                  </Button>
                </div>
              </div>
              <Divider className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {latestFlashSale.products.slice(0, 4).map((product: any) => (
                  //   <Card key={product.id} className="shadow-md">
                  //     <Image
                  //       src={product.images[0]}
                  //       alt={product.name}
                  //       className="w-full h-48 object-cover rounded-t-lg"
                  //     />
                  //     <CardBody>
                  //       <h3 className="text-xl font-semibold text-gray-800">
                  //         {product.name}
                  //       </h3>
                  //       <p className="text-gray-600 truncate">
                  //         {product.description}
                  //       </p>
                  //       <div className="mt-3 flex items-center justify-between">
                  //         <span className="text-lg font-bold text-purple-700">
                  //           ${product.price.toFixed(2)}
                  //         </span>
                  //         <Tooltip content="View Product">
                  //           <Button
                  //             size="sm"
                  //             variant="shadow"
                  //             onPress={() =>
                  //               router.push(`/product/${product.id}`)
                  //             }
                  //           >
                  //             View
                  //           </Button>
                  //         </Tooltip>
                  //       </div>
                  //     </CardBody>
                  //   </Card>
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {!loadingFlashSales && !latestFlashSale && (
        <div className="text-center text-gray-600">
          No active flash sales at the moment.
        </div>
      )}
    </div>
  );
};

export default FlashSales;
