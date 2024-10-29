import { Address } from "viem";

export enum StakeCurrencies {
  ETH = "ETH",
  FRAX = "FRAX",
  CURVE_M0_DYAD_LP = "CURVE_M0_DYAD_LP",
}

export type StakeCurenciesType = "ETH" | "FRAX" | "CURVE_M0_DYAD_LP";

export type StakeContractsType = {
  [key in StakeCurenciesType]: {
    label: string;
    stakeKey: StakeCurenciesType;
    address: Address;
    stakingContract?: Address;
    name?: string;
  };
};
