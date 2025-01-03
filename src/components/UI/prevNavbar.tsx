"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Avatar, Badge } from "@nextui-org/react";
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { siteConfig } from "@/src/config/site";
import { ThemeSwitch } from "@/src/components/UI/theme-switch";
import { SearchIcon } from "@/src/components/UI/icons";
import { logout } from "@/src/services/AuthService";
import { useUser } from "@/src/context/user.provider";
import { useFetchCart } from "@/src/hooks/cart.hooks";

export const Navbar = () => {
  const router = useRouter();

  const { user } = useUser();

  const avatarUrl =
    user?.profilePhoto || "https://i.ibb.co.com/wcv1QBQ/5951752.png";
  const profileId = user?.id;

  const { data: cartData } = useFetchCart(profileId || "");
  const cart = cartData?.data?.cartInfo;
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    // Update cart length dynamically when cart data changes
    if (cart) {
      setCartLength(cart.items.length);
    }
  }, [cart]);

  const handleLogin = () => {
    router.push("/login");
  };

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              alt="name"
              className="object-cover"
              height={36}
              src="/MartPlex-Logo.png"
              width={36}
            />
            <p>
              <span
                className="font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(314deg, #336B92, #8DC2EF)",
                }}
              >
                Mart
              </span>
              <span
                className="font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(0deg, #2B709E, #000000)",
                }}
              >
                Plex
              </span>
            </p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
        <NavbarItem key="jd">
          {user && (
            <Button
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium",
              )}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2 items-center">
          {user ? (
            <Link href={`/profile/${profileId}`}>
              <Avatar size="sm" src={avatarUrl} />
            </Link>
          ) : (
            <p>
              <Button
                className="bg-transparent text-blue-500"
                onClick={handleLogin}
              >
                Login
              </Button>
            </p>
          )}

          <ThemeSwitch />
          <Link href="/cart">
            <Badge
              className=" transform hover:scale-110 transition-transform"
              color="danger"
              content={user ? cartLength : 0}
            >
              <FaShoppingCart className="w-6 h-6 text-zinc-500 cursor-pointer transform hover:scale-110 transition-transform" />
            </Badge>
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
      </NavbarContent>

      <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
