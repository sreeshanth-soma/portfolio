"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { MoreHorizontal } from "lucide-react"
import type { AppWindow } from "@/types"

const dockApps = [
  { id: "launchpad", title: "Launchpad", icon: "/launchpad.png", component: "Launchpad", isSystem: true },
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  { id: "facetime", title: "FaceTime", icon: "/facetime.png", component: "FaceTime" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal" },
  { id: "projects", title: "Projects", icon: "/finder.svg", component: "Projects" },
  { id: "resume", title: "Resume", icon: "/preview.svg", component: "Resume" },
  { id: "github", title: "GitHub", icon: "/github-icon.svg", component: "GitHub" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify" },
]

interface DockProps {
  onAppClick: (app: AppWindow) => void
  onLaunchpadClick: () => void
  activeAppIds: string[]
  isDarkMode: boolean
}

export default function Dock({ onAppClick, onLaunchpadClick, activeAppIds, isDarkMode }: DockProps) {
  const dockRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLDivElement | null)[]>([])
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([])
  const tooltipRefs = useRef<(HTMLDivElement | null)[]>([])
  const mouseXRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!showMobileMenu) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMobileMenu])

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const visibleApps = isMobile ? dockApps.slice(0, 4) : dockApps
  const hiddenApps = isMobile ? dockApps.slice(4) : []

  const updateIcons = useCallback(() => {
    const dock = dockRef.current
    if (!dock || isMobile) return

    const mouseX = mouseXRef.current
    const dockWidth = dock.offsetWidth
    const iconCount = visibleApps.length
    const iconWidth = dockWidth / iconCount

    for (let i = 0; i < iconCount; i++) {
      const iconEl = iconRefs.current[i]
      const wrapperEl = wrapperRefs.current[i]
      const tooltipEl = tooltipRefs.current[i]

      if (!iconEl || !wrapperEl) continue

      let scale = 1
      if (mouseX !== null) {
        const iconPosition = iconWidth * (i + 0.5)
        const distance = Math.abs(mouseX - iconPosition)
        const maxScale = 1.8
        const maxDistance = iconWidth * 2.5

        if (distance < maxDistance) {
          scale = 1 + (maxScale - 1) * Math.pow(1 - distance / maxDistance, 2)
        }
      }

      const translateY = (scale - 1) * -8
      wrapperEl.style.transform = `translateY(${translateY}px)`
      iconEl.style.transform = `scale(${scale})`

      if (tooltipEl) {
        tooltipEl.style.display = scale > 1.5 ? "block" : "none"
      }
    }
  }, [isMobile, visibleApps.length])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dockRef.current || isMobile) return

    const rect = dockRef.current.getBoundingClientRect()
    mouseXRef.current = e.clientX - rect.left

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(updateIcons)
  }, [isMobile, updateIcons])

  const handleMouseLeave = useCallback(() => {
    mouseXRef.current = null

    // Animate back smoothly
    const icons = iconRefs.current
    const wrappers = wrapperRefs.current
    const tooltips = tooltipRefs.current

    for (let i = 0; i < icons.length; i++) {
      const iconEl = icons[i]
      const wrapperEl = wrappers[i]
      const tooltipEl = tooltips[i]

      if (wrapperEl) {
        wrapperEl.style.transition = "transform 0.2s ease-out"
        wrapperEl.style.transform = "translateY(0px)"
      }
      if (iconEl) {
        iconEl.style.transition = "transform 0.2s ease-out"
        iconEl.style.transform = "scale(1)"
      }
      if (tooltipEl) {
        tooltipEl.style.display = "none"
      }
    }

    // Remove transitions after animation completes
    setTimeout(() => {
      for (let i = 0; i < icons.length; i++) {
        if (wrappers[i]) wrappers[i]!.style.transition = "none"
        if (icons[i]) icons[i]!.style.transition = "none"
      }
    }, 200)
  }, [])

  const handleAppClick = (app: (typeof dockApps)[0]) => {
    if (app.id === "launchpad") {
      onLaunchpadClick()
      return
    }

    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
      size: { width: 800, height: 600 },
    })

    if (showMobileMenu) {
      setShowMobileMenu(false)
    }
  }

  const dockGlass = isDarkMode
    ? "bg-white/10 border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
    : "bg-white/45 border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)]"

  return (
    <div ref={dockRef} className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50">
      {/* Mobile expanded menu */}
      {isMobile && showMobileMenu && (
        <div
          className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[280px]
          ${isDarkMode ? "liquid-glass" : "liquid-glass-light"}
          rounded-2xl p-4 mb-2`}
        >
          <div className="grid grid-cols-4 gap-4">
            {hiddenApps.map((app) => (
              <div
                key={app.id}
                className="flex flex-col items-center justify-center"
                onClick={() => handleAppClick(app)}
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <img
                    src={app.icon || "/placeholder.svg"}
                    alt={app.title}
                    className="w-12 h-12 object-contain"
                    draggable="false"
                  />
                </div>
                <span className={`text-xs mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}>{app.title}</span>
                {activeAppIds.includes(app.id) && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main dock */}
      <div
        className={`px-3 py-2 rounded-2xl backdrop-blur-xl
          ${dockGlass}
          flex items-end
          ${isMobile ? "h-20" : "h-16"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {visibleApps.map((app, index) => (
          <div
            key={app.id}
            ref={(el) => { wrapperRefs.current[index] = el }}
            className={`flex flex-col items-center justify-end h-full ${isMobile ? "px-3" : "px-2"} will-change-transform`}
            style={{ zIndex: 1 }}
            onClick={() => handleAppClick(app)}
          >
            <div
              ref={(el) => { iconRefs.current[index] = el }}
              className="relative cursor-pointer will-change-transform"
              style={{ transformOrigin: "bottom center" }}
            >
              <img
                src={app.icon || "/placeholder.svg"}
                alt={app.title}
                className={`object-contain rounded-[22%] ${isMobile ? "w-14 h-14" : "w-12 h-12"}`}
                draggable="false"
              />

              {/* Tooltip - only on desktop */}
              {!isMobile && (
                <div
                  ref={(el) => { tooltipRefs.current[index] = el }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1
                    bg-black/70 text-white text-[11px] rounded-md whitespace-nowrap pointer-events-none"
                  style={{ display: "none" }}
                >
                  {app.title}
                </div>
              )}

              {/* Indicator dot for active apps */}
              {activeAppIds.includes(app.id) && (
                <div className={`absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                  isDarkMode ? "bg-white" : "bg-gray-600"
                }`}></div>
              )}
            </div>
          </div>
        ))}

        {/* More button for mobile */}
        {isMobile && (
          <div
            className="flex flex-col items-center justify-end h-full px-3"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <div className="relative cursor-pointer">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all
                ${showMobileMenu
                  ? "bg-blue-500/60"
                  : isDarkMode ? "bg-white/10" : "bg-black/10"
                }`}
              >
                <MoreHorizontal className={`w-8 h-8 ${isDarkMode ? "text-white" : "text-gray-800"}`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
