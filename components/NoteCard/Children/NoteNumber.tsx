import { NoteNumberDataModel } from "@/models/NoteCardModels";
import React from "react";

interface NoteNumberProps {
  data: NoteNumberDataModel;
}

const NoteNumber: React.FC<NoteNumberProps> = ({ data }) => {
  return (
    <div className="flex justify-between">
      <div className="flex justify-between w-full mt-9 text-[#FAFAFA] px-3.5">
        {Object.values(data).map((column: any, index: number) => (
          <div key={index}>
            {column.map((item: any, index: number) => (
              <div
                key={index}
                className={`flex w-60 justify-between mt-7 text-sm ${
                  item.highlighted ? "text-[#FAFAFA]" : "text-[#A1A1AA]"
                }`}
              >
                <div>{item.text}</div>
                <div className="text-right">{item.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default NoteNumber;
