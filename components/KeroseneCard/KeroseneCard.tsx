import { useAccount, useWriteContract } from "wagmi";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import StakingAbi from "@/abis/Staking.json";
import { DialogClose } from "../ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType } from "@/models/Stake";
import { useState } from "react";
import InputComponent from "../reusable/InputComponent";
import {
  useReadCurveM0DyadAllowance,
  useWriteCurveM0DyadApprove,
  useWriteDyadLpStakingCurveM0DyadDeposit,
  useWriteDyadLpStakingCurveM0DyadWithdraw,
} from "@/generated";
import { BigIntInput } from "@/components/reusable/BigIntInput";
import { parseUnits } from "viem";

interface KeroseneProps {
  currency: string;
  actionType?: "stake" | "unstake";
  stakingContract?: `0x${string}`;
  tokenId: any;
}

const KeroseneCard: React.FC<KeroseneProps> = ({
  currency,
  actionType = "stake",
  stakingContract,
  tokenId,
}) => {
  const { address } = useAccount();
  const [stakeInputValue, setStakeInputValue] = useState("");
  const [unstakeInputValue, setUnstakeInputValue] = useState("");
  const [maxStakeInputValue, setMaxStakeInputValue] = useState(999999);
  const [maxUnstakeInputValue, setMaxUnstakeInputValue] = useState(999999);

  const { writeContract: writeApprove } = useWriteCurveM0DyadApprove();
  const { writeContract: writeStake } =
    useWriteDyadLpStakingCurveM0DyadDeposit();
  const { data: allowance } = useReadCurveM0DyadAllowance({
    args: [address!, stakingContract!],
  });
  const { writeContract: writeUnstake } =
    useWriteDyadLpStakingCurveM0DyadWithdraw();

  const needsApproval = BigInt(stakeInputValue || "0") > (allowance || 0n);

  return (
    <NoteCardsContainer>
      <div className="text-sm font-semibold text-[#A1A1AA]">
        <div className="text-2xl text-[#FAFAFA] flex justify-between mt-[15px] w-full">
          <div>{STAKE_CONTRACTS[currency as StakeCurenciesType].label}</div>
        </div>
        <div className="mt-4 w-full md:w-[600px]">
          <div className="flex justify-between gap-6 mt-[32px]">
            {actionType === "stake" ? (
              <div className="flex justify-between w-full">
                <BigIntInput
                  placeholder={`Amount of ${currency} to stake`}
                  onChange={setStakeInputValue}
                  value={stakeInputValue}
                  decimals={18}
                />
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <InputComponent
                  placeHolder={`Amount of ${currency} to unstake`}
                  onValueChange={setUnstakeInputValue}
                  value={unstakeInputValue}
                  type="number"
                />
              </div>
            )}
            <div>
              <ButtonComponent
                width={"100px"}
                onClick={() =>
                  actionType === "stake"
                    ? setStakeInputValue(`${maxStakeInputValue}`)
                    : setUnstakeInputValue(`${maxUnstakeInputValue}`)
                }
              >
                Max
              </ButtonComponent>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 w-full mt-6">
            <DialogClose>
              <ButtonComponent variant="bordered">Cancel</ButtonComponent>
            </DialogClose>
            {actionType === "stake" ? (
              <ButtonComponent
                disabled={!stakeInputValue || BigInt(stakeInputValue) === 0n}
                onClick={() =>
                  needsApproval
                    ? writeApprove({
                        args: [
                          stakingContract!,
                          parseUnits(stakeInputValue, 18),
                        ],
                      })
                    : writeStake({
                        args: [tokenId, parseUnits(stakeInputValue, 18)],
                      })
                }
              >
                {needsApproval ? "Approve" : "Stake"}
              </ButtonComponent>
            ) : (
              <ButtonComponent
                disabled={!unstakeInputValue || unstakeInputValue.length <= 0}
                onClick={() =>
                  writeUnstake({
                    args: [tokenId, parseUnits(unstakeInputValue, 18)],
                  })
                }
              >
                Unstake
              </ButtonComponent>
            )}
          </div>
        </div>
      </div>
    </NoteCardsContainer>
  );
};
export default KeroseneCard;
