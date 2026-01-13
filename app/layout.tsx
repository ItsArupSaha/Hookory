import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Hookline.io - Repurpose Content for LinkedIn",
    description: "Turn one piece of content into multiple ready-to-post LinkedIn formats optimized for engagement",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Toaster />
            </body>
        </html>
    )
}
