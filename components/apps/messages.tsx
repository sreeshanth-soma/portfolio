"use client"

import { useState } from "react"
import { Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react"

interface MessagesProps {
  isDarkMode?: boolean
}

export default function Messages({ isDarkMode = true }: MessagesProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const sendMessage = async () => {
    if (!name.trim() || !email.trim() || !message.trim() || status === "sending") return

    setStatus("sending")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, message: message.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("sent")
        setName("")
        setEmail("")
        setPhone("")
        setMessage("")
        // Reset after 4 seconds
        setTimeout(() => setStatus("idle"), 4000)
      } else {
        setStatus("error")
        setErrorMsg(data.error || "Failed to send message.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please try again.")
    }
  }

  const bgColor = isDarkMode ? "bg-[#1c1c1e]" : "bg-[#f2f2f7]"
  const cardBg = isDarkMode ? "bg-[#2c2c2e]" : "bg-white"
  const inputBg = isDarkMode ? "bg-[#3a3a3c]" : "bg-[#f2f2f7]"
  const textColor = isDarkMode ? "text-white" : "text-black"
  const subtextColor = isDarkMode ? "text-[#8e8e93]" : "text-[#6e6e73]"
  const borderColor = isDarkMode ? "border-[#3a3a3c]" : "border-[#d1d1d6]"

  return (
    <div className={`h-full flex flex-col ${bgColor}`}>
      {/* Header */}
      <div className={`flex items-center justify-center py-3 border-b ${borderColor}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${textColor}`}>Message Soma</p>
            <p className={`text-[10px] ${subtextColor}`}>Delivered via Discord</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto space-y-5">
          {/* Info bubble */}
          <div className="flex justify-start">
            <div className={`px-3 py-2 rounded-2xl rounded-bl-md text-sm ${cardBg} ${textColor} max-w-[85%]`}>
              Drop a message here and it&apos;ll land directly in Soma&apos;s inbox. He usually responds within a few hours.
            </div>
          </div>

          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <p className={`text-sm font-medium ${textColor}`}>Message sent!</p>
              <p className={`text-xs ${subtextColor}`}>Soma will get back to you soon.</p>
            </div>
          ) : (
            <>
              {/* Name input */}
              <div className="space-y-1.5">
                <label className={`text-xs font-medium ${subtextColor} px-1`}>Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full ${inputBg} ${textColor} rounded-xl px-4 py-2.5 text-sm outline-none border ${borderColor} focus:border-blue-500 transition-colors`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>

              {/* Email input */}
              <div className="space-y-1.5">
                <label className={`text-xs font-medium ${subtextColor} px-1`}>Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full ${inputBg} ${textColor} rounded-xl px-4 py-2.5 text-sm outline-none border ${borderColor} focus:border-blue-500 transition-colors`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>

              {/* Phone input (optional) */}
              <div className="space-y-1.5">
                <label className={`text-xs font-medium ${subtextColor} px-1`}>Phone <span className="text-[#555] text-[10px]">(optional)</span></label>
                <input
                  type="tel"
                  placeholder="+91 99999 99999"
                  className={`w-full ${inputBg} ${textColor} rounded-xl px-4 py-2.5 text-sm outline-none border ${borderColor} focus:border-blue-500 transition-colors`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>

              {/* Message input */}
              <div className="space-y-1.5">
                <label className={`text-xs font-medium ${subtextColor} px-1`}>Message</label>
                <textarea
                  placeholder="Hey Soma, I wanted to talk about..."
                  rows={4}
                  className={`w-full ${inputBg} ${textColor} rounded-xl px-4 py-2.5 text-sm outline-none border ${borderColor} focus:border-blue-500 transition-colors resize-none`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={status === "sending"}
                />
              </div>

              {/* Error message */}
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 text-xs px-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={!name.trim() || !email.trim() || !message.trim() || status === "sending"}
                className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  name.trim() && email.trim() && message.trim() && status !== "sending"
                    ? "bg-[#007aff] text-white hover:bg-[#0066d6] active:scale-[0.98]"
                    : isDarkMode
                      ? "bg-[#3a3a3c] text-[#8e8e93] cursor-not-allowed"
                      : "bg-[#d1d1d6] text-[#8e8e93] cursor-not-allowed"
                }`}
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
