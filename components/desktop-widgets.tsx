"use client"

import { useState, useEffect } from "react"
import { Cloud, Sun, MapPin, CalendarDays, Github, Linkedin, Mail, Globe } from "lucide-react"

interface DesktopWidgetsProps {
  isDarkMode: boolean
  time: Date
}

export default function DesktopWidgets({ isDarkMode, time }: DesktopWidgetsProps) {
  const [weather] = useState({ temp: 28, condition: "Sunny", high: 31, low: 18, city: "New Delhi" })

  const glassClass = isDarkMode
    ? "bg-black/30 backdrop-blur-[60px] backdrop-saturate-150 border border-white/15"
    : "bg-white/20 backdrop-blur-[60px] backdrop-saturate-150 border border-white/40"

  const textClass = isDarkMode ? "text-white" : "text-white"
  const subtextClass = isDarkMode ? "text-white/60" : "text-white/70"

  // Calendar data
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const currentDay = time.getDate()
  const currentMonth = time.getMonth()
  const currentYear = time.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  return (
    <div className="absolute top-12 left-5 flex flex-col gap-3 z-[5] pointer-events-auto">
      {/* Calendar Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[200px] shadow-lg`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-wide text-red-400`}>
              {time.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div className={`text-2xl font-bold ${textClass} leading-tight`}>
              {currentDay}
            </div>
          </div>
          <CalendarDays className={`w-5 h-5 ${subtextClass}`} />
        </div>
        <div className={`text-[10px] font-medium ${subtextClass} mb-2`}>
          {monthNames[currentMonth]} {currentYear}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {dayNames.map((d) => (
            <div key={d} className={`text-[9px] text-center font-medium ${subtextClass}`}>
              {d}
            </div>
          ))}
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`text-[9px] text-center py-0.5 rounded-full ${
                day === currentDay
                  ? "bg-red-500 text-white font-bold"
                  : day
                    ? `${textClass}`
                    : ""
              }`}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>

      {/* Weather Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[200px] shadow-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <div className={`flex items-center gap-1 ${subtextClass} text-[10px] font-medium`}>
              <MapPin className="w-2.5 h-2.5" />
              {weather.city}
            </div>
            <div className={`text-4xl font-light ${textClass} mt-1`}>
              {weather.temp}°
            </div>
            <div className={`text-[11px] ${subtextClass} mt-0.5`}>
              {weather.condition}
            </div>
            <div className={`text-[10px] ${subtextClass}`}>
              H:{weather.high}° L:{weather.low}°
            </div>
          </div>
          <Sun className={`w-10 h-10 text-yellow-400 mt-1`} />
        </div>
      </div>

      {/* Quick Links Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[200px] shadow-lg`}>
        <div className={`text-[10px] font-semibold uppercase tracking-wide ${subtextClass} mb-2.5`}>
          Quick Links
        </div>
        <div className="flex flex-col gap-2">
          {[
            { icon: Github, label: "GitHub", href: "https://github.com/sreeshanth-soma" },
            { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/sreeshanth-soma" },
            { icon: Mail, label: "Email", href: "mailto:sreeshanthsoma@gmail.com" },
            { icon: Globe, label: "Portfolio", href: "sreeshanthsoma.dev" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all hover:bg-white/10 ${textClass}`}
            >
              <link.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}