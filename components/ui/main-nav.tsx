"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import useTvl from "@/hooks/useTvl";
import useKerosenePrice from "@/hooks/useKerosenePrice";
import { useReadKeroseneVaultV2AssetPrice } from "@/generated";
import { fromBigNumber } from "@/lib/utils";
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAverageYield from "@/hooks/useAverageYield";

export const MainNav = React.memo(function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { averageYield } = useAverageYield();

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
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="text-[32px] font-medium transition-colors hover:text-primary"
        >
          DYAD
        </Link>
        <div className="hidden md:flex gap-5 text-sm text-[#B0B0B0] font-normal">
          <div className="flex">
            <div className="mr-1">AVG APR</div>
            <div> {(averageYield * 100).toFixed(2) + "%"}</div>
          </div>
          <div className="flex">
            <div className="mr-1">TVL</div>
            <div> {tvlDisplay}</div>
          </div>
          <div className="flex">
            <div className="mr-1">KERO</div>
            <div> {kerosenePriceDisplay}</div>
          </div>
          <div className="flex">
            <div className="mr-1">DV</div>
            <div> {keroseneVaultDisplay}</div>
          </div>
        </div>
        <ConnectButton showBalance={false} />
      </div>
      <div className="flex md:hidden justify-between text-xs text-normal text-[#B0B0B0] mt-4">
        <div className=" flex">
          <div className="mr-1">AVG APR</div>
          <div> {(averageYield * 100).toFixed(2) + "%"}</div>
        </div>
        <div className="flex">
          <div className="mr-1">TVL</div>
          <div> {tvlDisplay}</div>
        </div>
        <div className="flex">
          <div className="mr-1">KERO</div>
          <div> {kerosenePriceDisplay}</div>
        </div>
        <div className="flex">
          <div className="mr-1">DV</div>
          <div> {keroseneVaultDisplay}</div>
        </div>
      </div>
    </nav>
  );
});
