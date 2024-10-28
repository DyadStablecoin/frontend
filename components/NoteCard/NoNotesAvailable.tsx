import React from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import Link from "next/link";
import { ClaimModalContent } from "../claim-modal-content";
import Image from "next/image";
import dyadIcon from "../../public/android-chrome-256x256.png";

interface NoNotesAvailableProps {}

const NoNotesAvailable: React.FC<NoNotesAvailableProps> = ({}) => {
  return (
    <NoteCardsContainer>
      <div className="flex flex-col items-center justify-center space-y-4 py-4">
        <Image src={dyadIcon} width={48} alt="DYAD" />
        <div className="text-center text-[#FAFAFA]">
          <h3 className="text-xl font-semibold text-primary">
            Welcome to DYAD
          </h3>
          <p className="text-sm mt-2 text-[grey] w-full md:w-2/3 mx-auto ">
            <div>
              DYAD is a stablecoin that you can mint with extreme capital
              efficiency against wETH, wstETH, tBTC, weETH, and apxETH
            </div>
            <div className="py-2">
              Use DYAD to earn the highest stable yield on mainnet.{" "}
            </div>
            <div>To get started, buy a Note NFT</div>
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
