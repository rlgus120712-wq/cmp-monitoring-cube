import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Okestro Cost Navigator",
  description: "Interactive cube-based monitoring portal for CMP resources"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  )
}

