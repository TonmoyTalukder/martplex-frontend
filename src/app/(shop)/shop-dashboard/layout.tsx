import ShopSidebar from '@/src/components/sidebar/ShopSidebar';
import { ShopProvider } from '@/src/context/ShopContext';

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <div className="min-h-screen p-0">
        <div className="flex gap-4 min-h-screen">
          <div className="flex-none w-34 border-gray-500 p-0 m-0">
            <ShopSidebar />
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </ShopProvider>
  );
}
