import EditVaultTabContent from "@/components/Modals/NoteCardModals/DepositModals/EditVault/EditVaultTabContent";
import LpStakeModalTab from "@/components/Modals/NoteCardModals/LpModals/LpStakeModalTab";
import Deposit from "@/components/NoteCard/Children/Deposit";
import Earn from "@/components/NoteCard/Children/Earn";
import Lp from "@/components/NoteCard/Children/Lp";
import Mint from "@/components/NoteCard/Children/Mint";
import NoteNumber from "@/components/NoteCard/Children/NoteNumber";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import {
  NoteNumberDataModel,
  VaultCardDataModel,
} from "@/models/NoteCardModels";
import { TabsDataModel } from "@/models/TabsModel";

export const NOTE_NUMBER_MOCK_DATA: NoteNumberDataModel = {
  left: [
    {
      text: "DYAD mint cost",
      value: "$0.78",
      highlighted: true,
    },
    {
      text: "Momentum",
      value: "2.5x",
      highlighted: false,
    },
    {
      text: "LP stake",
      value: "1.85%",
      highlighted: false,
    },
  ],
  right: [
    {
      text: "Collateralization ratio",
      value: "385%",
      highlighted: true,
    },
    {
      text: "DYAD minted",
      value: "3,000",
      highlighted: false,
    },
    {
      text: "Collateral",
      value: "$10,805",
      highlighted: false,
    },
  ],
};

export const VAULT_CARDS_DATA: VaultCardDataModel[] = [
  {
    currency: "wETH",
    value: "$6,080",
  },
  {
    currency: "wstETH ",
    value: "$1,200",
  },
  {
    currency: "sfrxETH ",
    value: "$4,500",
  },
  {
    currency: "Kerosene",
    value: "$4,500",
  },
  // {
  //   currency: "Kerosene",
  //   value: "$4,500",
  // },
];

export const TABS_MOCK_DATA: TabsDataModel[] = [
  {
    label: "Note Nº 223",
    tabKey: "Note Nº 223",
    content: (
      <div>
        <NoteNumber data={NOTE_NUMBER_MOCK_DATA} />
      </div>
    ),
  },
  {
    label: "Deposit",
    tabKey: "Deposit",
    content: (
      <Deposit
        total_collateral="$10,801"
        collateralization_ratio="320%"
        vault_cards={VAULT_CARDS_DATA}
      />
    ),
  },
  {
    label: "Mint",
    tabKey: "Mint",
    content: <Mint dyadMinted="3,000" currentCr="300%" newCr="320%" />,
  },
  {
    label: "LP",
    tabKey: "LP",
    content: (
      <Lp totalStake="$18,043" totalPercentage="1.30%" momentum="2.5x" />
    ),
  },
  {
    label: "Earn",
    tabKey: "Earn",
    content: (
      <div>
        <Earn apy="8.7%" currentCr="300%" newCr="320%" />
      </div>
    ),
  },
];

export const getLpModalData = (pool: string) => [
  {
    label: "Stake",
    tabKey: "Stake",
    content: (
      <LpStakeModalTab NewMomentum="2.2x" currentMomentum="2.5x" pool={pool} />
    ),
  },
  {
    label: "Unstake",
    tabKey: "Unstake",
    content: (
      <LpStakeModalTab
        NewMomentum="2.2x"
        currentMomentum="2.5x"
        pool={pool}
        type="unstake"
      />
    ),
  },
];

export const getVaultModalData = (currency: string) => [
  {
    label: "Deposit",
    tabKey: "Deposit",
    content: (
      <EditVaultTabContent
        currentCollateralizationRatio="300%"
        newCollateralizationRatio="320%"
        currency={currency}
      />
    ),
  },
  {
    label: "Withdraw",
    tabKey: "Withdraw",
    content: (
      <EditVaultTabContent
        currentCollateralizationRatio="300%"
        newCollateralizationRatio="320%"
        currency={currency}
      />
    ),
  },
  {
    label: "Redeem",
    tabKey: "Redeem",
    content: (
      <EditVaultTabContent
        currentCollateralizationRatio="300%"
        newCollateralizationRatio="320%"
        currency={currency}
      />
    ),
  },
];

export const rows = [
  {
    key: "1",
    collateral: "wETH",
    oracle_price: "$2300",
    tvl: "$800,000",
    action: <ButtonComponent>Add</ButtonComponent>,
  },
  {
    key: "2",
    collateral: "wstETH",
    oracle_price: "$2300",
    tvl: "$800,000",
    action: <ButtonComponent>Add</ButtonComponent>,
  },
  {
    key: "3",
    collateral: "sfrxETH ",
    oracle_price: "$2300",
    tvl: "$800,000",
    action: <ButtonComponent>Add</ButtonComponent>,
  },
  {
    key: "4",
    collateral: "Kerosene ",
    oracle_price: "$2300",
    tvl: "$800,000",
    action: <ButtonComponent>Add</ButtonComponent>,
  },
];

export const columns = [
  {
    key: "collateral",
    label: "Collateral",
  },
  {
    key: "oracle_price",
    label: "Oracle price",
  },
  {
    key: "tvl",
    label: "TVL",
  },
  {
    key: "action",
    label: "",
  },
];

export const LpRows = [
  {
    key: "ETH - DYAD (Uniswap)",
    pool: "ETH - DYAD (Uniswap)",
    staked: "$2300",
    tvl: "$800,000",
  },
  {
    key: "USDC - DYAD (Uniswap)",
    pool: "USDC - DYAD (Uniswap)",
    staked: "$2300",
    tvl: "$800,000",
  },
  {
    key: "LUSD - DYAD (Zero)",
    pool: "LUSD - DYAD (Zero)",
    staked: "$2300",
    tvl: "$800,000",
  },
  {
    key: "ETH - DYAD (Zero)",
    pool: "ETH - DYAD (Zero)",
    staked: "$2300",
    tvl: "$800,000",
  },
];

export const LpColumns = [
  {
    key: "pool",
    label: "Pool",
  },
  {
    key: "staked",
    label: "Staked",
  },
  {
    key: "tvl",
    label: "TVL",
  },
];
