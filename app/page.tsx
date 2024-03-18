"use client";

import { Separator } from "@/components/ui/separator";
import DnftBox from "@/components/dnft-box";
import TabsComponent from "@/components/reusable/TabsComponent";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import KeroseneCard from "@/components/KeroseneCard/KeroseneCard";
import NoteCard from "@/components/NoteCard/NoteCard";

import SortbyComponent from "@/components/reusable/SortbyComponent";
import {
  SORT_BY_OPTIONS,
  TABS_MOCK_DATA,
  TABS_MOCK_DATA_1,
} from "@/mockData/tabsMockData";
import { useState } from "react";
import CheckEligibilityCard from "@/components/CheckEligibilityCard/CheckEligibilityCard";

export default function Home() {
  const [selectedValue, setSelectedValue] = useState("");
  const keroseneCardsData = [
    {
      currency: "ETH - DYAD (Uniswap)",
      APY: "24",
      staked: "390",
      keroseneEarned: "830",
    },
    {
      currency: "DYAD",
      APY: "12",
      staked: "1200",
      keroseneEarned: "500",
    },
  ];
  const manageNotesContent = (
    <>
      <div className="mt-12 mb-6 flex justify-between">
        <ButtonComponent
          styles={{ marginRight: "20px" }}
          onClick={() => console.log("Claim Note")}
        >
          Claim Note Nº 228
        </ButtonComponent>
        <div>
          <SortbyComponent
            sortOptions={SORT_BY_OPTIONS}
            selected={selectedValue}
            onValueChange={setSelectedValue}
          />
        </div>
      </div>
      <div className="mb-[25px]">
        <NoteCard tabsData={TABS_MOCK_DATA} />
      </div>
      <div className="mb-[25px]">
        <NoteCard tabsData={TABS_MOCK_DATA_1} />
      </div>
    </>
  );

  const keroseneData = (
    <>
      <div className="mt-12">
        <ButtonComponent>Claim 1,863 Kerosene</ButtonComponent>
      </div>
      {keroseneCardsData.map((card, index) => (
        <div className="mt-6" key={index}>
          <KeroseneCard
            currency={card.currency}
            staked={card.staked}
            APY={card.APY}
            keroseneEarned={card.keroseneEarned}
          />
        </div>
      ))}
    </>
  );

  const tabsData = [
    {
      label: "Manage Notes",
      tabKey: "Manage Notes",
      content: manageNotesContent,
    },
    {
      label: "Earn Kerosene",
      tabKey: "Earn Kerosene",
      content: keroseneData,
    },
    {
      label: "Check Eligibility",
      tabKey: "Check Eligibility",
      content: <CheckEligibilityCard />,
    },
  ];

  return (
    <div className="flex-1 max-w-screen-md w-[745px] p-4 mt-4">
      <TabsComponent tabsData={tabsData} />
    </div>
  );
}
