import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from "@vercel/analytics/next"

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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sreeshanth Soma",
  alternateName: "Soma",
  url: "https://sreeshanthsoma.live",
  image: "https://sreeshanthsoma.live/og-image.png",
  email: "sreeshanthsoma@gmail.com",
  telephone: "+917995648818",
  jobTitle: "Software Development Engineer",
  description:
    "Engineering student building production-grade AI systems and backend infrastructure. SDE at Saryps Labs, open-source contributor at OpenBroadcaster.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "CVR College of Engineering",
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  },
  worksFor: [
    {
      "@type": "Organization",
      name: "Saryps Labs Private Limited",
      url: "https://saryps.com",
    },
    {
      "@type": "Organization",
      name: "OpenBroadcaster",
      url: "https://openbroadcaster.com",
    },
  ],
  knowsAbout: [
    "Python", "TypeScript", "JavaScript", "C++",
    "Next.js", "React", "Django", "REST APIs",
    "PostgreSQL", "Prisma", "Docker", "Azure",
    "Gemini API", "RAG", "Pinecone", "Semantic Search",
    "CI/CD", "GitHub Actions",
  ],
  sameAs: [
    "https://github.com/sreeshanth-soma",
    "https://linkedin.com/in/sreeshanth-soma",
  ],
}

const projectJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Projects by Sreeshanth Soma",
  itemListElement: [
    {
      "@type": "SoftwareApplication",
      position: 1,
      name: "Alephra",
      url: "https://alephra.com",
      description:
        "AI-powered healthcare assistant for medical report analysis with multilingual voice interaction in 10+ Indian languages.",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      author: { "@type": "Person", name: "Sreeshanth Soma" },
    },
    {
      "@type": "WebSite",
      position: 2,
      name: "macOS Portfolio",
      url: "https://sreeshanthsoma.live",
      description:
        "Interactive macOS-style portfolio with window management, dock, spotlight search, and multiple apps built with Next.js 15 and React 19.",
      author: { "@type": "Person", name: "Sreeshanth Soma" },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />

        {/* Server-rendered SEO content — hidden visually but indexable by crawlers */}
        <div className="sr-only" aria-hidden="false">
          <h1>Sreeshanth Soma — Software Development Engineer & AI Systems Engineer</h1>
          <p>
            Sreeshanth Soma is an engineering student at CVR College of Engineering, Hyderabad,
            building production-grade AI systems and backend infrastructure. He currently works as
            an SDE at Saryps Labs Private Limited, developing AI voice cloning platforms on Azure,
            and contributes to OpenBroadcaster, an open-source broadcast automation platform used
            by community radio stations globally.
          </p>

          <h2>Projects</h2>
          <ul>
            <li>
              <strong>Alephra</strong> — AI-powered healthcare assistant for medical report analysis.
              Built with Next.js 14, TypeScript, Gemini API, Pinecone, Prisma, and PostgreSQL.
              Supports multilingual voice interaction in 10+ Indian languages. Reduced TTS latency
              by 62%. Visit: alephra.com
            </li>
            <li>
              <strong>macOS Portfolio</strong> — Interactive macOS-style portfolio website with
              window management, dock, spotlight search, calculator, terminal, and AI chatbot.
              Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.
              Visit: sreeshanthsoma.live
            </li>
          </ul>

          <h2>Skills</h2>
          <p>
            Python, TypeScript, JavaScript, C++, Django, REST APIs, WebSockets, PostgreSQL, MySQL,
            Prisma, Next.js, React, Tailwind CSS, Gemini API, RAG, Semantic Search, Pinecone,
            Azure, AWS, GCP, Docker, CI/CD, Vercel, Git, GitHub Actions.
          </p>

          <h2>Experience</h2>
          <ul>
            <li>SDE at Saryps Labs Private Limited (Feb 2025 – Present) — AI Voice Cloning Platform on Azure</li>
            <li>SDE Intern at OpenBroadcaster (Feb 2026 – Present) — Open-source broadcast automation, 10+ merged PRs</li>
          </ul>

          <h2>Education</h2>
          <p>B.Tech Computer Science, CVR College of Engineering, Hyderabad (2023 – Present). CGPA: 8.73/10</p>

          <h2>Achievements</h2>
          <ul>
            <li>3rd place out of 167 teams in DEMUX 2.0 National Hackathon</li>
            <li>Most Innovative Robot award in state-level robotic competition</li>
          </ul>

          <h2>Contact</h2>
          <p>Email: sreeshanthsoma@gmail.com | Phone: +91 79956 48818 | Location: Hyderabad, India</p>
          <nav>
            <a href="https://github.com/sreeshanth-soma">GitHub</a>
            <a href="https://linkedin.com/in/sreeshanth-soma">LinkedIn</a>
            <a href="https://alephra.com">Alephra</a>
          </nav>
        </div>
      </body>
    </html>
  )
}
