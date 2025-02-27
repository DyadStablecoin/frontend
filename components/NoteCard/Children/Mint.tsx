"use client";

import { useMemo, useState } from "react";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { BigIntInput } from "@/components/reusable/BigIntInput";
import { useTransactionStore } from "@/lib/store";
import {
  vaultManagerAbi,
  vaultManagerAddress,
  dyadAbi,
  dyadAddress,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import { useAccount, useReadContracts } from "wagmi";
import { formatNumber, fromBigNumber, toBigNumber } from "@/lib/utils";
import { maxUint256 } from "viem";
import Image from "next/image";

interface MintProps {
  tokenId: string;
  currentCr: bigint | undefined;
  setActiveTab: (tab: any) => void;
}

const Mint = ({ currentCr, tokenId, setActiveTab }: MintProps) => {
  const [mintInputValue, setMintInputValue] = useState("");
  const [burnInputValue, setBurnInputValue] = useState("");
  const { setTransactionData } = useTransactionStore();

  const { address } = useAccount();

  const { data: contractData } = useReadContracts({
    contracts: [
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "getVaultsValues",
        args: [BigInt(tokenId)],
      },
      {
        address: dyadAddress[defaultChain.id],
        abi: dyadAbi,
        functionName: "mintedDyad",
        args: [BigInt(tokenId)],
      },
      {
        address: dyadAddress[defaultChain.id],
        abi: dyadAbi,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "MIN_COLLAT_RATIO",
        args: [],
      },
      {
        address: dyadAddress[defaultChain.id],
        abi: dyadAbi,
        functionName: "allowance",
        args: [address!, vaultManagerAddress[defaultChain.id]],
      },
    ],
    allowFailure: false,
    query: {
      enabled: !!address,
      select: (data) => {
        const exoCollat = data[0][0];
        const keroCollat = data[0][1];
        const mintedDyad = data[1];
        const dyadBalance = data[2];
        const minCollateralizationRatio = data[3];
        const allowance = data[4];

        return {
          exoCollat,
          keroCollat,
          totalCollateral: exoCollat + keroCollat,
          mintedDyad,
          dyadBalance,
          minCollateralizationRatio,
          allowance,
        };
      },
    },
  });

  const newCr = useMemo(() => {
    let burnAmount = fromBigNumber(burnInputValue);
    let mintAmount = fromBigNumber(mintInputValue);

    if (isNaN(burnAmount)) burnAmount = 0;
    if (isNaN(mintAmount)) mintAmount = 0;

    const newMintedDyad =
      fromBigNumber(contractData?.mintedDyad) + mintAmount - burnAmount;
    if (newMintedDyad < 0) return 0;

    const collateral = fromBigNumber(contractData?.totalCollateral);
    return (collateral / newMintedDyad) * 100;
  }, [burnInputValue, mintInputValue, contractData]);

  const onMaxMintHandler = () => {
    const exoCollateral = fromBigNumber(contractData?.exoCollat);
    const collateral = fromBigNumber(contractData?.totalCollateral);
    const minCollatRatio =
      fromBigNumber(contractData?.minCollateralizationRatio) + 0.01;
    const mintedDyadAmount = fromBigNumber(contractData?.mintedDyad);

    // Calculate mintable DYAD from total eligible collateral
    // even with kerosene, user can mint at most dyad matching their exogenous collateral value
    const mintableDyad = Math.min(
      collateral / minCollatRatio - mintedDyadAmount,
      (exoCollateral - mintedDyadAmount) * 0.995 // 0.995 for safety factor/floating point
    );

    if (mintableDyad < 0) {
      setMintInputValue("0");
      return;
    }

    setMintInputValue(toBigNumber(mintableDyad.toString(), 18).toString());
  };

  const onMaxBurnHandler = () => {
    const minted = contractData?.mintedDyad || 0n;
    const balance = contractData?.dyadBalance || 0n;
    const min = minted < balance ? minted : balance;
    setBurnInputValue(min.toString());
  };

  if (contractData?.exoCollat === 0n && !contractData?.exoCollat) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        <Image
          src="/android-chrome-256x256.png"
          alt="Empty Vault"
          width={50}
          height={50}
        />
        <div className="text-center text-[#FAFAFA]">
          <h3 className="text-xl font-semibold text-primary">Start Minting</h3>
          <p className="text-sm mt-2">
            Deposit collateral to start minting Dyad
          </p>
        </div>
        <ButtonComponent
          style={{ width: "150px" }}
          onClick={() => setActiveTab("Deposit and Withdraw")}
        >
          Deposit Now
        </ButtonComponent>
      </div>
    );
  }

  const StackedValue = ({
    description,
    value,
  }: {
    description: string;
    value: string;
  }) => {
    return (
      <div className={`py-2.5 cols-span-2 md:col-span-1`}>
        <div
          className={`flex w-full justify-between px-2.5 py-1.5 border-b-[0.5px] border-[#67676780] border-dashed font-normal leading-[16.94px] text-sm text-[#FFFFFF]`}
        >
          <div>{description}</div>
          <div className="text-right">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-sm font-semibold text-[#A1A1AA]">
      <div className="block md:flex justify-between mt-[32px] w-full">
        <div className="w-full md:w-[380px]">
          <BigIntInput
            value={mintInputValue}
            onChange={(value) => setMintInputValue(value)}
            placeholder="Amount of DYAD to mint..."
            className="h-[45px] md:h-[39px] rounded-md md:rounded-r-none"
          />
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <div className="w-full md:w-[74px]">
            <ButtonComponent variant="bordered" onClick={onMaxMintHandler}>
              Max
            </ButtonComponent>
          </div>
          <div className="w-full md:w-[128px]">
            <ButtonComponent
              onClick={() => {
                setTransactionData({
                  config: {
                    address: vaultManagerAddress[defaultChain.id],
                    abi: vaultManagerAbi,
                    functionName: "mintDyad",
                    args: [tokenId, mintInputValue, address],
                  },
                  description: `Mint ${fromBigNumber(mintInputValue)} DYAD decreasing collateralization ratio to ~${newCr.toString()}%`,
                });
                setMintInputValue("");
              }}
              disabled={!mintInputValue}
            >
              Mint
            </ButtonComponent>
          </div>
        </div>
      </div>
      <div className="block md:flex justify-between mt-[32px] w-full">
        <div className="w-full md:w-[380px] ">
          <BigIntInput
            value={burnInputValue}
            onChange={(value) => setBurnInputValue(value)}
            placeholder="Amount of DYAD to burn..."
            className="h-[45px] md:h-[39px] rounded-md md:rounded-r-none"
          />
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <div className="w-full md:w-[74px]">
            <ButtonComponent variant="bordered" onClick={onMaxBurnHandler}>
              Max
            </ButtonComponent>
          </div>
          <div className="w-full md:w-[128px]">
            { contractData && contractData.allowance < BigInt(burnInputValue) ? 
            <ButtonComponent
              variant="bordered"
              onClick={() => {
                setTransactionData({
                  config: {
                    address: dyadAddress[defaultChain.id],
                    abi: dyadAbi,
                    functionName: "approve",
                    args: [vaultManagerAddress[defaultChain.id], burnInputValue],
                  },
                  description: "Approve DYAD for burn",
                });
              }}
            >
              Approve
            </ButtonComponent>
            :
            <ButtonComponent
              onClick={() => {
                setTransactionData({
                  config: {
                    address: vaultManagerAddress[defaultChain.id],
                    abi: vaultManagerAbi,
                    functionName: "burnDyad",
                    args: [tokenId, burnInputValue],
                  },
                  description: `Burn ${fromBigNumber(burnInputValue)} DYAD to increase collateralization ratio to ~${newCr.toString()}%`,
                });
                setBurnInputValue("");
              }}
              disabled={!burnInputValue}
            >
              Burn
            </ButtonComponent>
}
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 md: gap-y-4 gap-x-4 mt-[32px]">
        <StackedValue
          description="DYAD minted"
          value={formatNumber(
            fromBigNumber(contractData?.mintedDyad).toFixed(2)
          )}
        />
        <StackedValue
          description="Exo Collateral"
          value={formatNumber(
            fromBigNumber(contractData?.exoCollat).toFixed(2)
          )}
        />
        <StackedValue
          description="Kero Collateral"
          value={formatNumber(fromBigNumber(contractData?.keroCollat))}
        />
        <StackedValue
          description="Current CR"
          value={
            currentCr === maxUint256
              ? "Infinity"
              : `${formatNumber(fromBigNumber(currentCr, 16))}%`
          }
        />

        {(mintInputValue || burnInputValue) && (
          <div className="col-span-1 md:col-span-2">
            <StackedValue
              description="New CR"
              value={newCr === 0 ? "Infinity" : `${formatNumber(newCr)}%`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Mint;
