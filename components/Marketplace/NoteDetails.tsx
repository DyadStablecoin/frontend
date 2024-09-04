import React, {Fragment, useMemo, useState} from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import TabsComponent from "../reusable/TabsComponent";
import {
  vaultManagerAbi,
  vaultManagerAddress,
  wEthVaultAbi,
  dyadAbi,
  dyadAddress,
} from "@/generated";
import {defaultChain} from "@/lib/config";
import NoteNumber from "../NoteCard/Children/NoteNumber";
import {NoteNumberDataColumnModel} from "@/models/NoteCardModels";
import {TabsDataModel} from "@/models/TabsModel";
import Deposit, {supportedVaults} from "../NoteCard/Children/Deposit";
// import Mint from "./Children/Mint";
import {useReadContracts} from "wagmi";
import {maxUint256} from "viem";
import {formatNumber, fromBigNumber} from "@/lib/utils";
import {vaultInfo} from "@/lib/constants";
import {Data} from "../reusable/PieChartComponent";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {Menu} from "lucide-react";
import {DialogContent} from "@/components/ui/dialog";

interface NoteDetailsProps {
  selectedRow: any; // Adjust the type as necessary
}

type ContractData = {
  collatRatio?: bigint;
  exoCollateralValue?: bigint;
  keroCollateralValue?: bigint;
  totalCollateralValue?: bigint;
  minCollatRatio?: bigint;
  mintedDyad?: bigint;
};

const NoteDetails: React.FC<NoteDetailsProps> = ({selectedRow}) => {
  const {
    data: contractData,
    isSuccess: dataLoaded,
    isError: loadDataError,
  } = useReadContracts({
    contracts: [
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "collatRatio",
        args: [BigInt(selectedRow.id)],
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "getVaultsValues",
        args: [BigInt(selectedRow.id)],
      },
      {
        address: vaultManagerAddress[defaultChain.id],
        abi: vaultManagerAbi,
        functionName: "MIN_COLLAT_RATIO",
      },
      {
        address: dyadAddress[defaultChain.id],
        abi: dyadAbi,
        functionName: "mintedDyad",
        args: [BigInt(selectedRow.id)],
      },
    ],
    allowFailure: false,
    query: {
      select: (data) => {
        const collatRatio = data[0];
        const exoCollateralValue = data[1][0];
        const keroCollateralValue = data[1][1];
        const minCollatRatio = data[2];
        const mintedDyad = data[3];
        const totalCollateralValue = exoCollateralValue + keroCollateralValue;

        return {
          collatRatio,
          exoCollateralValue,
          keroCollateralValue,
          totalCollateralValue,
          minCollatRatio,
          mintedDyad,
        };
      },
    },
  });

  const {
    collatRatio,
    exoCollateralValue,
    keroCollateralValue,
    totalCollateralValue,
    minCollatRatio,
    mintedDyad,
  } = useMemo<ContractData>(() => {
    if (contractData) {
      return contractData;
    } else {
      return {};
    }
  }, [contractData]);

  const {data: usdCollateral, isError: vaultCollateralError} =
    useReadContracts({
      contracts: supportedVaults.map((address) => ({
        address: address,
        abi: wEthVaultAbi,
        functionName: "getUsdValue",
        args: [BigInt(selectedRow.id)],
        chainId: defaultChain.id,
      })),
      allowFailure: false,
    });

  const {data: tokenCollateral, isError: tokenCollateralError} =
    useReadContracts({
      contracts: supportedVaults.map((address) => ({
        address: address,
        abi: wEthVaultAbi,
        functionName: "id2asset",
        args: [BigInt(selectedRow.id)],
        chainId: defaultChain.id,
      })),
      allowFailure: false,
    });

  const vaultAmounts: Data[] = useMemo(() => {
    if (!usdCollateral || !tokenCollateral) {
      return [];
    }

    return usdCollateral.map((collateral, index) => ({
      label: `${vaultInfo[index].symbol}|${fromBigNumber(tokenCollateral[index]).toFixed(4)}`,
      value: fromBigNumber(collateral),
      color: vaultInfo[index].color,
    }));
  }, [tokenCollateral, usdCollateral]);

  // Calculate total collateral and collateralization ratio
  const totalCollateral = dataLoaded
    ? `$${formatNumber(fromBigNumber(totalCollateralValue))}`
    : "N/A";

  const collateralizationRatio = dataLoaded
    ? collatRatio === maxUint256
      ? "Infinity"
      : `${formatNumber(fromBigNumber(contractData.collatRatio, 16))}%`
    : "N/A";

  // Calculate total DYAD
  const totalDyad = contractData?.mintedDyad
    ? `${Math.floor(fromBigNumber(contractData.mintedDyad))}`
    : "N/A";

  const noteData: NoteNumberDataColumnModel[] = [
    {
      text: "Collateralization ratio",
      value: collateralizationRatio,
      highlighted: true,
    },
    {
      text: "DYAD minted",
      value: totalDyad,
      highlighted: false,
    },
    {
      text: "Collateral",
      value: totalCollateral,
      highlighted: false,
    },
    {
      text: "Exogenous Collateral",
      value: !dataLoaded
        ? "N/A"
        : `$${formatNumber(fromBigNumber(exoCollateralValue))}`,
      highlighted: false,
    },
  ];

  // Check if the vault exists
  const {data: hasVaultData, isError: hasVaultError} = useReadContracts({
    contracts: supportedVaults.map((address) => ({
      address: vaultManagerAddress[defaultChain.id],
      abi: vaultManagerAbi,
      functionName: "hasVault",
      args: [BigInt(selectedRow.id), address],
      chainId: defaultChain.id,
    })),
    allowFailure: false,
  });
  const hasVault = (hasVaultData?.filter((data) => !!data)?.length || 0) > 0;

  const mintableDyad = useMemo(() => {
    if (
      !dataLoaded ||
      totalCollateralValue === undefined ||
      minCollatRatio === undefined ||
      mintedDyad === undefined ||
      exoCollateralValue === undefined ||
      keroCollateralValue === undefined
    ) {
      return "N/A";
    }
    let usableKero = keroCollateralValue;
    if (keroCollateralValue > exoCollateralValue) {
      usableKero = exoCollateralValue;
    }
    let maxDyad =
      ((usableKero + exoCollateralValue) * 1000000000000000000n) /
      minCollatRatio;

    if (maxDyad > exoCollateralValue) {
      maxDyad = exoCollateralValue;
    }

    return maxDyad - (mintedDyad || 0n);
  }, [
    dataLoaded,
    totalCollateralValue,
    minCollatRatio,
    mintedDyad,
    exoCollateralValue,
    keroCollateralValue,
  ]);

  // Prepare tabs data
  const tabData: TabsDataModel[] = [
    {
      label: `Note Nº ${selectedRow.id}`,
      tabKey: `Note Nº ${selectedRow.id}`,
      content: hasVault ? (
        <NoteNumber
          data={noteData}
          dyad={[fromBigNumber(mintableDyad), fromBigNumber(mintedDyad)]}
          collateral={vaultAmounts}
        />
      ) : (
        <p>Deposit collateral to open vault</p>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabData[0].tabKey);

  const renderActiveTabContent = (activeTabKey: string) => {
    return tabData.find((tab: TabsDataModel) => activeTab === tab.tabKey)
      ?.content;
  };

  return (
    <DialogContent>
      {selectedRow && (
        <>
          <h2>Note ID: {selectedRow.id}</h2> {/* Added title for note ID */}
          {hasVault ? (
            <NoteNumber
              data={noteData}
              dyad={[fromBigNumber(mintableDyad), fromBigNumber(mintedDyad)]}
              collateral={vaultAmounts}
            />
          ) : (
            <p>Deposit collateral to open vault</p>
          )}
        </>
      )}
    </DialogContent>
  );
};

export default NoteDetails;