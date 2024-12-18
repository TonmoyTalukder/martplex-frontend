"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

import CFInput from "@/src/components/form/CFInput";
import CFForm from "@/src/components/form/CFForm";
import { useVerify } from "@/src/hooks/auth.hooks";
import { useUser } from "@/src/context/user.provider";
import { logout } from "@/src/services/AuthService";

export default function VerifyPage() {
  const { user, setIsLoading: userLoading } = useUser();
  const { mutate: verifyUser, isError, isPending, isSuccess } = useVerify();
  const [verifyCode, setVerifyCode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const email = user?.email;

  const onSubmit = (data: { code: string }) => {
    if (email) {
      verifyUser(
        { email, code: data.code },
        {
          onSuccess: () => setVerifyCode(true),
        },
      );
    } else {
      console.error("Invalid code.");
    }
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [isPending, isSuccess, redirect, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <h3 className="mb-4 text-2xl font-bold">Verify</h3>
      <p>
        Use &apos;testVerify&apos; code incase you are not using any valid
        email.
      </p>
      <div className="w-[75%] md:w-[55%] lg:w-[35%]">
        {verifyCode ? (
          <p className="text-center">You are verified successfully.</p>
        ) : (
          <CFForm onSubmit={onSubmit}>
            <div className="py-3">
              <CFInput label="Verification Code" name="code" type="text" />
            </div>
            <Button
              className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
              size="lg"
              type="submit"
            >
              Verify
            </Button>
          </CFForm>
        )}
        <div className="text-center mt-4">
          <Button
            onClick={() => {
              logout();
            }}
          >
            Logout
          </Button>
        </div>
      </div>
      {isError && (
        <p className="text-red-600 text-center">
          Verification failed. Try again.
        </p>
      )}
    </div>
  );
}
