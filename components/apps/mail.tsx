"use client"

import { useEffect } from "react"
import { Mail } from "lucide-react"

interface MailProps {
  isDarkMode?: boolean
}

const RECIPIENT_EMAIL = "sreeshanthsoma@gmail.com"

export default function MailApp({ isDarkMode = true }: MailProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  const openComposeTab = () => {
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(RECIPIENT_EMAIL)}`
    const openedWindow = window.open(gmailComposeUrl, "_blank", "noopener,noreferrer")

    if (!openedWindow) {
      window.location.href = `mailto:${RECIPIENT_EMAIL}`
    }
  }

  // Open a browser compose tab when the app is opened.
  useEffect(() => {
    openComposeTab()
  }, [])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center max-w-md">
        <Mail className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Opening Mail...</h2>
        <p className="text-sm opacity-80">Opening a new compose tab addressed to {RECIPIENT_EMAIL}</p>
        <button
          type="button"
          onClick={openComposeTab}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
        >
          Open Compose Again
        </button>
      </div>
    </div>
  )
}
