import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Sreeshanth Soma | macOS Portfolio',
  description: 'Personal portfolio of Sreeshanth Soma, showcasing web development projects and skills',
  icons: {
    icon: '/letter-s.png',
    shortcut: '/letter-s.png',
    apple: '/letter-s.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children} <Analytics /></body>
    </html>
  )
}
