export const MAX_DEPOSIT_VAULTS = 5;

export const NOTE_EXTENSIONS = [
  {
    label: "Native ETH",
    description: "Deposit ETH into your note",
    address: "0xDc40",
    enabled: true,
    icon: "/3d-eth.png",
  },
  {
    label: "Redemption",
    description: "Redeem DYAD for underlying collateral",
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
