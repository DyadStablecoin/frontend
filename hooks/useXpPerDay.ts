import { useMemo } from "react";
import { vaultAbi } from "@/lib/abi/Vault";
import { useReadContract } from "wagmi";
import { keroseneVaultAddress } from "@/generated";
import { defaultChain } from "@/lib/config";
import { formatEther } from "viem";

export default function useXpPerDay(noteId: bigint) {

  const { data: keroDeposited, isLoading: loading, isError: error } = useReadContract({
    abi: vaultAbi,
    address: keroseneVaultAddress[defaultChain.id],
    functionName: "id2asset",
    args: [noteId]
  });

  const xpPerDay = useMemo(() => {
    if (!keroDeposited) return 0;
    const keroDepositedNumber = Number(formatEther(keroDeposited));
    return keroDepositedNumber * 86400 / 1e9;
  }, [keroDeposited]);

  return { xpPerDay, loading, error };
}
