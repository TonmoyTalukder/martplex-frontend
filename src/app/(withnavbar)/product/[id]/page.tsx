"use client";

import React, { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { ImHeadphones } from "react-icons/im";
import { FaShop } from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";
import Image from "next/image";
import { Tabs, Tab, Button, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  MdOutlineStarPurple500,
  MdOutlineStarHalf,
  MdOutlineStarOutline,
} from "react-icons/md";

import RelatedProducts from "../RelatedProducts";
import RecentProducts from "../RecentProducts";
import ReviewProduct from "../ReviewProduct";

import { useUser } from "@/src/context/user.provider";
import { useCreateCart, useFetchCart } from "@/src/hooks/cart.hooks";
import { useGetSingleProduct } from "@/src/hooks/product.hooks";

interface ProductPageProps {
  params: { id: string };
}

const getLatestOrderIdForUser = (
  orderItems: any[],
  userId: string | undefined,
) => {
  if (!userId) return null; // Return null if userId is not defined

  // Filter items for the matching userId
  const matchingOrders = orderItems.filter(
    (item) => item.order?.userId === userId,
  );

  // Sort by createdAt in descending order and return the latest orderId
  const latestOrder = matchingOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return latestOrder ? latestOrder.orderId : null;
};

const ProductDetailPage = ({ params }: ProductPageProps) => {
  const { id } = params;
  const {
    data: productData,
    isLoading: loadingProducts,
    isError,
  } = useGetSingleProduct(id);

  const productInfo = productData?.data?.productInfo;
  const [mainImage, setMainImage] = useState(
    productInfo?.images[0] || "https://i.ibb.co/t8FQT4M/7867792.png",
  );
  const { user } = useUser();
  const userId = user?.id;
  const { data: cartData } = useFetchCart(userId || "");
  const { mutate: createCartMutation, isPending: isCreatingCart } =
    useCreateCart();
  const cart = cartData?.data?.cartInfo;
  const [showVendorTooltip, setShowVendorTooltip] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (productInfo) {
      console.log("Product Info: ", productInfo);
      setMainImage(
        productInfo?.images[0] || "https://i.ibb.co/t8FQT4M/7867792.png",
      );
    }
  }, [productInfo]);

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  const finalPrice = productInfo?.onSale
    ? (
        productInfo?.price -
        productInfo?.price * (productInfo?.discount / 100)
      ).toFixed(2)
    : productInfo?.price.toFixed(2);

  const averageRating =
    productInfo?.reviews.length > 0
      ? productInfo?.reviews.reduce(
          (sum: any, review: { rating: any }) => sum + review.rating,
          0,
        ) / productInfo?.reviews.length
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

  const handleAddToCart = () => {
    if (!userId) {
      router.push("/login");

      return;
    }

    if (
      cart?.items?.length > 0 &&
      cart?.vendorId !== productInfo?.vendorStand.id
    ) {
      setShowVendorTooltip(true);

      return;
    } else {
      setShowVendorTooltip(false);
    }

    const payload = {
      userId,
      vendorStandId: productInfo?.vendorStand.id,
      items: [{ productId: id, name, quantity: 1, price: Number(finalPrice) }],
    };

    createCartMutation(payload);
  };

  if (loadingProducts) {
    return <div>Loading...</div>;
  }

  if (isError || !productInfo) {
    return <div>Error loading product details.</div>;
  }

  return (
    <div className="h-auto bg-transparent w-[90vw] mx-auto">
      <div className="w-full flex flex-col gap-4 mx-auto bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row mb-12">
          {/* Product Image */}
          <div className="md:w-2/5 p-6">
            <Image
              alt={productInfo.name}
              className="object-cover rounded-md w-auto h-full max-h-[55vh] mx-auto"
              height={300}
              src={mainImage}
              width={300}
            />
            <div className="flex mt-4 space-x-2">
              {productInfo.images.map((image: string, index: number) => (
                <Image
                  key={index}
                  alt={`Thumbnail ${index + 1}`}
                  className="cursor-pointer rounded-md border border-gray-200"
                  height={100}
                  src={image}
                  width={100}
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-3/5 p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {productInfo.name}
            </h1>
            <div className="flex flex-wrap gap-4 items-center my-2">
              <p className="flex flex-row items-center gap-2 text-sky-700">
                <FaShop className="text-lg" />
                <button
                  className="text-gray-700 text-lg font-medium cursor-pointer text-blue-500 hover:underline focus:outline-none"
                  onClick={() =>
                    router.push(`/vendor-stand/${productInfo.vendorStand?.id}`)
                  }
                >
                  {productInfo.vendorStand?.name || "Unknown"}
                </button>
              </p>

              <p className="flex flex-row items-center gap-2 text-sky-700">
                <TbCategory />
                <button
                  className="text-gray-700 text-lg font-medium cursor-pointer text-blue-500 hover:underline focus:outline-none"
                  onClick={() =>
                    router.push(`/vendor/${productInfo.vendorStand?.id}`)
                  }
                >
                  {productInfo.category?.name || "Unknown"}
                </button>
              </p>
            </div>
            <div className="flex items-center text-lg my-2">
              {renderStars(averageRating)}
              <span className="ml-2 text-lg text-gray-700">
                {averageRating?.toFixed(1)}
              </span>
            </div>

            <div className="my-6 text-justify">
              <h1 className="font-bold text-xl">Attention: </h1>
              <p>
                Product Images are uploaded for your attention and easy to
                recognize. If you want to see the original product Image and
                video, just contact us.
              </p>
              <p className="my-4">
                <span className="before:block before:absolute before:-inset-1 before:-skew-y-1 before:bg-yellow-200 relative inline-block">
                  <span className="relative text-black">
                    1-3 Business days Delivery
                  </span>
                </span>
              </p>
              <p>
                Delivery Call +880 1700 000000 to inquire about your delivery
                process.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-wrap items-center gap-2 border-1 p-2 rounded-md ">
                <div className="text-sky-700 font-bold text-4xl">
                  <TbTruckDelivery />
                </div>
                <div>
                  <h1 className="text-xl">FREE SHIPPING & RETURN</h1>
                  <p>Free shipping on all orders over ৳99.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-1 p-2 rounded-md">
                <div className="text-sky-700 font-bold text-4xl">
                  <ImHeadphones />
                </div>
                <div>
                  <h1 className="text-xl">ONLINE SUPPORT 24/7</h1>
                  <p>We available to support you 24/7.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-6">
              {productInfo.onSale && (
                <span className="text-md font-medium text-red-500 line-through mr-2">
                  ৳ {productInfo?.price?.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-semibold text-green-600 mb-6">
                ৳ {finalPrice}
              </span>

              <div className="mb-3">
                {productInfo.stock > 0 ? (
                  <p className="text-gray-700 font-medium text-lg">
                    Stock Available: {productInfo.stock}
                  </p>
                ) : (
                  <p className="text-red-500 font-medium text-lg">
                    Out of stock
                  </p>
                )}
              </div>
            </div>

            {user && user?.role !== "CUSTOMER" ? (
              <Tooltip content="Only customers can buy" placement="top">
                <Button
                  disabled
                  color="secondary"
                  style={{
                    backgroundImage:
                      "linear-gradient(314deg, #336B92, #8DC2EF)",
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
                    backgroundImage:
                      "linear-gradient(314deg, #336B92, #8DC2EF)",
                    backgroundAttachment: "fixed",
                  }}
                  onClick={handleAddToCart}
                >
                  {isCreatingCart ? "Adding..." : "Add to Cart"}
                </Button>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col mt-12">
          <Tabs aria-label="Options" size="lg" variant="underlined">
            <Tab key="details" title="Details">
              <div className="p-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 mb-4 text-justify">
                  {productInfo.description}
                </p>
              </div>
            </Tab>
            <Tab key="reviews" title="Reviews">
              {/* Reviews Section */}
              {productInfo && (
                <div className="p-2">
                  <ReviewProduct
                    orderId={getLatestOrderIdForUser(
                      productInfo.orderItems,
                      userId,
                    )}
                    productId={productInfo.id}
                    productInfo={productInfo}
                    userId={userId}
                    userRole={user?.role}
                    vendorStandId={productInfo.vendorStand.id}
                  />
                </div>
              )}
            </Tab>
          </Tabs>
        </div>

        <div className="rounded-lg bg-sky-100 w-[90vw] mb-4">
          <RelatedProducts categoryId={productInfo.category.id} />

          {userId ? (
            <div className="mb-0">
              <RecentProducts productId={productInfo.id} userId={userId} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
