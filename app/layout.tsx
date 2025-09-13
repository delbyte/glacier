import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "next-themes"
import "./globals.css"

export const metadata: Metadata = {
  title: "Glacier - Decentralized Storage Network",
  description:
    "Secure, trustless file storage powered by Avalanche blockchain. Earn passive income by providing storage or store your files with cryptographic security.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-white">Loading...</div>
            </div>
          }>
            {children}
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
