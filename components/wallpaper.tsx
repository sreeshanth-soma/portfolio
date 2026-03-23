"use client"

import { useEffect, useState } from "react"
import {
  DEFAULT_WALLPAPER,
  getWallpaperImage,
  isWallpaperPreference,
  WALLPAPER_CHANGE_EVENT,
  WALLPAPER_STORAGE_KEY,
  type WallpaperPreference,
} from "@/lib/wallpaper"

interface WallpaperProps {
  isDarkMode: boolean
}

export default function Wallpaper({ isDarkMode }: WallpaperProps) {
  const [preference, setPreference] = useState<WallpaperPreference>(DEFAULT_WALLPAPER)
  const [videoUnavailable, setVideoUnavailable] = useState(false)

  useEffect(() => {
    const syncWallpaperPreference = () => {
      const storedPreference = localStorage.getItem(WALLPAPER_STORAGE_KEY)

      if (isWallpaperPreference(storedPreference)) {
        setPreference(storedPreference)
        return
      }

      setPreference(DEFAULT_WALLPAPER)
    }

    syncWallpaperPreference()
    window.addEventListener("storage", syncWallpaperPreference)
    window.addEventListener(WALLPAPER_CHANGE_EVENT, syncWallpaperPreference as EventListener)

    return () => {
      window.removeEventListener("storage", syncWallpaperPreference)
      window.removeEventListener(WALLPAPER_CHANGE_EVENT, syncWallpaperPreference as EventListener)
    }
  }, [])

  useEffect(() => {
    setVideoUnavailable(false)
  }, [preference])

  const fallbackImage = getWallpaperImage(isDarkMode, preference)
  const showLiveVideo = preference === "live" && !videoUnavailable

  return (
    <div className="absolute inset-0 overflow-hidden">
      {showLiveVideo ? (
        <video
          key={preference}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={fallbackImage}
          onError={() => setVideoUnavailable(true)}
        >
          <source src="/wallpaper-live.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url('${fallbackImage}')`,
          }}
        />
      )}
    </div>
  )
}
