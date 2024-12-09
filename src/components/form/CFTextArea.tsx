import { Textarea } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";

import { IInput } from "@/src/types";

interface IProps extends IInput {
  isRequired?: boolean;
  onChange?: (value: string) => void; // Accepting the new value directly
}

export default function CFTextarea({
  name,
  label,
  variant = "bordered",
  isRequired = false,
  onChange,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <Textarea
        {...register(name, { required: isRequired })}
        isRequired={isRequired}
        label={label}
        minRows={6}
        variant={variant}
        onChange={(e) => {
          const value = e.target.value;

          if (onChange) onChange(value);
        }}
      />
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
