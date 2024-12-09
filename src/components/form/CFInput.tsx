import { Input } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";
import { ChangeEvent } from "react";

import { IInput } from "@/src/types";

interface IProps extends IInput {
  isRequired?: boolean;
  validation?: Record<string, any>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Explicit onChange prop
}

export default function CFInput({
  variant = "bordered",
  size = "md",
  type = "text",
  label,
  name,
  isRequired = false,
  validation,
  onChange, // Accept onChange prop
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      {...register(name, { required: isRequired, ...validation })}
      errorMessage={errors[name]?.message as string}
      isInvalid={!!errors[name]}
      isRequired={isRequired}
      label={label}
      size={size}
      type={type}
      variant={variant}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange(e); // Pass the onChange handler if provided
      }}
    />
  );
}
