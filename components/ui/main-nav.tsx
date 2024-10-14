"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import useEthPrice from "@/hooks/useEthPrice";
import useTvl from "@/hooks/useTvl";
import useKerosenePrice from "@/hooks/useKerosenePrice";
import { useReadKeroseneVaultV2AssetPrice } from "@/generated";
import { fromBigNumber } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSearchParams } from "next/navigation";
import { Tab, Tabs } from "@nextui-org/tabs";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import {
  BadgeDollarSign,
  Blocks,
  ChartNoAxesGantt,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";

export const MainNav = React.memo(function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [activeNavItem, setActiveNavItem] = useState("earn-kerosene");

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab) {
      setActiveNavItem(tab as string);
    }
  }, [tab]);

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

  const navItemsData = [
    {
      label: "Earn Kerosene",
      key: "earn-kerosene",
      onClick: () => {
        setActiveNavItem("earn-kerosene");
        window.history.pushState({}, "", "/?tab=earn-kerosene");
      },
      icon: <BadgeDollarSign />,
    },
    {
      label: "Manage Notes",
      key: "notes",
      onClick: () => {
        setActiveNavItem("notes");
        window.history.pushState({}, "", "/?tab=notes");
      },
      icon: <ChartNoAxesGantt />,
    },
    {
      label: "Marketplace",
      key: "marketplace",
      onClick: () => {
        setActiveNavItem("marketplace");
        window.history.pushState({}, "", "/?tab=marketplace");
      },
      icon: <ShoppingBag />,
    },
    {
      label: "Extensions",
      key: "extensions",
      onClick: () => {
        setActiveNavItem("extensions");
        window.history.pushState({}, "", "/?tab=extensions");
      },
      icon: <Blocks />,
    },
  ];

  return (
    <nav className={cn("", className)} {...props}>
      <div className="flex justify-start items-center">
        <Link
          href="/"
          className="text-2xl font-bold transition-colors hover:text-primary"
        >
          DYAD
        </Link>
        <div className="hidden lg:block">
          <Tabs
            key="NavTabs"
            variant="light"
            radius="full"
            aria-label="Navbar tabs"
            className="ml-6 flex text-sm"
            classNames={{
              cursor: "group-data-[selected=true]:bg-[#1A1B1F]",
              tabContent: "text-xs text-white",
            }}
            selectedKey={activeNavItem}
            onSelectionChange={(key) => {
              navItemsData.find((item) => item.key === key)?.onClick();
            }}
          >
            {navItemsData.map((item: any) => (
              <Tab
                href=""
                key={item.key}
                title={item.label}
                onClick={item.onClick}
              />
            ))}
          </Tabs>
        </div>
        <div className="block lg:hidden fixed bottom-4 right-2 left-2 z-50">
          <Tabs
            key="NavTabs"
            variant="light"
            radius="full"
            aria-label="Navbar tabs"
            className="flex text-sm"
            classNames={{
              base: "bg-[black] p-2 rounded-full",
              cursor: "group-data-[selected=true]:bg-[#1A1B1F]",
              tabContent: "text-xs text-white",
              tabList: "w-full",
            }}
            selectedKey={activeNavItem}
            onSelectionChange={(key) => {
              navItemsData.find((item) => item.key === key)?.onClick();
            }}
          >
            {navItemsData.map((item: any) => (
              <Tab
                href=""
                key={item.key}
                title={
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <div className="hidden md:block">{` ${item.label.split(" ")[0]}`}</div>
                  </div>
                }
                onClick={item.onClick}
                className="col-span-1 flex justify-center items-center"
              />
            ))}
          </Tabs>
        </div>

        <div className="ml-auto flex items-center text-xs md:text-sm">
          <Dropdown>
            <DropdownTrigger>
              <div className="flex items-center bg-[#1A1B1F] lg:w-[147px] w-[40px] h-[40px] rounded-full lg:rounded-xl mr-4 px-2 cursor-pointer">
                <div className="w-full hidden lg:flex justify-between text-xs">
                  <div className="font-bold text-[#A1A1AA]">TVL</div>
                  <div className="">{tvlDisplay}</div>
                </div>
                <div className="font-bold text-[#A1A1AA] text-lg m-auto lg:hidden block">
                  $
                </div>
                <div className="h-8 w-8 rounded-full bg-[#1A1B1F] p-0 hidden lg:flex">
                  <ChevronDown className="w-4 h-4 m-auto" />
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Action event example">
              <DropdownSection
                classNames={{
                  base: "m-0",
                  divider: "m-0",
                }}
                showDivider
              >
                <DropdownItem
                  key="ETH"
                  href="https://www.coingecko.com/en/coins/ethereum"
                  target="_blank"
                >
                  <div className="w-full flex justify-between text-xs py-2">
                    <div className="font-bold text-[#A1A1AA]">ETH</div>
                    <div className="">{ethPriceDisplay}</div>
                  </div>
                </DropdownItem>
              </DropdownSection>
              <DropdownSection
                classNames={{
                  base: "m-0",
                  divider: "m-0",
                }}
                showDivider
              >
                <DropdownItem
                  key="TVL"
                  href="https://defillama.com/protocol/dyad#information"
                  target="_blank"
                >
                  <div className="w-full flex justify-between text-xs py-2">
                    <div className="font-bold text-[#A1A1AA]">TVL</div>
                    <div className="">{tvlDisplay}</div>
                  </div>
                </DropdownItem>
              </DropdownSection>
              <DropdownSection
                classNames={{
                  base: "m-0",
                  divider: "m-0",
                }}
                showDivider
              >
                <DropdownItem key="KERO">
                  <Link
                    href="https://www.coingecko.com/en/coins/kerosene"
                    target="_blank"
                    className="w-full flex justify-between text-xs py-2"
                  >
                    <div className="font-bold text-[#A1A1AA]">KERO</div>
                    <div className="">{kerosenePriceDisplay}</div>
                  </Link>
                </DropdownItem>
              </DropdownSection>
              <DropdownItem key="DV">
                <Link
                  href="https://dune.com/coffeexcoin/dyad-stable-v2"
                  target="_blank"
                  className="w-full flex justify-between text-xs py-2"
                >
                  <div className="font-bold text-[#A1A1AA]">DV</div>
                  <div className="">{keroseneVaultDisplay}</div>
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
});
