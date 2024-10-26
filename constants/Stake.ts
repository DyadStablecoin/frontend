import { StakeCurrencies, StakeContractsType } from "@/models/Stake";

export const STAKE_CONTRACTS: StakeContractsType = {
  [StakeCurrencies.CURVE_M0_DYAD_LP]: {
    label: "M0 - DYAD",
    stakeKey: StakeCurrencies.CURVE_M0_DYAD_LP,
    address: "0xa969cFCd9e583edb8c8B270Dc8CaFB33d6Cf662D",
    stakingContract: "0xe48c80CF20C7fCE3458896BB263D9D8D6404b39f",
    name: "M0/DYAD LP",
  },
  [StakeCurrencies.ETH]: {
    label: "ETH - DYAD",
    stakeKey: StakeCurrencies.ETH,
    address: "0x8e0e695fEC31d5502C2f3E860Fe560Ea80b03E1D",
  },
  [StakeCurrencies.FRAX]: {
    label: "FRAX - DYAD",
    stakeKey: StakeCurrencies.FRAX,
    address: "0x8e0e695fEC31d5502C2f3E860Fe560Ea80b03E1D",
  },
};
