import { Controller, useFormContext } from "react-hook-form";
import AsyncSelect from "react-select/async";

import { IInput } from "@/src/types";

interface IProps extends IInput {
  loadOptions: (
    inputValue: string,
  ) => Promise<{ value: string; label: string }[]>;
  placeholder?: string;
  onInputChange?: (inputValue: string) => void;
  onChange?: (value: string) => void; // Pass value as a string
}

export default function CFAsyncSelect({
  name,
  label,
  loadOptions,
  placeholder = "Select...",
  disabled,
  onChange,
}: IProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <label className="block mb-2 text-sm font-medium">{label}</label>
          <AsyncSelect
            {...field}
            cacheOptions
            isDisabled={disabled}
            loadOptions={loadOptions}
            placeholder={placeholder}
            styles={{
              option: (provided) => ({
                ...provided,
                color: "#333", // Darker text color for suggestions
              }),
              singleValue: (provided) => ({
                ...provided,
                color: "#333", // Darker text color for selected option
              }),
              input: (provided) => ({
                ...provided,
                color: "#333", // Darker text for input field
              }),
            }}
            onChange={(selectedOption) => {
              const selectedValue = selectedOption
                ? selectedOption.value
                : null;

              field.onChange(selectedValue); // Update the form state with the selected value
              if (onChange) onChange(selectedValue); // Call parent's onChange if provided
            }}
            value={
              field.value ? { label: field.value, value: field.value } : null
            } // Maintain the current value
          />
          {errors[name] && (
            <p className="mt-2 text-sm text-red-600">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
      )}
    />
  );
}
