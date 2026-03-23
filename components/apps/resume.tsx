"use client"

import { Download, ExternalLink } from "lucide-react"

interface ResumeProps {
  isDarkMode?: boolean
}

export default function Resume({ isDarkMode = true }: ResumeProps) {
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-200"
  const toolbarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const subtextColor = isDarkMode ? "text-gray-400" : "text-gray-500"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300"

  return (
    <div className={`h-full flex flex-col ${bgColor}`}>
      {/* Toolbar */}
      <div className={`${toolbarBg} border-b ${borderColor} px-4 py-2 flex items-center justify-between`}>
        <span className={`text-sm font-medium ${textColor}`}>resume.pdf</span>
        <div className="flex items-center gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded hover:bg-white/10 ${subtextColor}`}
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="/resume.pdf"
            download
            className={`p-1.5 rounded hover:bg-white/10 ${subtextColor}`}
            title="Download Resume"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* PDF Embed */}
      <div className="flex-1">
        <iframe
          src="/resume.pdf"
          className="w-full h-full border-0"
          title="Resume"
        />
      </div>
    </div>
  )
}
