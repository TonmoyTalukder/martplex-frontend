"use client";

import React, { useEffect } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import Link from "next/link";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import CFInput from "@/src/components/form/CFInput";
import CFForm from "@/src/components/form/CFForm";
import { useUserLogin } from "@/src/hooks/auth.hooks";
import { useUser } from "@/src/context/user.provider";

export default function LoginPage() {
  const { setIsLoading: userLoading } = useUser();
  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");
  const status = searchParams.get("status");
  const { isOpen: isBlockedModalOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (status === "blocked") {
      onOpen();
    }
  }, [status, onOpen]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
    userLoading(true);
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
    <div className="w-full">
      <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
        <h3 className="my-2 text-2xl font-bold">Login</h3>
        <p className="mb-4">Welcome Back! Let&lsquo;s Get Started</p>
        <div className="w-[75%] md:w-[55%] lg:w-[35%]">
          <CFForm onSubmit={onSubmit}>
            <div className="py-3">
              <CFInput label="Email" name="email" type="email" />
            </div>
            <div className="py-3">
              <CFInput label="Password" name="password" type="password" />
            </div>
            <Button
              className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
              size="lg"
              type="submit"
            >
              Login
            </Button>
          </CFForm>
          <div className="text-center">
            <Link
              className="text-[#daa611] hover:text-[#a58a40] underline"
              href={"/forget-password"}
            >
              Forgot Password?
            </Link>
            <div className="my-4">
              Don&lsquo;t have an account?&nbsp;
              <Link
                className="text-[#daa611] hover:text-[#a58a40] underline"
                href={"/signup"}
              >
                Sign Up
              </Link>
            </div>

            <div className="my-4 gap-2 flex flex-row items-center justify-center">
              <Link
                className="text-[#daa611] hover:text-[#a58a40] underline"
                href={"/about-us"}
              >
                About Us
              </Link>
              <Link
                className="text-[#daa611] hover:text-[#a58a40] underline"
                href={"/contact-us"}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Modal backdrop="blur" isOpen={isBlockedModalOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                You are blocked
              </ModalHeader>
              <ModalBody>
                <p>
                  Your account has been blocked. Please contact support for
                  assistance.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
