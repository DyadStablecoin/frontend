import { outsideFillColors } from "@/constants/Charts";
import { Data } from "@/models/ChartModels";
import LineDataChart from "./LineDataChart";
import { useState } from "react";

interface PieChartComponentProps {
  outsideData: Data[];
  insideData: Data[];
  options?: any;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: any;
  payload?: any;
}) => {
  console.log(active, payload);
  if (payload && payload.length) {
    const split: string[] = payload[0].payload.label.split("|");

    return (
      <div className="bg-black border rounded-md p-4">
        {split.map((label, index) => (
          <p key={index} className="label">
            {label}
          </p>
        ))}
      </div>
    );
  }
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  insideData,
  outsideData,
  options = {},
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState<null | string>(null);

  return (
    <div>
      <div className="block rounded-[25px] w-full">
        {outsideData.find((item) => item.value > 0) && (
          <LineDataChart
            data={outsideData}
            fillColors={outsideFillColors}
            isTooltipOpen={isTooltipOpen}
            setIsTooltipOpen={setIsTooltipOpen}
          />
        )}

        {insideData.find((item) => item.value > 0) && (
          <LineDataChart
            data={insideData}
            fillColors={insideData.map((item) => item.color ?? "")}
            isTooltipOpen={isTooltipOpen}
            setIsTooltipOpen={setIsTooltipOpen}
            labelDataIndex="$"
          />
        )}
      </div>
    </div>
  );
};

export default PieChartComponent;
