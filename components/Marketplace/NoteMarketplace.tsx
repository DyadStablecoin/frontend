import { dNftAddress, dyadAbi, dyadAddress, keroseneVaultV2Abi, keroseneVaultV2Address, vaultManagerAbi, vaultManagerAddress } from "@/generated";
import { defaultChain } from "@/lib/config";
import { getClient, Execute, ExpectedPrice } from "@reservoir0x/reservoir-sdk";
import { useListings } from "@reservoir0x/reservoir-kit-ui";
import ButtonComponent from "../reusable/ButtonComponent";
import { useReadContracts, useWalletClient } from "wagmi";
import { Fragment, useMemo } from "react";
import { formatEther, maxUint256 } from "viem";

type NoteData = {
    kerosene: bigint;
    dyad: bigint;
    cr: string;
}

export const NoteMarketplace = () => {
  const { data: listings } = useListings({
    contracts: dNftAddress[defaultChain.id],
    sortBy: "price",
    sortDirection: "asc",
  });

  const { data: wallet } = useWalletClient();

  const bestListings = useMemo(() => {
    const deduplicated =
      listings?.reduce((agg, curr) => {
        if (!agg.has(curr.tokenSetId)) {
          agg.set(curr.tokenSetId, curr);
        }
        return agg;
      }, new Map<string, (typeof listings)[number]>()) || new Map();

    return [...(deduplicated.values() || [])];
  }, [listings]);

  const buyToken = (token: string, expectedPrice: ExpectedPrice) => {
    getClient()?.actions.buyToken({
      items: [{ token: token.replace("token:", ""), quantity: 1 }],
      wallet: wallet!,
      expectedPrice: {
        [expectedPrice.currencyAddress!]: expectedPrice,
      },
      onProgress: (steps: Execute["steps"]) => {},
      chainId: defaultChain.id,
    });
  };

  const { data: contractData } = useReadContracts({
    contracts: bestListings.flatMap((listing) => [
        {
            address: keroseneVaultV2Address[defaultChain.id],
            abi: keroseneVaultV2Abi,
            functionName: "id2asset",
            args: [listing?.criteria?.data?.token?.tokenId],
        },
        {
            address: dyadAddress[defaultChain.id],
            abi: dyadAbi,
            functionName: "mintedDyad",
            args: [listing?.criteria?.data?.token?.tokenId],
        },
        {
            address: vaultManagerAddress[defaultChain.id],
            abi: vaultManagerAbi,
            functionName: "collatRatio",
            args: [listing?.criteria?.data?.token?.tokenId],
        }
    ]),
    allowFailure: false,
    query: {
        select: (data) => {
            const result: Record<string, NoteData> = {};
            for (let i = 0; i < bestListings.length; i++) {
                const startIndex = i * 3;
                const cr = BigInt(data[startIndex + 2]);
                let collatRatio = formatEther(cr);
                if (cr === maxUint256) {
                    collatRatio = "N/A"
                }
                result[bestListings[i].tokenSetId] = {
                    kerosene: BigInt(data[startIndex]),
                    dyad: BigInt(data[startIndex + 1]),
                    cr: collatRatio
                };
            }
            return result
        }
    }
  })

  return (
    <div>
      <div className="flex flex-col bg-[#1A1A1A] gap-4 p-7 rounded-[10px] mt-5">
        <div className="grid grid-cols-7 gap-4">
            <div className="font-bold">Note</div>
            <div className="font-bold">XP</div>
            <div className="font-bold">KERO</div>
            <div className="font-bold">DYAD</div>
            <div className="font-bold">CR</div>
            <div className="font-bold text-center col-span-2">BUY</div>
            
          {bestListings.map((listing) => (
            <Fragment key={listing.tokenSetId}>
            <div>
                {listing.criteria?.data?.token?.tokenId}
                </div>
                <div>XP TODO</div>
                <div>{formatEther(contractData?.[listing.tokenSetId]?.kerosene || 0n)}</div>
                <div>{formatEther(contractData?.[listing.tokenSetId]?.dyad || 0n)}</div>
                <div>{contractData?.[listing.tokenSetId]?.cr}</div>
              <div className="col-span-2">
                <ButtonComponent
                className="text-xs"
                  disabled={!wallet}
                  onClick={() =>
                    buyToken(listing.tokenSetId, {
                      currencyAddress: listing.price?.currency?.contract,
                      currencyDecimals: listing.price?.currency?.decimals,
                      raw: BigInt(listing.price?.amount?.raw || "0"),
                    })
                  }
                >
                 {listing.price?.amount?.decimal} {listing.price?.currency?.symbol}
                 </ButtonComponent>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
