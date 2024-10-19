export const MAX_DEPOSIT_VAULTS = 5;

export const NOTE_EXTENSIONS = [
  {
    label: "Native ETH",
    description: "Deposit native ETH into your note without manually wrapping it",
    address: "0xDc40",
    enabled: false,
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
