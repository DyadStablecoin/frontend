import { TriangleAlert } from "lucide-react";
import React from "react";

interface ErrorComponentProps {
  className?: string;
  errorText?: string;
  errorSubText?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  className,
  errorText,
  errorSubText,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <>
        <TriangleAlert size={40} className="mx-auto" />
        <p className="text-md md:text-xl text-center mt-4 text-white">
          {errorText}
        </p>
        <p className="text-xs md:text-md text-center mt-2 text-[#A1A1AA]">
          {errorSubText}
        </p>
      </>
    </div>
  );
};
export default ErrorComponent;
