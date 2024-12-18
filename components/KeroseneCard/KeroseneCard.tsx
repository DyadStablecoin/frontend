import { useAccount } from "wagmi";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import { DialogClose } from "../ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType, StakeCurrencies } from "@/models/Stake";
import { useState } from "react";
import {
  useReadCurveM0DyadAllowance,
  useReadCurveM0DyadBalanceOf,
  useReadCurveUsdcdyad,
  useReadCurveUsdcdyadAllowance,
  useReadCurveUsdcdyadBalanceOf,
  useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited,
  useReadDyadLpStakingCurveUsdcdyadNoteIdToAmountDeposited,
  useWriteCurveM0DyadApprove,
  useWriteCurveUsdcdyadApprove,
  useWriteDyadLpStakingCurveM0DyadDeposit,
  useWriteDyadLpStakingCurveM0DyadWithdraw,
  useWriteDyadLpStakingCurveUsdcdyadDeposit,
  useWriteDyadLpStakingCurveUsdcdyadWithdraw,
} from "@/generated";
import { BigIntInput } from "@/components/reusable/BigIntInput";
import { ST } from "next/dist/shared/lib/utils";

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
  const { writeContract: writeApproveUSDCDyad } =
    useWriteCurveUsdcdyadApprove();

  const { writeContract: writeStake } =
    useWriteDyadLpStakingCurveM0DyadDeposit();

  const { writeContract: writeStakeUSDCDyad } =
    useWriteDyadLpStakingCurveUsdcdyadDeposit();

  const { data: allowance } = useReadCurveM0DyadAllowance({
    args: [address!, stakingContract!],
  });

  const { data: allowanceUSDCDyad } = useReadCurveUsdcdyadAllowance({
    args: [address!, stakingContract!],
  });

  const { writeContract: writeUnstake } =
    useWriteDyadLpStakingCurveM0DyadWithdraw();

  const { writeContract: writeUnstakeUSDCDyad } =
    useWriteDyadLpStakingCurveUsdcdyadWithdraw();

  const { data: lpBalance } = useReadCurveM0DyadBalanceOf({
    args: [address!],
  });

  const { data: lpBalanceUSDCDYAD } = useReadCurveUsdcdyadBalanceOf({
    args: [address!],
  });

  const { data: stakeBalance } =
    useReadDyadLpStakingCurveM0DyadNoteIdToAmountDeposited({
      args: [tokenId],
    });

  const { data: stakeBalanceUSDCDyad } =
    useReadDyadLpStakingCurveUsdcdyadNoteIdToAmountDeposited({
      args: [tokenId],
    });

  const needsApproval = BigInt(stakeInputValue || "0") > (allowance || 0n);
  const needsApprovalUSDCDyad =
    BigInt(stakeInputValue || "0") > (allowanceUSDCDyad || 0n);

  const canUnstake =
    stakeBalance && BigInt(unstakeInputValue || "0") <= stakeBalance;

  const canUnstakeUSDCDyad =
    stakeBalanceUSDCDyad &&
    BigInt(unstakeInputValue || "0") <= stakeBalanceUSDCDyad;

  return (
    <div className="text-sm font-semibold text-[#A1A1AA]">
      <div className="text-2xl text-[#FAFAFA] flex justify-between mt-[15px] w-full">
        <div>{STAKE_CONTRACTS[currency as StakeCurenciesType].label}</div>
      </div>
      <div className="mt-4 w-full md:w-[600px]">
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-6 mt-[32px]">
          <div
            className="ml-auto cursor-pointer md:hidden"
            onClick={() =>
              actionType === "stake"
                ? STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                  StakeCurrencies.CURVE_M0_DYAD_LP
                  ? setStakeInputValue(`${lpBalance?.toString()}`)
                  : setStakeInputValue(`${lpBalanceUSDCDYAD?.toString()}`)
                : STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                    StakeCurrencies.CURVE_M0_DYAD_LP
                  ? setUnstakeInputValue(`${stakeBalance?.toString()}`)
                  : setUnstakeInputValue(`${stakeBalanceUSDCDyad?.toString()}`)
            }
          >
            Max
          </div>
          {actionType === "stake" ? (
            <div className="flex justify-between w-full">
              <BigIntInput
                placeholder={`Amount of ${STAKE_CONTRACTS[currency].name} to stake`}
                onChange={setStakeInputValue}
                value={stakeInputValue}
                decimals={18}
                className="h-[47px] md:h-[39px]"
              />
            </div>
          ) : (
            <div className="flex justify-between items-center w-full">
              <BigIntInput
                placeholder={`Amount of ${STAKE_CONTRACTS[currency].name} to unstake`}
                onChange={setUnstakeInputValue}
                value={unstakeInputValue}
                type="number"
                className="h-[47px] md:h-[39px]"
              />
            </div>
          )}
          <div className="hidden md:block">
            <ButtonComponent
              width={"100px"}
              onClick={() =>
                actionType === "stake"
                  ? STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                    StakeCurrencies.CURVE_M0_DYAD_LP
                    ? setStakeInputValue(`${lpBalance?.toString()}`)
                    : setStakeInputValue(`${lpBalanceUSDCDYAD?.toString()}`)
                  : STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                      StakeCurrencies.CURVE_M0_DYAD_LP
                    ? setUnstakeInputValue(`${stakeBalance?.toString()}`)
                    : setUnstakeInputValue(
                        `${stakeBalanceUSDCDyad?.toString()}`
                      )
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
              onClick={() => {
                const isCurveM0Dyad =
                  STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                  StakeCurrencies.CURVE_M0_DYAD_LP;

                if (isCurveM0Dyad) {
                  if (needsApproval) {
                    // Approve Curve M0 Dyad
                    writeApprove({
                      args: [stakingContract!, stakeInputValue],
                    });
                  } else {
                    // Stake Curve M0 Dyad
                    writeStake({
                      args: [tokenId, stakeInputValue],
                      onSuccess: () => {
                        onSuccess?.();
                      },
                    });
                  }
                } else {
                  if (needsApprovalUSDCDyad) {
                    // Approve USDC-Dyad
                    writeApproveUSDCDyad({
                      args: [stakingContract!, stakeInputValue],
                    });
                  } else {
                    // Stake USDC-Dyad
                    writeStakeUSDCDyad({
                      args: [tokenId, stakeInputValue],
                      onSuccess: () => {
                        onSuccess?.();
                      },
                    });
                  }
                }
              }}
            >
              {STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
              StakeCurrencies.CURVE_M0_DYAD_LP
                ? needsApproval
                  ? "Approve"
                  : "Stake"
                : needsApprovalUSDCDyad
                  ? "Approve"
                  : "Stake"}
            </ButtonComponent>
          ) : (
            <ButtonComponent
              disabled={
                !unstakeInputValue ||
                unstakeInputValue.length <= 0 ||
                STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                  StakeCurrencies.CURVE_M0_DYAD_LP
                  ? !canUnstake
                  : !canUnstakeUSDCDyad
              }
              onClick={() =>
                STAKE_CONTRACTS[currency as StakeCurenciesType].stakeKey ===
                StakeCurrencies.CURVE_M0_DYAD_LP
                  ? writeUnstake({
                      args: [tokenId, unstakeInputValue],
                      onSuccess: () => {
                        onSuccess?.();
                      },
                    })
                  : writeUnstakeUSDCDyad({
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
  );
};
export default KeroseneCard;
