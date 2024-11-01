import { STAKE_CONTRACTS } from "@/constants/Stake";
import {
  dyadLpStakingCurveM0DyadAbi,
  dyadLpStakingCurveM0DyadAddress,
  dyadLpStakingCurveUsdcdyadAbi,
  dyadLpStakingCurveUsdcdyadAddress,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import { fromBigNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";
import useKerosenePrice from "./useKerosenePrice";

const useStakePoolData = (tokenId: string) => {
  const [stakeData, setStakeData] = useState<any>([]);

  const { kerosenePrice } = useKerosenePrice();
  const { data: contractData, isSuccess: dataLoaded } = useReadContracts({
    contracts: [
      {
        address: dyadLpStakingCurveM0DyadAddress[defaultChain.id],
        abi: dyadLpStakingCurveM0DyadAbi,
        functionName: "noteIdToAmountDeposited",
        args: [BigInt(tokenId)],
      },
      {
        address: dyadLpStakingCurveUsdcdyadAddress[defaultChain.id],
        abi: dyadLpStakingCurveUsdcdyadAbi,
        functionName: "noteIdToAmountDeposited",
        args: [BigInt(tokenId)],
      },
    ],
    allowFailure: false,
    query: {
      select: (data) => {
        const dyadLpStakingCurveM0DyadBalance = data[0];
        const dyadLpStakingCurveUSDCDyadBalance = data[1];

        return {
          dyadLpStakingCurveM0DyadBalance,
          dyadLpStakingCurveUSDCDyadBalance,
        };
      },
    },
  });

  // Refactor the functions inside the useEffect to be generic and return the required data according to the passed URl
  // Create a get URL function that takes the tokenId and the pool address and returns the URL
  // set the stake data for each stake key with the returned data from the generic fetch functions
  useEffect(() => {
    const fetchYieldData = async () => {
      try {
        const response = await fetch(
          `https://api.dyadstable.xyz/api/yield?noteId=${tokenId}&pool=0xa969cfcd9e583edb8c8b270dc8cafb33d6cf662d`
        );
        const data = await response.json();
        setStakeData((prevState: any) => ({
          ...prevState,
          [STAKE_CONTRACTS.CURVE_M0_DYAD_LP.stakeKey]: {
            ...prevState[STAKE_CONTRACTS.CURVE_M0_DYAD_LP.stakeKey],
            yeildData: data,
            APR:
              Number(data.noteLiquidity) !== 0
                ? `${(
                    (Number(data.kerosenePerYear) /
                      Number(data.noteLiquidity)) *
                    100 *
                    (kerosenePrice || 0)
                  ).toFixed(2)}%`
                : "0%",
          },
        }));
      } catch (error) {
        console.error("Error fetching yield data:", error);
      }
    };

    const fetchYieldDataUSDCDyad = async () => {
      try {
        const response = await fetch(
          `https://api.dyadstable.xyz/api/yield?noteId=${tokenId}&pool=0x1507bf3F8712c496fA4679a4bA827F633979dBa4`
        );
        const data = await response.json();
        setStakeData((prevState: any) => ({
          ...prevState,
          [STAKE_CONTRACTS.CURVE_USDC_DYAD_LP.stakeKey]: {
            ...prevState[STAKE_CONTRACTS.CURVE_USDC_DYAD_LP.stakeKey],
            yeildData: data,
            APR:
              Number(data.noteLiquidity) !== 0
                ? `${(
                    (Number(data.kerosenePerYear) /
                      Number(data.noteLiquidity)) *
                    100 *
                    (kerosenePrice || 0)
                  ).toFixed(2)}%`
                : "0%",
          },
        }));
      } catch (error) {
        console.error("Error fetching USDC/DYAD yield data:", error);
      }
    };

    fetchYieldData();
    fetchYieldDataUSDCDyad();
  }, [tokenId]);

  useEffect(() => {
    if (dataLoaded) {
      setStakeData((prevState: any) => ({
        ...prevState,
        [STAKE_CONTRACTS.CURVE_M0_DYAD_LP.stakeKey]: {
          ...prevState[STAKE_CONTRACTS.CURVE_M0_DYAD_LP.stakeKey],
          liquidityStaked: contractData?.dyadLpStakingCurveM0DyadBalance
            ? fromBigNumber(
                contractData.dyadLpStakingCurveM0DyadBalance
              ).toFixed(2)
            : "0",
        },
        [STAKE_CONTRACTS.CURVE_USDC_DYAD_LP.stakeKey]: {
          ...prevState[STAKE_CONTRACTS.CURVE_USDC_DYAD_LP.stakeKey],
          liquidityStaked: contractData?.dyadLpStakingCurveUSDCDyadBalance
            ? fromBigNumber(
                contractData.dyadLpStakingCurveUSDCDyadBalance
              ).toFixed(2)
            : "0",
        },
      }));
    }
  }, [contractData]);

  return stakeData;
};

export default useStakePoolData;
