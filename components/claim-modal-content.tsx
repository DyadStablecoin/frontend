import { useAccount } from "wagmi";
import { formatEther, parseEther, zeroAddress } from "viem";
import {
  dNftAbi,
  dNftAddress,
  useReadDNftPriceIncrease,
  useReadDNftPublicMints,
  useReadDNftStartPrice,
  useReadDNftTotalSupply,
} from "@/generated";
import { defaultChain } from "@/lib/config";
import { useTransactionStore } from "@/lib/store";
import { BuyModal, useListings } from "@reservoir0x/reservoir-kit-ui";
import { useMemo, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import ConnectWallet from "./reusable/ConnectWallet";
import { CirclePlus } from "lucide-react";
import ButtonComponent from "./reusable/ButtonComponent";

interface ClaimModalProps {
  variant?: "purple-outlined" | "rounded-blue-shadow";
}

export const ClaimModalContent: React.FC<ClaimModalProps> = ({
  variant = "purple-outlined",
}) => {
  const buyModalOpenState = useState(false);
  const { address, isConnected } = useAccount();
  const { setTransactionData } = useTransactionStore();

  const { data: startingPrice } = useReadDNftStartPrice({
    chainId: defaultChain.id,
  });
  const { data: publicMints } = useReadDNftPublicMints({
    chainId: defaultChain.id,
  });
  const { data: priceIncrease } = useReadDNftPriceIncrease({
    chainId: defaultChain.id,
  });
  const { data: totalSupply } = useReadDNftTotalSupply({
    chainId: defaultChain.id,
  });

  const mintPrice = formatEther(
    (startingPrice || 0n) + (priceIncrease || 0n) * (publicMints || 0n)
  );

  const nextNote = parseInt(totalSupply?.toString() || "0", 10);

  const { data: listings } = useListings({
    contracts: [dNftAddress[defaultChain.id]],
    sortBy: "price",
    sortDirection: "asc",
  });

  const { connectModalOpen, openConnectModal } = useConnectModal();

  const bestListing = useMemo(() => {
    if (listings === undefined) return undefined;

    return listings.find(
      (listing) =>
        listing.price?.currency?.contract === zeroAddress &&
        listing.price.amount?.decimal &&
        listing.price.amount?.decimal <= Number(mintPrice)
    );
  }, [listings, mintPrice]);

  // if (isConnected) {
  return bestListing ? (
    <div>
      <BuyModal
        trigger={
          variant === "rounded-blue-shadow" ? (
            <div
              className="cursor-pointer border-1 border-[#000000] rounded-full w-full flex py-[14px] px-[40px] sm:px-[55.5px] animate-pulse"
              style={{
                boxShadow: "0px 0px 39px 1px #5CBBFF",
              }}
            >
              <div className="m-auto leading-[24px] text-md sm:text-xl font-bold">
                BUY NOTE TO START
              </div>
            </div>
          ) : (
            <div className="w-full text-center text-sm ml-auto cursor-pointer border-1 border-[#966CF3] text-[#966CF3] p-2.5 font-semibold flex items-center justify-center">
              <CirclePlus size={20} className="mr-2" />
              <div className="text-xs md:text-[0.875rem] transition-all">
                Buy Note
              </div>
            </div>
          )
        }
        token={`${dNftAddress[defaultChain.id]}:${bestListing?.criteria?.data?.token?.tokenId}`}
        onConnectWallet={async () => {
          openConnectModal?.();
          buyModalOpenState[1](false);
        }}
        openState={buyModalOpenState}
      />
    </div>
  ) : variant !== "purple-outlined" ? (
    <ButtonComponent
      onClick={() => {
        setTransactionData({
          config: {
            address: dNftAddress[defaultChain.id],
            abi: dNftAbi,
            functionName: "mintNft",
            args: [address],
            value: parseEther(mintPrice),
          },
          description: `Mint Note Nº ${nextNote} for ${mintPrice} ETH`,
        });
      }}
    >
      <div className="text-xs md:text-[0.875rem] transition-all">
        Mint Note Nº {nextNote} for {mintPrice} ETH
      </div>
    </ButtonComponent>
  ) : (
    <div
      className="w-full text-center text-sm ml-auto cursor-pointer border-1 border-[#966CF3] text-[#966CF3] p-2.5 font-semibold flex items-center justify-center"
      onClick={() => {
        setTransactionData({
          config: {
            address: dNftAddress[defaultChain.id],
            abi: dNftAbi,
            functionName: "mintNft",
            args: [address],
            value: parseEther(mintPrice),
          },
          description: `Mint Note Nº ${nextNote} for ${mintPrice} ETH`,
        });
      }}
    >
      <div className="text-xs md:text-[0.875rem] transition-all">Mint Note</div>
    </div>
  );
  // }

  return <ConnectWallet hasConnectButton={true} />;
};
