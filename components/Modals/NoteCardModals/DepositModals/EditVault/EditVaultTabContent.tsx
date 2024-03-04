import { useState } from "react";
import InputComponent from "@/components/reusable/InputComponent";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import useModal from "@/contexts/modal";

interface EditVaultTabContentProps {
  currency: string;
  currentCollateralizationRatio: string;
  newCollateralizationRatio: string;
}

const EditVaultTabContent: React.FC<EditVaultTabContentProps> = ({
  currency,
  currentCollateralizationRatio,
  newCollateralizationRatio,
}) => {
  const { shiftModal } = useModal();

  const [inputValue, setInputValue] = useState("");

  const onClickHandler = () => {
    setInputValue("9999999");
  };

  const depositHandler = () => {
    console.log("Deposited");
  };

  const cancelHandler = () => {
    shiftModal();
  };

  return (
    <div>
      <div className="flex justify-between w-full mt-[35px]">
        <div className="w-5/6 ">
          <InputComponent
            placeHolder={`Amount of ${currency} to deposit`}
            onValueChange={setInputValue}
            value={inputValue}
            type="number"
            max={9999999}
          />
        </div>
        <div className="w-[74px]">
          <ButtonComponent onClick={onClickHandler} variant="bordered">
            Max
          </ButtonComponent>
        </div>
      </div>
      <div className="flex w-full mt-[35px] justify-between px-[10px] font-semibold text-sm">
        <div className="flex text-[#A1A1AA]">
          <div className="mr-[5px]">Current collateralization ratio:</div>
          <div>{currentCollateralizationRatio}</div>
        </div>
        <div className="flex">
          <div className="mr-[5px] ">New collateralization ratio:</div>
          <div>{newCollateralizationRatio}</div>
        </div>
      </div>
      <div className="flex justify-between mt-[35px] ">
        <div className="w-[280px]">
          <ButtonComponent onClick={depositHandler} variant="solid">
            {`Deposit ${currency}`}
          </ButtonComponent>
        </div>
        <div className="w-[280px] ">
          <ButtonComponent onClick={cancelHandler} variant="bordered">
            Cancel
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};
export default EditVaultTabContent;
