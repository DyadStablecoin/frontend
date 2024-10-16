import React from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import { NotebookText } from "lucide-react";
import Link from "next/link";
import { ClaimModalContent } from "../claim-modal-content";

interface NoNotesAvailableProps {}

const NoNotesAvailable: React.FC<NoNotesAvailableProps> = ({}) => {
  return (
    <NoteCardsContainer>
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <NotebookText size={48} />
        <div className="text-center text-[#FAFAFA]">
          <h3 className="text-xl font-semibold text-primary">
            No Notes Available
          </h3>
          <p className="text-sm mt-2">
            Notes are the cornerstone of the DYAD ecosystem
          </p>
        </div>
        <div className="w-full">
          <div className="w-full md:w-2/3 m-auto">
            <ClaimModalContent />
          </div>
        </div>
        <Link
          className="text-sm mx-auto w-fit mt-2 underline"
          href="https://dyad.gitbook.io/docs/overview/notes"
          target="_blank"
        >
          Learn more
        </Link>
      </div>
    </NoteCardsContainer>
  );
};
export default NoNotesAvailable;
