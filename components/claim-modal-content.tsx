import { useAccount } from "wagmi";
import { formatEther, parseEther, zeroAddress } from "viem";
import ButtonComponent from "@/components/reusable/ButtonComponent";
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

export function ClaimModalContent() {
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

  if (isConnected) {
    return bestListing ? (
      <BuyModal
        trigger={
          <ButtonComponent>
            <div className="text-xs md:text-[0.875rem] transition-all">
              Buy Note Nº {bestListing?.criteria?.data?.token?.tokenId} for{" "}
              {bestListing.price?.amount?.decimal} ETH
            </div>
          </ButtonComponent>
        }
        token={`${dNftAddress[defaultChain.id]}:${bestListing?.criteria?.data?.token?.tokenId}`}
        onConnectWallet={async () => {
          openConnectModal?.();
          buyModalOpenState[1](false);
        }}
        openState={buyModalOpenState}
      />
    ) : (
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
    );
  }

  return <ConnectWallet hasConnectButton={true} />;
}
