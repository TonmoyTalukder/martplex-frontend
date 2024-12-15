"use client";

import { FC, useEffect, useState } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@nextui-org/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { MoonIcon } from "./MoonIcon";
import { SunIcon } from "./SunIcon";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isSSR = useIsSSR();

  // State to determine if the component is mounted
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Set to true once the component has mounted on the client
  }, []);

  const onChange = () => {
    // Toggle between light and dark themes
    setTheme(theme === "light" ? "dark" : "light");
  };

  const { slots, isSelected, getBaseProps, getInputProps, getWrapperProps } =
    useSwitch({
      isSelected: resolvedTheme === "light", // Use resolvedTheme to avoid SSR mismatch
      "aria-label": `Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`,
      onChange,
    });

  // Prevent rendering theme icons until mounted to avoid SSR mismatch
  if (!mounted || isSSR) return null;

  return (
    <div
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
          "focus:outline-none",
        ),
      })}
      role="button" // Adding role to make it behave like a button
      tabIndex={0} // Making it focusable
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }} // Handle the click manually for toggling
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {isSelected ? <SunIcon size={32} /> : <MoonIcon size={32} />}
      </div>
    </div>
  );
};

export default function App() {
  return <ThemeSwitch />;
}
