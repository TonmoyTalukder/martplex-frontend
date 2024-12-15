'use client';

import { useState } from 'react';
import { Badge, Button, Textarea } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa';

import {
  useGetProductsByVendorStand,
  useGetSingleVendorStand,
} from '@/src/hooks/vendorstand.hooks';
import { useUser } from '@/src/context/user.provider';

interface IProps {
  params: {
    shopId: string;
  };
}

const Shop = ({ params: { shopId } }: IProps) => {
  const router = useRouter();
  const { data: vendorStandsData, isLoading: vendorLoading } =
    useGetSingleVendorStand(shopId);
  const { data: productsData, isLoading: productsLoading } =
    useGetProductsByVendorStand(shopId);
  const { user } = useUser();
  const loggedUserId = user?.id;

  const [reviewText, setReviewText] = useState<string>('');
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const vendorStand: any = vendorStandsData?.data?.vendorStandInfo;
  const products: any[] = productsData?.data?.products || [];
  const reviews: any[] = vendorStandsData?.data?.reviews || [];
  const [totalFollowers, setTotalFollowers] = useState<number>(
    vendorStandsData?.data?.followers || 0,
  );

  const categories: string[] = Array.from(
    new Set<string>(products.map((product: any) => product.category)),
  );

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredProducts = selectedCategory
    ? products.filter((product: any) => product.category === selectedCategory)
    : products;

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    setTotalFollowers((prev: number) => (isFollowing ? prev - 1 : prev + 1));
  };

  const handleSubmitReview = () => {
    console.log('Review Submitted:', reviewText);
    setReviewText('');
  };

  const handleReply = (reviewId: string, replyText: string) => {
    console.log('Reply Submitted:', { reviewId, replyText });
  };

  if (vendorLoading || productsLoading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="relative h-80 bg-gradient-to-r from-blue-400 to-purple-600 flex flex-col items-center justify-center shadow-lg">
        {/* Logo */}
        {vendorStand?.logo ? (
          <Image
            alt="Vendor Logo"
            className="rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            height={120}
            src={vendorStand.logo}
            width={120}
          />
        ) : (
          <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold transform hover:scale-105 transition-transform duration-300">
            {vendorStand?.name?.charAt(0)}
          </div>
        )}
        <h1 className="text-white text-4xl font-bold mt-4">
          {vendorStand?.name}
        </h1>
        <div className="flex flex-col items-center">
          <p className="text-white mt-2 text-sm">
            <span className="font-semibold">{totalFollowers}</span> Followers
          </p>
          {vendorStand?.ownerId !== loggedUserId && (
            <div className="mt-4 flex flex-row items-center gap-3">
              <Button
                className="px-4 py-2 text-white font-medium rounded-md shadow-md transform hover:scale-105 transition-transform duration-300"
                color={isFollowing ? 'secondary' : 'primary'}
                onPress={handleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>

              <Button
                className="px-4 py-2 text-white font-medium rounded-md shadow-md transform hover:scale-105 transition-transform duration-300"
                color="danger"
                // onPress={handleFollow}
              >
                Report
              </Button>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="fixed z-50 left-4 right-0 top-9 flex justify-start items-center gap-5 px-4">
          <div className="text-white text-2xl font-bold cursor-pointer transform hover:scale-110 transition-transform">
            <p>MartPlex</p>
          </div>
        </div>
        <div className="fixed z-50 left-0 right-4 top-9 flex justify-end items-center gap-5 px-4">
          <FaHome
            className="text-white text-2xl cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => router.push('/')}
          />
          <FaUser
            className="text-white text-2xl cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => router.push(`/profile/${loggedUserId}`)}
          />
          <Badge color="danger" content="0">
            <FaShoppingCart
              className="text-white text-2xl cursor-pointer transform hover:scale-110 transition-transform"
              // onClick={() => router.push('/cart')}
            />
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Products</h2>
          <div className="flex gap-4 items-center">
            <select
              className="p-2 border rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category: string) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select className="p-2 border rounded-md">
              <option value="">Sort By</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: any) => (
              <div key={product.id} className="bg-white p-4 shadow rounded-lg">
                <Image
                  alt={product.name}
                  className="rounded"
                  height={200}
                  src={product.image}
                  width={300}
                />
                <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-gray-800 font-semibold mt-1">
                  ${product.price}
                </p>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-800 font-semibold">
                    {review.userName}
                  </p>
                  <p className="text-gray-600">{review.text}</p>
                  {vendorStand?.ownerId === loggedUserId && (
                    <Textarea
                      placeholder="Write a reply..."
                      onChange={(e) => handleReply(review.id, e.target.value)}
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
          {vendorStand?.ownerId === loggedUserId && (
            <div className="mt-4 flex flex-col justify-center items-center gap-3 p-8">
              <Textarea
                isClearable
                className="w-[50vw]"
                placeholder="Write your review..."
                value={reviewText}
                variant="underlined"
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Button
                color="primary"
                className="mt-2"
                onPress={handleSubmitReview}
              >
                Submit Review
              </Button>
            </div>
          )}
        </div>
      </div>

      {vendorStand?.ownerId === loggedUserId && (
        <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
          <Button
            color="primary"
            onPress={() => router.push(`/shop-dashboard/${shopId}`)}
          >
            Shop Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Shop;
