"use client";

import { useCallback, useState } from "react";
import { formatEther, parseEther } from "viem";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

// import { MintedNft_OrderBy, OrderDirection, useAllDnftMintsQuery } from "@/gql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { shortAddr } from "@/lib/utils";
import useModal from "@/contexts/modal";
import DnftModalContent from "./dnft-modal-content";

interface Props {
  className?: string;
}

const perPage = 15;

export default function ClaimsTable({ className }: Props) {
  // const [page, setPage] = useState(0);
  // const [sortBy, setSortBy] = useState<MintedNft_OrderBy>(
  //   MintedNft_OrderBy.DNftId
  // );
  // const [sortDir, setSortDir] = useState<OrderDirection>(OrderDirection.Asc);
  // const [filterOwned, setFilterOwned] = useState<boolean>(false);

  // const { pushModal } = useModal();
  // const [{ data }] = useAllDnftMintsQuery({
  //   variables: {
  //     numResults: perPage,
  //     skip: page * perPage,
  //     orderBy: sortBy,
  //     orderDirection: sortDir,
  //   },
  // });

  // const openModal = useCallback(() => {
  //   pushModal(
  //     <DnftModalContent
  //       dnft={{
  //         id: "0",
  //         minter: `0x${"0".repeat(40)}`,
  //         price: parseEther("0.97").toString(),
  //       }}
  //     />
  //   );
  // }, [pushModal]);

  // const handleHeaderClick = (id: MintedNft_OrderBy) => {
  //   if (id === sortBy) {
  //     setSortDir(
  //       sortDir === OrderDirection.Asc
  //         ? OrderDirection.Desc
  //         : OrderDirection.Asc
  //     );
  //   } else {
  //     setSortBy(id);
  //     setSortDir(OrderDirection.Asc);
  //   }
  // };

  // const crColor = (cr: number): string => {
  //   switch (true) {
  //     case cr < 20:
  //       return "text-red-500";
  //     case cr < 30:
  //       return "text-yellow-500";
  //     case cr < 40:
  //       return "text-green-500";
  //     default:
  //       return "text-green-500";
  //   }
  // };

  return (
    <div className={className}>
      {/* <div className="flex flex-row gap-3 px-2 pb-3">
        <p
          onClick={() => setFilterOwned(false)}
          className={`text-sm ${
            !filterOwned ? "text-foreground" : "text-muted-foreground"
          } cursor-pointer`}
        >
          All
        </p>
        <p
          onClick={() => setFilterOwned(true)}
          className={`text-sm ${
            filterOwned ? "text-foreground" : "text-muted-foreground"
          } cursor-pointer`}
        >
          Mine
        </p>
      </div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[80px] whitespace-nowrap cursor-pointer"
              onClick={() => {
                handleHeaderClick(MintedNft_OrderBy.DNftId);
              }}
            >
              Note ID
              {sortBy === MintedNft_OrderBy.DNftId &&
                (sortDir === OrderDirection.Asc ? (
                  <ArrowUpIcon className="w-3 h-3 ml-1 inline" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 ml-1 inline" />
                ))}
            </TableHead>
            <TableHead>Owner</TableHead>
            <TableHead
              onClick={() => handleHeaderClick(MintedNft_OrderBy.DNftId)}
              className="cursor-pointer"
            >
              CR
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => handleHeaderClick(MintedNft_OrderBy.DNftId)}
            >
              DYAD Minted
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => handleHeaderClick(MintedNft_OrderBy.DNftId)}
            >
              Collateral
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.mintedNfts.map((mint) => (
            <TableRow
              key={mint.DNft_id}
              onClick={openModal}
              className="cursor-pointer h-12"
            >
              <TableCell>#{mint.DNft_id}</TableCell>
              <TableCell className="font-medium">
                {shortAddr(mint.to)}
              </TableCell>
              <TableCell
                className={`${crColor(+formatEther(mint.price) * 100)}`}
              >
                {(+formatEther(mint.price) * 100).toFixed(2)}%
              </TableCell>
              <TableCell className="font-medium text-right">
                {+formatEther(mint.price) * 1000}
              </TableCell>
              <TableCell className="font-medium text-right">
                ${(+formatEther(mint.price) * 100).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full max-w-none flex justify-center align-center mt-4 gap-8">
        <div className="w-8 text-center">
          {page !== 0 && (
            <p
              className="text-md text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setPage(page - 1)}
            >
              prev
            </p>
          )}
        </div>
        <p className="text-md text-center">{page + 1}</p>
        <div className="w-8 text-center">
          {data?.mintedNfts.length === perPage && (
            <p
              className="text-md text-muted-foreground hover:text-foreground cursor-pointer justify-self-end"
              onClick={() => setPage(page + 1)}
            >
              next
            </p>
          )}
        </div>
      </div> */}
    </div>
  );
}
