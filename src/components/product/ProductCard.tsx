'use client';

import { useUser } from '@/src/context/user.provider';
import { useCreateCart } from '@/src/hooks/cart.hooks';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
  Divider,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    vendorStand: { id: string; name: string };
    onSale: boolean;
    discount: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { mutate: createCartMutation, isPending: isCreatingCart } =
    useCreateCart();
  const { user } = useUser();
  const userId = user?.id;

  const {
    id,
    name,
    description,
    price,
    images,
    vendorStand,
    onSale,
    discount,
  } = product;

  const finalPrice = onSale
    ? (price - price * (discount / 100)).toFixed(2)
    : price.toFixed(2);

  const handleAddToCart = () => {
    if (!userId) {
      // Redirect to login page if user is not logged in
      router.push('/login');
      return;
    }

    const payload = {
      userId,
      vendorStandId: vendorStand.id,
      items: [{ productId: id, name, quantity: 1, price: Number(finalPrice) }],
    };

    console.log(payload);
    createCartMutation(payload);
  };

  return (
    <Card className="w-full h-full shadow-md transition-transform transform hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden">
      <Image
        alt={name}
        className="w-full h-48 object-cover"
        src={images[0] || 'https://i.ibb.co.com/t8FQT4M/7867792.png'}
      />
      <CardHeader className="flex justify-between items-center px-4 py-2">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-500">
            {vendorStand?.name || 'Unknown Vendor'}
          </p>
        </div>
        <div className="text-right flex flex-col">
          {onSale && (
            <span className="text-sm font-medium text-red-500 line-through mr-2">
              ${price.toFixed(2)}
            </span>
          )}
          <span className="text-lg font-bold text-green-600">
            ${finalPrice}
          </span>
        </div>
      </CardHeader>
      <CardBody className="px-4 py-2">
        <p className="text-gray-600 truncate">{description}</p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-end px-4 py-2">
        <Button
          className="text-white"
          color="primary"
          variant="solid"
          onClick={handleAddToCart}
          disabled={isCreatingCart}
        >
          {isCreatingCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
