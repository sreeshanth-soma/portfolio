"use client"

import { useState, useEffect } from "react"
import { Wifi, Bluetooth, Moon, Sun, Volume2, VolumeX, Maximize, Music } from "lucide-react"

interface ControlCenterProps {
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  brightness: number
  onBrightnessChange: (value: number) => void
}

export default function ControlCenter({
  onClose: _onClose,
  isDarkMode,
  onToggleDarkMode,
  brightness,
  onBrightnessChange,
}: ControlCenterProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [volume, setVolume] = useState(75)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    setIsFullscreen(!!document.fullscreenElement)

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "wifiEnabled" && event.newValue !== null) {
        setWifiEnabled(event.newValue === "true")
      }
    }

    const handleWifiStateChange = (event: Event) => {
      if ("detail" in event && typeof event.detail === "boolean") {
        setWifiEnabled(event.detail)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    window.addEventListener("storage", handleStorage)
    window.addEventListener("wifi-state-change", handleWifiStateChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("wifi-state-change", handleWifiStateChange)
    }
  }, [])

  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
    window.dispatchEvent(new CustomEvent("wifi-state-change", { detail: newState }))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const glassClass = isDarkMode ? "liquid-glass" : "liquid-glass-light"
  const moduleClass = isDarkMode ? "liquid-glass-module" : "liquid-glass-module-light"
  const textClass = isDarkMode ? "text-white" : "text-gray-800"
  const subtextClass = isDarkMode ? "text-white/60" : "text-gray-500"
  const sliderClass = isDarkMode ? "liquid-slider" : "liquid-slider liquid-slider-light"

  return (
    <div
      className={`fixed top-9 right-4 w-80 ${glassClass} rounded-3xl overflow-hidden z-40`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 space-y-3">
        {/* Connectivity Group - Wi-Fi & Bluetooth */}
        <div className={`${moduleClass} p-3`}>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                wifiEnabled ? "liquid-glass-active text-white" : isDarkMode ? "bg-white/5 text-white" : "bg-black/5 text-gray-700"
              }`}
              onClick={toggleWifi}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                wifiEnabled ? "bg-white/20" : isDarkMode ? "bg-white/10" : "bg-black/10"
              }`}>
                <Wifi className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium">Wi-Fi</div>
                <div className={`text-[10px] ${wifiEnabled ? "text-white/70" : subtextClass}`}>
                  {wifiEnabled ? "Home" : "Off"}
                </div>
              </div>
            </button>

            <button
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                bluetoothEnabled ? "liquid-glass-active text-white" : isDarkMode ? "bg-white/5 text-white" : "bg-black/5 text-gray-700"
              }`}
              onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bluetoothEnabled ? "bg-white/20" : isDarkMode ? "bg-white/10" : "bg-black/10"
              }`}>
                <Bluetooth className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium">Bluetooth</div>
                <div className={`text-[10px] ${bluetoothEnabled ? "text-white/70" : subtextClass}`}>
                  {bluetoothEnabled ? "On" : "Off"}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Focus, Dark Mode, Fullscreen Row */}
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`${moduleClass} flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
            onClick={onToggleDarkMode}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              isDarkMode ? "bg-indigo-500/60" : "bg-orange-400/40"
            }`}>
              {isDarkMode ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-orange-600" />}
            </div>
            <span className="text-[10px] font-medium">{isDarkMode ? "Dark" : "Light"}</span>
          </button>

          <button
            className={`${moduleClass} flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
            onClick={toggleFullscreen}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              isFullscreen ? "bg-green-500/60" : isDarkMode ? "bg-white/10" : "bg-black/10"
            }`}>
              <Maximize className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>

          <button
            className={`${moduleClass} flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
              isDarkMode ? "text-white" : "text-gray-700"
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              isDarkMode ? "bg-white/10" : "bg-black/10"
            }`}>
              <Music className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium">Music</span>
          </button>
        </div>

        {/* Display Slider */}
        <div className={`${moduleClass} p-4`}>
          <div className={`flex items-center justify-between mb-3 ${textClass}`}>
            <span className="text-sm font-medium">Display</span>
          </div>
          <div className="flex items-center gap-3">
            <Sun className={`w-4 h-4 ${subtextClass} shrink-0`} />
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => onBrightnessChange(Number.parseInt(e.target.value))}
              className={`flex-1 ${sliderClass} cursor-pointer`}
            />
            <Sun className={`w-5 h-5 ${textClass} shrink-0`} />
          </div>
        </div>

        {/* Sound Slider */}
        <div className={`${moduleClass} p-4`}>
          <div className={`flex items-center justify-between mb-3 ${textClass}`}>
            <span className="text-sm font-medium">Sound</span>
          </div>
          <div className="flex items-center gap-3">
            <VolumeX className={`w-4 h-4 ${subtextClass} shrink-0`} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number.parseInt(e.target.value))}
              className={`flex-1 ${sliderClass} cursor-pointer`}
            />
            <Volume2 className={`w-5 h-5 ${textClass} shrink-0`} />
          </div>
        </div>
      </div>
    </div>
  )
}
