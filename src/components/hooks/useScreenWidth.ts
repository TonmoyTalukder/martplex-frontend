"use client";

import { useState, useEffect } from "react";

const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState<number | null>(null); // Explicitly define the state type

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Set the initial screen width after client-side render
    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);

    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenWidth;
};

export default useScreenWidth;
