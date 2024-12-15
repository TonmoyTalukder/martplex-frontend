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

export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

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
