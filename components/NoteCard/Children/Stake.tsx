import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType, StakeCurrencies } from "@/models/Stake";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import React, { useEffect, useState } from "react";

interface StakeProps {
  isStaked?: boolean;
  APR: string;
  liquidityStaked: string;
  xpBoost: string;
  XP: string;
}

const Stake: React.FC<StakeProps> = ({
  // For now isStaked is set to true as the stake key is set to USDC only
  isStaked = true,
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
    // Stake key is set to USDC as that is the only currency in the LP for now (could changed in the future to allow multiple currencies)
    if (!stakeKey && isStaked) {
      setStakeKey(STAKE_CONTRACTS["USDC"].stakeKey);
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

      <div className="flex flex-col gap-y-2 md:grid md:grid-cols-3 md:gap-x-8 h-full w-full mt-8 md:mt-4">
        <Dialog>
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
                stakeKey ? STAKE_CONTRACTS[stakeKey].address : "0x"
              }
              actionType="stake"
            />
          </DialogContent>
        </Dialog>
        {isStaked && (
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
              />
            </DialogContent>
          </Dialog>
        )}
        {isStaked && (
          <ButtonComponent
            className="rounded-none h-[47px]"
            variant="bordered"
            // Functionality to be implemented
            onClick={() => console.log("KEROSENE claimed")}
          >
            <div className="text-xs transition-all">Claim 820 KEROSENE</div>
          </ButtonComponent>
        )}
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
    </div>
  );
};
export default Stake;
