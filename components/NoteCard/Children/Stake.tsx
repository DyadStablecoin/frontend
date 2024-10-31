import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import {
  dyadLpStakingFactoryAddress,
  useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited,
  useReadDyadLpStakingCurveUsdcdyadNoteIdToAmountDeposited,
  useReadDyadLpStakingFactoryNoteIdToTotalClaimed,
  useReadVaultManagerIsExtensionAuthorized,
  useWriteDyadLpStakingFactoryClaimToVault,
  useWriteVaultManagerAuthorizeExtension,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import {
  LiquidityStakedType,
  StakeCurenciesType,
  StakeCurrencies,
} from "@/models/Stake";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { formatEther, formatUnits } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

interface StakeProps {
  isStaked?: boolean;
  APR: string;
  liquidityStaked: LiquidityStakedType;
  xpBoost: string;
  XP: bigint;
  tokenId: string;
  userAddress: `0x${string}` | undefined;
}

const Stake: React.FC<StakeProps> = ({
  // For now isStaked is set to true as the stake key is set to USDC only
  isStaked = true,
  APR,
  liquidityStaked,
  xpBoost,
  XP,
  tokenId,
  userAddress,
}) => {
  // stake key should be set to the stake contract key corresponding to the currency in the LP (if there is an LP already staked)
  const [stakeKeys, setStakeKeys] = useState<StakeCurenciesType[] | null>(null);
  const [activeStakeKey, setActiveStakeKey] =
    useState<StakeCurenciesType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: totalClaimed, refetch: refetchTotalClaimed } =
    useReadDyadLpStakingFactoryNoteIdToTotalClaimed({
      args: [BigInt(tokenId)],
    });

  const { data: extensionEnabled, refetch: refetchExtensionEnabled } =
    useReadVaultManagerIsExtensionAuthorized({
      args: [userAddress!, dyadLpStakingFactoryAddress[defaultChain.id]],
      query: {
        enabled: !!userAddress,
      },
    });

  const {
    writeContract: writeEnableExtension,
    data: enableExtensionTransactionHash,
    status: enableExtensionTransactionStatus,
  } = useWriteVaultManagerAuthorizeExtension();

  const {
    status: enableExtensionReceiptStatus,
    data: enableExtensionReceiptData,
  } = useWaitForTransactionReceipt({
    hash: enableExtensionTransactionHash,
  });

  useEffect(() => {
    if (
      enableExtensionTransactionStatus === "success" &&
      enableExtensionReceiptData?.status === "success"
    ) {
      refetchExtensionEnabled();
    }
  }, [
    enableExtensionTransactionStatus,
    enableExtensionReceiptData,
    refetchExtensionEnabled,
  ]);

  const { writeContract: writeClaim, data: claimTransactionHash } =
    useWriteDyadLpStakingFactoryClaimToVault();

  const { status: claimReceiptStatus } = useWaitForTransactionReceipt({
    hash: claimTransactionHash,
  });

  useEffect(() => {
    if (claimReceiptStatus === "success") {
      refetchTotalClaimed();
    }
  }, [claimReceiptStatus, refetchTotalClaimed]);

  const { data: stakeBalance } =
    useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited({
      args: [BigInt(tokenId)],
    });

  const { data: stakeBalanceUSDCDyad } =
    useReadDyadLpStakingCurveUsdcdyadNoteIdToAmountDeposited({
      args: [BigInt(tokenId)],
    });

  const stakeData = [
    {
      label: "APR",
      value: APR,
    },
    {
      label: "XP",
      value: Number(formatUnits(XP, 27)).toFixed(2),
    },
    {
      label: "XP boost",
      value: xpBoost,
    },
  ];

  useEffect(() => {
    if (!stakeKeys && isStaked) {
      setStakeKeys([
        STAKE_CONTRACTS["CURVE_M0_DYAD_LP"].stakeKey,
        STAKE_CONTRACTS["CURVE_USDC_DYAD_LP"].stakeKey,
      ]);
    }
  }, [stakeKeys, isStaked]);

  const { data: claimData } = useSWR(tokenId, async (tokenId) => {
    if (!tokenId) return undefined;
    try {
      const response = await fetch(
        `https://api.dyadstable.xyz/api/rewards/${tokenId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Claim data: Error fetching rewards:", error);
    }
  });

  const totalClaimable = useMemo(() => {
    if (totalClaimed !== undefined && claimData) {
      const claimable = BigInt(claimData.amount) - totalClaimed;
      return claimable > 0n ? claimable : 0n;
    }
    return 0n;
  }, [totalClaimed, claimData]);

  const renderLPIcons = (
    iconLeft: string | StaticImport,
    iconRight: string | StaticImport
  ) => (
    <div className="relative w-[48px] h-[28px] my-auto">
      <Image
        src={iconLeft}
        width={28}
        alt="LP Icon 1"
        className="absolute top-0 left-0"
      />
      <Image
        src={iconRight}
        width={28}
        alt="LP Icon 2"
        className="absolute top-0 right-0 z-50"
      />
    </div>
  );

  const hasStakeBalance = true;
  // activeStakeKey !== StakeCurrencies.CURVE_M0_DYAD_LP
  //   ? stakeBalance > 0n
  //   : stakeBalanceUSDCDyad > 0n;

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-2 mb-10">
        {stakeData.map(
          (item: { label: string; value: string }) =>
            item.label !== "Liquidity staked" && (
              <div
                key={item.label}
                className={`py-2.5 ${item.label === "APR" && "col-span-1 md:col-span-2"}`}
              >
                <div className="flex w-full justify-between px-2.5 py-1.5 border-b-[0.5px] border-[#67676780] border-dashed font-normal leading-[16.94px] text-sm text-[#FFFFFF]">
                  <div>{item.label}</div>
                  <div className="text-right">{item.value}</div>
                </div>
              </div>
            )
        )}
      </div>
      {stakeKeys &&
        stakeKeys?.map((stakeKey) => (
          <div key={stakeKey} className="bg-[#282828] p-6 mb-4">
            <div className="flex gap-3">
              {STAKE_CONTRACTS[stakeKey].iconLeft &&
                STAKE_CONTRACTS[stakeKey].iconRight &&
                renderLPIcons(
                  STAKE_CONTRACTS[stakeKey].iconLeft,
                  STAKE_CONTRACTS[stakeKey].iconRight
                )}
              <div className="text-2xl font-semibold my-auto">
                {STAKE_CONTRACTS[stakeKey].label}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 gap-x-6 mt-6 mb-4">
              <div className={`py-2.5`}>
                <div className="flex w-full justify-between px-2.5 py-1.5 border-b-[0.5px] border-[#67676780] border-dashed font-normal leading-[16.94px] text-sm text-[#FFFFFF]">
                  <div>Liquidity staked</div>
                  <div className="text-right">
                    {
                      liquidityStaked[stakeKey as StakeCurenciesType]
                        .liquidityStaked
                    }
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`flex flex-col gap-y-2 md:grid md:gap-x-8 h-full w-full mt-8 md:mt-4 ${isStaked && hasStakeBalance ? "md:grid-cols-2" : "md:grid-cols-1"}`}
            >
              <Dialog
                open={dialogOpen && activeStakeKey === stakeKey}
                onOpenChange={setDialogOpen}
              >
                <DialogTrigger
                  className={isStaked ? "col-span-1" : "col-span-3"}
                  onClick={() => setActiveStakeKey(stakeKey)}
                >
                  <ButtonComponent
                    className={`rounded-none ${isStaked ? "h-[47px] text-xs" : "text-sm"}`}
                    variant="bordered"
                    disabled={!stakeKey}
                  >
                    <div className="transition-all">
                      {`Stake ${stakeKey ? STAKE_CONTRACTS[stakeKey].label : ""}`}
                    </div>
                  </ButtonComponent>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] md:max-w-fit">
                  <KeroseneCard
                    currency={stakeKey!}
                    stakingContract={
                      stakeKey
                        ? STAKE_CONTRACTS[stakeKey].stakingContract
                        : "0x"
                    }
                    actionType="stake"
                    tokenId={tokenId}
                    onSuccess={() => setDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              {isStaked && hasStakeBalance && (
                <Dialog>
                  <DialogTrigger>
                    <ButtonComponent
                      className="rounded-none h-[47px]"
                      variant="bordered"
                    >
                      <div className="text-xs transition-all">
                        {`Unstake ${stakeKey ? STAKE_CONTRACTS[stakeKey].label : ""}`}
                      </div>
                    </ButtonComponent>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] md:max-w-fit">
                    <KeroseneCard
                      currency={stakeKey!}
                      stakingContract={
                        stakeKey ? STAKE_CONTRACTS[stakeKey].address : "0x"
                      }
                      actionType="unstake"
                      tokenId={tokenId}
                      onSuccess={() => setDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="w-full text-center py-4">
              <div className="text-sm text-[grey]">
                Provide Liquidity to the {STAKE_CONTRACTS[stakeKey].label} pool
                on{" "}
                <Link
                  className="text-[#966CF3] underline"
                  href={STAKE_CONTRACTS[stakeKey].link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Curve.fi
                </Link>{" "}
                here
              </div>
            </div>
          </div>
        ))}
      <div className="mt-6">
        {isStaked &&
          (extensionEnabled ? (
            <ButtonComponent
              disabled={
                totalClaimable === 0n ||
                enableExtensionTransactionStatus === "pending" ||
                (enableExtensionTransactionHash &&
                  enableExtensionReceiptStatus === "pending")
              }
              className="rounded-none h-[47px]"
              variant="bordered"
              onClick={() =>
                writeClaim({
                  args: [BigInt(tokenId), claimData?.amount, claimData?.proof],
                })
              }
            >
              <div className="text-xs transition-all">
                Claim {Number(formatEther(totalClaimable)).toFixed(4)} KEROSENE
              </div>
            </ButtonComponent>
          ) : (
            <ButtonComponent
              disabled={
                enableExtensionTransactionStatus === "pending" ||
                (enableExtensionTransactionHash &&
                  enableExtensionReceiptStatus === "pending")
              }
              className="rounded-none h-[47px]"
              variant="bordered"
              onClick={() =>
                writeEnableExtension({
                  args: [dyadLpStakingFactoryAddress[defaultChain.id], true],
                })
              }
            >
              <div className="text-xs transition-all">
                Enable extension to claim
              </div>
            </ButtonComponent>
          ))}
      </div>
    </>
  );
};
export default Stake;
