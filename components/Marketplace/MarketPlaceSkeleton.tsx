import { Skeleton } from "@nextui-org/skeleton";
import React from "react";

interface MarketPlaceSkeletonProps {}

const MarketPlaceSkeleton: React.FC<MarketPlaceSkeletonProps> = ({}) => {
  return (
    <>
      <div className="w-full ml-auto flex justify-end">
        <div className="w-16 mr-2">
          <Skeleton className="w-[40px] bg-[#282828] h-[39px]" />
        </div>
        <div className="w-16 ml-2">
          <Skeleton className="w-[40px] bg-[#282828] h-[39px]" />
        </div>
      </div>
      <div className="hidden justify-between text-xs bg-[#09090B] tracking-wider md:grid md:grid-cols-12 md:gap-x-2 text-center mt-2 py-4 px-2 sticky top-0">
        <div className="col-span-1 mt-auto mb-auto">Rank</div>
        <div className="col-span-1 mt-auto mb-auto">Note Nº</div>
        <div className="col-span-1 mt-auto mb-auto">XP</div>
        <div className="col-span-1 mt-auto mb-auto">% of XP</div>
        <div className="col-span-2 mt-auto mb-auto">KERO</div>
        <div className="col-span-1 mt-auto mb-auto">DYAD</div>
        <div className="col-span-2 mt-auto mb-auto">Collateral</div>
        <div className="col-span-1 mt-auto mb-auto">CR</div>
        <div className="col-span-2 mt-auto mb-auto">Market</div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-y-2">
        {Array(9)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="block md:flex md:items-center bg-[#1A1A1A] h-[124px] md:h-[52px] p-2"
            >
              {/* Desktop view skeleton */}
              <Skeleton className="hidden md:block col-span-10 w-full ml-2 h-3" />
              <Skeleton className="hidden md:block col-span-2 w-[109px] ml-2 h-[36px]" />

              {/* Mobile view skeleton */}
              <div className="md:hidden justify-between mb-4 flex w-full mt-1">
                <div>
                  <Skeleton className="w-[120px] h-3 mb-2" />
                  <Skeleton className="w-[100px] h-3" />
                </div>

                <Skeleton className="w-[151px] h-9 bg-[#282828]" />
              </div>
              <div className="md:hidden grid grid-cols-1 w-full gap-4">
                <Skeleton className="col-span-1 w-full h-3 bg-[#282828]" />
                <Skeleton className="col-span-1 w-full h-3 bg-[#282828]" />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default MarketPlaceSkeleton;
