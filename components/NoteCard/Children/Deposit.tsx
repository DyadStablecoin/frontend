import AddVaultButton from "@/components/reusable/AddVaultButton";
import VaultCard from "@/components/reusable/VaultCard";
import { VaultCardDataModel } from "@/models/NoteCardModels";
import React, { useState } from "react";
import useModal from "@/contexts/modal";
import EditVaultModal from "@/components/Modals/NoteCardModals/DepositModals/EditVault/EditVaultModal";
import AddVaultModal from "@/components/Modals/NoteCardModals/DepositModals/AddVault/AddVaultModal";
import { MAX_DEPOSIT_VAULTS } from "@/constants/NoteCards";
import EditVaultTabContent from "@/components/Modals/NoteCardModals/DepositModals/EditVault/EditVaultTabContent";
import { VaultTypes } from "@/mockData/cardModels";

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
  const [depositInput, setDepositInput] = useState("");
  const [withdrawInput, setWithdrawInput] = useState("");
  const [redeemInput, setRedeemInput] = useState("");
  const { pushModal } = useModal();

  const getVaultModalData = (currency: string) => [
    {
      label: "Deposit",
      tabKey: "Deposit",
      content: (
        <EditVaultTabContent
          type={VaultTypes.deposit}
          inputValue={depositInput}
          setInputValue={setDepositInput}
          currentCollateralizationRatio="300%"
          newCollateralizationRatio="320%"
          currency={currency}
          submitHandler={() => {
            console.log(VaultTypes.deposit);
          }}
          maxValue="99999"
        />
      ),
    },
    {
      label: "Withdraw",
      tabKey: "Withdraw",
      content: (
        <EditVaultTabContent
          type={VaultTypes.withdraw}
          inputValue={withdrawInput}
          setInputValue={setWithdrawInput}
          currentCollateralizationRatio="350%"
          newCollateralizationRatio="370%"
          currency={currency}
          submitHandler={() => {
            console.log(VaultTypes.withdraw);
          }}
          maxValue="99999"
        />
      ),
    },
    {
      label: "Redeem",
      tabKey: "Redeem",
      content: (
        <EditVaultTabContent
          type={VaultTypes.redeem}
          inputValue={redeemInput}
          setInputValue={setRedeemInput}
          currentCollateralizationRatio="200%"
          newCollateralizationRatio="220%"
          currency={currency}
          submitHandler={() => {
            console.log(VaultTypes.redeem);
          }}
          maxValue="99999"
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm font-semibold my-[37px] px-[15px]">
        <div className={`flex grey-font`}>
          <div className="mr-[5px]">Total collateral: </div>
          <div>{total_collateral}</div>
        </div>
        <div className={`flex white-font`}>
          <div className="mr-[5px]">Collateralization ratio:</div>
          <div>{collateralization_ratio}</div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-[30px]">
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
