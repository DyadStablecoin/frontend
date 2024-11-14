import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useReadContracts } from "wagmi";
import { Address } from "viem";
import {
  vaultManagerAbi,
  vaultManagerAddress,
  wEthVaultAbi,
} from "@/generated";
import { vaultInfo } from "@/lib/constants";
import { formatNumber, fromBigNumber } from "@/lib/utils";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { useTransactionStore } from "@/lib/store";
import { defaultChain } from "@/lib/config";
import { DialogClose } from "@/components/ui/dialog";
import Image from "next/image";

function AddVaultModal({
  tokenId,
}: {
  tokenId: string;
}) {
  const vaults = vaultInfo.filter((vault) => !vault.depositDisabled);

  const { data: assetPrices } = useReadContracts({
    contracts: vaults.map((vault) => ({
      address: vault.vaultAddress,
      abi: wEthVaultAbi,
      functionName: "assetPrice",
    })),
    allowFailure: false,
  });

  if (vaults.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div>You have added all available collateral types to your Note</div>
        <div className="w-[100px]">
          <DialogClose>
            <ButtonComponent>Close</ButtonComponent>
          </DialogClose>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-md md:text-2xl pt-4 font-semibold">
        Add new collateral type to your Note
      </div>
      <ScrollArea className="max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow className="text-xs md:text-base">
              <TableHead>Collateral</TableHead>
              <TableHead>Oracle Price</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs md:text-base">
            {vaults.map((vault, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex gap-2">
                    <Image
                      src={vault.icon}
                      alt="icon"
                      width={23}
                      height={23}
                    />
                    <span>{vault.symbol}</span>
                  </div>
                </TableCell>
                <TableCell>
                  $
                  {formatNumber(
                    fromBigNumber(assetPrices?.at(i), vault.decimals)
                  )}
                </TableCell>
                <RowInput
                  tokenId={tokenId}
                  vaultAddress={vault.vaultAddress}
                  symbol={vault.symbol}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default AddVaultModal;

const RowInput = ({
  tokenId,
  vaultAddress,
  symbol,
}: {
  tokenId: string;
  vaultAddress: Address;
  symbol: string;
}) => {
  const { setTransactionData } = useTransactionStore();
  return (
    <>
      <TableCell>
        <DialogClose className="w-full">
          <ButtonComponent
            onClick={() =>
              setTransactionData({
                config: {
                  address: vaultManagerAddress[defaultChain.id],
                  abi: vaultManagerAbi,
                  functionName: "add",
                  args: [tokenId, vaultAddress],
                },
                description: `Enable ${symbol} deposits to Note Nº ${tokenId}`,
              })
            }
          >
            Add
          </ButtonComponent>
        </DialogClose>
      </TableCell>
    </>
  );
};
