"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface ShopContextProps {
  shopId: string;
  setShopId: (id: string) => void;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }

  return context;
};

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider = ({ children }: ShopProviderProps) => {
  const [shopId, setShopId] = useState<string>("");

  // Load shopId from localStorage on initial render
  useEffect(() => {
    const storedShopId = localStorage.getItem("shopId");

    if (storedShopId) {
      setShopId(storedShopId);
    }
  }, []);

  // Update localStorage whenever shopId changes
  const handleSetShopId = (id: string) => {
    setShopId(id);
    localStorage.setItem("shopId", id);
  };

  return (
    <ShopContext.Provider value={{ shopId, setShopId: handleSetShopId }}>
      {children}
    </ShopContext.Provider>
  );
};
