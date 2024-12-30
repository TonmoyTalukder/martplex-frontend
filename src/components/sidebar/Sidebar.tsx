"use client";

import { useTheme } from "next-themes";
import { Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { ImUserTie } from "react-icons/im";
import { RiMenu2Line, RiMenu3Line } from "react-icons/ri";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useScreenWidth from "../hooks/useScreenWidth";
import { ThemeSwitch } from "../UI/theme-switch";

import {
  CustomerMenuItems,
  VendorMenuItems,
  AdminMenuItems,
  MenuItem,
} from "./roleBasedMenu";

import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";
import { useBecomeVendor } from "@/src/hooks/user.hooks";

const Sidebar = () => {
  const router = useRouter();

  const {
    mutate: handleBecomeVendorApi,
    isPending: becomeVendorPending,
    isSuccess: becomeVendorSuccess,
  } = useBecomeVendor();

  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [smScreen, setSmScreen] = useState(false);
  const { user } = useUser();
  const profileId = user?.id;
  const role = user?.role;
  const screenWidth = useScreenWidth();

  const hadnleBecomeVendor = async () => {
    const data = {
      id: profileId!,
    };

    await handleBecomeVendorApi(data);
  };

  const logoutUser = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (screenWidth! < 801) {
      setCollapsed(true);
      setSmScreen(true);
    } else {
      setCollapsed(false);
      setSmScreen(false);
    }
  }, [screenWidth]);

  if (screenWidth === null) {
    return <div>Loading...</div>;
  }

  let menuItems: MenuItem[] = [];

  switch (role) {
    case "CUSTOMER":
      menuItems = CustomerMenuItems;
      break;
    case "VENDOR":
      menuItems = VendorMenuItems;
      break;
    case "ADMIN":
    case "SUPER_ADMIN":
      menuItems = AdminMenuItems;
      break;
    default:
      menuItems = [];
  }

  menuItems = menuItems.map((item) =>
    item.path.includes(":id") && profileId
      ? { ...item, path: item.path.replace(":id", profileId) }
      : item,
  );

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full transition-all duration-300 ${theme === "dark" ? "bg-zinc-900" : "bg-zinc-300"} py-4 rounded-tr-lg shadow-lg`}
    >
      {/* Header */}
      {!smScreen && (
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h1 className="text-xl font-bold">MartPlex</h1>}
          <button
            className={`p-2 rounded-md ${theme === "dark" ? "text-white" : "text-black"} hover:bg-zinc-600`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <RiMenu3Line /> : <RiMenu2Line />}
          </button>
        </div>
      )}

      {/* Menu */}
      <div className="mt-4">
        {menuItems.map((item, index) =>
          collapsed ? (
            <Tooltip
              key={index}
              className="w-full"
              content={item.label}
              placement="right"
            >
              <Link href={item.path}>
                <div
                  className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer ${
                    theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
                  } rounded-md`}
                >
                  {item.icon}
                </div>
              </Link>
            </Tooltip>
          ) : (
            <Link key={index} href={item.path}>
              <div
                className={`flex flex-row items-center gap-4 p-4 cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
                } rounded-md`}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ),
        )}

        {user?.role === "CUSTOMER" &&
          (collapsed ? (
            <Tooltip
              key="beseller"
              className="w-full"
              content="Be A Seller"
              placement="right"
            >
              <button
                className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                  theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
                } rounded-md`}
                onClick={hadnleBecomeVendor}
              >
                <ImUserTie className="w-6 h-6" />
              </button>
            </Tooltip>
          ) : (
            <button
              key="beseller"
              className={`flex flex-row items-center gap-4 p-4 cursor-pointer ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
              } rounded-md w-full`}
              onClick={hadnleBecomeVendor}
            >
              <ImUserTie className="w-6 h-6" />
              <span>Be A Seller</span>
            </button>
          ))}

        {collapsed ? (
          <Tooltip
            key="logout"
            className="w-full"
            content="Logout"
            placement="right"
          >
            <button
              className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
              } rounded-md`}
              onClick={logoutUser}
            >
              <IoLogOut className="w-6 h-6" />
            </button>
          </Tooltip>
        ) : (
          <button
            key="logout"
            className={`flex flex-row items-center gap-4 p-4 cursor-pointer ${
              theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
            } rounded-md w-full`}
            onClick={logoutUser}
          >
            <IoLogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        )}

        {collapsed ? (
          <Tooltip
            key="theme"
            className="w-full"
            content="Theme"
            placement="right"
          >
            <button
              className={`flex flex-col items-center gap-x-0 mb-7 py-2 cursor-pointer w-full ${
                theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-400"
              } rounded-md`}
            >
              <ThemeSwitch />
            </button>
          </Tooltip>
        ) : (
          <div
            key="theme"
            className={`flex flex-row items-center gap-4 p-4 rounded-md w-full`}
          >
            <ThemeSwitch />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
