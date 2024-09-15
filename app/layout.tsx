import '@rainbow-me/rainbowkit/styles.css';
import "./globals.css";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { metadata as meta } from "./metadata";
import { Providers } from "./providers";
import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const MainNav = dynamic(
  () => import("@/components/ui/main-nav"),
  { ssr: false }
);

const Footer = dynamic(
  () => import("@/components/ui/footer"),
  { ssr: false }
);

const TransactionModal = dynamic(
  () => import("@/components/reusable/TransactionModal"),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = meta;

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
        <Providers>
          <main className="flex flex-col min-h-screen items-center">
            <div className="flex relative max-w-screen-md w-full md:w-[745px] justify-start box-border md:pb-8 pb-12 pt-8">
              <MainNav className="mx-4 flex-1 max-w-screen-md" />
              <div className="ml-auto flex items-center space-x-4 mr-4">
                <ConnectButton showBalance={false}   />
              </div>
            </div>
            {children}
            <Footer />
          </main>
          <TransactionModal />
        </Providers>
      </body>
    </html>
  );
}
