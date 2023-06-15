import "@/styles/globals.css"
import { Metadata } from "next"
import Head from "next/head"
import ToasterProvider from "@/providers/toastprovider"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen w-full bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="w-full">{children}</div>
          </div>

          <ToasterProvider />
        </body>
      </html>
    </>
  )
}
