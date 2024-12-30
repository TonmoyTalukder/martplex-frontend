/* eslint-disable no-console */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { NextPage } from "next";
import { TbArrowLeftDashed } from "react-icons/tb";
import Image from "next/image";

import CFForm from "@/src/components/form/CFForm";
import CFInput from "@/src/components/form/CFInput";
import { useUser } from "@/src/context/user.provider";
import { useUserRegistration } from "@/src/hooks/auth.hooks";

const SignUpPage: NextPage = () => {
  const { setIsLoading: userLoading } = useUser();
  const {
    mutate: handleUserSignUp,
    isPending,
    isSuccess,
  } = useUserRegistration();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    const userData = {
      ...formData,
    };

    console.log("Sign Up Data =>", userData);

    handleUserSignUp(userData);
    userLoading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.replace("/verify");
      }
    }
  }, [isPending, isSuccess]);

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phoneNumber;
      case 2:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword
        );
      default:
        return true;
    }
  };

  const handleInputChange = (name: string, value: string) => {
    console.log("Input change detected:", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      {/* <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
        <h3 className="my-2 text-2xl font-bold">Sign Up</h3>
        <p className="mb-4">Create your account in a few steps</p>
        <div className="w-[75%] md:w-[55%] lg:w-[35%]">
          <CFForm onSubmit={onSubmit}>
            {step === 1 && (
              <>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Name"
                    name="name"
                    type="text"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Email"
                    name="email"
                    type="email"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Phone Number"
                    name="phoneNumber"
                    // type="tel"
                    type="text"
                    onChange={(e) =>
                      handleInputChange('phoneNumber', e.target.value)
                    }
                  />
                </div>
                <Button
                  className="my-3 w-full rounded-md bg-default-900 font-semibold text-default"
                  size="lg"
                  type="button"
                  onClick={nextStep}
                >
                  Next
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Password"
                    name="password"
                    type="password"
                    onChange={(e) =>
                      handleInputChange('password', e.target.value)
                    }
                  />
                </div>
                <div className="py-3">
                  <CFInput
                    isRequired
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    onChange={(e) =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    className="my-3 rounded-md bg-default-500 font-semibold text-default"
                    size="lg"
                    type="button"
                    onClick={previousStep}
                  >
                    Previous
                  </Button>
                  <Button
                    className="my-3 rounded-md bg-default-900 font-semibold text-default"
                    size="lg"
                    type="submit"
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}

            <div className="text-center">
              Already have account ?{' '}
              <Link
                className="text-[#daa611] hover:text-[#a58a40] underline"
                href={'/login'}
              >
                Login here
              </Link>
            </div>
          </CFForm>
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-gray-100">
        <div className="w-[95vw] max-w-5xl p-4 bg-gradient-to-r from-blue-950 via-blue-900 to-gray-900 text-gray-100 rounded-lg shadow-lg md:w-full md:flex md:h-[75%]">
          {/* Left Column */}
          <div className="sm:flex hidden flex-col items-center justify-center w-full p-6 space-y-6 text-white bg-gradient-to-br from-blue-800 via-blue-900 to-transparent md:w-1/2 rounded-s-lg">
            <h3 className="text-2xl font-bold text-center">Welcome to</h3>
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
            <h3 className="text-3xl font-semibold text-center">Sign Up</h3>
            <p className="mb-4">Create your account in a few steps</p>

            <div className="w-[85%] p-10 rounded-lg shadow-2xl text-white bg-blend-darken">
              <CFForm onSubmit={onSubmit}>
                {step === 1 && (
                  <>
                    <div className="py-3">
                      <CFInput
                        isRequired
                        label="Name"
                        name="name"
                        type="text"
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="py-3">
                      <CFInput
                        isRequired
                        label="Email"
                        name="email"
                        type="email"
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="py-3">
                      <CFInput
                        isRequired
                        label="Phone Number"
                        name="phoneNumber"
                        // type="tel"
                        type="text"
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                      />
                    </div>

                    <Button
                      className="w-full bg-blue-950 hover:bg-blue-500 rounded-md font-semibold my-3 text-white"
                      size="lg"
                      type="button"
                      onClick={nextStep}
                    >
                      Next
                    </Button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="py-3">
                      <CFInput
                        isRequired
                        label="Password"
                        name="password"
                        type="password"
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>
                    <div className="py-3">
                      <CFInput
                        isRequired
                        label="Confirm Password"
                        name="confirm_password"
                        type="password"
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        className="bg-blue-950 hover:bg-blue-500 rounded-md font-semibold my-3 text-zinc-200"
                        size="lg"
                        type="button"
                        onClick={previousStep}
                      >
                        Previous
                      </Button>

                      <Button
                        className="bg-blue-950 hover:bg-blue-500 rounded-md font-semibold my-3 text-white"
                        size="lg"
                        type="submit"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </>
                )}
              </CFForm>
            </div>

            <div className="text-sm text-center">
              Don’t have an account?&nbsp;
              <Link className="text-blue-600 hover:underline" href="/login">
                Login here
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
    </div>
  );
};

export default SignUpPage;
