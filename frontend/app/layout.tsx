import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { WalletContextProvider } from "@/components/wallet/WalletProvider"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "CryptInk - Decentralized Collaborative Writing Platform",
  description: "Write, collaborate, and publish on Solana blockchain with end-to-end encryption and transparent royalties",
  generator: "CryptInk",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="dark">
        <WalletContextProvider>
          {children}
          <Toaster position="top-right" theme="dark" />
        </WalletContextProvider>
      </body>
    </html>
  )
}
