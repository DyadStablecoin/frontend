"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import DnftBox from "@/components/dnft-box";
import TabsComponent from "@/components/reusable/TabsComponent";
import NoteCard from "@/components/NoteCard/NoteCard";

export default function Home() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 800) setShowMobileWarning(true);
  }, []);

  return (
    <>
      {/* <div className="flex-1 max-w-screen-md p-4 w-full hide-on-mobile">
        <h3 className="text-md font-medium leading-loose pt-3">
          Immutable Base. Infinite Possibility.
        </h3>
        <p className="text-sm leading-loose text-muted-foreground py-2">
          Deposit wETH into your Notes to mint DYAD. You will be able to claim
          rewards based on how much DYAD you’ve minted once we deploy the next
          layer of contracts. These rewards will make DYAD less expensive to
          mint, which can increase your yield.
        </p>
        <div>
          <Separator className="my-4" />
        </div>
        <DnftBox />
      </div>
      <div className="show-on-mobile text-md font-medium leading-loose pt-3 p-4">
        The DYAD app is not yet available on mobile. Please use a desktop
        browser.
      </div> */}
      <div className=" my-5">
        <NoteCard />
      </div>
    </>
  );
}
