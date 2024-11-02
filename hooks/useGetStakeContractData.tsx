import { useState } from "react";

import {
  useReadCurveM0DyadAllowance,
  useReadCurveM0DyadBalanceOf,
  useReadCurveUsdcdyadAllowance,
  useReadCurveUsdcdyadBalanceOf,
  useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited,
  useReadDyadLpStakingCurveUsdcdyadNoteIdToAmountDeposited,
  useWriteCurveM0DyadApprove,
  useWriteCurveUsdcdyadApprove,
  useWriteDyadLpStakingCurveM0DyadDeposit,
  useWriteDyadLpStakingCurveM0DyadWithdraw,
  useWriteDyadLpStakingCurveUsdcdyadDeposit,
  useWriteDyadLpStakingCurveUsdcdyadWithdraw,
} from "@/generated";
import {
  StakeContractsType,
  StakeCurenciesType,
  StakeCurrencies,
} from "@/models/Stake";
import dyadIcon from "../public/android-chrome-256x256.png";
import USDCIcon from "../public/usdc-icon.png";
import wmIcon from "../public/wm-icon.png";

const useGetStakeContractData = (stakeContractKey: StakeCurenciesType) => {
  const [stakeContractData] = useState<StakeContractsType>({
    [StakeCurrencies.CURVE_M0_DYAD_LP]: {
      label: "wM - DYAD",
      stakeKey: StakeCurrencies.CURVE_M0_DYAD_LP,
      address: "0xa969cFCd9e583edb8c8B270Dc8CaFB33d6Cf662D",
      stakingContract: "0xe48c80CF20C7fCE3458896BB263D9D8D6404b39f",
      name: "wM/DYAD LP",
      iconLeft: wmIcon,
      iconRight: dyadIcon,
      link: "https://curve.fi/#/ethereum/pools/factory-stable-ng-272/deposit",
      getWriteLPApprove: (args?: any) =>
        useWriteCurveM0DyadApprove(args).writeContract,
      getWriteLPStake: (args?: any) =>
        useWriteDyadLpStakingCurveM0DyadDeposit(args).writeContract,
      getAallowance: (args?: any) => useReadCurveM0DyadAllowance(args).data,
      getWriteUnstake: (args?: any) =>
        useWriteDyadLpStakingCurveM0DyadWithdraw(args).writeContract,
      getLpBalance: (args?: any) => useReadCurveM0DyadBalanceOf(args).data,
      getStakeBalance: (args?: any) =>
        useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited(args).data,
    },
    [StakeCurrencies.CURVE_USDC_DYAD_LP]: {
      label: "USDC - DYAD",
      stakeKey: StakeCurrencies.CURVE_USDC_DYAD_LP,
      address: "0x1507bf3f8712c496fa4679a4ba827f633979dba4",
      stakingContract: "0xbEdC56Bcf36BFe06B36fe7872C7BBD567a0735c3",
      name: "USDC/DYAD LP",
      iconLeft: USDCIcon,
      iconRight: dyadIcon,
      link: "https://curve.fi/#/ethereum/pools/factory-stable-ng-287/deposit",
      getWriteLPApprove: (args?: any) =>
        useWriteCurveUsdcdyadApprove(args).writeContract,
      getWriteLPStake: (args?: any) =>
        useWriteDyadLpStakingCurveUsdcdyadDeposit(args).writeContract,
      getAallowance: (args?: any) => useReadCurveUsdcdyadAllowance(args).data,
      getWriteUnstake: (args?: any) =>
        useWriteDyadLpStakingCurveUsdcdyadWithdraw(args).writeContract,
      getLpBalance: (args?: any) => useReadCurveUsdcdyadBalanceOf(args).data,
      getStakeBalance: (args?: any) =>
        useReadDyadLpStakingCurveUsdcdyadNoteIdToAmountDeposited(args).data,
    },
  });

  return stakeContractData[stakeContractKey];
};

export default useGetStakeContractData;
