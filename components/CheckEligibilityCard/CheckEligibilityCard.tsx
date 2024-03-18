import React, { useEffect, useState } from "react";
import ButtonComponent from "../reusable/ButtonComponent";
import InputComponent from "../reusable/InputComponent";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import { COLORS } from "@/constants/styles";

interface CheckEligibilityCardProps {}

const CheckEligibilityCard: React.FC<CheckEligibilityCardProps> = ({}) => {
  const [walletAdresses, setWalletAddresses] = useState("");
  const [checkedData, setCheckedData] = useState([
    {
      walletAddress: "0xCAD2EaDA97Ad393584Fe84A5cCA1ef3093E45ae4",
      keroseneEarned: "1200",
    },
  ]);

  const [isCheckDisabled, setIsCheckDisabled] = useState(false);

  useEffect(() => {
    walletAdresses ? setIsCheckDisabled(false) : setIsCheckDisabled(true);
  }, [walletAdresses, setIsCheckDisabled]);

  const onCheckHandler = () => {
    if (walletAdresses) {
      setCheckedData((prevState: any) => [
        ...walletAdresses.split(" ").map((address: string) => ({
          walletAddress: address,
          keroseneEarned: "1200",
        })),
        ...prevState,
      ]);
      setWalletAddresses("");
    }
  };

  return (
    <NoteCardsContainer height="339px">
      <div className={`text-sm font-semibold white-font`}>
        <div className="flex justify-between w-full">
          <div className="w-full">
            <InputComponent
              placeHolder={`Enter one or more wallet addresses separated by a space`}
              value={walletAdresses}
              onValueChange={setWalletAddresses}
            />
          </div>
          <div className="w-[101px] ml-[30px]">
            <ButtonComponent
              disabled={isCheckDisabled}
              onClick={onCheckHandler}
            >
              <p style={isCheckDisabled ? {} : { color: COLORS.WHITE }}>
                Check
              </p>
            </ButtonComponent>
          </div>
        </div>
        <div className="w-full w-full">
          <div
            className={`flex justify-between mt-[43px] pb-[43px] text-sm white-font`}
          >
            <div>Address</div>
            <div>Kerosene earned</div>
          </div>
          <div
            style={{
              width: "calc(100% + 12px)",
              height: "150px",
              overflow: "auto",
              paddingRight: "15px",
            }}
          >
            {checkedData.map((data: any, index: number) => (
              <div
                key={index}
                className={`flex justify-between mb-[43px] text-sm white-font`}
              >
                <div className="font-normal">{data.walletAddress}</div>
                <div>{data.keroseneEarned}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NoteCardsContainer>
  );
};
export default CheckEligibilityCard;
