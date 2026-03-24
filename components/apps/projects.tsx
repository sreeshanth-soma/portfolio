"use client"

import { useState } from "react"
import { Folder, ExternalLink, ChevronRight, ArrowLeft, LayoutGrid, List, Github } from "lucide-react"

interface ProjectsProps {
  isDarkMode?: boolean
}

const projects = [
  {
    id: 1,
    name: "Alephra",
    description: "AI-powered healthcare assistant for medical report analysis. Integrates Gemini for contextual Q&A and structured clinical insights. Reduced TTS latency by 62% (20s to 7.7s) through asynchronous processing, dedicated embeddings server, and voice-level caching. Implements vector-based semantic retrieval using Pinecone for medical document search, supporting multilingual voice interaction in 10+ Indian languages.",
    tech: ["Next.js 14", "TypeScript", "Gemini API", "Pinecone", "Prisma", "PostgreSQL"],
    url: "https://alephra.com",
    github: "https://github.com/sreeshanth-soma/Alephra",
    icon: "🏥",
    color: "bg-emerald-500",
  },
  {
    id: 2,
    name: "macOS Portfolio",
    description: "Interactive macOS-style portfolio website with window management, dock, and multiple apps including Safari, Terminal, Notes, Calculator, and more.",
    tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS"],
    url: "https://sreeshanthsoma.dev",
    github: "https://github.com/sreeshanth-soma/portfolio",
    icon: "🖥️",
    color: "bg-blue-500",
  },
]

export default function Projects({ isDarkMode = true }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const subtextColor = isDarkMode ? "text-gray-400" : "text-gray-500"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-50"
  const cardHover = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
  const tagBg = isDarkMode ? "bg-gray-700" : "bg-gray-200"

  return (
    <div className={`h-full flex ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`w-52 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className={`p-3 border-b ${borderColor}`}>
          <h2 className="font-medium text-sm">Finder</h2>
        </div>
        <div className="p-2">
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <Folder className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Projects</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`flex items-center justify-between px-4 py-2 border-b ${borderColor}`}>
          <div className="flex items-center gap-2">
            {selectedProject && (
              <button
                onClick={() => setSelectedProject(null)}
                className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="text-sm font-medium">
              {selectedProject ? selectedProject.name : "Projects"}
            </span>
          </div>
          {!selectedProject && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded ${viewMode === "grid" ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded ${viewMode === "list" ? (isDarkMode ? "bg-gray-700" : "bg-gray-200") : ""}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {selectedProject ? (
            /* Project Detail View */
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 ${selectedProject.color} rounded-2xl flex items-center justify-center text-3xl`}>
                  {selectedProject.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                  <div className="flex gap-2 mt-1">
                    {selectedProject.tech.map((t) => (
                      <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${tagBg} ${subtextColor}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className={`text-sm leading-relaxed mb-6 ${subtextColor}`}>
                {selectedProject.description}
              </p>

              <div className="flex gap-3">
                {selectedProject.url && (
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${cardBg} ${cardHover} transition-colors`}
                  >
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`${cardBg} ${cardHover} rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={`w-12 h-12 ${project.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                    {project.icon}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{project.name}</h3>
                  <p className={`text-xs ${subtextColor} line-clamp-2`}>{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded ${tagBg} ${subtextColor}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-1">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${cardHover} transition-colors`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className={`w-8 h-8 ${project.color} rounded-lg flex items-center justify-center text-lg shrink-0`}>
                    {project.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{project.name}</h3>
                    <p className={`text-xs ${subtextColor} truncate`}>{project.description}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${subtextColor} shrink-0`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
