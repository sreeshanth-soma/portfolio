"use client"

import type React from "react"

import { useState } from "react"

interface NotesProps {
  isDarkMode?: boolean
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "About Me",
      content: `# Sreeshanth Soma
SDE & AI Systems Engineer

Engineering student building production-grade AI systems and backend infrastructure. Experienced in cloud deployment, agile open source collaboration, and CI/CD-oriented development with measurable outcomes.

## Contact
Email: sreeshanthsoma@gmail.com
Phone: (+91) 79956 48818
LinkedIn: sreeshanth-soma
GitHub: sreeshanth-soma
Location: Hyderabad, India`,
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      title: "Experience",
      content: `# Experience

## Saryps Labs Private Limited
SDE | Feb 2025 - Present, Hyderabad

AI Voice Cloning Platform (Azure)
- Built backend APIs for audio upload, voice profile management, and TTS synthesis using Azure Custom Neural Voice, supporting voice cloning from 10-second samples across 6 languages (English + 5 Indic).
- Containerized backend services using Docker and deployed to Azure with autoscaling configuration.
- Worked on a multilingual data model to store and retrieve voice profiles, project metadata, and generated audio assets across the platform.

## OpenBroadcaster (Open Source)
SDE Intern | Feb 2026 - Present, Remote

- Contributed 10+ merged PRs to a production broadcast automation platform used by community radio stations globally, spanning model, controller, UI, and database migration layers.
- Implemented advanced search features including OR grouping, shared saved searches with permission-based access control, never-broadcasted filter, and date-range filters.
- Designing a k6-based API stress testing framework simulating 10, 100, and 1000 concurrent users with automated threshold alerts and baseline comparison.
- Collaborating with a distributed core team in Canada in an agile open source workflow.`,
      date: "Today, 10:15 AM",
    },
    {
      id: 3,
      title: "Skills",
      content: `# Technical Skills

## Languages
Python, TypeScript, JavaScript, C++

## Backend
Django, REST APIs, WebSockets, PostgreSQL, MySQL, Prisma

## AI Systems
Gemini API, RAG, Semantic Search

## Vector DB
Pinecone

## Cloud
Azure (Containers, Blob), AWS, GCP

## DevOps
Docker, CI/CD, Vercel, Render

## Frontend
Next.js, React, Tailwind CSS

## Tools
Git, GitHub Actions, Postman, VS Code`,
      date: "Today, 10:00 AM",
    },
    {
      id: 4,
      title: "Projects",
      content: `# Projects

## Alephra - AI-Powered Healthcare Assistant
Next.js 14, TypeScript, Gemini API, Pinecone, Prisma, PostgreSQL

- Developed a conversational AI platform for medical report analysis integrating Gemini for contextual Q&A and structured clinical insights.
- Reduced TTS latency by 62% (20s -> 7.7s) through asynchronous processing, dedicated embeddings server, and voice-level caching; implemented fallback handling for service resilience.
- Implemented vector-based semantic retrieval using Pinecone for medical document search, supporting multilingual voice interaction (10+ Indian languages).`,
      date: "Yesterday, 3:15 PM",
    },
    {
      id: 5,
      title: "Education & Achievements",
      content: `# Education
CVR College of Engineering
Bachelor of Technology, Computer Science
2023 - Present | Hyderabad
CGPA: 8.73/10.00

# Certifications
- Supervised Machine Learning & Neural Networks — DeepLearning.AI & Stanford University (Coursera)
- Web Technologies and Django — University of Michigan (Coursera)
- Diamond Certified Coder (Algorithms) — Smart Interviews

# Achievements
- Secured 3rd place out of 167 teams in DEMUX 2.0 National Hackathon (YZ BVRIT) through team leadership and strong coding skills.
- Won the Most Innovative Robot award among 50+ participants in a state-level robotic competition.`,
      date: "Yesterday, 2:00 PM",
    },
  ])

  const [selectedNoteId, setSelectedNoteId] = useState(1)
  const [editableContent, setEditableContent] = useState("")

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const handleNoteSelect = (id: number) => {
    setSelectedNoteId(id)
    const note = notes.find((n) => n.id === id)
    if (note) {
      setEditableContent(note.content)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value)

    setNotes(
      notes.map((note) => {
        if (note.id === selectedNoteId) {
          return { ...note, content: e.target.value }
        }
        return note
      }),
    )
  }

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const selectedBg = isDarkMode ? "bg-gray-700" : "bg-gray-300"

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className={`p-3 border-b ${borderColor} flex justify-between items-center`}>
          <h2 className="font-medium">Notes</h2>
          <button className={`w-6 h-6 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-300"} flex items-center justify-center ${textColor}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 cursor-pointer ${selectedNoteId === note.id ? selectedBg : hoverBg}`}
              onClick={() => handleNoteSelect(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{note.date}</p>
              <p className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {note.content.split("\n")[0].replace(/^#+ /, "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Note content */}
      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <>
            <div className={`p-3 border-b ${borderColor}`}>
              <h2 className="font-medium">{selectedNote.title}</h2>
              <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{selectedNote.date}</p>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                className={`w-full h-full resize-none ${bgColor} ${textColor} focus:outline-none`}
                value={selectedNote.content}
                onChange={handleContentChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}