import { Data } from "@/models/ChartModels";

export const getDataItemPercentage = (dataItem: Data, data: Data[]) => {
  const sum = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.value,
    0
  );

  return dataItem.value / sum;
};

export const isDataEmpty = (data: Data[]) =>
  data.find((item) => (item.value > 0 ? true : false));
