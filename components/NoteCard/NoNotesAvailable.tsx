import React from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import { NotebookText } from "lucide-react";
import ButtonComponent from "../reusable/ButtonComponent";
import Link from "next/link";

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
        <ButtonComponent style={{ width: "150px" }}>
          <Link
            href="https://dyad.gitbook.io/docs/overview/notes"
            target="_blank"
          >
            Learn more
          </Link>
        </ButtonComponent>
      </div>
    </NoteCardsContainer>
  );
};
export default NoNotesAvailable;
