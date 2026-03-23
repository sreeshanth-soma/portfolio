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
  const maxWidth = Math.max(360, viewportWidth - EDGE_MARGIN * 2)
  const maxHeight = Math.max(320, availableHeight - 12)
  const minWidth = Math.min(980, maxWidth)
  const preferredMaxWidth = Math.min(1320, maxWidth)
  const minHeight = Math.min(780, maxHeight)
  const preferredMaxHeight = Math.min(1080, maxHeight)

  const width = clamp(Math.round(viewportWidth * 0.64), minWidth, preferredMaxWidth)
  const height = clamp(Math.round(availableHeight * 0.87), minHeight, preferredMaxHeight)

  const cascadeOffset = Math.min(openWindowCount, 4) * 28
  const maxX = Math.max(EDGE_MARGIN, viewportWidth - width - EDGE_MARGIN)
  const maxY = Math.max(MENUBAR_HEIGHT + 12, viewportHeight - DOCK_HEIGHT - height - 12)

  const x = clamp(Math.round((viewportWidth - width) * 0.18) + cascadeOffset, EDGE_MARGIN, maxX)
  const y = clamp(Math.round(MENUBAR_HEIGHT + (availableHeight - height) / 2) + cascadeOffset, MENUBAR_HEIGHT + 12, maxY)

  return {
    position: { x, y },
    size: { width, height },
  }
}
