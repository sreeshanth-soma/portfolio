import type { AppWindow } from "@/types"

const MENUBAR_HEIGHT = 26
const DOCK_HEIGHT = 84
const EDGE_MARGIN = 24

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function getDefaultWindowFrame(openWindowCount = 0): Pick<AppWindow, "position" | "size"> {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const availableHeight = viewportHeight - MENUBAR_HEIGHT - DOCK_HEIGHT

  const WIDGET_WIDTH = 280 // left widget column + gap
  const RIGHT_ICONS = 100 // right desktop shortcuts
  const usableWidth = viewportWidth - WIDGET_WIDTH - RIGHT_ICONS

  const width = Math.max(600, Math.round(usableWidth * 0.92))
  const height = Math.max(400, Math.round(availableHeight * 0.93))

  const cascadeOffset = Math.min(openWindowCount, 4) * 28

  // Center window in the space between widgets and right icons
  const x = Math.round(WIDGET_WIDTH + (usableWidth - width) / 2) + cascadeOffset
  const y = Math.round(MENUBAR_HEIGHT + (availableHeight - height) / 2) + cascadeOffset

  return {
    position: { x, y },
    size: { width, height },
  }
}
