import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import { Providers } from "@/providers/providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: "Academix - Get Smarter with Science",
  description: "Explore scientific papers with AI-powered summaries at your level.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
