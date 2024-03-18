import React from "react";
import { COLORS } from "@/constants/styles";

interface ButtonComponentProps {
  styles?: {};
  variant?: "solid" | "bordered";
  children: JSX.Element | string;
  onClick?: () => void;
  disabled?: boolean;
}

const MAIN_BUTTON_STYLES = " px-[23px] h-[39px] w-full text-sm";

const BORDERED_STYLES = "rounded-[5px] rounded border border-[#434343] ";
const SOLID_STYLES = "rounded-[5px] rounded bg-[#282828]";

const classNames: any = {
  bordered: BORDERED_STYLES,
  solid: SOLID_STYLES,
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  styles = {},
  variant = "solid",
  children,
  onClick = () => {},
  disabled = false,
}) => {
  return (
    <button
      className={`${classNames[variant]} ${MAIN_BUTTON_STYLES}`}
      style={{ color: COLORS.WHITE, fontWeight: "400", ...styles }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default ButtonComponent;
