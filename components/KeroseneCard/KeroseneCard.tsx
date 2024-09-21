import { useWriteContract } from "wagmi";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import StakingAbi from "@/abis/Staking.json";
import { DialogClose } from "../ui/dialog";
import { STAKE_CONTRACTS } from "@/constants/Stake";
import { StakeCurenciesType } from "@/models/Stake";

interface KeroseneProps {
  currency: string;
  stakeData: { label: string; value: string }[];
  actionType?: "stake" | "unstake";
  stakingContract?: `0x${string}`;
}

const KeroseneCard: React.FC<KeroseneProps> = ({
  currency,
  stakeData,
  actionType = "stake",
  stakingContract,
}) => {
  const { writeContract: writeStake } = useWriteContract();
  const { writeContract: writeUnstake } = useWriteContract();

  return (
    <NoteCardsContainer>
      <div className="text-sm font-semibold text-[#A1A1AA]">
        <div className="text-2xl text-[#FAFAFA] flex justify-between mt-[15px] w-full">
          <div>{STAKE_CONTRACTS[currency as StakeCurenciesType].label}</div>
        </div>
        <div className="mt-4 w-full md:w-[600px]">
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
          <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 w-full mt-6">
            <DialogClose>
              <ButtonComponent variant="bordered">Cancel</ButtonComponent>
            </DialogClose>
            {actionType === "stake" ? (
              <ButtonComponent
                onClick={() =>
                  writeStake({
                    address: stakingContract!,
                    abi: StakingAbi.abi,
                    functionName: "stake",
                  })
                }
              >
                Stake
              </ButtonComponent>
            ) : (
              <ButtonComponent
                onClick={() =>
                  writeUnstake({
                    address: stakingContract!,
                    abi: StakingAbi.abi,
                    functionName: "withdraw",
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
