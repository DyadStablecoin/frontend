import AddVaultButton from "@/components/reusable/AddVaultButton";
import VaultCard from "@/components/reusable/VaultCard";
import { VaultCardDataModel } from "@/models/NoteCardModels";
import React from "react";
import useModal from "@/contexts/modal";
import { getVaultModalData } from "@/mockData/tabsMockData";
import EditVaultModal from "@/components/Modals/NoteCardModals/DepositModals/EditVault/EditVaultModal";
import AddVaultModal from "@/components/Modals/NoteCardModals/DepositModals/AddVault/AddVaultModal";
import { MAX_DEPOSIT_VAULTS } from "@/constants/NoteCards";

interface DepositProps {
  total_collateral: string;
  collateralization_ratio: string;
  vault_cards: VaultCardDataModel[];
}

const Deposit: React.FC<DepositProps> = ({
  total_collateral,
  collateralization_ratio,
  vault_cards,
}) => {
  const { pushModal } = useModal();

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-semibold my-[37px] px-[15px]">
        <div className="flex text-[#A1A1AA]">
          <div className="mr-[5px]">Total collateral: </div>
          <div>{total_collateral}</div>
        </div>
        <div className="flex text-[#FAFAFA]">
          <div className="mr-[5px]">Collateralization ratio:</div>
          <div>{collateralization_ratio}</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-[35px]">
        {vault_cards.map((card: VaultCardDataModel, index: number) => (
          <VaultCard
            key={index}
            data={card}
            onClick={() =>
              pushModal(
                <EditVaultModal
                  tabsData={getVaultModalData(card.currency)}
                  logo={card.currency}
                />
              )
            }
          />
        ))}
        {vault_cards.length < MAX_DEPOSIT_VAULTS && (
          <AddVaultButton onClick={() => pushModal(<AddVaultModal />)} />
        )}
      </div>
    </div>
  );
};
export default Deposit;
