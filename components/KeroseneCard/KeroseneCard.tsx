import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import InputComponent from "@/components/reusable/InputComponent";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import StakingAbi from "@/abis/Staking.json";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType } from "@/models/Stake";

interface KeroseneProps {
  currency: string;
  kerosenePrice: string;
  actionType?: "stake" | "unstake";
  stakingContract?: `0x${string}`;
}

const KeroseneCard: React.FC<KeroseneProps> = ({
  currency,
  kerosenePrice,
  actionType = "stake",
  stakingContract,
}) => {
  const { address } = useAccount();
  const [stakeInputValue, setStakeInputValue] = useState("");
  const [unstakeInputValue, setUnstakeInputValue] = useState("");

  console.log("staking", StakingAbi.abi);

  const amountStaked = useReadContract({
    address: stakingContract,
    abi: StakingAbi.abi,
    functionName: "balanceOf",
    args: [address],
  });

  const earned = useReadContract({
    address: stakingContract,
    abi: StakingAbi.abi,
    functionName: "earned",
    args: [address],
  });

  const { writeContract: writeStake } = useWriteContract();
  const { writeContract: writeUnstake } = useWriteContract();

  console.log(stakingContract);

  return (
    <NoteCardsContainer>
      <div className="text-sm font-semibold text-[#A1A1AA]">
        <div className="text-2xl text-[#FAFAFA] flex justify-between mt-[15px] w-full">
          <div>{currency}</div>
          <div>${kerosenePrice}</div>
        </div>
        {actionType === "stake" && (
          <div className="flex justify-between mt-8 w-full">
            <div className="w-[380px] ">
              <InputComponent
                placeHolder={`Amount of ${currency} to stake`}
                onValueChange={setStakeInputValue}
                value={stakeInputValue}
                type="number"
                max={9999999}
              />
            </div>
            <div className="w-[128px]  ml-12">
              <ButtonComponent
                disabled={!stakeInputValue}
                onClick={() =>
                  writeStake({
                    address: stakingContract!,
                    abi: StakingAbi.abi,
                    functionName: "stake",
                    args: [stakeInputValue],
                  })
                }
              >
                Stake
              </ButtonComponent>
            </div>
          </div>
        )}
        {actionType === "unstake" && (
          <div className="flex justify-between mt-8 w-full">
            <div className="w-[380px] ">
              <InputComponent
                placeHolder={`Amount of ${currency} to unstake`}
                onValueChange={setUnstakeInputValue}
                value={unstakeInputValue}
                type="number"
                max={9999999}
              />
            </div>
            <div className="w-[128px] ml-8">
              <ButtonComponent
                disabled={!unstakeInputValue}
                onClick={() =>
                  writeUnstake({
                    address: stakingContract!,
                    abi: StakingAbi.abi,
                    functionName: "withdraw",
                    args: [stakeInputValue],
                  })
                }
              >
                Unstake
              </ButtonComponent>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-[32px]">
          <div className="flex">
            <div className="mr-[5px]">
              <strong>{currency}</strong>
              {` Staked:`}
            </div>
            <div>{amountStaked.data || 0}</div>
          </div>
          <div className="flex">
            <div className="mr-[5px]">Kerosene earned:</div>
            <div>{earned.data || 0}</div>
          </div>
        </div>
      </div>
    </NoteCardsContainer>
  );
};
export default KeroseneCard;
