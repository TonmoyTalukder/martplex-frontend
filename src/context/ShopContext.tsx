'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ShopContextProps {
  shopId: string;
  setShopId: (id: string) => void;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

interface ShopProviderProps {
  children: ReactNode;
}

export const ShopProvider = ({ children }: ShopProviderProps) => {
  const [shopId, setShopId] = useState<string>('');

  return (
    <ShopContext.Provider value={{ shopId, setShopId }}>
      {children}
    </ShopContext.Provider>
  );
};
