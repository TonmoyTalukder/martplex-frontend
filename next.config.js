/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        'blue-dark': '#336B92',
        'blue-light': '#8DC2EF',
      },
    },
  },
};

module.exports = nextConfig;
