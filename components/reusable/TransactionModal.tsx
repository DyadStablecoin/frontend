"use client";

import { Close } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Address } from "viem";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { defaultChain } from "@/lib/config";
import { useTransactionStore } from "@/lib/store";
import dynamic from "next/dynamic";

// Dynamically import components
const Dialog = dynamic(() => import("@/components/ui/dialog").then(module => module.Dialog));
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(module => module.DialogContent));
const Button = dynamic(() => import("@/components/ui/button").then(module => module.Button));
const Alert = dynamic(() => import("@/components/ui/alert").then(module => module.Alert));
const AlertDescription = dynamic(() => import("@/components/ui/alert").then(module => module.AlertDescription));
const AlertTitle = dynamic(() => import("@/components/ui/alert").then(module => module.AlertTitle));
const Loader = dynamic(() => import("../loader"));
const AlertTriangle = dynamic(() => import("lucide-react").then(module => module.AlertTriangle));
const CheckCircle = dynamic(() => import("lucide-react").then(module => module.CheckCircle));
const XCircle = dynamic(() => import("lucide-react").then(module => module.XCircle));

enum TransactionState {
  REVIEW = "REVIEW",
  CONFIRM = "CONFIRM",
  SENT = "SENT",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

type TransactionModalData = {
  title: string;
  icon?: any;
};

type TransactionStateToDataMappings = Record<
  TransactionState,
  TransactionModalData
>;

const messages: TransactionStateToDataMappings = {
  [TransactionState.REVIEW]: {
    title: "Review Transaction",
  },
  [TransactionState.CONFIRM]: {
    title: "Awaiting Wallet Confirmation",
    icon: <Loader />,
  },
  [TransactionState.SENT]: {
    title: "Transaction Sent...",
    icon: <Loader />,
  },
  [TransactionState.SUCCESS]: {
    title: "Transaction success",
    icon: <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />,
  },
  [TransactionState.ERROR]: {
    title: "Transaction failed",
    icon: <XCircle className="h-6 w-6 text-red-600" aria-hidden="true" />,
  },
};


const TransactionModal = () => {
  const { transactionData, setTransactionData } = useTransactionStore();
  const [txState, setTxState] = useState<TransactionState>(
    TransactionState.REVIEW
  );
  const status = messages[txState];
  const [error, setError] = useState("");
  const [hash, setHash] = useState<Address | undefined>();
  const queryClient = useQueryClient();

  const { data: simulateData, error: simulateError } = useSimulateContract({
    address: transactionData?.config.address,
    abi: transactionData?.config.abi,
    functionName: transactionData?.config.functionName,
    args: transactionData?.config.args,
    chainId: defaultChain.id,
    value: transactionData?.config.value,
    query: {
      enabled: transactionData?.config.enabled,
    },
  });

  useEffect(() => {
    if (simulateError) {
      setError(simulateError.message);
      setTxState(TransactionState.ERROR);
    }
  }, [simulateError]);

  const { writeContract } = useWriteContract();

  const {
    isSuccess: isReceiptSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isReceiptSuccess) {
      setTxState(TransactionState.SUCCESS);
    } else if (isReceiptError) {
      setTxState(TransactionState.ERROR);
      setError(receiptError.message);
    }
  }, [isReceiptSuccess, receiptError]);

  const handleClose = (open: boolean) => {
    if (!open) {
      queryClient.invalidateQueries();
      setTransactionData(undefined);
      setHash(undefined);
      setError("");
      setTxState(TransactionState.REVIEW);
    }
  };

  const handleConfirm = () => {
    writeContract(simulateData!.request, {
      onSuccess: (txHash) => {
        setHash(txHash);
        setTxState(TransactionState.SENT);
      },
      onError: (txError) => {
        setError(txError.message);
        setTxState(TransactionState.ERROR);
      },
    });
    setTxState(TransactionState.CONFIRM);
  };

  const allowClose =
    txState !== TransactionState.SENT && txState !== TransactionState.CONFIRM;

  return (
    <Dialog open={!!transactionData} onOpenChange={handleClose}>
      <DialogContent
        className="flex flex-col gap-3"
        allowClose={allowClose}
        onInteractOutside={(e) => (allowClose ? null : e.preventDefault())}
        onEscapeKeyDown={(e) => (allowClose ? null : e.preventDefault())}
      >
        <div className="flex gap-3 items-center justify-center">
          <p className="text-2xl font-funky">{status.title}</p>
          {status?.icon}
        </div>
        <p>{transactionData?.description}</p>
        {error && (
          <Alert variant="destructive" className="max-w-full break-words">
            <AlertTriangle />
            <AlertTitle>Transaction Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex gap-10">
          {txState === TransactionState.REVIEW && (
            <>
              <Close>
                <Button variant="secondary">Cancel</Button>
              </Close>

              <Button onClick={handleConfirm} loading={!simulateData?.request}>
                Confirm Transaction
              </Button>
            </>
          )}
          {(txState === TransactionState.ERROR ||
            txState === TransactionState.SUCCESS) && (
            <Close>
              <Button>Return to App</Button>
            </Close>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal
