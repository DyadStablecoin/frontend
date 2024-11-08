import React, { useState, Key, useEffect } from "react";
import NoteCardsContainer from "../reusable/NoteCardsContainer";
import InputComponent from "../reusable/InputComponent";
import currencies from "@/constants/currencies.json";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import Image from "next/image";
import { getIpfsImageURL } from "@/utils/imageUtils";
import { usePagination } from "@/hooks/usePagination";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import keroseneIcon from "../../public/kerosene-logo-outlined.svg";
import ButtonComponent from "../reusable/ButtonComponent";

interface SwapAndDepositModalProps {
  onModalClose: () => void;
}

const SwapAndDepositModal: React.FC<SwapAndDepositModalProps> = ({
  onModalClose,
}) => {
  const [swapFromAmount, setSwapFromAmount] = useState<string>("");
  const [swapToAmount, setSwapToAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [filtredItems, setFilteredItems] = useState(currencies);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [selectedCurrencyKey, setSelectedCurrencyKey] = useState<Key | null>(
    null
  );
  const { activePage, totalPages, items } = usePagination(
    filtredItems,
    1,
    resultsPerPage
  );

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: activePage < totalPages,
    isEnabled: isOpen,
    shouldUseLoader: false,
    onLoadMore: () => {
      setResultsPerPage(resultsPerPage + 10);
    },
  });

  const filterItems = (input: string) => {
    setFilteredItems(() =>
      input.length > 0
        ? currencies.filter(
            (item) =>
              item.symbol.toLowerCase().includes(input.toLowerCase()) ||
              item.name.toLowerCase().includes(input.toLowerCase())
          )
        : currencies
    );
  };

  return (
    <NoteCardsContainer className="md:w-[600px]">
      <div className="w-full flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-4">
          <div className="text-xl">Sell</div>
          <div className="flex md:flex-row flex-col gap-y-4 md:gap-y-0 md:gap-x-4">
            <InputComponent
              value={swapFromAmount}
              onValueChange={setSwapFromAmount}
              placeHolder="Sell Amount"
              type="number"
              disabled={!selectedCurrencyKey}
            />
            <Autocomplete
              classNames={{
                popoverContent: "min-w-[200px]",
                base: "md:max-w-[150px] ",
              }}
              items={items}
              scrollRef={scrollerRef}
              aria-label="Search currency"
              description="Search currency"
              radius="none"
              scrollShadowProps={{
                isEnabled: false,
              }}
              startContent={
                selectedImageSrc ? (
                  <Image
                    loading="lazy"
                    alt={"currency icon"}
                    className="flex-shrink-0 rounded-full"
                    src={
                      selectedImageSrc.includes("ipfs://")
                        ? getIpfsImageURL(
                            selectedImageSrc.replace("ipfs://", "")
                          )
                        : selectedImageSrc
                    }
                    width={20}
                    height={20}
                  />
                ) : undefined
              }
              onOpenChange={setIsOpen}
              onSelectionChange={(key) => {
                setSelectedCurrencyKey(key as Key);
                setSelectedImageSrc(
                  filtredItems.find((item) => item.name === key)?.logoURI!
                );
              }}
              selectedKey={selectedCurrencyKey}
              defaultSelectedKey={
                filtredItems.find((item) => item.symbol === "WETH")
                  ?.symbol as Key
              }
              onInputChange={(inputValue) => {
                filterItems(inputValue);
                setSwapFromAmount("");
              }}
            >
              {(item) => (
                <AutocompleteItem
                  key={item.name}
                  textValue={item.symbol}
                  className="z-50"
                  startContent={
                    <Image
                      loading="lazy"
                      alt={item.name}
                      className="flex-shrink-0 rounded-full"
                      src={
                        item.logoURI.includes("ipfs://")
                          ? getIpfsImageURL(item.logoURI.replace("ipfs://", ""))
                          : item.logoURI
                      }
                      width={20}
                      height={20}
                    />
                  }
                >
                  <span className="text-small">{item.name}</span>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </div>

        <div className="border-b-[0.5px] border-[#67676780] border-dashed w-full"></div>
        <div className="flex flex-col gap-y-4">
          <div className="text-xl">Deposit</div>
          <div className="flex md:flex-row flex-col gap-y-4 md:gap-y-0 md:gap-x-4">
            <InputComponent
              value={swapToAmount}
              onValueChange={setSwapToAmount}
              placeHolder="Deposit Amount"
              type="number"
              disabled
            />
            <div className="bg-[#27272A] w-full md:w-[200px] h-[40px] flex gap-x-1 items-center pl-[10px]">
              <Image
                loading="lazy"
                alt="kerosene icon"
                className="flex-shrink-0 rounded-full"
                src={keroseneIcon}
                width={20}
                height={20}
              />
              <span className="text-small">KERO</span>
            </div>
          </div>
        </div>
        <div className="border-b-[0.5px] border-[#67676780] border-dashed w-full"></div>

        <div className="flex gap-x-4">
          <ButtonComponent onClick={onModalClose}>Cancel</ButtonComponent>
          <ButtonComponent
            variant="bordered"
            className="cursor-pointer font-semibold flex text-[#966CF3] items-center justify-center border-1 border-[#966CF3]"
            disabled={
              (swapFromAmount === "0" && swapToAmount === "0") ||
              !swapFromAmount.length ||
              !swapToAmount.length
            }
          >
            Deposit
          </ButtonComponent>
        </div>
      </div>
    </NoteCardsContainer>
  );
};
export default SwapAndDepositModal;
