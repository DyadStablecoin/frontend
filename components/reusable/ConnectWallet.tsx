import useWindowSize from "@/hooks/useWindowSize";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React from "react";

interface ConnectWalletProps {
  hasConnectButton: boolean;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ hasConnectButton }) => {
  const { windowWidth } = useWindowSize();
  const walletIcons = [
    "./rabby.png",
    "./walletconnect.png",
    "./coinbase.png",
    "./rainbow.png",
    "./metamask.png",
  ];
  return (
    <div className="w-full">
      <div className="grid grid-cols-5 items-center w-full md:w-[70%] mx-auto grayscale">
        {walletIcons.map((icon, i) => (
          <Image
            className="mx-auto"
            src={icon}
            alt="icon"
            width={windowWidth > 768 ? 60 : 40}
            height={windowWidth > 768 ? 60 : 40}
            key={icon}
          />
        ))}
      </div>
      <p className="text-md md:text-xl text-center mt-6 md:mt-8 text-white">
        Please, connect your wallet
      </p>
      <p className="text-xs md:text-md text-center mt-2 text-[#A1A1AA]">
        Connect your wallet to view your notes, deposit collateral and earn
        rewards
      </p>
      {hasConnectButton && (
        <div className="w-fit mx-auto mt-6 md:mt-8 text-xs md:text-sm">
          <ConnectButton showBalance={false} />
        </div>
      )}
    </div>
  );
};
export default ConnectWallet;
