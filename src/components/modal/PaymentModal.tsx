import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import { useUpdatePayment } from "@/src/hooks/order.hooks";
import { UpdatePaymentPayload, UpdatePaymentResponse } from "@/src/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
  paymentId: string | null;
}

type IPaymentMethod = "Online" | "COD";

const isPaymentMethod = (value: string): value is IPaymentMethod => {
  return value === "Online" || value === "COD";
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  userId,
  paymentId,
}) => {
  const router = useRouter();

  const { mutate: updatePaymentMutation, isPending: isCreatingOrder } =
    useUpdatePayment();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod>("Online");

  const handlePayment = () => {
    if (!userId || !paymentId || !deliveryAddress || !deliveryPhone) {
      alert("Please fill in all the required fields");

      return;
    }

    const payload: UpdatePaymentPayload = {
      paymentId,
      paymentMethod,
      userId,
      deliveryAddress,
      deliveryPhone,
    };

    console.log(payload);

    updatePaymentMutation(payload, {
      onSuccess: (data: UpdatePaymentResponse) => {
        if (paymentMethod === "Online" && "payment_url" in data.data) {
          // If payment method is Online, redirect to the payment URL
          window.location.href = data.data.payment_url;
        } else if (paymentMethod === "COD" && "orderId" in data.data) {
          // If payment method is COD, show the order ID or take any other action
          console.log("Order ID for COD:", data.data.orderId);
        }
        // Close the modal after successful update
        onClose();
      },
      onError: (error) => {
        console.error("Payment update failed:", error);
      },
    });

    router.push("/order");
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Payment</ModalHeader>
            <ModalBody>
              <Input
                fullWidth
                label="Delivery Address"
                placeholder="Enter your delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <Input
                fullWidth
                label="Delivery Phone"
                placeholder="Enter your phone number"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
              />
              <RadioGroup
                label="Payment Method"
                orientation="horizontal"
                value={paymentMethod}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value; // Extract the value from the event

                  if (isPaymentMethod(value)) {
                    setPaymentMethod(value); // Update state if valid
                  } else {
                    console.error(`Invalid payment method: ${value}`);
                  }
                }}
              >
                <Radio value="Online">Online</Radio>
                <Radio value="COD">Cash on Delivery</Radio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                isDisabled={
                  isCreatingOrder ||
                  !deliveryAddress ||
                  !deliveryPhone ||
                  !paymentMethod
                }
                onPress={handlePayment}
              >
                Pay Now
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
