import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType, StakeCurrencies } from "@/models/Stake";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import React, { useEffect, useState } from "react";

interface StakeProps {
  isStaked: boolean;
  APR: string;
  liquidityStaked: string;
  xpBoost: string;
  XP: string;
}

const Stake: React.FC<StakeProps> = ({
  isStaked,
  APR,
  liquidityStaked,
  xpBoost,
  XP,
}) => {
  // stake key should be set to the stake contract key corresponding to the currency in the LP (if there is an LP already staked)
  const [stakeKey, setStakeKey] = useState<StakeCurenciesType | null>(null);
  const stakeDropdownData = Object.values(STAKE_CONTRACTS).map((contract) => ({
    label: contract.label,
    value: contract.stakeKey,
  }));

  const stakeData = [
    {
      label: "Liquidity staked",
      value: liquidityStaked,
    },
    {
      label: "XP",
      value: XP,
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
    if (!stakeKey && isStaked) {
      setStakeKey(STAKE_CONTRACTS["ETH"].stakeKey);
    }
  }, [stakeKey, isStaked]);

  return (
    <div>
      {!isStaked && (
        <Autocomplete
          aria-label="Search LP"
          variant={"bordered"}
          defaultItems={stakeDropdownData}
          placeholder="Serach LP"
          className="w-full h-[37px] mb-2"
          radius="sm"
          popoverProps={{
            offset: 5,
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

      <Dialog>
        <DialogTrigger className="h-full w-full mt-2" disabled={!stakeKey}>
          {isStaked ? (
            <ButtonComponent>
              <div className="text-xs md:text-[0.875rem] transition-all">
                Unstake
              </div>
            </ButtonComponent>
          ) : (
            <ButtonComponent disabled={!stakeKey}>
              <div className="text-xs md:text-[0.875rem] transition-all">
                Stake
              </div>
            </ButtonComponent>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] md:max-w-fit">
          <KeroseneCard
            currency={stakeKey!}
            stakingContract={STAKE_CONTRACTS[stakeKey!].address}
            kerosenePrice="0.00"
            actionType={isStaked ? "unstake" : "stake"}
          />
        </DialogContent>
      </Dialog>

      {isStaked && (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-4">
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
    </div>
  );
};
export default Stake;
