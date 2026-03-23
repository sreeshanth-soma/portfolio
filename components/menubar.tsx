"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { AppleIcon } from "@/components/icons"

interface MenubarProps {
  time: Date
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  onSpotlightClick: () => void
  onControlCenterClick: () => void
  isDarkMode: boolean
  activeWindow: { id: string; title: string } | null
}

export default function Menubar({
  time,
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  onSpotlightClick,
  onControlCenterClick,
  isDarkMode,
  activeWindow,
}: MenubarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isCharging, setIsCharging] = useState(false)
  const [showWifiToggle, setShowWifiToggle] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const wifiRef = useRef<HTMLDivElement>(null)

  const formattedTime = time.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  useEffect(() => {
    if ("getBattery" in navigator) {
      // @ts-ignore - getBattery is not in the standard navigator type
      navigator
        .getBattery()
        .then((battery: any) => {
          updateBatteryStatus(battery)
          battery.addEventListener("levelchange", () => updateBatteryStatus(battery))
          battery.addEventListener("chargingchange", () => updateBatteryStatus(battery))
        })
        .catch(() => {
          setBatteryLevel(100)
          setIsCharging(false)
        })
    }

    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }

      if (
        wifiRef.current &&
        !wifiRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".wifi-icon")
      ) {
        setShowWifiToggle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const updateBatteryStatus = (battery: any) => {
    setBatteryLevel(Math.round(battery.level * 100))
    setIsCharging(battery.charging)
  }

  const toggleMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null)
    } else {
      setActiveMenu(menuName)
    }
  }

  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
  }

  const toggleWifiPopup = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowWifiToggle(!showWifiToggle)
  }

  const textClass = isDarkMode ? "text-white" : "text-gray-800"

  const menuBarStyle = isDarkMode
    ? "bg-black/30 backdrop-blur-[40px] border-b border-white/5"
    : "bg-white/25 backdrop-blur-[40px] border-b border-white/30"

  const dropdownClass = isDarkMode
    ? "liquid-glass rounded-2xl shadow-2xl"
    : "liquid-glass-light rounded-2xl shadow-2xl"

  const hoverClass = isDarkMode
    ? "hover:bg-white/10 rounded-lg"
    : "hover:bg-black/5 rounded-lg"

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 h-7 ${menuBarStyle} z-50 flex items-center px-4 ${textClass} text-[13px]`}
    >
      <div className="flex-1 flex items-center">
        <button
          className={`flex items-center mr-4 ${hoverClass} px-2 py-0.5`}
          onClick={() => toggleMenu("apple")}
        >
          <AppleIcon className="w-4 h-4" />
        </button>

        {activeMenu === "apple" && (
          <div className={`absolute top-7 left-2 ${dropdownClass} ${textClass} py-2 w-56`}>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }}>
              About This Mac
            </button>
            <div className={`border-t ${isDarkMode ? "border-white/10" : "border-black/10"} my-1.5 mx-3`}></div>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }}>
              System Settings...
            </button>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }}>
              App Store...
            </button>
            <div className={`border-t ${isDarkMode ? "border-white/10" : "border-black/10"} my-1.5 mx-3`}></div>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }} onClick={onSleep}>
              Sleep
            </button>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }} onClick={onRestart}>
              Restart...
            </button>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }} onClick={onShutdown}>
              Shut Down...
            </button>
            <div className={`border-t ${isDarkMode ? "border-white/10" : "border-black/10"} my-1.5 mx-3`}></div>
            <button className={`w-full text-left px-4 py-1.5 ${hoverClass} mx-1`} style={{ width: "calc(100% - 8px)" }} onClick={onLogout}>
              Log Out Sreeshanth...
            </button>
          </div>
        )}

        {activeWindow && (
          <button
            className={`mr-4 font-medium ${hoverClass} px-2 py-0.5 ${activeMenu === "app" ? (isDarkMode ? "bg-white/10" : "bg-black/5") : ""}`}
            onClick={() => toggleMenu("app")}
          >
            {activeWindow.title}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <span className="mr-1 text-xs">{batteryLevel}%</span>
        <div className="relative">
          <div className="w-6 h-3 border border-current rounded-sm relative">
            <div className="absolute top-0 left-0 bottom-0 bg-current rounded-sm" style={{ width: `${batteryLevel}%` }}></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-current rounded-r-sm"></div>
            {isCharging && <div className="absolute inset-0 flex items-center justify-center text-xs">⚡</div>}
          </div>
        </div>

        <div className="relative">
          <button className="wifi-icon" onClick={toggleWifiPopup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              {wifiEnabled ? (
                <>
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" />
                </>
              ) : (
                <>
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" />
                </>
              )}
            </svg>
          </button>

          {showWifiToggle && (
            <div
              ref={wifiRef}
              className={`absolute top-7 right-0 ${dropdownClass} ${textClass} py-3 px-4 w-64`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">Wi-Fi</span>
                <button
                  onClick={toggleWifi}
                  className={`liquid-toggle ${wifiEnabled ? "active" : ""}`}
                />
              </div>
            </div>
          )}
        </div>

        <button onClick={onSpotlightClick} className={`${hoverClass} p-1`}>
          <Search className="w-3.5 h-3.5" />
        </button>

        <button onClick={onControlCenterClick} className={`flex items-center justify-center ${hoverClass} p-1`}>
          <img
            src="/control-center-icon.webp"
            alt="Control Center"
            className="w-3.5 h-3.5"
            style={{
              filter: isDarkMode ? "invert(1)" : "none",
              opacity: 0.9,
            }}
          />
        </button>

        <span className="text-xs">{formattedTime}</span>
      </div>
    </div>
  )
}
