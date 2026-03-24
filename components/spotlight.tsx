"use client"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import type { AppWindow } from "@/types"

const spotlightApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari", category: "Applications" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail", category: "Applications" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode", category: "Applications" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes", category: "Applications" },
  { id: "facetime", title: "FaceTime", icon: "/facetime.png", component: "FaceTime", category: "Applications" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal", category: "Applications" },
  { id: "projects", title: "Projects", icon: "/finder.svg", component: "Projects", category: "Applications" },
  { id: "resume", title: "Resume", icon: "/preview.svg", component: "Resume", category: "Applications" },
  { id: "github", title: "GitHub", icon: "/github-icon.svg", component: "GitHub", category: "Applications" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify", category: "Applications" },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake", category: "Applications" },
  { id: "weather", title: "Weather", icon: "/weather.png", component: "Weather", category: "Applications" },
  { id: "calculator", title: "Calculator", icon: "/calculator.svg", component: "Calculator", category: "Applications", defaultSize: { width: 320, height: 500 } },
]

const categories = ["All", "Applications", "Settings", "Help"]

interface SpotlightProps {
  onClose: () => void
  onAppClick: (app: AppWindow) => void
}

export default function Spotlight({ onClose, onAppClick }: SpotlightProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApps, setFilteredApps] = useState(spotlightApps)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState("All")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < filteredApps.length - 1 ? prev + 1 : prev))
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        e.preventDefault()
      } else if (e.key === "Enter" && filteredApps.length > 0) {
        handleAppClick(filteredApps[selectedIndex])
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredApps, selectedIndex])

  useEffect(() => {
    let filtered = spotlightApps
    if (searchTerm) {
      filtered = filtered.filter((app) => app.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (activeCategory !== "All") {
      filtered = filtered.filter((app) => app.category === activeCategory)
    }
    setFilteredApps(filtered)
    setSelectedIndex(0)
  }, [searchTerm, activeCategory])

  const handleAppClick = (app: (typeof spotlightApps)[0]) => {
    const size = (app as any).defaultSize || { width: 800, height: 600 }
    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
      size,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-start justify-center pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-[680px] bg-gray-800/40 backdrop-blur-[80px] backdrop-saturate-[180%] rounded-2xl overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative border-b border-white/10">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            className="w-full bg-transparent text-white border-0 py-5 pl-14 pr-5 focus:outline-none text-xl placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/10 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/10"
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        {filteredApps.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto py-1.5">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className={`flex items-center px-5 py-3 cursor-pointer mx-1.5 rounded-xl transition-all ${
                  index === selectedIndex
                    ? "bg-blue-500/80 text-white"
                    : "hover:bg-white/10 text-gray-300"
                }`}
                onClick={() => handleAppClick(app)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-9 h-9 flex items-center justify-center mr-4">
                  <img src={app.icon || "/placeholder.svg"} alt={app.title} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{app.title}</span>
                </div>
                <span className={`text-xs ${index === selectedIndex ? "text-white/60" : "text-gray-500"}`}>
                  {app.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {filteredApps.length === 0 && searchTerm && (
          <div className="py-10 text-center text-gray-500 text-sm">
            No results for &ldquo;{searchTerm}&rdquo;
          </div>
        )}
      </div>
    </div>
  )
}
