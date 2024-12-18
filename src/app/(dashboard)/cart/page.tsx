'use client';

import {
  useFetchCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from '@/src/hooks/cart.hooks';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useUser } from '@/src/context/user.provider';

const Cart = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Fetch cart data
  const { data: cartData, isLoading, isError } = useFetchCart(userId!);

  // Mutation hooks
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();

  const cart = cartData?.data?.cartInfo;

  console.log(cart);

  // Handle increment/decrement item quantity
  const handleQuantityChange = async (
    cartItemId: string,
    productId: string,
    action: 'increment' | 'decrement',
  ) => {
    const item = cart?.items.find((item: any) => item.productId === productId);
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
    } catch (error: any) {
      console.error('Error updating cart item:', error);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await deleteCartItemMutation.mutateAsync({ id: cartItemId });
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      alert('Order placed successfully!');
      // Additional logic for placing an order can be added here
    } catch (error: any) {
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
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.productId,
                          'increment',
                        )
                      }
                      size="sm"
                    >
                      +
                    </Button>
                    <Button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.productId,
                          'decrement',
                        )
                      }
                      size="sm"
                    >
                      -
                    </Button>
                    <Button
                      onClick={() => handleRemoveItem(item.id)}
                      size="sm"
                      color="danger"
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button color="success" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
