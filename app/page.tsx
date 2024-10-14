"use client";

import NoteCard from "@/components/NoteCard/NoteCard";
import { ClaimModalContent } from "@/components/claim-modal-content";
import { useAccount } from "wagmi";
import { useReadDNftBalanceOf } from "@/generated";
import { defaultChain } from "@/lib/config";
import useIDsByOwner from "@/hooks/useIDsByOwner";
import dynamic from "next/dynamic";
import NoteTable from "@/components/note-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NoteEtensions from "@/components/NoteEtensions";
import { NOTE_EXTENSIONS } from "@/constants/NoteCards";

const EarnKeroseneContent = dynamic(
  () => import("@/components/earn-kerosene"),
  { ssr: false }
);

export default function Home() {
  const { address } = useAccount();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab) {
      setSelected(tab as string);
    }
  }, [tab]);

  const { data: balance } = useReadDNftBalanceOf({
    args: [address],
    chainId: defaultChain.id,
  });

  const { tokens } = useIDsByOwner(address, balance);

  const manageNotesContent = (
    <>
      <div className="my-6 flex justify-between">
        <ClaimModalContent />
      </div>
      <div className="flex flex-col gap-4">
        {tokens &&
          tokens.map((token) => (
            <NoteCard
              key={parseInt(token.result)}
              tokenId={parseInt(token.result)}
            />
          ))}
      </div>
    </>
  );

  const tabsData: any = {
    "earn-kerosene": {
      label: "Earn Kerosene",
      tabKey: "earn-kerosene",
      content: <EarnKeroseneContent />,
    },
    notes: {
      label: "Manage Notes",
      tabKey: "notes",
      content: manageNotesContent,
    },
    marketplace: {
      label: "Marketplace",
      tabKey: "marketplace",
      content: <NoteTable />,
    },
    extensions: {
      label: "Extensions",
      tabKey: "extensions",
      content: <NoteEtensions extensions={NOTE_EXTENSIONS} />,
    },
  };

  const [selected, setSelected] = useState(tabsData["earn-kerosene"].tabKey);

  return (
    <div className="flex-1 max-w-screen-md w-full p-4 mt-4">
      {tabsData[selected]?.content}
    </div>
  );
}
