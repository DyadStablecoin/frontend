import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { TabsDataModel } from "@/models/TabsModel";

interface tabsComponentPropsInterface {
  tabsData: TabsDataModel[];
  logo?: string | JSX.Element;
}

export default function TabsComponent({
  tabsData,
  logo,
}: tabsComponentPropsInterface) {
  return (
    <div className="w-full px-0.5 flex relative">
      <div>
        {logo && (
          <div className="h-7 w-3/6 absolute flex">
            <div className="w-full h-7 text-2xl">{logo}</div>
          </div>
        )}
        <Tabs
          variant="underlined"
          aria-label="Tabs variants"
          className="p-0 w-full"
          classNames={{
            tabList: `justify-between ${
              logo ? "w-3/6" : "w-full"
            } relative rounded-none p-0 border-b border-divider ml-auto`,
            cursor: "w-full bg-[#FAFAFA]",
            tab: "max-w-fit h-7 font-semibold",
          }}
        >
          {tabsData.map((tab: any) => (
            <Tab key={tab.tabKey} title={tab.label}>
              <div
                className="max-h-52 overflow-auto"
                style={{ width: "640px" }}
              >
                {tab.content}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
    // </div>
  );
}
