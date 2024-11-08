import React from "react";

interface InputComponentProps {
  placeHolder: string;
  onValueChange: (value: any) => void;
  value: string;
  type?: "text" | "number" | "email" | "password";
  max?: number;
  min?: number;
  disabled?: boolean;
}

const InputComponent: React.FC<InputComponentProps> = ({
  placeHolder,
  onValueChange,
  value,
  type = "text",
  max,
  min,
  disabled = false,
}) => {
  return (
    <input
      max={max}
      min={min ? min : 0}
      type={type}
      value={value}
      disabled={disabled}
      className="border-[#212121] border-2 bg-transparent px-2 h-[39px] rounded-none w-full outline-none"
      placeholder={placeHolder}
      onChange={(e) => onValueChange(e.target.value)}
    />
  );
};
export default InputComponent;
