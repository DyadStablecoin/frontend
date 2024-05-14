import { useContractReads } from "wagmi";
import { useEffect, useState } from "react";
import DnftAbi from "@/abis/DNft.json";
import { dNftAddress } from "@/generated";
import { defaultChain } from "@/lib/config";

export default function useIDsByOwner(owner, balance) {
  console.log("LLLL");
  const [tokenIds, setTokenIds] = useState([]);
  const [calls, setCalls] = useState([]);

  const { refetch, data: tokens } = useContractReads({
    contracts: calls,
    // enabled: false,
    onSuccess: (data) => {
      console.log("SUCESS");
      console.log("useIDsByOwner: Fetching ids for", owner, data);
      setTokenIds(data);
    },
    onError: (error) => {
      console.log("SUCESS");
      console.error("Nein: Error fetching ids for", owner, error);
    },
    select: (data) => {
      console.log("SELECT", data);
      return data;
    },
  });
  // console.log("BBBB", bbb);
  console.log("XXXX", owner, parseInt(balance));

  useEffect(() => {
    console.log("BBBBB");
    let _calls = [];
    // for (let i = 0; i < parseInt(balance); i++) {
    for (let i = 0; i < balance; i++) {
      console.log("OOOO", i);
      _calls.push({
        address: dNftAddress[defaultChain.id],
        functionName: "tokenOfOwnerByIndex",
        abi: DnftAbi,
        args: [owner, i],
      });
    }
    console.log("calls", calls);
    setCalls(_calls);
  }, [balance]);

  useEffect(() => {
    console.log("super calls", calls);
    refetch();
    /**
     * If there are no calls to be made, we automatically know that there are
     * not any token ids to be fetched.
     */
    // calls.length > 0 ? refetch() : setTokenIds([]);
  }, [calls]);

  return { tokens };
}
