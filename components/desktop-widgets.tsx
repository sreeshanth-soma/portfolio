"use client"

import { useState } from "react"
import { Sun, MapPin, Github, Linkedin, Mail, Globe } from "lucide-react"

interface DesktopWidgetsProps {
  isDarkMode: boolean
  time: Date
}

// Pre-compute static tick marks once — never re-rendered
const TICK_MARKS = Array.from({ length: 60 }).map((_, i) => {
  const angle = (i * 6 - 90) * (Math.PI / 180)
  const isMajor = i % 5 === 0
  const outerR = 46
  const innerR = isMajor ? 40 : 43
  return { x1: 50 + Math.cos(angle) * innerR, y1: 50 + Math.sin(angle) * innerR, x2: 50 + Math.cos(angle) * outerR, y2: 50 + Math.sin(angle) * outerR, isMajor }
})

export default function DesktopWidgets({ isDarkMode, time }: DesktopWidgetsProps) {
  const [weather] = useState({ temp: 28, condition: "Sunny", high: 31, low: 18, city: "Hyderabad" })

  const glassClass = isDarkMode
    ? "bg-black/30 backdrop-blur-[60px] backdrop-saturate-150 border border-white/15"
    : "bg-white/20 backdrop-blur-[60px] backdrop-saturate-150 border border-white/40"

  const textClass = "text-white"
  const subtextClass = isDarkMode ? "text-white/60" : "text-white/70"

  const hours = time.getHours()
  const minutes = time.getMinutes()

  // Calendar data — memoized so it only recalculates when the date changes
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
  const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentDay = time.getDate()
  const currentMonth = time.getMonth()
  const currentYear = time.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)

  const weekdayShort = time.toLocaleDateString("en-US", { weekday: "short" })
  const monthShort = monthNamesShort[currentMonth]

  return (
    <div className="absolute top-12 left-5 flex flex-col gap-3 z-[5] pointer-events-auto">
      {/* Identity Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[310px] shadow-lg`}>
        <div className="flex items-center gap-3">
          <img src="/letter-s.png" alt="Soma" className="w-11 h-11 rounded-full ring-1 ring-white/20" />
          <div>
            <h2 className={`text-[13px] font-semibold ${textClass} leading-tight`}>Sreeshanth Soma</h2>
            <p className={`text-[11px] ${subtextClass} leading-tight mt-0.5`}>AI & Backend Developer</p>
          </div>
        </div>
        <p className={`text-[10px] ${subtextClass} mt-2.5 leading-relaxed`}>
          Building AI systems & backend infra at Saryps Labs. Open-source contributor at OpenBroadcaster. CS undergrad, CVR College.
        </p>
      </div>

      {/* Row: Clock + Calendar side by side */}
      <div className="flex gap-3">
        {/* Clock Widget — macOS digital style with tick border */}
        <div className="w-[150px] h-[150px] bg-white rounded-[28px] shadow-lg flex items-center justify-center relative overflow-hidden">
          {/* Tick marks around the border */}
          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
            {TICK_MARKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#c0c0c0" strokeWidth={t.isMajor ? 1.5 : 0.5} strokeLinecap="round" />
            ))}
          </svg>
          {/* Digital time */}
          <span className="relative text-[52px] font-black text-[#1a1a1a] leading-none" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-3px" }}>
            {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
          </span>
        </div>

        {/* Calendar Widget — macOS Sonoma style */}
        <div className="w-[150px] h-[150px] bg-[#2a2a2e] rounded-[28px] shadow-lg flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-red-500 text-[22px] font-bold leading-none">{weekdayShort}</span>
            <span className="text-white/60 text-[22px] font-medium leading-none">{monthShort}</span>
          </div>
          <div className="text-white text-[64px] font-bold leading-none tracking-tight">
            {currentDay}
          </div>
        </div>
      </div>

      {/* Full Calendar Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[310px] shadow-lg`}>
        <div className={`text-[11px] font-semibold ${subtextClass} mb-2`}>
          {monthShort} {currentYear}
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
                    ? textClass
                    : ""
              }`}
            >
              {day || ""}
            </div>
          ))}
        </div>
      </div>

      {/* Weather Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[310px] shadow-lg`}>
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
          <Sun className="w-10 h-10 text-yellow-400 mt-1" />
        </div>
      </div>

      {/* Quick Links Widget */}
      <div className={`${glassClass} rounded-2xl p-4 w-[310px] shadow-lg`}>
        <div className={`text-[10px] font-semibold uppercase tracking-wide ${subtextClass} mb-2.5`}>
          Quick Links
        </div>
        <div className="flex flex-col gap-2">
          {[
            { icon: Github, label: "GitHub", href: "https://github.com/sreeshanth-soma" },
            { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/sreeshanth-soma" },
            { icon: Mail, label: "Email", href: "mailto:sreeshanthsoma@gmail.com" },
            { icon: Globe, label: "Portfolio", href: "https://sreeshanthsoma.live" },
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
