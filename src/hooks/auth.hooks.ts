/* eslint-disable no-console */
import { useMutation } from '@tanstack/react-query';
import { FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

import {
  changePassword,
  forgetPassword,
  loginUser,
  registerUser,
  resetPassword,
  verify,
} from '../services/AuthService';
import APIError from '../utils/error';

export const useUserRegistration = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ['USER_REGISTRATION'],
    mutationFn: async (userData: any) => await registerUser(userData),
    onSuccess: () => {
      toast.success('User registration successful.');
    },
    onError: (error: { message: any }) => {
      toast.error(error.message);
      console.log(error);
    },
  });
};

export const useUserLogin = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ['USER_LOGIN'],
    mutationFn: async (userData: any) => await loginUser(userData),
    onSuccess: () => {
      toast.success('User logged in successful.');
    },
    onError: () => {
      // if (
      //   (error.message =
      //     "Error: AxiosError: Request failed with status code 403")
      // ) {
      //   toast.error("User credentials has been blocked");
      // } else toast.error(error.message);
      toast.error('User credentials are invalid!');
    },
  });
};

export const useForgetPassword = () => {
  return useMutation<any, Error, { email: string }>({
    mutationKey: ['FORGET_PASSWORD'],
    mutationFn: async ({ email }) => await forgetPassword(email),
    onSuccess: () => {
      toast.success('Password reset link sent to your email.');
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation<
    any,
    APIError,
    { token: string; id: string; newPassword: string }
  >({
    mutationKey: ['RESET_PASSWORD'],
    mutationFn: async ({ token, id, newPassword }) =>
      await resetPassword(token, id, newPassword),
    onSuccess: () => {
      toast.success('Password has been successfully reset.');
    },
    onError: (error) => {
      console.error('Full error object:', error);
      console.error('Full error object status:', error.status);

      const status = error.status;
      const message =
        error.message ||
        'Something went wrong. Please try again or contact support.';

      if (status === 403) {
        toast.error(
          'Invalid or expired token. Please request a new reset link.',
        );
      } else if (status === 400) {
        toast.error('Bad request. Please check the provided inputs.');
      } else {
        toast.error(message);
      }
    },
  });
};

export const useVerify = () => {
  return useMutation<any, APIError, { email: string; code: string }>({
    mutationKey: ['VERIFY'],
    mutationFn: async ({ email, code }) => await verify(email, code),
    onSuccess: () => {
      toast.success('Verification successful.');
    },
    onError: (error) => {
      console.error('Full error object:', error);
      console.error('Full error object status:', error.status);

      const status = error.status;
      const message =
        error.message ||
        'Something went wrong. Please try again or contact support.';

      if (status === 403) {
        toast.error(
          'Invalid or expired token. Please request a new reset link.',
        );
      } else if (status === 400) {
        toast.error('Bad request. Please check the provided inputs.');
      } else {
        toast.error(message);
      }
    },
  });
};

export const useChangePassword = () => {
  return useMutation<any, Error, FieldValues>({
    mutationKey: ['CHANGE_PASSWORD'],
    mutationFn: async (passwordData: any) => await changePassword(passwordData),
    onSuccess: () => {
      toast.success('Password changed successfully.');
    },
    onError: (error: any) => {
      toast.error(error.message);
      console.log(error);
    },
  });
};
