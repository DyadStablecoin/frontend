import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { NoteExtensionsModel } from "@/models/NoteCardModels";
import { Switch } from "@nextui-org/switch";
import { cn } from "@/lib/utils";

interface NoteEtensionsModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  extensions: NoteExtensionsModel[];
}

const NoteEtensionsModal: React.FC<NoteEtensionsModalProps> = ({
  isOpen,
  onOpenChange,
  extensions,
}) => {
  const [isRedemptionSelected, setRedemptionSelected] = React.useState(false);
  const [isNativeEthSelected, setNativeEthSelected] = React.useState(true);
  const [isAtomicSwapSelected, setAtomicSwapSelected] = React.useState(false);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="bg-[#282828] pb-4"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Manage Note Extensions
            </ModalHeader>
            <ModalBody>
              {extensions.map((extension) => (
                <div className="flex justify-between items-center text-[white] text-sm rounded-lg bg-[#1A1A1A] p-2">
                  <div className="ml-2">
                    <div>{extension.label}</div>
                    <div className="text-xs text-[grey]">
                      {extension.description}
                    </div>
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
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default NoteEtensionsModal;
