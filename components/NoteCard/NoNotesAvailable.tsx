import React from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import Link from "next/link";
import Image from "next/image";
import dyadIconOutlined from "../../public/dyad-logo-outlined.svg";
import keroseneIconOutlined from "../../public/kerosene-logo-outlined.svg";
import { ClaimModalContent } from "../claim-modal-content";
import useWindowSize from "@/hooks/useWindowSize";

interface NoNotesAvailableProps {}

const NoNotesAvailable: React.FC<NoNotesAvailableProps> = ({}) => {
  const { windowWidth } = useWindowSize();
  return (
    <NoteCardsContainer className="bg-[#242424]">
      <div className="p-0 sm:p-5">
        <div className="flex justify-between items-center mb-[35px] sm:mb-[51px]">
          <div className="text-xl sm:text-[32px] text-white font-semibold">
            WELCOME TO DYAD
          </div>
          <div className="flex gap-[10px] sm:gap-[34px]">
            <Image
              src={dyadIconOutlined}
              alt="dyad-icon"
              width={windowWidth >= 640 ? 62 : 35}
            />
            <Image
              src={keroseneIconOutlined}
              alt="dyad-icon"
              width={windowWidth >= 640 ? 62 : 35}
            />
          </div>
        </div>
        <div className="mb-[50px] sm:mb-[79px] text-sm sm:text-xl text-white font-normal leading-[26px]">
          <div className="mb-[20px] sm:mb-[25px]">
            DYAD is a decentralized stablecoin that allows you to earn the
            highest stable yield on mainnet.
          </div>
          <div>
            DYAD runs on a unique system of NFTs called Notes that let you
            manage your positions and maximize your yield.
          </div>
        </div>
        <div className="flex justify-center mb-[35px] sm:mb-[51px]">
          <ClaimModalContent variant="rounded-blue-shadow" />
        </div>
        <div className="flex justify-center w-full">
          <Link
            className="text-md sm:text-xl underline underline-offset-4 cursor-pointer text-[#FFFFFF] font-normal leading-[24px]"
            href="https://dyad.gitbook.io/docs/overview/notes"
            target="_blank"
          >
            Learn more
          </Link>
        </div>
      </div>
    </NoteCardsContainer>
  );
};
export default NoNotesAvailable;
