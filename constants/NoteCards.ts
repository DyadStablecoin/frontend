export const MAX_DEPOSIT_VAULTS = 5;

export const NOTE_EXTENSIONS = [
  {
    label: "Native ETH",
    description: "Deposit native ETH into your note without manually wrapping it",
    address: "0x9F77A6775d6aC6A69107326130D65E422002B5B2",
    enabled: true,
    icon: "/3d-eth.png",
  },
  {
    label: "Redemption",
    description: "Redeem DYAD directly for underlying collateral",
    address: "0xDc40",
    enabled: false,
    icon: "/redeem.png",
  },
  {
    label: "Atomic Swap",
    description: "Swap collateral types",
    address: "0xDc40",
    enabled: false,
    icon: "/swap.png",
  },
];
