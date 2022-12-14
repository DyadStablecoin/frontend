import { useEffect, useState } from "react";
import { useFeeData } from "wagmi";
import { round } from "../utils/currency";

// returns the gas cost of a transaction in ETH
// config is what is returned by wagmi's `usePrepareContractWrite` hook
export default function useGasCost(config) {
  const [gasCost, setGasCost] = useState(0);
  const { data } = useFeeData({
    formatUnits: "gwei",
  });

  useEffect(() => {
    if (config && config.request) {
      const gasLimit = parseInt(config.request.gasLimit._hex);
      const maxFeePerGas = parseFloat(data?.formatted.maxFeePerGas);
      const gasCost = gasLimit * maxFeePerGas;
      setGasCost(round(gasCost / 10 ** 9, 8));
    }
  }, [config]);

  return { gasCost };
}
