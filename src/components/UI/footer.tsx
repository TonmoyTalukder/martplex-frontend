"use client";

import { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000); // Animation lasts for 3 seconds
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-200 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-auto w-[90vw]">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">About Us</h3>
          <p className="text-sm text-gray-400 text-justify">
            We are dedicated to providing the best products at unbeatable
            prices, ensuring customer satisfaction at every step.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>
              <a className="hover:text-gray-100" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-gray-100" href="/products">
                Products
              </a>
            </li>
            <li>
              <a className="hover:text-gray-100" href="/about">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-gray-100" href="/contact">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-sm text-gray-400">Email: support@martplex.com</p>
          <p className="text-sm text-gray-400">Phone: +1 234 567 890</p>
          <p className="text-sm text-gray-400">
            Address: 123 Market Street, NY
          </p>
        </div>

        {/* Newsletter Section */}
        <div className="relative">
          <h3 className="text-lg font-semibold mb-4">
            Subscribe to our Newsletter
          </h3>
          <div className="relative">
            <input
              className="w-full px-4 py-2 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className={`absolute right-0 top-0 bottom-0 px-4 rounded-r-md transition-all flex items-center justify-center ${
                subscribed
                  ? "bg-sky-600 text-white"
                  : "hover:bg-sky-500 text-white"
              }`}
              style={{
                backgroundImage: subscribed
                  ? undefined
                  : "linear-gradient(314deg, #336B92, #8DC2EF)",
                backgroundAttachment: "fixed",
              }}
              onClick={handleSubscribe}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="md:col-span-3 lg:col-span-4 flex justify-center mt-8 space-x-6">
          <a
            className="text-gray-400 hover:text-blue-500 transition-all text-2xl"
            href="https://facebook.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaFacebookF />
          </a>
          <a
            className="text-gray-400 hover:text-white transition-all text-2xl"
            href="https://tx.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaXTwitter />
          </a>
          <a
            className="text-gray-400 hover:text-pink-500 transition-all text-2xl"
            href="https://instagram.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaInstagram />
          </a>
          <a
            className="text-gray-400 hover:text-red-500 transition-all text-2xl"
            href="https://youtube.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaYoutube />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-500">
        © {currentYear} MartPlex. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
