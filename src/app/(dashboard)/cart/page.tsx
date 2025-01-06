'use client';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useState } from 'react';

import {
  useFetchCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from '@/src/hooks/cart.hooks';
import { useUser } from '@/src/context/user.provider';
import { useCreateOrder } from '@/src/hooks/order.hooks';
import PaymentModal from '@/src/components/modal/PaymentModal';
import { useGetAllCoupons } from '@/src/hooks/coupon.hooks';

type Coupon = {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  isActive: boolean;
  vendorStandId: string;
};

const Cart = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Fetch cart and coupon data
  const { data: cartData, isLoading, isError } = useFetchCart(userId!);
  const { data: coupons, isLoading: couponLoading } = useGetAllCoupons();

  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();
  const { mutate: createOrderMutation, isPending: isCreatingOrder } =
    useCreateOrder();

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const cart = cartData?.data?.cartInfo;

  const availableCoupons = (coupons as Coupon[])?.filter(
    (coupon) => coupon.vendorStandId === cart?.vendorId && coupon.isActive,
  );

  const finalPrice = cart?.items.reduce(
    (total: number, item: { price: number; quantity: number }) =>
      total + item.price * item.quantity,
    0,
  );

  const discountedPrice = selectedCoupon
    ? finalPrice - finalPrice * (selectedCoupon.discount / 100)
    : finalPrice;

  if (cart === undefined) return <p>Your cart is empty.</p>;

  // Handle increment/decrement item quantity
  const handleQuantityChange = async (
    cartItemId: string,
    productId: string,
    action: 'increment' | 'decrement',
  ) => {
    const item = cart?.items.find(
      (item: { productId: string }) => item.productId === productId,
    );

    if (!item) return;

    const newQuantity =
      action === 'increment' ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    try {
      await updateCartItemMutation.mutateAsync({
        id: productId,
        data: {
          cartItemId,
          quantity: newQuantity,
        },
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await deleteCartItemMutation.mutateAsync({ id: cartItemId });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty. Add items before placing an order.');
      return;
    }

    const payload = {
      userId,
      vendorStandId: cart.vendorId,
      totalAmount: discountedPrice,
      items: cart.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })),
      cartId: cart.id,
      couponId: selectedCoupon?.id || null,
    };

    try {
      console.log('Order payload:', payload);

      await createOrderMutation(payload, {
        onSuccess: (order) => {
          const paymentId = order?.payment.id;
          setPaymentId(paymentId);
          setPaymentModalOpen(true);
        },
        onError: (error) => {
          console.error('Error creating order:', error);
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  if (isLoading || !cart?.items) return <p>Loading...</p>;
  if (isError) return <p>Failed to load cart.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart?.items?.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table
            aria-label="Cart Items"
            shadow="sm"
            style={{ height: 'auto', minWidth: '100%' }}
          >
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Price</TableColumn>
              <TableColumn>Quantity</TableColumn>
              <TableColumn>Total</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {cart.items.map((item: any) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>৳ {item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ৳ {(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell className="flex flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.productId,
                          'increment',
                        )
                      }
                    >
                      +
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.productId,
                          'decrement',
                        )
                      }
                    >
                      -
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-row items-center justify-end mt-4">
            <p className="text-lg font-bold mr-4">
              Total: ৳ {discountedPrice.toFixed(2)}
            </p>
            <Button
              className="bg-lime-600 text-white"
              // color="success"
              isDisabled={isCreatingOrder}
              onClick={handlePlaceOrder}
            >
              {isCreatingOrder ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Available Coupons</h2>
            {availableCoupons?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`border p-4 rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
                      selectedCoupon?.id === coupon.id
                        ? 'border-dotted border-green-700 bg-lime-50'
                        : 'border-dashed border-gray-300'
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setSelectedCoupon(
                        selectedCoupon?.id === coupon.id ? null : coupon,
                      )
                    }
                  >
                    <h3 className="text-lg font-semibold">{coupon.code}</h3>
                    <p className="text-sm">{coupon.discount}% off</p>
                    <p className="text-xs text-gray-500">
                      Expires on:{' '}
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No coupons available.</p>
            )}
          </div>
        </>
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        paymentId={paymentId}
        userId={userId}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
};

export default Cart;
