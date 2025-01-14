"use client";

import { useEffect, useState } from "react";
import { Badge, Button } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHome, FaShoppingCart, FaUser } from "react-icons/fa";

import { useGetSingleVendorStand } from "@/src/hooks/vendorstand.hooks";
import { useUser } from "@/src/context/user.provider";
import ProductCard from "@/src/components/products/ProductCard";

interface IProps {
  params: {
    shopId: string;
  };
}

const Shop = ({ params: { shopId } }: IProps) => {
  const router = useRouter();
  const { data: vendorStandsData, isLoading: vendorLoading } =
    useGetSingleVendorStand(shopId);

  const { user } = useUser();
  const loggedUserId = user?.id;

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [navbarBg, setNavbarBg] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;

  const vendorStand: any = vendorStandsData?.data?.vendorStandInfo;
  const products: any[] =
    vendorStandsData?.data?.vendorStandInfo?.products || [];

  console.log("Products: ", products);

  const [totalFollowers, setTotalFollowers] = useState<number>(
    vendorStandsData?.data?.followers || 0,
  );

  const categories: string[] = Array.from(
    new Set<string>(products.map((product: any) => product?.category?.name)),
  );

  // Calculate Total Pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Filter and sort products based on selected category and sort option
  const filteredAndSortedProducts = products
    .filter((product: any) =>
      selectedCategory ? product?.category?.name === selectedCategory : true,
    )
    .sort((a: any, b: any) => {
      if (sortOption === "price-low-to-high") {
        return a.price - b.price;
      }
      if (sortOption === "price-high-to-low") {
        return b.price - a.price;
      }
      if (sortOption === "rating") {
        // Calculate average rating for each product
        const aAverageRating =
          a.reviews?.length > 0
            ? a.reviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0,
              ) / a.reviews.length
            : 0;

        const bAverageRating =
          b.reviews?.length > 0
            ? b.reviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0,
              ) / b.reviews.length
            : 0;

        // Sort by average rating in descending order
        return bAverageRating - aAverageRating;
      }

      return 0; // Default: no sorting
    });

  // Paginated products
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    setTotalFollowers((prev: number) => (isFollowing ? prev - 1 : prev + 1));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      setNavbarBg(scrollPosition > 200 ? true : false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle Pagination Buttons
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (vendorLoading) return <p>Loading...</p>;

  return (
    <div className="bg-transparent min-h-screen">
      {/* Sticky Navbar */}
      <div
        className={`fixed z-50 w-full top-0 flex justify-between items-center px-4 py-3 duration-1500 transition-transform-background`}
        style={{
          background: navbarBg
            ? "linear-gradient(314deg, #336B92, #8DC2EF)"
            : "transparent",
        }}
      >
        {/* Left Section */}
        <div className="flex items-center gap-2 cursor-pointer">
          <Image
            alt="MartPlex Logo"
            height={45}
            src="/MartPlex-Logo.png"
            width={45}
          />
          <p className="hidden sm:block">
            <span
              className="font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(0deg, #2B709E, #000000)",
                fontSize: "2rem",
              }}
            >
              MartPlex
            </span>
          </p>
        </div>
        {/* Right Section */}
        <div className="flex items-center gap-5">
          <FaHome
            className="text-white text-2xl cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => router.push("/")}
          />
          <FaUser
            className="text-white text-2xl cursor-pointer transform hover:scale-110 transition-transform"
            onClick={() => router.push(`/profile/${loggedUserId}`)}
          />
          <Badge color="danger" content="0">
            <FaShoppingCart className="text-white text-2xl cursor-pointer transform hover:scale-110 transition-transform" />
          </Badge>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative h-80 flex flex-col items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(314deg, #336B92, #8DC2EF)",
        }}
      >
        {vendorStand?.logo ? (
          <Image
            alt="Vendor Logo"
            className="rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-transform duration-300"
            height={120}
            src={vendorStand.logo}
            width={120}
          />
        ) : (
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold transform hover:scale-105 transition-transform duration-300"
            style={{
              backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
            }}
          >
            <span
              className="font-bold text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(0deg, #2B709E, #000000)",
              }}
            >
              {vendorStand?.name?.charAt(0)}
            </span>
          </div>
        )}
        <h1 className="text-white text-4xl font-bold mt-4">
          {vendorStand?.name}
        </h1>
        <div className="flex flex-col items-center">
          <p className="text-white mt-2 text-sm">
            <span className="font-semibold">{totalFollowers}</span> Followers
          </p>
          {vendorStand?.ownerId !== loggedUserId && loggedUserId && (
            <div className="mt-4 flex flex-row items-center gap-3">
              <Button
                className="px-4 py-2 text-white font-medium rounded-md shadow-md transform hover:scale-105 transition-transform duration-300"
                // color={isFollowing ? 'secondary' : 'primary'}
                style={{
                  backgroundImage: isFollowing
                    ? "linear-gradient(314deg, #927733, #efcd8d)"
                    : "linear-gradient(314deg, #336B92, #8DC2EF)",
                  backgroundAttachment: "fixed",
                }}
                onPress={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
              <Button
                className="px-4 py-2 text-white font-medium rounded-md shadow-md transform hover:scale-105 transition-transform duration-300"
                // color="danger"
                style={{
                  backgroundImage: "linear-gradient(314deg, #923333, #ef8d8d)",
                  backgroundAttachment: "fixed",
                }}
              >
                Report
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 my-8">
        <div className="flex justify-end items-center">
          <div className="flex gap-4 items-center">
            {vendorStand?.ownerId === loggedUserId && (
              <Button
                color="primary"
                style={{
                  backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
                  color: "white",
                }}
                onPress={() => router.push(`/shop-dashboard/overview`)}
              >
                Shop Dashboard
              </Button>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center mt-2">
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
            <select
              className="p-2 border rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price-high-to-low">Price: High-Low</option>
              <option value="price-low-to-high">Price: Low-High</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold">Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <Button disabled={currentPage === 1} onPress={handlePreviousPage}>
            Previous
          </Button>
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <Button
            disabled={currentPage === totalPages}
            onPress={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
