import useWindowSize from "@/hooks/useWindowSize";
import Link from "next/link";
import React from "react";

interface DataCardData {
  label: string;
  value: string;
  link: string;
}

interface DataCardsProps {
  data: DataCardData[];
  className?: string;
}

const DataCards: React.FC<DataCardsProps> = ({ data, className }) => {
  return (
    <div
      className={`text-white bg-transparent rounded-lg grid grid-cols-4 gap-2 ${className}`}
    >
      {data.map(({ label, value, link }, index) => (
        <Link
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          key={label}
          className="flex justify-between w-full"
        >
          <div className="flex px-1 py-2 md:px-3 md:py-2 bg-[#1A1A1A] items-center justify-between w-full rounded-md">
            <div className="flex flex-row text-[#b3b3b3] font-semibold items-center text-[0.6em] md:text-sm">
              <div>{label}</div>
            </div>
            <div className="text-[0.6em] md:text-sm text-white block">
              {value}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default DataCards;
