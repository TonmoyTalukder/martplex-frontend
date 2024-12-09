"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto py-10">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About Cheffy
        </h1>

        {/* Accordion Sections */}
        <Accordion variant="shadow" className="mb-8">
          {/* Mission Section */}
          <AccordionItem
            key="mission"
            aria-label="Our Mission"
            title="Our Mission"
          >
            <p className="text-gray-600 text-lg">
              Cheffy aims to create a platform where food lovers from around the
              world can connect, share, and explore new recipes. We’re dedicated
              to inspiring creativity in the kitchen and fostering a community
              of passionate home cooks and professional chefs alike.
            </p>
          </AccordionItem>

          {/* Journey Section */}
          <AccordionItem
            key="journey"
            aria-label="Our Journey"
            title="Our Journey"
          >
            <p className="text-gray-600 text-lg">
              Cheffy started as a simple idea in 2020, driven by a group of
              foodies who wanted to create a space for sharing recipes. Over the
              years, it has grown into a vibrant community of cooking
              enthusiasts, with thousands of recipes shared daily. We’re proud
              to continue growing with the help of our passionate users.
            </p>
          </AccordionItem>

          {/* Team Section */}
          <AccordionItem
            key="team"
            aria-label="Meet the Team"
            title="Meet the Team"
          >
            <p className="text-gray-600 text-lg">
              Our team consists of experienced chefs, developers, and
              food-lovers. We are committed to creating a platform that is easy
              to use, fun, and beneficial to the global food community. Join us
              in making Cheffy the go-to social network for recipes!
            </p>
          </AccordionItem>

          {/* Social Media History */}
          <AccordionItem
            key="social-media"
            aria-label="Cheffy’s Social Media Impact"
            title="Cheffy’s Social Media Impact"
          >
            <p className="text-gray-600 text-lg">
              Cheffy has quickly grown across social media platforms, allowing
              food enthusiasts to share their culinary creations. With a strong
              presence on Instagram, TikTok, and YouTube, our community
              continues to inspire and engage through shared recipes, live
              cooking sessions, and user-generated content.
            </p>
          </AccordionItem>
        </Accordion>

        {/* Footer Section with Links */}
        <footer className="flex justify-center mt-10 space-x-8 text-lg text-blue-500">
          <a href="/" onClick={() => router.push("/")}>
            Home
          </a>
          <a href="/contact-us" onClick={() => router.push("/contact-us")}>
            Contact Us
          </a>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
