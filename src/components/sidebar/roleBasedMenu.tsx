import { FaHome, FaUser, FaUsers } from "react-icons/fa";
import { BiSolidOffer, BiSolidShoppingBag } from "react-icons/bi";
import { FaShop } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { ReactNode } from "react";

export interface MenuItem {
  icon: ReactNode;
  label: string;
  path: string;
}

export const CustomerMenuItems: MenuItem[] = [
  { icon: <FaHome className="w-6 h-6" />, label: "Home", path: "/" },
  {
    icon: <FaUser className="w-6 h-6" />,
    label: "Profile",
    path: "/profile/:id",
  },
  {
    icon: <BiSolidShoppingBag className="w-6 h-6" />,
    label: "Order",
    path: "/order",
  },
];

export const VendorMenuItems: MenuItem[] = [
  { icon: <FaHome className="w-6 h-6" />, label: "Home", path: "/" },
  {
    icon: <FaUser className="w-6 h-6" />,
    label: "Profile",
    path: "/profile/:id",
  },
  {
    icon: <FaShop className="w-6 h-6" />,
    label: "Vendor Stands",
    path: "/vendor-stands",
  },
];

export const AdminMenuItems: MenuItem[] = [
  { icon: <FaHome className="w-6 h-6" />, label: "Home", path: "/" },
  {
    icon: <FaUser className="w-6 h-6" />,
    label: "Profile",
    path: "/profile/:id",
  },
  {
    icon: <BiSolidOffer className="w-6 h-6" />,
    label: "Flash Sale",
    path: "/admin/flash-sale",
  },
  {
    icon: <FaShop className="w-6 h-6" />,
    label: "Shops",
    path: "/admin/shops",
  },
  {
    icon: <AiFillProduct className="w-6 h-6" />,
    label: "Products",
    path: "/admin/products",
  },
  {
    icon: <FaUsers className="w-6 h-6" />,
    label: "Users",
    path: "/admin/users",
  },
  {
    icon: <BiSolidShoppingBag className="w-6 h-6" />,
    label: "Orders",
    path: "/admin/orders",
  },
];
