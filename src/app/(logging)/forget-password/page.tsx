"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";

import CFInput from "@/src/components/form/CFInput";
import CFForm from "@/src/components/form/CFForm";
import { useForgetPassword } from "@/src/hooks/auth.hooks";

export default function ForgetPasswordPage() {
  const { mutate: forgetPassword, isError } = useForgetPassword();
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = (data: { email: string }) => {
    console.log("Forget Email ", data);
    forgetPassword(data, {
      onSuccess: () => setEmailSent(true),
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <h3 className="mb-4 text-2xl font-bold">Forgot Password</h3>
      <div className="w-[75%] md:w-[55%] lg:w-[35%]">
        {emailSent ? (
          <p>A reset password link has been sent to your email.</p>
        ) : (
          <CFForm onSubmit={onSubmit}>
            <div className="py-3">
              <CFInput label="Email" name="email" type="email" />
            </div>
            <Button
              className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
              size="lg"
              type="submit"
            >
              Send Reset Link
            </Button>
          </CFForm>
        )}

        {/* Add Login Page Link */}
        <div className="text-center mt-4">
          Remembered your password?&nbsp;
          <Link
            className="text-[#daa611] hover:text-[#a58a40] underline"
            href="/login"
          >
            Login here
          </Link>
        </div>
      </div>
      {isError && (
        <p className="text-red-600">Error sending email. Try again.</p>
      )}
    </div>
  );
}
