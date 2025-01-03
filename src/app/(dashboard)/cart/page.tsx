"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState } from "react";

import {
  useFetchCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from "@/src/hooks/cart.hooks";
import { useUser } from "@/src/context/user.provider";
import { useCreateOrder } from "@/src/hooks/order.hooks";
import PaymentModal from "@/src/components/modal/PaymentModal";

const Cart = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Fetch cart data
  const { data: cartData, isLoading, isError } = useFetchCart(userId!);

  // Mutation hooks
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();
  const { mutate: createOrderMutation, isPending: isCreatingOrder } =
    useCreateOrder();

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const cart = cartData?.data?.cartInfo;

  console.log(cart);

  if (cart === undefined) return <p>Your cart is empty.</p>;

  // Handle increment/decrement item quantity
  const handleQuantityChange = async (
    cartItemId: string,
    productId: string,
    action: "increment" | "decrement",
  ) => {
    const item = cart?.items.find((item: any) => item.productId === productId);

    if (!item) return;

    const newQuantity =
      action === "increment" ? item.quantity + 1 : item.quantity - 1;

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
      console.error("Error updating cart item:", error);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await deleteCartItemMutation.mutateAsync({ id: cartItemId });
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
    }
  };

  const finalPrice = cart?.items.reduce(
    (total: any, item: any) => total + item.price,
    0,
  );

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty. Add items before placing an order.");

      return;
    }

    const payload = {
      userId,
      vendorStandId: cart.vendorId,
      totalAmount: finalPrice,
      items: cart.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      })), // Ensures items is always an array
      cartId: cart.id,
    };

    try {
      console.log("Order payload: ", payload);

      await createOrderMutation(payload, {
        onSuccess: (order) => {
          const paymentId = order?.payment.id;

          console.log("Payment ID:", paymentId);
          setPaymentId(order?.payment.id);
          setPaymentModalOpen(true);
        },
        onError: (error) => {
          console.error("Error creating order:", error);
        },
      });

      // const order = await createOrderMutation(payload);

      // setPaymentId(order?.payment.id);
      // setPaymentModalOpen(true);
      // Optional: Perform any post-order actions (e.g., clear cart, redirect)
    } catch (error: any) {
      console.error("Error placing order:", error);

      // Provide detailed feedback to the user
      alert(
        error?.response?.data?.message ||
          "Failed to place the order. Try again.",
      );
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
            style={{ height: "auto", minWidth: "100%" }}
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
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.productId,
                          "increment",
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
                          "decrement",
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
          <div className="flex justify-end mt-4">
            <Button
              color="success"
              isDisabled={isCreatingOrder} // Prevent multiple clicks during loading
              onClick={handlePlaceOrder}
            >
              {isCreatingOrder ? "Placing Order..." : "Place Order"}
            </Button>
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
