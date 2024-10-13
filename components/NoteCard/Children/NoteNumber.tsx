"use client";

import React from "react";
import { NoteNumberDataColumnModel } from "@/models/NoteCardModels";
import PieChartComponent from "@/components/reusable/PieChartComponent";
import { Data } from "@/models/ChartModels";
import { Blocks } from "lucide-react";
import { Tooltip } from "@nextui-org/tooltip";
import { isDataEmpty } from "@/utils/chartUtils";

interface NoteNumberProps {
  data: NoteNumberDataColumnModel[];
  dyad: number[];
  collateral: Data[];
  onNoteExtensionsModalOpen: () => void;
}

const NoteNumber: React.FC<NoteNumberProps> = ({
  data,
  dyad,
  collateral,
  onNoteExtensionsModalOpen,
}) => {
  const dyadData = [
    {
      label: "DYAD mintable",
      value: Math.ceil(dyad[0]),
    },
    {
      label: "DYAD minted",
      value: Math.ceil(dyad[1]),
    },
  ];

  const hasCollateral =
    collateral.length > 0 && collateral.some((item) => item.value > 0);

  return (
    <div className="flex flex-col items-center w-full text-[#FAFAFA]">
      <Tooltip
        content="Manage extensions"
        closeDelay={200}
        placement="right-end"
      >
        <div
          className="ml-auto mt-4 md:mt-2 cursor-pointer w-[35px] md:flex hidden h-[35px] rounded-full bg-[#282828]"
          onClick={onNoteExtensionsModalOpen}
        >
          <Blocks size={18} className="m-auto" />
        </div>
      </Tooltip>
      {hasCollateral && (
        <div className="w-full mt-6">
          <PieChartComponent outsideData={dyadData} insideData={collateral} />
        </div>
      )}
      <div className="w-full mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className={`flex justify-between p-4 rounded-lg shadow-md ${
                item.highlighted ? "bg-[#1A1A1A]" : "bg-[#282828]"
              }`}
            >
              <div className="text-sm font-medium">{item.text}</div>
              <div className="text-sm text-right">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoteNumber;
