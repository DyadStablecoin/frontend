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
import NoNotesAvailable from "@/components/NoteCard/NoNotesAvailable";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import NoteCardsContainer from "@/components/reusable/NoteCardsContainer";

const EarnKeroseneContent = dynamic(
  () => import("@/components/earn-kerosene"),
  { ssr: false }
);

export default function Home() {
  const { address, isConnected } = useAccount();
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

  const [selectedNote, setSelectedNote] = useState();

  const onSelectionChange = (id) => {
    setSelectedNote(id);
  };

  useEffect(() => {
    tokens && tokens.length > 0 && onSelectionChange(`${tokens[0].result}`);
  }, [tokens]);

  const [filteredTokens, setFilteredTokens] = useState(
    tokens && tokens.length && selectedNote
      ? tokens?.filter((token) => {
          return `${token.result}` === selectedNote;
        })
      : []
  );

  useEffect(() => {
    setFilteredTokens(
      tokens && tokens.length && selectedNote
        ? tokens?.filter((token) => {
            return `${token.result}` === selectedNote;
          })
        : []
    );
  }, [selectedNote, tokens]);

  const manageNotesContent = (
    <>
      <div className="my-6 flex justify-between">
        <ClaimModalContent />
      </div>
      <div className="flex flex-col gap-4">
        {tokens && tokens?.length ? (
          <>
            <div className="flex justify-between items-center">
              <div className="text-2xl md:text-3xl">
                {selectedNote && `Note Nº ${selectedNote}`}
              </div>
              <Autocomplete
                label="Notes"
                isClearable={false}
                isRequired
                defaultItems={tokens.map((token) => ({
                  label: `${token.result}`,
                  value: `${token.result}`,
                }))}
                // label="Notes"
                placeholder={
                  selectedNote ? `Nº ${selectedNote}` : "Search notes"
                }
                className="w-[150px] md:w-[200px] ml-auto"
                radius="sm"
                selectedKey={selectedNote}
                onSelectionChange={onSelectionChange}
              >
                {(item) => (
                  <AutocompleteItem key={item.value}>
                    Note Nº {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            {filteredTokens.length ? (
              tokens.map((token) => (
                <NoteCard
                  key={parseInt(token.result)}
                  tokenId={parseInt(token.result)}
                />
              ))
            ) : (
              <NoteCardsContainer>
                <div className="text-xl text-center w-full">
                  Please select a note
                </div>
              </NoteCardsContainer>
            )}
          </>
        ) : (
          isConnected && <NoNotesAvailable />
        )}
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
