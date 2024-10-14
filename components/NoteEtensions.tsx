import React from "react";
import { NoteExtensionsModel } from "@/models/NoteCardModels";
import { Switch } from "@nextui-org/switch";

interface NoteEtensionsProps {
  extensions: NoteExtensionsModel[];
}

const NoteEtensions: React.FC<NoteEtensionsProps> = ({ extensions }) => {
  const [isRedemptionSelected, setRedemptionSelected] = React.useState(false);
  const [isNativeEthSelected, setNativeEthSelected] = React.useState(true);
  const [isAtomicSwapSelected, setAtomicSwapSelected] = React.useState(false);
  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mt-4 md:mt-0">
        Note Extensions
      </h1>
      <div className="text-xs text-[grey] mb-8 w-[90%] md:w-auto">
        Manage your note extensions by enabling / disabling each extension
      </div>
      {extensions.map((extension) => (
        <div className="flex justify-between items-center text-[white] text-sm rounded-lg bg-[#1A1A1A] p-2 mb-4">
          <div className="ml-2">
            <div>{extension.label}</div>
            <div className="text-xs text-[grey]">{extension.description}</div>
          </div>
          <Switch
            size="sm"
            color="success"
            isSelected={
              extension.label === "Redemption"
                ? isRedemptionSelected
                : extension.label === "Native ETH"
                  ? isNativeEthSelected
                  : extension.label === "Atomic Swap"
                    ? isAtomicSwapSelected
                    : false
            }
            onValueChange={
              extension.label === "Redemption"
                ? setRedemptionSelected
                : extension.label === "Native ETH"
                  ? setNativeEthSelected
                  : setAtomicSwapSelected
            }
          />
        </div>
      ))}
    </div>
  );
};
export default NoteEtensions;
