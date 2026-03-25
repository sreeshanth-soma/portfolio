import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Sreeshanth Soma | SDE & AI Systems Engineer',
  description:
    'Portfolio of Sreeshanth Soma — Software Development Engineer building production-grade AI systems and backend infrastructure. Skilled in Python, TypeScript, Django, Next.js, Azure, Docker, and RAG pipelines. Currently at Saryps Labs and contributing to OpenBroadcaster open source.',
  keywords: [
    'Sreeshanth Soma',
    'Software Developer',
    'SDE',
    'AI Systems Engineer',
    'Full Stack Developer',
    'Python',
    'TypeScript',
    'Django',
    'Next.js',
    'React',
    'Azure',
    'Docker',
    'RAG',
    'Pinecone',
    'Gemini API',
    'Backend Developer',
    'Cloud Engineer',
    'Open Source',
    'Portfolio',
    'Hyderabad',
  ],
  authors: [{ name: 'Sreeshanth Soma', url: 'https://sreeshanthsoma.live' }],
  creator: 'Sreeshanth Soma',
  metadataBase: new URL('https://sreeshanthsoma.live'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sreeshanthsoma.live',
    title: 'Sreeshanth Soma | SDE & AI Systems Engineer',
    description:
      'Engineering student building production-grade AI systems and backend infrastructure. Explore projects, resume, and experience in an interactive macOS-style portfolio.',
    siteName: 'Sreeshanth Soma',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sreeshanth Soma — SDE & AI Systems Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sreeshanth Soma | SDE & AI Systems Engineer',
    description:
      'Engineering student building production-grade AI systems and backend infrastructure. Interactive macOS-style portfolio.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/letter-s.png',
    shortcut: '/letter-s.png',
    apple: '/letter-s.png',
  },
  alternates: {
    canonical: 'https://sreeshanthsoma.live',
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
