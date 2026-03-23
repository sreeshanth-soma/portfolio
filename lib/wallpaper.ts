export const WALLPAPER_STORAGE_KEY = "wallpaperPreference"
export const WALLPAPER_CHANGE_EVENT = "wallpaperchange"

export type WallpaperPreference = "classic" | "coast" | "live"

type WallpaperOption = {
  id: WallpaperPreference
  label: string
  description: string
  preview: string
}

export const DEFAULT_WALLPAPER: WallpaperPreference = "classic"

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: "classic",
    label: "Classic Cliffs",
    description: "The original still wallpaper for light and dark mode.",
    preview: "/wallpaper-day.jpg",
  },
  {
    id: "coast",
    label: "Rose Coast",
    description: "A softer built-in wallpaper with a warmer look.",
    preview: "/wallpaper-day2.jpg",
  },
  {
    id: "live",
    label: "Live Video",
    description: "Uses /public/wallpaper-live.mp4 if you add one.",
    preview: "/wallpaper-day2.jpg",
  },
]

export function isWallpaperPreference(value: string | null): value is WallpaperPreference {
  return value === "classic" || value === "coast" || value === "live"
}

export function getWallpaperImage(isDarkMode: boolean, preference: WallpaperPreference) {
  if (preference === "coast") {
    return isDarkMode ? "/wallpaper-night2.jpg" : "/wallpaper-day2.jpg"
  }

  return isDarkMode ? "/wallpaper-night.jpg" : "/wallpaper-day.jpg"
}
