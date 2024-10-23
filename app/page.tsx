"use client";

import NoteCard from "@/components/NoteCard/NoteCard";
import { ClaimModalContent } from "@/components/claim-modal-content";
import { useAccount } from "wagmi";
import { useReadDNftBalanceOf } from "@/generated";
import { defaultChain } from "@/lib/config";
import useIDsByOwner from "@/hooks/useIDsByOwner";
import NoteTable from "@/components/note-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import NoteEtensions from "@/components/NoteEtensions";
import { NOTE_EXTENSIONS } from "@/constants/NoteCards";
import NoNotesAvailable from "@/components/NoteCard/NoNotesAvailable";
import NoteCardsContainer from "@/components/reusable/NoteCardsContainer";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { ChevronDownIcon } from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (tab) {
      setSelected(tab as string);
    } else {
      setSelected("notes");
    }
  }, [tab]);

  const { data: balance } = useReadDNftBalanceOf({
    args: [address],
    chainId: defaultChain.id,
  });

  const { tokens } = useIDsByOwner(address, balance);

  const [selectedNote, setSelectedNote] = useState<string | undefined>();

  useEffect(() => {
    if (tokens && tokens.length) {
      setSelectedNote(`${tokens[0].result}`);
    }
  }, [tokens]);

  const manageNotesContent = (
    <div className="mt-4">
      {!isConnected && (
        <div className="my-6 flex justify-between">
          <ClaimModalContent />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {tokens && tokens?.length ? (
          <>
            <div className="md:flex justify-between items-center">
              <div className="text-3xl md:mb-0 mb-6">
                {selectedNote && `Note Nº ${selectedNote}`}
              </div>
              <div className="flex flex-row md:justify-between justify-end items-center gap-2">
                {isConnected && (
                  <div className="w-1/2 md:px-[130]">
                    <ClaimModalContent />
                  </div>
                )}
                <Dropdown radius="none">
                  <DropdownTrigger>
                    <div className="w-1/2 md:w-[200px] text-sm md:ml-auto cursor-pointer bg-[#282828] p-3">
                      <div className="flex justify-between items-center">
                        <div>{`Note Nº ${selectedNote}`}</div>
                        <ChevronDownIcon size={20} />
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Notes Dropdown"
                    onAction={(key) => setSelectedNote(key as string)}
                  >
                    {tokens.map((token) => (
                      <DropdownItem
                        className="hover:rounded-none rounded-none"
                        key={`${token.result}`}
                      >{`Note Nº ${token.result}`}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            {selectedNote ? (
              <NoteCard
                key={parseInt(selectedNote)}
                tokenId={parseInt(selectedNote)}
              />
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
    </div>
  );

  const tabsData: any = {
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

  const [selected, setSelected] = useState<string | undefined>();

  return (
    <div className="flex-1 max-w-screen-md w-full p-4 mt-4">
      {selected && tabsData[selected]?.content}
    </div>
  );
}
