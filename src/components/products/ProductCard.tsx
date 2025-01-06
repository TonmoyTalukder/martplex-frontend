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
import {
  MdOutlineStarPurple500,
  MdOutlineStarHalf,
  MdOutlineStarOutline,
} from "react-icons/md";

import { useUser } from "@/src/context/user.provider";
import { useCreateCart, useFetchCart } from "@/src/hooks/cart.hooks";

interface review {
  id: string;
  rating: number;
}
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
    reviews: review[];
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

  const {
    id,
    name,
    description,
    price,
    images,
    vendorStand,
    onSale,
    discount,
    reviews,
  } = product;

  const finalPrice = onSale
    ? (price - price * (discount / 100))?.toFixed(2)
    : price?.toFixed(2);

  const [showVendorTooltip, setShowVendorTooltip] = useState(false);

  useEffect(() => {
    if (showVendorTooltip) {
      const timer = setTimeout(() => setShowVendorTooltip(false), 1500);

      return () => clearTimeout(timer);
    }
  }, [showVendorTooltip]);

  const handleAddToCart = () => {
    if (!userId) {
      router.push("/login");

      return;
    }

    if (cart?.items?.length > 0 && cart?.vendorId !== vendorStand.id) {
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

    createCartMutation(payload);
  };

  const averageRating =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews?.length
      : 0;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <MdOutlineStarPurple500
            key={`full-${i}`}
            className="text-yellow-500"
          />
        ))}
        {halfStar === 1 && <MdOutlineStarHalf className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <MdOutlineStarOutline key={`empty-${i}`} className="text-gray-400" />
        ))}
      </>
    );
  };

  const handleViewDetails = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Card className="w-full h-full shadow-md transition-transform transform hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden bg-[#e9f3fa]">
      <div className="flex justify-center items-center h-48 w-full bg-white">
        <Image
          alt={name}
          className="w-full object-cover max-h-48"
          src={images[0] || "https://i.ibb.co/t8FQT4M/7867792.png"}
        />
      </div>
      <CardHeader className="flex justify-between items-center px-4 py-2">
        <div className="w-full">
          <h2 className="text-xl font-semibold">
            {name
              .split(" ")
              .slice(0, 4)
              .join(" ")
              .concat(name.split(" ").length > 4 ? "..." : "")}
          </h2>
          <p className="text-sm text-gray-500">{vendorStand?.name || ""}</p>
        </div>
      </CardHeader>
      <CardBody className="px-4 py-2">
        <p className="text-gray-600 truncate">{description}</p>
        <div className="text-left mt-2 flex flex-col">
          {onSale && (
            <span className="flex flex-col text-sm font-medium text-red-500 line-through mr-2">
              ৳ {price?.toFixed(2)}
            </span>
          )}
          <span className="flex flex-col text-lg font-bold text-green-600">
            ৳ {finalPrice}
          </span>
        </div>
        <div className="flex items-center mt-2">
          {renderStars(averageRating)}
          <span className="ml-2 text-sm text-gray-700">
            {averageRating?.toFixed(1)}
          </span>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between px-4 py-2">
        <Button
          className="text-white"
          color="secondary"
          style={{
            backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
            backgroundAttachment: "fixed",
          }}
          onClick={handleViewDetails}
        >
          View Details
        </Button>
        {user && user?.role !== "CUSTOMER" ? (
          <Tooltip content="Only customers can buy" placement="top">
            <Button
              disabled
              color="secondary"
              style={{
                backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
                backgroundAttachment: "fixed",
              }}
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
              color="secondary"
              disabled={isCreatingCart}
              style={{
                backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
                backgroundAttachment: "fixed",
              }}
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
