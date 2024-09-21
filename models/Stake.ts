export enum StakeCurrencies {
  USDC = "USDC",
  ETH = "ETH",
  FRAX = "FRAX",
}

export type StakeCurenciesType = "USDC" | "ETH" | "FRAX";

export type StakeContractsType = {
  [key in StakeCurenciesType]: {
    label: string;
    stakeKey: StakeCurenciesType;
    address: `0x${string}`;
  };
};
