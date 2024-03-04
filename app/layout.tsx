"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { goerli, mainnet, foundry } from "viem/chains";
import {
  Client,
  Provider as UrqlProvider,
  cacheExchange,
  fetchExchange,
} from "urql";

import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import WalletButton from "@/components/ui/wallet-button";
import { ModalProvider } from "@/contexts/modal";
import { Footer } from "@/components/ui/footer";
import { MainNav } from "@/components/ui/main-nav";
import { NextUIProvider } from "@nextui-org/react";

const inter = Inter({ subsets: ["latin"] });

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    // chain: foundry,
    chain: mainnet,
    transport: http(),
  }),
});

const client = new Client({
  url: process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "",
  exchanges: [cacheExchange, fetchExchange],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <NextUIProvider>
          <main className="dark text-foreground bg-background">
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <WagmiConfig config={wagmiConfig}>
                <UrqlProvider value={client}>
                  <main className="flex flex-col min-h-screen items-center">
                    <ModalProvider>
                      <div className="flex max-w-screen-md w-full h-16 justify-start box-border">
                        <MainNav className="mx-4 flex-1 max-w-screen-md" />
                        <div className="ml-auto flex items-center space-x-4 mr-4">
                          <WalletButton />
                        </div>
                      </div>
                      <Separator />
                      {children}
                      <Footer />
                    </ModalProvider>
                  </main>
                </UrqlProvider>
              </WagmiConfig>
            </ThemeProvider>
          </main>
        </NextUIProvider>
      </body>
    </html>
  );
}
