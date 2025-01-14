'use client';

import { useShop } from '@/src/context/ShopContext';
import { useGetAllOrders } from '@/src/hooks/order.hooks';
import { IOrderResponse } from '@/src/types';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface TopItem {
  name: string;
  count: number;
}

const CustomBarChart = ({
  data,
  title,
}: {
  data: { name: string; count: number }[];
  title: string;
}) => {
  const maxCount = Math.max(...data.map((item) => item.count));

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto my-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
        {title}
      </h2>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-4">
            <div className="w-1/4 text-gray-600 font-medium">{item.name}</div>
            <div className="flex-1 relative bg-gray-200 rounded-md">
              <div
                className="h-6 rounded-md transition-all duration-500 ease-in-out"
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  backgroundImage: 'linear-gradient(314deg, #336B92, #8DC2EF)',
                }}
              ></div>
            </div>
            <div className="w-12 text-right text-gray-600">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OverviewPage = () => {
  const [filteredOrders, setFilteredOrders] = useState<IOrderResponse[]>([]);
  const [topProducts, setTopProducts] = useState<TopItem[]>([]);
  const [topCategories, setTopCategories] = useState<TopItem[]>([]);
  const { shopId } = useShop();
  const { data: orderData, isLoading } = useGetAllOrders();

  useEffect(() => {
    if (orderData && shopId) {
      const result: IOrderResponse[] = orderData.filter(
        (order) =>
          order.vendorStandId === shopId && order.payment?.transactionId,
      );
      setFilteredOrders(result);

      const productCount: Record<string, number> = {};
      const categoryCount: Record<string, { name: string; count: number }> = {};

      result.forEach((order) => {
        order.items.forEach((item) => {
          const { name, category } = item.product;

          productCount[name] =
            (productCount[name] || 0) + Number(item.quantity);

          if (category) {
            if (!categoryCount[category.id]) {
              categoryCount[category.id] = { name: category.name, count: 0 };
            }
            categoryCount[category.id].count += Number(item.quantity);
          }
        });
      });

      const sortedProducts = Object.entries(productCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      const sortedCategories = Object.values(categoryCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(({ name, count }) => ({ name, count }));

      setTopProducts(sortedProducts);
      setTopCategories(sortedCategories);
    }
  }, [orderData, shopId]);

  return (
    <div className="p-6">
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          <CustomBarChart data={topProducts} title="Top Products" />
          <CustomBarChart data={topCategories} title="Top Categories" />
        </>
      )}
    </div>
  );
};

export default OverviewPage;
