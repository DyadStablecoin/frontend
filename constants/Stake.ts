import { StakeCurrencies, StakeContractsType } from "@/models/Stake";
import dyadIcon from "../public/android-chrome-256x256.png";
import USDCIcon from "../public/usdc-icon.png";
import wmIcon from "../public/wm-icon.png";

export const STAKE_CONTRACTS: StakeContractsType = {
  [StakeCurrencies.CURVE_M0_DYAD_LP]: {
    label: "wM - DYAD",
    stakeKey: StakeCurrencies.CURVE_M0_DYAD_LP,
    address: "0xa969cFCd9e583edb8c8B270Dc8CaFB33d6Cf662D",
    stakingContract: "0xe48c80CF20C7fCE3458896BB263D9D8D6404b39f",
    name: "wM/DYAD LP",
    iconLeft: wmIcon,
    iconRight: dyadIcon,
    link: "https://curve.fi/#/ethereum/pools/factory-stable-ng-272/deposit", 
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
  },
};
