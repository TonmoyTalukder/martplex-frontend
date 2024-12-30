"use client";

import React, { useEffect, useState } from "react";
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
import { TbArrowLeftDashed } from "react-icons/tb";
import Image from "next/image";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status === "blocked") {
      onOpen();
    }
  }, [status, onOpen]);

  const onSubmit: SubmitHandler<FieldValues> = () => {
    const loggingData = {
      email,
      password,
    };

    handleUserLogin(loggingData);
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

  const handleTestCredentials = (role: string) => {
    if (role === "admin") {
      setEmail("admin.ph@mail.com");
      setPassword("123456");
    } else if (role === "vendor") {
      setEmail("hermione@gmail.com");
      setPassword("123456");
    } else {
      setEmail("user@test.com");
      setPassword("123456");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-gray-100">
        <div className="w-[95vw] max-w-5xl p-4 bg-gradient-to-r from-blue-950 via-blue-900 to-gray-900 text-gray-100 rounded-lg shadow-lg md:w-full md:flex md:h-[75%]">
          {/* Left Column */}
          <div className="sm:flex hidden flex-col items-center justify-center w-full p-6 space-y-6 text-white bg-gradient-to-br from-blue-800 via-blue-900 to-transparent md:w-1/2 rounded-s-lg">
            <h3 className="text-2xl font-bold text-center">Welcome back to</h3>
            <h1 className="text-4xl font-bold text-center">MartPlex</h1>
            <p className="text-lg text-center">
              Your Shopping Adventure Begins Here!
            </p>
            <div className="hidden md:block">
              {/* <svg
                className="w-64 h-64 text-blue-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM4 12a8 8 0 1113.657 5.657L4.343 6.343A7.953 7.953 0 014 12zm8 8a8 8 0 01-5.657-13.657l13.314 13.314A7.953 7.953 0 0112 20z" />
              </svg> */}
              <Image
                alt="Credential Banner Image"
                height={128}
                src="/Credential.png"
                width={300}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-center justify-center w-full p-6 space-y-4 md:w-1/2">
            <h2 className="text-3xl font-semibold text-center">Login</h2>

            <div className="w-full p-4 mt-4 border rounded-lg border-dashed border-blue-500">
              <p className="mb-2 text-center">
                Credentials for Testing Purpose:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  className="bg-blue-600 hover:bg-blue-500"
                  onPress={() => handleTestCredentials("admin")}
                >
                  Admin
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-500"
                  onPress={() => handleTestCredentials("vendor")}
                >
                  Vendor
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-500"
                  onPress={() => handleTestCredentials("user")}
                >
                  User
                </Button>
              </div>
            </div>

            <div className="w-[85%] p-10 rounded-lg shadow-2xl text-white bg-blend-darken">
              <CFForm onSubmit={onSubmit}>
                <div className="py-3">
                  <CFInput
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    label="Password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="w-full bg-blue-950 hover:bg-blue-500 rounded-md font-semibold"
                  type="submit"
                >
                  Login
                </Button>
              </CFForm>
            </div>

            <div className="text-sm text-center">
              <Link
                className="text-blue-600 hover:underline"
                href="/forget-password"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="text-sm text-center">
              Don’t have an account?&nbsp;
              <Link className="text-blue-600 hover:underline" href="/signup">
                Sign Up
              </Link>
            </div>
            <Button
              className="w-2/5 mb-4 bg-blue-950 hover:bg-blue-500"
              onPress={() => router.push("/")}
            >
              <TbArrowLeftDashed /> Back to Home
            </Button>
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
