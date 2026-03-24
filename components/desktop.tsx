"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Dock from "@/components/dock"
import Menubar from "@/components/menubar"
import Wallpaper from "@/components/wallpaper"
import Window from "@/components/window"
import Launchpad from "@/components/launchpad"
import ControlCenter from "@/components/control-center"
import Spotlight from "@/components/spotlight"
import { getDefaultWindowFrame } from "@/lib/window-frame"
import type { AppWindow } from "@/types"

interface DesktopProps {
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  initialDarkMode: boolean
  onToggleDarkMode: () => void
  initialBrightness: number
  onBrightnessChange: (value: number) => void
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: DesktopProps) {
  const [time, setTime] = useState(new Date())
  const [openWindows, setOpenWindows] = useState<AppWindow[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showControlCenter, setShowControlCenter] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode)
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness)
  const desktopRef = useRef<HTMLDivElement>(null)
  const openWindowsRef = useRef<AppWindow[]>([])
  const activeWindowIdRef = useRef<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // No default app opening to avoid duplicate key issues

    return () => clearInterval(timer)
  }, [])

  // Update local state when props change
  useEffect(() => {
    setIsDarkMode(initialDarkMode)
  }, [initialDarkMode])

  useEffect(() => {
    setScreenBrightness(initialBrightness)
  }, [initialBrightness])

  useEffect(() => {
    openWindowsRef.current = openWindows
  }, [openWindows])

  useEffect(() => {
    activeWindowIdRef.current = activeWindowId
  }, [activeWindowId])

  const openApp = (app: AppWindow) => {
    // Check if app is already open
    const isOpen = openWindowsRef.current.some((window) => window.id === app.id)

    if (!isOpen) {
      const defaultFrame = getDefaultWindowFrame(openWindowsRef.current.length)
      setOpenWindows((prev) => [...prev, { ...app, ...defaultFrame }])
    }

    // Set as active window
    setActiveWindowId(app.id)

    // Close launchpad if open
    if (showLaunchpad) {
      setShowLaunchpad(false)
    }
  }

  const closeWindow = (id: string) => {
    const remainingWindows = openWindowsRef.current.filter((window) => window.id !== id)
    setOpenWindows(remainingWindows)

    // If we closed the active window, set the last window as active
    if (activeWindowIdRef.current === id && remainingWindows.length > 0) {
      setActiveWindowId(remainingWindows[remainingWindows.length - 1].id)
    } else if (remainingWindows.length === 0) {
      setActiveWindowId(null)
    }
  }

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id)
  }

  const toggleLaunchpad = () => {
    setShowLaunchpad(!showLaunchpad)
    if (showControlCenter) setShowControlCenter(false)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleControlCenter = () => {
    setShowControlCenter(!showControlCenter)
    if (showSpotlight) setShowSpotlight(false)
  }

  const toggleSpotlight = () => {
    setShowSpotlight(!showSpotlight)
    if (showControlCenter) setShowControlCenter(false)
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    onToggleDarkMode()
  }

  const updateBrightness = (value: number) => {
    setScreenBrightness(value)
    onBrightnessChange(value)
  }

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the desktop, not on children
    if (e.target === desktopRef.current) {
      setActiveWindowId(null)
      if (showControlCenter) setShowControlCenter(false)
      if (showSpotlight) setShowSpotlight(false)
    }
  }

  return (
    <div className="relative">
      <div
        ref={desktopRef}
        className={`relative h-screen w-screen overflow-hidden ${isDarkMode ? "dark" : ""}`}
        onClick={handleDesktopClick}
      >
        <Wallpaper isDarkMode={isDarkMode} />

        <Menubar
          time={time}
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
          isDarkMode={isDarkMode}
          activeWindow={activeWindowId ? openWindows.find((w) => w.id === activeWindowId) || null : null}
        />

        {/* Desktop Shortcuts */}
        <div className="absolute top-10 right-6 flex flex-col items-center gap-5 z-10">
          {[
            { id: "resume", title: "Resume", icon: "/preview.svg", component: "Resume" },
            { id: "projects", title: "Projects", icon: "/finder.svg", component: "Projects" },
            { id: "github", title: "GitHub", icon: "/github-icon.svg", component: "GitHub" },
          ].map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center gap-1 cursor-pointer group"
              onDoubleClick={() =>
                openApp({
                  id: app.id,
                  title: app.title,
                  component: app.component,
                  position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
                  size: { width: 800, height: 600 },
                })
              }
            >
              <img
                src={app.icon}
                alt={app.title}
                className="w-16 h-16 rounded-[22%] group-hover:scale-110 transition-transform drop-shadow-lg"
                draggable="false"
              />
              <span className="text-white text-xs font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                {app.title}
              </span>
            </div>
          ))}
        </div>

        {/* Windows */}
        <div className="absolute inset-0 pt-6 pb-16">
          {openWindows.map((window) => (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindowId === window.id}
              onClose={() => closeWindow(window.id)}
              onFocus={() => setActiveWindow(window.id)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* Launchpad */}
        {showLaunchpad && <Launchpad onAppClick={openApp} onClose={() => setShowLaunchpad(false)} />}

        {/* Control Center */}
        {showControlCenter && (
          <div className="fixed inset-0 z-40" onClick={() => setShowControlCenter(false)}>
            <ControlCenter
              onClose={() => setShowControlCenter(false)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              brightness={screenBrightness}
              onBrightnessChange={updateBrightness}
            />
          </div>
        )}

        {/* Spotlight */}
        {showSpotlight && <Spotlight onClose={() => setShowSpotlight(false)} onAppClick={openApp} />}

        <Dock
          onAppClick={openApp}
          onLaunchpadClick={toggleLaunchpad}
          activeAppIds={openWindows.map((w) => w.id)}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Brightness overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  )
}
