/* eslint-disable no-console */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { FiX } from 'react-icons/fi';
import { Input } from '@nextui-org/input';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { NextPage } from 'next';

import CFForm from '@/src/components/form/CFForm';
import CFInput from '@/src/components/form/CFInput';
import { useUser } from '@/src/context/user.provider';
import { useUserRegistration } from '@/src/hooks/auth.hooks';

const SignUpPage: NextPage = () => {
  const { setIsLoading: userLoading } = useUser();
  const {
    mutate: handleUserSignUp,
    isPending,
    isSuccess,
  } = useUserRegistration();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get('redirect');

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    const userData = {
      ...formData,
    };

    console.log('Sign Up Data =>', userData);

    handleUserSignUp(userData);
    userLoading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.replace('/');
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
    console.log('Input change detected:', name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center">
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
      </div>
    </div>
  );
};

export default SignUpPage;
