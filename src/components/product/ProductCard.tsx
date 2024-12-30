"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { useUser } from "@/src/context/user.provider";
import { useCreateCart, useFetchCart } from "@/src/hooks/cart.hooks";

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

  const { data: cartData } = useFetchCart(userId || "");
  const cart = cartData?.data?.cartInfo;

  console.log("cart ", cart);

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

  // State to control tooltip visibility
  const [showVendorTooltip, setShowVendorTooltip] = useState(false);

  // Automatically hide the tooltip after a certain time
  useEffect(() => {
    if (showVendorTooltip) {
      const timer = setTimeout(() => setShowVendorTooltip(false), 1500);

      return () => clearTimeout(timer);
    }
  }, [showVendorTooltip]);

  const handleAddToCart = () => {
    if (!userId) {
      // Redirect to login page if user is not logged in
      router.push("/login");

      return;
    }

    if (cart?.items?.length > 0 && cart?.vendorId !== vendorStand.id) {
      console.log("cart?.vendorStandId ", cart?.vendorId);
      console.log("vendorStand.id ", vendorStand.id);
      // Trigger the tooltip to show the restriction message
      setShowVendorTooltip(true);

      return;
    } else {
      setShowVendorTooltip(false);
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
        src={images[0] || "https://i.ibb.co.com/t8FQT4M/7867792.png"}
      />
      <CardHeader className="flex justify-between items-center px-4 py-2">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-gray-500">
            {vendorStand?.name || "Unknown Vendor"}
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
        {user && user?.role !== "CUSTOMER" ? (
          <Tooltip content="Only customers can buy" placement="top">
            <Button
              disabled
              className="text-white"
              color="primary"
              variant="solid"
            >
              Add to Cart
            </Button>
          </Tooltip>
        ) : (
          <Tooltip
            content={
              showVendorTooltip
                ? "You can only add products from one vendor at a time."
                : "Add to Cart"
            }
            isOpen={showVendorTooltip}
            placement="top"
          >
            <Button
              className="text-white"
              color="primary"
              disabled={isCreatingCart}
              variant="solid"
              onClick={handleAddToCart}
            >
              {isCreatingCart ? "Adding..." : "Add to Cart"}
            </Button>
          </Tooltip>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
