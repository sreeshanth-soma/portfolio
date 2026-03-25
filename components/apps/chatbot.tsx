"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"

interface ChatbotProps {
  isDarkMode?: boolean
}

interface Message {
  role: "user" | "assistant"
  content: string
}

const GrokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd">
    <path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815" />
  </svg>
)

function renderMessageContent(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s)]+)/g)
  return parts.map((part, i) => {
    const mdMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (mdMatch) {
      return (
        <a key={i} href={mdMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">
          {mdMatch[1]}
        </a>
      )
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#1d9bf0] hover:underline">
          {part.replace(/^https?:\/\/(www\.)?/, "")}
        </a>
      )
    }
    return part
  })
}

export default function Chatbot({ isDarkMode = true }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey — I know everything about Soma. Ask away." },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasConversation = messages.length > 1 // more than just the greeting

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: "user", content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Something went wrong. Try again." },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Check your connection." },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#131313] text-white">
      {/* Empty state — centered Grok branding */}
      {!hasConversation && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 select-none">
          <div className="text-white/90">
            <GrokIcon size={48} />
          </div>
          <span className="text-[28px] font-medium tracking-[-0.02em] text-white/90">
            Grok
          </span>
        </div>
      )}

      {/* Messages */}
      {hasConversation && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-[#252525] rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                      <p className="text-[14px] leading-relaxed text-white/95">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <GrokIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] leading-[1.7] text-white/90 whitespace-pre-wrap">
                        {renderMessageContent(msg.content)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <GrokIcon size={16} />
                </div>
                <div className="flex items-center gap-1.5 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-[pulse_1.4s_ease-in-out_infinite]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-[pulse_1.4s_ease-in-out_0.2s_infinite]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-[pulse_1.4s_ease-in-out_0.4s_infinite]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input area */}
      <div className={`px-4 pb-4 ${hasConversation ? "pt-2" : ""}`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 bg-[#1e1e1e] border border-[#333] rounded-full px-5 py-2.5 focus-within:border-[#555] transition-colors">
            <input
              ref={inputRef}
              type="text"
              placeholder="How can I help you today?"
              className="flex-1 bg-transparent text-[14px] text-white placeholder:text-[#666] outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-[#333] text-[#666] cursor-default"
              }`}
            >
              <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {!hasConversation && (
            <p className="text-center text-[12px] text-[#555] mt-3">
              Ask me anything about Soma
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
