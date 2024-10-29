import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import {
  dyadLpStakingFactoryAddress,
  useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited,
  useReadDyadLpStakingFactoryNoteIdToTotalClaimed,
  useReadDyadLpStakingFactoryTotalClaimed,
  useReadVaultManagerIsExtensionAuthorized,
  useWriteDyadLpStakingFactoryClaim,
  useWriteVaultManagerAuthorizeExtension,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import { StakeCurenciesType, StakeCurrencies } from "@/models/Stake";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { PiggyBank, CircleDollarSign } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { formatEther, formatUnits } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";

interface StakeProps {
  isStaked?: boolean;
  APR: string;
  liquidityStaked: string;
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
  const [stakeKey, setStakeKey] = useState<StakeCurenciesType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const stakeDropdownData = Object.values(STAKE_CONTRACTS).map((contract) => ({
    label: contract.label,
    value: contract.stakeKey,
  }));

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

  const {
    writeContract: writeClaim,
    data: claimTransactionHash,
    status: claimTransactionStatus,
  } = useWriteDyadLpStakingFactoryClaim();

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

  const stakeData = [
    {
      label: "Liquidity staked",
      value: liquidityStaked,
    },
    {
      label: "XP",
      value: Number(formatUnits(XP, 27)).toFixed(2),
    },
    {
      label: "XP boost",
      value: xpBoost,
    },
    {
      label: "APR",
      value: APR,
    },
  ];

  useEffect(() => {
    // To be refactored to use the stake key from the LP
    // if stake key is not set and the LP is already staked, set it to the stake key of the currency in the LP
    // Stake key is set to USDC as that is the only currency in the LP for now (could changed in the future to allow multiple currencies)
    if (!stakeKey && isStaked) {
      setStakeKey(STAKE_CONTRACTS["CURVE_M0_DYAD_LP"].stakeKey);
    }
  }, [stakeKey, isStaked]);

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
    if (totalClaimed && claimData) {
      const claimable = claimData.amount - totalClaimed;
      return claimable > 0n ? claimable : 0n;
    }
    return 0n;
  }, [totalClaimed, claimData]);

  return (
    <div>
      {!isStaked && (
        <Autocomplete
          aria-label="Search LP"
          variant={"bordered"}
          defaultItems={stakeDropdownData}
          placeholder="Serach LP"
          className="w-full h-[37px] mb-2 mt-4"
          classNames={{
            popoverContent: "rounded-none",
            listbox: "rounded-none",
          }}
          radius="none"
          popoverProps={{
            offset: 5,
            radius: "none",
          }}
          onSelectionChange={(key) => {
            if (key) {
              setStakeKey(key as StakeCurrencies);
            } else {
              setStakeKey(null);
            }
          }}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      )}

      <div
        className={`flex flex-col gap-y-2 md:grid md:gap-x-8 h-full w-full mt-8 md:mt-4 ${isStaked && stakeBalance !== undefined && stakeBalance > 0n ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger className={isStaked ? "col-span-1" : "col-span-3"}>
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
                stakeKey ? STAKE_CONTRACTS[stakeKey].stakingContract : "0x"
              }
              actionType="stake"
              tokenId={tokenId}
              onSuccess={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        {isStaked && stakeBalance !== undefined && stakeBalance > 0n && (
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
                Claim {formatEther(totalClaimable)} KEROSENE
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

      {isStaked && (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-6">
            {stakeData.map((item: { label: string; value: string }) => (
              <div key={item.label} className={`py-2.5`}>
                <div className="flex w-full justify-between px-2.5 py-1.5 border-b-[0.5px] border-[#67676780] border-dashed font-normal leading-[16.94px] text-sm text-[#FFFFFF]">
                  <div>{item.label}</div>
                  <div className="text-right">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="w-full text-center py-8">
        <div className="text-sm text-[grey] mt-2">
          Provide Liquidity to the wM/DYAD pool on{" "}
          <Link
            className="text-[#966CF3] underline"
            href="https://curve.fi/#/ethereum/pools/factory-stable-ng-272/deposit"
            target="_blank"
            rel="noopener noreferrer"
          >
            Curve.fi
          </Link>{" "}
          here
        </div>
      </div>
    </div>
  );
};
export default Stake;
