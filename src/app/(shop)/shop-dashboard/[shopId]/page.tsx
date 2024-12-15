'use client';

import { useEffect } from 'react';
import { useShop } from '@/src/context/ShopContext';

interface IProps {
  params: {
    shopId: string;
  };
}

const ShopDashboard = ({ params: { shopId } }: IProps) => {
  const { setShopId } = useShop();

  useEffect(() => {
    setShopId(shopId);
  }, [shopId, setShopId]);

  return (
    <div>
      <h1>This is ShopDashboard: {shopId} component</h1>
    </div>
  );
};

export default ShopDashboard;
