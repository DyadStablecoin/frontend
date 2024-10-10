"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import useEthPrice from "@/hooks/useEthPrice";
import useTvl from "@/hooks/useTvl";
import useKerosenePrice from "@/hooks/useKerosenePrice";
import { useReadKeroseneVaultV2AssetPrice } from "@/generated";
import { fromBigNumber } from "@/lib/utils";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DataCards from "../DataCards/DataCards";

export const MainNav = React.memo(function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {
    ethPrice,
    isLoading: ethPriceLoading,
    error: ethPriceError,
  } = useEthPrice();
  const {
    kerosenePrice,
    isLoading: kerosenePriceLoading,
    error: kerosenePriceError,
  } = useKerosenePrice();

  const {
    data: keroseneVaultAssetPrice,
    isLoading: keroseneVaultLoading,
    error: keroseneVaultError,
  } = useReadKeroseneVaultV2AssetPrice();
  const { tvl, isLoading: tvlLoading, error: tvlError } = useTvl();

  const ethPriceDisplay = ethPriceError
    ? "N/A"
    : ethPriceLoading
      ? "Loading..."
      : `$${ethPrice?.toFixed(0)}`;
  const kerosenePriceDisplay = kerosenePriceError
    ? "N/A"
    : kerosenePriceLoading
      ? "Loading..."
      : `$${kerosenePrice?.toFixed(4)}`;
  const tvlDisplay = tvlError
    ? "N/A"
    : tvlLoading
      ? "Loading..."
      : `$${(tvl / 1000000).toFixed(2)}M`;
  const keroseneVaultDisplay = keroseneVaultError
    ? "N/A"
    : keroseneVaultLoading
      ? "Loading..."
      : `$${fromBigNumber(keroseneVaultAssetPrice, 8).toFixed(4)}`;

  return (
    <nav className={cn("", className)} {...props}>
      <div className="flex justify-start items-center">
        <Link
          href="/"
          className="text-2xl font-bold transition-colors hover:text-primary"
        >
          DYAD
        </Link>
        <div className="ml-auto flex items-center text-xs md:text-sm">
          <ConnectButton showBalance={false} />
        </div>
      </div>
      <DataCards
        className="mt-8 md:mt-6"
        data={[
          {
            label: "ETH",
            value: ethPriceDisplay,
            link: "https://www.coingecko.com/en/coins/ethereum",
          },
          {
            label: "TVL",
            value: tvlDisplay,
            link: "https://defillama.com/protocol/dyad#information",
          },
          {
            label: "KERO",
            value: kerosenePriceDisplay,
            link: "https://www.coingecko.com/en/coins/kerosene",
          },
          {
            label: "DV",
            value: keroseneVaultDisplay,
            link: "https://dune.com/coffeexcoin/dyad-stable-v2",
          },
        ]}
      />
    </nav>
  );
});
