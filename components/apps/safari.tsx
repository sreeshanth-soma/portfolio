"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Compass, ExternalLink, Globe, Home, LoaderCircle, Plus, RefreshCw, Search, Star, Wifi } from "lucide-react"

interface SafariProps {
  isDarkMode?: boolean
}

type LaunchReason = "blocked" | "email" | "search"
type BrowserView = { kind: "home" } | { kind: "embedded" } | { kind: "external"; reason: LaunchReason }
type NavigationEntry = {
  url: string
  view: BrowserView
}

type SafariSite = {
  category: string
  hostnames: string[]
  note: string
  title: string
  url: string
}

const START_PAGE = "browser://start"
const GOOGLE_SEARCH_PREFIX = "https://www.google.com/search?q="

const EMBEDDABLE_SITES: SafariSite[] = [
  {
    category: "Reference",
    hostnames: ["wikipedia.org"],
    note: "Fast reference and browsing through a real Wikipedia page.",
    title: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Main_Page",
  },
  {
    category: "Reference",
    hostnames: ["archive.org"],
    note: "Internet Archive collections and snapshots in-window.",
    title: "Archive.org",
    url: "https://archive.org",
  },
  {
    category: "Reference",
    hostnames: ["openlibrary.org"],
    note: "Book search and browsing from Open Library.",
    title: "Open Library",
    url: "https://openlibrary.org",
  },
  {
    category: "Reference",
    hostnames: ["gutenberg.org"],
    note: "Public-domain reading and discovery inside Safari.",
    title: "Project Gutenberg",
    url: "https://www.gutenberg.org",
  },
  {
    category: "Docs",
    hostnames: ["docs.python.org"],
    note: "Official Python docs with navigation intact.",
    title: "Python Docs",
    url: "https://docs.python.org/3/",
  },
  {
    category: "Docs",
    hostnames: ["nodejs.org"],
    note: "Live Node.js documentation pages.",
    title: "Node.js Docs",
    url: "https://nodejs.org/docs/latest/api/",
  },
  {
    category: "Docs",
    hostnames: ["typescriptlang.org"],
    note: "TypeScript site and playground pages.",
    title: "TypeScript",
    url: "https://www.typescriptlang.org/play",
  },
  {
    category: "Docs",
    hostnames: ["react.dev"],
    note: "React docs and learning pages that stay in-window.",
    title: "React",
    url: "https://react.dev/learn",
  },
  {
    category: "Docs",
    hostnames: ["vite.dev"],
    note: "Vite guide and docs pages.",
    title: "Vite",
    url: "https://vite.dev/guide/",
  },
  {
    category: "Docs",
    hostnames: ["tailwindcss.com"],
    note: "Tailwind docs as a real embedded page.",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com/docs",
  },
  {
    category: "Docs",
    hostnames: ["caniuse.com"],
    note: "Browser support lookup inside the app.",
    title: "Can I Use",
    url: "https://caniuse.com",
  },
  {
    category: "Community",
    hostnames: ["hashnode.com"],
    note: "Developer writing and tech posts from Hashnode.",
    title: "Hashnode",
    url: "https://hashnode.com",
  },
  {
    category: "Tools",
    hostnames: ["jsfiddle.net"],
    note: "A live code playground that currently allows framing.",
    title: "JSFiddle",
    url: "https://jsfiddle.net",
  },
]

function normalizeUrl(rawValue: string) {
  const trimmedValue = rawValue.trim()

  if (!trimmedValue) {
    return START_PAGE
  }

  if (trimmedValue.startsWith("mailto:") || trimmedValue.startsWith("/")) {
    return trimmedValue
  }

  if (/^https?:\/\//i.test(trimmedValue)) {
    return trimmedValue
  }

  if (trimmedValue.includes(" ")) {
    return `${GOOGLE_SEARCH_PREFIX}${encodeURIComponent(trimmedValue)}`
  }

  if (trimmedValue.includes(".")) {
    return `https://${trimmedValue}`
  }

  return `${GOOGLE_SEARCH_PREFIX}${encodeURIComponent(trimmedValue)}`
}

function getHostname(targetUrl: string) {
  try {
    return new URL(targetUrl).hostname.toLowerCase()
  } catch {
    return null
  }
}

function matchesHostname(hostname: string, expectedHost: string) {
  return hostname === expectedHost || hostname.endsWith(`.${expectedHost}`)
}

function findEmbeddableSite(targetUrl: string) {
  const hostname = getHostname(targetUrl)

  if (!hostname) {
    return null
  }

  return EMBEDDABLE_SITES.find((site) => site.hostnames.some((allowedHost) => matchesHostname(hostname, allowedHost)))
}

function canEmbedUrl(targetUrl: string) {
  if (targetUrl.startsWith("/")) {
    return true
  }

  return Boolean(findEmbeddableSite(targetUrl))
}

function getFaviconUrl(targetUrl: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(targetUrl)}`
}

function getLaunchReason(targetUrl: string): LaunchReason {
  if (targetUrl.startsWith("mailto:")) {
    return "email"
  }

  if (targetUrl.startsWith(GOOGLE_SEARCH_PREFIX)) {
    return "search"
  }

  return "blocked"
}

function getTabLabel(view: BrowserView, targetUrl: string) {
  if (view.kind === "home") {
    return "Start Page"
  }

  if (targetUrl.startsWith("mailto:")) {
    return "Mail"
  }

  if (targetUrl.startsWith("/")) {
    return "Local File"
  }

  const matchingSite = findEmbeddableSite(targetUrl)

  if (matchingSite) {
    return matchingSite.title
  }

  const hostname = getHostname(targetUrl)
  return hostname ? hostname.replace(/^www\./, "") : targetUrl
}

function getLaunchDescription(reason: LaunchReason) {
  if (reason === "email") {
    return "Mail links are handed off to your default mail app."
  }

  if (reason === "search") {
    return "Search results are opened in your real browser because Google pages are not part of the in-app allowlist."
  }

  return "This site is not on the verified embed allowlist, so Safari sends it to your real browser instead."
}

function SiteIcon({ title, url }: { title: string; url: string }) {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-800/70 ring-1 ring-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform duration-200 group-hover:scale-105">
      {hasError ? (
        <span className="text-lg font-semibold text-white">{title.charAt(0)}</span>
      ) : (
        <img
          src={getFaviconUrl(url)}
          alt={`${title} favicon`}
          className="h-9 w-9 object-contain"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}

export default function Safari({ isDarkMode = true }: SafariProps) {
  const initialEntry: NavigationEntry = { url: START_PAGE, view: { kind: "home" } }
  const [url, setUrl] = useState(START_PAGE)
  const [addressValue, setAddressValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [view, setView] = useState<BrowserView>({ kind: "home" })
  const [navigation, setNavigation] = useState<NavigationEntry[]>([initialEntry])
  const [navigationIndex, setNavigationIndex] = useState(0)
  const [frameReloadKey, setFrameReloadKey] = useState(0)
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const checkWifiStatus = (nextValue?: boolean) => {
      if (typeof nextValue === "boolean") {
        setWifiEnabled(nextValue)
        return
      }

      const status = localStorage.getItem("wifiEnabled")
      setWifiEnabled(status === null ? true : status === "true")
    }

    checkWifiStatus()

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "wifiEnabled") {
        return
      }

      checkWifiStatus(event.newValue === null ? undefined : event.newValue === "true")
    }

    const handleWifiStateChange = (event: Event) => {
      const nextValue = "detail" in event && typeof event.detail === "boolean" ? event.detail : undefined
      checkWifiStatus(nextValue)
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("wifi-state-change", handleWifiStateChange)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("wifi-state-change", handleWifiStateChange)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current)
      }
    }
  }, [])

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const toolbarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-gray-200"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const mutedText = isDarkMode ? "text-gray-400" : "text-gray-500"

  const startLoading = (duration = 600) => {
    setIsLoading(true)

    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }

    loadTimeoutRef.current = setTimeout(() => {
      setIsLoading(false)
    }, duration)
  }

  const stopLoading = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current)
    }

    setIsLoading(false)
  }

  const applyEntry = (entry: NavigationEntry) => {
    setUrl(entry.url)
    setView(entry.view)
    setAddressValue(entry.url === START_PAGE ? "" : entry.url)

    if (entry.view.kind === "embedded") {
      setFrameReloadKey((current) => current + 1)
    }
  }

  const pushEntry = (entry: NavigationEntry) => {
    const nextEntries = [...navigation.slice(0, navigationIndex + 1), entry]
    setNavigation(nextEntries)
    setNavigationIndex(nextEntries.length - 1)
    applyEntry(entry)
  }

  const openRealBrowser = (targetUrl: string) => {
    if (targetUrl.startsWith("mailto:")) {
      window.location.href = targetUrl
      return
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer")
  }

  const openHome = () => {
    startLoading(300)
    pushEntry(initialEntry)
  }

  const openEmbeddedUrl = (targetUrl: string) => {
    startLoading(5000)
    pushEntry({ url: targetUrl, view: { kind: "embedded" } })
  }

  const openExternalUrl = (targetUrl: string) => {
    startLoading(450)
    pushEntry({ url: targetUrl, view: { kind: "external", reason: getLaunchReason(targetUrl) } })
    openRealBrowser(targetUrl)
  }

  const visitUrl = (rawValue: string) => {
    const normalizedUrl = normalizeUrl(rawValue)

    if (normalizedUrl === START_PAGE) {
      openHome()
      return
    }

    if (normalizedUrl.startsWith(GOOGLE_SEARCH_PREFIX)) {
      openRealBrowser(normalizedUrl)
      setAddressValue(rawValue.trim())
      return
    }

    if (canEmbedUrl(normalizedUrl)) {
      openEmbeddedUrl(normalizedUrl)
      return
    }

    openExternalUrl(normalizedUrl)
  }

  const goBack = () => {
    if (navigationIndex === 0) {
      return
    }

    const nextIndex = navigationIndex - 1
    const entry = navigation[nextIndex]
    setNavigationIndex(nextIndex)
    startLoading(entry.view.kind === "embedded" ? 5000 : 450)
    applyEntry(entry)
  }

  const goForward = () => {
    if (navigationIndex >= navigation.length - 1) {
      return
    }

    const nextIndex = navigationIndex + 1
    const entry = navigation[nextIndex]
    setNavigationIndex(nextIndex)
    startLoading(entry.view.kind === "embedded" ? 5000 : 450)
    applyEntry(entry)
  }

  const handleRefresh = () => {
    if (view.kind === "home") {
      openHome()
      return
    }

    if (view.kind === "embedded") {
      startLoading(5000)
      setFrameReloadKey((current) => current + 1)
      return
    }

    openRealBrowser(url)
    startLoading(450)
  }

  const NoInternetView = () => (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
        <Wifi className={`h-12 w-12 ${isDarkMode ? "text-gray-600" : "text-gray-500"}`} />
      </div>
      <h2 className={`mb-2 text-xl font-semibold ${textColor}`}>You Are Not Connected to the Internet</h2>
      <p className={`mb-6 max-w-md text-center ${mutedText}`}>
        Safari needs a live connection before it can load embedded pages or hand blocked sites off to your real browser.
      </p>
      <button
        className={`rounded px-4 py-2 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white`}
        onClick={handleRefresh}
      >
        Try Again
      </button>
    </div>
  )

  const HomeView = () => (
    <div className="relative h-full overflow-auto">
      <div className="absolute inset-0">
        <img src="/image.jpg" alt="Safari start page background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(4,10,24,0.18),rgba(4,10,24,0.58))]" />
      </div>

      <div className="relative flex min-h-full flex-col px-5 pb-8 pt-8 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 sm:gap-x-8 md:gap-x-10">
            {EMBEDDABLE_SITES.map((site) => (
              <button
                key={site.title}
                className="group flex w-24 flex-col items-center text-center sm:w-28"
                onClick={() => visitUrl(site.url)}
              >
                <SiteIcon title={site.title} url={site.url} />
                <span className="mt-3 line-clamp-2 text-sm font-medium text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
                  {site.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const EmbeddedView = () => (
    <div className="relative h-full bg-white">
      {isLoading && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-black/70 px-4 py-3 text-sm text-white backdrop-blur-md">
          <div className="flex items-center gap-2">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <span>Loading {getTabLabel(view, url)}...</span>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/20" onClick={() => openRealBrowser(url)}>
            <ExternalLink className="h-4 w-4" />
            Open Outside
          </button>
        </div>
      )}

      <iframe
        key={`${frameReloadKey}:${url}`}
        src={url}
        title={getTabLabel(view, url)}
        className="h-full w-full border-0 bg-white"
        onLoad={stopLoading}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )

  const ExternalView = () => (
    <div className="p-8">
      <div className={`mx-auto max-w-3xl rounded-3xl border p-6 md:p-8 ${isDarkMode ? "border-gray-700 bg-gray-900/85" : "border-gray-200 bg-white/90"}`}>
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <Compass className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Opened in your real browser</h2>
            <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
              {getLaunchDescription(view.kind === "external" ? view.reason : "blocked")}
            </p>
          </div>
        </div>

        <div className={`mt-6 rounded-2xl ${inputBg} px-4 py-4 text-sm break-all`}>{url}</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
            onClick={() => openRealBrowser(url)}
          >
            <ExternalLink className="h-4 w-4" />
            Open Again
          </button>
          <button
            className={`rounded-xl px-4 py-3 text-sm font-medium ${isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={openHome}
          >
            Back to Start Page
          </button>
        </div>

        <div className={`mt-8 rounded-2xl border p-5 ${isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
          <h3 className="text-lg font-semibold">Why did this leave Safari?</h3>
          <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
            This URL is not on the verified allowlist for in-window browsing. That keeps Safari honest instead of pretending a
            blocked site is loading inside the app.
          </p>
        </div>
      </div>
    </div>
  )

  const canGoBack = navigationIndex > 0
  const canGoForward = navigationIndex < navigation.length - 1
  const currentTabLabel = getTabLabel(view, url)

  return (
    <div className={`flex h-full flex-col ${bgColor} ${textColor}`}>
      <div className={`${toolbarBg} flex items-center space-x-2 border-b ${borderColor} p-2`}>
        <button
          className={`rounded p-1 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${!canGoBack ? "cursor-not-allowed opacity-40" : ""}`}
          disabled={!canGoBack}
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          className={`rounded p-1 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} ${!canGoForward ? "cursor-not-allowed opacity-40" : ""}`}
          disabled={!canGoForward}
          onClick={goForward}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <button className={`rounded p-1 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`} onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button className={`rounded p-1 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`} onClick={openHome}>
          <Home className="h-4 w-4" />
        </button>

        <div className={`flex flex-1 items-center rounded px-3 py-1 ${inputBg}`}>
          <Search className="mr-2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={addressValue}
            placeholder="Search Safari or enter an address"
            onChange={(e) => setAddressValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                visitUrl(addressValue)
              }
            }}
            className={`w-full bg-transparent text-sm focus:outline-none ${textColor}`}
          />
        </div>

        <button className={`rounded p-1 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Star className="h-4 w-4" />
        </button>
      </div>

      <div className={`${toolbarBg} flex items-center border-b ${borderColor} px-2`}>
        <div className={`flex items-center rounded-t px-3 py-1 text-sm ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
          <Globe className={`mr-2 h-3.5 w-3.5 ${mutedText}`} />
          <span className="mr-2 max-w-48 truncate">{currentTabLabel}</span>
          <button className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-500" onClick={openHome}>
            <span className="text-xs">×</span>
          </button>
        </div>
        <button className={`rounded p-1 ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`} onClick={openHome}>
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {!wifiEnabled ? <NoInternetView /> : view.kind === "home" ? <HomeView /> : view.kind === "embedded" ? <EmbeddedView /> : <ExternalView />}
      </div>
    </div>
  )
}
