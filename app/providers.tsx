"use client";

import { reservoirChains } from "@reservoir0x/reservoir-sdk";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Client,
  Provider as UrqlProvider,
  cacheExchange,
  fetchExchange,
} from "urql";
import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";
import { projectId, wagmiConfig } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi";
import { ModalProvider } from "@/contexts/modal";
import { ReservoirKitProvider, darkTheme } from "@reservoir0x/reservoir-kit-ui";

const queryClient = new QueryClient();

// Do you have an .env file?
if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

const client = new Client({
  url: process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "",
  exchanges: [cacheExchange, fetchExchange],
});

const theme = darkTheme();

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <WagmiProvider config={wagmiConfig}>
          <ReservoirKitProvider
            options={{
              apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
              chains: [{ ...reservoirChains.mainnet, active: true }],
              source: "app.dyadstable.xyz",
            }}
            theme={theme}
          >
            <QueryClientProvider client={queryClient}>
              <UrqlProvider value={client}>
                <ModalProvider>{children}</ModalProvider>
              </UrqlProvider>
            </QueryClientProvider>
          </ReservoirKitProvider>
        </WagmiProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
};
