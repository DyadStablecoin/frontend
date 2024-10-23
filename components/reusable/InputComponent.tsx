import { Input } from "@nextui-org/input";
import React from "react";

interface InputComponentProps {
  placeHolder: string;
  onValueChange: (value: any) => void;
  value: string;
  type?: "text" | "number" | "email" | "password";
  max?: number;
  min?: number;
}

const InputComponent: React.FC<InputComponentProps> = ({
  placeHolder,
  onValueChange,
  value,
  type = "text",
  max,
  min,
}) => {
  return (
    <Input
      max={max}
      min={min ? min : 0}
      type={type}
      value={value}
      classNames={{
        inputWrapper: "border-[#434343] border h-[39px] rounded-none",
      }}
      size="sm"
      variant="bordered"
      placeholder={placeHolder}
      onValueChange={onValueChange}
    />
  );
};
export default InputComponent;
