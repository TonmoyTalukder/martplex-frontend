"use client";

import { Card, Button, CardFooter, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Electronics",
    link: "electronics",
    image: "/electronics.png",
    description: "Explore the latest and greatest in electronics.",
  },
  {
    name: "Fashion",
    link: "fashion",
    image: "/fashion.png",
    description: "Stay trendy with the latest fashion.",
  },
  {
    name: "Home Appliances",
    link: "home appliances",
    image: "/home-appliances.png",
    description: "Upgrade your home with cutting-edge appliances.",
  },
  {
    name: "Beauty Products",
    link: "beauty products",
    image: "/beauty.png",
    description: "Discover beauty essentials just for you.",
  },
];

const SelectedCategories = () => {
  const router = useRouter();

  const handleCategoryClick = (categoryLink: string) => {
    router.push(`/product?category=${encodeURIComponent(categoryLink)}`);
  };

  return (
    <div className="py-10 px-5 mt-5 w-[90vw]">
      {/* Section Heading */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Explore Selected Categories
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Card
            key={index}
            isHoverable
            isPressable
            className="bg-[#c2e0f4] flex flex-col"
          >
            {/* Image Section */}
            <CardBody style={{ padding: 0 }}>
              <img
                alt={category.name}
                className="w-full h-48 object-cover rounded-t-lg"
                src={category.image}
              />
            </CardBody>

            {/* Content Section */}
            <CardFooter className="flex flex-col items-start p-4">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>
              <Button
                className="text-white hover:bg-sky-400 w-full"
                style={{
                  backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
                  backgroundAttachment: "fixed",
                }}
                onClick={() => handleCategoryClick(category.link)}
              >
                Shop Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SelectedCategories;
