import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Sreeshanth Soma | Full Stack Developer',
  description:
    'Portfolio of Sreeshanth Soma — Full Stack Developer skilled in React, Next.js, TypeScript, Node.js, and cloud technologies. Explore projects, resume, and more in an interactive macOS-style experience.',
  keywords: [
    'Sreeshanth Soma',
    'Full Stack Developer',
    'Frontend Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Portfolio',
    'Web Developer',
  ],
  authors: [{ name: 'Sreeshanth Soma', url: 'https://sreeshanthsoma.dev' }],
  creator: 'Sreeshanth Soma',
  metadataBase: new URL('https://sreeshanthsoma.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sreeshanthsoma.dev',
    title: 'Sreeshanth Soma | Full Stack Developer',
    description:
      'Interactive macOS-style portfolio showcasing projects, skills, and experience.',
    siteName: 'Sreeshanth Soma',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sreeshanth Soma Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sreeshanth Soma | Full Stack Developer',
    description:
      'Interactive macOS-style portfolio showcasing projects, skills, and experience.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
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
