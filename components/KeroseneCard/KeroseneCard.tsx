import { useAccount } from "wagmi";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import { DialogClose } from "../ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType } from "@/models/Stake";
import { useState } from "react";
import {
  useReadCurveM0DyadAllowance,
  useReadCurveM0DyadBalanceOf,
  useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited,
  useWriteCurveM0DyadApprove,
  useWriteDyadLpStakingCurveM0DyadDeposit,
  useWriteDyadLpStakingCurveM0DyadWithdraw,
} from "@/generated";
import { BigIntInput } from "@/components/reusable/BigIntInput";

interface KeroseneProps {
  currency: string;
  actionType?: "stake" | "unstake";
  stakingContract?: `0x${string}`;
  tokenId: any;
  onSuccess?: () => void;
}

const KeroseneCard: React.FC<KeroseneProps> = ({
  currency,
  actionType = "stake",
  stakingContract,
  tokenId,
  onSuccess,
}) => {
  const { address } = useAccount();
  const [stakeInputValue, setStakeInputValue] = useState("");
  const [unstakeInputValue, setUnstakeInputValue] = useState("");

  const { writeContract: writeApprove } = useWriteCurveM0DyadApprove();
  const { writeContract: writeStake } =
    useWriteDyadLpStakingCurveM0DyadDeposit();
  const { data: allowance } = useReadCurveM0DyadAllowance({
    args: [address!, stakingContract!],
  });
  const { writeContract: writeUnstake } =
    useWriteDyadLpStakingCurveM0DyadWithdraw();

  const { data: lpBalance } = useReadCurveM0DyadBalanceOf({
    args: [address!],
  });

  const { data: stakeBalance } =
    useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited({
      args: [tokenId],
    });

  const needsApproval = BigInt(stakeInputValue || "0") > (allowance || 0n);

  const canUnstake =
    stakeBalance && BigInt(unstakeInputValue || "0") <= stakeBalance;

  const canStake = lpBalance && BigInt(stakeInputValue || "0") <= lpBalance;

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
                  placeholder={`Amount of ${STAKE_CONTRACTS[currency].name} to stake`}
                  onChange={setStakeInputValue}
                  value={stakeInputValue}
                  decimals={18}
                />
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <BigIntInput
                  placeHolder={`Amount of ${STAKE_CONTRACTS[currency].name} to unstake`}
                  onChange={setUnstakeInputValue}
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
                    ? setStakeInputValue(`${lpBalance?.toString()}`)
                    : setUnstakeInputValue(`${stakeBalance?.toString()}`)
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
                        args: [stakingContract!, stakeInputValue],
                      })
                    : writeStake({
                        args: [tokenId, stakeInputValue],
                        onSuccess: () => {
                          onSuccess?.();
                        },
                      })
                }
              >
                {needsApproval ? "Approve" : "Stake"}
              </ButtonComponent>
            ) : (
              <ButtonComponent
                disabled={
                  !unstakeInputValue ||
                  unstakeInputValue.length <= 0 ||
                  !canUnstake
                }
                onClick={() =>
                  writeUnstake({
                    args: [tokenId, unstakeInputValue],
                    onSuccess: () => {
                      onSuccess?.();
                    },
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
