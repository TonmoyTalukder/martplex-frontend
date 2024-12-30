import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean;
}

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;

export type TFollowUser = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
};

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: "CUSTOMER" | "ADMIN" | "VENDOR" | "SUPER_ADMIN";
  status?: "PENDING_VERIFICATION" | "ACTIVE" | "BLOCKED" | "DELETED";
  profilePhoto?: string | null;
  isVerified?: boolean;
  isDeleted?: boolean;
  verificationCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
  verificationCodeExpiresAt?: string | null;
  iat?: number;
  exp?: number;
}

export interface IOrder {
  id: string;
  userId: string;
  vendorStandId: string;
  totalAmount: number;
  deliveryAddress?: string;
  deliveryPhone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: Array<any>;
  payment: {
    id: string;
    transactionId: string | null;
    orderId: string;
    vendorStandId: string;
    amount: number;
  };
}

export interface IPaymentMethod {
  Online: "Online";
  COD: "COD";
}

export interface UpdatePaymentPayload {
  paymentId: string;
  paymentMethod: "Online" | "COD";
  userId: string;
  deliveryAddress: string;
  deliveryPhone: string;
}

interface IPayment {
  id: string;
  transactionId: string | null;
  orderId: string;
  vendorStandId: string;
  amount: number;
}

export interface IOrderResponse {
  id: string;
  userId: string;
  vendorStandId: string;
  deliveryAddress: string | null;
  deliveryPhone: string | null;
  totalAmount: number;
  status: string;
  payment: IPayment;
  createdAt: string;
  updatedAt: string;
}

interface CODPaymentData {
  id: string;
  transactionId: string | null;
  orderId: string;
  vendorStandId: string;
  amount: number;
  paymentMethod: "COD";
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OnlinePaymentData {
  result: string;
  payment_url: string;
}

export type UpdatePaymentResponse = {
  success: boolean;
  message: string;
  data: CODPaymentData | OnlinePaymentData;
};
