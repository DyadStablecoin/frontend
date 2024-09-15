"use client";

import { useAccount } from "wagmi";
import { useReadDNftBalanceOf } from "@/generated";
import { defaultChain } from "@/lib/config";
import useIDsByOwner from "@/hooks/useIDsByOwner";
import dynamic from "next/dynamic";
import { useState } from "react";

// Lazy Loading
const TabsComponent = dynamic(
  () => import("@/components/reusable/TabsComponent"),
  { ssr: false }
);

const NoteCard = dynamic(
  () => import("@/components/NoteCard/NoteCard"),
  { ssr: false }
);

const NoteTable = dynamic(
  () => import("@/components/note-table"),
  { ssr: false }
);

const EarnKeroseneContent = dynamic(
  () => import("@/components/earn-kerosene").then(module => module.EarnKeroseneContent),
  { ssr: false }
);

const ClaimModalContent = dynamic(
  () => import("@/components/claim-modal-content").then(module => module.ClaimModalContent),
  { ssr: false }
);


export default function Home() {
  const { address } = useAccount();

  const { data: balance } = useReadDNftBalanceOf({
    args: [address!],
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
              key={parseInt(token.result!)}
              tokenId={parseInt(token.result!)}
            />
          ))}
      </div>
    </>
  );

  const tabsData = [
    {
      label: "Earn Kerosene",
      tabKey: "earn-kerosene",
      content: <EarnKeroseneContent />,
    },
    {
      label: "Manage Notes",
      tabKey: "notes",
      content: manageNotesContent,
    },
    {
      label: "Marketplace",
      tabKey: "marketplace",
      content: <NoteTable />,
    },
  ];

  const [selected, setSelected] = useState(tabsData[0].tabKey);

  return (
    <div className="flex-1 max-w-screen-md w-full p-4 mt-4">
      <TabsComponent
        tabsData={tabsData}
        urlUpdate
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}
