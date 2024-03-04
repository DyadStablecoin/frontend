import React from "react";

interface ButtonComponentProps {
  variant?: "solid" | "bordered";
  children: JSX.Element | string;
  onClick?: () => void;
}

const MAIN_BUTTON_STYLES = " px-[23px] h-[39px] w-full text-sm";

const BORDERED_STYLES = "rounded-[5px] rounded border border-[#434343] ";
const SOLID_STYLES = "rounded-[5px] rounded bg-[#282828]";

const classNames: any = {
  bordered: BORDERED_STYLES,
  solid: SOLID_STYLES,
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  variant = "solid",
  children,
  onClick = () => {},
}) => {
  return (
    <button
      className={`${classNames[variant]} ${MAIN_BUTTON_STYLES}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default ButtonComponent;
