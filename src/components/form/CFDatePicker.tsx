import { DatePicker } from "@nextui-org/date-picker";
import { Controller } from "react-hook-form";

import { IInput } from "@/src/types";

interface IProps extends IInput {}

export default function CFDatePicker({
  label,
  name,
  variant = "bordered",
}: IProps) {
  return (
    <Controller
      name={name}
      render={({ field: { ...fields } }) => (
        <DatePicker
          className="min-w-full sm:min-w-[225px]"
          label={label}
          variant={variant}
          {...fields}
        />
      )}
    />
  );
}
