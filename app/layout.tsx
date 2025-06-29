import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/hooks/use-cart"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vlar - Vaporizadores e Tecnologia",
  description: "Os melhores vaporizadores, líquidos e produtos de tecnologia. Qualidade garantida e entrega rápida.",
  keywords: "vape, vaporizador, líquidos, tecnologia, informática, eletrônicos",
  authors: [{ name: "Vlar Tecnologia" }],
  creator: "Vlar Tecnologia",
  publisher: "Vlar Tecnologia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://vlar.com.br",
    title: "Vlar - Vaporizadores e Tecnologia",
    description: "Os melhores vaporizadores, líquidos e produtos de tecnologia. Qualidade garantida e entrega rápida.",
    siteName: "Vlar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vlar - Vaporizadores e Tecnologia",
    description: "Os melhores vaporizadores, líquidos e produtos de tecnologia. Qualidade garantida e entrega rápida.",
  },
  icons: {
    icon: "/vlar-icon.png",
    shortcut: "/vlar-icon.png",
    apple: "/vlar-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
