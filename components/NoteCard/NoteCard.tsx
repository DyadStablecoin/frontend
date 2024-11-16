"use client";

import React, { Fragment, useMemo, useState, useEffect } from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import TabsComponent from "../reusable/TabsComponent";
import {
  vaultManagerAbi,
  vaultManagerAddress,
  dyadAbi,
  dyadAddress,
  xpAddress,
  xpAbi,
  dyadLpStakingCurveM0DyadAddress,
  dyadLpStakingCurveM0DyadAbi,
  dyadLpStakingCurveUsdcdyadAddress,
  dyadLpStakingCurveUsdcdyadAbi,
  keroseneVaultV2Address,
  keroseneVaultV2Abi,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import NoteNumber from "./Children/NoteNumber";
import { NoteNumberDataColumnModel } from "@/models/NoteCardModels";
import { TabsDataModel } from "@/models/TabsModel";
import Deposit, { supportedVaults } from "./Children/Deposit";
import Mint from "./Children/Mint";
import { useAccount, useReadContracts } from "wagmi";
import { maxUint256 } from "viem";
import { formatNumber, fromBigNumber } from "@/lib/utils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import Stake from "./Children/Stake";
import { Menu, Vault } from "lucide-react";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import useKerosenePrice from "@/hooks/useKerosenePrice";
import { StakeCurrencies } from "@/models/Stake";

type ContractData = {
  collatRatio?: bigint;
  exoCollateralValue?: bigint;
  keroCollateralValue?: bigint;
  totalCollateralValue?: bigint;
  minCollatRatio?: bigint;
  mintedDyad?: bigint;
  xpBalance?: bigint;
  dyadLpStakingCurveM0DyadBalance?: bigint;
  dyadLpStakingCurveUSDCDyadBalance?: bigint;
  keroseneDeposited?: bigint;
};

type YieldData = {
  totalLiquidity: string;
  totalXp: string;
  noteLiquidity: string;
  noteXp: string;
  rewardRate: string;
  kerosenePerYear: string;
  effectiveSize: string;
};

function NoteCard({ tokenId }: { tokenId: string }) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState(`Note Nº ${tokenId}`);
  const [yieldData, setYieldData] = useState<YieldData | null>(null);
  const [yieldDataUSDCDyad, setYieldDataUSDCDyad] = useState<YieldData | null>(
    null
  );
  const { kerosenePrice } = useKerosenePrice();

  useEffect(() => {
    const fetchYieldData = async () => {
      try {
        const response = await fetch(
          `https://api.dyadstable.xyz/api/yield?noteId=${tokenId}&pool=0xa969cfcd9e583edb8c8b270dc8cafb33d6cf662d`
        );
        const data = await response.json();
        setYieldData(data);
      } catch (error) {
        console.error("Error fetching yield data:", error);
      }
    };

    const fetchYieldDataUSDCDyad = async () => {
      try {
        const response = await fetch(
          `https://api.dyadstable.xyz/api/yield?noteId=${tokenId}&pool=0x1507bf3F8712c496fA4679a4bA827F633979dBa4`
        );
        const data = await response.json();
        console.log("data", data);
        setYieldDataUSDCDyad(data);
      } catch (error) {
        console.error("Error fetching USDC/DYAD yield data:", error);
      }
    };

    fetchYieldData();
    fetchYieldDataUSDCDyad();
  }, [tokenId]);

  // Fetch contract data
  const { data: contractData, isSuccess: dataLoaded } = useReadContracts({
    contracts: [
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "collatRatio",
        args: [BigInt(tokenId)],
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "getVaultsValues",
        args: [BigInt(tokenId)],
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "MIN_COLLAT_RATIO",
      },
      {
        address: dyadAddress[defaultChain.id],
        abi: dyadAbi,
        functionName: "mintedDyad",
        args: [BigInt(tokenId)],
      },
      {
        address: xpAddress[defaultChain.id],
        abi: xpAbi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: dyadLpStakingCurveM0DyadAddress[defaultChain.id],
        abi: dyadLpStakingCurveM0DyadAbi,
        functionName: "noteIdToAmountDeposited",
        args: [BigInt(tokenId)],
      },
      {
        address: keroseneVaultV2Address[defaultChain.id],
        abi: keroseneVaultV2Abi,
        functionName: "id2asset",
        args: [BigInt(tokenId)],
      },
      {
        address: dyadLpStakingCurveUsdcdyadAddress[defaultChain.id],
        abi: dyadLpStakingCurveUsdcdyadAbi,
        functionName: "noteIdToAmountDeposited",
        args: [BigInt(tokenId)],
      },
    ],
    allowFailure: false,
    query: {
      select: (data) => {
        const collatRatio = data[0];
        const exoCollateralValue = data[1][0];
        const keroCollateralValue = data[1][1];
        const minCollatRatio = data[2];
        const mintedDyad = data[3];
        const totalCollateralValue = exoCollateralValue + keroCollateralValue;
        const xpBalance = data[4];
        const dyadLpStakingCurveM0DyadBalance = data[5];
        const keroseneDeposited = data[6];
        const dyadLpStakingCurveUSDCDyadBalance = data[7];

        return {
          collatRatio,
          exoCollateralValue,
          keroCollateralValue,
          totalCollateralValue,
          minCollatRatio,
          mintedDyad,
          xpBalance,
          dyadLpStakingCurveM0DyadBalance,
          keroseneDeposited,
          dyadLpStakingCurveUSDCDyadBalance,
        };
      },
    },
  });

  const { collatRatio, totalCollateralValue } = useMemo<ContractData>(() => {
    if (contractData) {
      return contractData;
    } else {
      return {};
    }
  }, [contractData]);

  // Check if the vault exists
  const { data: hasVaultData } = useReadContracts({
    contracts: supportedVaults.map((address) => ({
      address: vaultManagerAddress[defaultChain.id],
      abi: vaultManagerAbi,
      functionName: "hasVault",
      args: [BigInt(tokenId), address],
      chainId: defaultChain.id,
    })),
    allowFailure: false,
  });
  const hasVault = (hasVaultData?.filter((data) => !!data)?.length || 0) > 0;

  // Calculate total collateral and collateralization ratio
  const totalCollateral = dataLoaded
    ? `$${formatNumber(fromBigNumber(totalCollateralValue))}`
    : "N/A";

  const collateralizationRatio = dataLoaded
    ? collatRatio === maxUint256
      ? "Infinity"
      : `${formatNumber(fromBigNumber(contractData.collatRatio, 16))}%`
    : "N/A";

  // Calculate total DYAD
  const totalDyad =
    fromBigNumber(contractData?.mintedDyad)?.toString() ?? "N/A";

  // Calculate APR
  const calculatedAPR =
    yieldData && Number(yieldData.noteLiquidity) !== 0
      ? `${(
          (Number(yieldData.kerosenePerYear) /
            Number(yieldData.noteLiquidity)) *
          100 *
          (kerosenePrice || 0)
        ).toFixed(2)}%`
      : "0%";

  const calculatedAPRUSDCDyad =
    yieldDataUSDCDyad && Number(yieldDataUSDCDyad.noteLiquidity) !== 0
      ? `${(
          (Number(yieldDataUSDCDyad.kerosenePerYear) /
            Number(yieldDataUSDCDyad.noteLiquidity)) *
          100 *
          (kerosenePrice || 0)
        ).toFixed(2)}%`
      : "0%";

  const totalAPR =
    yieldData &&
    yieldDataUSDCDyad &&
    Number(yieldData.noteLiquidity) +
      Number(yieldDataUSDCDyad.noteLiquidity) !==
      0
      ? `${(
          (Number(calculatedAPR.replace("%", "")) *
            Number(yieldData.noteLiquidity) +
            Number(calculatedAPRUSDCDyad.replace("%", "")) *
              Number(yieldDataUSDCDyad.noteLiquidity)) /
          (Number(yieldData.noteLiquidity) +
            Number(yieldDataUSDCDyad.noteLiquidity))
        ).toFixed(2)}%`
      : "0%";

  // Calculate Boost
  let boost = "0x";
  if (yieldData && !isNaN(Number(yieldData.effectiveSize))) {
    boost = `${Number(yieldData.effectiveSize).toFixed(2)}x`;
  }

  const totalLiquidityStaked = contractData?.dyadLpStakingCurveM0DyadBalance
    ? fromBigNumber(contractData.dyadLpStakingCurveM0DyadBalance).toFixed(2)
    : "0";

  const totalUsdcdDyadStaked = contractData?.dyadLpStakingCurveUSDCDyadBalance
    ? fromBigNumber(contractData.dyadLpStakingCurveUSDCDyadBalance).toFixed(2)
    : "0";

  const totalCombinedLiquidityStaked = (
    Number(totalLiquidityStaked) + Number(totalUsdcdDyadStaked)
  ).toFixed(2);

  // Prepare data for the note
  const noteData: NoteNumberDataColumnModel[] = [
    {
      text: "Collateralization ratio",
      value: collateralizationRatio,
      highlighted: true,
    },
    {
      text: "DYAD minted",
      value: formatNumber(totalDyad),
      highlighted: false,
    },
    {
      text: "Collateral",
      value: totalCollateral,
      highlighted: false,
    },
    {
      text: "KEROSENE Deposited",
      value: formatNumber(fromBigNumber(contractData?.keroseneDeposited), 0),
      highlighted: false,
    },
    {
      text: "Liquidity Staked",
      value: totalCombinedLiquidityStaked,
      highlighted: false,
    },
    {
      text: "Your APR",
      value: totalAPR,
      highlighted: false,
    },
  ];

  // Prepare tabs data
  const tabData: TabsDataModel[] = [
    {
      label: `Stats`,
      tabKey: `Note Nº ${tokenId}`,
      content: hasVault ? (
        <NoteNumber data={noteData} />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
          <Vault size={48} />
          <div className="text-center text-[#FAFAFA]">
            <h3 className="text-xl font-semibold text-primary">
              No Active Vault
            </h3>
            <p className="text-sm mt-2">
              Deposit collateral to open a vault and start using your Note
            </p>
          </div>
          <ButtonComponent
            style={{ width: "150px" }}
            onClick={() => setActiveTab("Deposit and Withdraw")}
          >
            Deposit Now
          </ButtonComponent>
        </div>
      ),
    },
    {
      label: "Deposit & Withdraw",
      tabKey: "Deposit and Withdraw",
      content: (
        <Deposit
          total_collateral={totalCollateral}
          collateralization_ratio={collatRatio}
          tokenId={tokenId}
        />
      ),
    },
    {
      label: "Mint & Burn",
      tabKey: "Mint DYAD",
      content: (
        <Mint
          currentCr={collatRatio}
          tokenId={tokenId}
          setActiveTab={setActiveTab}
        />
      ),
    },
    {
      label: "Stake & Earn",
      tabKey: "Stake & Earn",
      content: (
        <Stake
          APR={totalAPR}
          individualAPR={{
            [StakeCurrencies.CURVE_M0_DYAD_LP]: {
              individualAPR: calculatedAPR,
            },
            [StakeCurrencies.CURVE_USDC_DYAD_LP]: {
              individualAPR: calculatedAPRUSDCDyad,
            },
          }}
          liquidityStaked={{
            [StakeCurrencies.CURVE_M0_DYAD_LP]: {
              liquidityStaked: contractData?.dyadLpStakingCurveM0DyadBalance
                ? fromBigNumber(
                    contractData.dyadLpStakingCurveM0DyadBalance
                  ).toFixed(2)
                : "0",
            },
            [StakeCurrencies.CURVE_USDC_DYAD_LP]: {
              liquidityStaked: contractData?.dyadLpStakingCurveUSDCDyadBalance
                ? fromBigNumber(
                    contractData.dyadLpStakingCurveUSDCDyadBalance
                  ).toFixed(2)
                : "0",
            },
          }}
          xpBoost={boost}
          XP={contractData?.xpBalance ?? 0n}
          tokenId={tokenId}
          userAddress={address}
        />
      ),
    },
  ];

  const renderActiveTabContent = () => {
    return tabData.find((tab: TabsDataModel) => activeTab === tab.tabKey)
      ?.content;
  };

  return (
    <NoteCardsContainer>
      <Fragment>
        <div className="md:hidden block">
          <div className=" flex justify-between">
            <div className="text-md">Note Nº {tokenId}</div>
            <Dropdown radius="none">
              <DropdownTrigger>
                <Menu />
              </DropdownTrigger>
              <DropdownMenu aria-label="Dropdown Variants">
                {tabData.map((tab: TabsDataModel) => (
                  <DropdownItem
                    key={tab.tabKey}
                    onClick={() => setActiveTab(tab.tabKey)}
                  >
                    {tab.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          {renderActiveTabContent()}
        </div>
        <div className="hidden md:block">
          <TabsComponent
            tabsData={tabData}
            selected={activeTab}
            setSelected={setActiveTab}
          />
        </div>
      </Fragment>
    </NoteCardsContainer>
  );
}

export default NoteCard;
