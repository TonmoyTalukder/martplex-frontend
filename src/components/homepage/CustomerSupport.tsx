import { TbTruckDelivery } from "react-icons/tb";
import { TfiMoney } from "react-icons/tfi";
import { ImHeadphones } from "react-icons/im";

const CustomerSupport = () => {
  return (
    <div className="py-10 px-5 mt-0 bg-sky-100 rounded-b-lg w-[90vw]">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Why Choose Us?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Shipping & Return */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center text-sky-600 text-6xl mb-4">
            <TbTruckDelivery />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-2">
            FREE SHIPPING & RETURN
          </h2>
          <p className="text-center text-gray-500">
            Enjoy free shipping on all orders over $99.
          </p>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center text-green-600 text-6xl mb-4">
            <TfiMoney />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-2">
            MONEY BACK GUARANTEE
          </h2>
          <p className="text-center text-gray-500">
            Get 100% money back if you&apos;re not satisfied.
          </p>
        </div>

        {/* Online Support */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
          <div className="flex justify-center items-center text-purple-600 text-6xl mb-4">
            <ImHeadphones />
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-2">
            ONLINE SUPPORT 24/7
          </h2>
          <p className="text-center text-gray-500">
            We&apos;re here to assist you anytime, 24/7.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
