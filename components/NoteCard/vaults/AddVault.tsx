import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Address } from "viem";
import AddVaultModal from "@/components/Modals/NoteCardModals/DepositModals/AddVault/AddVaultModal";

const AddVault = ({
  tokenId,
}: {
  tokenId: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger className="h-full w-full mt-2">
        <div
          className={`font-semibold text-[#FAFAFA] text-sm items-center justify-center flex flex-col gap-2 w-full h-9 bg-transparent border border-white/30`}
        >
          <p>+</p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-fit">
        <AddVaultModal tokenId={tokenId} />
      </DialogContent>
    </Dialog>
  );
};

export default AddVault;
