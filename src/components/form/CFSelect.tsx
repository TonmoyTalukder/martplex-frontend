import { Select, SelectItem } from "@nextui-org/select";
import { useFormContext, Controller } from "react-hook-form";

import { IInput } from "@/src/types";

interface IProps extends IInput {
  options: {
    value: string;
    label: string;
  }[];
  isRequired?: boolean;
  onChange?: (value: string) => void; // Typing onChange for the value directly
}

export default function CFSelect({
  options,
  name,
  label,
  variant = "bordered",
  disabled = false,
  isRequired = false,
  onChange,
}: IProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Safely extract the error message
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="w-full">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            // Apply the value and onChange handlers from react-hook-form
            {...field}
            className="min-w-full sm:min-w-[225px]"
            isDisabled={disabled}
            isInvalid={!!errors[name]} // Error handling for invalid input
            isRequired={isRequired}
            label={label}
            variant={variant}
            onSelectionChange={(selectedKey) => {
              // Extracting currentKey from SharedSelection
              const value =
                typeof selectedKey === "string"
                  ? selectedKey
                  : selectedKey.currentKey; // currentKey is the selected key

              if (value) {
                field.onChange(value); // Update react-hook-form's internal state
                if (onChange) onChange(value); // Call the parent's onChange if provided
              }
            }}
          >
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        )}
        rules={{ required: isRequired }}
      />
      {/* Error message handling */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">
          {errorMessage || "This field is required"}
        </p>
      )}
    </div>
  );
}
